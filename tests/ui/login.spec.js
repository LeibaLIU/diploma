// @ts-check
import { allure } from 'allure-playwright';
import { test } from '../../src/helpers/fixtures/ui.fixture.js';
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

    // Arrange — register a fresh user via UI.
    await registerPage.open();
    await registerPage.register(user);
    await registerPage.expectRegistrationCompleted();

    // Logout link is on the home page once registration finishes.
    await homePage.logoutLink.click();

    // Act — log in.
    await loginPage.open();
    await loginPage.login(user.email, user.password);

    // Assert — header now shows the email and a Logout link.
    await loginPage.expectLoggedInAs(user.email);
  });

  test('Shows error for invalid credentials', async ({ loginPage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Login — negative');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    await loginPage.open();
    await loginPage.login('not-a-real-user@example.com', 'WrongPass123!');
    await loginPage.expectLoginError();
  });
});
