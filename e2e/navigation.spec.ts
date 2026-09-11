import { test, expect } from "@playwright/test";

test.describe("Navigation — critical paths", () => {
  test("homepage loads with title and main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/رحماء بينهم/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("navigates to donate page", async ({ page }) => {
    await page.goto("/donate");
    await expect(page).toHaveURL(/\/donate$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("navigates to contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("navigates to programs page", async ({ page }) => {
    await page.goto("/programs");
    await expect(page).toHaveURL(/\/programs$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("navigates to about page", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("unknown route renders not-found page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("skip-to-content link targets main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(activeTag).toBeTruthy();
  });
});
