import type { FastjsModuleBase } from "../base/def";
import type { CookieOptions } from "./def";

export interface FastjsCookieAtom {
  construct: "FastjsCookie";
  path?: string;
  domain?: string;
}

export interface FastjsCookieAPI {
  get(name: string): string | null;
  set(name: string, value: string, options?: CookieOptions): FastjsCookieAPI;
  remove(name: string): FastjsCookieAPI;
}

export type FastjsCookie = FastjsCookieAtom &
  FastjsCookieAPI &
  FastjsModuleBase;
