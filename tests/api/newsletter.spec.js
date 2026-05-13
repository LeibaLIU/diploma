// @ts-check
import { apiTest as test, expect } from '../../src/helpers/fixtures/api.fixture.js';
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

    expect(result.status).toBe(200);
    expect(result.body.Success, 'Success flag').toBe(true);
    expect(result.body.Result).toContain('Thank you for signing up');
  });

  test('Rejects clearly invalid email', async ({ newsletterApi }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Newsletter');
    await allure.story('Subscribe - negative');
    await allure.severity('minor');

    const result = await newsletterApi.subscribe('not-an-email');

    expect(result.body.Success, 'Success flag').toBe(false);
    expect(result.body.Result).toMatch(/Enter valid email/i);
  });
});
