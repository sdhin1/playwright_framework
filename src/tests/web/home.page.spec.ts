import { test, expect } from "../../../utils/webUtils/web-fixtures";
import { HeaderComponent } from "../../pages/components/Header";
import { BannerComponent } from "../../pages/components/Banner";
import { PopularTagsComponent } from "../../pages/components/PopularTags";
import { FeedToggleComponent } from "../../pages/components/FeedToggle";

test.describe("Conduit Home Page - Header @web", () => {
  let headerComponent: HeaderComponent;

  test.beforeEach(async ( {nonSignInHomePage} ) => {
    headerComponent = nonSignInHomePage.headerComponent;
  });

  test("should display header elements correctly", async () => {
    expect(await headerComponent.isConduitIconVisible()).toBeTruthy();
    expect(await headerComponent.isHomeLinkVisible()).toBeTruthy();
  });
});

test.describe("Conduit Home Page - Banner @web", () => {
  let bannerComponent: BannerComponent;

  test.beforeEach(async ({nonSignInHomePage}) => {
    bannerComponent = nonSignInHomePage.bannerComponent;
  });

  test("should display banner with correct content", async () => {
    const headerText = await bannerComponent.getHeaderText();
    expect(headerText.toLowerCase()).toContain("conduit");

    const description = await bannerComponent.getDescriptionText();
    expect(description).toMatch(
      /A place to learn and practice test automation./
    );

    const bondarHref = await bannerComponent.getBondarLinkHref();
    expect(bondarHref).toMatch("www.bondaracademy.com");
  });
});

test.describe("Conduit Home Page - Popular Tags @web", () => {
  let popularTagsComponent: PopularTagsComponent;

  test.beforeEach(async ({nonSignInHomePage}) => {
    popularTagsComponent = nonSignInHomePage.popularTagsComponent;
  });

  test("should display popular tags", async ({ api }) => {
    const response = await api.path("/tags").getRequest(200);
    const expectedTags = response.tags;

    const tags = await popularTagsComponent.getAllTags();
    expect(tags.length).toBeGreaterThan(0);

    expectedTags.forEach((expectedTag: string) => {
      expect(tags).toContain(expectedTag);
    });
  });
});

test.describe("Conduit Home Page - Feed Toggle", () => {
  let feedToggleComponent: FeedToggleComponent;

  test.beforeEach(async ({nonSignInHomePage}) => {
    feedToggleComponent = nonSignInHomePage.feedToggleComponent;
  });

  test("should toggle between feeds", async () => {
    await feedToggleComponent.selectGlobalFeed();
    expect(await feedToggleComponent.isGlobalFeedActive()).toBeTruthy();
  });
});
