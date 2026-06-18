import _dev from "../dev";
import { extractIgnoreTokens, getReplacement } from "./lib";

import type { FastjsDate, FastjsDateAPI } from "./date-types";
import { createFastjsDate } from "./date";

export function createMethods(date: FastjsDate): FastjsDateAPI {
  function changeDate(time: number | string): FastjsDate {
    if (typeof time === "string") {
      time = parseFormatString(date.format, time);
    }
    date._date = time;
    date._createAt = Date.now();
    return date;
  }

  const changeFormat = (format: string): FastjsDate => {
    date.format = format;
    return date;
  };

  const setZone = (zone: number): FastjsDate => {
    date.timezoneDiff = zone * 3600 * 1000;
    return date;
  };

  const refresh = (): FastjsDate => {
    date._createAt = Date.now();
    return date;
  };

  const toNumber = (utc: boolean = true): number =>
    utc ? date._date : date._date - date.timezoneDiff;

  const toActiveNumber = (utc: boolean = true): number =>
    toNumber(utc) + Date.now() - date._createAt;

  function toString(): string;
  function toString(showAs: "utc" | "local" | number): string;
  function toString(newFormat: string): string;
  function toString(
    showAs: "utc" | "local" | number,
    newFormat: string
  ): string;

  function toString(
    showOrFormat?: "utc" | "local" | number | string,
    format?: string
  ) {
    interface Attrs {
      show?: "utc" | "local" | number;
      format?: string;
    }
    const attrs: Attrs = {
      format
    };

    if (!showOrFormat) attrs.show = "utc";
    else if (
      typeof showOrFormat === "number" ||
      ["utc", "local"].includes(showOrFormat)
    )
      attrs.show = showOrFormat as "utc" | "local" | number;
    else attrs.format = showOrFormat as string;

    const [formatString, ignoreTokens] = extractIgnoreTokens(
      attrs.format || date.format
    );

    let t = date._date;
    if (typeof attrs.show === "number") t -= attrs.show * 3600 * 1000;
    else if (attrs.show === "local") t -= date.timezoneDiff;

    let result = formatString;
    for (const replace of getReplacement(new Date(t))) {
      const format = replace[0];
      const replacement = replace[1];
      result = result.replace(new RegExp(format, "g"), String(replacement));
    }

    ignoreTokens.forEach((token, index) => {
      result = result.replace(`{{*${index}}}`, `${token}`);
    });

    return result;
  }

  function toActiveString(): string;
  function toActiveString(showAs: "utc" | "local" | number): string;
  function toActiveString(newFormat: string): string;
  function toActiveString(
    showAs: "utc" | "local" | number,
    newFormat: string
  ): string;

  function toActiveString(
    showOrFormat?: "utc" | "local" | number | string,
    format?: string
  ) {
    if (
      typeof showOrFormat === "string" &&
      !["utc", "local"].includes(showOrFormat)
    ) {
      format = showOrFormat;
    }
    return createFastjsDate(format || date.format, toActiveNumber()).toString();
  }

  return {
    changeDate,
    changeFormat,
    setZone,
    refresh,
    toNumber,
    toActiveNumber,
    toString,
    toActiveString
  };
}

export function parseFormatString(
  formatString: string,
  dateString: string
): number {
  let isInIgnoreToken = false;
  let isToken = false;
  let dateStringPointer = -1;
  const allTokens: Array<string> = getReplacement().map(
    (replacement) => replacement[0]
  );

  // Collect the parsed components first so we can apply them in a
  // deterministic order via `new Date(y, m, d, ...)` and avoid the
  // setMonth/setDate rolling pitfall (e.g. setDate(31) on a 30-day month).
  const now = new Date();
  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;
  let hour: number | null = null;
  let minute: number | null = null;
  let second: number | null = null;
  let ms: number | null = null;
  let twelveHour: number | null = null;
  let isAm: boolean | null = null;

  for (let i = 0; i < formatString.length; i++) {
    dateStringPointer++;

    const char = formatString[i];

    if (char === "<" || char === ">") {
      isInIgnoreToken = char === "<";
      isToken = false;
      dateStringPointer--;
      continue;
    }
    if (isInIgnoreToken) {
      continue;
    }

    if (allTokens.includes(char)) {
      if (isToken) {
        if (__DEV__) {
          throw _dev.error(
            "fastjs/date/FastjsDate",
            "Invalid format string, token cannot be adjacent, did you using the chars like 'hh', 'mm'?",
            [
              "***formatString: " + formatString,
              "***dateString: " + dateString,
              "private parseFormatString(formatString: string, dateString: string): number"
            ],
            ["fastjs.wrong"]
          );
        }
        throw new Error(
          "[fastjs/date] Invalid format string: tokens cannot be adjacent"
        );
      }

      switch (char) {
        case "Y":
          year = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 4)
          );
          dateStringPointer += 3;
          break;
        case "M":
          month =
            Number(dateString.slice(dateStringPointer, dateStringPointer + 2)) -
            1;
          dateStringPointer += 1;
          break;
        case "D":
          day = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 2)
          );
          dateStringPointer += 1;
          break;
        case "H":
          twelveHour = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 2)
          );
          dateStringPointer += 1;
          break;
        case "A":
          isAm =
            dateString.slice(dateStringPointer, dateStringPointer + 2) === "AM";
          dateStringPointer += 1;
          break;
        case "a":
          isAm =
            dateString.slice(dateStringPointer, dateStringPointer + 2) === "am";
          dateStringPointer += 1;
          break;
        case "h":
          hour = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 2)
          );
          dateStringPointer += 1;
          break;
        case "m":
          minute = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 2)
          );
          dateStringPointer += 1;
          break;
        case "s":
          second = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 2)
          );
          dateStringPointer += 1;
          break;
        case "S":
          ms = Number(
            dateString.slice(dateStringPointer, dateStringPointer + 3)
          );
          dateStringPointer += 2;
          break;
      }
      isToken = true;
    } else {
      isToken = false;
    }
  }

  if (twelveHour !== null) {
    if (isAm === null) {
      if (__DEV__) {
        throw _dev.error(
          "fastjs/date/FastjsDate",
          "Invalid format string, using 12 hours format but missing AM/PM token",
          [
            "***formatString: " + formatString,
            "***dateString: " + dateString,
            "private parseFormatString(formatString: string, dateString: string): number"
          ],
          ["fastjs.wrong"]
        );
      }
      throw new Error(
        "[fastjs/date] Invalid format string: 12-hour format requires an AM/PM token"
      );
    }
    if (__DEV__ && (twelveHour < 1 || twelveHour > 12)) {
      _dev.warn(
        "fastjs/date/FastjsDate",
        `12-hour value must be in 1..12, received ${twelveHour}`,
        ["***formatString: " + formatString, "***dateString: " + dateString],
        ["fastjs.warn"]
      );
    }
    const normalized = twelveHour % 12;
    hour = isAm ? normalized : normalized + 12;
  }

  // Apply fallbacks from `now` for unspecified components, then construct
  // the Date in one shot so the month/day pair never rolls over.
  const finalYear = year ?? now.getFullYear();
  const finalMonth = month ?? now.getMonth();
  const finalDay = day ?? now.getDate();
  const finalHour = hour ?? 0;
  const finalMinute = minute ?? 0;
  const finalSecond = second ?? 0;
  const finalMs = ms ?? 0;

  return new Date(
    finalYear,
    finalMonth,
    finalDay,
    finalHour,
    finalMinute,
    finalSecond,
    finalMs
  ).getTime();
}
