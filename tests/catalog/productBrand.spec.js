// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, safeGoto, BASE_URL } = require('./productHelper');

/**
 * productBrand.spec.js
 * TC-23 to TC-25 — Tests brand sidebar filtering.
 */
test.describe('Products – Brand Filter', () => {

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await safeGoto(page, `${BASE_URL}/products`);
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
  });

  // TC-23: Brands panel is visible on the products page
  test('TC-23: Brands panel is visible on the left sidebar', async ({ page }) => {
    await page.locator('.brands_products').scrollIntoViewIfNeeded();
    await expect(page.locator('.brands_products')).toBeVisible();
    await expect(page.locator('.brands_products h2')).toContainText('Brands');
  });

  // TC-24: Clicking a brand filters products by that brand
  test('TC-24: Clicking a brand link filters products and updates URL', async ({ page }) => {
    await page.locator('.brands_products').scrollIntoViewIfNeeded();
    const firstBrandLink = page.locator('.brands_products ul li a').first();
    await firstBrandLink.click();
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 20000 });
    expect(page.url()).toContain('/brand_products/');
  });

});
