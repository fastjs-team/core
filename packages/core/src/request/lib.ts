import type { RequestData } from "./def";

export function addQuery(
  url: string,
  query: string | RequestData | null
): string {
  if (!query || Object.keys(query).length === 0) return url;
  const urlSearchParams = queryToUrlParams(query);
  url = transformPathParams(url, urlSearchParams);
  if (urlSearchParams.size === 0) return url;
  return url + (url.includes("?") ? "&" : "?") + urlSearchParams.toString();
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

function transformPathParams(url: string, query: URLSearchParams): string {
  const urlComponents = url.split("/");
  const pathReg = /^:/;
  return urlComponents
    .map((component) => {
      const value = component.replace(":", "");
      if (pathReg.test(component) && query.has(value)) {
        const data = query.get(value);
        query.delete(value);
        return data;
      }
      return component;
    })
    .join("/");
}

export function parse(data: string): string | RequestData {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
