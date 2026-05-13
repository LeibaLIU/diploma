// @ts-check
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
}
