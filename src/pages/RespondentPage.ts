import { Locator, Page } from '@playwright/test';

// Page object for the RESPONDENT screen, where the responder gives their name, phone number and email.
// It holds the elements of the screen and the actions a user can do on it.
// The Help link, the Help pop-up and the Next button are in CommonPage, not here.
export class RespondentPage {
  readonly respondentHeading: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly emailInput: Locator;

  // Finds the elements of the RESPONDENT screen, using the browser page we are given.
  constructor(private page: Page) {
    this.respondentHeading = page.getByRole('heading', { name: 'RESPONDENT', exact: true });
    this.firstNameInput = page.getByLabel('First name', { exact: true });
    this.middleNameInput = page.getByLabel('Middle name', { exact: true });
    this.lastNameInput = page.getByLabel('Last name(s)', { exact: true });
    this.phoneNumberInput = page.getByLabel('Telephone number', { exact: true });
    this.emailInput = page.getByLabel('Email address', { exact: true });
  }

  // Types the given first name into the First name box.
  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  // Types the given middle name into the Middle name box.
  async enterMiddleName(middleName: string): Promise<void> {
    await this.middleNameInput.fill(middleName);
  }

  // Types the given last name into the Last name(s) box.
  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  // The box has a mask, so type the digits one by one (like LoginPage.enterCensusId).
  async enterPhoneNumber(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.fill('');
    await this.phoneNumberInput.pressSequentially(phoneNumber);
  }

  // Types the given email address into the Email address box.
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }
}
