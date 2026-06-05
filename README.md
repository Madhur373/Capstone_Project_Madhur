# Enterprise E-Commerce Automation Testing Framework

This project is an enterprise-grade Playwright automation framework developed as part of the Wipro SDET Playwright Capstone Project.

The framework automates key business workflows of the [Automation Exercise](https://automationexercise.com) e-commerce application using Playwright, JavaScript, Node.js, and modern test automation practices.

## Technology Stack

- Playwright
- JavaScript
- Node.js
- Git and GitHub
- GitHub Actions CI/CD
- HTML Reporting
- Allure Reporting
- API Testing

## Project Structure

```text
Capstone_Project_Madhur/
|
+-- .github/
|   +-- workflows/
|       +-- playwright.yml
+-- data/
+-- Docs/
|   +-- Capstone Project.docx
|   +-- Capstone Project.pdf
+-- pages/
|   +-- product.page.js
+-- tests/
|   +-- api/
|   +-- auth/
|   +-- cart/
|   +-- catalog/
|   +-- checkout/
|   +-- helpers/
|   +-- payments/
|   +-- profile/
|   +-- home.spec.js
+-- allure-results/
+-- allure-report/
+-- playwright-report/
+-- test-results/
+-- playwright.config.js
+-- package.json
+-- package-lock.json
+-- README.md
```

## Implemented Modules

- Authentication Module
- Product Catalog Module
- Cart Module
- Checkout Module
- Payment Module
- Profile Module
- API Testing Module
- Home Page Validation Module

## Test Scenarios Covered

### Authentication

- Valid login
- Invalid login
- Empty credential validation
- Wrong password validation
- Signup validation
- Existing user signup validation
- Logout validation
- Logged-in navbar validation
- Data-driven login testing

### Product Catalog

- Product page visibility
- Product search
- Product details validation
- Product metadata validation
- Product quantity validation
- Product category validation
- Product brand validation
- Add-to-cart from product listing
- Add-to-cart from product details

### Cart

- Add single product to cart
- Add multiple products to cart
- Remove product from cart
- Empty cart validation
- Guest cart validation
- Cart item name, price, quantity, and total validation
- Product detail navigation from cart
- Checkout navigation from cart
- Cart persistence after navigation

### Checkout

- Checkout page visibility
- Delivery address validation
- Billing address validation
- Order summary validation
- Comment field validation
- Place order navigation
- Guest checkout modal validation
- End-to-end checkout flow

### Payment

- Payment page visibility
- Payment form field validation
- Card input validation
- Browser required-field validation
- Successful payment confirmation
- Payment done URL validation
- Continue button navigation
- Cart empty validation after order completion

### Profile

- Logged-in username visibility
- Logout link visibility
- Signup/login link hidden after login
- Session persistence
- Account information form validation
- Date of birth dropdown validation

### API Testing

- Get all products API validation
- Unsupported products API method validation
- Get all brands API validation
- Unsupported brands API method validation
- Search product API validation
- Search product without parameter validation
- Verify login API validation
- Invalid login API validation
- Product response body validation
- Brand response body validation

### UI Validation

- Homepage load validation
- Heading visibility
- Button visibility
- Navigation validation
- Modal validation
- Input field validation
- Header and subscription section validation

## Commands

### Install Dependencies

```bash
npm install
```

### Install Playwright Chromium

```bash
npx playwright install chromium
```

### Run All Tests

```bash
npx playwright test
```

### Run a Specific Test File

```bash
npx playwright test tests/auth/userLogin.spec.js
```

### Run a Specific Module

```bash
npx playwright test tests/catalog
```

### Run in Chromium

```bash
npx playwright test --project=chromium
```

### Run in Headed Mode

```bash
npx playwright test --headed
```

### Run in UI Mode

```bash
npx playwright test --ui
```

### Open HTML Report

```bash
npx playwright show-report
```

### Generate Allure Report

```bash
npx allure generate allure-results --clean
```

### Open Allure Report

```bash
npx allure open allure-report
```

## Reporting

The framework supports:

- Playwright HTML Report
- JUnit XML Report
- Allure Report
- Screenshots on failure
- Video recording on failure
- Trace capture on failure
- GitHub Actions report artifacts
- Failure artifacts through `test-results/`

## CI/CD

GitHub Actions workflow is configured in:

```text
.github/workflows/playwright.yml
```

The workflow runs on:

- Push to `main`
- Push to `dev`
- Pull request to `main`
- Manual workflow dispatch

Manual execution supports selecting a specific test folder:

- `tests/auth`
- `tests/cart`
- `tests/catalog`
- `tests/checkout`
- `tests/payments`
- `tests/profile`
- `tests/api`

## Final Execution Result

- 139 / 139 test cases passed
- Stable Chromium execution
- HTML report generated successfully
- Allure report generated successfully
- CI/CD workflow configured successfully

## Project Documentation

Project planner and documentation are available inside:

```text
Docs/
```

## Project Screenshots

Report screenshots are available inside:

```text
screenshot of allure report/
```

## Author

Madhur

Wipro SDET Playwright Capstone Project
