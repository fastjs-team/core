import { expect, assert, test } from "vitest";
import { rand, utils } from "@/main";

test("Random number", () => {
  const num = utils.rand(1, 10);
  expect(num).toBeGreaterThanOrEqual(1);
  expect(num).toBeLessThanOrEqual(10);
});

test("Random number with decimal", () => {
  const num = rand(1, 10, 1);
  expect(num).toBeGreaterThanOrEqual(1);
  expect(num).toBeLessThanOrEqual(10);
});

test("Random string", () => {
  const str = utils.randString(10);
  expect(str).toMatch(/^[a-z]{10}$/);
});

test("Random string with only uppercase letters", () => {
  const str = utils.randString(10, { upper: true, lower: false });
  expect(str).toMatch(/^[A-Z]{10}$/);
});

test("Random string with all letters", () => {
  const str = utils.randString(10, { upper: true });
  expect(str).toMatch(/^[a-zA-Z]{10}$/);
});

test("Random string with only numbers", () => {
  const str = utils.randString(10, { number: true, letter: false });
  expect(str).toMatch(/^\d{10}$/);
});

test("Random string with custom characters", () => {
  const str = utils.randString(10, { custom: ["!", "@", "#", "$"] });
  expect(str).toMatch(/^[a-z!@#$]{10}$/);
});

test("Random string with only custom characters", () => {
  const str = utils.randString(10, { custom: "!@#$", letter: false });
  expect(str).toMatch(/^[!@#$]{10}$/);
});

test("Random uuid", () => {
  const uuid = utils.uuid();
  assert(
    uuid.match(
      /^[0-9a-z]{8}-[0-9a-z]{4}-4[0-9a-z]{3}-[0-9a-z]{4}-[0-9a-z]{12}$/
    )
  );
});
