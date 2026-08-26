import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateUrl, sanitizeString, generateSlug, formatCurrency } from '@/shared/utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test@domain.org')).toBe(true);
      expect(validateEmail('name.last@company.co')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('accepts valid phone numbers', () => {
      expect(validatePhone('+967771234567')).toBe(true);
      expect(validatePhone('771234567')).toBe(true);
      expect(validatePhone('+1234567890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('accepts valid URLs', () => {
      expect(validateUrl('https://rbdcye.org')).toBe(true);
      expect(validateUrl('http://example.com/path')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('removes angle brackets', () => {
      const result = sanitizeString('<script>alert("xss")</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('truncates to max length', () => {
      expect(sanitizeString('Hello World', 5)).toBe('Hello');
    });

    it('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });
  });

  describe('generateSlug', () => {
    it('creates valid slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Test  Multiple   Spaces')).toBe('test-multiple-spaces');
    });

    it('handles Arabic text', () => {
      const slug = generateSlug('مؤسسة رحماء بينهم');
      expect(slug).toContain('مؤسسة');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency with currency code', () => {
      const result = formatCurrency(1000, 'YER');
      expect(result).toContain('YER');
      expect(result).toContain('١٬٠٠٠');
    });
  });
});
