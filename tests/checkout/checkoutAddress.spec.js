// @ts-check
const { test, expect } = require('@playwright/test');
const { setupAndGoToCheckout } = require('./checkoutHelper');

/**
 * checkoutAddress.spec.js
 * TC-07 to TC-12 — Tests delivery and billing address sections on checkout.
 */
test.describe('Checkout – Address Details', () => {

  test.beforeEach(async ({ page }) => {
    await setupAndGoToCheckout(page);
  });

  // TC-08: Delivery address contains a name (non-empty first line)
  test('TC-08: Delivery address section contains a non-empty name', async ({ page }) => {
    const nameEl = page.locator('#address_delivery .address_firstname');
    await expect(nameEl).toBeVisible();
    const name = await nameEl.textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
  });

  // TC-09: Delivery address contains a country field
  test('TC-09: Delivery address section contains country information', async ({ page }) => {
    const country = page.locator('#address_delivery .address_country_name');
    await expect(country).toBeVisible();
    const countryText = await country.textContent();
    expect(countryText?.trim().length).toBeGreaterThan(0);
  });

  // TC-10: Billing address section contains a name
  test('TC-10: Billing address section contains a non-empty name', async ({ page }) => {
    const nameEl = page.locator('#address_invoice .address_firstname');
    await expect(nameEl).toBeVisible();
    const name = await nameEl.textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
  });

  // TC-11: Billing address section contains country information
  test('TC-11: Billing address section contains country information', async ({ page }) => {
    const country = page.locator('#address_invoice .address_country_name');
    await expect(country).toBeVisible();
    const countryText = await country.textContent();
    expect(countryText?.trim().length).toBeGreaterThan(0);
  });

  // TC-12: Delivery and billing address names match (same account)
  test('TC-12: Delivery and billing address names match each other', async ({ page }) => {
    const deliveryName = await page.locator('#address_delivery .address_firstname').textContent();
    const billingName  = await page.locator('#address_invoice .address_firstname').textContent();
    expect(deliveryName?.trim()).toBe(billingName?.trim());
  });

});
