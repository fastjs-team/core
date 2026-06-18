/**
 * @vitest-environment jsdom
 */

import { afterEach, assert, expect, test } from "vitest";
import { cookie } from "@/main";

afterEach(() => {
  // best-effort cleanup so tests don't bleed cookies between runs
  document.cookie.split("; ").forEach((entry) => {
    const name = entry.split("=")[0];
    if (name) cookie.remove(decodeURIComponent(name));
  });
});

test("Add cookie", () => {
  cookie.set("test", "test");
  assert.equal(cookie.get("test"), "test");
});

test("Remove cookie", () => {
  cookie.set("test", "test");
  cookie.remove("test");
  cookie.remove("test");
  assert.equal(cookie.get("test"), null);
});

test("Check if cookie exists", () => {
  assert.equal(cookie.exists("test"), false);
  cookie.set("test", "test");
  assert.equal(cookie.exists("test"), true);
});

test("Add cookie with expires", () => {
  cookie.set("test", "test", { expires: 1000 });
  assert.equal(cookie.get("test"), "test");
});

test("Cookie name with regex special characters", () => {
  cookie.set("foo.bar+baz", "value");
  expect(cookie.get("foo.bar+baz")).toBe("value");
});

test("Cookie value with reserved characters round-trips", () => {
  cookie.set("complex", "a=b; c&d");
  expect(cookie.get("complex")).toBe("a=b; c&d");
});

test("get returns null for missing cookie", () => {
  expect(cookie.get("definitely-missing")).toBeNull();
});

test("set with maxAge writes Max-Age attribute", () => {
  cookie.set("ttl", "x", { maxAge: 60 });
  expect(cookie.get("ttl")).toBe("x");
});

test("set with sameSite=Lax stores cookie", () => {
  cookie.set("sa", "1", { sameSite: "Lax" });
  expect(cookie.get("sa")).toBe("1");
});

test("create() reuses default path/domain for set and remove", () => {
  const instance = cookie.create("/");
  instance.set("scoped", "value");
  expect(cookie.get("scoped")).toBe("value");
  instance.remove("scoped");
  expect(cookie.get("scoped")).toBeNull();
});
