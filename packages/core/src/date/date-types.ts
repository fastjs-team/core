import { FastjsModuleBase } from "../base/def";

export interface FastjsDateAtom {
  construct: "FastjsDate";
  format: string;
  _date: number;
  _createAt: number;
  timezoneDiff: number;
}

export interface FastjsDateAPI {
  changeDate(time: number | string): FastjsDate;
  changeFormat(format: string): FastjsDate;
  setZone(zone: number): FastjsDate;
  refresh(): FastjsDate;
  toNumber(utc?: boolean): number;
  toActiveNumber(utc?: boolean): number;
  toString(): string;
  toString(showAs: "utc" | "local" | number): string;
  toString(newFormat: string): string;
  toString(showAs: "utc" | "local" | number, newFormat: string): string;
  toActiveString(): string;
  toActiveString(showAs: "utc" | "local" | number): string;
  toActiveString(newFormat: string): string;
  toActiveString(showAs: "utc" | "local" | number, newFormat: string): string;
}

export type FastjsDate = FastjsDateAtom & FastjsDateAPI & FastjsModuleBase;
