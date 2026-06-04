// @ts-check
const { test, expect } = require('@playwright/test');

const LOGIN_URL  = 'https://automationexercise.com/login';
const HOME_URL   = 'https://automationexercise.com/';

const VALID_EMAIL    = 'madhursm373@gmail.in';
const VALID_PASSWORD = 'a@A7s@HgARvGCcP';

test.describe('Login & Logout Actions', () => {

  // TC-14: Successful login with valid credentials
  test('TC-14: User can log in with valid credentials', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
    await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
    await page.locator('[data-qa="login-button"]').click();

    // After login, navbar should show "Logged in as <name>"
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
  });

  // TC-15: Successful logout redirects to login page
  test('TC-15: User can log out successfully', async ({ page }) => {
    // Log in first
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
    await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
    await page.locator('[data-qa="login-button"]').click();
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // Now log out
    await page.locator('a[href="/logout"]').click();
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.locator('[data-qa="login-button"]')).toBeVisible();
  });

  // TC-16: After login, "Logout" link appears in navbar
  test('TC-16: Logout link is visible in navbar after login', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
    await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
    await page.locator('[data-qa="login-button"]').click();

    await expect(page.locator('a[href="/logout"]')).toBeVisible();
  });

  // TC-17: Logged-in user cannot access login page (redirected to home)
  test('TC-17: Already logged-in user is redirected away from login page', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
    await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
    await page.locator('[data-qa="login-button"]').click();
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // Try visiting login page again
    await page.goto(LOGIN_URL);
    // Should be redirected to home, not stay on login
    await expect(page).not.toHaveURL(LOGIN_URL);
  });

});
