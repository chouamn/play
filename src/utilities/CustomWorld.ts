import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

// The "World" is the object that all steps of ONE scenario share.
// Inside a step, "this" is the World, so steps can use this.page and this.pages.
// Every scenario gets a brand-new World, so scenarios never share a browser.
export class CustomWorld extends World {
  browser!: Browser;         // The browser that runs the scenario (set in Hooks.ts)
  context!: BrowserContext;  // A clean browser session: its own cookies and storage
  page!: Page;               // The browser tab the scenario works in
  pages!: PageManager;       // All page objects, e.g. this.pages.home

  // Creates the World. Cucumber calls this itself at the start of every scenario.
  constructor(options: IWorldOptions) {
    super(options);
  }
}

// Tells Cucumber to use our CustomWorld instead of its default World.
setWorldConstructor(CustomWorld);
