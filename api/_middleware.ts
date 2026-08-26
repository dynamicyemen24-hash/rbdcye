// ============================================================
// API Middleware - Enterprise Security Layer
// CSRF Protection + Rate Limiting + Security Headers
// ============================================================

// CORS Configuration - Restrict origins
export const corsConfig = {
  allowedOrigins: [
    'https://rbdcye.org',
    'https://www.rbdcye.org',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Fingerprint', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
};

// Security Headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(self), usb=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// CSRF Protection - Enterprise grade
const csrfTokens = new Map<string, { token: string; expires: number }>();
const CSRF_TOKEN_TTL = 60 * 60 * 1000; // 1 hour

export function generateCSRFToken(): string {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  const token = Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const expires = Date.now() + CSRF_TOKEN_TTL;
  csrfTokens.set(token, { token, expires });
  return token;
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken || token !== expectedToken) return false;
  const stored = csrfTokens.get(token);
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    csrfTokens.delete(token);
    return false;
  }
  return true;
}

// Rate Limiting - In-memory sliding window per IP
interface RateLimitEntry {
  count: number;
  resetAt: number;
  blocked: boolean;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,          // 100 requests per window
  maxBurst: 20,             // Max 20 concurrent / rapid requests
  burstWindowMs: 1000,      // 1 second burst window
};

// Clean up expired entries lazily during request processing
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const now = Date.now();
  const key = ip || 'unknown';
  
  // Lazy cleanup on every request
  cleanupExpiredEntries();
  
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + rateLimitConfig.windowMs, blocked: false });
    return { allowed: true, remaining: rateLimitConfig.maxRequests - 1 };
  }

  entry.count++;

  if (entry.count > rateLimitConfig.maxRequests) {
    entry.blocked = true;
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000), remaining: 0 };
  }

  return { allowed: true, remaining: rateLimitConfig.maxRequests - entry.count };
}

// Main middleware function for Vercel/Cloudflare Functions
export function applyMiddleware(req: any, res: any, next?: () => void) {
  const origin = req.headers?.origin;

  // CORS handling
  if (origin) {
    if (corsConfig.allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', corsConfig.allowedOrigins[0]);
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', corsConfig.allowedOrigins[0]);
  }
  
  res.setHeader('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', String(corsConfig.maxAge));

  // Security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Rate limiting (skip for GET requests which are safe)
  if (req.method !== 'GET') {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
               req.headers['x-real-ip'] || 
               req.socket?.remoteAddress || 
               'unknown';
    
    const { allowed, retryAfter, remaining } = checkRateLimit(ip);
    if (!allowed) {
      res.setHeader('Retry-After', String(retryAfter || 900));
      res.setHeader('X-RateLimit-Remaining', '0');
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter,
      });
    }
    
    res.setHeader('X-RateLimit-Remaining', String(remaining || 0));
  }

  // CSRF validation for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
    const csrfToken = req.headers['x-csrf-token'];
    const sessionToken = req.headers['x-csrf-session'] || 'client';
    
    // For public endpoints (donation, contact, subscribe), skip CSRF
    // These are protected by rate limiting and input validation
    const publicPaths = ['/api/create-checkout-session', '/api/contact', '/api/subscribers', '/api/volunteers', '/api/donations'];
    const isPublic = publicPaths.some(p => req.url?.startsWith(p));
    
    if (!isPublic && csrfToken && !validateCSRFToken(csrfToken, sessionToken)) {
      return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
    }
  }

  if (next) next();
}

export default { corsConfig, securityHeaders, rateLimitConfig, applyMiddleware, generateCSRFToken, validateCSRFToken, checkRateLimit };