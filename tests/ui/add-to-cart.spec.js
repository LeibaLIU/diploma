// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
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
    await expect(product.barNotification).toContainText('The product has been added to your', { timeout: 10_000 });
    await expect(product.cartQty).toHaveText('(1)');

    await cartPage.open();
    await expect(cartPage.productNames.first()).toBeVisible();
    const names = await cartPage.productNames.allInnerTexts();
    const found = names.some((n) =>
      n.toLowerCase().includes(productTitle.toLowerCase())
    );
    expect(found, `Cart should contain "${productTitle}"`).toBe(true);
    await cartPage.attachScreenshot('Cart contents');
    await expect(cartPage.rows).toHaveCount(1);
  });
});
