import { Page } from '@playwright/test';
import { CommonPage } from './CommonPage';
import { HomePage } from './HomePage';
import { ConfirmPage } from './ConfirmPage';
import { VerifyAddressPage } from './VerifyAddressPage';

// Creates every page object once, so step files reach all pages from one place:
// this.pages.common, this.pages.home, this.pages.confirm, this.pages.verifyAddress, and so on.
//
// To add a new page:
//   1. Import it at the top of this file.
//   2. Add a readonly field for it (e.g. readonly nextScreen: NextScreenPage;).
//   3. Add one line in the constructor (e.g. this.nextScreen = new NextScreenPage(page);).
export class PageManager {
  readonly common: CommonPage;
  readonly home: HomePage;
  readonly confirm: ConfirmPage;
  readonly verifyAddress: VerifyAddressPage;

  // Creates each page object, all sharing the same browser page.
  constructor(page: Page) {
    this.common = new CommonPage(page);
    this.home = new HomePage(page);
    this.confirm = new ConfirmPage(page);
    this.verifyAddress = new VerifyAddressPage(page);
  }
}
