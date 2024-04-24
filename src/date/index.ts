import { createFastjsDate } from "./date";

import type { parseReturn } from "./def";

/**
 * @description
 * Parse a date string or timestamp into a parseReturn object
 */
export const parse = (
  time: string | number | Date,
  format: string = "Y-M-D h:m:s"
): parseReturn => {
  const fastjsDateObject = createFastjsDate(format, time);
  const dateString = fastjsDateObject.toString();
  const timestamp = fastjsDateObject.toNumber();
  const utc = timestamp + new Date().getTimezoneOffset() * 60 * 1000;
  return {
    format,
    date: new Date(timestamp),
    string: dateString,
    dateString,
    timestamp,
    utcDate: new Date(utc),
    utcTimestamp: utc,
    utcDateString: createFastjsDate(format, utc).toString()
  };
};

/**
 * @description
 * Get a parseReturn object of timestamp or now
 */
export const parseTime = (time: number, format?: string): parseReturn =>
  parse(time, format);
/**
 * @description
 * Get a parseReturn object of string or now
 */
export const parseDate = (date: string, format?: string): parseReturn =>
  parse(date, format);
/**
 * @description
 * Get a string of timestamp or now
 * - For string input, use parse(t, f?) or parseDate(t, f?) instead
 * - For string to string(reformat), use reformat(t, f, nf?) instead
 * - For other output, use parse(t, f?) instead
 */
// const string = (format: string, date: number = Date.now()): string => parse(date, format).string;
export const string = (format?: string, date: number = Date.now()): string =>
  parse(date, format).string;
/**
 * @description
 * Reformat a date string into another format
 * - For other output, use parse(rf(), f?) instead
 */
export const reformat = (
  format: string,
  date: string,
  newFormat: string = "Y-M-D h:m:s"
): string => createFastjsDate(format, date).toString(newFormat);
/**
 * @description
 * Get a parseReturn object of now
 */
export const now = (format?: string): parseReturn => parse(Date.now(), format);
/**
 * @description
 * Create a FastjsDate instance
 */
export const create = createFastjsDate;

export type * from "./def";
export type * from "./date-types";
