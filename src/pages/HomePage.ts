import { Locator, Page } from '@playwright/test';

// Page object for the HOME screen, where the responder says if the home is owned, rented
// or occupied without rent. The radio options, the Help link, the Help pop-up and the
// Next button are in CommonPage, not here.
export class HomePage {
  readonly homeHeading: Locator;

  // Finds the elements of the HOME screen, using the browser page we are given.
  constructor(page: Page) {
    this.homeHeading = page.getByRole('heading', { name: 'HOME', exact: true });
  }
}
