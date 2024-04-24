import { expect, test } from "vitest";
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
    .put("https://reqres.in/api/users/2", {
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(200);
    });
});

test("Send a patch request", async () => {
  request
    .patch("https://reqres.in/api/users/2", {
      name: "XiaoDong",
      job: "Software Engineer"
    })
    .then((data, req) => {
      expect(req.status).toBe(200);
    });
});

test("Send a delete request", async () => {
  request.delete("https://reqres.in/api/users/2").then((data, req) => {
    expect(req.status).toBe(204);
  });
});
