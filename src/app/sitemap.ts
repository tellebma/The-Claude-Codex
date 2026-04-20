import type { MetadataRoute } from "next";
import { SITE_URL, SITE_PAGES } from "@/lib/metadata";
import type { PageInfo } from "@/data/site-pages";
import { locales, defaultLocale } from "@/i18n/config";

/** Ensures a URL path ends with / to match trailingSlash: true. */
function withSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Resolves the locale-specific path for a page, falling back to the
 * canonical `path` when no override is provided.
 */
function resolvePath(page: PageInfo, locale: string): string {
  return page.pathsByLocale?.[locale] ?? page.path;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of SITE_PAGES) {
    for (const locale of locales) {
      const pageUrl = withSlash(
        `${SITE_URL}/${locale}${resolvePath(page, locale)}`
      );
      entries.push({
        url: pageUrl,
        lastModified: page.lastModified
          ? new Date(page.lastModified)
          : new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [
                l,
                withSlash(`${SITE_URL}/${l}${resolvePath(page, l)}`),
              ])
            ),
            "x-default": withSlash(
              `${SITE_URL}/${defaultLocale}${resolvePath(page, defaultLocale)}`
            ),
          },
        },
      });
    }
  }

  return entries;
}
