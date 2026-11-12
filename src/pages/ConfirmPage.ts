import { Locator, Page } from '@playwright/test';

// Page object for the CONFIRM screen, the first screen after login.
// For now it only holds the heading, which tests use to check the screen is displayed.
export class ConfirmPage {
  readonly confirmHeading: Locator;

  // Finds the elements of the CONFIRM screen, using the browser page we are given.
  constructor(private page: Page) {
    this.confirmHeading = page.getByRole('heading', { name: 'CONFIRM', exact: true });
  }
}
