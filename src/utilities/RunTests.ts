import fs from 'fs';
import { spawnSync } from 'child_process';
import { ReportGenerator, JSON_REPORT } from './ReportGenerator';

/**
 * RunTests
 * --------
 * Runs the tests, then ALWAYS builds the HTML and PDF reports – also when tests fail.
 * At the end it exits with Cucumber's own result, so a failed test run still counts as failed.
 *
 * Used by the npm scripts, e.g.:
 *   npm test                 -> all tests
 *   npm run test:verify      -> only @verify
 *   npm test -- --tags "@regression and not @popcount"
 */
async function main(): Promise<void> {
  // Everything after "RunTests.ts" in the npm script is passed on to Cucumber, e.g. --tags @verify
  const cucumberArgs = process.argv.slice(2);
  const tagIndex = cucumberArgs.indexOf('--tags');
  const tagsRun = tagIndex >= 0 ? cucumberArgs[tagIndex + 1] : 'all';

  // 1. Delete the results of the last run, so an old report can never look like a new one
  fs.rmSync(JSON_REPORT, { force: true });

  // 2. Run the tests. Values with spaces get their quotes back
  //    (e.g. "@regression and not @popcount"), because shell: true joins everything into one line.
  const quotedArgs = cucumberArgs.map(arg => (arg.includes(' ') ? `"${arg}"` : arg));
  const result = spawnSync('npx', ['cucumber-js', ...quotedArgs], { stdio: 'inherit', shell: true });

  // 3. Build the reports, whatever the result
  try {
    await ReportGenerator.generate(tagsRun);
  } catch (error) {
    console.error('The report could not be built:', (error as Error).message);
  }

  // 4. Finish with the same result as Cucumber (0 = all passed)
  process.exit(result.status ?? 1);
}

main();
