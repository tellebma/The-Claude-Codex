import type { MetadataRoute } from "next";
import { SITE_URL, SITE_PAGES } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: page.lastModified
      ? new Date(page.lastModified)
      : new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
