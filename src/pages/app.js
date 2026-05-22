// @ts-check
import { HomePage } from './home.page.js';
import { RegisterPage } from './register.page.js';
import { LoginPage } from './login.page.js';
import { SearchPage } from './search.page.js';
import { ProductPage } from './product.page.js';
import { CartPage } from './cart.page.js';

export class App {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.home = new HomePage(page);
    this.register = new RegisterPage(page);
    this.login = new LoginPage(page);
    this.search = new SearchPage(page);
    this.cart = new CartPage(page);
  }

  /**
   * @param {string} slug
   * @returns {ProductPage}
   */
  product(slug) {
    return new ProductPage(this.page, slug);
  }
}
