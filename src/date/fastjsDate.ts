import _dev from "../dev";

interface replacement {
    0: string;
    1: string | number;
}

class FastjsDate {
    public _date: number;
    public _createAt: number;
    public readonly construct: string;

    constructor(public format: string = "Y-M-D h:m:s", date: number | string = Date.now()) {
        if (typeof date === "string") {
            date = this.parseFormatString(format, date);
        }

        this._date = date;
        this._createAt = Date.now();
        this.construct = "FastjsDate";
    }

    private padZero(number: number): string {
        return number < 10 ? "0" + number : number.toString();
    }

    private parseFormatString(formatString: string, dateString: string): number {
        let isInIgnoreToken = false;
        let parsedDate = new Date();
        parsedDate.setMilliseconds(0);
        let is12Hour = "";
        let isAm = null;
        let isToken = false;
        let dateStringPointer = -1;
        const allTokens: Array<string> = this.getReplacement().map(replacement => replacement[0]);

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
                    throw _dev.error("fastjs/date/FastjsDate", "Invalid format string, token cannot be adjacent", [
                        "formatString: " + formatString,
                        "parseFormatString(formatString, dateString)",
                        "FastjsDate"
                    ]);
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
                throw _dev.error("fastjs/date/FastjsDate", "Invalid format string, using 12 hours format but missing AM/PM token", [
                    "formatString: " + formatString,
                    "parseFormatString(formatString, dateString)",
                    "FastjsDate"
                ]);
            }
            if (isAm) {
                parsedDate.setHours(Number(is12Hour));
            } else {
                parsedDate.setHours(Number(is12Hour) + 12);
            }
        }

        return parsedDate.getTime();
    }

    private extractIgnoreTokens(formatString: string): [string, string[]] {
        let processedString = formatString;
        const ignoreTokens: string[] = formatString.match(/<.*?>/g)?.map(match => match.slice(1, -1)) || [];

        ignoreTokens.forEach((_, index) => {
            processedString = processedString.replace(/<.*?>/, `{{*${index}}}`);
        })

        return [processedString, ignoreTokens];
    }


    private getReplacement(date: Date = new Date()): replacement[] {
        const replacement: Array<replacement> = [
            ["Y", date.getFullYear()],
            ["M", date.getMonth() + 1],
            ["D", date.getDate()],
            ["H", date.getHours() % 12],
            ["hh", date.getHours()],
            ["h", date.getHours()],
            ["mm", date.getMinutes()],
            ["m", date.getMinutes()],
            ["ss", date.getSeconds()],
            ["s", date.getSeconds()],
            ["S", date.getMilliseconds()],
            ["A", date.getHours() >= 12 ? "PM" : "AM"],
            ["a", date.getHours() >= 12 ? "pm" : "am"],
        ]

        return replacement.map(replacement =>
            (replacement[0].length === 1 && typeof replacement[1] === "number") ? [replacement[0], this.padZero(replacement[1])] : replacement);
    }

    changeDate(date: number | string): FastjsDate {
        if (typeof date === "string") {
            date = this.parseFormatString(this.format, date);
        }

        this._date = date;
        return this;
    }

    refresh(): FastjsDate {
        this._createAt = Date.now();
        return this;
    }

    toString(newFormat?: string): string {
        const timestamp = this.toNumber();
        const date = new Date(timestamp);

        const [formatString, ignoreTokens] = this.extractIgnoreTokens(
            newFormat || this.format
        );

        let result = formatString;
        for (const replace of this.getReplacement(date)) {
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

    toStringLocal(newFormat?: string): string {
        return new FastjsDate(newFormat || this.format, this._date).toString();
    }

    toNumberLocal(): number {
        return this._date;
    }
}

export default FastjsDate;