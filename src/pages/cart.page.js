// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page, '/cart');

    this.rows = page.locator('.cart-item-row, table.cart tr.cart-item-row');
    this.productNames = page.locator('.product-name');
    this.emptyCartMsg = page.locator('.order-summary-content');
    this.totalSummary = page.locator('.cart-total');
  }

  async expectContains(productName) {
    await allure.step(`Expect cart contains "${productName}"`, async () => {
      await expect(this.productNames.first()).toBeVisible();
      const names = await this.productNames.allInnerTexts();
      const found = names.some((n) =>
        n.toLowerCase().includes(productName.toLowerCase())
      );
      expect(found, `Cart should contain "${productName}"`).toBe(true);
      await this.attachScreenshot('Cart contents');
    });
  }

  async expectRowsCount(count) {
    await expect(this.rows).toHaveCount(count);
  }
}
