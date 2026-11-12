import { Locator, Page } from '@playwright/test';
import { ConfigReader } from '../utilities/ConfigReader';

// Page object for the login page ("Welcome to the 2026 Census Test").
// It holds the elements of the page and the actions a user can do on it.
export class HomePage {
  readonly censusIdInput: Locator;
  readonly loginButton: Locator;

  // Finds the elements of the login page, using the browser page we are given.
  constructor(private page: Page) {
    this.censusIdInput = page.getByLabel('Census ID (12-digit)');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  // Opens the login page, using BASE_URL from .env.uat.
  async navigateToHomepage(): Promise<void> {
    await this.page.goto(ConfigReader.get('BASE_URL'));
  }

  // Types the given Census ID into the Census ID box.
  async enterCensusId(censusId: string): Promise<void> {
    await this.censusIdInput.fill(censusId);
  }

  // Clicks the Log In button.
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }
}
