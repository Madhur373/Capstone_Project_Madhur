// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, safeGoto, goToProducts, loginAsTestUser, BASE_URL } = require('./productHelper');


test.describe('Products – Add to Cart', () => {

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await goToProducts(page);
  });

  test('TC-26: Hovering a product card reveals the "Add to cart" button', async ({ page }) => {
    const firstCard = page.locator('.productinfo').first();
    await firstCard.hover();
    await expect(firstCard.locator('a.add-to-cart')).toBeVisible();
  });

  
  test('TC-27: Clicking "Add to cart" opens the success confirmation modal', async ({ page }) => {
    const firstCard = page.locator('.productinfo').first();
    await firstCard.hover();
    await firstCard.locator('a.add-to-cart').first().click();
    await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
    await expect(page.locator('.modal-content')).toBeVisible();
  });


  test('TC-28: Confirmation modal contains "Continue Shopping" button', async ({ page }) => {
    const firstCard = page.locator('.productinfo').first();
    await firstCard.hover();
    await firstCard.locator('a.add-to-cart').first().click();
    await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
    await expect(page.locator('button:has-text("Continue Shopping")')).toBeVisible();
  });

  test('TC-29: Confirmation modal contains "View Cart" link', async ({ page }) => {
    const firstCard = page.locator('.productinfo').first();
    await firstCard.hover();
    await firstCard.locator('a.add-to-cart').first().click();
    await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
    await expect(page.locator('.modal-content a[href="/view_cart"]')).toBeVisible();
  });

  
  test('TC-30: "Add to cart" on product detail page adds item and shows modal', async ({ page }) => {
    await page.locator('a[href*="/product_details/"]').first().click();
    await page.waitForURL(/product_details/, { timeout: 20000 });
    await page.locator('button:has-text("Add to cart")').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('button:has-text("Add to cart")').click();
    await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
    await expect(page.locator('.modal-content')).toBeVisible();
  });

});
