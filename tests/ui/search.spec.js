// @ts-check
import { allure } from 'allure-playwright';
import { test } from '../../src/helpers/fixtures/ui.fixture.js';

test.describe('UI · Search @UI @SEARCH', () => {
  test('Header search returns relevant products for "book"', async ({ homePage, searchPage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Catalog');
    await allure.story('Search');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    await homePage.open();
    await homePage.search('book');

    await searchPage.expectAtLeastOneResult();
    await searchPage.expectResultsContain('book');
  });
});
