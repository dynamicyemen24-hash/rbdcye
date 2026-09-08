import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:5173';

test.describe('Navigation Critical Paths', () => {
  test('navbar logo returns to home', async ({ page }) => {
    await page.goto(`${baseURL}/donate`);
    await page.click('text:رحماء بينهم');
    await expect(page).toHaveURL(baseURL);
    await expect(page.locator('text:تبرع')).toBeVisible();
  });

  test('navigates to zakat calculator', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('text:حاسبة الزكاة');
    await expect(page).toHaveURL(`${baseURL}/zakat`);
  });

  test('navigates to donor portal', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('text:بوابة المتبرع');
    await expect(page).toHaveURL(`${baseURL}/donor`);
  });

  test('footer links navigate correctly', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('text:البرامج');
    await expect(page).toHaveURL(`${baseURL}/programs`);
    await page.goBack();

    await page.click('text:المشاريع');
    await expect(page).toHaveURL(`${baseURL}/projects`);
    await page.goBack();

    await page.click('text:الشفافية');
    await expect(page.locator('text:الشفافية')).toBeVisible();
  });
});