// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, safeGoto, goToProducts, BASE_URL } = require('./productHelper');

/**
 * productDetail.spec.js
 * TC-13 to TC-18 — Tests product detail page content and interactions.
 */
test.describe('Products – Detail Page', () => {

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await goToProducts(page);
  });

  // TC-13: Clicking "View Product" navigates to the product detail page
  test('TC-13: Clicking "View Product" link opens the product detail page', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    expect(page.url()).toContain('/product_details/');
  });

  // TC-14: Product detail page shows product name
  test('TC-14: Product detail page displays the product name', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    await expect(page.locator('.product-information h2')).toBeVisible();
    const name = await page.locator('.product-information h2').textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
  });

  // TC-15: Product detail page shows category
  test('TC-15: Product detail page displays product category', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    const categoryText = await page.locator('.product-information p').first().textContent();
    expect(categoryText?.toLowerCase()).toContain('category');
  });

  // TC-16: Product detail page shows price
  test('TC-16: Product detail page displays product price', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    await expect(page.locator('.product-information span span')).toBeVisible();
    const price = await page.locator('.product-information span span').textContent();
    expect(price).toContain('Rs.');
  });

  // TC-17: Product detail page shows availability status
  test('TC-17: Product detail page shows availability status', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    const pageText = await page.locator('.product-information').textContent();
    expect(pageText?.toLowerCase()).toContain('availability');
  });

  // TC-18: Product detail page has quantity input field
  test('TC-18: Product detail page has a quantity input field', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    await expect(page.locator('#quantity')).toBeVisible();
    const qty = await page.locator('#quantity').inputValue();
    expect(Number(qty)).toBeGreaterThanOrEqual(1);
  });

});
