// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Common Page Object base class.
 * Holds the Playwright Page and provides shared navigation,
 * Allure step wrappers and reusable assertions used by every page.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} [path]
   */
  constructor(page, path = '/') {
    this.page = page;
    this.path = path;

    // Header / shell — selectors that exist on every page of the shop.
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

  /**
   * Делает скриншот текущего viewport и прикрепляет его к Allure-отчёту.
   * Используется в ключевых шагах (после успешных действий, перед assert),
   * чтобы по отчёту можно было визуально верифицировать результат, не
   * заглядывая в видео.
   *
   * @param {string} name Имя attachment в Allure.
   */
  async attachScreenshot(name) {
    const png = await this.page.screenshot({ fullPage: false });
    await allure.attachment(name, png, 'image/png');
  }

  async expectOpened() {
    await expect(this.page).toHaveURL(new RegExp(this.path.replace('/', '\\/') + '$'));
  }

  /** Header search — used as a smoke check in multiple specs. */
  async search(query) {
    await allure.step(`Search for "${query}"`, async () => {
      await this.searchInput.fill(query);
      await this.searchButton.click();
    });
  }

  async expectCartCount(count) {
    await expect(this.cartQty).toHaveText(`(${count})`);
  }

  async expectLoggedInAs(email) {
    await expect(this.accountLink).toHaveText(email);
    await expect(this.logoutLink).toBeVisible();
  }
}
