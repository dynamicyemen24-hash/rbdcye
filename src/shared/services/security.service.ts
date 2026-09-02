// ============================================================
// Enterprise Security Service - Defense In Depth
// ============================================================

// CSP Policy - Strict Content Security
export const CSP_POLICY: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:', 'https:', 'https://cdn.sanity.io'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co', 'https://*.sanity.io', 'https://xd0ohyiz.apicdn.sanity.io', 'https://api.stripe.com'],
  'frame-src': ['https://js.stripe.com', 'https://hooks.stripe.com', 'https://*.sanity.io'],
  'media-src': ["'self'", 'https://*.sanity.io'],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

// Security Headers for production
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// Input Sanitization Engine
class InputSanitizer {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /javascript\s*:/gi,
    /data:\s*text\/html/gi,
    /vbscript\s*:/gi,
    /expression\s*\(/gi,
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /('|")\s*(OR|AND|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE)\s/gi,
    /--\s*$/gm,
    /\/\*.*\*\//g,
    /;(\s*DROP|ALTER|CREATE|TRUNCATE)\s/gi,
  ];

  static sanitize(value: unknown, type: 'string' | 'number' | 'email' | 'phone' | 'url' | 'html' | 'object' = 'string'): unknown {
    if (value === null || value === undefined) return value;

    if (type === 'number') {
      const num = Number(value);
      return Number.isFinite(num) ? num : 0;
    }

    if (type === 'email') {
      const email = String(value).trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
    }

    if (type === 'phone') {
      const phone = String(value).replace(/[^\d+]/g, '').trim();
      return /^\+?[\d]{7,15}$/.test(phone) ? phone : '';
    }

    if (type === 'url') {
      const url = String(value).trim();
      try {
        const parsed = new URL(url);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? url : '';
      } catch {
        return '';
      }
    }

    if (type === 'object' && typeof value === 'object' && value !== null) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitize(val, typeof val === 'string' ? 'string' : 'object');
      }
      return sanitized;
    }

    let str = String(value);
    
    // Remove XSS patterns
    this.XSS_PATTERNS.forEach(pattern => {
      str = str.replace(pattern, '');
    });

    // Remove SQL injection patterns
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      str = str.replace(pattern, ' ');
    });

    // HTML entity encode dangerous characters (use functions to avoid automatic encoding)
    if (type !== 'html') {
      str = this.htmlEncode(str);
    }

    return str.trim();
  }

  private static htmlEncode(str: string): string {
    const map: Record<string, string> = {
      '&': '&'.charAt(0) + 'amp;',
      '<': '<'.charAt(0) + 'lt;',
      '>': '>'.charAt(0) + 'gt;',
      '"': '"'.charAt(0) + 'quot;',
      "'": '&#x27;',
    };
    return str.replace(/[&<>"']/g, (char) => {
      if (char === '&') return '&'.split('')[0] + 'amp;';
      if (char === '<') return '<'.split('')[0] + 'lt;';
      if (char === '>') return '>'.split('')[0] + 'gt;';
      if (char === '"') return '"'.split('')[0] + 'quot;';
      if (char === "'") return '&#x27;';
      return char;
    });
  }

  static sanitizeObject<T extends Record<string, unknown>>(obj: T, schema: Record<string, 'string' | 'number' | 'email' | 'phone' | 'url' | 'html' | 'object'>): T {
    const result: Record<string, unknown> = {};
    for (const [key, type] of Object.entries(schema)) {
      result[key] = this.sanitize(obj[key], type as any);
    }
    return result as T;
  }
}

// CSRF Protection
class CSRFProtection {
  private static readonly TOKEN_KEY = 'rh_csrf_token';
  private static readonly HEADER_NAME = 'X-CSRF-Token';

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    const expires = Date.now() + 3600000; // 1 hour
    const payload = btoa(JSON.stringify({ token, expires }));
    localStorage.setItem(this.TOKEN_KEY, payload);
    return token;
  }

  static getToken(): string | null {
    try {
      const stored = localStorage.getItem(this.TOKEN_KEY);
      if (!stored) return null;
      const { token, expires } = JSON.parse(atob(stored));
      if (Date.now() > expires) {
        localStorage.removeItem(this.TOKEN_KEY);
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }

  static getHeaders(): Record<string, string> {
    const token = this.getToken() || this.generateToken();
    return { [this.HEADER_NAME]: token };
  }
}

// Session Fingerprint
class SessionFingerprint {
  private static readonly FINGERPRINT_KEY = 'rh_fingerprint';

  static generate(): string {
    const nav = navigator as any;
    const components = [
      nav.userAgent,
      nav.language,
      new Date().getTimezoneOffset(),
      screen.colorDepth,
      screen.width,
      screen.height,
      nav.hardwareConcurrency || 'unknown',
      typeof nav.deviceMemory !== 'undefined' ? String(nav.deviceMemory) : 'unknown',
    ];
    
    const raw = components.join('|');
    const hash = this.hashString(raw);
    
    localStorage.setItem(this.FINGERPRINT_KEY, hash);
    return hash;
  }

  static get(): string {
    return localStorage.getItem(this.FINGERPRINT_KEY) || this.generate();
  }

  static validate(): boolean {
    const stored = localStorage.getItem(this.FINGERPRINT_KEY);
    if (!stored) return false;
    return stored === this.generate();
  }

  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

// Secure HTTP Client
class SecureHttpClient {
  private static readonly TIMEOUT = 30000;
  private static readonly RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000;

  static async request<T>(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...CSRFProtection.getHeaders(),
      ...SessionFingerprint.get() ? { 'X-Fingerprint': SessionFingerprint.get() } : {},
    };

    // Add auth token if available
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      headers['Authorization'] = 'Bearer ' + authToken;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
        credentials: 'include',
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.RETRY_ATTEMPTS) {
          // Rate limited - retry with backoff
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
          return this.request<T>(url, options, retryCount + 1);
        }
        const errorText = await response.text().catch(() => '');
        throw new Error('HTTP ' + response.status + ': ' + (errorText || response.statusText));
      }

      if (response.status === 204) return undefined as T;
      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  static async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  static async post<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async patch<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

// Export instances
export const inputSanitizer = InputSanitizer;
export const csrfProtection = CSRFProtection;
export const sessionFingerprint = SessionFingerprint;
export const secureHttpClient = SecureHttpClient;

// Apply CSP to document
export function applySecurityHeaders(): void {
  if (typeof document === 'undefined') return;

  // Apply CSP via meta tag
  const cspString = Object.entries(CSP_POLICY)
    .map(([key, values]) => key + ' ' + values.join(' '))
    .join('; ');

  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = cspString;
  document.head.appendChild(cspMeta);

  // Apply other security headers via meta
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    if (['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy'].includes(key)) {
      const meta = document.createElement('meta');
      meta.httpEquiv = key;
      meta.content = value;
      document.head.appendChild(meta);
    }
  });

  // Generate initial CSRF token
  CSRFProtection.generateToken();

  // Generate session fingerprint
  SessionFingerprint.generate();
}

