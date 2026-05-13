// @ts-check
import { apiTest as test, expect } from '../../src/helpers/fixtures/api.fixture.js';
import { allure } from 'allure-playwright';
import { PRODUCTS } from '../../src/helpers/data/products.js';

test('API · Cart @API @CART @SMOKE › Adds a product and gets success message', async ({ cartApi }) => {
  await allure.epic('Demo Web Shop');
  await allure.feature('API · Cart');
  await allure.story('Add to cart');
  await allure.severity('critical');

  const result = await cartApi.addToCart(PRODUCTS.laptop.id);

  expect(result.status).toBe(200);
  expect(result.body.success, 'success flag').toBe(true);
  expect(result.body.message).toContain('The product has been added to your');
});
