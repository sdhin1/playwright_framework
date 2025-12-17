import { test, expect } from "../../../utils/webUtils/web-fixtures";

test.describe('Sign In Tests @web', () => {
    
    test('should display sign in page elements', async ({ signInPage }) => {
        // Verify sign in page is loaded
        expect(await signInPage.isSignInPageLoaded()).toBeTruthy();
        
        // Verify all elements are visible
        await expect(signInPage.signInHeader).toBeVisible();
        await expect(signInPage.needAccountLink).toBeVisible();
        await expect(signInPage.emailTextBox).toBeVisible();
        await expect(signInPage.passwordTextBox).toBeVisible();
        await expect(signInPage.signInButton).toBeVisible();
    });

});