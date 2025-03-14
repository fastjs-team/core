import { callUntilEnd, catchError, secureCall } from "@/main";
import { expect, test, vi } from "vitest";

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

test("catchError with sync function", async () => {
  let error: any;

  catchError(
    () => 0,
    () => {
      error = true;
    }
  );
  expect(error).toBeUndefined();

  catchError(
    () => {
      throw new Error("Test Error");
    },
    () => {
      error = true;
    }
  );
  expect(error).toBe(true);

  expect(
    catchError(
      () => {
        throw new Error("Test Error");
      },
      () => 0
    )
  ).toBeInstanceOf(Error);

  expect(
    await catchError(
      () => {
        throw new Error("Test Error");
      },
      () => 0
    )
  ).toBeInstanceOf(Error);

  expect(catchError(() => 1)).toBe(1);

  expect(await catchError(() => 1)).toBe(1);

  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});
  const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  catchError(() => {
    throw new Error("Test Error");
  });
  expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Test Error"));
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    "[Fastjs warn] fastjs/utils/catchError: An error occurred while executing the function\n" +
      "    > Error: Test Error"
  );
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

test("catchError with async function", async () => {
  let error: any;

  await catchError(
    async () => 1,
    () => {
      error = true;
    }
  );
  expect(error).toBeUndefined();

  await catchError(
    async () => {
      throw new Error("Test Error");
    },
    () => {
      error = true;
    }
  );
  expect(error).toBe(true);

  const err = catchError(
    async () => {
      throw new Error("Test Error");
    },
    () => 0
  );
  expect(err).toBeInstanceOf(Promise);

  const res = await catchError(async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(1), 200);
    });
  });
  expect(res).toBe(1);

  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});
  const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  await catchError(async () => {
    throw new Error("Test Error");
  });
  expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Test Error"));
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    "[Fastjs warn] fastjs/utils/catchError: An error occurred while executing the function\n" +
      "    > Error: Test Error"
  );
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

test("secureCall with sync function", async () => {
  const error = new Error("Test Error");

  expect(
    secureCall(() => {
      throw error;
    })
  ).toStrictEqual([undefined, error]);

  expect(
    secureCall(() => {
      return 1;
    })
  ).toStrictEqual([1, null]);

  expect(
    await secureCall(() => {
      throw error;
    })
  ).toStrictEqual([undefined, error]);

  expect(
    await secureCall(() => {
      return 1;
    })
  ).toStrictEqual([1, null]);
});

test("secureCall with async function", async () => {
  const error = new Error("Test Error");

  expect(
    await secureCall(async () => {
      throw error;
    })
  ).toStrictEqual([undefined, error]);

  expect(
    await secureCall(async () => {
      return 1;
    })
  ).toStrictEqual([1, null]);

  expect(
    await secureCall(async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(1), 200);
      });
    })
  ).toStrictEqual([1, null]);
});
