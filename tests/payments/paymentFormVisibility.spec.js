// @ts-check
const { test, expect } = require('@playwright/test');
const {
  setupCartAndCheckout,
  fillPaymentForm,
  VALID_CARD,
  PAYMENT_URL,
} = require('./paymentHelper');

/**
 * paymentFormVisibility.spec.js
 * TC-01 to TC-08 — Verifies all UI elements on the payment page are
 * rendered correctly before any interaction.
 */
test.describe('Payment – Form Visibility', () => {

  test.beforeEach(async ({ page }) => {
    await setupCartAndCheckout(page);
  });

  // TC-01: Payment page URL is correct
  test('TC-01: Browser navigates to /payment after placing order', async ({ page }) => {
    expect(page.url()).toContain('/payment');
  });

  // TC-02: Payment page has correct heading
  test('TC-02: Payment page heading "Payment" is visible', async ({ page }) => {
    await expect(page.locator('h2:has-text("Payment")')).toBeVisible();
  });

  // TC-03: "Name on Card" field is visible
  test('TC-03: "Name on Card" input field is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="name-on-card"]')).toBeVisible();
  });

  // TC-04: "Card Number" field is visible
  test('TC-04: "Card Number" input field is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="card-number"]')).toBeVisible();
  });

  // TC-05: CVC field is visible
  test('TC-05: CVC input field is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="cvc"]')).toBeVisible();
  });

  // TC-06: Expiry Month field is visible
  test('TC-06: Expiry Month input field is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="expiry-month"]')).toBeVisible();
  });

  // TC-07: Expiry Year field is visible
  test('TC-07: Expiry Year input field is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="expiry-year"]')).toBeVisible();
  });

  // TC-08: "Pay and Confirm Order" button is visible
  test('TC-08: "Pay and Confirm Order" submit button is visible', async ({ page }) => {
    await expect(page.locator('[data-qa="pay-button"]')).toBeVisible();
  });

});
