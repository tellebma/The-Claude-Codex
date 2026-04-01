import type { Metadata } from "next";

export const SITE_URL = "https://claude-codex.fr";
export const SITE_NAME = "The Claude Codex";
export const SITE_LOCALE = "fr_FR";
export const DEFAULT_OG_IMAGE = "/og/og-default.png";

interface PageMetadataOptions {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly locale?: string;
  readonly ogImage?: string;
  readonly type?: "website" | "article";
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
}

/**
 * Generates complete metadata for a page including OpenGraph, Twitter,
 * canonical URL, hreflang alternates, and all required meta tags.
 */
export function createPageMetadata({
  title,
  description,
  path,
  locale = "fr",
  ogImage,
  type = "article",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = ogImage ?? DEFAULT_OG_IMAGE;
  const ogLocale = locale === "en" ? "en_US" : "fr_FR";

  // Build alternate path by swapping locale prefix
  const altLocale = locale === "en" ? "fr" : "en";
  const pathWithoutLocale = path.replace(/^\/(fr|en)/, "");
  const altUrl = `${SITE_URL}/${altLocale}${pathWithoutLocale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: locale === "fr" ? canonicalUrl : altUrl,
        en: locale === "en" ? canonicalUrl : altUrl,
        "x-default": `${SITE_URL}/fr${pathWithoutLocale}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type,
      locale: ogLocale,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_NAME}`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

// Re-export for backward compatibility
export type { PageInfo } from "@/data/site-pages";
export { SITE_PAGES } from "@/data/site-pages";
