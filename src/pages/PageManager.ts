import { Page } from '@playwright/test';
import { CommonPage } from './CommonPage';
import { LoginPage } from './LoginPage';
import { ConfirmPage } from './ConfirmPage';
import { VerifyAddressPage } from './VerifyAddressPage';
import { RespondentPage } from './RespondentPage';
import { PopcountPage } from './PopcountPage';
import { UndercountPage } from './UndercountPage';
import { HomePage } from './HomePage';

// Creates every page object once, so step files reach all pages from one place:
// this.pages.common, this.pages.login, this.pages.confirm, this.pages.verifyAddress, and so on.
//
// To add a new page:
//   1. Import it at the top of this file.
//   2. Add a readonly field for it (e.g. readonly nextScreen: NextScreenPage;).
//   3. Add one line in the constructor (e.g. this.nextScreen = new NextScreenPage(page);).
export class PageManager {
  readonly common: CommonPage;
  readonly login: LoginPage;
  readonly confirm: ConfirmPage;
  readonly verifyAddress: VerifyAddressPage;
  readonly respondent: RespondentPage;
  readonly popcount: PopcountPage;
  readonly undercount: UndercountPage;
  readonly home: HomePage;

  // Creates each page object, all sharing the same browser page.
  constructor(page: Page) {
    this.common = new CommonPage(page);
    this.login = new LoginPage(page);
    this.confirm = new ConfirmPage(page);
    this.verifyAddress = new VerifyAddressPage(page);
    this.respondent = new RespondentPage(page);
    this.popcount = new PopcountPage(page);
    this.undercount = new UndercountPage(page);
    this.home = new HomePage(page);
  }
}
