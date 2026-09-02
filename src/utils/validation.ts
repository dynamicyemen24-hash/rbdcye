// Advanced validation engine without external dependencies
export class Validator {
  private rules: Map<string, ValidationRule[]> = new Map();
  private errors: Map<string, string[]> = new Map();

  static getInstance(): Validator {
    return new Validator();
  }

  addRule(field: string, rule: ValidationRule) {
    const rules = this.rules.get(field) || [];
    rules.push(rule);
    this.rules.set(field, rules);
    return this;
  }

  validate(data: Record<string, unknown>): ValidationResult {
    this.errors.clear();
    
    for (const [field, rules] of this.rules) {
      const value = data[field];
      const fieldErrors: string[] = [];

      for (const rule of rules) {
        const error = rule.check(value, data);
        if (error) {
          fieldErrors.push(error);
        }
      }

      if (fieldErrors.length > 0) {
        this.errors.set(field, fieldErrors);
      }
    }

    return {
      isValid: this.errors.size === 0,
      errors: Object.fromEntries(this.errors),
    };
  }

  clear() {
    this.rules.clear();
    this.errors.clear();
  }
}

export interface ValidationRule {
  check(value: unknown, data: Record<string, unknown>): string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Pre-built rules
export const Rules = {
  required: (message = 'هذا الحقل مطلوب'): ValidationRule => ({
    check: (value) => {
      if (value === undefined || value === null || value === '') {
        return message;
      }
      return null;
    },
  }),

  email: (message = 'البريد الإلكتروني غير صحيح'): ValidationRule => ({
    check: (value) => {
      if (!value || typeof value !== 'string') return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : message;
    },
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    check: (value) => {
      if (!value || typeof value !== 'string') return null;
      return value.length >= min ? null : (message || `يجب أن يكون ${min} أحرف على الأقل`);
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    check: (value) => {
      if (!value || typeof value !== 'string') return null;
      return value.length <= max ? null : (message || `يجب أن يكون ${max} أحرف على الأكثر`);
    },
  }),

  pattern: (regex: RegExp, message = 'صيغة غير صحيحة'): ValidationRule => ({
    check: (value) => {
      if (!value || typeof value !== 'string') return null;
      return regex.test(value) ? null : message;
    },
  }),

  arabicOnly: (message = 'يجب أن يحتوي على أحرف عربية فقط'): ValidationRule => ({
    check: (value) => {
      if (!value || typeof value !== 'string') return null;
      const arabicRegex = /^[\u0600-\u06FF\s]+$/;
      return arabicRegex.test(value) ? null : message;
    },
  }),

  phone: (message = 'رقم هاتف غير صحيح'): ValidationRule => ({
    check: (value) => {
      if (!value || typeof value !== 'string') return null;
      const phoneRegex = /^(\+968|00968)?[0-9]{8}$/;
      return phoneRegex.test(value) ? null : message;
    },
  }),

  number: (message = 'يجب أن يكون رقماً'): ValidationRule => ({
    check: (value) => {
      if (value === undefined || value === null) return null;
      return !isNaN(Number(value)) ? null : message;
    },
  }),

  min: (min: number, message?: string): ValidationRule => ({
    check: (value) => {
      if (value === undefined || value === null) return null;
      const num = Number(value);
      return num >= min ? null : (message || `يجب أن يكون ${min} على الأقل`);
    },
  }),

  max: (max: number, message?: string): ValidationRule => ({
    check: (value) => {
      if (value === undefined || value === null) return null;
      const num = Number(value);
      return num <= max ? null : (message || `يجب أن يكون ${max} على الأكثر`);
    },
  }),

  confirmed: (matchField: string, message = 'لا يتطابق مع الحقل المطلوب'): ValidationRule => ({
    check: (value, data) => {
      if (!value) return null;
      return value === data[matchField] ? null : message;
    },
  }),

  custom: (fn: (value: unknown, data: Record<string, unknown>) => string | null): ValidationRule => ({
    check: (value, data) => fn(value, data),
  }),
};

// Form validator helper
export class FormValidator {
  private validator = Validator.getInstance();

  validateForm(schema: Record<string, ValidationRule[]>, data: Record<string, unknown>) {
    this.validator.clear();
    
    for (const [field, rules] of Object.entries(schema)) {
      for (const rule of rules) {
        this.validator.addRule(field, rule);
      }
    }

    return this.validator.validate(data);
  }
}

export const formValidator = new FormValidator();

