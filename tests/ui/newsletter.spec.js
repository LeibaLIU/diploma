// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '../../src/helpers/fixtures/ui.fixture.js';
import { UserBuilder } from '../../src/helpers/builders/index.js';

test.describe('UI · Newsletter @UI @NEWSLETTER', () => {
  test('Subscribes to the newsletter with a random email', async ({ app }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Communications');
    await allure.story('Newsletter subscription');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    const { email } = new UserBuilder().addEmail().generate();

    await app.home.open();
    await app.home.subscribeToNewsletter(email);
    await expect(app.home.newsletterResult).toContainText('Thank you for signing up', { timeout: 10_000 });
  });
});
