import type { MetadataRoute } from "next";
import { SITE_URL, SITE_PAGES } from "@/lib/metadata";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of SITE_PAGES) {
    for (const locale of locales) {
      const localePath = `/${locale}${page.path}`;
      entries.push({
        url: `${SITE_URL}${localePath}`,
        lastModified: page.lastModified
          ? new Date(page.lastModified)
          : new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${page.path}`])
          ),
        },
      });
    }
  }

  return entries;
}
