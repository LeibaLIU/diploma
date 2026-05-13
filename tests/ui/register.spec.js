// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { newUser } from '../../src/helpers/builders/user.builder.js';

test.describe('UI · Registration @UI @AUTH @SMOKE', () => {
  test('Successfully registers a brand-new user with random data', async ({ registerPage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Registration');
    await allure.severity('blocker');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const user = newUser();

    await registerPage.open();
    await registerPage.register(user);
    await expect(registerPage.successMessage).toHaveText('Your registration completed');
    await expect(registerPage.continueBtn).toBeVisible();
    await registerPage.attachScreenshot('Registration result');
  });
});
