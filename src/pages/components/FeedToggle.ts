import { Locator } from '@playwright/test';

export class FeedToggleComponent {
  private readonly context: Locator;

  constructor(context: Locator) {
    this.context = context;
  }

  private get globalFeedTab(): Locator {
    return this.context.locator('a.nav-link:has-text("Global Feed")');
  }

  private get yourFeedTab(): Locator {
    return this.context.locator('a.nav-link:has-text("Your Feed")');
  }

  async selectGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
  }

  async selectYourFeed(): Promise<void> {
    await this.yourFeedTab.click();
  }

  async isGlobalFeedActive(): Promise<boolean> {
    const classAttr = await this.globalFeedTab.getAttribute('class');
    return classAttr?.includes('active') || false;
  }

  async isYourFeedVisible(): Promise<boolean> {
    return await this.yourFeedTab.isVisible();
  }
}