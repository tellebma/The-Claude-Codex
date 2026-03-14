import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * Extract the locale from a pathname.
 * Pathnames follow the pattern: /fr/... or /en/...
 * Returns the default locale ("fr") if no valid locale is found.
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && (locales as readonly string[]).includes(firstSegment)) {
    return firstSegment as Locale;
  }
  return "fr";
}

/**
 * Remove the locale prefix from a pathname.
 * E.g., "/fr/getting-started" -> "/getting-started"
 *        "/en/mcp/setup" -> "/mcp/setup"
 */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && (locales as readonly string[]).includes(firstSegment)) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

/**
 * Prefix a href with the given locale.
 * E.g., prefixWithLocale("/getting-started", "fr") -> "/fr/getting-started"
 *        prefixWithLocale("/", "en") -> "/en"
 */
export function prefixWithLocale(href: string, locale: string): string {
  if (href === "/") {
    return `/${locale}`;
  }
  return `/${locale}${href}`;
}
