// @ts-check
import { allure } from 'allure-playwright';

export class CartService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
   * @param {number} productId
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
}
