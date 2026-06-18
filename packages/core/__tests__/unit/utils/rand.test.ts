import { expect, assert, test, vi } from "vitest";
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

test("Random number with two decimal places stays within the range", () => {
  for (let i = 0; i < 200; i++) {
    const num = rand(0, 1, 2);
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(1);
    expect(Math.round(num * 100)).toBeCloseTo(num * 100, 6);
  }
});

test("Random number swaps reversed bounds without throwing", () => {
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const num = rand(10, 1);
  expect(num).toBeGreaterThanOrEqual(1);
  expect(num).toBeLessThanOrEqual(10);
  warnSpy.mockRestore();
});

test("Random number covers full range (statistical check)", () => {
  const counts = [0, 0, 0];
  for (let i = 0; i < 3000; i++) counts[rand(0, 2)]++;
  for (const c of counts) expect(c).toBeGreaterThan(0);
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

test("Random string with no character set returns empty string and warns", () => {
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const str = utils.randString(10, { letter: false });
  expect(str).toBe("");
  expect(warnSpy).toHaveBeenCalled();
  warnSpy.mockRestore();
});

test("Random uuid is a valid RFC 4122 v4 UUID", () => {
  const uuid = utils.uuid();
  assert(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      uuid
    ),
    `expected a valid v4 uuid, got ${uuid}`
  );
});

test("Random uuid generates distinct values", () => {
  const set = new Set<string>();
  for (let i = 0; i < 100; i++) set.add(utils.uuid());
  expect(set.size).toBe(100);
});
