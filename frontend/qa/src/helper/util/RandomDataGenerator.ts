import { faker } from '@faker-js/faker';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

// Utility class to generate random data
export class RandomDataGenerator {
  // Generate a random first name like "John"
  static generateRandomFirstName(): string {
    return faker.person.firstName();
  }

  // Generate a random last name like "Doe"
  static generateRandomLastName(): string {
    return faker.person.lastName();
  }

  // Generate a random full name (first + last) "John Doe"
  static generateRandomFullName(): string {
    return faker.person.fullName();
  }

  // Generate a random username (using unique-names-generator)
  static generateRandomUsername(): string {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '',
      length: 2
    });
  }

  // Generate random email address using faker Example: 'john.doe@example.com'
  static generateRandomEmail(): string {
    return faker.internet.email();
  }

  // Generate random telephone number using faker
  static generateRandomTelephoneNumber(): string {
    // List of some common UK area codes
    const areaCodes = ['20', '131', '113', '115', '121', '161', '141'];

    // Randomly select an area code
    const areaCode = areaCodes[faker.number.int({ min: 0, max: areaCodes.length - 1 })];

    // Generate a random 8-digit number
    const localNumber = faker.number.int({ min: 10000000, max: 99999999 }).toString();

    // Format it into the UK landline format
    const formattedNumber = `${localNumber.slice(0, 4)} ${localNumber.slice(4, 8)}`;

    // Return the formatted number with the area code
    return `+44 (0) ${areaCode} ${formattedNumber}`;
  }

  // Generate random text with a specified length
  static generateRandomText(length: number = 10): string {
    return faker.lorem.words(length);
  }
}
