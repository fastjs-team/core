import FastjsDate from "./fastjsDate";

interface parseReturn {
    timestamp: number;
    format: string;
    dateString: string;
    date: Date;
}

const parse = (format: string, time: string | number): parseReturn => {
    const fastjsDateObject = new FastjsDate(format, time);
    const dateString = fastjsDateObject.toString();
    const timestamp = fastjsDateObject.toNumber();
    return {
        timestamp,
        format,
        dateString,
        date: new Date(timestamp)
    }
}

const parseTime = (format: string, time: string): parseReturn => {
    return parse(format, time);
}

const parseDate = (format: string, date: string): parseReturn => {
    return parse(format, date);
}

const string = (format: string, date: number = Date.now()): string => {
    return parse(format, date).dateString;
}

const date = (format: string, date: string): Date => {
    return parse(format, date).date;
}

const reformat = (format: string, date: string, newFormat: string = "Y-M-D h:m:s"): string => {
    return new FastjsDate(format, date).toString(newFormat);
}

export default {
    parse,
    parseDate,
    parseTime,
    string,
    date,
    reformat
}
export {
    FastjsDate
}