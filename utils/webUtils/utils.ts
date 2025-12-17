import { expect, Locator, Page } from "@playwright/test";

export async function isImageVisibleAndLoaded(image: Locator, timeout = 5000): Promise<boolean> {
  try {
    // wait for the element to be visible first
    await image.waitFor({ state: 'visible', timeout });

    // check the DOM image properties to ensure it loaded successfully
    const loaded = await image.evaluate((el) => {
      const img = el as HTMLImageElement | null;
      if (!img) return false;
      return !!img.complete && (img.naturalWidth ?? 0) > 0;
    });

    return Boolean(loaded);
  } catch {
    return false;
  }
}

/**
 * Validates text content with support for soft assertions
 * @param locator - Playwright locator to get text from
 * @param expectedText - Expected text to compare against
 * @param softAssert - Whether to use soft assertion (default: false)
 */

export async function validateTextContent(locator: Locator, expectedText: string, softAssert: boolean = false): Promise<void> {
  const actualText = (await locator.innerText()).trim();
  const assertion = softAssert ? expect.soft : expect;

  assertion(actualText, `Expected text "${expectedText}" but found "${actualText}"`).toBe(expectedText);
}

/**
 * Clicks a link that opens in new tab and performs verification. finally closes the new tab
 * @param page - Playwright Page object containing the link
 * @param linkLocator - Locator for the link element
 * @param expectedUrl - Expected substring in the new tab URL
 * @param timeout - Optional timeout for wait operations (default: 25000ms)
 * @param softAssert - Optional flag for soft assertions (default: false)
 * @returns Promise<void>
 */
export async function validateLinkInNewTab(
  page: Page,
  linkLocator: Locator,
  expectedUrl: string,
  timeout: number = 25000,
  softAssert: boolean = false,
): Promise<void> {
  await linkLocator.waitFor({ state: 'visible', timeout });

  let actualUrl: string;
  let newPage: Page | undefined;

  try {
    // Prepare to capture the new page event
    [newPage] = await Promise.all([page.context().waitForEvent('page', { timeout }), linkLocator.click()]);

    // Wait for the new page to load completely and for the expected URL
    await newPage.waitForLoadState('load', { timeout });
    await newPage.waitForFunction((expected) => window.location.href.includes(expected), expectedUrl, { timeout });
    actualUrl = newPage.url();
  } catch (error) {
    actualUrl = newPage ? newPage.url() : '';
  } finally {
    // Close the new tab if it was opened
    if (newPage) {
      await newPage.close();
    }
  }

  // Always assert, even if navigation failed
  if (softAssert) {
    expect.soft(actualUrl).toContain(expectedUrl);
  } else {
    expect(actualUrl).toContain(expectedUrl);
  }
}

/**
 * Clicks a link that navigates in the same tab and performs verification.
 * After assertion, navigates back to the original page and waits for load.
 * @param page - Playwright Page object containing the link
 * @param linkLocator - Locator for the link element
 * @param expectedUrl - Expected substring in the navigated URL
 * @param timeout - Optional timeout for wait operations (default: 10000ms)
 * @param softAssert - Optional flag for soft assertions (default: false)
 * @returns Promise<void>
 */
export async function validateLinkNavigation(
  page: Page,
  linkLocator: Locator,
  expectedUrl: string,
  timeout: number = 25000,
  softAssert: boolean = false,
): Promise<void> {
  await new Promise((res) => setTimeout(res, 2000));
  await linkLocator.waitFor({ state: 'attached', timeout });
  await linkLocator.waitFor({ state: 'visible', timeout });

  const initialUrl = page.url();
  let actualUrl: string;

  try {
    await linkLocator.click();
    await page.waitForFunction((expected) => window.location.href.includes(expected), expectedUrl, { timeout });
    await page.waitForLoadState('load', { timeout });
    actualUrl = page.url();
  } catch (error) {
    actualUrl = page.url();
  } finally {
    // Always navigate back to initialUrl
    await page.goto(initialUrl, { timeout });
    await page.waitForLoadState('load', { timeout });
  }

  if (softAssert) {
    expect.soft(actualUrl).toContain(expectedUrl);
  } else {
    expect(actualUrl).toContain(expectedUrl);
  }
}

export async function waitForAllImagesToLoad(page: Page, timeout = 30000): Promise<void> {
  await page.waitForFunction(
    () => {
      const images = Array.from(document.images);
      // Ensure at least one image is present, then check if all are complete
      return images.length > 0 && images.every((img) => img.complete);
    },
    null,
    { timeout },
  );
}

export async function validateExternalDomainLinkInNewTab(
  page: Page,
  linkLocator: Locator,
  timeout: number = 25000,
  softAssert: boolean = false,
): Promise<void> {
  await linkLocator.waitFor({ state: 'visible', timeout });

  let newPage: Page | undefined;
  let actualUrl: string = '';

  try {
    [newPage] = await Promise.all([page.context().waitForEvent('page', { timeout }), linkLocator.click()]);
    await newPage.waitForLoadState('load', { timeout });
    actualUrl = newPage.url();
  } catch (error) {
    actualUrl = newPage ? newPage.url() : '';
  } finally {
    if (newPage) {
      await newPage.close();
    }
  }

  // Only assert that the tab was opened and navigation was attempted
  if (softAssert) {
    expect.soft(newPage).not.toBeNull();
    expect.soft(actualUrl).not.toBe('');
  } else {
    expect(newPage).not.toBeNull();
    expect(actualUrl).not.toBe('');
  }
}

/**
 * Validates the href attribute of a link element
 * @param page - Playwright Page object
 * @param linkLocator - Locator for the link element
 * @param timeout - Optional timeout for wait operations (default: 25000ms)
 * @param expectedHref - Expected href attribute value
 * @param softAssert - Optional flag for soft assertions (default: false)
 * @returns Promise<void>
 */
export async function validateLinkHref(
  page: Page,
  linkLocator: Locator,
  expectedHref: string,
  timeout: number = 15000,
  softAssert: boolean = false,
): Promise<void> {
  await linkLocator.waitFor({ state: 'visible', timeout });

  let actualHref: string = '';

  try {
    actualHref = (await linkLocator.getAttribute('href')) || '';
  } catch (error) {
  }

  // Perform assertion
  if (softAssert) {
    expect.soft(actualHref, `Expected href "${expectedHref}" but found "${actualHref}"`).toBe(expectedHref);
  } else {
    expect(actualHref, `Expected href "${expectedHref}" but found "${actualHref}"`).toBe(expectedHref);
  }
}