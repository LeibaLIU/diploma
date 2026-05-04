// @ts-check
/**
 * apiTest - расширение Playwright `test`, которое:
 *   1. Создаёт `request` с baseURL и cookie storage (включён по умолчанию).
 *   2. Поднимает все доменные сервисы (auth, search, cart, newsletter).
 *   3. Передаёт их в тест как фикстуры - тесту не нужно знать о ApiService.
 *
 * Все запросы идут через один APIRequestContext, значит cookie auth
 * автоматически сохраняются между шагами одного теста.
 */
import { test as base, expect } from '@playwright/test';
import { ApiService } from '../../services/api.service.js';
import { AuthService } from '../../services/auth.service.js';
import { SearchService } from '../../services/search.service.js';
import { CartService } from '../../services/cart.service.js';
import { NewsletterService } from '../../services/newsletter.service.js';

export const apiTest = base.extend({
  api: async ({ playwright }, use) => {
    const baseURL = process.env.BASE_URL || 'https://demowebshop.tricentis.com';
    const ctx = await playwright.request.newContext({ baseURL });
    await use(new ApiService(ctx, baseURL));
    await ctx.dispose();
  },

  authApi: async ({ api }, use) => {
    await use(new AuthService(api));
  },

  searchApi: async ({ api }, use) => {
    await use(new SearchService(api));
  },

  cartApi: async ({ api }, use) => {
    await use(new CartService(api));
  },

  newsletterApi: async ({ api }, use) => {
    await use(new NewsletterService(api));
  },
});

export { expect };
