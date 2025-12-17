import { Locator } from '@playwright/test';

export class HeaderComponent {
  private readonly context: Locator;

  constructor(context: Locator) {
    this.context = context;
  }

  private get conduitIcon(): Locator {
    return this.context.locator('a.navbar-brand[href="/"]');
  }

  private get homeLink(): Locator {
    return this.context.locator('a.nav-link[href="/"]');
  }

  private get signInLink(): Locator {
    return this.context.locator('a.nav-link[href="/login"]');
  }

  private get signUpLink(): Locator {
    return this.context.locator('a.nav-link[href="/register"]');
  }

  private get newArticleLink(): Locator {
    return this.context.getByRole('link', { name: 'New Article' });
  }

  async clickConduitIcon(): Promise<void> {
    await this.conduitIcon.click();
  }

  async isConduitIconVisible(): Promise<boolean> {
    return await this.conduitIcon.isVisible();
  }

  async clickHome(): Promise<void> {
    await this.homeLink.click();
  }

  async isHomeLinkVisible(): Promise<boolean> {
    return await this.homeLink.isVisible();
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  async clickNewArticle(): Promise<void> {
    await this.newArticleLink.click();
  }
}