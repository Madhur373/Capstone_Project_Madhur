// @ts-check
const { test, expect } = require('@playwright/test');
const { setupCart, blockAds, safeGoto, addProductToCart, CART_URL, PRODUCTS_URL } = require('./cartHelper');

/**
 * cartAddRemove.spec.js
 * TC-13 to TC-18 — Tests adding multiple products and removing items.
 */
test.describe('Cart – Add & Remove Items', () => {

  // TC-13: Adding one product results in exactly one row in cart
  test('TC-13: Adding one product shows exactly one row in the cart', async ({ page }) => {
    await setupCart(page, [1]);
    const rows = page.locator('#cart_info_table tbody tr');
    await expect(rows).toHaveCount(1);
  });

  // TC-14: Adding two different products shows two rows in cart
  test('TC-14: Adding two different products shows two rows in the cart', async ({ page }) => {
    await setupCart(page, [1, 2]);
    const rows = page.locator('#cart_info_table tbody tr');
    await expect(rows).toHaveCount(2);
  });

  // TC-15: Adding three different products shows three rows in cart
  test('TC-15: Adding three different products shows three rows in the cart', async ({ page }) => {
    await setupCart(page, [1, 2, 3]);
    const rows = page.locator('#cart_info_table tbody tr');
    await expect(rows).toHaveCount(3);
  });

  /* TC-16: Removing one item from a two-item cart leaves one row
  test('TC-16: Removing one item from a two-item cart leaves one row', async ({ page }) => {
    await setupCart(page, [1, 2]);
    await page.locator('.cart_quantity_delete').first().click();
    await page.waitForTimeout(1000);
    const rows = page.locator('#cart_info_table tbody tr');
    await expect(rows).toHaveCount(1);
  });

  // TC-17: Removing the only item shows "Cart is empty!" message
  test('TC-17: Removing the only cart item shows "Cart is empty!" message', async ({ page }) => {
    await setupCart(page, [1]);
    await page.locator('.cart_quantity_delete').first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('b:has-text("Cart is empty!")')).toBeVisible();
  });
*/
  // TC-18: Adding the same product twice increments quantity rather than adding new row
  test('TC-18: Adding same product twice increments quantity, not row count', async ({ page }) => {
    await blockAds(page);
    await safeGoto(page, PRODUCTS_URL);
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });

    // Add product #1 twice
    for (let i = 0; i < 2; i++) {
      const card = page.locator('.productinfo').first();
      await card.hover();
      await card.locator('a.add-to-cart').first().click();
      await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('button:has-text("Continue Shopping")').click();
      await page.locator('.modal-content').waitFor({ state: 'hidden', timeout: 10000 });
    }

    await safeGoto(page, CART_URL);
    await page.locator('#cart_info_table').waitFor({ state: 'visible', timeout: 30000 });

    const rows = page.locator('#cart_info_table tbody tr');
    await expect(rows).toHaveCount(1);

    const qty = await rows.first().locator('.cart_quantity button').textContent();
    expect(Number(qty?.trim())).toBe(2);
  });

});
