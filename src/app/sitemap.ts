import type { MetadataRoute } from "next";
import { SITE_URL, SITE_PAGES } from "@/lib/metadata";
import { locales } from "@/i18n/config";

/** Ensures a URL path ends with / to match trailingSlash: true. */
function withSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of SITE_PAGES) {
    for (const locale of locales) {
      const pageUrl = withSlash(`${SITE_URL}/${locale}${page.path}`);
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
                withSlash(`${SITE_URL}/${l}${page.path}`),
              ])
            ),
            "x-default": withSlash(`${SITE_URL}/fr${page.path}`),
          },
        },
      });
    }
  }

  return entries;
}
