import { addQuery, transformPathParams } from "@/request/lib";
import { describe, expect, test, vi } from "vitest";

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

  test("lib.addQuery preserves fragment", () => {
    const url = addQuery("https://example.com/path#sec", { page: 2 });
    expect(url).toBe("https://example.com/path?page=2#sec");
  });

  test("lib.addQuery handles existing query string", () => {
    const url = addQuery("https://example.com/path?a=1", { b: 2 });
    expect(url).toBe("https://example.com/path?a=1&b=2");
  });

  test("lib.addQuery serialises array values", () => {
    const url = addQuery("https://example.com/", { tags: ["a", "b"] });
    expect(url).toBe("https://example.com/?tags=a&tags=b");
  });

  test("lib.addQuery drops null/undefined entries", () => {
    const url = addQuery("https://example.com/", {
      kept: 1,
      empty: null,
      missing: undefined
    });
    expect(url).toBe("https://example.com/?kept=1");
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

  test("lib.transformPathParams URL-encodes reserved characters", () => {
    const [url, matches] = transformPathParams("/api/:slug", {
      slug: "hello world/foo"
    });
    expect(url).toBe("/api/hello%20world%2Ffoo");
    expect(matches).toEqual(["slug"]);
  });

  test("lib.transformPathParams leaves placeholder when value missing", () => {
    const [url, matches] = transformPathParams("/api/:missing", {});
    expect(url).toBe("/api/:missing");
    expect(matches).toEqual([]);
  });
});

describe("Body Serialisation", () => {
  test("create exposes abort() helper", () => {
    const req = request.create("https://example.com/");
    expect(typeof req.abort).toBe("function");
    // calling abort before sending is a no-op
    expect(() => req.abort()).not.toThrow();
  });

  test("Form data body skips JSON header and pass-through", async () => {
    let observed: Request | null = null;
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input: any) => {
        observed = input;
        return new Response("ok", { status: 200 });
      });

    const form = new FormData();
    form.append("name", "fastjs");

    await new Promise<void>((resolve) => {
      const req = request.create("https://example.com/");
      // bypass plain-object stringification by passing FormData as send body
      (req as any).data = form;
      req.send("POST").finally(() => resolve());
      setTimeout(resolve, 200);
    });

    expect(observed).not.toBeNull();
    // jsdom/undici sets a multipart boundary automatically; we just want to
    // assert we did NOT force JSON Content-Type on a FormData payload.
    expect(observed!.headers.get("Content-Type")).not.toBe("application/json");

    fetchMock.mockRestore();
  });

  test("Plain object body sets JSON content type automatically", async () => {
    let observed: Request | null = null;
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input: any) => {
        observed = input;
        return new Response("ok", { status: 200 });
      });

    await new Promise<void>((resolve) => {
      request
        .create("https://example.com/")
        .send("POST", { hello: "world" })
        .finally(() => resolve());
      setTimeout(resolve, 200);
    });

    expect(observed).not.toBeNull();
    expect(observed!.headers.get("Content-Type")).toBe("application/json");
    expect(await observed!.text()).toBe('{"hello":"world"}');

    fetchMock.mockRestore();
  });

  test("User-provided Content-Type is not overwritten", async () => {
    let observed: Request | null = null;
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input: any) => {
        observed = input;
        return new Response("ok", { status: 200 });
      });

    await new Promise<void>((resolve) => {
      request
        .create("https://example.com/", undefined, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .send("POST", { a: "1" })
        .finally(() => resolve());
      setTimeout(resolve, 200);
    });

    expect(observed!.headers.get("Content-Type")).toBe(
      "application/x-www-form-urlencoded"
    );

    fetchMock.mockRestore();
  });
});
