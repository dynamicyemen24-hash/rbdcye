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
    retryDelay: number
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          url,
          options,
          this.defaultOptions.timeout!
        );

        if (!response.ok && response.status >= 500 && attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempt))
          );
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { retries, retryDelay, timeout, ...fetchOptions } = {
      ...this.defaultOptions,
      ...options,
    };

    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.retryFetch(
      url,
      fetchOptions,
      retries!,
      retryDelay!
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Request failed' }));
      throw new Error(
        (error as { error?: string }).error || `HTTP ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: ApiOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient('/api');
export default apiClient;
