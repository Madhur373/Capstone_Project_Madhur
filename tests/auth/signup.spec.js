// @ts-check
const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://automationexercise.com/login';

test.describe('Signup', () => {

  // TC-19: Signup with a new unique email navigates to registration form
  test('TC-19: Signup with a new email proceeds to registration page', async ({ page }) => {
    // Generate a unique email using timestamp to avoid "already exists" error
    const uniqueEmail = `testuser_${Date.now()}@mailtest.com`;

    await page.goto(LOGIN_URL);
    await page.locator('[data-qa="signup-name"]').fill('Test Automation User');
    await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
    await page.locator('[data-qa="signup-button"]').click();

    // Should land on the account-creation page
    await expect(page).toHaveURL(/signup/);
    await expect(page.locator('h2:has-text("Enter Account Information")')).toBeVisible();
  });

  // TC-20: Signup name field is visible and accepts input
  test('TC-20: Signup name field is visible and accepts text input', async ({ page }) => {
    await page.goto(LOGIN_URL);
    const nameField = page.locator('[data-qa="signup-name"]');
    await expect(nameField).toBeVisible();
    await nameField.fill('Automation Tester');
    await expect(nameField).toHaveValue('Automation Tester');
  });

});
