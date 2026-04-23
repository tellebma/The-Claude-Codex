import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

// Requis par Next 15 pour exporter les routes Metadata en SSG (`output: 'export'`).
export const dynamic = "force-static";

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
