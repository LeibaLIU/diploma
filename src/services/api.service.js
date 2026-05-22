// @ts-check
/**
 * ApiService - низкоуровневая обёртка над Playwright APIRequestContext.
 * Предоставляет:
 *   - единый контекст и куки между запросами (baseURL задаётся в конфиге);
 *   - извлечение `__RequestVerificationToken` из любой формы NopCommerce;
 *   - короткие хелперы get/post/postForm с автоматическим Allure-attachment ответа.
 *
 * Все остальные сервисы (auth/cart/search/...) принимают экземпляр ApiService
 * и работают только через него - это упрощает мок и переиспользование.
 */
import { allure } from 'allure-playwright';

export class ApiService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Возвращает значение скрытого поля __RequestVerificationToken
   * с указанной HTML-страницы (например, `/register`).
   *
   * @param {string} path Относительный путь страницы с формой.
   * @param {{ optional?: boolean }} [options] Если `optional=true`, возвращает '' при отсутствии токена.
   * @returns {Promise<string>}
   */
  async getAntiForgeryToken(path, options = {}) {
    return await allure.step(`Get __RequestVerificationToken from ${path}`, async () => {
      const res = await this.request.get(path);
      const html = await res.text();
      const match = html.match(
        /name="__RequestVerificationToken"[^>]*value="([^"]+)"/
      );
      if (!match) {
        if (options.optional) return '';
        throw new Error(
          `Anti-forgery token not found on ${path} (status=${res.status()})`
        );
      }
      return match[1];
    });
  }

  /**
   * GET-запрос с прикреплением тела ответа в Allure.
   *
   * @param {string} path
   * @param {import('@playwright/test').APIRequestOptions} [options]
   */
  async get(path, options) {
    return await allure.step(`GET ${path}`, async () => {
      const res = await this.request.get(path, options);
      await this.#attachResponse(res);
      return res;
    });
  }

  /**
   * POST-запрос с form-urlencoded телом и AJAX-заголовком.
   *
   * @param {string} path
   * @param {Record<string, string|number|boolean>} form
   * @param {import('@playwright/test').APIRequestOptions} [options]
   */
  async postForm(path, form, options = {}) {
    return await allure.step(`POST ${path}`, async () => {
      const res = await this.request.post(path, {
        ...options,
        form,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(options.headers || {}),
        },
      });
      await this.#attachResponse(res);
      return res;
    });
  }

  /**
   * Прикрепляет статус, заголовки и тело ответа в Allure-отчёт.
   * @param {import('@playwright/test').APIResponse} res
   */
  async #attachResponse(res) {
    const status = res.status();
    const ct = res.headers()['content-type'] || '';
    let body;
    try {
      body = ct.includes('json') ? JSON.stringify(await res.json(), null, 2) : await res.text();
    } catch {
      body = await res.text();
    }
    await allure.attachment(
      `Response ${status}`,
      Buffer.from(body),
      ct.includes('json') ? 'application/json' : 'text/plain'
    );
  }
}
