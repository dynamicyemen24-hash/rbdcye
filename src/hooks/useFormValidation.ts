// Form Validation Hook - Professional Form Handling
// Lightweight Validation Without External Dependencies

import { useState, useCallback } from 'react';

type Validator = (value: any) => string | undefined;

interface FieldConfig {
  validators: Validator[];
}

interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string>;
  data: T | null;
}

export function useFormValidation<T extends Record<string, any>>(
  schema: Record<keyof T, FieldConfig>,
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((values: T): ValidationResult<T> => {
    const fieldErrors: Record<string, string> = {};
    
    for (const field in schema) {
      const value = values[field];
      const config = schema[field];
      
      for (const validator of config.validators) {
        const error = validator(value);
        if (error) {
          fieldErrors[field] = error;
          break;
        }
      }
    }

    const isValid = Object.keys(fieldErrors).length === 0;
    return { isValid, errors: fieldErrors, data: isValid ? values : null };
  }, [schema]);

  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      
      if (touched[field as string]) {
        const result = validate({ ...data, [field]: value } as T);
        if (!result.isValid) {
          setErrors((prev) => ({ ...prev, [field]: result.errors[field as string] || '' }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
          });
        }
      }
    },
    [data, touched, validate]
  );

  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<void> | void) => {
      const result = validate(data);
      
      if (result.isValid && result.data) {
        await onSubmit(result.data);
        return { success: true };
      } else {
        setErrors(result.errors);
        setTouched(
          Object.keys(data).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {} as Record<string, boolean>
          )
        );
        return { success: false, errors: result.errors };
      }
    },
    [data, validate]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    handleChange,
    handleSubmit,
    reset,
    validate,
  };
}

// Pre-defined validators
export const validators = {
  required: (message = 'هذا الحقل مطلوب'): Validator => (value) => 
    !value || (typeof value === 'string' && !value.trim()) ? message : undefined,
  
  email: (message = 'البريد الإلكتروني غير صالح'): Validator => (value) =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? message : undefined,
  
  minLength: (length: number, message?: string): Validator => (value) =>
    value && typeof value === 'string' && value.length < length 
      ? (message || `يجب أن يكون ${length} أحرف على الأقل`) 
      : undefined,
  
  number: (message = 'يجب إدخال رقماً'): Validator => (value) =>
    value !== undefined && value !== null && isNaN(Number(value)) ? message : undefined,
  
  min: (minValue: number, message?: string): Validator => (value) =>
    value !== undefined && value !== null && Number(value) < minValue 
      ? (message || `يجب أن يكون أكبر من ${minValue}`) 
      : undefined,
};

// Pre-defined schemas
export const contactFormSchema = {
  name: { validators: [validators.required('الاسم مطلوب'), validators.minLength(2)] },
  email: { validators: [validators.required(), validators.email()] },
  phone: { validators: [] },
  subject: { validators: [validators.required('الموضوع مطلوب'), validators.minLength(5)] },
  message: { validators: [validators.required('الرسالة مطلوبة'), validators.minLength(10)] },
};

export const donationFormSchema = {
  donor: { validators: [validators.required('اسم المتبرع مطلوب'), validators.minLength(2)] },
  email: { validators: [validators.required(), validators.email()] },
  phone: { validators: [] },
  amount: { validators: [validators.required(), validators.number(), validators.min(1, 'المبلغ يجب أن يكون أكبر من 0')] },
  project: { validators: [] },
  type: { validators: [validators.required()] },
};

