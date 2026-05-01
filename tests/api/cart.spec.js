// @ts-check
import { apiTest as test } from '../../src/helpers/fixtures/api.fixture.js';
import { allure } from 'allure-playwright';

// Идентификатор «14.1-inch Laptop» на demowebshop = 31.
const LAPTOP_ID = 31;

test('API · Cart @API @CART @SMOKE › Adds a product and gets success message', async ({ cartApi }) => {
  await allure.epic('Demo Web Shop');
  await allure.feature('API · Cart');
  await allure.story('Add to cart');
  await allure.severity('critical');

  const result = await cartApi.addToCart(LAPTOP_ID);

  await cartApi.expectAddedSuccessfully(result);
});
