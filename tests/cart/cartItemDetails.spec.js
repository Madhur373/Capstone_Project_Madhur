// @ts-check
const { test, expect } = require('@playwright/test');
const { setupCart } = require('./cartHelper');


test.describe('Cart – Item Details', () => {

  test.beforeEach(async ({ page }) => {
    await setupCart(page, [1]);
  });

  // TC-07: Cart row shows product name
  test('TC-07: Cart row displays a non-empty product name', async ({ page }) => {
    const name = page.locator('#cart_info_table tbody tr').first()
      .locator('.cart_description h4 a');
    await expect(name).toBeVisible();
    const text = await name.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  // TC-08: Cart row shows price with Rs. symbol
  test('TC-08: Cart row displays product price with Rs. symbol', async ({ page }) => {
    const price = page.locator('#cart_info_table tbody tr').first()
      .locator('.cart_price p');
    await expect(price).toBeVisible();
    const text = await price.textContent();
    expect(text).toContain('Rs.');
  });

  // TC-09: Cart row shows quantity of at least 1
  test('TC-09: Cart row shows a quantity value of at least 1', async ({ page }) => {
    const qty = page.locator('#cart_info_table tbody tr').first()
      .locator('.cart_quantity button');
    await expect(qty).toBeVisible();
    const val = await qty.textContent();
    expect(Number(val?.trim())).toBeGreaterThanOrEqual(1);
  });

  // TC-10: Cart row shows total price with Rs. symbol
  test('TC-10: Cart row displays total price with Rs. symbol', async ({ page }) => {
    const total = page.locator('#cart_info_table tbody tr').first()
      .locator('.cart_total p');
    await expect(total).toBeVisible();
    const text = await total.textContent();
    expect(text).toContain('Rs.');
  });

  // TC-12: Product name in cart row links to product detail page
  test('TC-12: Product name in cart row is a link to the product detail page', async ({ page }) => {
    const link = page.locator('#cart_info_table tbody tr').first()
      .locator('.cart_description h4 a');
    const href = await link.getAttribute('href');
    expect(href).toContain('/product_details/');
  });

});
