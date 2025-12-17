// src/tests/web/article.e2e.spec.ts
import { test, expect } from '../../../utils/webUtils/web-fixtures';
import { HomePage } from '../../pages/HomePage';
import { ArticleSummaryPage } from '../../pages/ArticleSummary';

test.describe('Article End-to-End Tests @web', () => {
  let homePage: HomePage;
  let articleSummaryPage: ArticleSummaryPage;
  let articleData: any;

  test('should create, verify, and delete an article successfully', async ({ newArticlePage }) => {
    // Initialize page objects
    homePage = new HomePage(newArticlePage.page);
    articleSummaryPage = new ArticleSummaryPage(newArticlePage.page);

    // Step 1: Verify New Article page is loaded
    expect(await newArticlePage.isNewArticlePageLoaded()).toBeTruthy();

    // Step 2: Generate article data
    articleData = newArticlePage.generateArticleData();

    // Step 3: Create a new article
    await newArticlePage.createArticle(articleData);

    // Step 5: Verify article title is displayed correctly
    const displayedTitle = await articleSummaryPage.getArticleTitle();
    expect(displayedTitle).toBe(articleData.title);

    // Step 6: Verify Edit and Delete buttons are visible
    expect(await articleSummaryPage.isEditButtonVisible()).toBeTruthy();
    expect(await articleSummaryPage.isDeleteButtonVisible()).toBeTruthy();

    // Step 7: Delete the article
    await articleSummaryPage.deleteArticle();

    // Step 8: Verify navigation back to Home Page
    await articleSummaryPage.page.waitForURL('**/');
    
    // Step 9: Verify Home Page is loaded
    expect(await homePage.headerComponent.isConduitIconVisible()).toBeTruthy();
    expect(await homePage.headerComponent.isHomeLinkVisible()).toBeTruthy();
  });

});