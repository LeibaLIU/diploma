// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home.page.js';
import { SearchPage } from '../../src/pages/search.page.js';

test.describe('Mobile · Search @MOBILE @SEARCH @SMOKE', () => {
  test('Mobile user can search a product from the home page', async ({ page }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Mobile experience');
    await allure.story('Search on mobile (Pixel 5)');
    await allure.severity('critical');
    await allure.owner('QA.GURU diploma');
    await allure.tag('mobile');

    const home = new HomePage(page);
    const search = new SearchPage(page);

    await home.open();
    await home.attachScreenshot('mobile-home');
    await home.search('book');

    await expect(search.products.first()).toBeVisible();
    const titles = await search.productTitles.allInnerTexts();
    const matches = titles.some((t) =>
      t.toLowerCase().includes('book')
    );
    expect(matches, `Expected at least one product title to contain "book"`).toBe(true);
    await search.attachScreenshot('mobile-search-results');

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(480);
  });
});
