// ============================================================
// Security Hardening — Advanced Rate Limiting + Threat Detection
// Per-IP, per-endpoint, adaptive rate limiting
// ============================================================

// In-memory rate limit store (resets on cold start — use Redis in production)
const rateLimitStore = new Map();
const BLOCKED_IPS = new Set();
const SUSPICIOUS_PATTERNS = [
  /(<script[^>]*>)/i,           // XSS
  /(union\s+select)/i,          // SQL injection
  /(javascript:)/i,             // JS injection
  /(on\w+\s*=)/i,               // Event handlers
  /(\/etc\/passwd)/i,            // Path traversal
  /(;\s*drop\s+table)/i,        // SQL drop
];

const ENDPOINT_LIMITS = {
  '/api/donations': { windowMs: 60000, max: 10 },
  '/api/auth': { windowMs: 900000, max: 5 },
  '/api/contact': { windowMs: 300000, max: 3 },
  '/api/volunteers': { windowMs: 300000, max: 3 },
  '/api/programs': { windowMs: 60000, max: 30 },
  '/api/agreements': { windowMs: 60000, max: 20 },
  'default': { windowMs: 60000, max: 60 },
};

// ─── Threat Detection ──────────────────────────────────────
function detectThreat(req) {
  const threats = [];
  const body = JSON.stringify(req.body || {});
  const query = JSON.stringify(req.query || {});
  const url = req.url || '';

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(body) || pattern.test(query) || pattern.test(url)) {
      threats.push({ pattern: pattern.source, source: 'input' });
    }
  }

  // Check for unusually large payloads
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 1024 * 1024) { // 1MB
    threats.push({ type: 'large_payload', size: contentLength });
  }

  return threats;
}

// ─── Rate Limiter ──────────────────────────────────────────
function checkRateLimit(ip, endpoint) {
  if (BLOCKED_IPS.has(ip)) {
    return { allowed: false, reason: 'IP blocked' };
  }

  const config = ENDPOINT_LIMITS[endpoint] || ENDPOINT_LIMITS.default;
  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { count: 0, resetAt: now + config.windowMs };
    rateLimitStore.set(key, record);
  }

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + config.windowMs;
  }

  record.count++;

  if (record.count > config.max) {
    // Auto-block after 3x limit exceeded
    if (record.count > config.max * 3) {
      BLOCKED_IPS.add(ip);
      setTimeout(() => BLOCKED_IPS.delete(ip), 3600000); // Unblock after 1 hour
    }
    return {
      allowed: false,
      reason: 'Rate limit exceeded',
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  return { allowed: true, remaining: config.max - record.count };
}

// ─── Middleware Export ──────────────────────────────────────
export function securityMiddleware(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const endpoint = req.path;

  // 1. Threat detection
  const threats = detectThreat(req);
  if (threats.length > 0) {
    console.warn(`[Security] Threat detected from ${ip}:`, threats);
    return res.status(403).json({ error: 'Request blocked by security policy' });
  }

  // 2. Rate limiting
  const rateResult = checkRateLimit(ip, endpoint);
  if (!rateResult.allowed) {
    res.setHeader('Retry-After', rateResult.retryAfter || '60');
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: rateResult.retryAfter,
    });
  }

  // 3. Security headers (enhanced)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Remaining-Requests', rateResult.remaining);

  next();
}

// ─── Cleanup old entries every 5 minutes ───────────────────
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt + 60000) {
      rateLimitStore.delete(key);
    }
  }
}, 300000);
