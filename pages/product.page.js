class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://automationexercise.com');
  }

  async openCart() {
    await this.page.getByRole('link', { name: 'Cart' }).click();
  }

  async openProductsPage() {
    await this.page.getByRole('link', { name: 'Products' }).click();
  }

  async openFirstProduct() {
    await this.page.locator('a[href*="product_details"]').first().click();
  }

  async addFirstProductToCart() {
    await this.page.locator('.add-to-cart').first().click();
  }

  async continueShopping() {
  }
}

module.exports = ProductPage;