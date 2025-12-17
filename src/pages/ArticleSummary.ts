// src/pages/ArticleSummaryPage.ts
import { Page, Locator } from '@playwright/test';

export class ArticleSummaryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Article Title
  get articleTitle(): Locator {
    return this.page.locator('h1').first();
  }

  // Edit Article button
  get editArticleButton(): Locator {
    return this.page.getByRole('link', { name: 'Edit Article' }).first();
  }

  // Delete Article button
  get deleteArticleButton(): Locator {
    return this.page.getByRole('button', { name: 'Delete Article' }).first();
  }

  // Write Comment textarea
  get writeCommentTextArea(): Locator {
    return this.page.getByPlaceholder('Write a comment...');
  }

  // Post Comment button
  get postCommentButton(): Locator {
    return this.page.getByRole('button', { name: 'Post Comment' });
  }

  // Helper method to get article title text
  async getArticleTitle(): Promise<string> {
    return await this.articleTitle.textContent() || '';
  }

  // Helper method to check if article summary page is loaded
  async isArticleSummaryPageLoaded(): Promise<boolean> {
    return await this.deleteArticleButton.isVisible();
  }

  // Helper method to edit article
  async clickEditArticle(): Promise<void> {
    await this.editArticleButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Helper method to delete article
  async deleteArticle(): Promise<void> {
    await this.deleteArticleButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Helper method to post a comment
  async postComment(comment: string): Promise<void> {
    await this.writeCommentTextArea.fill(comment);
    await this.postCommentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Helper method to check if edit button is visible
  async isEditButtonVisible(): Promise<boolean> {
    return await this.editArticleButton.isVisible();
  }

  // Helper method to check if delete button is visible
  async isDeleteButtonVisible(): Promise<boolean> {
    return await this.deleteArticleButton.isVisible();
  }
}