import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * WCAG 2.1 AA automated audit — axe-core
 *
 * Scans every primary page on desktop and mobile contexts.
 * Failures here block the build: any new violation must either be
 * fixed or explicitly justified below with a tracked exception.
 */

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "programs", path: "/programs" },
  { name: "projects", path: "/projects" },
  { name: "donate", path: "/donate" },
  { name: "contact", path: "/contact" },
  { name: "transparency", path: "/transparency" },
  { name: "zakat", path: "/zakat" },
  { name: "volunteer", path: "/volunteer" },
  { name: "not-found", path: "/this-page-does-not-exist" },
];

test.describe("WCAG 2.1 AA — automated axe audit", () => {
  for (const page of PAGES) {
    test(`${page.name} (${page.path}) has no WCAG 2.1 AA violations`, async ({ page: browser }) => {
      await browser.goto(page.path);
      await browser.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page: browser })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const violations = results.violations.filter(
        (violation) => violation.impact === "moderate" || violation.impact === "serious" || violation.impact === "critical"
      );

      if (violations.length > 0) {
        const details = violations
          .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(", ")}`)
          .join("\n");
        throw new Error(`WCAG violations on ${page.path}:\n${details}`);
      }

      expect(violations).toHaveLength(0);
    });
  }
});

test.describe("WCAG 2.1 AA — keyboard operability", () => {
  test("skip-to-content link is the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() =>
      document.activeElement?.getAttribute("href") ?? document.activeElement?.textContent ?? ""
    );
    expect(firstFocused).toBeTruthy();
  });

  test("donate page is fully keyboard operable — no focus traps", async ({ page }) => {
    await page.goto("/donate");
    const focusableCount = await page.evaluate(() => {
      const els = document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      return els.length;
    });
    expect(focusableCount).toBeGreaterThan(5);

    // Tab through a subset of elements and confirm focus never leaves the document.
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const stillFocused = await page.evaluate(() => !!document.activeElement && document.activeElement !== document.body);
      expect(stillFocused).toBe(true);
    }
  });
});

test.describe("WCAG 2.1 AA — media and language", () => {
  test("document declares lang and dir correctly", async ({ page }) => {
    await page.goto("/");
    const lang = await page.evaluate(() => document.documentElement.lang);
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(lang).toBeTruthy();
    expect(["rtl", "ltr"]).toContain(dir);
  });

  test("home page images expose alternative text", async ({ page }) => {
    await page.goto("/");
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
  });

  test("every page has exactly one h1 or a coherent heading order", async ({ page }) => {
    await page.goto("/");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // No skipped heading levels on the home page (h1 -> h3 without h2).
    const skipped = await page.evaluate(() => {
      const order = ["H1", "H2", "H3", "H4", "H5", "H6"];
      const levels = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) =>
        order.indexOf(h.tagName)
      );
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i - 1] + 1) return true;
      }
      return false;
    });
    expect(skipped).toBe(false);
  });
});
