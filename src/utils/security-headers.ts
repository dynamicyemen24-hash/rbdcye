// Security meta tags and CSP headers
export function setSecurityHeaders(): void {
  // Content Security Policy
  const csp = document.querySelector("meta[http-equiv='Content-Security-Policy']");
  if (!csp) {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    document.head.appendChild(meta);
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

// Remove potentially dangerous elements from DOM
export function cleanDangerousElements(): void {
  const scripts = document.querySelectorAll("script[src]");
  scripts.forEach((script) => {
    const src = script.getAttribute("src");
    if (src && !src.startsWith(window.location.origin)) {
      script.remove();
    }
  });
}
