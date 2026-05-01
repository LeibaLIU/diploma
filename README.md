# Demo Web Shop — Diploma Project (QA.GURU)

Дипломный проект по автоматизации тестирования сайта **[demowebshop.tricentis.com](https://demowebshop.tricentis.com/)**.

[![tests](https://github.com/LeibaLIU/diploma/actions/workflows/tests.yml/badge.svg)](https://github.com/LeibaLIU/diploma/actions/workflows/tests.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-orange)](https://leibaliu.github.io/diploma/)

## Содержание

- [Стек](#стек)
- [Что покрывается](#что-покрывается)
- [Структура проекта](#структура-проекта)
- [Локальный запуск](#локальный-запуск)
- [CI/CD](#cicd)
- [Allure](#allure)
- [Allure TestOps](#allure-testops)
- [Telegram-уведомления](#telegram-уведомления)
- [Mobile](#mobile)

## Стек

| Категория | Инструмент |
|-----------|------------|
| Язык | JavaScript (ESM) |
| Test Runner | [Playwright Test](https://playwright.dev/) |
| Тестовые данные | [`@faker-js/faker`](https://fakerjs.dev/) |
| Паттерны UI | Page Object, custom assertions on PO |
| Паттерны API | Service, Facade, Builder |
| Reporting | Allure, GitHub Pages, Allure TestOps |
| CI | GitHub Actions, Jenkins |
| Notifications | Telegram (`appleboy/telegram-action`) |
| Mobile | Playwright Mobile Chrome emulation (Pixel 5) |

## Что покрывается

### UI (`tests/ui/`) — 5 функциональных тестов
1. Регистрация нового пользователя со случайными данными (`@SMOKE`)
2. Логин зарегистрированным пользователем + негативный кейс с неверным паролем (`@SMOKE`)
3. Поиск товара по ключевому слову (`@SMOKE`)
4. Добавление товара в корзину (`@SMOKE`)
5. Подписка на email-рассылку

### API (`tests/api/`) — 6 функциональных тестов
1. `POST /register` — регистрация со случайным email (`@SMOKE`)
2. `POST /login` — авторизация и проверка cookie сессии (`@SMOKE`)
3. `GET /search?q=…` — поиск товаров
4. `POST /addproducttocart/catalog/{id}/1/{qty}` — добавление в корзину (`@SMOKE`)
5. `POST /subscribenewsletter` — успешная подписка (`@SMOKE`)
6. `POST /subscribenewsletter` — негативный кейс с некорректным email

### Mobile (`tests/mobile/`)
Smoke-сценарий поиска в проекте `Mobile Chrome` (эмуляция Pixel 5) — переиспользует Page Object'ы desktop-уровня.

## Структура проекта

```
diploma/
├── .github/workflows/        # GitHub Actions
├── Jenkinsfile               # Jenkins pipeline
├── src/
│   ├── pages/                # UI Page Objects (+ свои ассерты)
│   ├── services/             # API Services + Facade
│   └── helpers/
│       ├── builders/         # Builders для тестовых данных
│       ├── fixtures/         # ui/api fixtures
│       └── data/
└── tests/
    ├── ui/                   # 5 UI-тестов
    ├── api/                  # 5 API-тестов
    └── mobile/               # Mobile-тесты
```

## Локальный запуск

```bash
npm ci
npx playwright install --with-deps

npm test                  # все тесты
npm run test:ui           # только UI
npm run test:api          # только API
npm run test:mobile       # Mobile Chrome
npm run test:smoke        # тесты с тегом @SMOKE
npm run test:debug        # Playwright UI mode
```

Allure-отчёт локально:

```bash
npm test
npm run allure:serve
```

> ⚠️ Для локальной генерации Allure нужен **Java 8+** (`allure-commandline` — JVM-утилита). Если Java не установлена, используйте артефакты из CI или поставьте JDK, например `brew install --cask temurin`. Сами тесты Playwright Java не требуют. На GitHub Actions / Jenkins Java ставится автоматически.

## CI/CD

### GitHub Actions

Пайплайн `.github/workflows/tests.yml`:

1. Установка зависимостей и браузеров
2. Подтягивание истории Allure из ветки `gh-pages`
3. Запуск `npm test`
4. Генерация Allure-отчёта и публикация на GitHub Pages
5. Загрузка результатов в Allure TestOps (`allurectl upload`)
6. Отправка статуса в Telegram

### Jenkins

`Jenkinsfile` — параметризованная джоба для `jenkins.autotests.cloud` с шагами:
- checkout → install → test → allure publish → notify.

## Allure

Используется `allure-playwright`. История запусков сохраняется в ветке `gh-pages`, благодаря чему в отчёте видны тренды по каждому тесту.

Что прикрепляется в отчёт:

- Скриншоты падений (Playwright, `screenshot: 'only-on-failure'`) и трейс (`trace: 'retain-on-failure'`).
- Ручные скриншоты ключевых шагов Page Object'ов через `BasePage.attachScreenshot()`.
- Тело HTTP-ответов API (см. `ApiService` — каждый ответ автоматически прикрепляется как `text/html` или `application/json`).
- `environment.properties` — `BASE_URL`, ветка, commit, версия Node, платформа (создаётся в `global-setup.js`).
- `categories.json` — классификатор падений (product/test defects, infrastructure, flaky/timeout). Лежит в `allure/categories.json`.

Каждый тест помечен лейблами Allure: `epic` / `feature` / `story` / `severity` / `owner` / тегами + связаны с тегами `@SMOKE`, `@UI`, `@API`, `@MOBILE` для фильтрации (`npm run test:smoke` и т.п.).

🌐 **Live report:** https://leibaliu.github.io/diploma/

## Allure TestOps

Результаты загружаются в проект `demowebshop-diploma` на https://allure.autotests.cloud через `allurectl`.

Секреты GitHub Actions:
- `ALLURE_TOKEN` — Personal API Token
- `ALLURE_PROJECT_ID` — ID проекта в TestOps
- `ALLURE_ENDPOINT` — `https://allure.autotests.cloud`

## Telegram-уведомления

После каждого запуска CI отправляет сообщение со статусом, ссылкой на отчёт и Allure TestOps. Используется `appleboy/telegram-action`.

Секреты: `TG_BOT_TOKEN`, `TG_CHAT_ID`.

## Mobile

В `playwright.config.js` объявлен проект `Mobile Chrome` (`devices['Pixel 5']`). Тесты в `tests/mobile/` запускаются в этом проекте и проверяют адаптивность ключевых сценариев.

---

**Автор:** [LeibaLIU](https://github.com/LeibaLIU)
