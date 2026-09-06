// ============================================================
// env-validation.ts - التحقق من متغيرات البيئة
// ============================================================

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_API_BASE_URL?: string;
  VITE_APP_URL?: string;
  VITE_ENV: "development" | "staging" | "production";
}

const REQUIRED_VARS: (keyof EnvConfig)[] = [];

const RECOMMENDED_VARS: (keyof EnvConfig)[] = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

const OPTIONAL_VARS: (keyof EnvConfig)[] = ["VITE_API_BASE_URL", "VITE_APP_URL", "VITE_ENV"];

class EnvValidator {
  private validated = false;
  private config: Partial<EnvConfig> = {};

  // التحقق من جميع المتغيرات المطلوبة
  validate(): EnvConfig {
    if (this.validated && Object.keys(this.config).length > 0) {
      return this.config as EnvConfig;
    }

    const errors: string[] = [];
    const config: Partial<Record<keyof EnvConfig, string>> = {};

    // فحص المتغيرات المطلوبة
    for (const key of REQUIRED_VARS) {
      const value = import.meta.env[key];

      if (!value) {
        errors.push(`المتغير المطلوب ${key} غير موجود في متغيرات البيئة`);
      } else if (!this.isValidUrl(value) && !key.includes("KEY")) {
        errors.push(`${key} ليس URL صالح: ${value}`);
      } else {
        config[key] = value;
      }
    }

    const warnings: string[] = [];
    for (const key of RECOMMENDED_VARS) {
      const value = import.meta.env[key];
      if (!value) {
        warnings.push(
          `المتغير ${key} غير مضبوط؛ سيتم استخدام المحتوى الافتراضي والتخزين المحلي كاحتياط.`
        );
      } else if (!this.isValidUrl(value) && !key.includes("KEY")) {
        warnings.push(`${key} ليس URL صالحاً: ${value}`);
      } else {
        config[key] = value;
      }
    }

    // فحص المتغيرات الاختيارية
    for (const key of OPTIONAL_VARS) {
      const value = import.meta.env[key];
      if (value) {
        config[key] = value;
      }
    }

    // فحص إضافي لـ Supabase
    if (config.VITE_SUPABASE_URL && !config.VITE_SUPABASE_URL.includes("supabase.co")) {
      errors.push("VITE_SUPABASE_URL لا يبدو وكأنه رابط Supabase صحيح");
    }

    if (config.VITE_SUPABASE_ANON_KEY && !config.VITE_SUPABASE_ANON_KEY.startsWith("eyJ")) {
      errors.push("VITE_SUPABASE_ANON_KEY لا يبدو وكأنه JWT token صحيح");
    }

    if (warnings.length > 0) {
      // Environment setup warnings exist but are non-critical
    }

    if (errors.length > 0) {
      console.error("❌ أخطاء في متغيرات البيئة:");
      errors.forEach((err) => console.error(`  - ${err}`));

      throw new Error("فشل التحقق من متغيرات البيئة:\n" + errors.join("\n"));
    }

    this.config = config as EnvConfig;
    this.validated = true;

    if (import.meta.env.DEV) console.log("✅ تم التحقق من متغيرات البيئة بنجاح");
    return config as EnvConfig;
  }

  // التحقق من URL صالح
  private isValidUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return str.startsWith("http://") || str.startsWith("https://");
    }
  }

  // الحصول على قيمة متغير
  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] | undefined {
    return this.config[key] as EnvConfig[K] | undefined;
  }

  // فحص إذا كنا في وضع الإنتاج
  isProduction(): boolean {
    return this.config.VITE_ENV === "production" || import.meta.env.PROD;
  }

  // فحص إذا كنا في وضع التطوير
  isDevelopment(): boolean {
    return this.config.VITE_ENV === "development" || import.meta.env.DEV;
  }
}

// تصدير instance واحد
export const envValidator = new EnvValidator();

// التحقق التلقائي عند تحميل الملف
if (typeof window !== "undefined") {
  // في المتصفح فقط
  try {
    envValidator.validate();
  } catch (e) {
    // تجاهل في حال لم يتم استدعاء validate() بشكل صريح
  }
}

export default envValidator;
