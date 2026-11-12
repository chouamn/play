import { Locator, Page } from '@playwright/test';

// Page object for the VERIFY ADDRESS screen, the screen after CONFIRM.
// For now it only holds the heading, which tests use to check the screen is displayed.
export class VerifyAddressPage {
  readonly verifyAddressHeading: Locator;

  // Finds the elements of the VERIFY ADDRESS screen, using the browser page we are given.
  constructor(private page: Page) {
    this.verifyAddressHeading = page.getByRole('heading', { name: 'VERIFY ADDRESS', exact: true });
  }
}
