// @ts-check
const { test, expect } = require('@playwright/test');
const { setupCart, blockAds, safeGoto, CART_URL } = require('./cartHelper');

/**
 * cartVisibility.spec.js
 * TC-01 to TC-06 — Verifies all UI elements on the cart page.
 */
test.describe('Cart – Page Visibility', () => {

  test.beforeEach(async ({ page }) => {
    await setupCart(page, [1]);
  });

  // TC-01: Cart page URL is correct
  test('TC-01: Cart page navigates to correct /view_cart URL', async ({ page }) => {
    expect(page.url()).toContain('/view_cart');
  });

  // TC-02: Cart table is visible
  test('TC-02: Cart table "#cart_info_table" is visible on the page', async ({ page }) => {
    await expect(page.locator('#cart_info_table')).toBeVisible();
  });

  // TC-03: Cart table headers are all present
  test('TC-03: Cart table has all 5 column headers (Image, Product, Price, Quantity, Total)', async ({ page }) => {
    const headers    = page.locator('#cart_info_table thead th');
    const headerText = await headers.allTextContents();
    const normalised = headerText.map(h => h.trim().toLowerCase());
    expect(normalised).toEqual(
      expect.arrayContaining(['image', 'product', 'price', 'quantity', 'total'])
    );
  });

  // TC-04: "Proceed To Checkout" button is visible when cart has items
  test('TC-04: "Proceed To Checkout" button is visible when cart has items', async ({ page }) => {
    await expect(page.locator('a:has-text("Proceed To Checkout")')).toBeVisible();
  });

  // TC-05: Product image is visible in cart row
  test('TC-05: Product image is visible in the first cart row', async ({ page }) => {
    const img = page.locator('#cart_info_table tbody tr').first().locator('img');
    await expect(img).toBeVisible();
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
  });

  // TC-06: Delete (×) button is visible per row
  test('TC-06: Delete button is visible on each cart row', async ({ page }) => {
    await expect(page.locator('.cart_quantity_delete').first()).toBeVisible();
  });

});
