import { expect, Locator, Page } from '@playwright/test';
import { ExcelReader } from '../utilities/ExcelReader';

// Page object for the elements that are the SAME on every question screen
// (CONFIRM, VERIFY ADDRESS, ...): Yes, Next, the Help link and the Help pop-up.
// They are written once here instead of in every page class.
// It also holds the text validation (text, spacing and bold, checked against Excel)
// used by every screen.
export class CommonPage {
  readonly yesRadio: Locator;
  readonly nextButton: Locator;
  readonly helpLink: Locator;
  readonly helpModal: Locator;
  readonly helpBody: Locator;
  readonly helpCloseButton: Locator;

  // Finds the shared elements, using the browser page we are given.
  // helpModal is set first, because helpBody and helpCloseButton are found inside it.
  constructor(private page: Page) {
    this.yesRadio = page.getByRole('radio', { name: 'Yes' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.helpLink = page.getByRole('link', { name: 'Help' });
    this.helpModal = page.getByRole('dialog');
    this.helpBody = this.helpModal.locator('div.modal-body');
    // Found by its visible text, because the X icon is also named "Close".
    this.helpCloseButton = this.helpModal.getByText('Close', { exact: true });
  }

  // Selects the Yes answer.
  async selectYes(): Promise<void> {
    await this.yesRadio.check();
  }

  // Clicks the Next button to go to the next screen.
  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  // Clicks the Help link, which opens the Help pop-up.
  async clickHelp(): Promise<void> {
    await this.helpLink.click();
  }

  // Clicks the Close button in the Help pop-up, which closes the pop-up.
  async clickHelpCloseButton(): Promise<void> {
    await this.helpCloseButton.click();
  }

  // Compares the text on screen with the expected text from Excel.
  // "screen" and "language" are the Screen and Language columns of the Excel row.
  // Check 1: text and spacing – every word, space, punctuation mark and line break must match.
  // Check 2: bold – every part that is bold in Excel must be bold on screen.
  // Example:
  //   await this.pages.common.validateText(this.pages.common.helpBody, 'VERIFY_ADDRESS_Help_Text', 'EN');
  async validateText(locator: Locator, screen: string, language: string): Promise<void> {
    // Read the expected text and its bold parts from Excel
    const expectedText = await ExcelReader.readText(screen, language);

    // Check 1: text and spacing (exact match, character by character)
    await expect(locator).toBeVisible();
    const actualText = await locator.innerText();

    expect(actualText, `Text or spacing on screen is different from Excel row "${screen}"`)
      .toBe(expectedText.text);

    // Check 2: bold parts
    for (const boldText of expectedText.boldParts) {
      if (boldText === actualText.trim()) {
        // The whole element is bold (e.g. a heading)
        await this.verifyTextIsBold(locator);
      } else {
        // Only part of the text is bold: find that part inside the element
        await this.verifyTextIsBold(locator.getByText(boldText, { exact: true }));
      }
    }
  }

  // Checks that an element's text is bold.
  // It asks the browser for the font weight: 400 is normal, 600 or more is bold.
  async verifyTextIsBold(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();

    const fontWeight = await locator.evaluate(element =>
      window.getComputedStyle(element).fontWeight
    );

    const isBold =
      fontWeight === 'bold' ||
      fontWeight === 'bolder' ||
      (/^\d+$/.test(fontWeight) && Number(fontWeight) >= 600);

    expect(isBold, `Expected text to be bold, but font-weight was ${fontWeight}`)
      .toBe(true);
  }
}
