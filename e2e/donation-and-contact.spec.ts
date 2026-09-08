import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:5173';

test.describe('Donation Flow', () => {
  test('donates with preset amount', async ({ page }) => {
    await page.goto(`${baseURL}/donate`);
    await expect(page).toHaveTitle(/تبرع/);

    // Select currency - Yemeni Rial
    await page.click('button:has-text("ي Yemen")');
    await expect(page.locator('button[style*="brand-green"]')).toBeVisible();

    // Select preset amount
    await page.click('button.p-3.rounded-xl.font-bold:text-sm:has-text("5000")');

    // Select project
    await page.click('button:has-text("تبرع عام")');

    // Select payment method
    await page.click('button:has-text("بطاقة ائتمان")');

    // Fill donor info
    await page.fill('input[placeholder="الاسم"]', 'اسم المتبرع');
    await page.fill('input[placeholder="البريد الإلكتروني"]', 'test@example.com');
    await page.fill('input[placeholder="رقم الهاتف"]', '+967 780 777 007');

    // Submit donation
    await page.click('button:has-text("تبرع الآن")');
    await expect(page.locator('text:شكراً')).toBeVisible({ timeout: 15000 });
  });

  test('donates with custom amount', async ({ page }) => {
    await page.goto(`${baseURL}/donate`);

    // Select currency
    await page.click('button:has-text("SAR")');

    // Enter custom amount
    await page.fill('input[placeholder="أدخل مبلغ بالريال السعودي"]', '500');

    // Select project
    await page.click('button:has-text("مشاريعنا")');

    // Submit
    await page.click('button:has-text("تبرع الآن")');
    await expect(page.locator('text:تم استلام')).toBeVisible({ timeout: 15000 });
  });

  test('donates in-kind', async ({ page }) => {
    await page.goto(`${baseURL}/donate`);

    // Select in-kind donation type
    await page.click('button:has-text("تبرع عيني")');

    // Select category
    await page.click('button:has-text("ملابس")');

    // Fill details
    await page.fill('textarea[placeholder="تفاصيل إضافية"]', 'بطانيات جديدة');

    // Submit
    await page.click('button:has-text("تأكيد التبرع العيني")');
    await expect(page.locator('text:تم إرسال')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Contact Form', () => {
  test('submits contact form successfully', async ({ page }) => {
    await page.goto(`${baseURL}/contact`);
    await expect(page).toHaveTitle(/تواصل/);

    // Fill form
    await page.fill('input[name="name"]', 'اسم المتواصل');
    await page.fill('input[name="email"]', 'contact@test.com');
    await page.fill('input[name="phone"]', '+967 780 777 007');
    await page.fill('input[name="subject"]', 'استفسار عن المشروع');
    await page.fill('textarea[name="message"]', 'مرحباً، لدي استفسار حول المشروع');

    // Submit
    await page.click('button:has-text("إرسال الرسالة")');
    await expect(page.locator('text:تم إرسال')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text:تذكرة دعم')).toBeVisible({ timeout: 15000 });
  });

  test('shows validation error on submit', async ({ page }) => {
    await page.goto(`${baseURL}/contact`);

    // Submit without filling required fields
    await page.click('button:has-text("إرسال الرسالة")');
    await expect(page.locator('text:البريد الإلكتروني *')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('navigates to all main pages', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/رحماء بينهم/);

    // Navigate to Donate
    await page.click('text:تبرع الآن');
    await expect(page).toHaveURL(`${baseURL}/donate`);
    await expect(page.locator('h1')).toContainText('تبرع الآن');

    // Navigate to Contact
    await page.goBack();
    await page.click('text:تواصل معنا');
    await expect(page).toHaveURL(`${baseURL}/contact`);
    await expect(page.locator('h1')).toContainText('تواصل معنا');

    // Navigate to Programs
    await page.goBack();
    await page.click('text:مجالات العمل');
    await expect(page).toHaveURL(`${baseURL}/programs`);

    // Navigate to About
    await page.goBack();
    await page.click('text:عن المؤسسة');
    await expect(page).toHaveURL(`${baseURL}/about`);

    // Navigate to Projects
    await page.goBack();
    await page.click('text:مشاريعنا');
    await expect(page).toHaveURL(`${baseURL}/projects`);
  });

  test('navbar donation button navigates correctly', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('text:تبرع الآن');
    await expect(page).toHaveURL(`${baseURL}/donate`);
    await expect(page.locator('text:تبرع الآن')).toBeVisible();
  });

  test('mobile menu navigation', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForSelector('button[aria-label="فتح القائمة"]');
    await page.click('button[aria-label="فتح القائمة"]');
    await expect(page.locator('text:navigation')).toBeVisible();

    // Click home from mobile menu
    await page.click('text:الرئيسية');
    await expect(page).toHaveURL(baseURL);
  });
});