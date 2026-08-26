// ============================================================
// monitoring.ts - نظام المراقبة والتسجيل
// ============================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private static LOG_PREFIX = '[rbdcye]';
  private static STORAGE_KEY = 'app_logs';
  private static MAX_LOGS = 100;

  // تنسيق الرسالة
  private format(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: `${Logger.LOG_PREFIX} ${message}`,
      data,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  // الحصول على معرف المستخدم
  private getUserId(): string | undefined {
    try {
      const user = localStorage.getItem('auth_user');
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.id;
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  // الحصول على معرف الجلسة
  private getSessionId(): string | undefined {
    try {
      let sessionId = sessionStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  // حفظ السجل في التخزين المحلي
  private persist(entry: LogEntry) {
    try {
      const logs = this.getLogs();
      logs.push(entry);
      
      // الاحتفاظ بآخر 100 سجل فقط
      if (logs.length > Logger.MAX_LOGS) {
        logs.splice(0, logs.length - Logger.MAX_LOGS);
      }

      localStorage.setItem(Logger.STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // تجاهل أخطاء التخزين
    }
  }

  // الحصول على السجلات
  private getLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem(Logger.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  // مسح السجلات
  clearLogs() {
    try {
      localStorage.removeItem(Logger.STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }

  // --- مستويات السجل ---

  debug(message: string, data?: any) {
    const entry = this.format('debug', message, data);
    console.debug(entry);
    // لا نحفظ debug في التخزين المحلي
  }

  info(message: string, data?: any) {
    const entry = this.format('info', message, data);
    console.log(entry);
    this.persist(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.format('warn', message, data);
    this.persist(entry);
  }

  error(message: string, error?: Error | unknown, data?: any) {
    const entry = this.format('error', message, {
      ...data,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    });
    console.error(entry);
    this.persist(entry);

    // إرسال لخدمة المراقبة الخارجية (Sentry, etc.)
    this.sendToExternalService(entry);
  }

  fatal(message: string, error?: Error | unknown, data?: any) {
    const entry = this.format('fatal', message, {
      ...data,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    });
    console.error(entry);
    this.persist(entry);

    // إرسال فوري لخدمة المراقبة
    this.sendToExternalService(entry, true);
  }

  // --- إرسال لخدمة خارجية ---
  private async sendToExternalService(entry: LogEntry, isFatal: boolean = false) {
    // يمكن إضافة Sentry هنا
    // يمكن إضافة LogRocket هنا
    // يمكن إضافة خدمة مخصصة هنا
    
    // مثال: إرسال لـ Sentry
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(new Error(entry.message), {
    //     level: entry.level,
    //     extra: entry.data,
    //   });
    // }

    // أو إرسال لـ API مخصص
    if (isFatal && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      navigator.sendBeacon('/api/logs', JSON.stringify(entry));
    }
  }

  // --- أدوات مساعدة ---

  // قياس الأداء
  measure<T>(label: string, fn: () => T | Promise<T>): T | Promise<T> {
    const start = performance.now();
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
        });
      }
      
      const duration = performance.now() - start;
      this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`Error in ${label}`, error as Error, { duration: `${duration.toFixed(2)}ms` });
      throw error;
    }
  }

  // تتبع المسار (Breadcrumbs)
  leaveBreadcrumb(category: string, message: string, data?: any) {
    this.debug(`[Breadcrumb] ${category}: ${message}`, data);
  }

  // تعيين سياق المستخدم
  setUserContext(userId: string, email: string, role: string) {
    try {
      sessionStorage.setItem('user_context', JSON.stringify({
        userId,
        email,
        role,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // Ignore errors
    }
  }

  // مسح سياق المستخدم
  clearUserContext() {
    try {
      sessionStorage.removeItem('user_context');
    } catch {
      // Ignore errors
    }
  }
}

// تصدير instance واحد (Singleton)
export const logger = new Logger();

// تصدير أنواع
export type { LogLevel, LogEntry };