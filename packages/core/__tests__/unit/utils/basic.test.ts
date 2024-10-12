import { callPromiseUntilEnd, callUntilEnd } from "@/main";
import { expect, test } from "vitest";

test("Call until end", async () => {
  const startT = Date.now();
  let i = 0;
  await callUntilEnd(() => {
    expect(Date.now() - startT).toBeGreaterThanOrEqual(100 * i);
    return ++i === 10;
  }, 100);

  expect(Date.now() - startT).toBeGreaterThanOrEqual(1000);
  expect(i).toBe(10);
});

test("Call promise until end", async () => {
  const startT = Date.now();
  let i = 0;
  await callPromiseUntilEnd(async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        i++;
        expect(Date.now() - startT).toBeGreaterThanOrEqual(100 * i * 2);
        console.log(Date.now() - startT, i);

        resolve(i >= 10);
      }, 100)
    );
  }, 100);

  expect(Date.now() - startT).toBeGreaterThanOrEqual(2000);
  expect(i).toBe(10);
});
