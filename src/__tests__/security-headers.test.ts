import { beforeEach, describe, expect, it } from "vitest";
import { cleanDangerousElements, setSecurityHeaders } from "@/utils/security-headers";

describe("security header helpers", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  it("sets one standards-compliant referrer meta tag", () => {
    setSecurityHeaders();
    setSecurityHeaders();

    const tags = document.querySelectorAll('meta[name="referrer"]');
    expect(tags).toHaveLength(1);
    expect(tags[0].getAttribute("content")).toBe("strict-origin-when-cross-origin");
    expect(document.querySelector('meta[http-equiv="Strict-Transport-Security"]')).toBeNull();
  });

  it("keeps same-origin scripts and explicitly trusted HTTPS script hosts", () => {
    document.body.innerHTML = [
      '<script src="/assets/app.js"></script>',
      '<script src="https://js.stripe.com/v3/"></script>',
      '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>',
    ].join("");

    cleanDangerousElements();

    expect(document.querySelector('script[src="/assets/app.js"]')).not.toBeNull();
    expect(document.querySelector('script[src="https://js.stripe.com/v3/"]')).not.toBeNull();
    expect(document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')).not.toBeNull();
  });

  it("removes protocol-relative, deceptive-host, and data URL scripts", () => {
    document.body.innerHTML = [
      '<script src="//attacker.example/payload.js"></script>',
      '<script src="https://js.stripe.com.attacker.example/payload.js"></script>',
      '<script src="data:text/javascript,alert(1)"></script>',
    ].join("");

    cleanDangerousElements();

    expect(document.querySelectorAll("script[src]")).toHaveLength(0);
  });
});
