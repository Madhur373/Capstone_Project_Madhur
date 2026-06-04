// @ts-check
const { test, expect } = require('@playwright/test');
const { setupAndGoToCheckout } = require('./checkoutHelper');

/**
 * checkoutVisibility.spec.js
 * TC-01 to TC-06 — Verifies all UI elements visible on the checkout page.
 */
test.describe('Checkout – Page Visibility', () => {

  test.beforeEach(async ({ page }) => {
    await setupAndGoToCheckout(page);
  });

  // TC-01: Checkout page URL is correct
  test('TC-01: Checkout page navigates to correct /checkout URL', async ({ page }) => {
    expect(page.url()).toContain('/checkout');
  });

  // TC-02: Delivery address section is visible
  test('TC-02: Delivery address section is visible on checkout page', async ({ page }) => {
    await expect(page.locator('#address_delivery')).toBeVisible();
  });

  // TC-03: Billing / invoice address section is visible
  test('TC-03: Billing address section is visible on checkout page', async ({ page }) => {
    await expect(page.locator('#address_invoice')).toBeVisible();
  });

  // TC-04: Order review / cart info table is visible
  test('TC-04: Order review table is visible on checkout page', async ({ page }) => {
    await expect(page.locator('#cart_info')).toBeVisible();
  });

  // TC-05: Comment / message text area is visible
  test('TC-05: Comment text area is visible on checkout page', async ({ page }) => {
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  // TC-06: "Place Order" button is visible
  test('TC-06: "Place Order" button is visible on checkout page', async ({ page }) => {
    await expect(page.locator('a:has-text("Place Order")')).toBeVisible();
  });

});
