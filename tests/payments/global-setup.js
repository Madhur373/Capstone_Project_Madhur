// tests/payments/global-setup.js
// Runs ONCE before the entire payment test suite.
// Logs in and saves session cookies to auth.json so
// individual tests don't need to re-login every time.

const { chromium } = require('@playwright/test');
const path = require('path');

const AUTH_FILE    = path.join(__dirname, 'auth.json');
const LOGIN_URL    = 'https://automationexercise.com/login';
const VALID_EMAIL    = 'madhursm373@gmail.in';
const VALID_PASSWORD = 'a@A7s@HgARvGCcP';

module.exports = async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page    = await context.newPage();

  try {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('[data-qa="login-email"]').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
    await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
    await page.locator('[data-qa="login-button"]').click();

    // Wait for redirect away from login
    await page.waitForURL(
      url => !url.toString().includes('/login'),
      { timeout: 30000 }
    );
    await page.locator('#header').waitFor({ state: 'visible', timeout: 15000 });

    // Save the authenticated session to disk
    await context.storageState({ path: AUTH_FILE });
    console.log('✅ Auth session saved to', AUTH_FILE);
  } catch (err) {
    console.error('❌ Global setup login failed:', err.message);
    throw err;
  } finally {
    await browser.close();
  }
};
