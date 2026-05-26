// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { UserBuilder } from '../../src/helpers/builders/index.js';

test.describe('UI · Registration @UI @AUTH @SMOKE', () => {
  test('Successfully registers a brand-new user with random data', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Registration');
    await allure.severity('blocker');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const user = new UserBuilder()
      .addEmail()
      .addFirstName()
      .addLastName()
      .addPassword()
      .generate();

    await app.register.open();
    await app.register.register(user);
    await expect(app.register.successMessage).toHaveText('Your registration completed');
    await expect(app.register.continueBtn).toBeVisible();
  });

  test('Shows error when registering with an already existing email', async ({ app, registeredUser }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Registration - negative');
    await allure.severity('normal');

    await app.register.open();
    await app.register.register({
      email: registeredUser.email,
      firstName: 'Another',
      lastName: 'User',
      password: registeredUser.password,
    });

    await expect(app.register.validationSummary).toContainText('already exists');
  });
});
