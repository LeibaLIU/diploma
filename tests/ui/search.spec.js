// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';

test.describe('UI · Search @UI @SEARCH', () => {
  test('Header search returns relevant products for "book"', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Catalog');
    await allure.story('Search');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    await app.home.open();
    await app.home.search('book');

    await expect(app.search.products.first()).toBeVisible();
    const count = await app.search.products.count();
    expect(count, 'Expected at least one search result').toBeGreaterThan(0);

    const titles = await app.search.productTitles.allInnerTexts();
    const matches = titles.some((t) =>
      t.toLowerCase().includes('book')
    );
    expect(matches, `Expected at least one product title to contain "book"`).toBe(true);
  });
});
