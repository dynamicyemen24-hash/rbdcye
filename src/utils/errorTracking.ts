class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private errors: Array<{
    error: Error;
    context?: Record<string, unknown>;
    timestamp: number;
  }> = [];

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    this.errors.push({
      error,
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    });

    this.persist();
  }

  captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
    // Message logged silently
  }

  private persist() {
    try {
      localStorage.setItem(
        "error_log",
        JSON.stringify(this.errors.slice(-50)) // نحتفظ بآخر 50 خطأ فقط
      );
    } catch {
      // تجاهل أخطاء التخزين
    }
  }

  getErrors() {
    return this.errors;
  }

  clear() {
    this.errors = [];
    localStorage.removeItem("error_log");
  }
}

export const errorTracker = ErrorTrackingService.getInstance();
