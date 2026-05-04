// @ts-check
import { apiTest as test } from '../../src/helpers/fixtures/api.fixture.js';
import { faker } from '@faker-js/faker';
import { allure } from 'allure-playwright';

test.describe('API · Newsletter @API @NEWSLETTER', () => {
  test('Subscribes successfully with a valid email @SMOKE', async ({ newsletterApi }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Newsletter');
    await allure.story('Subscribe');
    await allure.severity('normal');

    const email = faker.internet.email().toLowerCase();
    const result = await newsletterApi.subscribe(email);

    await newsletterApi.expectSubscribed(result);
  });

  test('Rejects clearly invalid email', async ({ newsletterApi }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Newsletter');
    await allure.story('Subscribe - negative');
    await allure.severity('minor');

    const result = await newsletterApi.subscribe('not-an-email');

    await newsletterApi.expectInvalidEmail(result);
  });
});
