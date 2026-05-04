// @ts-check
/**
 * NewsletterService - подписка на рассылку demowebshop.
 *
 * Эндпоинт `/subscribenewsletter` принимает поле `email` и возвращает JSON
 * `{ Success: bool, Result: string }` (поля начинаются с заглавной буквы).
 */
import { expect } from '@playwright/test';
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

  /** @param {{ status: number, body: { Success: boolean, Result: string } }} result */
  async expectSubscribed(result) {
    await allure.step('Expect newsletter subscription success', () => {
      expect(result.status).toBe(200);
      expect(result.body.Success, 'Success flag').toBe(true);
      expect(result.body.Result).toContain('Thank you for signing up');
    });
  }

  /** @param {{ body: { Success: boolean, Result: string } }} result */
  async expectInvalidEmail(result) {
    await allure.step('Expect newsletter invalid-email error', () => {
      expect(result.body.Success, 'Success flag').toBe(false);
      expect(result.body.Result).toMatch(/Enter valid email/i);
    });
  }
}
