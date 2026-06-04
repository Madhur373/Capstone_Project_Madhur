// @ts-check
const { test, expect } = require('@playwright/test');
const {
  setupCartAndCheckout,
  fillPaymentForm,
  VALID_CARD,
  INVALID_CARD,
} = require('./paymentHelper');

/**
 * paymentValidation.spec.js
 * TC-21 to TC-25 — Tests form-level validation: empty fields,
 * partial submission, and browser-native required-field enforcement.
 */
test.describe('Payment – Form Validation', () => {

  test.beforeEach(async ({ page }) => {
    await setupCartAndCheckout(page);
  });

  // TC-21: Submitting empty form triggers browser validation on Name on Card
  test('TC-21: Submitting empty payment form triggers browser required-field validation', async ({ page }) => {
    await page.locator('[data-qa="pay-button"]').click();
    const nameField = page.locator('[data-qa="name-on-card"]');
    const validationMsg = await nameField.evaluate(el => el.validationMessage);
    expect(validationMsg).not.toBe('');
  });

  // TC-22: Submitting with only Name on Card triggers validation on Card Number
  test('TC-22: Missing card number triggers browser validation after name is filled', async ({ page }) => {
    await page.locator('[data-qa="name-on-card"]').fill(VALID_CARD.nameOnCard);
    await page.locator('[data-qa="pay-button"]').click();
    const cardField = page.locator('[data-qa="card-number"]');
    const validationMsg = await cardField.evaluate(el => el.validationMessage);
    expect(validationMsg).not.toBe('');
  });

  // TC-23: Submitting without CVC triggers validation on CVC field
  test('TC-23: Missing CVC triggers browser validation after card number is filled', async ({ page }) => {
    await page.locator('[data-qa="name-on-card"]').fill(VALID_CARD.nameOnCard);
    await page.locator('[data-qa="card-number"]').fill(VALID_CARD.cardNumber);
    await page.locator('[data-qa="pay-button"]').click();
    const cvcField = page.locator('[data-qa="cvc"]');
    const validationMsg = await cvcField.evaluate(el => el.validationMessage);
    expect(validationMsg).not.toBe('');
  });

  // TC-24: Submitting without expiry month triggers validation
  test('TC-24: Missing expiry month triggers browser validation', async ({ page }) => {
    await page.locator('[data-qa="name-on-card"]').fill(VALID_CARD.nameOnCard);
    await page.locator('[data-qa="card-number"]').fill(VALID_CARD.cardNumber);
    await page.locator('[data-qa="cvc"]').fill(VALID_CARD.cvc);
    await page.locator('[data-qa="pay-button"]').click();
    const monthField = page.locator('[data-qa="expiry-month"]');
    const validationMsg = await monthField.evaluate(el => el.validationMessage);
    expect(validationMsg).not.toBe('');
  });

  // TC-25: Submitting without expiry year triggers validation
  test('TC-25: Missing expiry year triggers browser validation', async ({ page }) => {
    await page.locator('[data-qa="name-on-card"]').fill(VALID_CARD.nameOnCard);
    await page.locator('[data-qa="card-number"]').fill(VALID_CARD.cardNumber);
    await page.locator('[data-qa="cvc"]').fill(VALID_CARD.cvc);
    await page.locator('[data-qa="expiry-month"]').fill(VALID_CARD.expiryMonth);
    await page.locator('[data-qa="pay-button"]').click();
    const yearField = page.locator('[data-qa="expiry-year"]');
    const validationMsg = await yearField.evaluate(el => el.validationMessage);
    expect(validationMsg).not.toBe('');
  });

});
