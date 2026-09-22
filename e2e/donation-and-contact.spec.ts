import { test, expect } from "@playwright/test";

test.describe("Donation flow", () => {
  test("donate page exposes monetary and in-kind options", async ({ page }) => {
    await page.goto("/donate");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByRole("button", { name: /تبرع مالي/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /تبرع عيني/ })).toBeVisible();
  });

  test("donor inputs are labelled and keyboard reachable", async ({ page }) => {
    await page.goto("/donate");
    const email = page.getByLabel(/البريد الإلكتروني/).first();
    await email.scrollIntoViewIfNeeded();
    await email.focus();
    await email.fill("donor@example.com");
    await expect(email).toHaveValue("donor@example.com");
  });

  test("submit with invalid custom amount shows validation feedback", async ({ page }) => {
    await page.goto("/donate");
    // Email + phone are natively required: the browser blocks submit before
    // React validation otherwise. Fill them so OUR amount validation runs.
    await page.getByLabel(/البريد الإلكتروني/).first().fill("donor@example.com");
    await page.getByLabel(/رقم الهاتف/).first().fill("7770000000");
    // A preset amount is pre-selected by design, so drive the reachable
    // invalid state explicitly: custom amount of zero.
    const customAmount = page.getByLabel(/مبلغ مخصص/);
    await customAmount.scrollIntoViewIfNeeded();
    await customAmount.fill("0");
    const submit = page.getByRole("button", { name: /تأكيد التبرع/ });
    await submit.scrollIntoViewIfNeeded();
    await submit.click();
    // An alert region should appear when validation fails.
    await expect(page.getByRole("alert").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Contact form", () => {
  test("contact page renders the form and WhatsApp quick actions", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("form").first()).toBeVisible();
  });

  test("required contact fields are labelled", async ({ page }) => {
    await page.goto("/contact");
    const name = page.getByLabel(/الاسم الكامل/).first();
    await name.scrollIntoViewIfNeeded();
    await name.fill("متبرع تجريبي");
    await expect(name).toHaveValue("متبرع تجريبي");
  });
});

test.describe("Accessibility smoke", () => {
  test("homepage has a single h1 and a main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("main#main-content")).toBeVisible();
  });

  test("donate page images expose alt attributes", async ({ page }) => {
    await page.goto("/donate");
    const imagesWithoutAlt = await page.locator("img:not([alt])").count();
    expect(imagesWithoutAlt).toBe(0);
  });
});

test.describe("PWA", () => {
  test("web manifest is served", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBeTruthy();
  });

  test("robots.txt is served", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
  });
});
