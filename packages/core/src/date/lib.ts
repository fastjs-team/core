interface replacement {
  0: string;
  1: string | number;
}

export function extractIgnoreTokens(formatString: string): [string, string[]] {
  const ignoreTokens: string[] = [];
  let processedString = "";
  let tokenBuffer = "";
  let depth = 0;

  for (const char of formatString) {
    if (char === "<") {
      if (++depth === 1) continue;
    } else if (char === ">") {
      depth--;
      if (depth === 0) {
        ignoreTokens.push(tokenBuffer);
        processedString += `{{*${ignoreTokens.length - 1}}}`;
        tokenBuffer = "";
        continue;
      }
    }

    if (depth > 0) tokenBuffer += char;
    else processedString += char;
  }

  if (depth > 0) processedString += `<${tokenBuffer}`;

  return [processedString, ignoreTokens];
}

export function getReplacement(date: Date = new Date()): replacement[] {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const replacement: Array<replacement> = [
    ["Y", date.getFullYear()],
    ["M", date.getMonth() + 1],
    ["D", date.getDate()],
    ["H", hours12],
    ["hh", hours24],
    ["h", hours24],
    ["mm", date.getMinutes()],
    ["m", date.getMinutes()],
    ["ss", date.getSeconds()],
    ["s", date.getSeconds()],
    ["S", date.getMilliseconds()],
    // A and a should be the last one because it will affect the result of replacement
    ["A", hours24 >= 12 ? "PM" : "AM"],
    ["a", hours24 >= 12 ? "pm" : "am"]
  ];

  return replacement.map((entry) => {
    if (typeof entry[1] !== "number") return entry;
    if (entry[0] === "S") return [entry[0], padZero(entry[1], 3)];
    if (entry[0].length === 1) return [entry[0], padZero(entry[1], 2)];
    return entry;
  });

  function padZero(number: number, width: number): string {
    const str = String(number);
    return str.length >= width ? str : "0".repeat(width - str.length) + str;
  }
}
