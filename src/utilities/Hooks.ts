import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './CustomWorld';
import { ConfigReader } from './ConfigReader';
import { PageManager } from '../pages/PageManager';

// How long one step may take before it fails (TIMEOUT from .env.uat, in milliseconds).
setDefaultTimeout(Number(ConfigReader.get('TIMEOUT')));

// Opens the browser named in BROWSER (chromium, chrome or edge) from .env.uat.
// The browser is hidden when HEADLESS is 'true', and visible otherwise.
async function launchBrowser() {
  const browserName = ConfigReader.get('BROWSER');
  const headless = ConfigReader.get('HEADLESS') === 'true';

  if (browserName === 'chromium') {
    return chromium.launch({ headless });
  } else if (browserName === 'chrome') {
    return chromium.launch({ headless, channel: 'chrome' });
  } else if (browserName === 'edge') {
    return chromium.launch({ headless, channel: 'msedge' });
  } else {
    throw new Error(`BROWSER must be chromium, chrome or edge, but .env.uat has "${browserName}"`);
  }
}

// Runs before every scenario: opens a fresh browser, starts recording a trace,
// opens a tab and creates all the page objects.
Before(async function (this: CustomWorld) {
  this.browser = await launchBrowser();
  this.context = await this.browser.newContext();
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  // An element must appear within ELEMENT_TIMEOUT, so the error names the missing element.
  this.page.setDefaultTimeout(Number(ConfigReader.get('ELEMENT_TIMEOUT')));
  this.pages = new PageManager(this.page);
});

// Runs after every scenario: if it failed, saves a screenshot and a trace
// to the reports folder. Then it always closes the browser.
After(async function (this: CustomWorld, scenario) {
  // If the browser never opened, there is nothing to save or close.
  if (!this.browser) return;

  // Turn the scenario name into a safe file name: every character that is not
  // a letter or a number becomes "_" (e.g. "Log in: valid ID" -> "Log_in__valid_ID").
  const fileName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');

  try {
    if (scenario.result?.status === Status.FAILED) {
      const screenshot = await this.page.screenshot({
        path: `reports/screenshots/${fileName}.png`,
        fullPage: true,
      });
      this.attach(screenshot, 'image/png');
      await this.context.tracing.stop({ path: `reports/traces/${fileName}.zip` });
    } else {
      await this.context.tracing.stop();
    }
  } finally {
    await this.browser.close();
  }
});
