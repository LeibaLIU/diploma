// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page, '/');

    this.newsletterEmail = page.locator('#newsletter-email');
    this.newsletterSubscribeBtn = page.locator('#newsletter-subscribe-button');
    this.newsletterResult = page.locator('#newsletter-result-block');
    this.featuredProducts = page.locator('.product-grid .product-item');
  }

  async subscribeToNewsletter(email) {
    await allure.step(`Subscribe to newsletter with "${email}"`, async () => {
      await this.newsletterEmail.fill(email);
      await this.newsletterSubscribeBtn.click();
    });
  }

  async expectSubscribeSuccess() {
    await allure.step('Expect newsletter success', async () => {
      await expect(this.newsletterResult).toContainText(
        'Thank you for signing up',
        { timeout: 10_000 }
      );
      await this.attachScreenshot('Newsletter success');
    });
  }

  async expectFeaturedProductsVisible() {
    await expect(this.featuredProducts.first()).toBeVisible();
    expect(await this.featuredProducts.count()).toBeGreaterThan(0);
  }
}
