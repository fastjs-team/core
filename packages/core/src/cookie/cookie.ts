import { createModule } from "../base";
import { createMethods } from "./cookie-methods";
import { FastjsCookie, FastjsCookieAtom } from "./cookie-types";

export function createFastjsCookie(
  path?: string,
  domain?: string
): FastjsCookie {
  const moduleAtom = createModule<FastjsCookieAtom>(() => ({
    construct: "FastjsCookie",
    path,
    domain
  }));

  const module: FastjsCookie = Object.assign(
    moduleAtom,
    createMethods(moduleAtom as FastjsCookie)
  );

  return module;
}
