module.exports = {
  default: {
    // Where the feature files are
    paths: ['resources/features/**/*.feature'],
    // Lets Cucumber read TypeScript files
    requireModule: ['ts-node/register'],
    // The World, the hooks and all step files
    require: [
      'src/utilities/CustomWorld.ts',
      'src/utilities/Hooks.ts',
      'src/steps/*.ts',
    ],
    // Progress in the terminal, plus the JSON results that ReportGenerator turns into the HTML and PDF reports
    format: [
      'progress',
      'json:reports/cucumber-report.json',
    ],
  },
};
