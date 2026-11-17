/**
 * TestDataGenerator
 * -----------------
 * Creates new, random test data every time a method is called.
 *
 *   generateFirstName()    5 to 15 letters, e.g. "Kqmrwtza"
 *   generateMiddleName()   1 to 10 letters, e.g. "Bvt"
 *   generateLastName()     5 to 10 letters, e.g. "Pxlorev"
 *   generateEmail()        e.g. "kqmrwtza.48213@gmail.com"
 *   generatePhoneNumber()  10 digits, e.g. "7035550142"
 *
 * Phone numbers are safe for testing: 555-0100 to 555-0199 is a range reserved for fictional use.
 */
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const AREA_CODES = ['202', '301', '571', '703', '804'];

// The email domain. Change it here only.
const EMAIL_DOMAIN = 'gmail.com';

export class TestDataGenerator {
  /** A first name of 5 to 15 letters. The first letter is a capital. */
  static generateFirstName(): string {
    return this.randomName(5, 15);
  }

  /** A middle name of 1 to 10 letters. The first letter is a capital. */
  static generateMiddleName(): string {
    return this.randomName(1, 10);
  }

  /** A last name of 5 to 10 letters. The first letter is a capital. */
  static generateLastName(): string {
    return this.randomName(5, 10);
  }

  /** A unique email address, e.g. "kqmrwtza.48213@gmail.com". */
  static generateEmail(): string {
    const name = this.randomLetters(5, 10);
    const uniqueNumber = this.randomNumber(10000, 99999);
    return `${name}.${uniqueNumber}@${EMAIL_DOMAIN}`;
  }

  /** A fictional 10-digit phone number, e.g. "7035550142". No brackets or dashes: the screen adds them. */
  static generatePhoneNumber(): string {
    const areaCode = AREA_CODES[this.randomNumber(0, AREA_CODES.length - 1)];
    const lastTwoDigits = String(this.randomNumber(0, 99)).padStart(2, '0');
    return `${areaCode}55501${lastTwoDigits}`;
  }

  // Random letters with a capital first letter, e.g. "Kqmrwtza".
  private static randomName(minLength: number, maxLength: number): string {
    const letters = this.randomLetters(minLength, maxLength);
    return letters[0].toUpperCase() + letters.slice(1);
  }

  // Random lowercase letters, between minLength and maxLength long.
  private static randomLetters(minLength: number, maxLength: number): string {
    const length = this.randomNumber(minLength, maxLength);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += LETTERS[this.randomNumber(0, LETTERS.length - 1)];
    }
    return result;
  }

  // A random whole number from min to max (both included).
  private static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
