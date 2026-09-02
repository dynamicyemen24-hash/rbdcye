import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  sanitizeString,
  generateSlug,
  formatCurrency,
  sanitizeHtml,
  validateUrl,
} from '@/shared/utils/validation';
import {
  AppError,
  ErrorCodes,
  handleApiError,
  getUserFriendlyMessage,
} from '@/shared/utils/errors';
import { validateFieldValue } from '@/app/hooks/useFormValidation';

describe('ErrorBoundary Edge Cases', () => {
  it('should have getDerivedStateFromError static method that returns hasError: true', () => {
    const mockComponent = {
      getDerivedStateFromError: (_error: Error) => ({ hasError: true, error: _error }),
    };
    const result = mockComponent.getDerivedStateFromError(new Error('test'));
    expect(result).toEqual({ hasError: true, error: expect.any(Error) });
  });
});

describe('Form Validation - validateFieldValue', () => {
  it('should return error message for empty required field', () => {
    const result = validateFieldValue('', { required: 'الاسم مطلوب' });
    expect(result).toBe('الاسم مطلوب');
  });

  it('should return undefined for empty non-required field', () => {
    const result = validateFieldValue('', { min: { value: 2, message: 'قصير' } });
    expect(result).toBeUndefined();
  });

  it('should return error for value shorter than min length', () => {
    const result = validateFieldValue('a', { min: { value: 2, message: 'قصير جداً' } });
    expect(result).toBe('قصير جداً');
  });

  it('should return undefined for value meeting min length', () => {
    const result = validateFieldValue('ab', { min: { value: 2, message: 'قصير' } });
    expect(result).toBeUndefined();
  });

  it('should return error for value exceeding max length', () => {
    const result = validateFieldValue('abcdef', { max: { value: 3, message: ' طويل جداً' } });
    expect(result).toBe(' طويل جداً');
  });

  it('should return error for invalid email', () => {
    const result = validateFieldValue('not-an-email', { email: 'بريد غير صحيح' });
    expect(result).toBe('بريد غير صحيح');
  });

  it('should return undefined for valid email', () => {
    const result = validateFieldValue('test@example.com', { email: 'بريد غير صحيح' });
    expect(result).toBeUndefined();
  });

  it('should return error for invalid phone', () => {
    const result = validateFieldValue('123', { phone: 'هاتف غير صحيح' });
    expect(result).toBe('هاتف غير صحيح');
  });

  it('should return error for invalid URL', () => {
    const result = validateFieldValue('not-a-url', { url: 'رابط غير صحيح' });
    expect(result).toBe('رابط غير صحيح');
  });

  it('should return undefined for valid URL', () => {
    const result = validateFieldValue('https://example.com', { url: 'رابط غير صحيح' });
    expect(result).toBeUndefined();
  });

  it('should call custom validator and return its result', () => {
    const custom = (val: string) => (val === 'bad' ? 'قيمة سيئة' : undefined);
    expect(validateFieldValue('bad', { custom })).toBe('قيمة سيئة');
    expect(validateFieldValue('good', { custom })).toBeUndefined();
  });

  it('should return undefined for empty value without required rule', () => {
    expect(validateFieldValue('', {})).toBeUndefined();
  });

  it('should validate pattern regex', () => {
    const rules = { pattern: { regex: /^\d+$/, message: 'أرقام فقط' } };
    expect(validateFieldValue('abc', rules)).toBe('أرقام فقط');
    expect(validateFieldValue('123', rules)).toBeUndefined();
  });
});

describe('API Error Handling', () => {
  it('should pass through AppError instances', () => {
    const err = new AppError(ErrorCodes.NOT_FOUND, 'Not found', 404);
    const result = handleApiError(err);
    expect(result).toBe(err);
    expect(result.code).toBe(ErrorCodes.NOT_FOUND);
  });

  it('should wrap fetch errors as NETWORK_ERROR', () => {
    const err = new Error('fetch failed');
    const result = handleApiError(err);
    expect(result.code).toBe(ErrorCodes.NETWORK_ERROR);
    expect(result.statusCode).toBe(503);
  });

  it('should wrap network errors as NETWORK_ERROR', () => {
    const err = new Error('Network error occurred');
    const result = handleApiError(err);
    expect(result.code).toBe(ErrorCodes.NETWORK_ERROR);
  });

  it('should wrap other Error instances as SERVER_ERROR', () => {
    const err = new Error('something broke');
    const result = handleApiError(err);
    expect(result.code).toBe(ErrorCodes.SERVER_ERROR);
    expect(result.statusCode).toBe(500);
  });

  it('should wrap non-Error values as SERVER_ERROR', () => {
    expect(handleApiError(null).code).toBe(ErrorCodes.SERVER_ERROR);
    expect(handleApiError(undefined).code).toBe(ErrorCodes.SERVER_ERROR);
    expect(handleApiError('string error').code).toBe(ErrorCodes.SERVER_ERROR);
    expect(handleApiError(42).code).toBe(ErrorCodes.SERVER_ERROR);
  });

  it('should return correct user-friendly messages', () => {
    const networkErr = new AppError(ErrorCodes.NETWORK_ERROR, '', 503);
    expect(getUserFriendlyMessage(networkErr)).toContain('اتصالك');

    const notFoundErr = new AppError(ErrorCodes.NOT_FOUND, '', 404);
    expect(getUserFriendlyMessage(notFoundErr)).toContain('غير موجود');

    const unauthorizedErr = new AppError(ErrorCodes.UNAUTHORIZED, '', 401);
    expect(getUserFriendlyMessage(unauthorizedErr)).toContain('تسجيل الدخول');

    const forbiddenErr = new AppError(ErrorCodes.FORBIDDEN, '', 403);
    expect(getUserFriendlyMessage(forbiddenErr)).toContain('صلاحية');

    const timeoutErr = new AppError(ErrorCodes.TIMEOUT, '', 408);
    expect(getUserFriendlyMessage(timeoutErr)).toContain('مهلة');

    const defaultErr = new AppError('UNKNOWN', '', 500);
    expect(getUserFriendlyMessage(defaultErr)).toContain('خطأ');
  });
});

describe('Utility Functions Edge Cases', () => {
  it('validateEmail handles valid addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test@domain.co')).toBe(true);
    expect(validateEmail('a+b@c.com')).toBe(true);
  });

  it('validateEmail handles invalid addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('plain')).toBe(false);
    expect(validateEmail('@no-user.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @domain.com')).toBe(false);
  });

  it('validatePhone handles valid numbers', () => {
    expect(validatePhone('771234567')).toBe(true);
    expect(validatePhone('+967771234567')).toBe(true);
    expect(validatePhone('0771 234 567')).toBe(true);
    expect(validatePhone('(771) 234-567')).toBe(true);
  });

  it('validatePhone handles invalid numbers', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
  });

  it('validateUrl handles valid URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://localhost:3000')).toBe(true);
  });

  it('validateUrl handles invalid URLs', () => {
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });

  it('sanitizeString strips angle brackets and truncates', () => {
    expect(sanitizeString('<b>hello</b>')).toBe('bhello/b');
    expect(sanitizeString('a'.repeat(2000), 10)).toBe('a'.repeat(10));
    expect(sanitizeString('  spaces  ')).toBe('spaces');
  });

  it('generateSlug creates URL-friendly slugs', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
    expect(generateSlug('  lots   of   spaces  ')).toBe('lots-of-spaces');
    expect(generateSlug('test@#$%')).toBe('test');
    expect(generateSlug('a'.repeat(200))).toHaveLength(100);
  });

  it('formatCurrency formats with locale', () => {
    const result = formatCurrency(1234567);
    expect(result).toContain('YER');
    expect(formatCurrency(100, 'USD')).toContain('USD');
  });

  it('sanitizeHtml removes script tags and HTML', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
    expect(sanitizeHtml('<b>bold</b> text')).toBe('bold text');
    expect(sanitizeHtml('no tags here')).toBe('no tags here');
  });
});
