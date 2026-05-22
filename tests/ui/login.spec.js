// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';

test.describe('UI · Login @UI @AUTH', () => {
  test('Logs in successfully with newly registered user @SMOKE', async ({ app, registeredUser }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Login');
    await allure.severity('blocker');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    await app.login.open();
    await app.login.login(registeredUser.email, registeredUser.password);

    await expect(app.login.accountLink).toHaveText(registeredUser.email);
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
  });
});
