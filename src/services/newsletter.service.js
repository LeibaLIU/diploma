// @ts-check
import { allure } from 'allure-playwright';

export class NewsletterService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
   * @param {string} email
   * @returns {Promise<{ status: number, body: { Success: boolean, Result: string } }>}
   */
  async subscribe(email) {
    return await allure.step(`API · Subscribe newsletter for ${email}`, async () => {
      const res = await this.api.postForm('/subscribenewsletter', { email });
      const body = await res.json();
      return { status: res.status(), body };
    });
  }
}
