// Error Handling Utilities - أدوات معالجة الأخطاء الموحدة
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Create a standardized API error
export function createApiError(
  message: string,
  status?: number,
  code?: string,
  details?: any
): ApiError {
  return {
    message,
    status,
    code: code || status?.toString() || "UNKNOWN_ERROR",
    details,
  };
}

// Handle API response errors
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw createApiError(
      errorData.message || `HTTP Error ${response.status}`,
      response.status,
      errorData.code
    );
  }
  return response.json();
}

// Retry with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Operation failed after retries");
}

// Log error for monitoring
export function logError(error: Error | ApiError, context?: string) {
  const errorInfo = {
    message: error.message,
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  // Send to monitoring service if available
  if (typeof console !== "undefined") {
    console.error("[Error]", errorInfo);
  }
}

// Get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "حدث خطأ غير متوقع";
}
