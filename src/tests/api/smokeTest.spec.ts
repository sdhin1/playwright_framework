import { apiTest as test } from "../../../utils/apiUtils/api-fixtures";
import { expect } from "@playwright/test";

let authToken: string;

test.beforeAll("run before all tests @api", async ({ api }) => {
  const tokenResponse = await api
    .path("/users/login")
    .body({ user: { email: "sdhingra13@gmail.com", password: "Welcome1" } })
    .postRequest(200);

  authToken = "Token " + tokenResponse.user.token;
});

test("Get Articles @api", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(response.articles.length).toBeLessThanOrEqual(10);
  expect(response.articlesCount).toEqual(10);
});

test("Get Test Tags @api", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);

  expect(response.tags[0]).toEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test("Create and Delete Article @api", async ({ api }) => {
  //2. Create a new article
  const newArticleResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Automated Test Article",
        description: "Automated Article",
        body: "Automated Article body",
        tagList: ["automation"],
      },
    })
    .postRequest(201);

  expect(newArticleResponse.article.title).toEqual("Automated Test Article");
  const slugId = newArticleResponse.article.slug;

  //3. Get the list of articles to verify the new article is present
  const articlesResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .headers({ Authorization: authToken })
    .getRequest(200);

  expect(articlesResponse.articles[0].title).toEqual("Automated Test Article");

  //4. Delete the newly created article
  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

  //5. Get the list of articles to verify the new article is present
  const articlesResponseLatest = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .headers({ Authorization: authToken })
    .getRequest(200);

  expect(articlesResponseLatest.articles[0].title).not.toEqual(
    "Automated Test Article"
  );
});


test("Create, Update and Delete Article @api", async ({ api }) => {
  //2. Create a new article
  const newArticleResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Automated Test Article",
        description: "Automated Article",
        body: "Automated Article body",
        tagList: ["automation"],
      },
    })
    .postRequest(201);

  expect(newArticleResponse.article.title).toEqual("Automated Test Article");
  const slugId = newArticleResponse.article.slug;

  //3. Get the list of articles to verify the new article is present
  const articlesResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .headers({ Authorization: authToken })
    .getRequest(200);

  expect(articlesResponse.articles[0].title).toEqual("Automated Test Article");

  //4. Update the newly created article
  const updatedArticleResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Automated Test Article UPDATED",
        description: "Automated Article UPDATED",
        body: "Automated Article body UPDATED",
        tagList: ["automation", "updated"],
      },
    })
    .putRequest(200);

  expect(updatedArticleResponse.article.title).toEqual(
    "Automated Test Article UPDATED"
  );

  //4. Delete the newly created article
  const slugIdUpdated = updatedArticleResponse.article.slug;
  await api
    .path(`/articles/${slugIdUpdated}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

  //5. Get the list of articles to verify the new article is present
  const articlesResponseLatest = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .headers({ Authorization: authToken })
    .getRequest(200);

  expect(articlesResponseLatest.articles[0].title).not.toEqual(
    "Automated Test Article UPDATED"
  );
});
