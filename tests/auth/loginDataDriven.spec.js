// @ts-check
const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://automationexercise.com/login';

// ── Data table ──────────────────────────────────────────────────────────────
const loginTestData = [
  {
    id: 'TC-18a',
    description: 'Valid credentials → login succeeds',
    email: 'madhursm373@gmail.in',
    password: 'a@A7s@HgARvGCcP',
    expectSuccess: true,
  },
  {
    id: 'TC-18b',
    description: 'Wrong password → error shown',
    email: 'madhursm373@gmail.in',
    password: 'WrongPassword!99',
    expectSuccess: false,
  },
  {
    id: 'TC-18c',
    description: 'Non-existent email → error shown',
    email: 'nouser_xyz@fake.com',
    password: 'SomePass@123',
    expectSuccess: false,
  },
  {
    id: 'TC-18d',
    description: 'Empty email → browser validation fires',
    email: '',
    password: 'a@A7s@HgARvGCcP',
    expectSuccess: false,
    expectBrowserValidation: true,
  },
];

test.describe('Login – Data Driven', () => {

  for (const data of loginTestData) {
    test(`${data.id}: ${data.description}`, async ({ page }) => {
      await page.goto(LOGIN_URL);

      await page.locator('[data-qa="login-email"]').fill(data.email);
      await page.locator('[data-qa="login-password"]').fill(data.password);
      await page.locator('[data-qa="login-button"]').click();

      if (data.expectBrowserValidation) {
        const emailInput = page.locator('[data-qa="login-email"]');
        const validationMsg = await emailInput.evaluate(el => el.validationMessage);
        expect(validationMsg).not.toBe('');
      } else if (data.expectSuccess) {
        await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
      } else {
        await expect(
          page.locator('p:has-text("Your email or password is incorrect!")')
        ).toBeVisible();
      }
    });
  }

});
