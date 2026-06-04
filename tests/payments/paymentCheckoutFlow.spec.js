// @ts-check
const { test, expect } = require('@playwright/test');
const {
  loginAsTestUser,
  addProductToCart,
  setupCartAndCheckout,
  fillPaymentForm,
  VALID_CARD,
  CART_URL,
  CHECKOUT_URL,
} = require('./paymentHelper');

/**
 * paymentCheckoutFlow.spec.js
 * TC-26 to TC-30 — Tests the checkout → payment pipeline:
 * address details display, comment box, order summary,
 * guest access guard, and back-navigation behaviour.
 */
test.describe('Payment – Checkout to Payment Flow', () => {

  // TC-26: Checkout page shows delivery address details for logged-in user
  test('TC-26: Checkout page displays delivery address section for logged-in user', async ({ page }) => {
    await loginAsTestUser(page);
    await addProductToCart(page);
    await page.goto(CART_URL);
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await page.waitForURL(/checkout/, { timeout: 20000 });
    await expect(page.locator('#address_delivery')).toBeVisible();
  });

  // TC-27: Checkout page shows order review / cart items before payment
  test('TC-27: Checkout page shows order summary table before proceeding to payment', async ({ page }) => {
    await loginAsTestUser(page);
    await addProductToCart(page);
    await page.goto(CART_URL);
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await page.waitForURL(/checkout/, { timeout: 20000 });
    // The cart review table should be visible
    await expect(page.locator('#cart_info')).toBeVisible();
  });

  /* TC-28: Comment / message text area is visible on checkout page
  test('TC-28: Comment text area is visible on the checkout page', async ({ page }) => {
    await loginAsTestUser(page);
    await addProductToCart(page);
    await page.goto(CART_URL);
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await page.waitForURL(/checkout/, { timeout: 20000 });
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });*/

  // TC-29: Guest (not logged-in) clicking Checkout sees a login/register prompt
  test('TC-29: Guest user clicking "Proceed To Checkout" is shown a login/register modal', async ({ page }) => {
    await page.context().clearCookies();
    // Add a product without logging in
    await page.goto('https://automationexercise.com/products');
    const firstCard = page.locator('.productinfo').first();
    await firstCard.hover();
    await firstCard.locator('a.add-to-cart').first().click();
    await page.locator('button:has-text("Continue Shopping")').click();

    await page.goto(CART_URL);
    await page.locator('a:has-text("Proceed To Checkout")').click();
    // Modal prompts login or register
    await expect(page.locator('.modal-body a[href="/login"]')).toBeVisible({ timeout: 10000 });
  });

  
});
