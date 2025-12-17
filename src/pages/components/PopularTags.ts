import { Locator } from '@playwright/test';

export class PopularTagsComponent {
  private readonly context: Locator;

  constructor(context: Locator) {
    this.context = context;
  }

  private get tagListContainer(): Locator {
    return this.context.locator('.tag-list');
  }

  private get allTags(): Locator {
    return this.tagListContainer.locator('.tag-default.tag-pill');
  }

  async getAllTags(): Promise<string[]> {
    const count = await this.allTags.count();
    const tags: string[] = [];
    for (let i = 0; i < count; i++) {
      const tagText = await this.allTags.nth(i).textContent();
      if (tagText) {
        tags.push(tagText.trim());
      }
    }
    return tags;
  }

  async hasTag(tagName: string): Promise<boolean> {
    const tags = await this.getAllTags();
    return tags.some(tag => tag.toLowerCase().includes(tagName.toLowerCase()));
  }

  async clickTag(tagName: string): Promise<void> {
    await this.allTags.filter({ hasText: tagName }).first().click();
  }
}