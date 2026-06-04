// @ts-check
const { test, expect } = require('@playwright/test');
const {
  setupCartAndCheckout,
  fillPaymentForm,
  VALID_CARD,
} = require('./paymentHelper');

/**
 * paymentSuccess.spec.js
 * TC-16 to TC-20 — Tests the happy-path payment flow:
 * filling valid details, submitting, and verifying success state.
 */
test.describe('Payment – Successful Payment Flow', () => {

  /* TC-16: Submitting valid card details shows order success message
  test('TC-16: Valid card details show order placed successfully message', async ({ page }) => {
    await setupCartAndCheckout(page);
    await fillPaymentForm(page, VALID_CARD);
    await page.locator('[data-qa="pay-button"]').click();
    // Success message
    await expect(
      page.locator('h2:has-text("Order Placed!"), p:has-text("Congratulations"), b:has-text("Order Placed!")')
    ).toBeVisible({ timeout: 20000 });
  });

  // TC-17: After successful payment URL changes to /payment_done
  test('TC-17: URL changes to /payment_done after successful payment', async ({ page }) => {
    await setupCartAndCheckout(page);
    await fillPaymentForm(page, VALID_CARD);
    await page.locator('[data-qa="pay-button"]').click();
    await page.waitForURL(/payment_done/, { timeout: 20000 });
    expect(page.url()).toContain('payment_done');
  });

   TC-18: "Continue" button is visible on the order confirmation page*/
  test('TC-18: "Continue" button is visible on payment confirmation page', async ({ page }) => {
    await setupCartAndCheckout(page);
    await fillPaymentForm(page, VALID_CARD);
    await page.locator('[data-qa="pay-button"]').click();
    await page.waitForURL(/payment_done/, { timeout: 20000 });
    await expect(page.locator('[data-qa="continue-button"]')).toBeVisible();
  });

  /* TC-19: "Continue" button after order redirects to home page
  test('TC-19: Clicking "Continue" after order redirects to home page', async ({ page }) => {
    await setupCartAndCheckout(page);
    await fillPaymentForm(page, VALID_CARD);
    await page.locator('[data-qa="pay-button"]').click();
    await page.waitForURL(/payment_done/, { timeout: 20000 });
    await page.locator('[data-qa="continue-button"]').click();
    await expect(page).toHaveURL('https://automationexercise.com/');
  });

  // TC-20: Cart is empty after a successful order is placed
  test('TC-20: Cart is empty after order is placed successfully', async ({ page }) => {
    await setupCartAndCheckout(page);
    await fillPaymentForm(page, VALID_CARD);
    await page.locator('[data-qa="pay-button"]').click();
    await page.waitForURL(/payment_done/, { timeout: 20000 });
    await page.locator('[data-qa="continue-button"]').click();
    // Navigate to cart and verify it is now empty
    await page.goto('https://automationexercise.com/view_cart');
    await expect(page.locator('b:has-text("Cart is empty!")')).toBeVisible();
  });*/

});
