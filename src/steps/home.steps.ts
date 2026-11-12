import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../utilities/CustomWorld';
import { ConfigReader } from '../utilities/ConfigReader';

// Opens the Census login page (BASE_URL from .env.uat).
Given('the responder is on the Census home page', async function (this: CustomWorld) {
  await this.pages.home.navigateToHomepage();
});

// Types the valid Census ID from .env.uat (CENSUS_ID_VALID_1) into the Census ID box.
When('the responder enters a valid 12-digit Census ID', async function (this: CustomWorld) {
  await this.pages.home.enterCensusId(ConfigReader.get('CENSUS_ID_VALID_1'));
});

// Clicks the Log In button.
When('the responder clicks the Login button', async function (this: CustomWorld) {
  await this.pages.home.clickLogin();
});
