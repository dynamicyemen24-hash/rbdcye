export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT: "TIMEOUT",
} as const;

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    if (error.message.includes("fetch") || error.message.includes("Network")) {
      return new AppError(ErrorCodes.NETWORK_ERROR, "فشل الاتصال بالخادم", 503);
    }
    return new AppError(ErrorCodes.SERVER_ERROR, error.message, 500);
  }
  return new AppError(ErrorCodes.SERVER_ERROR, "حدث خطأ غير متوقع", 500);
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

export const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.code) {
    case ErrorCodes.NETWORK_ERROR:
      return "تأكد من اتصالك بالإنترنت وحاول مرة أخرى";
    case ErrorCodes.NOT_FOUND:
      return "العنصر المطلوب غير موجود";
    case ErrorCodes.UNAUTHORIZED:
      return "يرجى تسجيل الدخول للمتابعة";
    case ErrorCodes.FORBIDDEN:
      return "ليس لديك صلاحية الوصول لهذا المحتوى";
    case ErrorCodes.TIMEOUT:
      return "انتهت مهلة الطلب، يرجى المحاولة مرة أخرى";
    default:
      return "حدث خطأ ما، يرجى المحاولة لاحقاً";
  }
};
