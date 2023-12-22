interface replacement {
    0: string;
    1: string | number;
}

export function extractIgnoreTokens(formatString: string): [string, string[]] {
    let processedString = formatString;
    const ignoreTokens: string[] = formatString.match(/<.*?>/g)?.map(match => match.slice(1, -1)) || [];

    ignoreTokens.forEach((_, index) => {
        processedString = processedString.replace(/<.*?>/, `{{*${index}}}`);
    })

    return [processedString, ignoreTokens];
}


export function getReplacement(date: Date = new Date()): replacement[] {
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
        // A and a should be the last one because it will affect the result of replacement
        ["A", date.getHours() >= 12 ? "PM" : "AM"],
        ["a", date.getHours() >= 12 ? "pm" : "am"],
    ]

    return replacement.map(replacement =>
        (replacement[0].length === 1 && typeof replacement[1] === "number") ? [replacement[0], padZero(replacement[1])] : replacement);

    function padZero(number: number): string {
        return number < 10 ? "0" + number : number.toString();
    }
}
