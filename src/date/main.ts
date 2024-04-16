import _dev from "../dev";
import FastjsBaseModule from "../base";
import {extractIgnoreTokens, getReplacement} from "./lib";
import {createDynamicFunction} from "../dynamic";
import {isUndefined} from "../utils";

class FastjsDate extends FastjsBaseModule<FastjsDate> {
  public readonly construct: string = "FastjsDate";
  public format: string = "Y-M-D h:m:s";
  public _date: number = 0;
  public _createAt: number = Date.now();
  public timezoneDiff: number = new Date().getTimezoneOffset() * 60 * 1000;

  constructor();
  constructor(format: string);
  constructor(date: number | string | Date);
  constructor(date: number | string | Date, local: boolean);
  constructor(format: string, date: number | string | Date);
  constructor(date: number | string, format: string);
  constructor(date: number | string, format: string, local: boolean);
  constructor(...args: any[]) {
    super();

    return createDynamicFunction<FastjsDate>([
      {
        name: "date",
        type: ["number", "object"],
        verify: (v: any) => (typeof v === "string" && !!v.match(/\d+/g) && v.match(/[<>]/g) === null),
        default: Date.now()
      },
      {
        name: "format",
        type: "string",
        default: "Y-M-D h:m:s"
      },
      {
        name: "local",
        type: "boolean",
        default: false
      }
    ], (params: { format: string, date: number | string, local: boolean }): FastjsDate => {
      console.log("params.date", params.date);
      
      if (typeof params.date === "string") params.date = this.parseFormatString(params.format, params.date);
      if (params.local) params.date += this.timezoneDiff;
      this.format = params.format;
      this._date = params.date;
      return this;
    })(...args);
  }

  /**
   * @description When you create a FastjsDate object with local timestamp, you can use this method to convert it to UTC timestamp.
   */
  convertUTC(timezone?: number): FastjsDate {
    if (__DEV__) {
      _dev.warn("fastjs/date/FastjsDate", "We suggest you to convert when you create the object. Use constructor(date, local = true) instead.", [
        `*timezone: ${timezone}`,
        "convertUTC(**timezone?: number**): FastjsDate",
        "FastjsDate.convertUTC"
      ], ["fastjs.warn"]);
    }
    this._date += (isUndefined(timezone) ? this.timezoneDiff : timezone * 3600);
    return this;
  }

  changeDate(): FastjsDate;
  changeDate(format: string): FastjsDate;
  changeDate(date: number | string | Date): FastjsDate;
  changeDate(date: number | string | Date, local: boolean): FastjsDate;
  changeDate(format: string, date: number | string): FastjsDate;
  changeDate(date: number | string, format: string): FastjsDate;
  changeDate(date: number | string, format: string, local: boolean): FastjsDate;
  changeDate(...args: any[]): FastjsDate {
    // @ts-ignore
    return new FastjsDate(...args);
  }

  setZone(zone: number): FastjsDate {
    if (__DEV__) {
      if (typeof zone !== "number") {
        throw _dev.error("fastjs/date/FastjsDate", "Invalid zone, **a number is required**.", [
          `*zone: ${zone}`,
          "setZone(**zone: number**): FastjsDate",
          "FastjsDate.setZone"
        ], ["fastjs.wrong"]);
      }
    }
    this.timezoneDiff = zone * 3600 * 1000;
    console.log(this.timezoneDiff)
    return this;
  }

  refresh(): FastjsDate {
    this._createAt = Date.now();
    return this;
  }

  toNumber(utc: boolean = true): number {
    if (__DEV__ && !utc) {
      _dev.warn("fastjs/date/FastjsDate", "We don't recommend using local timestamp, please use UTC timestamp instead.", [
        `*Export as UTC[utc]: ${utc}`,
        "toNumber(**isUTC: boolean = true**): number",
        "FastjsDate.toNumber"
      ], ["fastjs.warn"]);
    }
    return this._date + (utc ? 0 : this.timezoneDiff);
  }

  toActiveNumber(utc: boolean = true): number {
    const timeLeft = Date.now() - this._createAt;
    return this.toNumber(utc) + timeLeft;
  }

  toString(): string
  toString(showAs: "utc" | "local" | number): string
  toString(newFormat: string): string
  toString(showAs: "utc" | "local" | number, newFormat: string): string
  toString(newFormat: string, showAs: "utc" | "local" | number): string
  toString(...args: any[]): string {
    return createDynamicFunction<string>([
      {
        name: "showAs",
        type: "number",
        include: ["utc", "local"]
      },
      {
        name: "newFormat",
        type: "string"
      }
    ], (params: { showAs?: number | string, newFormat?: string }) => {
      const [formatString, ignoreTokens] = extractIgnoreTokens(params.newFormat || this.format);

      let t = this._date;
      if (typeof params.showAs === "number") t -= params.showAs * 3600 * 1000;
      else if (params.showAs === "utc") t += this.timezoneDiff;

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
    })(...args);
  }

  toActiveString(): string
  toActiveString(showAs: "utc" | "local" | number): string
  toActiveString(newFormat: string): string
  toActiveString(showAs: "utc" | "local" | number, newFormat: string): string
  toActiveString(newFormat: string, showAs: "utc" | "local" | number): string
  toActiveString(...args: any[]): string {
    // @ts-ignore
    return new FastjsDate(this.toActiveNumber(), this.format).toString(...args);
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
        dateStringPointer--;
        continue;
      }
      if (isInIgnoreToken) {
        continue;
      }

      if (allTokens.includes(char)) {
        if (isToken) {
          if (__DEV__) {
            throw _dev.error("fastjs/date/FastjsDate", "Invalid format string, token cannot be adjacent, did you using the chars like 'hh', 'mm'?", [
              "***formatString: " + formatString,
              "***dateString: " + dateString,
              "private parseFormatString(formatString: string, dateString: string): number",
              "super: ", this
            ], ["fastjs.wrong"]);
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
          throw _dev.error("fastjs/date/FastjsDate", "Invalid format string, using 12 hours format but missing AM/PM token", [
            "***formatString: " + formatString,
            "***dateString: " + dateString,
            "private parseFormatString(formatString: string, dateString: string): number",
            "super: ", this
          ], ["fastjs.wrong"]);
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