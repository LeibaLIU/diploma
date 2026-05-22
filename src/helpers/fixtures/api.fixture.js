// @ts-check
/**
 * apiTest - расширение Playwright `test`, которое:
 *   1. Создаёт `request` с baseURL (из playwright.config.js) и cookie storage.
 *   2. Через ApiFacade предоставляет единую точку входа ко всем доменным сервисам.
 *   3. Передаёт фасад в тест как фикстуру `api` — тесту не нужно знать о ApiService.
 *
 * Все запросы идут через один APIRequestContext, значит cookie auth
 * автоматически сохраняются между шагами одного теста.
 */
import { test as base, expect } from '@playwright/test';
import { ApiService } from '../../services/api.service.js';
import { ApiFacade } from '../../services/api.facade.js';

export const apiTest = base.extend({
  api: async ({ playwright, baseURL }, use) => {
    const ctx = await playwright.request.newContext({ baseURL });
    await use(new ApiFacade(new ApiService(ctx)));
    await ctx.dispose();
  },
});

export { expect };
