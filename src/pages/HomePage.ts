import { Page } from '@playwright/test';
import { HeaderComponent } from './components/Header';
import { BannerComponent } from './components/Banner';
import { PopularTagsComponent } from './components/PopularTags';
import { FeedToggleComponent } from './components/FeedToggle';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Compose Header component
  get headerComponent(): HeaderComponent {
    return new HeaderComponent(this.page.locator('.navbar.navbar-light'));
  }

  // Compose Banner component
  get bannerComponent(): BannerComponent {
    return new BannerComponent(this.page.locator('.banner').first());
  }

  // Compose Popular Tags component
  get popularTagsComponent(): PopularTagsComponent {
    return new PopularTagsComponent(this.page.locator('.sidebar').first());
  }

  // Compose Feed Toggle component
  get feedToggleComponent(): FeedToggleComponent {
    return new FeedToggleComponent(this.page.locator('.feed-toggle').first());
  }
}