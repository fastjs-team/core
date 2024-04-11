import FastjsDate from "./main";
import type {parseReturn} from "./def";
import {createDynamicFunction} from "../dynamic";

/**
 * @description
 * Parse a date string or timestamp into a parseReturn object
 */
const parse = (time: string | number | Date, format: string = "Y-M-D h:m:s"): parseReturn => {
    const fastjsDateObject = new FastjsDate(format, time);
    const dateString = fastjsDateObject.toString();
    const timestamp = fastjsDateObject.toNumber();
    const utc = timestamp + (new Date().getTimezoneOffset() * 60 * 1000);
    return {
        format,
        date: new Date(timestamp),
        string: dateString,
        dateString,
        timestamp,
        utcDate: new Date(utc),
        utcTimestamp: utc,
        utcDateString: new FastjsDate(format, utc).toString(),
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
// const string = (format: string, date: number = Date.now()): string => parse(date, format).string;
function string(): string;
function string(format: string): string;
function string(date: number | string | Date): string;
function string(format: string, date: number | string | Date): string;
function string(...args: any[]): string {
    return createDynamicFunction<string>([
        {
            name: "format",
            type: "string",
            default: "Y-M-D h:m:s"
        },
        {
            name: "date",
            type: ["number", "string", "object"],
            verify: (v: any) => (typeof v === "string" && !!v.match(/\d+/g) && v.match(/[<>]/g) === null),
            default: Date.now()
        }
    ], (params: { format: string, date: number | string }): string => {
        return parse(params.date, params.format).string;
    })(...args);
}
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

function create(): FastjsDate;
function create(format: string): FastjsDate;
function create(date: number | string | Date): FastjsDate;
function create(format: string, date: number | string | Date): FastjsDate;
function create(...args: any[]): FastjsDate {
    // @ts-ignore
    return new FastjsDate(...args);
}

export default {
    parse,
    parseDate,
    parseTime,
    string,
    reformat,
    now,
    create
}
export {
    FastjsDate
}