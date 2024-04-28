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
  let parsedDate = new Date();
  parsedDate.setMilliseconds(0);
  let is12Hour = "";
  let isAm = null;
  let isToken = false;
  let dateStringPointer = -1;
  const allTokens: Array<string> = getReplacement().map(
    (replacement) => replacement[0]
  );

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
        throw "fg3j";
      }

      switch (char) {
        case "Y":
          parsedDate.setFullYear(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 4))
          );
          dateStringPointer += 3;
          break;
        case "M":
          parsedDate.setMonth(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 2)) -
              1
          );
          dateStringPointer += 1;
          break;
        case "D":
          parsedDate.setDate(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 2))
          );
          dateStringPointer += 1;
          break;
        case "H":
          is12Hour = dateString.slice(dateStringPointer, dateStringPointer + 2);
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
          parsedDate.setHours(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 2))
          );
          dateStringPointer += 1;
          break;
        case "m":
          parsedDate.setMinutes(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 2))
          );
          dateStringPointer += 1;
          break;
        case "s":
          parsedDate.setSeconds(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 2))
          );
          dateStringPointer += 1;
          break;
        case "S":
          parsedDate.setMilliseconds(
            Number(dateString.slice(dateStringPointer, dateStringPointer + 3))
          );
          dateStringPointer += 2;
          break;
      }
      isToken = true;
    } else {
      isToken = false;
    }
  }

  if (is12Hour) {
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
      throw "2b5s";
    }
    if (isAm) {
      parsedDate.setHours(Number(is12Hour));
    } else {
      parsedDate.setHours(Number(is12Hour) + 12);
    }
  }

  return parsedDate.getTime();
}
