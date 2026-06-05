// @ts-check
const { test, expect } = require('@playwright/test');
const { setupAndGoToCheckout, completePayment, CART_URL } = require('./checkoutHelper');

/**
 * checkoutE2E.spec.js
 * TC-23 to TC-25 — Full end-to-end checkout flow tests:
 * order placement, confirmation page, and cart cleared after order.
 */
test.describe('Checkout – End-to-End Flow', () => {

  // TC-24: "Continue" button on confirmation page redirects to home
  test('TC-24: Clicking "Continue" on order confirmation redirects to home page', async ({ page }) => {
    await setupAndGoToCheckout(page);
    await completePayment(page);
    await page.locator('[data-qa="continue-button"]').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('[data-qa="continue-button"]').click();
    await expect(page).toHaveURL('https://automationexercise.com/');
  });

  // TC-25: Cart is empty after a successful checkout
  test('TC-25: Cart is empty after order is successfully placed', async ({ page }) => {
    await setupAndGoToCheckout(page);
    await completePayment(page);
    await page.locator('[data-qa="continue-button"]').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('[data-qa="continue-button"]').click();
    await page.goto(CART_URL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('b:has-text("Cart is empty!")')).toBeVisible({ timeout: 15000 });
  });

});
