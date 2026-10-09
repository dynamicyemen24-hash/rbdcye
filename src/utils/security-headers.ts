// Client-side security hardening.
//
// Important: browser-enforced security headers (CSP, HSTS, X-Frame-Options,
// COOP/CORP and Permissions-Policy) must be delivered as HTTP response headers.
// The canonical production configuration lives in public/_headers. A <meta>
// tag cannot replace those headers.
const REFERRER_POLICY = "strict-origin-when-cross-origin";

const TRUSTED_SCRIPT_HOSTS = new Set([
  "js.stripe.com",
  "hooks.stripe.com",
  "challenges.cloudflare.com",
  "cdn.sanity.io",
]);

/** Add only a security directive that browsers support through a meta element. */
export function setSecurityHeaders(): void {
  if (typeof document === "undefined") return;

  const existing = document.querySelector<HTMLMetaElement>('meta[name="referrer"]');
  if (existing) {
    existing.content = REFERRER_POLICY;
    return;
  }

  const meta = document.createElement("meta");
  meta.name = "referrer";
  meta.content = REFERRER_POLICY;
  document.head.appendChild(meta);
}

/**
 * Remove script sources outside the same origin and the explicit HTTPS allowlist.
 * Resolve URLs before checking them so protocol-relative URLs (//host/path),
 * deceptive hostnames, and prefix-based origin checks cannot bypass the policy.
 *
 * This is defense in depth, not a substitute for a restrictive HTTP CSP.
 */
export function cleanDangerousElements(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const currentOrigin = window.location.origin;
  const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]");

  scripts.forEach((script) => {
    const src = script.getAttribute("src");
    if (!src) return;

    let url: URL;
    try {
      url = new URL(src, document.baseURI);
    } catch {
      script.remove();
      return;
    }

    // Same-origin scripts are permitted. Blob URLs are permitted only when
    // their embedded origin matches this page; data: URLs are never trusted.
    if (url.origin === currentOrigin) return;

    if (url.protocol === "blob:" && url.origin === currentOrigin) return;

    const trustedHttpsScript =
      url.protocol === "https:" && TRUSTED_SCRIPT_HOSTS.has(url.hostname);

    if (!trustedHttpsScript) {
      if (import.meta.env.DEV) {
        console.warn("[Security] Removing untrusted script source.");
      }
      script.remove();
    }
  });
}
