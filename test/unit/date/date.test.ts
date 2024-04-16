import { expect, test } from "vitest";
import { date } from "@/main";

test("Get current timestamp", () => {
  const timestamp = date.now().timestamp;
  expect(typeof timestamp).toBe("number");
  expect(timestamp - new Date().getTime()).toBeLessThan(100);
});

function dateString(date: Date) {
  function prefixZero(num: number) {
    return num < 10 ? `0${num}` : num;
  }

  const [year, month, day, hour, min, sec] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ].map(prefixZero);

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

test("Get current date", () => {
  const dateNow = date.string(); // 2021-09-01 10:10:10
  expect(dateNow).toBe(dateString(new Date()));
});

test("Get current utc date", () => {
  const dateNow = date.now().utcDateString; // 2021-09-01 10:10:10
  const _date = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000
  );
  expect(dateNow).toBe(dateString(_date));
});

test("Parse timestamp to date string", () => {
  const timestamp = 1666351246000
  const dateNow = date.string("Y-M m:s", timestamp);
  expect(dateNow).toBe("2022-10 20:46");
})

test("Parse timestamp with parseTime", () => {
  const timestamp = 1666351246000
  const dateNow = date.parseTime(timestamp, "Y-M m:s").dateString;
  expect(dateNow).toBe("2022-10 20:46");
})

test("Reformat date string", () => {
  const timestamp = 1666351246000
  const dateNow = date.reformat("<Now Date:> Y M & m:s", "Now Date: 2022 10 & 20:46", "Y-M m:s");
  expect(dateNow).toBe("2022-10 20:46");
})
