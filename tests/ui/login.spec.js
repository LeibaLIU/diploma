// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { newUser } from '../../src/helpers/builders/user.builder.js';

test.describe('UI · Login @UI @AUTH', () => {
  test('Logs in successfully with newly registered user @SMOKE', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Login');
    await allure.severity('blocker');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const user = newUser();

    await app.register.open();
    await app.register.register(user);
    await expect(app.register.successMessage).toHaveText('Your registration completed');
    await expect(app.register.continueBtn).toBeVisible();
    await app.register.attachScreenshot('Registration result');

    await app.home.logoutLink.click();

    await app.login.open();
    await app.login.login(user.email, user.password);

    await expect(app.login.accountLink).toHaveText(user.email);
    await expect(app.login.logoutLink).toBeVisible();
  });

  test('Shows error for invalid credentials', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Login - negative');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    await app.login.open();
    await app.login.login('not-a-real-user@example.com', 'WrongPass123!');
    await expect(app.login.summaryError).toBeVisible();
    await app.login.attachScreenshot('Login error');
  });
});
