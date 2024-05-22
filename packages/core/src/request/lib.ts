import type { RequestData } from "./def";

export function addQuery(
  url: string,
  query: string | RequestData | null
): string {
  if (!query || Object.keys(query).length === 0) return url;
  const urlSearchParams = queryToUrlParams(query);
  if (urlSearchParams.size > 0)
    url = url + (url.includes("?") ? "&" : "?") + urlSearchParams.toString();
  return url;
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

export function transformPathParams(
  url: string,
  query: Record<string, any>
): [string, string[]] {
  const urlComponents = url.split("/");
  const pathReg = /^:/;
  const matchs: string[] = [];
  return [
    urlComponents
      .map((component) => {
        const key = component.replace(":", "");
        if (pathReg.test(component) && query[key]) {
          matchs.push(key);
          const data = query[key];
          delete query[key];
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
