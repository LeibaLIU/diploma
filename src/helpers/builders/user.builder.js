// @ts-check
import { faker } from '@faker-js/faker';

/**
 * Fluent builder for User test data based on @faker-js/faker.
 *
 * @example
 *   const user = new UserBuilder().withEmailDomain('example.com').build();
 */
export class UserBuilder {
  constructor() {
    this.user = {
      gender: faker.helpers.arrayElement(['male', 'female']),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email({ provider: 'demo-tricentis-test.io' }).toLowerCase(),
      password: `Aa1!${faker.internet.password({ length: 10 })}`,
    };
  }

  withFirstName(value) { this.user.firstName = value; return this; }
  withLastName(value)  { this.user.lastName  = value; return this; }
  withEmail(value)     { this.user.email     = value.toLowerCase(); return this; }
  withEmailDomain(domain) {
    const local = faker.internet.username().toLowerCase().replace(/[^a-z0-9.]/g, '');
    this.user.email = `${local}.${Date.now()}@${domain}`;
    return this;
  }
  withPassword(value)  { this.user.password  = value; return this; }
  withGender(value)    { this.user.gender    = value; return this; }

  build() {
    return { ...this.user };
  }
}

/**
 * Convenience helper. Returns a fresh randomized user payload.
 */
export const newUser = () => new UserBuilder().build();
