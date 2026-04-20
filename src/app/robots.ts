import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // `/` implicitly covers every path, including /llms.txt and
        // /llms-full.txt. We list them explicitly so the intent is obvious
        // to anyone inspecting robots.txt (including AI crawlers).
        allow: ["/", "/llms.txt", "/llms-full.txt"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
