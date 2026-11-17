import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

Then('the responder is navigated to the Undercount page', async function (this: CustomWorld) {
  await expect(this.pages.undercount.undercountHeading).toBeVisible();
});

Then('the responder is navigated back to the Undercount page', async function (this: CustomWorld) {
  await expect(this.pages.undercount.undercountHeading).toBeVisible();
});

// Checks that the name generated on the Respondent screen is in the list
// under "The names listed so far are:" – written as "First Middle Last".
Then('the respondent name is listed on the Undercount page', async function (this: CustomWorld) {
  if (!this.respondentName.firstName) {
    throw new Error('No respondent name was saved. The scenario must run the "enters a generated ... name" steps on the Respondent screen first.');
  }
  const fullName = `${this.respondentName.firstName} ${this.respondentName.middleName} ${this.respondentName.lastName}`;
  await expect(this.pages.undercount.listedName(fullName)).toBeVisible();
});
