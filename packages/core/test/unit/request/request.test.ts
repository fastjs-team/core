import { addQuery, transformPathParams } from "@/request/lib";
import { expect, test } from "vitest";

import { request } from "@/main";

test("request.get", async () => {
  const data = await request.get("https://reqres.in/api/users");
  expect(data.page).toBe(1);
  expect(data.data.length).toBeGreaterThan(0);
});

test("request.get: with params", async () => {
  const data = await request.get("https://reqres.in/api/users", {
    page: 2
  });
  expect(data.page).toBe(2);
});

test("request.post", async () => {
  await request
    .post("https://reqres.in/api/users", {
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(201);
      expect(req.request.data).toMatchObject({
        name: "XiaoDong",
        job: "Software Engineer"
      });
    });
});

test("request.put", async () => {
  await request
    .put("https://reqres.in/api/users/2", {
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(200);
      expect(req.request.data).toMatchObject({
        name: "XiaoDong",
        job: "Software Engineer"
      });
    });
});

test("request.patch", async () => {
  await request
    .patch("https://reqres.in/api/users/", {
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(200);
    });
});

test("request.delete", async () => {
  await request.delete("https://reqres.in/api/users/").then((data, req) => {
    expect(req.status).toBe(204);
  });
});

test("request.delete: with path params", async () => {
  await request
    .delete("https://reqres.in/api/users/:id", {
      id: 2
    })
    .then((data, req) => {
      expect(req.status).toBe(204);
      expect(req.request.request?.url).toMatchInlineSnapshot(
        `"https://reqres.in/api/users/2"`
      );
    });
});

test("lib.addQuery", () => {
  const url = addQuery("https://reqres.in/api/users", {
    page: 2
  });
  expect(url).toMatchInlineSnapshot(`"https://reqres.in/api/users?page=2"`);

  const url2 = addQuery("https://reqres.in/api/users", "page=2");
  expect(url2).toMatchInlineSnapshot(`"https://reqres.in/api/users?page=2"`);
});

test("lib.transformPathParams", () => {
  const [url] = transformPathParams("https://reqres.in/api/users/:id", {
    id: 2
  });
  expect(url).toMatchInlineSnapshot(`"https://reqres.in/api/users/2"`);

  const [url3] = transformPathParams("https://reqres.in/api/users/:id/:name", {
    id: 2,
    name: "XiaoDong"
  });
  expect(url3).toMatchInlineSnapshot(
    `"https://reqres.in/api/users/2/XiaoDong"`
  );
});
