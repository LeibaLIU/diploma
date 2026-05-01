// @ts-check
import { allure } from 'allure-playwright';
import { faker } from '@faker-js/faker';
import { test } from '../../src/helpers/fixtures/ui.fixture.js';

test.describe('UI · Newsletter @UI @NEWSLETTER', () => {
  test('Subscribes to the newsletter with a random email', async ({ homePage }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Communications');
    await allure.story('Newsletter subscription');
    await allure.severity('normal');
    await allure.owner('QA.GURU diploma');

    const email = faker.internet
      .email({ provider: 'demo-tricentis-test.io' })
      .toLowerCase();

    await homePage.open();
    await homePage.subscribeToNewsletter(email);
    await homePage.expectSubscribeSuccess();
  });
});
