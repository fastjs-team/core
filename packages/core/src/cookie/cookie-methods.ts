import _dev from "../dev";

import type { CookieOptions } from "./def";
import type { FastjsCookie, FastjsCookieAPI } from "./cookie-types";

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function escapeRegExp(input: string): string {
  return input.replace(REGEX_SPECIAL, "\\$&");
}

export function createMethods(cookie: FastjsCookie): FastjsCookieAPI {
  function mergeOptions(options: CookieOptions): CookieOptions {
    const merged: CookieOptions = { ...options };
    if (merged.path === undefined && cookie.path !== undefined)
      merged.path = cookie.path;
    if (merged.domain === undefined && cookie.domain !== undefined)
      merged.domain = cookie.domain;
    return merged;
  }

  function get(name: string): string | null {
    if (!check()) return null;

    const pattern = new RegExp(
      `(?:^|; )${escapeRegExp(encodeURIComponent(name))}=([^;]*)`
    );
    const match = document.cookie.match(pattern);
    if (!match) return null;
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  function set(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): FastjsCookie {
    if (!check()) return cookie;

    const opts = mergeOptions(options);
    let str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (opts.maxAge !== undefined) {
      str += `; Max-Age=${Math.floor(opts.maxAge)}`;
    } else if (opts.expires !== undefined) {
      let date: Date;
      if (typeof opts.expires === "number") {
        date = new Date(Date.now() + opts.expires);
      } else {
        date = opts.expires;
      }
      str += `; expires=${date.toUTCString()}`;
    }

    if (opts.path) str += `; path=${opts.path}`;
    if (opts.domain) str += `; domain=${opts.domain}`;

    const sameSite = opts.sameSite;
    const forceSecure = sameSite === "None";
    if (opts.secure || forceSecure) str += "; secure";
    if (sameSite) str += `; SameSite=${sameSite}`;

    document.cookie = str;

    return cookie;
  }

  function remove(name: string, options: CookieOptions = {}): FastjsCookie {
    if (!check()) return cookie;

    const opts = mergeOptions(options);
    let str = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    if (opts.path) str += `; path=${opts.path}`;
    if (opts.domain) str += `; domain=${opts.domain}`;
    document.cookie = str;

    return cookie;
  }

  return { get, set, remove };
}

function check(): boolean {
  const available = typeof document !== "undefined";
  if (__DEV__ && !available) {
    _dev.warn(
      "fastjs/cookie",
      "document is not defined. Cookie methods will not work.",
      [
        "You are probably running in a server environment.",
        "Make sure to run fastjs cookie methods in a **browser environment**."
      ]
    );
  }
  return available;
}
