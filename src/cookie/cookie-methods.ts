import _dev from "../dev";

import type { CookieOptions } from "./def";
import type { FastjsCookie, FastjsCookieAPI } from "./cookie-types";

export function createMethods(cookie: FastjsCookie): FastjsCookieAPI {
  function get(name: string): string | null {
    if (!check()) return null;

    const cookie = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return cookie ? cookie[2] : null;
  }

  function set(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): FastjsCookie {
    if (!check()) return cookie;

    let str = `${name}=${value}`;

    if (options.expires) {
      let date = new Date();
      if (typeof options.expires === "number")
        date.setTime(date.getTime() + options.expires);
      else date = options.expires;

      str += `; expires=${date.toUTCString()}`;
    }

    if (options.path) str += `; path=${options.path}`;
    if (options.domain) str += `; domain=${options.domain}`;
    if (options.secure) str += "; secure";

    document.cookie = str;

    return cookie;
  }

  function remove(name: string): FastjsCookie {
    if (!check()) return cookie;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    return cookie;
  }

  return { get, set, remove };
}

function check(): boolean {
  if (__DEV__) {
    _dev.warn(
      "fastjs/cookie",
      "document is not defined. Cookie methods will not work.",
      [
        "You are probably running in a server environment.",
        "Make running fastjs cookie methods in a **browser environment**.",
        "*document: ",
        document
      ]
    );
  }
  return typeof document !== "undefined";
}
