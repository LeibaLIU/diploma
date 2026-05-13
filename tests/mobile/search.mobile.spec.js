// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';

test.describe('Mobile · Search @MOBILE @SEARCH @SMOKE', () => {
  test('Mobile user can search a product from the home page', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Mobile experience');
    await allure.story('Search on mobile (Pixel 5)');
    await allure.severity('critical');
    await allure.owner('QA.GURU diploma');
    await allure.tag('mobile');

    await app.home.open();
    await app.home.attachScreenshot('mobile-home');
    await app.home.search('book');

    await expect(app.search.products.first()).toBeVisible();
    const titles = await app.search.productTitles.allInnerTexts();
    const matches = titles.some((t) =>
      t.toLowerCase().includes('book')
    );
    expect(matches, `Expected at least one product title to contain "book"`).toBe(true);
    await app.search.attachScreenshot('mobile-search-results');

    const viewport = app.page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(480);
  });
});
