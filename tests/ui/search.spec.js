// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';

test.describe('UI · Search @UI @SEARCH', () => {
  test('Header search returns relevant products for "book"', async ({ homePage, searchPage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Catalog');
    await allure.story('Search');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    await homePage.open();
    await homePage.search('book');

    await expect(searchPage.products.first()).toBeVisible();
    const count = await searchPage.products.count();
    expect(count, 'Expected at least one search result').toBeGreaterThan(0);

    const titles = await searchPage.productTitles.allInnerTexts();
    const matches = titles.some((t) =>
      t.toLowerCase().includes('book')
    );
    expect(matches, `Expected at least one product title to contain "book"`).toBe(true);
    await searchPage.attachScreenshot(`Search results for "book"`);
  });
});
