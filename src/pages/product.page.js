// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

/**
 * Product Details page. Path is parameterised by product slug.
 */
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

  async expectAddedNotification() {
    await expect(this.barNotification).toContainText(
      'The product has been added to your',
      { timeout: 10_000 }
    );
  }

  async getTitle() {
    return (await this.title.innerText()).trim();
  }
}
