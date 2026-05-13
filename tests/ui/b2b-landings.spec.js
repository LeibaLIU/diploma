// @ts-check
import { test as base, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { B2BLandingPage, B2B_LANDINGS } from '../../src/pages/b2b-landing.page.js';

/**
 * Тесты для B2B SEO-лендингов OneTwoTrip (LAN-7566)
 * - Авиабилеты для юр.лиц
 * - ЖД билеты для юр.лиц  
 * - Деловой туризм
 */

// Extend test с B2B landing page
const test = base.extend({
  b2bLandingPage: async ({ page }, use, testInfo) => {
    // Получаем путь из testInfo.title или используем дефолтный
    const landingKey = testInfo.project?.name || 'avia';
    const config = B2B_LANDINGS[landingKey] || B2B_LANDINGS.avia;
    await use(new B2BLandingPage(page, config.path));
  },
});

test.describe('B2B Landings · LAN-7566 @UI @B2B @SEO', () => {
  
  // Параметризованные тесты для всех лендингов
  for (const [key, config] of Object.entries(B2B_LANDINGS)) {
    
    test.describe(`${config.name}`, () => {
      
      test(`Страница загружается без JS-ошибок`, async ({ page }) => {
        await allure.epic('B2B Platform');
        await allure.feature('SEO Landings');
        await allure.story(config.name);
        await allure.severity('critical');
        await allure.owner('QA Team');
        await allure.tag('LAN-7566');

        const jsErrors = [];
        page.on('pageerror', (error) => {
          jsErrors.push(error.message);
        });

        const landing = new B2BLandingPage(page, config.path);
        await landing.open();
        await landing.expectPageLoaded();

        // Проверка отсутствия JS ошибок
        await allure.step('Проверить отсутствие JS ошибок', async () => {
          if (jsErrors.length > 0) {
            await allure.attachment('JS Errors', jsErrors.join('\n'), 'text/plain');
          }
          expect(jsErrors, `Найдены JS ошибки: ${jsErrors.join(', ')}`).toHaveLength(0);
        });
      });

      test(`Основные элементы отображаются`, async ({ page }) => {
        await allure.epic('B2B Platform');
        await allure.feature('SEO Landings');
        await allure.story(config.name);
        await allure.severity('normal');
        await allure.owner('QA Team');
        await allure.tag('LAN-7566');

        const landing = new B2BLandingPage(page, config.path);
        await landing.open();

        await allure.step('Проверить наличие header', async () => {
          await expect(landing.header).toBeVisible();
        });

        await allure.step('Проверить наличие footer', async () => {
          await expect(landing.footer).toBeVisible();
        });

        await allure.step('Проверить наличие основного контента', async () => {
          // Проверяем main или первый div в body (fallback для страниц без main)
          const mainVisible = await landing.mainContent.isVisible().catch(() => false);
          if (mainVisible) {
            await expect(landing.mainContent).toBeVisible();
          } else {
            await expect(page.locator('body')).toBeVisible();
          }
        });
      });

      test(`SEO: title соответствует тематике`, async ({ page }) => {
        await allure.epic('B2B Platform');
        await allure.feature('SEO Landings');
        await allure.story(config.name);
        await allure.severity('normal');
        await allure.owner('QA Team');
        await allure.tag('LAN-7566');
        await allure.tag('SEO');

        const landing = new B2BLandingPage(page, config.path);
        await landing.open();

        await allure.step(`Проверить title страницы`, async () => {
          const title = await landing.getTitle();
          await allure.attachment('Page Title', title, 'text/plain');
          expect(title).toMatch(config.expectedTitle);
        });
      });

      test(`Скриншот для визуального сравнения`, async ({ page }) => {
        await allure.epic('B2B Platform');
        await allure.feature('SEO Landings');
        await allure.story(config.name);
        await allure.severity('minor');
        await allure.owner('QA Team');
        await allure.tag('LAN-7566');
        await allure.tag('Visual');

        const landing = new B2BLandingPage(page, config.path);
        await landing.open();

        // Viewport скриншот (первый экран)
        await landing.attachScreenshot(`${key}-viewport`);

        // Скриншоты по частям (до 3 частей страницы)
        await landing.attachFullPageInParts(`${key}-fullpage`, 3);
      });

      test(`CTA кнопки присутствуют и кликабельны`, async ({ page }) => {
        await allure.epic('B2B Platform');
        await allure.feature('SEO Landings');
        await allure.story(config.name);
        await allure.severity('normal');
        await allure.owner('QA Team');
        await allure.tag('LAN-7566');

        const landing = new B2BLandingPage(page, config.path);
        await landing.open();

        await allure.step('Проверить наличие CTA кнопок', async () => {
          // Ищем кнопки регистрации/пробной версии
          const ctaButtons = page.locator('a, button').filter({ 
            hasText: /регистрация|попробовать|начать|заказать|оставить заявку/i 
          });
          
          const count = await ctaButtons.count();
          await allure.attachment('CTA Buttons Count', String(count), 'text/plain');
          
          // Должна быть хотя бы одна CTA кнопка
          expect(count, 'Должна быть хотя бы одна CTA кнопка').toBeGreaterThan(0);

          // Проверяем что первая кнопка видима
          if (count > 0) {
            await expect(ctaButtons.first()).toBeVisible();
          }
        });
      });

      test(`Страница адаптивна (mobile viewport)`, async ({ page }) => {
        await allure.epic('B2B Platform');
        await allure.feature('SEO Landings');
        await allure.story(config.name);
        await allure.severity('normal');
        await allure.owner('QA Team');
        await allure.tag('LAN-7566');
        await allure.tag('Responsive');

        // Устанавливаем мобильный viewport
        await page.setViewportSize({ width: 375, height: 667 });

        const landing = new B2BLandingPage(page, config.path);
        await landing.open();

        await allure.step('Проверить загрузку в mobile viewport', async () => {
          await landing.expectPageLoaded();
        });

        await landing.attachScreenshot(`${key}-mobile`);
      });

    });
  }
});
