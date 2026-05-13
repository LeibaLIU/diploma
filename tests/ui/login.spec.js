// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { newUser } from '../../src/helpers/builders/user.builder.js';

test.describe('UI · Login @UI @AUTH', () => {
  test('Logs in successfully with newly registered user @SMOKE', async ({
    registerPage,
    loginPage,
    homePage,
  }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Login');
    await allure.severity('blocker');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const user = newUser();

    await registerPage.open();
    await registerPage.register(user);
    await expect(registerPage.successMessage).toHaveText('Your registration completed');
    await expect(registerPage.continueBtn).toBeVisible();
    await registerPage.attachScreenshot('Registration result');

    await homePage.logoutLink.click();

    await loginPage.open();
    await loginPage.login(user.email, user.password);

    await expect(loginPage.accountLink).toHaveText(user.email);
    await expect(loginPage.logoutLink).toBeVisible();
  });

  test('Shows error for invalid credentials', async ({ loginPage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Login - negative');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    await loginPage.open();
    await loginPage.login('not-a-real-user@example.com', 'WrongPass123!');
    await expect(loginPage.summaryError).toBeVisible();
    await loginPage.attachScreenshot('Login error');
  });
});
