// @ts-check
import { test as base } from '@playwright/test';
import { HomePage } from '../../pages/home.page.js';
import { RegisterPage } from '../../pages/register.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { SearchPage } from '../../pages/search.page.js';
import { ProductPage } from '../../pages/product.page.js';
import { CartPage } from '../../pages/cart.page.js';

/**
 * UI test fixture. Each Page Object is instantiated per test and made
 * available as a named parameter - keeps specs declarative and free of
 * `new HomePage(page)` boilerplate.
 *
 * @example
 *   test('home loads', async ({ homePage }) => {
 *     await homePage.open();
 *     await expect(homePage.featuredProducts.first()).toBeVisible();
 *   });
 */
export const test = base.extend({
  homePage:     async ({ page }, use) => { await use(new HomePage(page)); },
  registerPage: async ({ page }, use) => { await use(new RegisterPage(page)); },
  loginPage:    async ({ page }, use) => { await use(new LoginPage(page)); },
  searchPage:   async ({ page }, use) => { await use(new SearchPage(page)); },
  productPage:  async ({ page }, use) => { await use(new ProductPage(page)); },
  cartPage:     async ({ page }, use) => { await use(new CartPage(page)); },
});

export { expect } from '@playwright/test';
