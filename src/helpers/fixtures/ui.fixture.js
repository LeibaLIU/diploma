// @ts-check
import { test as base } from '@playwright/test';
import { App } from '../../pages/app.js';
import { UserBuilder } from '../builders/index.js';

export const test = base.extend({
  app: async ({ page }, use) => {
    await use(new App(page));
  },

  registeredUser: async ({ app }, use) => {
    const user = new UserBuilder()
      .addEmail()
      .addFirstName()
      .addLastName()
      .addPassword()
      .generate();

    await app.register.open();
    await app.register.register(user);
    await app.home.logoutLink.click();
    await use(user);
  },
});

/**
 * Auto-attach screenshot on test failure — no manual attachScreenshot() needed.
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const png = await page.screenshot({ fullPage: false });
    await testInfo.attach('screenshot', { body: png, contentType: 'image/png' });
  }
});

export { expect } from '@playwright/test';
