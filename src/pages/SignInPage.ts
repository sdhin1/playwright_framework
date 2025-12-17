// src/pages/SignInPage.ts
import { Page } from '@playwright/test';

export class SignInPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Sign in header
  get signInHeader(): any {
    return this.page.getByRole('heading', { name: 'Sign in' });
  }

  // Need an account link
  get needAccountLink(): any {
    return this.page.getByRole('link', { name: 'Need an account?' });
  }

  // Email text box
  get emailTextBox(): any {
    return this.page.getByPlaceholder('Email');
  }

  // Password text box
  get passwordTextBox(): any {
    return this.page.getByPlaceholder('Password');
  }

  // Sign in button
  get signInButton(): any {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  // Helper method to perform sign in
  async signIn(email: string, password: string): Promise<void> {
    await this.emailTextBox.fill(email);
    await this.passwordTextBox.fill(password);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Helper method to check if sign in page is loaded
  async isSignInPageLoaded(): Promise<boolean> {
    return await this.signInHeader.isVisible();
  }
}