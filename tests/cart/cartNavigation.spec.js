// @ts-check
const { test, expect } = require('@playwright/test');
const { setupCart, CART_URL, BASE_URL } = require('./cartHelper');

/**
 * cartNavigation.spec.js
 * TC-23 to TC-25 — Tests navigation behaviour from the cart page.
 */
test.describe('Cart – Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await setupCart(page, [1]);
  });

  // TC-23: Clicking "Proceed To Checkout" navigates to checkout page
  test('TC-23: Clicking "Proceed To Checkout" navigates to /checkout', async ({ page }) => {
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await page.locator('#cart_info').waitFor({ state: 'visible', timeout: 30000 });
    expect(page.url()).toContain('/checkout');
  });

  // TC-24: Clicking product name in cart navigates to product detail page
  test('TC-24: Clicking product name in cart row navigates to product detail page', async ({ page }) => {
    await page.locator('#cart_info_table tbody tr').first()
      .locator('.cart_description h4 a').click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    expect(page.url()).toContain('/product_details/');
  });

  /* Addon Cart persists after navigating away and returning
  test('TC-25: Cart items persist after navigating to home and back', async ({ page }) => {
    // Count before navigating away
    const countBefore = await page.locator('#cart_info_table tbody tr').count();

    // Navigate to home then back to cart
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.goto(CART_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('#cart_info_table').waitFor({ state: 'visible', timeout: 30000 });

    // Cart should still have same items
    const countAfter = await page.locator('#cart_info_table tbody tr').count();
    expect(countAfter).toBe(countBefore);
  });
*/
});
