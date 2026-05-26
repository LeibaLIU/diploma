// @ts-check
import { apiTest as test, expect } from '../../src/helpers/fixtures/api.fixture.js';
import { allure } from 'allure-playwright';

test.describe('API · Search @API @SEARCH', () => {
  test('Returns at least one product for "book"', async ({ api }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Search');
    await allure.story('Header search');
    await allure.severity('normal');

    const result = await api.search.search('book');

    expect(result.status).toBe(200);
    expect(result.productCount, 'product-item count').toBeGreaterThan(0);
  });
});
