// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, safeGoto, setupCartAsGuest, CART_URL, BASE_URL } = require('./cartHelper');

/**
 * cartEmptyAndGuest.spec.js
 * TC-19 to TC-22 — Tests empty cart state and guest user behaviour.
 */
test.describe('Cart – Empty State & Guest User', () => {

  // TC-19: Fresh session cart shows "Cart is empty!" message
  test('TC-19: Empty cart shows "Cart is empty!" message', async ({ page }) => {
    await blockAds(page);
    await page.context().clearCookies();
    await safeGoto(page, CART_URL);
    await expect(page.locator('b:has-text("Cart is empty!")')).toBeVisible({ timeout: 20000 });
  });

  // TC-21: Guest user can add product and see it in cart without logging in
  test('TC-21: Guest user can add a product and view it in the cart', async ({ page }) => {
    await setupCartAsGuest(page, 1);
    const rows = page.locator('#cart_info_table tbody tr');
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  // TC-22: Guest user clicking "Proceed To Checkout" sees login/register modal
  test('TC-22: Guest user sees login/register modal on clicking Proceed To Checkout', async ({ page }) => {
    await setupCartAsGuest(page, 1);
    await page.locator('a:has-text("Proceed To Checkout")').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await expect(page.locator('.modal-body a[href="/login"]')).toBeVisible({ timeout: 15000 });
  });

});
