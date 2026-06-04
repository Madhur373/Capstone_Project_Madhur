// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, safeGoto, BASE_URL } = require('./productHelper');

/**
 * productCategory.spec.js
 * TC-19 to TC-22 — Tests category sidebar filtering on the products page.
 */
test.describe('Products – Category Filter', () => {

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await safeGoto(page, `${BASE_URL}/products`);
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
  });

  // TC-19: Category sidebar is visible on the products page
  test('TC-19: Category sidebar panel is visible on the products page', async ({ page }) => {
    await expect(page.locator('.left-sidebar')).toBeVisible();
    await expect(page.locator('h2:has-text("Category")')).toBeVisible();
  });

  // TC-20: Clicking "Women" category expands sub-categories
  test('TC-20: Clicking "Women" category expands its sub-category list', async ({ page }) => {
    await page.locator('a[href="#Women"]').click();
    await page.locator('#Women').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('#Women')).toBeVisible();
  });

  // TC-21: Clicking a Women sub-category filters products and updates URL
  test('TC-21: Clicking "Dress" under Women filters products correctly', async ({ page }) => {
    await page.locator('a[href="#Women"]').click();
    await page.locator('#Women').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('#Women a').first().click();
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 20000 });
    expect(page.url()).toContain('/category_products/');
  });

  // TC-22: Clicking "Men" category expands its sub-categories
  test('TC-22: Clicking "Men" category expands its sub-category list', async ({ page }) => {
    await page.locator('a[href="#Men"]').click();
    await page.locator('#Men').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('#Men')).toBeVisible();
  });

});
