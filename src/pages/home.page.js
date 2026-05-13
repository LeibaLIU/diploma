// @ts-check
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
}
