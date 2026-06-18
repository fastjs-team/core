import _dev from "../dev";

/**
 * Generate a random number between `min` and `max` (both inclusive).
 *
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @param decimal - Number of decimal places to keep (>= 0). Defaults to 0.
 */
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
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      _dev.warn(
        "fastjs/utils/rand",
        "min or max is not a finite number, this may cause unexpected results",
        [`*min: ${min}`, `*max: ${max}`]
      );
    }
  }

  if (min > max) [min, max] = [max, min];

  const safeDecimal = Math.max(0, Math.floor(decimal));
  const factor = Math.pow(10, safeDecimal);
  const scaledMin = Math.round(min * factor);
  const scaledMax = Math.round(max * factor);
  const range = scaledMax - scaledMin + 1;
  const num = Math.floor(Math.random() * range) + scaledMin;
  return safeDecimal === 0 ? num : num / factor;
}

export interface RandStringOptions {
  max: number;
  number: boolean;
  letter: boolean;
  upper: boolean;
  lower: boolean;
  custom: string | string[];
}

export function randString(
  length: number,
  options: Partial<RandStringOptions> = {}
) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let choices: string = "";
  if (options.number) choices += "0123456789";
  if (options.letter !== false) {
    if (options.upper) choices += letters.toUpperCase();
    if (options.lower !== false) choices += letters;
  }
  if (Array.isArray(options.custom)) choices += options.custom.join("");
  else if (options?.custom) choices += options.custom;

  if (choices.length === 0) {
    if (__DEV__) {
      _dev.warn(
        "fastjs/utils/randString",
        "no character set selected, returning empty string",
        [`*length: ${length}`, `*options: `, options]
      );
    }
    return "";
  }

  if (options.max) length = rand(length, options.max);
  if (length <= 0) return "";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += choices.charAt(rand(0, choices.length - 1));
  }

  return result;
}

const HEX = "0123456789abcdef";

/**
 * Generate a RFC 4122 version 4 UUID.
 *
 * Uses `crypto.randomUUID()` when available (modern browsers and Node 19+),
 * and falls back to `crypto.getRandomValues` when available, and finally to
 * `Math.random`. The last fallback is **not** cryptographically secure and
 * should only be used as a last resort.
 */
export function uuid(): string {
  const g: { crypto?: Crypto } =
    typeof globalThis !== "undefined" ? (globalThis as any) : ({} as any);

  if (g.crypto && typeof g.crypto.randomUUID === "function") {
    return g.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (g.crypto && typeof g.crypto.getRandomValues === "function") {
    g.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    hex += HEX[(b >> 4) & 0xf] + HEX[b & 0xf];
  }

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
