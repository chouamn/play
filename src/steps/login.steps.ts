import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../utilities/CustomWorld';
import { ConfigReader } from '../utilities/ConfigReader';

// Opens the Census login page (BASE_URL from .env.uat).
Given('the responder is on the Census login page', async function (this: CustomWorld) {
  await this.pages.login.navigateToLoginPage();
});

// Types a Census ID into the Census ID box.
// The feature file gives the NAME of the setting in .env.uat, e.g.:
//   When the responder enters the Census ID "CENSUS_ID_VALID_1"
// The real Census ID stays hidden in .env.uat.
When('the responder enters the Census ID {string}', async function (this: CustomWorld, censusIdKey: string) {
  await this.pages.login.enterCensusId(ConfigReader.get(censusIdKey));
});

// Clicks the Log In button.
When('the responder clicks the Login button', async function (this: CustomWorld) {
  await this.pages.login.clickLogin();
});
