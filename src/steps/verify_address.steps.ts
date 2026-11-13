import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

// Checks that the VERIFY ADDRESS screen is displayed (its heading is visible).
Then('the responder is navigated to the Verify page', async function (this: CustomWorld) {
  await expect(this.pages.verifyAddress.verifyAddressHeading).toBeVisible();
});

// Checks that the responder is back on the VERIFY ADDRESS screen after closing the Help pop-up.
Then('the responder is navigated back to the Verify page', async function (this: CustomWorld) {
  await expect(this.pages.verifyAddress.verifyAddressHeading).toBeVisible();
});
