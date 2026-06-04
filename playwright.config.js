// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');
 
module.exports = defineConfig({
  testDir  : './tests',
  timeout  : 120000,   // 2 min per test — site is ad-heavy and slow
  retries  : process.env.CI ? 2 : 1,  // retry twice on CI, once locally
  workers  : 1,        // sequential — same account avoids cart conflicts
  reporter : [
    ['html', { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
 
  use: {
    baseURL           : 'https://automationexercise.com',
    headless          : true,
    screenshot        : 'only-on-failure',
    video             : 'retain-on-failure',
    trace             : 'retain-on-failure',
    actionTimeout     : 30000,
    navigationTimeout : 60000,
    ignoreHTTPSErrors : true,
  },
 
  projects: [
    {
      name : 'chromium',
      use  : { ...devices['Desktop Chrome'] },
    },
  ],
});