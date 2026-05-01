// @ts-check
import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BasePage } from './base.page.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page, '/register');

    this.genderMale = page.locator('#gender-male');
    this.genderFemale = page.locator('#gender-female');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.submitBtn = page.locator('#register-button');

    this.successMessage = page.locator('.result');
    this.continueBtn = page.locator('a.register-continue-button');
    this.fieldErrors = page.locator('.field-validation-error');
  }

  /**
   * @param {{firstName:string,lastName:string,email:string,password:string,gender?:'male'|'female'}} user
   */
  async register(user) {
    await allure.step(`Register user ${user.email}`, async () => {
      if (user.gender === 'female') await this.genderFemale.check();
      else await this.genderMale.check();
      await this.firstName.fill(user.firstName);
      await this.lastName.fill(user.lastName);
      await this.email.fill(user.email);
      await this.password.fill(user.password);
      await this.confirmPassword.fill(user.password);
      await this.submitBtn.click();
    });
  }

  async expectRegistrationCompleted() {
    await allure.step('Expect registration completed', async () => {
      await expect(this.successMessage).toHaveText('Your registration completed');
      await expect(this.continueBtn).toBeVisible();
      await this.attachScreenshot('Registration result');
    });
  }
}
