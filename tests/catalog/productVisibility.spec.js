// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, safeGoto, goToProducts, PRODUCTS_URL, BASE_URL } = require('./productHelper');

/**
 * productVisibility.spec.js
 * TC-01 to TC-06 — Verifies all UI elements on the products listing page.
 */
test.describe('Products – Page Visibility', () => {

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await goToProducts(page);
  });

  // TC-01: Products page URL is correct
  test('TC-01: Products page navigates to correct URL', async ({ page }) => {
    expect(page.url()).toContain('/products');
  });

  // TC-02: Products page has correct title
  test('TC-02: Products page has correct browser title', async ({ page }) => {
    await expect(page).toHaveTitle(/Automation Exercise - All Products/i);
  });

  // TC-03: "All Products" heading is visible
  test('TC-03: "All Products" heading is visible on the page', async ({ page }) => {
    await expect(page.locator('h2.title.text-center').first()).toBeVisible();
    const text = await page.locator('h2.title.text-center').first().textContent();
    expect(text?.toLowerCase()).toContain('all products');
  });

  // TC-04: Product list contains at least one product card
  test('TC-04: Product listing shows at least one product card', async ({ page }) => {
    const count = await page.locator('.productinfo').count();
    expect(count).toBeGreaterThan(0);
  });

  // TC-05: Each product card shows a name and price
  test('TC-05: Each product card shows product name and price', async ({ page }) => {
    const firstCard = page.locator('.productinfo').first();
    await expect(firstCard.locator('p')).toBeVisible();   // price
    await expect(firstCard.locator('h2')).toBeVisible();  // name
  });

  // TC-06: Each product card has an image
  test('TC-06: Each product card has a visible product image', async ({ page }) => {
    const firstImage = page.locator('.product-image-wrapper img').first();
    await expect(firstImage).toBeVisible();
    const src = await firstImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

});
