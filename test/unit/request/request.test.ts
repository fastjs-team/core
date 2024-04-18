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
