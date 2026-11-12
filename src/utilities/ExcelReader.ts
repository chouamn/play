import ExcelJS from 'exceljs';

/**
 * ExcelReader
 * -----------
 * Reads the expected text from resources/testdata/ISR_TestData.xlsx
 *
 *   Sheet "Test_DATA":   Screen | Text | Language
 *
 * Rules for the sheet:
 *   - Screen holds a UNIQUE name: <SCREEN>_<Element>_Text, e.g. VERIFY_ADDRESS_Help_Text
 *   - Screen + Language must appear only once
 *   - Words that are bold on screen are bold in Excel (Ctrl+B)
 */

// If the file or sheet is renamed, change it here only
export const EXCEL_FILE = 'resources/testdata/ISR_TestData.xlsx';
export const SHEET_NAME = 'Test_DATA';

/** What readText() gives back. */
export type ExpectedText = {
  text: string;        // the full text, exactly as it should look on screen
  boldParts: string[]; // the parts of the text that must be bold (can be empty)
};

export class ExcelReader {
  /**
   * Read the expected text for one row of the sheet.
   *
   * Example:
   *   const expected = await ExcelReader.readText('VERIFY_ADDRESS_Help_Text', 'EN');
   *   // expected.text      → "We need to count people where they live…"
   *   // expected.boldParts → ["Why do we ask about December 31, 1969?"]
   */
  static async readText(screen: string, language: string = 'EN'): Promise<ExpectedText> {
    // Step 1: open the Excel file and the sheet
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const sheet = workbook.getWorksheet(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in ${EXCEL_FILE}`);
    }

    // Step 2: collect EVERY row where Screen (column A) and Language (column C) match
    const matchingRows: number[] = [];

    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);
      const rowScreen = row.getCell(1).text.trim();                   // ignore spaces around the name
      const rowLanguage = row.getCell(3).text.trim().toUpperCase();   // "es " → "ES"

      if (rowScreen === screen && rowLanguage === language.toUpperCase()) {
        matchingRows.push(rowNumber);
      }
    }

    // Step 3: there must be exactly ONE matching row
    if (matchingRows.length === 0) {
      throw new Error(`No row with Screen "${screen}" and Language "${language}" in sheet "${SHEET_NAME}"`);
    }
    if (matchingRows.length > 1) {
      throw new Error(
        `Screen "${screen}" with Language "${language}" appears more than once in sheet "${SHEET_NAME}": ` +
        `rows ${matchingRows.join(', ')}. Each Screen name must be unique – rename or delete the extra rows.`
      );
    }

    // Step 4: read the Text cell (column B) of that one row
    return this.readTextCell(sheet.getRow(matchingRows[0]).getCell(2));
  }

  /**
   * Turns the Text cell into { text, boldParts }.
   * A cell can be in one of three states – each is handled below.
   */
  private static readTextCell(cell: ExcelJS.Cell): ExpectedText {
    // Case 1: only SOME words are bold (e.g. VERIFY_ADDRESS_Help_Text)
    //         Excel stores the cell as pieces, each piece with its own font.
    const value = cell.value as ExcelJS.CellRichTextValue;
    if (value && typeof value === 'object' && 'richText' in value) {
      const pieces = value.richText;

      const text = pieces.map(piece => piece.text).join('');   // glue all pieces together

      const boldParts = pieces
        .filter(piece => piece.font?.bold && piece.text.trim() !== '') // keep only bold pieces
        .map(piece => piece.text.trim());                              // remove edge spaces/line breaks

      return { text, boldParts };
    }

    // Case 2: the WHOLE cell is bold (e.g. LOGIN_Heading_Text)
    if (cell.font?.bold) {
      return { text: cell.text, boldParts: [cell.text.trim()] };
    }

    // Case 3: nothing is bold (e.g. CONFIRM_Help_Text)
    return { text: cell.text, boldParts: [] };
  }
}
