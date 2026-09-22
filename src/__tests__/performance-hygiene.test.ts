import { beforeEach, describe, expect, it } from "vitest";
import { preloadCriticalAssets } from "@/utils/performance";

function headHrefs(rel: string): string[] {
  return [...document.head.querySelectorAll(`link[rel="${rel}"]`)].map(
    (l) => (l as HTMLLinkElement).href,
  );
}

beforeEach(() => {
  document.head
    .querySelectorAll('link[rel="preload"], link[rel="preconnect"]')
    .forEach((el) => el.remove());
});

describe("preload hygiene", () => {
  it("never preloads sw.js, manifest.json, or favicon.ico (unused-preload warnings)", () => {
    preloadCriticalAssets();
    const hrefs = headHrefs("preload");
    expect(hrefs.some((h) => h.endsWith("/sw.js"))).toBe(false);
    expect(hrefs.some((h) => h.endsWith("/manifest.json"))).toBe(false);
    expect(hrefs.some((h) => h.endsWith("/favicon.ico"))).toBe(false);
  });

  it("keeps the brand logo preload for LCP", () => {
    preloadCriticalAssets();
    expect(headHrefs("preload").some((h) => h.endsWith("/logo.svg"))).toBe(true);
  });

  it("never preconnects to wildcard origins (invalid + console error)", () => {
    preloadCriticalAssets();
    const hrefs = headHrefs("preconnect");
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.some((h) => h.includes("*"))).toBe(false);
  });

  it("is idempotent — no duplicate links on repeated calls", () => {
    preloadCriticalAssets();
    preloadCriticalAssets();
    const preloads = headHrefs("preload").filter((h) => h.endsWith("/logo.svg"));
    expect(preloads).toHaveLength(1);
  });
});
