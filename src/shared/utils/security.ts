export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://via.placeholder.com"],
  connectSrc: ["'self'", "https://api.rbdcye.org"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  upgradeInsecureRequests: [],
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>{}[\]\\]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const escapeHtml = (unsafe: string): string => {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return unsafe.replace(/[&<>"']/g, (m) => map[m] || m);
};