// Security meta tags and CSP headers — aligned with index.html + _headers (enterprise-grade)
const ALLOWED_CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: https://cdn.sanity.io",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.sanity.io https://xd0ohyiz.apicdn.sanity.io https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://sentry.io https://*.cloudflare.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://*.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export function setSecurityHeaders(): void {
  // Content Security Policy — align runtime with static CSP
  const csp = document.querySelector("meta[http-equiv='Content-Security-Policy']");
  if (!csp) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = ALLOWED_CSP;
    document.head.appendChild(meta);
  } else if (csp.getAttribute('content') !== ALLOWED_CSP) {
    // Ensure runtime CSP is not weaker than static — upgrade if needed
    csp.setAttribute('content', ALLOWED_CSP);
  }

  // Prevent clickjacking
  const xFrameOptions = document.querySelector("meta[http-equiv='X-Frame-Options']");
  if (!xFrameOptions) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "X-Frame-Options";
    meta.content = "DENY";
    document.head.appendChild(meta);
  }

  // Prevent MIME sniffing
  const xContentTypeOptions = document.querySelector("meta[http-equiv='X-Content-Type-Options']");
  if (!xContentTypeOptions) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "X-Content-Type-Options";
    meta.content = "nosniff";
    document.head.appendChild(meta);
  }

  // Referrer policy
  const referrerPolicy = document.querySelector("meta[http-equiv='Referrer-Policy']");
  if (!referrerPolicy) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Referrer-Policy";
    meta.content = "strict-origin-when-cross-origin";
    document.head.appendChild(meta);
  }

  // Permissions policy
  const permissionsPolicy = document.querySelector("meta[http-equiv='Permissions-Policy']");
  if (!permissionsPolicy) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Permissions-Policy";
    meta.content = "camera=(), microphone=(), geolocation=()";
    document.head.appendChild(meta);
  }
}

// Remove potentially dangerous elements from DOM — whitelist trusted origins
const TRUSTED_SCRIPT_ORIGINS = [
  'https://js.stripe.com',
  'https://hooks.stripe.com',
  'https://challenges.cloudflare.com',
  'https://cdn.sanity.io',
];

export function cleanDangerousElements(): void {
  const scripts = document.querySelectorAll("script[src]");
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  scripts.forEach((script) => {
    const src = script.getAttribute("src");
    if (!src) return;
    // Allow relative, blob:, data:, and trusted origins
    if (src.startsWith('/') || src.startsWith('blob:') || src.startsWith('data:')) return;
    if (origin && src.startsWith(origin)) return;
    const isTrusted = TRUSTED_SCRIPT_ORIGINS.some((o) => src.startsWith(o));
    if (src.startsWith('http') && !isTrusted) {
      // Remove only untrusted external scripts — log in dev for audit
      if (import.meta.env.DEV) console.warn('[Security] Removing untrusted script:', src);
      script.remove();
    }
  });
}
