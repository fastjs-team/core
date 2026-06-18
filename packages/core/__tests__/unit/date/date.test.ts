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
  const timestamp = 1666351246000;
  const dateNow = date.string("Y-M m:s", timestamp);
  expect(dateNow).toBe("2022-10 20:46");
});

test("Parse timestamp with parseTime", () => {
  const timestamp = 1666351246000;
  const dateNow = date.parseTime(timestamp, "Y-M m:s").dateString;
  expect(dateNow).toBe("2022-10 20:46");
});

test("Reformat date string", () => {
  const dateNow = date.reformat(
    "<Now Date:> Y M & m:s",
    "Now Date: 2022 10 & 20:46",
    "Y-M m:s"
  );
  expect(dateNow).toBe("2022-10 20:46");
});

test("hh/mm/ss tokens are zero-padded", () => {
  const ts = new Date(2022, 0, 5, 4, 7, 9).getTime();
  expect(date.string("hh:mm:ss", ts)).toBe("04:07:09");
});

test("D-M-Y format does not roll over the month boundary", () => {
  // January 31st parsed as a day-first format must NOT roll into March.
  const parsed = date.parseDate("31-01-2022", "D-M-Y");
  expect(parsed.date.getFullYear()).toBe(2022);
  expect(parsed.date.getMonth()).toBe(0);
  expect(parsed.date.getDate()).toBe(31);
});

test("parseDate fills missing components from now without rolling", () => {
  const parsed = date.parseDate("2024", "Y");
  expect(parsed.date.getFullYear()).toBe(2024);
});
