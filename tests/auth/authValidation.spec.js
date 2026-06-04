// @ts-check
const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://automationexercise.com/login';

test.describe('Auth Validation', () => {

  // TC-01: Login with invalid email shows error
  test('TC-01: Login with invalid email shows error message', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-email"]').fill('invalidemail@fake.com');
    await page.locator('[data-qa="login-password"]').fill('WrongPass123');
    await page.locator('[data-qa="login-button"]').click();
    await expect(page.locator('p:has-text("Your email or password is incorrect!")')).toBeVisible();
  });

  // TC-02: Login with empty email and password shows validation
  test('TC-02: Login with empty credentials prevents submission', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-button"]').click();
    // Browser native validation fires — email field should be required
    const emailInput = page.locator('[data-qa="login-email"]');
    const validationMsg = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMsg).not.toBe('');
  });

  // TC-03: Login with correct email but wrong password shows error
  test('TC-03: Login with correct email but wrong password shows error', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="login-email"]').fill('madhursm373@gmail.im');
    await page.locator('[data-qa="login-password"]').fill('WrongPassword!99');
    await page.locator('[data-qa="login-button"]').click();
    await expect(page.locator('p:has-text("Your email or password is incorrect!")')).toBeVisible();
  });

  // TC-04: Signup with already-registered email shows error
  test('TC-04: Signup with already-registered email shows error', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="signup-name"]').fill('Test User');
    await page.locator('[data-qa="signup-email"]').fill('madhursm373@gmail.in');
    await page.locator('[data-qa="signup-button"]').click();
    await expect(page.locator('p:has-text("Email Address already exist!")')).toBeVisible();
  });

});
