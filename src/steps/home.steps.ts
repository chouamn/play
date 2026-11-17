import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utilities/CustomWorld';

Then('the responder is navigated to the Home page', async function (this: CustomWorld) {
  await expect(this.pages.home.homeHeading).toBeVisible();
});

Then('the responder is navigated back to the Home page', async function (this: CustomWorld) {
  await expect(this.pages.home.homeHeading).toBeVisible();
});
