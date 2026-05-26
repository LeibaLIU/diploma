// @ts-check
import { apiTest as test, expect } from '../../src/helpers/fixtures/api.fixture.js';
import { UserBuilder } from '../../src/helpers/builders/index.js';
import { allure } from 'allure-playwright';

test.describe('API · Auth @API @AUTH', () => {
  test('Registers a brand-new user and receives auth cookie @SMOKE', async ({ api }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Authentication');
    await allure.story('Register');
    await allure.severity('blocker');
    await allure.tag('regression');

    const user = new UserBuilder()
      .addEmail()
      .addFirstName()
      .addLastName()
      .addPassword()
      .generate();

    const res = await api.auth.register(user);

    expect(res.status, 'register status').toBe(302);
    expect(res.headers['location']).toContain('/registerresult/1');
  });

  test('Logs in with previously registered user @SMOKE', async ({ api }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Authentication');
    await allure.story('Login');
    await allure.severity('blocker');

    const user = new UserBuilder()
      .addEmail()
      .addFirstName()
      .addLastName()
      .addPassword()
      .generate();

    const reg = await api.auth.register(user);
    expect(reg.status, 'register status').toBe(302);
    expect(reg.headers['location']).toContain('/registerresult/1');

    await api.auth.logout();

    const login = await api.auth.login({ email: user.email, password: user.password });

    expect(login.status, 'login status').toBe(302);
    expect(login.headers['location']).toBe('/');
  });
});
