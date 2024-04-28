import type { RequestData } from "./def";

export function addQuery(
  url: string,
  query: string | RequestData | null
): string {
  if (!query) return url;
  if (typeof query === "string") {
    query[0] === "?" && (query = query.slice(1));
    const queryObj: RequestData = {};
    query.split("&").forEach((query) => {
      const [key, value] = query.split("=");
      queryObj[key] = value;
    });
    query = queryObj;
  }
  query = new URLSearchParams(query);
  return url + (url.includes("?") ? "&" : "?") + query.toString();
}

export function parse(data: string): string | RequestData {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
