import { describe, it, expect } from "vitest";
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeInput,
  escapeHtml,
  generateCSRFToken,
  validateCSRFToken,
} from "@/shared/utils/security";

describe("Security Utilities", () => {
  describe("sanitizeHtml", () => {
    it("removes script tags", () => {
      const result = sanitizeHtml('<script>alert("xss")</script>Hello');
      expect(result).not.toContain("<script>");
      expect(result).toContain("Hello");
    });

    it("removes iframe tags", () => {
      const result = sanitizeHtml('<iframe src="evil.com"></iframe>Safe content');
      expect(result).not.toContain("<iframe>");
      expect(result).toContain("Safe content");
    });

    it("preserves allowed tags", () => {
      const result = sanitizeHtml("<b>Bold</b> and <i>Italic</i>");
      expect(result).toContain("<b>");
      expect(result).toContain("<i>");
    });
  });

  describe("sanitizeText", () => {
    it("removes all HTML tags", () => {
      const result = sanitizeText("<p>Hello <b>World</b></p>");
      expect(result).not.toContain("<p>");
      expect(result).not.toContain("<b>");
      expect(result).toContain("Hello");
      expect(result).toContain("World");
    });
  });

  describe("sanitizeInput", () => {
    it("removes angle brackets", () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("removes javascript protocol", () => {
      const result = sanitizeInput("javascript:alert(1)");
      expect(result).not.toContain("javascript:");
    });

    it("removes event handlers", () => {
      const result = sanitizeInput("onclick=alert(1)");
      expect(result).not.toContain("onclick=");
    });
  });

  describe("escapeHtml", () => {
    it("escapes special characters", () => {
      expect(escapeHtml("&")).toBe("&amp;");
      expect(escapeHtml("<")).toBe("&lt;");
      expect(escapeHtml(">")).toBe("&gt;");
      expect(escapeHtml('"')).toBe("&quot;");
      expect(escapeHtml("'")).toBe("&#039;");
    });

    it("escapes full strings", () => {
      const result = escapeHtml('<script>alert("xss")</script>');
      expect(result).toBe("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    });
  });

  describe("CSRF Token", () => {
    it("generates tokens of correct length", () => {
      const token = generateCSRFToken();
      expect(token.length).toBe(64);
    });

    it("validates matching tokens", () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token, token)).toBe(true);
    });

    it("rejects non-matching tokens", () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(validateCSRFToken(token1, token2)).toBe(false);
    });

    it("rejects empty tokens", () => {
      expect(validateCSRFToken("", "")).toBe(false);
    });
  });
});
