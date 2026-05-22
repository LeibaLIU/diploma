// @ts-check
import { AuthService } from './auth.service.js';
import { CartService } from './cart.service.js';
import { SearchService } from './search.service.js';
import { NewsletterService } from './newsletter.service.js';

/**
 * Facade that aggregates all domain API services into a single entry point.
 * Tests use `api.auth.*`, `api.cart.*` etc. — no individual fixtures needed.
 */
export class ApiFacade {
  constructor(apiService) {
    this.auth = new AuthService(apiService);
    this.cart = new CartService(apiService);
    this.search = new SearchService(apiService);
    this.newsletter = new NewsletterService(apiService);
  }
}
