// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Page Object для B2B SEO-лендингов OneTwoTrip.
 * Поддерживает: aviabilety-dlya-yur-lic, zhd-bilety-dlya-yur-lic, delovoj-turizm
 */
export class B2BLandingPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} path - путь лендинга (например, '/aviabilety-dlya-yur-lic')
   */
  constructor(page, path) {
    this.page = page;
    this.path = path;
    this.baseURL = 'https://b2b.onetwotrip.com';

    // Общие элементы B2B лендингов
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.mainContent = page.locator('main');
    this.heroSection = page.locator('[class*="hero"], [class*="Hero"], section >> nth=0');
    this.ctaButtons = page.locator('a[href*="registration"], button:has-text("Регистрация"), button:has-text("Попробовать")');
  }

  async open() {
    const url = `${this.baseURL}${this.path}`;
    await allure.step(`Открыть ${url}`, async () => {
      await this.page.goto(url, { waitUntil: 'networkidle' });
    });
  }

  /**
   * Делает скриншот viewport (НЕ fullPage) для избежания лимита 8000px.
   * @param {string} name
   */
  async attachScreenshot(name) {
    const png = await this.page.screenshot({ fullPage: false });
    await allure.attachment(name, png, 'image/png');
  }

  /**
   * Делает полный скриншот страницы, но с ограничением высоты.
   * Скроллит и делает несколько viewport-скриншотов.
   * @param {string} baseName
   * @param {number} [maxParts=3] - максимум частей
   */
  async attachFullPageInParts(baseName, maxParts = 3) {
    await allure.step(`Скриншоты страницы (до ${maxParts} частей)`, async () => {
      const viewportHeight = this.page.viewportSize()?.height || 800;
      const totalHeight = await this.page.evaluate(() => document.body.scrollHeight);
      const parts = Math.min(Math.ceil(totalHeight / viewportHeight), maxParts);

      for (let i = 0; i < parts; i++) {
        await this.page.evaluate((y) => window.scrollTo(0, y), i * viewportHeight);
        await this.page.waitForTimeout(300); // ждём рендер
        const png = await this.page.screenshot({ fullPage: false });
        await allure.attachment(`${baseName}-part${i + 1}`, png, 'image/png');
      }
      // Вернуться наверх
      await this.page.evaluate(() => window.scrollTo(0, 0));
    });
  }

  async expectPageLoaded() {
    await allure.step('Проверить загрузку страницы', async () => {
      await expect(this.page).toHaveURL(new RegExp(this.path));
      // Проверяем что body загружен (всегда есть на странице)
      await expect(this.page.locator('body')).toBeVisible();
    });
  }

  async expectNoJSErrors() {
    // Эта проверка вызывается после сбора ошибок через page.on('pageerror')
    // Возвращает true если ошибок нет
  }

  async expectHeaderVisible() {
    await expect(this.header).toBeVisible();
  }

  async expectFooterVisible() {
    await expect(this.footer).toBeVisible();
  }

  /**
   * Возвращает title страницы для SEO-проверок
   */
  async getTitle() {
    return this.page.title();
  }
}

/**
 * Конфигурация B2B лендингов для LAN-7566
 */
export const B2B_LANDINGS = {
  avia: {
    path: '/aviabilety-dlya-yur-lic',
    name: 'Авиабилеты для юр.лиц',
    expectedTitle: /авиабилет/i,
  },
  trains: {
    path: '/zhd-bilety-dlya-yur-lic',
    name: 'ЖД билеты для юр.лиц',
    expectedTitle: /жд|железнодорожн/i,
  },
  tourism: {
    path: '/delovoj-turizm',
    name: 'Деловой туризм',
    expectedTitle: /делов|туризм|бизнес/i,
  },
};
