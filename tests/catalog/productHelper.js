// tests/catalog/productHelper.js

const BASE_URL     = 'https://automationexercise.com';
const PRODUCTS_URL = `${BASE_URL}/products`;
const LOGIN_URL    = `${BASE_URL}/login`;

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

/** Navigates to products page and waits for product cards to appear. */
async function goToProducts(page) {
  await safeGoto(page, PRODUCTS_URL);
  await page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 30000 });
}

module.exports = {
  BASE_URL, PRODUCTS_URL, LOGIN_URL,
  VALID_EMAIL, VALID_PASSWORD,
  blockAds, safeGoto, loginAsTestUser, goToProducts,
};
