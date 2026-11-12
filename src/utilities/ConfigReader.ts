import dotenv from 'dotenv';

// Load the settings from .env.uat once, when this file is first used.
dotenv.config({ path: 'resources/environment/.env.uat', quiet: true });

// Reads settings (URL, browser, test data...) from resources/environment/.env.uat.
export class ConfigReader {
  // Returns the value of one setting from .env.uat.
  // Example: ConfigReader.get('CENSUS_ID_VALID_1')
  static get(key: string): string {
    const value = process.env[key];

    if (!value) {
      throw new Error(`"${key}" is missing in resources/environment/.env.uat`);
    }

    return value;
  }
}