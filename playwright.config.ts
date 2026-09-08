import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: process.env.CI ? true : false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: false,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Auth state
    storageState: 'playwright/.auth/storage.state',

    // Context options
    ignoreHTTPSErrors: true,

    // Default device
    ...devices['Desktop Chrome'],
  },

  // Projects to run
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Server to start before tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: true,
    debug: process.env.CI ? 'only-on-failure : false' : 'debugger',
  },
});