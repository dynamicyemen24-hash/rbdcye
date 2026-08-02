export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+?\d{1,4})?[0-9]{7,10}$/.test(cleaned);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeString = (input: string, maxLength = 1000): string => {
  return input
    .replace(/[<>]/g, '')
    .slice(0, maxLength)
    .trim();
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\-\u0600-\u06FF]/g, '')
    .slice(0, 100);
};

export const formatCurrency = (amount: number, currency = 'YER'): string => {
  return `${amount.toLocaleString('ar-SA')} ${currency}`;
};