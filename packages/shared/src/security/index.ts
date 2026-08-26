// ============================================================
// @nexora/shared - Security Middleware
// Rate limiting, CSRF, CSP, input sanitization
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

// ─── Rate Limiter ───
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
}

export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs = 15 * 60 * 1000,
    maxRequests = 100,
    keyGenerator = (req) => req.ip || req.socket.remoteAddress || 'unknown',
    skipSuccessfulRequests = false,
  } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetAt = Math.ceil(entry.resetAt / 1000);

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(resetAt));

    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
    }

    // Track successful requests if needed
    if (skipSuccessfulRequests) {
      const originalEnd = res.end;
      res.end = function (...args: any[]) {
        if (res.statusCode < 400) {
          entry!.count = Math.max(0, entry!.count - 1);
        }
        return (originalEnd as Function).apply(res, args);
      } as any;
    }

    next();
  };
}

// ─── Default Rate Limiters ───
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  skipSuccessfulRequests: true,
});

export const syncLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  maxRequests: 60,
});

// ─── CSRF Protection ───
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

export function generateCsrfToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');
  csrfTokens.set(sessionId, {
    token,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  return token;
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
    return next();
  }

  const sessionId = req.headers['x-session-id'] as string;
  const csrfToken = req.headers['x-csrf-token'] as string;

  if (!sessionId || !csrfToken) {
    return res.status(403).json({ error: 'CSRF token required' });
  }

  const stored = csrfTokens.get(sessionId);
  if (!stored || stored.expiresAt < Date.now()) {
    return res.status(403).json({ error: 'CSRF token expired' });
  }

  if (stored.token !== csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

// ─── Content Security Policy ───
export function cspHeaders(req: Request, res: Response, next: NextFunction) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://*.neon.tech",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
}

// ─── Input Sanitization ───
export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
}

// ─── Security Headers Middleware ───
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  // Add security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  next();
}

// ─── IP Whitelist (for admin endpoints) ───
export function ipWhitelist(allowedIPs: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.socket.remoteAddress;

    if (!clientIP || !allowedIPs.includes(clientIP)) {
      return res.status(403).json({ error: 'IP not allowed' });
    }

    next();
  };
}

// ─── Request ID ───
export function requestId(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string || randomBytes(16).toString('hex');
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

// ─── Cleanup Old Rate Limit Entries ───
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
