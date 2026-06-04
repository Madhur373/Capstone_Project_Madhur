// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 180000,
  retries: 1,
  workers: 3,
  reporter: [
  ['list'],
  ['allure-playwright']
],

  use: {
    baseURL          : 'https://automationexercise.com',
    headless         : true,
    screenshot       : 'only-on-failure',
    video            : 'retain-on-failure',
    actionTimeout    : 90000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  ],
});