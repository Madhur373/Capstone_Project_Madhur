// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * profileAccountInfo.spec.js
 * Tests around the account registration form fields, their labels,
 * pre-filled values, and gender/date-of-birth selectors.
 */

const BASE = 'https://automationexercise.com';

/** Creates a unique temp email, initiates signup, and lands on the account-info page */
async function goToAccountInfoPage(page) {
  const tempEmail = `profile_test_${Date.now()}@tempmail.dev`;
  await page.goto(`${BASE}/login`);
  await page.locator('[data-qa="signup-name"]').fill('Profile Tester');
  await page.locator('[data-qa="signup-email"]').fill(tempEmail);
  await page.locator('[data-qa="signup-button"]').click();
  // Wait for the account info form to be visible
  await page.waitForURL(/signup/, { timeout: 30000 });
  await page.locator('b:has-text("Enter Account Information")').waitFor({ state: 'visible', timeout: 15000 });
  return tempEmail;
}

test.describe('Profile – Account Info Form', () => {

  // TC-07: "Enter Account Information" heading visible on signup form
  test('TC-07: Account info form heading "Enter Account Information" is visible', async ({ page }) => {
    await goToAccountInfoPage(page);
    // Use .first() to avoid strict mode violation (page has two h2 headings)
    await expect(page.locator('h2.title.text-center b').first()).toContainText('Enter Account Information');
  });

  // TC-08: Title (Mr / Mrs) radio buttons are present and selectable
  test('TC-08: Title radio buttons (Mr / Mrs) are present and clickable', async ({ page }) => {
    await goToAccountInfoPage(page);
    const mrRadio  = page.locator('#id_gender1');
    const mrsRadio = page.locator('#id_gender2');
    await expect(mrRadio).toBeVisible();
    await expect(mrsRadio).toBeVisible();
    await mrRadio.click();
    await expect(mrRadio).toBeChecked();
  });

  // TC-09: Name field is pre-filled with the value entered at signup
  test('TC-09: Name field is pre-filled from the signup step', async ({ page }) => {
    await goToAccountInfoPage(page);
    const nameValue = await page.locator('[data-qa="name"]').inputValue();
    expect(nameValue).toBe('Profile Tester');
  });

  // TC-10: Email field is pre-filled with the signup email
  test('TC-10: Email field is pre-filled with the signup email', async ({ page }) => {
    const tempEmail = await goToAccountInfoPage(page);
    const emailValue = await page.locator('[data-qa="email"]').inputValue();
    expect(emailValue).toBe(tempEmail);
  });

  // TC-11: Password field is present and accepts input
  test('TC-11: Password field is present and accepts text input', async ({ page }) => {
    await goToAccountInfoPage(page);
    const pwField = page.locator('[data-qa="password"]');
    await expect(pwField).toBeVisible();
    await pwField.fill('TestPass@123');
    await expect(pwField).toHaveValue('TestPass@123');
  });

  // TC-12: Date of birth dropdowns (Day / Month / Year) are present
  test('TC-12: Date of birth Day, Month, Year dropdowns are all visible', async ({ page }) => {
    await goToAccountInfoPage(page);
    await expect(page.locator('[data-qa="days"]')).toBeVisible();
    await expect(page.locator('[data-qa="months"]')).toBeVisible();
    await expect(page.locator('[data-qa="years"]')).toBeVisible();
  });

});
