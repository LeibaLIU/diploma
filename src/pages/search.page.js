// @ts-check
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
}
