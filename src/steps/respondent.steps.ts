import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';
import { TestDataGenerator } from '../utilities/TestDataGenerator';

Then('the responder is navigated to the Respondent page', async function (this: CustomWorld) {
  await expect(this.pages.respondent.respondentHeading).toBeVisible();
});

Then('the responder is navigated back to the Respondent page', async function (this: CustomWorld) {
  await expect(this.pages.respondent.respondentHeading).toBeVisible();
});

// Each step below creates new random data, types it, and checks the box holds it.

When('the responder enters a generated first name', async function (this: CustomWorld) {
  const firstName = TestDataGenerator.generateFirstName();
  this.respondentName.firstName = firstName;
  await this.pages.respondent.enterFirstName(firstName);
  await expect(this.pages.respondent.firstNameInput).toHaveValue(firstName);
});

When('the responder enters a generated middle name', async function (this: CustomWorld) {
  const middleName = TestDataGenerator.generateMiddleName();
  this.respondentName.middleName = middleName;
  await this.pages.respondent.enterMiddleName(middleName);
  await expect(this.pages.respondent.middleNameInput).toHaveValue(middleName);
});

When('the responder enters a generated last name', async function (this: CustomWorld) {
  const lastName = TestDataGenerator.generateLastName();
  this.respondentName.lastName = lastName;
  await this.pages.respondent.enterLastName(lastName);
  await expect(this.pages.respondent.lastNameInput).toHaveValue(lastName);
});

When('the responder enters a generated telephone number', async function (this: CustomWorld) {
  const phoneNumber = TestDataGenerator.generatePhoneNumber();
  await this.pages.respondent.enterPhoneNumber(phoneNumber);
  // The screen shows (703)555-0142, so compare the digits only.
  const phoneOnScreen = await this.pages.respondent.phoneNumberInput.inputValue();
  expect(phoneOnScreen.replace(/\D/g, '')).toBe(phoneNumber);
});

When('the responder enters a generated email address', async function (this: CustomWorld) {
  const email = TestDataGenerator.generateEmail();
  await this.pages.respondent.enterEmail(email);
  await expect(this.pages.respondent.emailInput).toHaveValue(email);
});
