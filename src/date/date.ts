import { createModule } from "../base";
import { createMethods, parseFormatString } from "./date-methods";

import type { FastjsDateAtom, FastjsDate } from "./date-types";

export function createFastjsDate(
  format: string = "Y-M-D h:m:s",
  date: number | string | Date = Date.now(),
  local: boolean = false
): FastjsDate {
  if (typeof date === "string") date = parseFormatString(format, date);
  else if (date instanceof Date) date = date.getTime();

  const moduleAtom = createModule<FastjsDateAtom>(() => ({
    construct: "FastjsDate",
    format,
    _date: date,
    _createAt: Date.now(),
    timezoneDiff: new Date().getTimezoneOffset() * 60 * 1000
  }));
  if (local) moduleAtom._date += moduleAtom.timezoneDiff;

  const module: FastjsDate = Object.assign(
    moduleAtom,
    createMethods(moduleAtom as FastjsDate)
  );

  return module;
}
