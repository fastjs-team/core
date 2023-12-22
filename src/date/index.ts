import FastjsDate from "./main";
import type {fDate, parseReturn} from "./def";

/**
 * @description
 * Parse a date string or timestamp into a parseReturn object
 */
const parse = (time: string | number, format: string = "Y-M-D h:m:s"): parseReturn => {
    const fastjsDateObject = new FastjsDate(format, time);
    const dateString = fastjsDateObject.toString();
    const timestamp = fastjsDateObject.toNumber();
    const utc = timestamp - (new Date().getTimezoneOffset() * 60 * 1000);
    return {
        format,
        date: new Date(timestamp),
        string: dateString,
        dateString,
        timestamp,
        utcDate: new Date(utc),
        utcTimestamp: utc,
        utcDateString: new FastjsDate(format, timestamp - (new Date().getTimezoneOffset() * 60 * 1000)).toString(),
    }
}

/**
 * @description
 * Get a parseReturn object of timestamp or now
 */
const parseTime = (time: number, format?: string): parseReturn => parse(time, format);
/**
 * @description
 * Get a parseReturn object of string or now
 */
const parseDate = (date: string, format?: string): parseReturn => parse(date, format);
/**
 * @description
 * Get a string of timestamp or now
 * - For string input, use parse(t, f?) or parseDate(t, f?) instead
 * - For string to string(reformat), use reformat(t, f, nf?) instead
 * - For other output, use parse(t, f?) instead
 */
const string = (format: string, date: number = Date.now()): string => parse(date, format).string;
/**
 * @description
 * Get a Date object of string or now.
 * - For number input, use Date(t) instead
 * - For other output, use parse(t, f?) instead
 */
const date = (format: string, date: string): Date => parse(date, format).date;
/**
 * @description
 * Reformat a date string into another format
 * - For other output, use parse(rf(), f?) instead
 */
const reformat = (format: string, date: string, newFormat: string = "Y-M-D h:m:s"): string => new FastjsDate(format, date).toString(newFormat);
/**
 * @description
 * Get a parseReturn object of now
 */
const now = (format?: string): parseReturn => parse(Date.now(), format);

function create(format: string, date: fDate): FastjsDate;
function create(format: string, date: number | string, isUTC?: boolean): FastjsDate;
function create(
    format: string,
    date: number | string | fDate = Date.now(),
    isUTC?: boolean
): FastjsDate {
    return (typeof date === "object") ? new FastjsDate(format, date) : new FastjsDate(format, date, isUTC);
}

export default {
    parse,
    parseDate,
    parseTime,
    string,
    date,
    reformat,
    now,
    create
}
export {
    FastjsDate
}