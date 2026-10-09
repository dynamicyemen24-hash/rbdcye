interface ApiOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultOptions: ApiOptions;

  constructor(baseUrl: string, options: ApiOptions = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      retries: 3,
      retryDelay: 1000,
      timeout: 10000,
      ...options,
    };
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async retryFetch(
    url: string,
    options: RequestInit,
    retries: number,
    retryDelay: number,
    timeout: number
  ): Promise<Response> {
    const method = (options.method ?? "GET").toUpperCase();
    // Never automatically replay mutations: a lost response does not mean a POST
    // failed, and replaying it can duplicate donations or payment intents.
    const retryable = ["GET", "HEAD", "OPTIONS"].includes(method);
    const maxAttempts = retryable ? Math.max(0, retries) : 0;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options, timeout);

        if (retryable && !response.ok && response.status >= 500 && attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          continue;
        }

        return response;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * 2 ** attempt));
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const {
      retries = 3,
      retryDelay = 1000,
      timeout = 10000,
      ...fetchOptions
    } = { ...this.defaultOptions, ...options };

    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.retryFetch(url, fetchOptions, retries, retryDelay, timeout);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error((error as { error?: string }).error || `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient("/api");
export default apiClient;
