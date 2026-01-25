import { addQuery, transformPathParams } from "@/request/lib";
import { describe, expect, test } from "vitest";

import { request } from "@/main";

describe("Create Request Instance", () => {
  test("request.create", () => {
    const req = request.create("https://jsonplaceholder.typicode.com/posts");
    expect(req.url, "URL Must Match").toBe(
      "https://jsonplaceholder.typicode.com/posts"
    );
  });

  test("request.create: with data", () => {
    const req = request.create("https://jsonplaceholder.typicode.com/posts", {
      title: "XiaoDong",
      body: "Software Engineer"
    });
    expect(req.url, "URL Must Match").toBe(
      "https://jsonplaceholder.typicode.com/posts"
    );
    expect(req.data, "Data Must Match").toMatchObject({
      title: "XiaoDong",
      body: "Software Engineer"
    });
  });

  test("request.create: with config", () => {
    const req = request.create(
      "https://jsonplaceholder.typicode.com/posts",
      {
        title: "XiaoDong",
        body: "Software Engineer"
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    expect(req.url, "URL Must Match").toBe(
      "https://jsonplaceholder.typicode.com/posts"
    );
    expect(req.data, "Data Must Match").toMatchObject({
      title: "XiaoDong",
      body: "Software Engineer"
    });
    expect(req.config.headers, "Headers Must Match").toMatchObject({
      "Content-Type": "application/json"
    });
  });

  test("request.create: send get request, set url when setup", async () => {
    const req = request.create("https://jsonplaceholder.typicode.com/posts");
    const data = await req
      .get<{ title: string; userId: number; id: number; body: string }[]>()
      .then((data, req) => {
        expect(req.status, "Status Must Be 200").toBe(200);
        expect(data[0].title, "Response Data Must Match").toBeDefined();
        expect(data[0].userId, "Response Data Must Match").toBeDefined();
        expect(data[0].id, "Response Data Must Match").toBeDefined();
        expect(data[0].body, "Response Data Must Match").toBeDefined();
      });
    expect(
      data.length,
      "Request Data Length Must Be Greater Than 0"
    ).toBeGreaterThan(0);
    expect(data.getFullReturn().status, "Full Return Status Must Be 200").toBe(
      200
    );
  });

  test("request.create: send get request, set url when send", async () => {
    const req = request.create();
    const data = await req
      .get<
        { title: string; userId: number; id: number; body: string }[]
      >("https://jsonplaceholder.typicode.com/posts")
      .then((data, req) => {
        expect(req.status, "Status Must Be 200").toBe(200);
        expect(data[0].title, "Response Data Must Match").toBeDefined();
        expect(data[0].userId, "Response Data Must Match").toBeDefined();
        expect(data[0].id, "Response Data Must Match").toBeDefined();
        expect(data[0].body, "Response Data Must Match").toBeDefined();
      });
    expect(
      data.length,
      "Request Data Length Must Be Greater Than 0"
    ).toBeGreaterThan(0);
    expect(data.getFullReturn().status, "Full Return Status Must Be 200").toBe(
      200
    );
  });
});

describe("Directly Functions request.[method]", () => {
  test("request.get", async () => {
    const data = await request.get<{ title: string }>(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    expect(data.title).not.toBeNull();
  });

  test("request.get: with params", async () => {
    const data = await request
      .get<
        { title: string; userId: number; id: number; body: string }[]
      >("https://jsonplaceholder.typicode.com/posts")
      .then((data, req) => {
        expect(req.status, "Status Must Be 200").toBe(200);
        expect(data[0].title, "Response Data Must Match").toBeDefined();
        expect(data[0].userId, "Response Data Must Match").toBeDefined();
        expect(data[0].id, "Response Data Must Match").toBeDefined();
        expect(data[0].body, "Response Data Must Match").toBeDefined();
      });
    expect(
      data.length,
      "Request Data Length Must Be Greater Than 0"
    ).toBeGreaterThan(0);
    expect(data.getFullReturn().status, "Full Return Status Must Be 200").toBe(
      200
    );
  });

  test("request.post", async () => {
    await request
      .post("https://jsonplaceholder.typicode.com/posts", {
        title: "XiaoDong",
        body: "Software Engineer"
      })
      .then((data, req) => {
        expect(req.status, "Status Must Be 201").toBe(201);
        expect(req.request.data, "Request Data Must Match").toMatchObject({
          title: "XiaoDong",
          body: "Software Engineer"
        });
        expect(data, "Response Data Must Match").toMatchObject({
          title: "XiaoDong",
          body: "Software Engineer",
          id: expect.any(Number)
        });
      });
  });

  test("request.put", async () => {
    const data = await request
      .put("https://jsonplaceholder.typicode.com/posts/1", {
        name: "XiaoDong",
        job: "Software Engineer"
      })
      .then((data, req) => {
        expect(data, "Response Data Must Match").toMatchObject({
          id: 1
        });
        expect(req.status, "Status Must Be 200").toBe(200);
        expect(req.request.data, "Request Data Must Match").toMatchObject({
          name: "XiaoDong",
          job: "Software Engineer"
        });
      });
    expect(data.getFullReturn().status).toBe(200);
  });

  test("request.patch", async () => {
    const data = await request
      .patch<{ name: string; job: string }>(
        "https://jsonplaceholder.typicode.com/posts/1",
        {
          name: "XiaoDong",
          job: "Software Engineer"
        }
      )
      .then((data, req) => {
        expect(req.status).toBe(200);
        expect(data.name, "Response Data Must Match").toBeDefined();
        expect(data.job, "Response Data Must Match").toBeDefined();
      });
    expect(data.getFullReturn().status).toBe(200);
  });

  test("request.delete", async () => {
    const data = await request
      .delete("https://jsonplaceholder.typicode.com/posts/1")
      .then((data, req) => {
        expect(req.status).toBe(200);
      });
    expect(data.getFullReturn().status).toBe(200);
  });

  test("request.delete: with path params", async () => {
    await request
      .delete("https://jsonplaceholder.typicode.com/posts/:id", {
        id: 2
      })
      .then((data, req) => {
        expect(req.status, "Status Must Be 200").toBe(200);
        expect(
          req.request.request?.url,
          "Request URL Must Match"
        ).toMatchInlineSnapshot(
          `"https://jsonplaceholder.typicode.com/posts/2"`
        );
      });
  });
});

describe("Internal Functions", () => {
  test("lib.addQuery", () => {
    const url = addQuery("https://jsonplaceholder.typicode.com/posts", {
      page: 2
    });
    expect(url).toMatchInlineSnapshot(
      `"https://jsonplaceholder.typicode.com/posts?page=2"`
    );

    const url2 = addQuery(
      "https://jsonplaceholder.typicode.com/posts",
      "page=2"
    );
    expect(url2).toMatchInlineSnapshot(
      `"https://jsonplaceholder.typicode.com/posts?page=2"`
    );
  });

  test("lib.transformPathParams", () => {
    const [url] = transformPathParams(
      "https://jsonplaceholder.typicode.com/posts/:id",
      {
        id: 2
      }
    );
    expect(url, "URL Must Match").toMatchInlineSnapshot(
      `"https://jsonplaceholder.typicode.com/posts/2"`
    );

    const [url3] = transformPathParams(
      "https://jsonplaceholder.typicode.com/posts/:id/:name",
      {
        id: 2,
        name: "XiaoDong"
      }
    );
    expect(url3, "URL Must Match").toMatchInlineSnapshot(
      `"https://jsonplaceholder.typicode.com/posts/2/XiaoDong"`
    );
  });
});
