// @ts-check
import { allure } from 'allure-playwright';
import { test } from '../../src/helpers/fixtures/ui.fixture.js';
import { ProductPage } from '../../src/pages/product.page.js';

test.describe('UI · Cart @UI @CART @SMOKE', () => {
  test('Adds a product to the cart and verifies cart contents', async ({ page, cartPage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Cart');
    await allure.story('Add to cart');
    await allure.severity('critical');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const slug = '141-inch-laptop';
    const product = new ProductPage(page, slug);

    await product.open();
    const productTitle = await product.getTitle();

    await product.addToCart();
    await product.expectAddedNotification();
    await product.expectCartCount(1);

    await cartPage.open();
    await cartPage.expectContains(productTitle);
    await cartPage.expectRowsCount(1);
  });
});
