import { defineConfig, devices } from '@playwright/test';
import { baseAppUrl } from './utils/setup/constants';

export default defineConfig({
  reporter: [
    ['github'],
    ['list'],
    ['html', { open: 'never' }],
  ],
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 5 : 3,
  timeout: 180 * 1000,
  expect: {
    timeout: 25 * 1000,
  },
  use: {
    baseURL: baseAppUrl,
    trace: 'retain-on-failure',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30 * 1000,
    viewport: { width: 1920, height: 1080 }, // Increased viewport size
  },
  snapshotPathTemplate: 'src/tests/api/_snapshots_/{testFileName}/{arg}.snap.json',
  projects: [
    {
      name: 'chromium',
      testMatch: 'src/tests/web/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, // Override device viewport
      },
    },
    {
      name: 'api',
      testMatch: 'src/tests/api/**/*.spec.ts',
    },
  ],
});
