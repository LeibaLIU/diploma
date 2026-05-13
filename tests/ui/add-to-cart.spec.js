// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { PRODUCTS } from '../../src/helpers/data/products.js';

test.describe('UI · Cart @UI @CART @SMOKE', () => {
  test('Adds a product to the cart and verifies cart contents', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Cart');
    await allure.story('Add to cart');
    await allure.severity('critical');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const product = app.product(PRODUCTS.laptop.slug);

    await product.open();
    const productTitle = await product.getTitle();

    await product.addToCart();
    await expect(product.barNotification).toContainText('The product has been added to your', { timeout: 10_000 });
    await expect(product.cartQty).toHaveText('(1)');

    await app.cart.open();
    await expect(app.cart.productNames.first()).toBeVisible();
    const names = await app.cart.productNames.allInnerTexts();
    const found = names.some((n) =>
      n.toLowerCase().includes(productTitle.toLowerCase())
    );
    expect(found, `Cart should contain "${productTitle}"`).toBe(true);
    await app.cart.attachScreenshot('Cart contents');
    await expect(app.cart.rows).toHaveCount(1);
  });
});
