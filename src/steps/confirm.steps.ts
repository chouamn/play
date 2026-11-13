import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

// Checks that the CONFIRM screen is displayed (its heading is visible).
Then('the responder is navigated to the Confirm page', async function (this: CustomWorld) {
  await expect(this.pages.confirm.confirmHeading).toBeVisible();
});

// Checks that the responder is back on the CONFIRM screen after closing the Help pop-up.
Then('the responder is navigated back to the Confirm page', async function (this: CustomWorld) {
  await expect(this.pages.confirm.confirmHeading).toBeVisible();
});
