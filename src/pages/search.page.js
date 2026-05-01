// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

export class SearchPage extends BasePage {
  constructor(page) {
    super(page, '/search');

    this.input = page.locator('#q');
    this.searchBtn = page.locator('input.search-button');
    this.products = page.locator('.product-item');
    this.productTitles = page.locator('.product-item h2.product-title a');
    this.noResultMsg = page.locator('.search-results .warning, .no-result');
  }

  async expectResultsContain(query) {
    await allure.step(`Expect search results contain "${query}"`, async () => {
      await expect(this.products.first()).toBeVisible();
      const titles = await this.productTitles.allInnerTexts();
      const matches = titles.some((t) =>
        t.toLowerCase().includes(query.toLowerCase())
      );
      expect(matches, `Expected at least one product title to contain "${query}"`).toBe(true);
      await this.attachScreenshot(`Search results for "${query}"`);
    });
  }

  async expectAtLeastOneResult() {
    await allure.step('Expect at least one search result', async () => {
      await expect(this.products.first()).toBeVisible();
      const count = await this.products.count();
      expect(count, 'Expected at least one search result').toBeGreaterThan(0);
    });
  }
}
