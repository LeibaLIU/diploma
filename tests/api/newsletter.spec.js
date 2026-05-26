// @ts-check
import { apiTest as test, expect } from '../../src/helpers/fixtures/api.fixture.js';
import { allure } from 'allure-playwright';
import { UserBuilder } from '../../src/helpers/builders/index.js';

test.describe('API · Newsletter @API @NEWSLETTER', () => {
  test('Subscribes successfully with a valid email @SMOKE', async ({ api }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Newsletter');
    await allure.story('Subscribe');
    await allure.severity('normal');

    const { email } = new UserBuilder().addEmail().generate();
    const result = await api.newsletter.subscribe(email);

    expect(result.status).toBe(200);
    expect(result.body.Success, 'Success flag').toBe(true);
    expect(result.body.Result).toContain('Thank you for signing up');
  });

  test('Rejects clearly invalid email', async ({ api }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Newsletter');
    await allure.story('Subscribe - negative');
    await allure.severity('minor');

    const result = await api.newsletter.subscribe('not-an-email');

    expect(result.status).toBe(200);
    expect(result.body.Success, 'Success flag').toBe(false);
    expect(result.body.Result).toMatch(/Enter valid email/i);
  });
});
