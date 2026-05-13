// @ts-check
import { allure } from 'allure-playwright';

export class AuthService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
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
   * @param {{ email: string, password: string, rememberMe?: boolean }} creds
   */
  async login({ email, password, rememberMe = false }) {
    return await allure.step(`API · Login ${email}`, async () => {
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

  async logout() {
    return await allure.step('API · Logout', async () => {
      return await this.api.get('/logout', { maxRedirects: 0, failOnStatusCode: false });
    });
  }
}
