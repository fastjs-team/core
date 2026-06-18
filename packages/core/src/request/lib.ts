import type { RequestData } from "./base-types";

export function addQuery(
  url: string,
  query: string | RequestData | null
): string {
  if (!query) return url;
  if (typeof query !== "string" && Object.keys(query).length === 0) return url;
  const urlSearchParams = queryToUrlParams(query);
  if (urlSearchParams.size === 0) return url;

  // Preserve any URL fragment - the query must come before the `#`.
  const hashIndex = url.indexOf("#");
  const head = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const sep = head.includes("?") ? "&" : "?";
  return head + sep + urlSearchParams.toString() + hash;
}

function queryToUrlParams(query: string | RequestData): URLSearchParams {
  if (typeof query !== "string") {
    const params = new URLSearchParams();
    for (const key of Object.keys(query)) {
      const value = query[key];
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item === undefined || item === null) continue;
          params.append(key, String(item));
        }
      } else {
        params.append(key, String(value));
      }
    }
    return params;
  }

  return new URLSearchParams(query[0] === "?" ? query.slice(1) : query);
}

export function transformPathParams(
  url: string,
  query: Record<string, any>
): [string, string[]] {
  const matches: string[] = [];
  const replaced = url.replace(/:([A-Za-z_][\w]*)/g, (raw, key: string) => {
    if (!(key in query) || query[key] === undefined || query[key] === null) {
      return raw;
    }
    matches.push(key);
    return encodeURIComponent(String(query[key]));
  });
  return [replaced, matches];
}

export function parse(data: string): string | RequestData {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}
