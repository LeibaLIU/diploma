// @ts-check
import { faker } from '@faker-js/faker';

/**
 * Fluent builder for User test data based on @faker-js/faker.
 * Data is generated inside add*() methods, not in constructor.
 *
 * @example
 *   const user = new UserBuilder()
 *     .addEmail()
 *     .addFirstName()
 *     .addLastName()
 *     .addPassword()
 *     .generate();
 */
export class UserBuilder {
  constructor() {
    this._user = {};
  }

  addGender() { this._user.gender = faker.helpers.arrayElement(['male', 'female']); return this; }
  addFirstName() { this._user.firstName = faker.person.firstName(); return this; }
  addLastName() { this._user.lastName = faker.person.lastName(); return this; }
  addEmail(domain = 'demo-tricentis-test.io') {
    this._user.email = faker.internet.email({ provider: domain }).toLowerCase();
    return this;
  }
  addPassword() {
    this._user.password = `Aa1!${faker.internet.password({ length: 10 })}`;
    return this;
  }

  generate() {
    return { ...this._user };
  }
}

/**
 * Convenience helper. Returns a fresh randomized user payload
 * using the Builder chain internally.
 */
export const newUser = () => new UserBuilder()
  .addEmail()
  .addFirstName()
  .addLastName()
  .addPassword()
  .generate();
