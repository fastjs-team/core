import _dev from "../dev";

export function rand(min: number, max: number, decimal: number = 0): number {
  if (__DEV__) {
    if (min > max) {
      _dev.warn(
        "fastjs/utils/rand",
        "min is greater than max, this may cause unexpected results",
        [`*min: ${min}`, `*max: ${max}`, `decimal: ${decimal}`]
      );
    }
    if (decimal < 0) {
      _dev.warn(
        "fastjs/utils/rand",
        "decimal is less than 0, this may cause unexpected results",
        [`min: ${min}`, `max: ${max}`, `*decimal: ${decimal}`]
      );
    }
  }

  const prefix = decimal * 10 || 1;
  [min, max] = [min * prefix, max * prefix];
  let num =
    (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) %
      (max - min + 1)) +
    min;
  return num / prefix;
}

export interface RandStringOptions {
  max: number;
  number: boolean;
  letter: boolean;
  upper: boolean;
  lower: boolean;
  custom: string | string[];
}

export function randString(length: number, options: Partial<RandStringOptions> = {}) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let choices: string = "";
  if (options.number) choices += "0123456789";
  if (options.letter) {
    if (options.upper) choices += letters.toUpperCase();
    if (options.lower) choices += letters;
  }
  if (Array.isArray(options.custom)) choices += options.custom.join("");
  else if (options?.custom) choices += options.custom;

  if (options.max) length = rand(length, options.max);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += choices.charAt(rand(0, choices.length - 1));
  }

  return result;
}
