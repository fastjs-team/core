import { expect, test } from "vitest";

import { addQuery } from "@/request/lib";
import { request } from "@/main";

test("Get a json response and use", async () => {
  const data = await request.get("https://reqres.in/api/users");
  expect(data.page).toBe(1);
  expect(data.data.length).toBeGreaterThan(0);
});

test("Send a get request with query", async () => {
  const data = await request.get("https://reqres.in/api/users", {
    page: 2
  });
  expect(data.page).toBe(2);
});

test("Send a post request", async () => {
  request
    .post("https://reqres.in/api/users", {
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(201);
    });
});

test("Send a put request", async () => {
  request
    .put("https://reqres.in/api/users/:id", {
      id: 2,
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(200);
    });
});

test("Send a patch request", async () => {
  request
    .patch("https://reqres.in/api/users/:id", {
      id: 2,
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(200);
    });
});

test("Send a delete request", async () => {
  request
    .delete("https://reqres.in/api/users/:id", {
      id: 2
    })
    .then((data, req) => {
      expect(req.status).toBe(204);
    });
});

test("Should add query to url", () => {
  const [url] = addQuery("https://reqres.in/api/users", {
    page: 2
  });
  expect(url).toMatchInlineSnapshot(`"https://reqres.in/api/users?page=2"`);

  const [url2] = addQuery("https://reqres.in/api/users/:id", {
    id: 2
  });
  expect(url2).toMatchInlineSnapshot(`"https://reqres.in/api/users/2"`);

  const [url3] = addQuery("https://reqres.in/api/users/:id/:name", {
    id: 2,
    name: "XiaoDong"
  });
  expect(url3).toMatchInlineSnapshot(
    `"https://reqres.in/api/users/2/XiaoDong"`
  );
});
