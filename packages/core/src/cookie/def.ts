export type SameSite = "Strict" | "Lax" | "None";

export interface CookieOptions {
  /**
   * Cookie lifetime. A number is treated as milliseconds from now;
   * a Date is used as an absolute expiry. Use `0` (or omit) for a
   * session cookie.
   */
  expires?: number | Date;
  /**
   * Maximum age in seconds (RFC 6265 `Max-Age`). Takes precedence
   * over `expires` when both are set.
   */
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  /**
   * SameSite policy. When set to `"None"`, the cookie is forced
   * to also include the `Secure` attribute as required by browsers.
   */
  sameSite?: SameSite;
}
