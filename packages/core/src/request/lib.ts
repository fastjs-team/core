import type { RequestData } from "./def";

export function addQuery(
  url: string,
  query: string | RequestData | null
): [string, string[]] {
  if (!query || Object.keys(query).length === 0) return [url, []];
  const urlSearchParams = queryToUrlParams(query);
  let paramMatches: string[] = [];
  [url, paramMatches] = transformPathParams(url, urlSearchParams);
  if (urlSearchParams.size > 0)
    url = url + (url.includes("?") ? "&" : "?") + urlSearchParams.toString();
  return [url, paramMatches];
}

function queryToUrlParams(query: string | RequestData) {
  if (typeof query !== "string") return new URLSearchParams(query);
  if (query[0] === "?") {
    query = query.slice(1);
  }
  const urlSearchParams = new URLSearchParams();
  query.split("&").forEach((query) => {
    const [key, value] = query.split("=");
    urlSearchParams.set(key, value);
  });
  return urlSearchParams;
}

function transformPathParams(
  url: string,
  query: URLSearchParams
): [string, string[]] {
  const urlComponents = url.split("/");
  const pathReg = /^:/;
  const matchs: string[] = [];
  return [
    urlComponents
      .map((component) => {
        const key = component.replace(":", "");
        if (pathReg.test(component) && query.has(key)) {
          matchs.push(key);
          const data = query.get(key);
          query.delete(key);
          return data;
        }
        return component;
      })
      .join("/"),
    matchs
  ];
}

export function parse(data: string): string | RequestData {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
