import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

Then('the responder is navigated to the Popcount page', async function (this: CustomWorld) {
  await expect(this.pages.popcount.popcountHeading).toBeVisible();
});

Then('the responder is navigated back to the Popcount page', async function (this: CustomWorld) {
  await expect(this.pages.popcount.popcountHeading).toBeVisible();
});

// Types the number of people from the feature file (e.g. "1") and checks the box holds it.
When('the responder enters {string} as the number of people', async function (this: CustomWorld, numberOfPeople: string) {
  await this.pages.popcount.enterNumberOfPeople(numberOfPeople);
  await expect(this.pages.popcount.numberOfPeopleInput).toHaveValue(numberOfPeople);
});
