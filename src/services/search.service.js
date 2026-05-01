// @ts-check
/**
 * SearchService — обёртка над поиском demowebshop.
 *
 * Эндпоинт `/search?q=...` возвращает HTML, поэтому проверяем по шаблону
 * `product-item`. Это самый стабильный признак, что в выдаче что-то есть.
 */
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

export class SearchService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
   * @param {string} query
   * @returns {Promise<{ status: number, html: string, productCount: number }>}
   */
  async search(query) {
    return await allure.step(`API · Search "${query}"`, async () => {
      const res = await this.api.get(`/search?q=${encodeURIComponent(query)}`);
      const html = await res.text();
      const productCount = (html.match(/class="product-item"/g) || []).length;
      return { status: res.status(), html, productCount };
    });
  }

  /**
   * Утверждает, что поиск вернул хотя бы один продукт.
   * @param {{ status: number, productCount: number }} result
   */
  async expectAtLeastOneProduct(result) {
    await allure.step('Expect at least one product in search result', () => {
      expect(result.status).toBe(200);
      expect(result.productCount, 'product-item count').toBeGreaterThan(0);
    });
  }
}
