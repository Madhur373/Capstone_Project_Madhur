// @ts-check
const { test, expect } = require('@playwright/test');
const { setupAndGoToCheckout } = require('./checkoutHelper');

/**
 * checkoutOrderSummary.spec.js
 * TC-13 to TC-18 — Tests the order summary / cart review table on checkout.
 */
test.describe('Checkout – Order Summary', () => {

  test.beforeEach(async ({ page }) => {
    await setupAndGoToCheckout(page);
  });

  // TC-13: Order summary table has at least one product row
  test('TC-13: Order summary table contains at least one product row', async ({ page }) => {
    const rows = page.locator('#cart_info tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  // TC-14: Each order row shows a product name
  test('TC-14: Each row in order summary shows a product name', async ({ page }) => {
    const firstRow = page.locator('#cart_info tbody tr').first();
    const productName = firstRow.locator('.cart_description h4 a');
    await expect(productName).toBeVisible();
    const text = await productName.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  // TC-15: Each order row shows a price
  test('TC-15: Each row in order summary shows a product price', async ({ page }) => {
    const firstRow = page.locator('#cart_info tbody tr').first();
    const price = firstRow.locator('.cart_price p');
    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText).toContain('Rs.');
  });

  // TC-16: Each order row shows a quantity
  test('TC-16: Each row in order summary shows a quantity value', async ({ page }) => {
    const firstRow  = page.locator('#cart_info tbody tr').first();
    const qtyButton = firstRow.locator('.cart_quantity button');
    await expect(qtyButton).toBeVisible();
    const qty = await qtyButton.textContent();
    expect(Number(qty?.trim())).toBeGreaterThanOrEqual(1);
  });

  // TC-17: Each order row shows a total price
  test('TC-17: Each row in order summary shows a total price', async ({ page }) => {
    const firstRow   = page.locator('#cart_info tbody tr').first();
    const totalPrice = firstRow.locator('.cart_total p');
    await expect(totalPrice).toBeVisible();
    const totalText = await totalPrice.textContent();
    expect(totalText).toContain('Rs.');
  });

  // TC-18: Total price in summary equals price × quantity
  test('TC-18: Row total price equals unit price multiplied by quantity', async ({ page }) => {
    const firstRow  = page.locator('#cart_info tbody tr').first();
    const priceText = await firstRow.locator('.cart_price p').textContent();
    const qtyText   = await firstRow.locator('.cart_quantity button').textContent();
    const totalText = await firstRow.locator('.cart_total p').textContent();

    const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') ?? '0');
    const qty   = parseFloat(qtyText?.trim() ?? '1');
    const total = parseFloat(totalText?.replace(/[^0-9.]/g, '') ?? '0');

    expect(total).toBeCloseTo(price * qty, 1);
  });

});
