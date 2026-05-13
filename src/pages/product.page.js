// @ts-check
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

export class ProductPage extends BasePage {
  constructor(page, slug = '') {
    super(page, `/${slug.replace(/^\//, '')}`);

    this.title = page.locator('.product-name h1');
    this.price = page.locator('.product-price .price-value, .price-value-31, .price.actual-price, .product-price');
    this.qtyInput = page.locator('input.qty-input');
    this.addToCartBtn = page.locator('input.add-to-cart-button');
  }

  async addToCart() {
    await allure.step('Add product to cart', async () => {
      await this.addToCartBtn.click();
    });
  }

  async getTitle() {
    return (await this.title.innerText()).trim();
  }
}
