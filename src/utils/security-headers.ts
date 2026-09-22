// Security headers — aligned with Cloudflare _headers (enterprise-grade)
// NOTE: frame-ancestors and X-Frame-Options MUST be HTTP headers only — never via <meta> tags
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
};

/**
 * Set additional security headers meta tags (only those that support <meta>).
 * frame-ancestors and X-Frame-Options must be in HTTP headers via _headers — not here.
 */
export function setSecurityHeaders(): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    const existing = document.querySelector(`meta[http-equiv='${key}']`);
    if (!existing) {
      const meta = document.createElement("meta");
      meta.httpEquiv = key;
      meta.content = value;
      document.head.appendChild(meta);
    }
  });
}

/**
 * Remove potentially dangerous elements from DOM — whitelist trusted origins
 * Follows OWASP XSS Prevention Cheat Sheet v4.0
 * Removes only untrusted external scripts while preserving trusted ones
 */
export function cleanDangerousElements(): void {
  const scripts = document.querySelectorAll("script[src]");
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  scripts.forEach((script) => {
    const src = script.getAttribute("src");
    if (!src) return;
    if (src.startsWith('/') || src.startsWith('blob:') || src.startsWith('data:')) return;
    if (origin && src.startsWith(origin)) return;
    const isTrusted = [
      'https://js.stripe.com',
      'https://hooks.stripe.com',
      'https://challenges.cloudflare.com',
      'https://cdn.sanity.io',
    ].some((o) => {
      const pattern = new RegExp('^' + o.replace(/\*/g, '[^/]*') + '$');
      return pattern.test(src);
    });
    if (src.startsWith('http') && !isTrusted) {
      if (import.meta.env.DEV) console.warn('[Security] Removing untrusted script:', src);
      script.remove();
    }
  });
}
