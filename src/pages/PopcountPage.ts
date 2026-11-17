import { Locator, Page } from '@playwright/test';

// Page object for the POPCOUNT screen, where the responder enters how many people live at the address.
// It holds the elements of the screen and the actions a user can do on it.
// The "Who should I include?" link, the Help pop-up and the Next button are in CommonPage, not here.
export class PopcountPage {
  readonly popcountHeading: Locator;
  readonly numberOfPeopleInput: Locator;

  // Finds the elements of the POPCOUNT screen, using the browser page we are given.
  constructor(private page: Page) {
    this.popcountHeading = page.getByRole('heading', { name: 'POPCOUNT', exact: true });
    this.numberOfPeopleInput = page.getByLabel('Number', { exact: true });
  }

  // Types the given number of people into the Number box.
  async enterNumberOfPeople(numberOfPeople: string): Promise<void> {
    await this.numberOfPeopleInput.fill(numberOfPeople);
  }
}
