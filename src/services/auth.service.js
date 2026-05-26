// @ts-check
import { allure } from 'allure-playwright';

export class AuthService {
  /** @param {import('./api.service.js').ApiService} api */
  constructor(api) {
    this.api = api;
  }

  /**
   * @param {{ firstName: string, lastName: string, email: string, password: string, gender?: 'M'|'F' }} user
   * @returns {Promise<{ status: number, body: string, headers: Record<string, string> }>}
   */
  async register(user) {
    return await allure.step(`API · Register ${user.email}`, async () => {
      const token = await this.api.getAntiForgeryToken('/register');
      const res = await this.api.postForm(
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
      const body = await res.text();
      return { status: res.status(), body, headers: res.headers() };
    });
  }

  /**
   * @param {{ email: string, password: string, rememberMe?: boolean }} creds
   * @returns {Promise<{ status: number, body: string, headers: Record<string, string> }>}
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
      const res = await this.api.postForm('/login', form, {
        maxRedirects: 0,
        failOnStatusCode: false,
      });
      const body = await res.text();
      return { status: res.status(), body, headers: res.headers() };
    });
  }

  async logout() {
    return await allure.step('API · Logout', async () => {
      const res = await this.api.get('/logout', { maxRedirects: 0, failOnStatusCode: false });
      const body = await res.text();
      return { status: res.status(), body, headers: res.headers() };
    });
  }
}
