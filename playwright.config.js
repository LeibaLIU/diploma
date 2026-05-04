// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.js',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
        environmentInfo: {
          framework: 'Playwright',
          language: 'JavaScript',
          os: process.platform,
          node: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    launchOptions: {
      // demowebshop.tricentis.com отдаёт ответы по HTTP/2 нестабильно для headless Chromium -
      // принудительно используем HTTP/1.1, чтобы избежать ERR_TIMED_OUT.
      args: ['--disable-http2'],
    },
  },

  projects: [
    {
      name: 'chromium',
      testDir: './tests',
      testIgnore: '**/mobile/**',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'Mobile Chrome',
      testDir: './tests/mobile',
      use: { ...devices['Pixel 5'], channel: 'chromium' },
    },
  ],
});
