class FastjsDate {
    readonly #date: number;
    readonly #createAt: number;
    private readonly construct: string;

    constructor(public format: string, date: number = Date.now()) {
        this.#date = date;
        this.#createAt = Date.now();
        this.construct = "FastjsDate";
    }

    private padZero(number: number): string {
        return number < 10 ? "0" + number : number.toString();
    }

    private extractIgnoreTokens(formatString: string): [string, string[]] {
        let tokenIndex = 0;
        const ignoreTokens: string[] = [];
        let processedString = formatString;

        while (/<.*?>/.test(processedString)) {
            const match = processedString.match(/<.*?>/);
            if (!match) break;

            ignoreTokens[tokenIndex] = match[0].slice(1, -1);
            processedString = processedString.replace(/<.*?>/, `{{*${tokenIndex}}}`);

            tokenIndex++;
        }

        return [processedString, ignoreTokens];
    }

    toString(newFormat?: string): string {
        const timestamp = this.toNumber();
        const date = new Date(timestamp);

        const [formatString, ignoreTokens] = this.extractIgnoreTokens(
            newFormat || this.format
        );

        const replacements = new Map<string, string | number>([
            ["Y", date.getFullYear()],
            ["M", date.getMonth() + 1],
            ["D", date.getDate()],
            ["H", date.getHours() % 12],
            ["A", date.getHours() >= 12 ? "PM" : "AM"],
            ["a", date.getHours() >= 12 ? "pm" : "am"],
            ["hh", date.getHours()],
            ["h", this.padZero(date.getHours())],
            ["mm", date.getMinutes()],
            ["m", this.padZero(date.getMinutes())],
            ["ss", date.getSeconds()],
            ["s", this.padZero(date.getSeconds())],
            ["S", date.getMilliseconds()],
        ]);

        let result = formatString;
        for (const [format, replacement] of replacements) {
            result = result.replace(new RegExp(format, "g"), String(replacement));
        }

        ignoreTokens.forEach((token, index) => {
            result = result.replace(`{{*${index}}}`, token);
        });

        return result;
    }

    toNumber(): number {
        const timeLeft = Date.now() - this.#createAt;
        return this.#date + timeLeft;
    }

    toStringLocal(newFormat?: string): string {
        return new FastjsDate(newFormat || this.format, this.#date).toString();
    }

    toNumberLocal(): number {
        return this.#date;
    }
}

const string = (format: string, date: number = Date.now()): string => {
    return new FastjsDate(format, date).toString();
}

const timestamp = (format: string, date: number = Date.now()): number => {
    return new FastjsDate(format, date).toNumber();
}

export {
    FastjsDate
};
export default {
    string,
    timestamp
}