// @ts-check
const { test, expect } = require('@playwright/test');
const { setupAndGoToCheckout, blockAds, safeGoto, CART_URL, BASE_URL } = require('./checkoutHelper');

/**
 * checkoutInteraction.spec.js
 * TC-19 to TC-22 — Tests user interactions on the checkout page:
 * comment box, Place Order navigation, guest modal, and back navigation.
 */
test.describe('Checkout – Interactions', () => {

  // TC-19: Comment box accepts and retains text input
  test('TC-19: Comment text area accepts and retains text input', async ({ page }) => {
    await setupAndGoToCheckout(page);
    const commentBox = page.locator('textarea[name="message"]');
    await commentBox.fill('Please deliver between 9AM and 5PM.');
    await expect(commentBox).toHaveValue('Please deliver between 9AM and 5PM.');
  });

  // TC-20: Clicking "Place Order" navigates to the payment page
  test('TC-20: Clicking "Place Order" navigates to the payment page', async ({ page }) => {
    await setupAndGoToCheckout(page);
    await page.locator('a:has-text("Place Order")').click();
    await page.locator('[data-qa="name-on-card"]').waitFor({ state: 'visible', timeout: 30000 });
    expect(page.url()).toContain('/payment');
  });

  // TC-21: Guest user clicking "Proceed To Checkout" sees login/register modal
  test('TC-21: Guest user sees login/register modal on clicking Proceed To Checkout', async ({ page }) => {
    await blockAds(page);
    await page.context().clearCookies();
    await safeGoto(page, `${BASE_URL}/products`);
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('.productinfo').first().hover();
    await page.locator('.productinfo').first().locator('a.add-to-cart').first().click();
    await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('button:has-text("Continue Shopping")').click();
    await safeGoto(page, CART_URL);
    await page.locator('a:has-text("Proceed To Checkout")').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await expect(page.locator('.modal-body a[href="/login"]')).toBeVisible({ timeout: 15000 });
  });

  // TC-22: Guest modal has "Register / Login" link that goes to login page
  test('TC-22: Guest checkout modal "Register / Login" link navigates to login page', async ({ page }) => {
    await blockAds(page);
    await page.context().clearCookies();
    await safeGoto(page, `${BASE_URL}/products`);
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('.productinfo').first().hover();
    await page.locator('.productinfo').first().locator('a.add-to-cart').first().click();
    await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('button:has-text("Continue Shopping")').click();
    await safeGoto(page, CART_URL);
    await page.locator('a:has-text("Proceed To Checkout")').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await page.locator('.modal-body a[href="/login"]').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('.modal-body a[href="/login"]').click();
    await page.waitForURL(/login/, { timeout: 20000 });
    expect(page.url()).toContain('/login');
  });

});
