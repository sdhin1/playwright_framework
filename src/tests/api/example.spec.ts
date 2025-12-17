import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll('run before all tests', async ({ request }) => {
  //1. Login to get the auth token
  const loginResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login", {
      data: {"user":{"email":"sdhingra13@gmail.com","password":"Welcome1"}},
    }
  );
  const loginResponseJSON = await loginResponse.json();
  authToken = 'Token '+ loginResponseJSON.user.token;
});

test('get test tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json();
  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test');
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
});

test('get articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
});

test("create and delete article", async ({ request }) => {

  //2. Create a new article
  const newArticleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles", {
    data: {
    "article": {
        "title": "Automated Test Article",
        "description": "Automated Article",
        "body": "Automated Article body",
        "tagList": ['automation']
    }
    },
    headers: {
      Authorization: authToken,
    }
  });
  
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual("Automated Test Article");

  //3. Get the list of articles to verify the new article is present
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken,
    }
  });
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles[0].title).toEqual("Automated Test Article");

  //4. Delete the newly created article
  const slugId = newArticleResponseJSON.article.slug;
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken,
    }
  });
  expect(deleteArticleResponse.status()).toEqual(204);

});

test("create, update and delete article", async ({ request }) => {

  //2. Create a new article
  const newArticleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles", {
    data: {
    "article": {
        "title": "Automated Test NEW Article",
        "description": "Automated Article",
        "body": "Automated Article body",
        "tagList": ['automation']
    }
    },
    headers: {
      Authorization: authToken,
    }
  });
  
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual("Automated Test NEW Article");

  //3. Get the list of articles to verify the new article is present
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken,
    }
  });
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles[0].title).toEqual("Automated Test NEW Article");

  //4. Update the newly created article
  const slugId = newArticleResponseJSON.article.slug;
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: {
      "article": {
          "title": "Automated Test UPDATED Article",
          "description": "Automated Article UPDATED",
          "body": "Automated Article body UPDATED",
          "tagList": ['automation', 'updated']
      }
      },
    headers: {
      Authorization: authToken,
    }
  });
  const updateArticleResponseJSON =  await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJSON.article.title).toEqual("Automated Test UPDATED Article");

  //5. Delete the newly created article
  const slugIdUpdated = updateArticleResponseJSON.article.slug;
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugIdUpdated}`, {
    headers: {
      Authorization: authToken,
    }
  });
  expect(deleteArticleResponse.status()).toEqual(204);

});
