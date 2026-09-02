// Enterprise Advanced Security System

import DOMPurify from 'dompurify';

// ============================================================
// 1. Input Sanitization
// ============================================================
class InputSanitizer {
  static sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }

  static sanitizeXSS(input: string): string {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  }

  static sanitizeText(input: string): string {
    return input
      .replace(/[<>{}[\]\\]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
}

// ============================================================
// 2. Security Headers Manager
// ============================================================
class SecurityHeadersManager {
  static generateHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }
}

export { InputSanitizer, SecurityHeadersManager };

// ============================================================
// 3. Token Management
// ============================================================
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenManager {
  private static instance: TokenManager;
  private currentToken: TokenPair | null = null;
  private readonly REFRESH_THRESHOLD = 300000;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setTokens(tokens: TokenPair) {
    this.currentToken = tokens;
  }

  getAccessToken(): string | null {
    return this.currentToken?.accessToken || null;
  }

  isExpiringSoon(): boolean {
    if (!this.currentToken) return true;
    return Date.now() >= this.currentToken.expiresAt - this.REFRESH_THRESHOLD;
  }

  isExpired(): boolean {
    if (!this.currentToken) return true;
    return Date.now() >= this.currentToken.expiresAt;
  }

  clearTokens() {
    this.currentToken = null;
  }
}

export const tokenManager = TokenManager.getInstance();

// ============================================================
// 4. Rate Limiting
// ============================================================
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    const validRequests = requests.filter(time => now - time < this.windowMs);
    this.requests.set(identifier, validRequests);

    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      return {
        allowed: false,
        remaining: 0,
        resetTime: oldestRequest + this.windowMs,
      };
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return {
      allowed: true,
      remaining: this.maxRequests - validRequests.length,
      resetTime: now + this.windowMs,
    };
  }

  reset(identifier?: string) {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

export const rateLimiter = new RateLimiter(100, 60000);

// ============================================================
// 5. Audit Logger
// ============================================================
interface AuditLog {
  timestamp: number;
  userId?: string;
  action: string;
  resource: string;
  success: boolean;
}

class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLog[] = [];
  private readonly MAX_LOGS = 1000;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  log(action: string, resource: string, success: boolean) {
    const log: AuditLog = {
      timestamp: Date.now(),
      userId: this.getUserId(),
      action,
      resource,
      success,
    };

    this.logs.push(log);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    if (import.meta.env.DEV) console.log('[AUDIT]', log);
  }

  getLogs() {
    return [...this.logs];
  }

  private getUserId(): string | undefined {
    try {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch {
      // ignore
    }
    return undefined;
  }
}

export const auditLogger = AuditLogger.getInstance();

