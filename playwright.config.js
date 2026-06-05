// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir  : './tests',

  // Longer timeout for CI — GitHub Actions VMs are slower
  timeout  : process.env.CI ? 180000 : 120000,

  // More retries on CI to handle network flakiness
  retries  : process.env.CI ? 2 : 1,

  // CRITICAL: 1 worker — same account across all tests causes conflicts
  workers  : 1,

  reporter: [
    ['html',  { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    baseURL           : 'https://automationexercise.com',
    headless          : true,
    viewport          : { width: 1280, height: 720 },
    screenshot        : 'only-on-failure',
    video             : 'retain-on-failure',
    trace             : 'retain-on-failure',
    actionTimeout     : process.env.CI ? 45000 : 30000,
    navigationTimeout : process.env.CI ? 90000 : 60000,
    ignoreHTTPSErrors : true,

    // Mimic real browser — helps avoid bot detection on CI
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
               '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
      ],
    },
  },

  projects: [
    {
      name : 'chromium',
      use  : { ...devices['Desktop Chrome'] },
    },
  ],
});