// tests/checkout/checkoutHelper.js

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

// Ad/tracker domains that hang headless Chromium
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
];

/** Blocks all ad/tracker requests. Call before any page.goto(). */
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

/** Navigates using domcontentloaded so ads never block the load. */
async function safeGoto(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
}

/** Logs in with the test account. */
async function loginAsTestUser(page) {
  await safeGoto(page, LOGIN_URL);
  await page.locator('[data-qa="login-email"]').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('[data-qa="login-email"]').fill(VALID_EMAIL);
  await page.locator('[data-qa="login-password"]').fill(VALID_PASSWORD);
  await page.locator('[data-qa="login-button"]').click();
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 45000 });
  await page.locator('#header').waitFor({ state: 'visible', timeout: 20000 });
}

/** Adds the first product to cart and dismisses the modal. */
async function addProductToCart(page) {
  await safeGoto(page, PRODUCTS_URL);
  await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('.productinfo').first().hover();
  await page.locator('.productinfo').first().locator('a.add-to-cart').first().click();
  await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('button:has-text("Continue Shopping")').click();
  await page.locator('.modal-content').waitFor({ state: 'hidden', timeout: 10000 });
}

/**
 * Full setup: blockAds → login → add product → go to cart → click Proceed To Checkout.
 * Lands on /checkout page with address and order summary visible.
 */
async function setupAndGoToCheckout(page) {
  await blockAds(page);
  await loginAsTestUser(page);
  await addProductToCart(page);
  await safeGoto(page, CART_URL);
  await page.locator('a:has-text("Proceed To Checkout")').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('a:has-text("Proceed To Checkout")').click();
  await page.locator('#cart_info').waitFor({ state: 'visible', timeout: 30000 });
}

/**
 * Fills card details and completes payment. Used for end-to-end tests.
 */
async function completePayment(page) {
  await page.locator('a:has-text("Place Order")').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('a:has-text("Place Order")').click();
  await page.locator('[data-qa="name-on-card"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('[data-qa="name-on-card"]').fill(VALID_CARD.nameOnCard);
  await page.locator('[data-qa="card-number"]').fill(VALID_CARD.cardNumber);
  await page.locator('[data-qa="cvc"]').fill(VALID_CARD.cvc);
  await page.locator('[data-qa="expiry-month"]').fill(VALID_CARD.expiryMonth);
  await page.locator('[data-qa="expiry-year"]').fill(VALID_CARD.expiryYear);
  await page.locator('[data-qa="pay-button"]').click();
  await page.waitForURL(/payment_done/, { timeout: 30000 });
}

module.exports = {
  BASE_URL, LOGIN_URL, PRODUCTS_URL, CART_URL, CHECKOUT_URL, PAYMENT_URL,
  VALID_EMAIL, VALID_PASSWORD, VALID_CARD,
  blockAds, safeGoto, loginAsTestUser, addProductToCart,
  setupAndGoToCheckout, completePayment,
};
