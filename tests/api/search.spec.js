// @ts-check
import { apiTest as test } from '../../src/helpers/fixtures/api.fixture.js';
import { allure } from 'allure-playwright';

test('API · Search @API @SEARCH › returns at least one product for "book"', async ({ searchApi }) => {
  await allure.epic('Demo Web Shop');
  await allure.feature('API · Search');
  await allure.story('Header search');
  await allure.severity('normal');

  const result = await searchApi.search('book');

  await searchApi.expectAtLeastOneProduct(result);
});
