// @ts-check
const { test, expect } = require('@playwright/test');
const { blockAds, goToProducts } = require('./productHelper');

test.describe('Products – Search', () => {

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await goToProducts(page);
  });

  // TC-07: Search box is visible on the products page
  test('TC-07: Search input box is visible on products page', async ({ page }) => {
    await expect(page.locator('#search_product')).toBeVisible();
  });

  // TC-08: Search submit button is visible
  test('TC-08: Search submit button is visible on products page', async ({ page }) => {
    await expect(page.locator('#submit_search')).toBeVisible();
  });

  // TC-09: Searching for a valid product returns results
  test('TC-09: Searching "Top" returns matching product results', async ({ page }) => {
    await page.locator('#search_product').fill('Top');
    await page.locator('#submit_search').click();
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 20000 });
    const count = await page.locator('.productinfo').count();
    expect(count).toBeGreaterThan(0);
  });

  // TC-10: Search results heading updates to "Searched Products"
  test('TC-10: Heading changes to "Searched Products" after search', async ({ page }) => {
    await page.locator('#search_product').fill('Dress');
    await page.locator('#submit_search').click();
    await page.locator('h2.title.text-center').waitFor({ state: 'visible', timeout: 20000 });
    const heading = await page.locator('h2.title.text-center').first().textContent();
    expect(heading?.toLowerCase()).toContain('searched products');
  });

  // TC-11: Searching for a non-existent product shows no results
  test('TC-11: Searching for a non-existent product shows empty results', async ({ page }) => {
    await page.locator('#search_product').fill('xyznonexistentproduct123');
    await page.locator('#submit_search').click();
    await page.waitForTimeout(2000);
    const count = await page.locator('.productinfo').count();
    expect(count).toBe(0);
  });

  // TC-12: Search input can be cleared and re-searched
  test('TC-12: Search input can be cleared and a new search performed', async ({ page }) => {
    await page.locator('#search_product').fill('Jeans');
    await page.locator('#submit_search').click();
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 20000 });
    // Clear and search again
    await page.locator('#search_product').clear();
    await page.locator('#search_product').fill('Saree');
    await page.locator('#submit_search').click();
    await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 20000 });
    const count = await page.locator('.productinfo').count();
    expect(count).toBeGreaterThan(0);
  });

});
