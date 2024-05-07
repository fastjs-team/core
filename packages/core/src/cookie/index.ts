import { createFastjsCookie } from "./cookie";
import type { FastjsCookie, FastjsCookieAPI } from "./cookie-types";
import type { CookieOptions } from "./def";

export const get = (name: string): string | null => {
  return createFastjsCookie().get(name);
};

export const exists = (name: string): boolean => {
  return get(name) !== null;
}

export const set = (
  name: string,
  value: string,
  options: CookieOptions = {}
): FastjsCookieAPI => {
  return createFastjsCookie().set(name, value, options);
};

export const remove = (name: string): FastjsCookie => {
  return createFastjsCookie().remove(name);
};

export default {
  get,
  exists,
  set,
  remove,
  create: createFastjsCookie
};
export * from "./cookie";
export * from "./cookie-types";
export * from "./def";
