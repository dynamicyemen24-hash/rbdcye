// Form Validation Hook - Enterprise-grade validation without external dependencies
import { useState, useCallback, useEffect } from "react";

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: string;
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    pattern?: { regex: RegExp; message: string };
    email?: string;
    phone?: string;
    url?: string;
    custom?: (value: T[K]) => string | undefined;
  };
};

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

interface UseFormValidationOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => Promise<void> | void;
  sanitize?: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  sanitize = true,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Reset form when initialValues change
  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  const sanitizeValue = useCallback((value: any): any => {
    if (value === null || value === undefined) return value;

    if (typeof value === "string") {
      // Remove HTML tags and dangerous characters
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
        .replace(/javascript\s*:/gi, "")
        .trim();
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    return value;
  }, []);

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const rules = validationRules[name];
      if (!rules) return undefined;

      const stringValue = String(value || "").trim();

      // Required check
      if (rules.required && (!stringValue || stringValue.length === 0)) {
        return rules.required;
      }

      if (!stringValue) return undefined;

      // Min length
      if (rules.min && stringValue.length < rules.min.value) {
        return rules.min.message;
      }

      // Max length
      if (rules.max && stringValue.length > rules.max.value) {
        return rules.max.message;
      }

      // Pattern check
      if (rules.pattern && !rules.pattern.regex.test(stringValue)) {
        return rules.pattern.message;
      }

      // Email check
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          return rules.email;
        }
      }

      // Phone check
      if (rules.phone) {
        const phoneRegex = /^\+?[\d]{7,15}$/;
        const cleaned = stringValue.replace(/[^\d+]/g, "");
        if (!phoneRegex.test(cleaned)) {
          return rules.phone;
        }
      }

      // URL check
      if (rules.url) {
        try {
          new URL(stringValue);
        } catch {
          return rules.url;
        }
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return undefined;
    },
    [validationRules]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      )
    );
    return isValid;
  }, [values, validateField]);

  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      const sanitizedValue = sanitize ? sanitizeValue(value) : value;
      setValues((prev) => ({ ...prev, [name]: sanitizedValue }));
      setIsDirty(true);

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors, sanitize, sanitizeValue]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateField, values]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateAll()) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        await onSubmit(values);
        setSubmitSuccess(true);
        setTimeout(() => {
          setValues(initialValues);
          setTouched({});
          setIsDirty(false);
          setSubmitSuccess(false);
        }, 3000);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit, initialValues]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      const sanitizedValue = sanitize ? sanitizeValue(value) : value;
      setValues((prev) => ({ ...prev, [name]: sanitizedValue }));
      setIsDirty(true);
    },
    [sanitize, sanitizeValue]
  );

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name] || "",
      onChange: (value: T[keyof T]) => handleChange(name, value),
      onBlur: () => handleBlur(name),
      error: touched[name] ? errors[name] : undefined,
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    validateField,
    getFieldProps,
    sanitizeValue,
  };
}

// Common validation presets
export const validationPresets = {
  contact: {
    name: {
      required: "الاسم مطلوب",
      min: { value: 2, message: "الاسم يجب أن يكون حرفين على الأقل" },
      max: { value: 100, message: "الاسم طويل جداً" },
    },
    email: {
      required: "البريد الإلكتروني مطلوب",
      email: "البريد الإلكتروني غير صحيح",
    },
    phone: {
      phone: "رقم الهاتف غير صحيح",
    },
    message: {
      required: "الرسالة مطلوبة",
      min: { value: 10, message: "الرسالة قصيرة جداً" },
      max: { value: 1000, message: "الرسالة طويلة جداً" },
    },
  },
  donation: {
    donorName: {
      required: "الاسم مطلوب",
      min: { value: 2, message: "الاسم يجب أن يكون حرفين على الأقل" },
    },
    donorEmail: {
      required: "البريد الإلكتروني مطلوب",
      email: "البريد الإلكتروني غير صحيح",
    },
    amount: {
      required: "المبلغ مطلوب",
      custom: (value: number) => {
        if (value < 1) return "المبلغ يجب أن يكون أكبر من صفر";
        if (value > 100000) return "المبلغ يتجاوز الحد الأقصى";
        return undefined;
      },
    },
  },
  volunteer: {
    name: {
      required: "الاسم مطلوب",
      min: { value: 2, message: "الاسم يجب أن يكون حرفين على الأقل" },
    },
    email: {
      required: "البريد الإلكتروني مطلوب",
      email: "البريد الإلكتروني غير صحيح",
    },
    phone: {
      required: "رقم الهاتف مطلوب",
      phone: "رقم الهاتف غير صحيح",
    },
    field: {
      required: "مجال التطوع مطلوب",
    },
    motivation: {
      required: "سبب التطوع مطلوب",
      min: { value: 20, message: "يرجى كتابة سبب أكثر تفصيلاً" },
    },
  },
};

export function validateFieldValue<T>(value: T, rules: any): string | undefined {
  if (!rules) return undefined;

  const stringValue = String(value || "").trim();

  if (rules.required && !stringValue) {
    return rules.required;
  }

  if (!stringValue) return undefined;

  if (rules.min && stringValue.length < rules.min.value) {
    return rules.min.message;
  }

  if (rules.max && stringValue.length > rules.max.value) {
    return rules.max.message;
  }

  if (rules.pattern && !rules.pattern.regex.test(stringValue)) {
    return rules.pattern.message;
  }

  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return rules.email;
    }
  }

  if (rules.phone) {
    const phoneRegex = /^\+?[\d]{7,15}$/;
    const cleaned = stringValue.replace(/[^\d+]/g, "");
    if (!phoneRegex.test(cleaned)) {
      return rules.phone;
    }
  }

  if (rules.url) {
    try {
      new URL(stringValue);
    } catch {
      return rules.url;
    }
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return undefined;
}
