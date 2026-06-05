// tests/helpers/globalHelper.js
// Single source of truth for all test suites.
// Handles ad-blocking, safe navigation, and login reliably on both
// local Windows and GitHub Actions Ubuntu environments.

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

// ─── Ad domains that stall headless Chromium on CI ───────────────────────────
const AD_DOMAINS = [
  'googlesyndication.com',
  'googletagmanager.com',
  'googletagservices.com',
  'doubleclick.net',
  'google-analytics.com',
  'adservice.google.com',
  'amazon-adsystem.com',
  'facebook.net',
  'scorecardresearch.com',
  'quantserve.com',
  'taboola.com',
  'outbrain.com',
  'adnxs.com',
  'pagead2.googlesyndication.com',
  'securepubads.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'cm.g.doubleclick.net',
  'stats.g.doubleclick.net',
];

/**
 * Blocks all ad/tracker network requests.
 * MUST be called before any page.goto().
 */
async function blockAds(page) {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (AD_DOMAINS.some(d => url.includes(d))) {
      route.abort();
    } else {
      route.continue();
    }
  });
}

/**
 * Safe navigation — uses domcontentloaded so ad scripts
 * never block the page from being "ready".
 */
async function safeGoto(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  } catch (e) {
    // If even domcontentloaded times out, wait for body directly
    await page.waitForSelector('body', { timeout: 20000 });
  }
}

/**
 * Waits for an element with a longer CI-aware timeout.
 */
async function waitFor(page, selector, timeout = 45000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

/**
 * Logs in with valid credentials.
 * blockAds() must already be active on the page before calling this.
 */
async function loginAsTestUser(page) {
  await safeGoto(page, LOGIN_URL);
  await waitFor(page, '[data-qa="login-email"]');
  await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
  await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);

  // Small delay before clicking — CI needs a moment for JS to attach listeners
  await page.waitForTimeout(500);
  await page.locator('[data-qa="login-button"]').click();

  // Wait for redirect away from /login
  await page.waitForURL(
    url => !url.toString().includes('/login'),
    { timeout: 60000 }
  );
  await waitFor(page, '#header');
}

/**
 * Adds the nth product (1-based) to cart and dismisses the modal.
 */
async function addProductToCart(page, index = 1) {
  await safeGoto(page, PRODUCTS_URL);
  await waitFor(page, '.productinfo');

  const card = page.locator('.productinfo').nth(index - 1);
  await card.waitFor({ state: 'visible', timeout: 30000 });
  await card.hover();

  // Small pause after hover so the overlay renders
  await page.waitForTimeout(500);
  await card.locator('a.add-to-cart').first().click();

  await waitFor(page, '.modal-content');
  await page.locator('button:has-text("Continue Shopping")').click();
  await page.locator('.modal-content').waitFor({ state: 'hidden', timeout: 15000 });
}

/**
 * blockAds → login → add products → go to cart page.
 * @param {number[]} indices - 1-based product indices to add
 */
async function setupCart(page, indices = [1]) {
  await blockAds(page);
  await loginAsTestUser(page);
  for (const i of indices) {
    await addProductToCart(page, i);
  }
  await safeGoto(page, CART_URL);
  await waitFor(page, '#cart_info_table');
}

/**
 * blockAds → login → add product → cart → checkout page.
 */
async function setupAndGoToCheckout(page) {
  await blockAds(page);
  await loginAsTestUser(page);
  await addProductToCart(page, 1);
  await safeGoto(page, CART_URL);
  await waitFor(page, 'a:has-text("Proceed To Checkout")');
  await page.locator('a:has-text("Proceed To Checkout")').click();
  await waitFor(page, '#cart_info');
}

/**
 * blockAds → login → add product → cart → checkout → payment page.
 */
async function setupCartAndCheckout(page) {
  await setupAndGoToCheckout(page);
  await waitFor(page, 'a:has-text("Place Order")');
  await page.locator('a:has-text("Place Order")').click();
  await waitFor(page, '[data-qa="name-on-card"]');
}

/**
 * Fills payment form fields. Does NOT submit.
 */
async function fillPaymentForm(page, card = VALID_CARD) {
  await page.locator('[data-qa="name-on-card"]').fill(card.nameOnCard);
  await page.locator('[data-qa="card-number"]').fill(card.cardNumber);
  await page.locator('[data-qa="cvc"]').fill(card.cvc);
  await page.locator('[data-qa="expiry-month"]').fill(card.expiryMonth);
  await page.locator('[data-qa="expiry-year"]').fill(card.expiryYear);
}

/**
 * Completes payment after setupCartAndCheckout().
 * Waits for /payment_done confirmation.
 */
async function completePayment(page) {
  await fillPaymentForm(page, VALID_CARD);
  await page.locator('[data-qa="pay-button"]').click();
  await page.waitForURL(/payment_done/, { timeout: 45000 });
}

module.exports = {
  BASE_URL, LOGIN_URL, PRODUCTS_URL, CART_URL, CHECKOUT_URL, PAYMENT_URL,
  VALID_EMAIL, VALID_PASSWORD, VALID_CARD,
  blockAds, safeGoto, waitFor,
  loginAsTestUser, addProductToCart,
  setupCart, setupAndGoToCheckout, setupCartAndCheckout,
  fillPaymentForm, completePayment,
};