import type { Metadata } from "next";

export const SITE_URL = "https://claude-codex.fr";
export const SITE_NAME = "The Claude Codex";
export const SITE_LOCALE = "fr_FR";
export const DEFAULT_OG_IMAGE = "/og/og-default.png";

/** Maps a locale code to its OpenGraph `og:locale` value. Defaults to fr_FR. */
function localeToOgLocale(locale: string): string {
  if (locale === "en") return "en_US";
  if (locale === "es") return "es_ES";
  return "fr_FR";
}

interface PageMetadataOptions {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly locale?: string;
  readonly ogImage?: string;
  readonly type?: "website" | "article";
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  /**
   * Locales that actually have content for this page, used to build the
   * `alternates.languages` hreflang map. Defaults to `["fr", "en"]` to match
   * existing behavior. Pass `["fr", "en", "es"]` only for pages that have a
   * real ES translation -- listing a locale without content produces a
   * broken hreflang pointing at a 404.
   */
  readonly availableLocales?: ReadonlyArray<string>;
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
  availableLocales = ["fr", "en"],
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = ogImage ?? DEFAULT_OG_IMAGE;
  const ogLocale = localeToOgLocale(locale);

  const pathWithoutLocale = path.replace(/^\/(fr|en|es)/, "");
  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[l] =
      l === locale ? canonicalUrl : `${SITE_URL}/${l}${pathWithoutLocale}`;
  }
  languages["x-default"] = `${SITE_URL}/fr${pathWithoutLocale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
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
