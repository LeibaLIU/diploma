// @ts-check
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page, '/login');

    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.rememberMe = page.locator('#RememberMe');
    this.submitBtn = page.locator('input.login-button');
    this.summaryError = page.locator('.message-error .validation-summary-errors');
  }

  async login(email, password) {
    await allure.step(`Log in as ${email}`, async () => {
      await this.email.fill(email);
      await this.password.fill(password);
      await this.submitBtn.click();
    });
  }
}
