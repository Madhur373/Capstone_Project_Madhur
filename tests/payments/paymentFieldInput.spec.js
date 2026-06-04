// @ts-check
const { test, expect } = require('@playwright/test');
const {
  setupCartAndCheckout,
  fillPaymentForm,
  VALID_CARD,
} = require('./paymentHelper');

/**
 * paymentFieldInput.spec.js
 * TC-09 to TC-15 — Verifies that each payment form field
 * accepts input correctly and retains the entered value.
 */
test.describe('Payment – Field Input Behaviour', () => {

  test.beforeEach(async ({ page }) => {
    await setupCartAndCheckout(page);
  });

  // TC-09: "Name on Card" field accepts text and retains value
  test('TC-09: "Name on Card" field accepts and retains text input', async ({ page }) => {
    const field = page.locator('[data-qa="name-on-card"]');
    await field.fill(VALID_CARD.nameOnCard);
    await expect(field).toHaveValue(VALID_CARD.nameOnCard);
  });

  // TC-10: "Card Number" field accepts 16-digit number
  test('TC-10: "Card Number" field accepts a 16-digit card number', async ({ page }) => {
    const field = page.locator('[data-qa="card-number"]');
    await field.fill(VALID_CARD.cardNumber);
    await expect(field).toHaveValue(VALID_CARD.cardNumber);
  });

  // TC-11: CVC field accepts 3-digit value
  test('TC-11: CVC field accepts a 3-digit security code', async ({ page }) => {
    const field = page.locator('[data-qa="cvc"]');
    await field.fill(VALID_CARD.cvc);
    await expect(field).toHaveValue(VALID_CARD.cvc);
  });

  // TC-12: Expiry Month field accepts numeric month value
  /*test('TC-12: Expiry Month field accepts a valid month value', async ({ page }) => {
    const field = page.locator('[data-qa="expiry-month"]');
    await field.fill(VALID_CARD.expiryMonth);
    await expect(field).toHaveValue(VALID_CARD.expiryMonth);
  });*/

  // TC-13: Expiry Year field accepts a future year
  test('TC-13: Expiry Year field accepts a future year value', async ({ page }) => {
    const field = page.locator('[data-qa="expiry-year"]');
    await field.fill(VALID_CARD.expiryYear);
    await expect(field).toHaveValue(VALID_CARD.expiryYear);
  });

  // TC-14: All fields can be filled together without conflict
  test('TC-14: All payment fields can be filled simultaneously without conflict', async ({ page }) => {
    await fillPaymentForm(page, VALID_CARD);
    await expect(page.locator('[data-qa="name-on-card"]')).toHaveValue(VALID_CARD.nameOnCard);
    await expect(page.locator('[data-qa="card-number"]')).toHaveValue(VALID_CARD.cardNumber);
    await expect(page.locator('[data-qa="cvc"]')).toHaveValue(VALID_CARD.cvc);
    await expect(page.locator('[data-qa="expiry-month"]')).toHaveValue(VALID_CARD.expiryMonth);
    await expect(page.locator('[data-qa="expiry-year"]')).toHaveValue(VALID_CARD.expiryYear);
  });

  // TC-15: "Name on Card" field is cleared and re-filled correctly
  test('TC-15: "Name on Card" field can be cleared and re-entered', async ({ page }) => {
    const field = page.locator('[data-qa="name-on-card"]');
    await field.fill('Wrong Name');
    await field.clear();
    await field.fill(VALID_CARD.nameOnCard);
    await expect(field).toHaveValue(VALID_CARD.nameOnCard);
  });

});
