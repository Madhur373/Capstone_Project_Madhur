// tests/payments/paymentHelper.js

const BASE_URL     = 'https://automationexercise.com';
const LOGIN_URL    = `${BASE_URL}/login`;
const PRODUCTS_URL = `${BASE_URL}/products`;
const CART_URL     = `${BASE_URL}/view_cart`;
const CHECKOUT_URL = `${BASE_URL}/checkout`;
const PAYMENT_URL  = `${BASE_URL}/payment`;

const VALID_EMAIL    = 'madhursm373@gmail.in';
const VALID_PASSWORD = 'a@A7s@HgARvGCcP';

const VALID_CARD = {
  nameOnCard  : 'Test User',
  cardNumber  : '4111111111111111',
  cvc         : '123',
  expiryMonth : '12',
  expiryYear  : '2027',
};

const INVALID_CARD = {
  nameOnCard  : 'Bad User',
  cardNumber  : '1234567890123456',
  cvc         : '000',
  expiryMonth : '01',
  expiryYear  : '2020',
};

/**
 * Logs in with valid credentials.
 * Uses domcontentloaded + explicit waits to avoid timeout issues.
 */
async function loginAsTestUser(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-qa="login-email"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
  await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
  await page.locator('[data-qa="login-button"]').click();
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });
  await page.locator('#header').waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Adds the first product to the cart and dismisses the modal.
 */
async function addProductToCart(page) {
  await page.goto(PRODUCTS_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('.productinfo').first().hover();
  await page.locator('.productinfo').first().locator('a.add-to-cart').first().click();
  await page.locator('button:has-text("Continue Shopping")').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('button:has-text("Continue Shopping")').click();
}

/**
 * Full setup: login → add product → cart → checkout → payment page.
 * Lands on /payment with the card form visible.
 */
async function setupCartAndCheckout(page) {
  await loginAsTestUser(page);
  await addProductToCart(page);
  await page.goto(CART_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('a:has-text("Proceed To Checkout")').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('a:has-text("Proceed To Checkout")').click();
  await page.waitForURL(/checkout/, { timeout: 20000 });
  await page.locator('a:has-text("Place Order")').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('a:has-text("Place Order")').click();
  await page.waitForURL(/payment/, { timeout: 20000 });
  await page.locator('[data-qa="name-on-card"]').waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Fills the payment form. Does NOT submit.
 */
async function fillPaymentForm(page, card = VALID_CARD) {
  await page.locator('[data-qa="name-on-card"]').fill(card.nameOnCard);
  await page.locator('[data-qa="card-number"]').fill(card.cardNumber);
  await page.locator('[data-qa="cvc"]').fill(card.cvc);
  await page.locator('[data-qa="expiry-month"]').fill(card.expiryMonth);
  await page.locator('[data-qa="expiry-year"]').fill(card.expiryYear);
}

module.exports = {
  BASE_URL, LOGIN_URL, PRODUCTS_URL, CART_URL, CHECKOUT_URL, PAYMENT_URL,
  VALID_EMAIL, VALID_PASSWORD,
  VALID_CARD, INVALID_CARD,
  loginAsTestUser, addProductToCart, setupCartAndCheckout, fillPaymentForm,
};