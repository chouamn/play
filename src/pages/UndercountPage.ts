import { Locator, Page } from '@playwright/test';

// Page object for the UNDERCOUNT screen, where the responder says if anyone else lives at the address.
// It holds the elements of the screen and the actions a user can do on it.
// The Yes/No radios, the "Who should I include?" link, the Help pop-up and the Next button are in CommonPage, not here.
export class UndercountPage {
  readonly undercountHeading: Locator;

  // Finds the elements of the UNDERCOUNT screen, using the browser page we are given.
  constructor(private page: Page) {
    this.undercountHeading = page.getByRole('heading', { name: 'UNDERCOUNT', exact: true });
  }

  // Finds a name in the list under "The names listed so far are:", e.g. "Kqmrwtza Bvt Pxlorev".
  listedName(fullName: string): Locator {
    return this.page.getByText(fullName, { exact: true });
  }
}
