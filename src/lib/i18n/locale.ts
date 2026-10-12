/**
 * The public site is published in two languages:
 *   Persian (default, RTL) at  /…
 *   English (LTR)          at  /en/…
 *
 * Switching language is always a full page load (plain <a>), because the
 * root <html lang/dir> is chosen on the server per request.
 */
export type Locale = "fa" | "en";

export const LOCALE_HEADER = "x-avid-locale";

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa";
}

/** Public Persian paths that have an English counterpart. */
const MIRRORED_PREFIXES = ["/transparency", "/projects", "/about", "/faq", "/contact"];

function hasMirror(faPath: string): boolean {
  if (faPath === "/") return true;
  return MIRRORED_PREFIXES.some((p) => faPath === p || faPath.startsWith(p + "/"));
}

/** Persian path → matching English path (falls back to the English home page). */
export function toEnglishPath(faPath: string): string {
  if (!hasMirror(faPath)) return "/en";
  return faPath === "/" ? "/en" : `/en${faPath}`;
}

/** English path → matching Persian path. */
export function toPersianPath(enPath: string): string {
  if (enPath === "/en" || enPath === "/en/") return "/";
  return enPath.startsWith("/en/") ? enPath.slice(3) : "/";
}
