// @ts-check
import { allure } from 'allure-playwright';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} [path]
   */
  constructor(page, path = '/') {
    this.page = page;
    this.path = path;

    this.header = page.locator('.header');
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.search-box-button');
    this.cartLink = page.locator('a.ico-cart');
    this.cartQty = page.locator('span.cart-qty');
    this.accountLink = page.locator('.header-links a.account');
    this.logoutLink = page.locator('.header-links a.ico-logout');
    this.barNotification = page.locator('#bar-notification');
  }

  async open() {
    await allure.step(`Open page ${this.path}`, async () => {
      await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    });
  }

  async search(query) {
    await allure.step(`Search for "${query}"`, async () => {
      await this.searchInput.fill(query);
      await this.searchButton.click();
    });
  }
}
