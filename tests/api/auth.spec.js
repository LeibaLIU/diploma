// @ts-check
import { apiTest as test, expect } from '../../src/helpers/fixtures/api.fixture.js';
import { newUser } from '../../src/helpers/builders/user.builder.js';
import { allure } from 'allure-playwright';

test.describe('API · Auth @API @AUTH', () => {
  test('Registers a brand-new user and receives auth cookie @SMOKE', async ({ authApi }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Authentication');
    await allure.story('Register');
    await allure.severity('blocker');
    await allure.tag('regression');

    const user = newUser();
    const res = await authApi.register(user);

    expect(res.status(), 'register status').toBe(302);
    expect(res.headers()['location']).toContain('/registerresult/1');
  });

  test('Logs in with previously registered user @SMOKE', async ({ authApi }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Authentication');
    await allure.story('Login');
    await allure.severity('blocker');

    const user = newUser();
    const reg = await authApi.register(user);
    expect(reg.status(), 'register status').toBe(302);
    expect(reg.headers()['location']).toContain('/registerresult/1');

    await authApi.logout();

    const login = await authApi.login({ email: user.email, password: user.password });

    expect(login.status(), 'login status').toBe(302);
    expect(login.headers()['location']).toBe('/');
  });
});
