// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { newUser } from '../../src/helpers/builders/user.builder.js';

test.describe('UI · Registration @UI @AUTH @SMOKE', () => {
  test('Successfully registers a brand-new user with random data', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Authentication');
    await allure.story('Registration');
    await allure.severity('blocker');
    await allure.owner('QA.GURU diploma');
    await allure.tag('regression');

    const user = newUser();

    await app.register.open();
    await app.register.register(user);
    await expect(app.register.successMessage).toHaveText('Your registration completed');
    await expect(app.register.continueBtn).toBeVisible();
    await app.register.attachScreenshot('Registration result');
  });
});
