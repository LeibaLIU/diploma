// @ts-check
/**
 * Глобальный setup, который выполняется один раз перед всеми тестами:
 *
 *   1. Создаёт директорию `allure-results`.
 *   2. Кладёт в неё `categories.json` (категории падений) и
 *      `environment.properties` (метаданные окружения) — Allure подхватит
 *      их при генерации отчёта.
 *
 * Это позволяет хранить «справочники» Allure под версионным контролем
 * в `allure/` без дублирования в результатах.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

export default async function globalSetup() {
  const results = path.join(root, 'allure-results');
  fs.mkdirSync(results, { recursive: true });

  const categoriesSrc = path.join(root, 'allure', 'categories.json');
  if (fs.existsSync(categoriesSrc)) {
    fs.copyFileSync(categoriesSrc, path.join(results, 'categories.json'));
  }

  const env = {
    BASE_URL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
    BROWSER: 'chromium',
    NODE: process.version,
    PLATFORM: process.platform,
    CI: process.env.CI ? 'true' : 'false',
    BRANCH: process.env.GITHUB_REF_NAME || process.env.BRANCH_NAME || 'local',
    COMMIT: (process.env.GITHUB_SHA || '').slice(0, 7) || 'local',
  };

  const envBody = Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  fs.writeFileSync(path.join(results, 'environment.properties'), envBody, 'utf-8');
  console.log(`[allure] environment.properties + categories.json prepared in ${results}`);
}
