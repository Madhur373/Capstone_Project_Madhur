// @ts-check
const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://automationexercise.com/login';

test.describe('Login Page UI Visibility', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // TC-05: Login page title is correct
  test('TC-05: Login page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Automation Exercise - Signup / Login');
  });

  // TC-06: Login form section is visible
  test('TC-06: Login form section is visible on the page', async ({ page }) => {
    await expect(page.locator('.login-form')).toBeVisible();
    await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();
  });

  // TC-07: Email textbox is visible
  test('TC-07: Email input textbox is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="login-email"]')).toBeVisible();
  });

  // TC-08: Password textbox is visible
  test('TC-08: Password input textbox is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="login-password"]')).toBeVisible();
  });

  // TC-09: Login button is visible
  test('TC-09: Login button is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="login-button"]')).toBeVisible();
  });

  // TC-10: Signup button is visible
  test('TC-10: Signup button is visible on the login page', async ({ page }) => {
    await expect(page.locator('[data-qa="signup-button"]')).toBeVisible();
  });

  // TC-11: Signup section heading is visible
  test('TC-11: "New User Signup!" heading is visible', async ({ page }) => {
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();
  });

  // TC-12: Subscription section is visible
  test('TC-12: Subscription section is visible at the bottom', async ({ page }) => {
    await page.locator('#susbscribe_email').scrollIntoViewIfNeeded();
    await expect(page.locator('#susbscribe_email')).toBeVisible();
    await expect(page.locator('h2:has-text("Subscription")')).toBeVisible();
  });

  // TC-13: Contact Us link is visible in navbar
  test('TC-13: "Contact us" link is visible in the navigation', async ({ page }) => {
    await expect(page.locator('a[href="/contact_us"]')).toBeVisible();
  });

});
