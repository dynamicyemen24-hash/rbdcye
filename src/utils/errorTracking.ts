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

    if (import.meta.env.PROD) {
      console.error('[ErrorTracking]', error, context);
      // يمكن إضافة إرسال لـ Sentry / LogRocket هنا
      // Sentry.captureException(error, { extra: context });
    }

    this.persist();
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (import.meta.env.DEV) console.log(`[${level.toUpperCase()}]`, message);
  }

  private persist() {
    try {
      localStorage.setItem(
        'error_log',
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
    localStorage.removeItem('error_log');
  }
}

export const errorTracker = ErrorTrackingService.getInstance();

