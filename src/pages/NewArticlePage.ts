// src/pages/NewArticlePage.ts
import { Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class NewArticlePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Article Title text box
  get articleTitleTextBox(): Locator {
    return this.page.getByPlaceholder('Article Title');
  }

  // What's this article about? text box
  get articleDescriptionTextBox(): Locator {
    return this.page.getByPlaceholder("What's this article about?");
  }

  // Write your article textarea
  get articleBodyTextArea(): Locator {
    return this.page.getByPlaceholder('Write your article (in markdown)');
  }

  // Enter tags text box
  get tagsTextBox(): Locator {
    return this.page.getByPlaceholder('Enter tags');
  }

  // Publish Article button
  get publishArticleButton(): Locator {
    return this.page.getByRole('button', { name: 'Publish Article' });
  }

  // Generate fake article data
  generateArticleData() {
    return {
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      description: faker.lorem.sentence({ min: 5, max: 15 }),
      body: faker.lorem.paragraphs(3, '\n\n'),
      tags: [
        faker.word.noun(),
        faker.word.adjective(),
        faker.word.verb()
      ]
    };
  }

  // Helper method to fill article form with fake data
  async fillArticleForm(articleData?: {
    title?: string;
    description?: string;
    body?: string;
    tags?: string[];
  }): Promise<void> {
    const data = articleData || this.generateArticleData();

    if (data.title) {
      await this.articleTitleTextBox.fill(data.title);
    }

    if (data.description) {
      await this.articleDescriptionTextBox.fill(data.description);
    }

    if (data.body) {
      await this.articleBodyTextArea.fill(data.body);
    }

    if (data.tags && data.tags.length > 0) {
      for (const tag of data.tags) {
        await this.tagsTextBox.fill(tag);
        await this.tagsTextBox.press('Enter');
      }
    }
  }

  // Helper method to create a new article with fake data
  async createArticle(articleData?: {
    title?: string;
    description?: string;
    body?: string;
    tags?: string[];
  }): Promise<void> {
    await this.fillArticleForm(articleData);
    await this.publishArticleButton.click();
    await this.page.waitForURL('**/article/**', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000); // Additional wait to ensure article is published
  }

  // Helper method to check if New Article page is loaded
  async isNewArticlePageLoaded(): Promise<boolean> {
    return await this.articleTitleTextBox.isVisible();
  }
}