import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

// Checks that the CONFIRM screen is displayed (its heading is visible).
Then('the responder is navigated to the Confirm page', async function (this: CustomWorld) {
  await expect(this.pages.confirm.confirmHeading).toBeVisible();
});

// Compares the Help pop-up text and bold with the CONFIRM_Help_Text row in Excel.
Then('the responder validates the Confirm Help text against the expected content', async function (this: CustomWorld) {
  await this.pages.common.validateText(this.pages.common.helpBody, 'CONFIRM_Help_Text', 'EN');
});

// Checks that the responder is back on the CONFIRM screen after closing the Help pop-up.
Then('the responder is navigated back to the Confirm page', async function (this: CustomWorld) {
  await expect(this.pages.confirm.confirmHeading).toBeVisible();
});
