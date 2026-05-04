// @ts-check
/**
 * CartService - операции добавления товара в корзину demowebshop.
 *
 * Эндпоинт `/addproducttocart/catalog/{productId}/{shoppingCartTypeId}/{quantity}`
 * возвращает JSON `{ success: bool, message: string, updatetopcartsectionhtml: string }`.
 * Используем shoppingCartTypeId=1 (shopping cart) и quantity=1.
 */
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

export class CartService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
   * Добавить товар в корзину.
   *
   * @param {number} productId Идентификатор продукта (например, 31 - 14.1-inch Laptop).
   * @param {number} [quantity=1]
   */
  async addToCart(productId, quantity = 1) {
    return await allure.step(`API · Add product ${productId} to cart (qty=${quantity})`, async () => {
      const res = await this.api.postForm(
        `/addproducttocart/catalog/${productId}/1/${quantity}`,
        {}
      );
      const body = await res.json();
      return { status: res.status(), body };
    });
  }

  /**
   * Утверждает, что товар успешно добавлен в корзину.
   * @param {{ status: number, body: any }} result
   */
  async expectAddedSuccessfully(result) {
    await allure.step('Expect cart add success', () => {
      expect(result.status).toBe(200);
      expect(result.body.success, 'success flag').toBe(true);
      expect(result.body.message).toContain('The product has been added to your');
    });
  }
}
