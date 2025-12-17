import { Locator } from '@playwright/test';

export class BannerComponent {
  private readonly context: Locator;

  constructor(context: Locator) {
    this.context = context;
  }

  private get bondarLink(): Locator {
    return this.context.locator('a[href*="bondaracademy.com"]');
  }

  private get conduitHeader(): Locator {
    return this.context.locator('h1.logo-font');
  }

  private get descriptionParagraph(): Locator {
    return this.context.locator('p:has-text("A place to learn and practice test automation")');
  }

  async getBondarLinkHref(): Promise<string> {
    const href = await this.bondarLink.getAttribute('href');
    return href || '';
  }

  async getBondarLinkText(): Promise<string> {
    return await this.bondarLink.textContent() || '';
  }

  async getHeaderText(): Promise<string> {
    return await this.conduitHeader.textContent() || '';
  }

  async getDescriptionText(): Promise<string> {
    return await this.descriptionParagraph.textContent() || '';
  }
}