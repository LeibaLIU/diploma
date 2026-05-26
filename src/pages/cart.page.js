// @ts-check
import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page, '/cart');

    this.rows = page.locator('.cart-item-row, table.cart tr.cart-item-row');
    this.productNames = page.locator('.product-name');
    this.emptyCartMsg = page.locator('.order-summary-content');
    this.totalSummary = page.locator('.cart-total');
    this.prices = page.locator('.product-unit-price, .product-subtotal, .product-price');
  }
}
