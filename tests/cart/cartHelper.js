// tests/cart/cartHelper.js

const BASE_URL     = 'https://automationexercise.com';
const LOGIN_URL    = `${BASE_URL}/login`;
const PRODUCTS_URL = `${BASE_URL}/products`;
const CART_URL     = `${BASE_URL}/view_cart`;

const VALID_EMAIL    = 'madhursm373@gmail.in';
const VALID_PASSWORD = 'a@A7s@HgARvGCcP';

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

/** Blocks all ad/tracker requests. MUST be called before any page.goto(). */
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

/**
 * Adds the nth product (1-based index) to the cart and dismisses the modal.
 * @param {number} index - 1-based product index on the products page
 */
async function addProductToCart(page, index = 1) {
  await safeGoto(page, PRODUCTS_URL);
  await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
  const card = page.locator('.productinfo').nth(index - 1);
  await card.hover();
  await card.locator('a.add-to-cart').first().click();
  await page.locator('.modal-content').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('button:has-text("Continue Shopping")').click();
  await page.locator('.modal-content').waitFor({ state: 'hidden', timeout: 10000 });
}

/**
 * Full setup: blockAds → login → add product(s) → navigate to cart.
 * @param {number[]} indices - array of 1-based product indices to add (default: [1])
 */
async function setupCart(page, indices = [1]) {
  await blockAds(page);
  await loginAsTestUser(page);
  for (const i of indices) {
    await addProductToCart(page, i);
  }
  await safeGoto(page, CART_URL);
  await page.locator('#cart_info_table').waitFor({ state: 'visible', timeout: 30000 });
}

/**
 * Setup cart as a GUEST (no login). blockAds → add product → navigate to cart.
 */
async function setupCartAsGuest(page, index = 1) {
  await blockAds(page);
  await page.context().clearCookies();
  await addProductToCart(page, index);
  await safeGoto(page, CART_URL);
  await page.locator('#cart_info_table').waitFor({ state: 'visible', timeout: 30000 });
}

module.exports = {
  BASE_URL, LOGIN_URL, PRODUCTS_URL, CART_URL,
  VALID_EMAIL, VALID_PASSWORD,
  blockAds, safeGoto, loginAsTestUser,
  addProductToCart, setupCart, setupCartAsGuest,
};
