// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsTestUser } = require('./profileHelper');

/**
 * profileVisibility.spec.js
 * Verifies all visible UI elements present on the profile / account area
 * after a successful login.
 */
test.describe('Profile – Visibility Checks', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  // TC-01: "Logged in as <username>" label is visible in navbar after login
  test('TC-01: Navbar shows "Logged in as <username>" after login', async ({ page }) => {
    // The site renders this as a <b> tag inside an <a> inside a <li>
    const loggedInText = page.locator('#header li').filter({ hasText: 'Logged in as' });
    await expect(loggedInText).toBeVisible();
    const text = await loggedInText.textContent();
    expect(text?.trim().length).toBeGreaterThan('Logged in as'.length);
  });

  

  // TC-03: Logout link is visible in navbar for logged-in user
  test('TC-03: "Logout" link is visible in navbar for logged-in user', async ({ page }) => {
    await expect(page.locator('a[href="/logout"]')).toBeVisible();
  });

  // TC-04: Signup / Login link is NOT visible when user is logged in
  test('TC-04: "Signup / Login" link is hidden when user is already logged in', async ({ page }) => {
    // When logged in, the login link is replaced by "Logged in as" + Logout
    await expect(page.locator('a[href="/login"]')).not.toBeVisible();
  });

  // TC-05: The username displayed in navbar is a non-empty string
  test('TC-05: Username in navbar is a non-empty string', async ({ page }) => {
    const loggedInItem = page.locator('#header li').filter({ hasText: 'Logged in as' });
    const labelText = await loggedInItem.textContent();
    const username = labelText?.replace('Logged in as', '').trim();
    expect(username).toBeTruthy();
    expect(username?.length).toBeGreaterThan(0);
  });

  // TC-06: Home page loads successfully while logged in (session persists on navigation)
  test('TC-06: Logged-in session persists when navigating to home page', async ({ page }) => {
    await page.goto('https://automationexercise.com/');
    const loggedInItem = page.locator('#header li').filter({ hasText: 'Logged in as' });
    await expect(loggedInItem).toBeVisible();
  });

});
