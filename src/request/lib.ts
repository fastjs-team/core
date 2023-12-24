import {data} from "./def";

export function addQuery(url: string, query: string | data | null): string {
    if (!query) return url;
    if (typeof query === "string") {
        query[0] === "?" && (query = query.slice(1));
        const queryObj: data = {};
        query.split("&").forEach((query) => {
            const [key, value] = query.split("=");
            queryObj[key] = value;
        });
        query = queryObj;
    }
    query = new URLSearchParams(query);
    return url + (url.includes("?") ? "&" : "?") + query.toString();
}