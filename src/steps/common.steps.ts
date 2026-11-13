import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

// These steps are shared by EVERY question screen (CONFIRM, VERIFY ADDRESS, ...):
// answering Yes, clicking Next, and opening and closing the Help pop-up.
// A sentence defined here must not be defined in any other step file.

// Selects the Yes answer on the current screen.
When('the responder selects Yes', async function (this: CustomWorld) {
  await this.pages.common.selectYes();
});

// Clicks the Next button to go to the next screen.
When('the responder clicks the Next button', async function (this: CustomWorld) {
  await this.pages.common.clickNext();
});

// Clicks the Help link, which opens the Help pop-up.
When('the responder clicks the Help tooltip', async function (this: CustomWorld) {
  await this.pages.common.clickHelp();
});

// Checks that the Help pop-up is open.
Then('the Help modal popup is displayed', async function (this: CustomWorld) {
  await expect(this.pages.common.helpModal).toBeVisible();
});

// Clicks the Close button in the Help pop-up.
When('the responder clicks the Close button on the Help modal popup', async function (this: CustomWorld) {
  await this.pages.common.clickHelpCloseButton();
});

// Checks that the Help pop-up is closed.
Then('the Help modal popup is closed', async function (this: CustomWorld) {
  await expect(this.pages.common.helpModal).toBeHidden();
});

// Compares the Help pop-up text and bold with one row of the Excel file.
// The feature file gives the Excel row name and the language, e.g.:
//   And the responder validates the Help text "VERIFY_ADDRESS_Help_Text" in "EN"
// This one step works for the Help pop-up on EVERY screen.
Then('the responder validates the Help text {string} in {string}', async function (this: CustomWorld, excelRow: string, language: string) {
  await this.pages.common.validateText(this.pages.common.helpBody, excelRow, language);
});
