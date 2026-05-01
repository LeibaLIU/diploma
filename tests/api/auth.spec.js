// @ts-check
import { apiTest as test } from '../../src/helpers/fixtures/api.fixture.js';
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

    await authApi.expectRegistered(res);
  });

  test('Logs in with previously registered user @SMOKE', async ({ authApi }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('API · Authentication');
    await allure.story('Login');
    await allure.severity('blocker');

    const user = newUser();
    const reg = await authApi.register(user);
    await authApi.expectRegistered(reg);

    // После /register сервер уже выдал нам auth-cookie. Чтобы протестировать
    // именно /login, выйдем и залогинимся заново.
    await authApi.logout();

    const login = await authApi.login({ email: user.email, password: user.password });

    await authApi.expectLoggedIn(login);
  });
});
