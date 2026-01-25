export interface RequestData {
  [key: string]: any;
}

export interface FastjsHeaders extends Headers {
  toArray(): Array<[string, string]>;
  toObject(): Record<string, string>;
}

export type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";
