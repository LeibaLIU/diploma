// @ts-check
import { allure } from 'allure-playwright';
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home.page.js';
import { SearchPage } from '../../src/pages/search.page.js';

/**
 * Mobile-сценарий — эмуляция Pixel 5 (см. проект `Mobile Chrome` в playwright.config.js).
 *
 * Цель: подтвердить, что ключевой пользовательский флоу (поиск товара)
 * работает на мобильной вёрстке demowebshop. Используем те же Page Objects,
 * что и для desktop — это демонстрирует переиспользуемость уровня UI.
 */
test.describe('Mobile · Search @MOBILE @SEARCH @SMOKE', () => {
  test('Mobile user can search a product from the home page', async ({ page }) => {
    await allure.epic('Demo Web Shop');
    await allure.feature('Mobile experience');
    await allure.story('Search on mobile (Pixel 5)');
    await allure.severity('critical');
    await allure.owner('QA.GURU diploma');
    await allure.tag('mobile');

    const home = new HomePage(page);
    const search = new SearchPage(page);

    await home.open();

    // Прикладываем скриншот мобильной главной — наглядное подтверждение
    // в Allure, что вёрстка действительно мобильная.
    await home.attachScreenshot('mobile-home');

    await home.search('book');

    await search.expectResultsContain('book');
    await search.attachScreenshot('mobile-search-results');

    // Sanity-check viewport: должен быть мобильный (<= 480px по умолчанию для Pixel 5).
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(480);
  });
});
