import _dev from "../dev";
import FastjsBaseModule from "../base";
import {extractIgnoreTokens, getReplacement} from "./lib";
import {fDate} from "./def";

class FastjsDate extends FastjsBaseModule<FastjsDate> {
    public readonly construct: string = "FastjsDate";
    public _date: number;
    public _createAt: number = Date.now();
    public timezoneDiff: number = new Date().getTimezoneOffset() * 60 * 1000;

    constructor(format: string, date: fDate)
    constructor(format: string, date: number | string, isUTC?: boolean)
    constructor(
        public format: string = "Y-M-D h:m:s",
        date: number | string | fDate = Date.now(),
        public isUTC: boolean = false
    ) {
        super();

        if (typeof date === "object") {
            this._date = date.t;
            this.timezoneDiff = date.z;
            this.isUTC = date.u;
        } else this._date = (typeof date === "string") ? this.parseFormatString(format, date) : date;
    }

    convertUTC(from: "utc" | "local" | "default" = "default", timezoneOffset: number = this.timezoneDiff): FastjsDate {
        if (from === "default") from = this.isUTC ? "utc" : "local";
        this._date = from === "utc" ? this._date + timezoneOffset : this._date - timezoneOffset;
        this.isUTC = from === "utc";
        return this;
    }


    changeDate(date: number | Date): FastjsDate;
    changeDate(date: string, format?: string): FastjsDate;
    changeDate(date: number | Date | string, format: string = this.format): FastjsDate {
        if (typeof date === "string") {
            date = this.parseFormatString(format, date);
        } else if (date instanceof Date) {
            date = date.getTime();
        }

        this._date = date;
        return this;
    }

    setZone(zone: number): FastjsDate {
        this.timezoneDiff = zone * 60 * 1000;
        return this;
    }

    setStatus(isUTC: boolean): FastjsDate {
        this.isUTC = isUTC;
        return this;
    }

    refresh(): FastjsDate {
        this._createAt = Date.now();
        return this;
    }

    toString(newFormat?: string): string {
        const timestamp = this.toNumber();
        const date = new Date(timestamp);

        const [formatString, ignoreTokens] = extractIgnoreTokens(newFormat || this.format);

        let result = formatString;
        for (const replace of getReplacement(date)) {
            const format = replace[0];
            const replacement = replace[1];
            result = result.replace(new RegExp(format, "g"), String(replacement));
        }

        ignoreTokens.forEach((token, index) => {
            result = result.replace(`{{*${index}}}`, `<${token}>`);
        });

        return result;
    }

    toNumber(): number {
        const timeLeft = Date.now() - this._createAt;
        return this._date + timeLeft;
    }

    export(toUTC: boolean): fDate {
        if (__DEV__ && toUTC && this.isUTC) {
            _dev.warn("fastjs/date/FastjsDate", "Exporting UTC date to UTC", [
                "*export(**toUTC: boolean**): fDate",
                "*this.isUTC: true",
                "FastjsDate.export",
                "super:", this
            ], ["fastjs.warn"]);
            throw _dev.error("fastjs/date/FastjsDate", "Exporting UTC date to UTC", [
                "export(toUTC: boolean): fDate",
                "FastjsDate.export",
            ]);
        }
        return {
            t: this.toNumber(),
            z: this.timezoneDiff,
            u: this.isUTC
        }
    }

    toStringLocal(newFormat?: string): string {
        return new FastjsDate(newFormat || this.format, this._date).toString();
    }

    toNumberLocal(): number {
        return this._date;
    }

    private parseFormatString(formatString: string, dateString: string): number {
        let isInIgnoreToken = false;
        let parsedDate = new Date();
        parsedDate.setMilliseconds(0);
        let is12Hour = "";
        let isAm = null;
        let isToken = false;
        let dateStringPointer = -1;
        const allTokens: Array<string> = getReplacement().map(replacement => replacement[0]);

        for (let i = 0; i < formatString.length; i++) {
            dateStringPointer++;
            const char = formatString[i];
            if (char === "<" || char === ">") {
                isInIgnoreToken = char === "<";
                isToken = false;
                continue;
            }
            if (isInIgnoreToken) {
                continue;
            }
            if (allTokens.includes(char)) {
                if (isToken) {
                    if (__DEV__) {
                        _dev.warn("fastjs/date/FastjsDate", "Invalid format string, token cannot be adjacent", [
                            "***formatString: " + formatString,
                            "***dateString: " + dateString,
                            "private parseFormatString(formatString: string, dateString: string): number",
                            "super:", this
                        ], ["fastjs.wrong"]);
                        throw _dev.error("fastjs/date/FastjsDate", "Invalid format string, token cannot be adjacent", [
                            "private parseFormatString(formatString: string, dateString: string): number",
                            "FastjsDate.parseFormatString",
                        ]);
                    }
                    throw "fg3j"
                }
                switch (char) {
                    case "Y":
                        parsedDate.setFullYear(Number(dateString.slice(dateStringPointer, dateStringPointer + 4)));
                        dateStringPointer += 3;
                        break;
                    case "M":
                        parsedDate.setMonth(Number(dateString.slice(dateStringPointer, dateStringPointer + 2)) - 1);
                        dateStringPointer += 1;
                        break;
                    case "D":
                        parsedDate.setDate(Number(dateString.slice(dateStringPointer, dateStringPointer + 2)));
                        dateStringPointer += 1;
                        break;
                    case "H":
                        is12Hour = dateString.slice(dateStringPointer, dateStringPointer + 2)
                        dateStringPointer += 1;
                        break;
                    case "A":
                        isAm = dateString.slice(dateStringPointer, dateStringPointer + 2) === "AM";
                        dateStringPointer += 1;
                        break;
                    case "a":
                        isAm = dateString.slice(dateStringPointer, dateStringPointer + 2) === "am";
                        dateStringPointer += 1;
                        break;
                    case "h":
                        parsedDate.setHours(Number(dateString.slice(dateStringPointer, dateStringPointer + 2)));
                        dateStringPointer += 1;
                        break;
                    case "m":
                        parsedDate.setMinutes(Number(dateString.slice(dateStringPointer, dateStringPointer + 2)));
                        dateStringPointer += 1;
                        break;
                    case "s":
                        parsedDate.setSeconds(Number(dateString.slice(dateStringPointer, dateStringPointer + 2)));
                        dateStringPointer += 1;
                        break;
                    case "S":
                        parsedDate.setMilliseconds(Number(dateString.slice(dateStringPointer, dateStringPointer + 3)));
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
                    _dev.warn("fastjs/date/FastjsDate", "Invalid format string, using 12 hours format but missing AM/PM token", [
                        "***formatString: " + formatString,
                        "***dateString: " + dateString,
                        "private parseFormatString(formatString: string, dateString: string): number",
                        "super:", this
                    ], ["fastjs.wrong"]);
                    throw _dev.error("fastjs/date/FastjsDate", "Invalid format string, using 12 hours format but missing AM/PM token", [
                        "private parseFormatString(formatString: string, dateString: string): number",
                        "FastjsDate.parseFormatString",
                    ]);
                }
                throw "2b5s"
            }
            if (isAm) {
                parsedDate.setHours(Number(is12Hour));
            } else {
                parsedDate.setHours(Number(is12Hour) + 12);
            }
        }

        return parsedDate.getTime();
    }
}

export default FastjsDate;