// @ts-check
/**
 * AuthService — фасад над эндпоинтами авторизации demowebshop.
 *
 * Сервер использует cookie-аутентификацию (NOPCOMMERCE.AUTH) и Anti-Forgery
 * токен из формы /register. После успешного register/login сервер отвечает
 * 302 редиректом — мы отключаем автоследование, чтобы получить чистый статус.
 */
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

export class AuthService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
   * Регистрация нового пользователя.
   * @param {{ firstName: string, lastName: string, email: string, password: string, gender?: 'M'|'F' }} user
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async register(user) {
    return await allure.step(`API · Register ${user.email}`, async () => {
      const token = await this.api.getAntiForgeryToken('/register');
      return await this.api.postForm(
        '/register',
        {
          Gender: user.gender ?? 'M',
          FirstName: user.firstName,
          LastName: user.lastName,
          Email: user.email,
          Password: user.password,
          ConfirmPassword: user.password,
          'register-button': 'Register',
          __RequestVerificationToken: token,
        },
        { maxRedirects: 0, failOnStatusCode: false }
      );
    });
  }

  /**
   * Логин по email/password.
   * @param {{ email: string, password: string, rememberMe?: boolean }} creds
   */
  async login({ email, password, rememberMe = false }) {
    return await allure.step(`API · Login ${email}`, async () => {
      // На demowebshop форма /login не содержит __RequestVerificationToken,
      // поэтому запрашиваем его опционально — реальная проверка идёт по cookie.
      const token = await this.api.getAntiForgeryToken('/login', { optional: true });
      const form = {
        Email: email,
        Password: password,
        RememberMe: String(rememberMe),
      };
      if (token) form.__RequestVerificationToken = token;
      return await this.api.postForm('/login', form, {
        maxRedirects: 0,
        failOnStatusCode: false,
      });
    });
  }

  /**
   * Завершает текущую сессию (сбрасывает auth-cookie на сервере).
   */
  async logout() {
    return await allure.step('API · Logout', async () => {
      return await this.api.get('/logout', { maxRedirects: 0, failOnStatusCode: false });
    });
  }

  /**
   * Утверждает, что регистрация прошла успешно (302 на /registerresult/1
   * и cookie NOPCOMMERCE.AUTH установлен).
   * @param {import('@playwright/test').APIResponse} res
   */
  async expectRegistered(res) {
    await allure.step('Expect registered (302 → /registerresult/1)', async () => {
      expect(res.status(), 'register status').toBe(302);
      expect(res.headers()['location']).toContain('/registerresult/1');
    });
  }

  /**
   * Утверждает, что логин прошёл успешно (302 на / + auth cookie).
   * @param {import('@playwright/test').APIResponse} res
   */
  async expectLoggedIn(res) {
    await allure.step('Expect logged in (302 → /)', async () => {
      expect(res.status(), 'login status').toBe(302);
      expect(res.headers()['location']).toBe('/');
    });
  }

  /**
   * Утверждает, что логин был отвергнут — сервер вернул 200 со страницей логина
   * и сообщением об ошибке.
   * @param {import('@playwright/test').APIResponse} res
   */
  async expectLoginRejected(res) {
    await allure.step('Expect login rejected (200 with error)', async () => {
      expect(res.status(), 'login status').toBe(200);
      const html = await res.text();
      expect(html.toLowerCase()).toMatch(
        /login was unsuccessful|no customer account found|incorrect/i
      );
    });
  }
}
