// Security utilities - XSS prevention and input sanitization
import DOMPurify from "dompurify";

// Sanitize HTML string to prevent XSS
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre"],
    ALLOWED_ATTR: ["href", "title", "class", "id", "alt", "src", "width", "height"],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "select", "button"],
    FORBID_ATTR: ["onclick", "onerror", "onload", "onmouseover", "onfocus", "onblur", "onsubmit", "onchange"],
  });
}

// Sanitize URL to prevent javascript: protocol attacks
export function sanitizeURL(url: string): string {
  const sanitized = DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  const trimmed = sanitized.trim().toLowerCase();
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("vbscript:")) {
    return "";
  }
  return url;
}

// Sanitize plain text (escape HTML entities)
export function escapeHTML(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Validate and sanitize form input
export function sanitizeInput(value: string, maxLength = 1000): string {
  const trimmed = value.trim().slice(0, maxLength);
  return escapeHTML(trimmed);
}

// Sanitize array of strings
export function sanitizeArray(items: string[], maxLength = 100): string[] {
  return items.map((item) => sanitizeInput(item, maxLength));
}
