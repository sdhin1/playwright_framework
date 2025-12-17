import { test as base, mergeTests } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SignInPage } from '../../src/pages/SignInPage';
import { NewArticlePage } from '../../src/pages/NewArticlePage';
import { decrypt } from '../common/encryption';
import { credentials } from '../setup/constants';
import { apiTest } from '../apiUtils/api-fixtures';

export type WebTestOptions = {
    nonSignInHomePage: HomePage;
    signInPage: SignInPage;
    newArticlePage: NewArticlePage;
};

export const webTest = base.extend<WebTestOptions>({
    nonSignInHomePage: async ({ page }, use) => {
        // Step 1: Navigate to Home Page
        await page.goto('/', { waitUntil: 'networkidle' });

        const homePage = new HomePage(page);
        await use(homePage);
    },

    signInPage: async ({ page }, use) => {
        // Step 1: Navigate to Home Page
        await page.goto('/', { waitUntil: 'networkidle' });
        
        const homePage = new HomePage(page);
        
        // Step 2: Click on signInLink within Header component
        await homePage.headerComponent.clickSignIn();
        
        // Step 3: Wait for navigation to Sign in page
        await page.waitForURL('**/login');
        
        // Step 4: Create Sign in page instance
        const signInPage = new SignInPage(page);

        //Step 5: Use signInPage instance in the tests
        const username = decrypt(credentials.username);
        const password = decrypt(credentials.password);
        await signInPage.signIn(username, password);       
        
        await use(signInPage);
    },

    newArticlePage: async ({ page }, use) => {
        // Step 1: Navigate to Home Page
        await page.goto('/', { waitUntil: 'networkidle' });
        
        const homePage = new HomePage(page);
        
        // Step 2: Sign in using username/password
        await homePage.headerComponent.clickSignIn();
        await page.waitForURL('**/login');
        
        const signInPage = new SignInPage(page);
        const username = decrypt(credentials.username);
        const password = decrypt(credentials.password);
        await signInPage.signIn(username, password);
        
        // Step 3: Click on New Article link
        await homePage.headerComponent.clickNewArticle();
        
        // Step 4: Dynamic wait for the URL
        await page.waitForURL('**/editor');
        
        // Step 5: Create New Article page instance
        const newArticlePage = new NewArticlePage(page);
        
        await use(newArticlePage);
    }
});

// Merge API and Web fixtures
export const test = mergeTests(apiTest, webTest);
export { expect } from '@playwright/test';