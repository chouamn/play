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

// Compares the Help pop-up text and bold with the VERIFY_ADDRESS_Help_Text row in Excel.
Then('the responder validates the Verify Help text against the expected content', async function (this: CustomWorld) {
  await this.pages.common.validateText(this.pages.common.helpBody, 'VERIFY_ADDRESS_Help_Text', 'EN');
});
