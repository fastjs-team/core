import { expect, test } from "vitest";

import { callUntilEnd } from "@/main";

test("Call until end", async () => {
  const startT = Date.now();
  let i = 0;
  await callUntilEnd(() => {
    expect(Date.now() - startT).toBeGreaterThanOrEqual(50 * i);
    return ++i === 5;
  }, 50);

  expect(Date.now() - startT).toBeGreaterThanOrEqual(250);
  expect(i).toBe(5);
});

test("Call promise until end", async () => {
  const startT = Date.now();
  let i = 0;
  await callUntilEnd(async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        i++;
        expect(Date.now() - startT).toBeGreaterThanOrEqual(25 * i * 2);

        resolve(i >= 5);
      }, 25)
    );
  }, 25);

  expect(Date.now() - startT).toBeGreaterThanOrEqual(250);
  expect(i).toBe(5);
});
