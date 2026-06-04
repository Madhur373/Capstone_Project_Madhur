// tests/payments/paymentHelper.js
// Shared utilities for the payments test suite

const BASE_URL       = 'https://automationexercise.com';
const LOGIN_URL      = `${BASE_URL}/login`;
const PRODUCTS_URL   = `${BASE_URL}/products`;
const CART_URL       = `${BASE_URL}/view_cart`;
const CHECKOUT_URL   = `${BASE_URL}/checkout`;
const PAYMENT_URL    = `${BASE_URL}/payment`;

const VALID_EMAIL    = 'madhursm373@gmail.in';
const VALID_PASSWORD = 'a@A7s@HgARvGCcP';

// ── Dummy card data (all fake, safe for testing) ──────────────────────────
const VALID_CARD = {
  nameOnCard  : 'Test User',
  cardNumber  : '4111111111111111',   // standard Visa test PAN (Luhn-valid)
  cvc         : '123',
  expiryMonth : '12',
  expiryYear  : '2027',
};

const INVALID_CARD = {
  nameOnCard  : 'Bad User',
  cardNumber  : '1234567890123456',   // invalid number
  cvc         : '000',
  expiryMonth : '01',
  expiryYear  : '2020',              // expired year
};

/**
 * Logs in with the registered test account.
 * Waits for redirect away from /login as the success signal.
 */
async function loginAsTestUser(page) {
  await page.goto(LOGIN_URL);
  await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
  await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
  await page.locator('[data-qa="login-button"]').click();
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });
  await page.locator('#header').waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Adds the first product on the products page to the cart
 * and dismisses the confirmation modal.
 */
async function addProductToCart(page) {
  await page.goto(PRODUCTS_URL);
  const firstCard = page.locator('.productinfo').first();
  await firstCard.hover();
  await firstCard.locator('a.add-to-cart').first().click();
  await page.locator('button:has-text("Continue Shopping")').click();
}

/**
 * Full setup: login → add product → go to cart → proceed to checkout.
 * Lands on the /checkout page ready for address review.
 */
async function setupCartAndCheckout(page) {
  await loginAsTestUser(page);
  await addProductToCart(page);
  await page.goto(CART_URL);
  await page.locator('a:has-text("Proceed To Checkout")').click();
  // On /checkout, click "Place Order" to get to the payment form
  await page.locator('a:has-text("Place Order")').click();
  await page.waitForURL(/payment/, { timeout: 20000 });
}

/**
 * Fills the payment form with the given card data but does NOT submit.
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
