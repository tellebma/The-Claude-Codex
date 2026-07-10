import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { defaultLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/metadata";
import { createFAQPageSchema } from "@/lib/structured-data";
import { getPageFaqs } from "@/data/page-faqs";
import { getPageExtraSchemas } from "@/data/page-schemas";
import { TutoArticleContent } from "@/components/layout/TutoArticleContent";

const SECTION = "mcp";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

/**
 * `output: 'export'` cannot build a route whose `generateStaticParams`
 * returns `[]` for one parent param combination -- it fails the whole build
 * with a misleading "missing generateStaticParams()" error even though the
 * function is present (see https://github.com/vercel/next.js/issues/71862).
 * This happens today for `locale: "es"` since this section has no ES MDX
 * content yet. Falling back to the default locale's slug list works around
 * it: the page component already calls `notFound()` when the slug isn't
 * actually available for the current locale, so the generated
 * `/es/{section}/<fr-slug>/` routes render a clean static 404 instead of
 * crashing the build.
 */
export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}): Array<{ slug: string }> {
  const localSlugs = getSectionMdxSlugs(SECTION, params.locale);
  const slugs = localSlugs.length > 0 ? localSlugs : getSectionMdxSlugs(SECTION, defaultLocale);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getSectionMdxSlugs(SECTION, locale).includes(slug)) {
    return {};
  }
  const { frontmatter } = getSectionMdxBySlug(SECTION, slug, locale);

  return createPageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/${locale}/${SECTION}/${slug}`,
    locale,
    publishedTime: frontmatter.datePublished,
    modifiedTime: frontmatter.dateModified,
  });
}

export default async function McpSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // TUTO-6 (batch 3) — section mcp entierement migree vers le shell article.
  const faqs = getPageFaqs(`/${SECTION}/${slug}`, locale);
  const extraSchemas = [
    ...(faqs ? [createFAQPageSchema(faqs)] : []),
    ...getPageExtraSchemas(`/${SECTION}/${slug}`, locale),
  ];
  const extraJsonLd = extraSchemas.length > 0 ? extraSchemas : undefined;

  return (
    <TutoArticleContent
      section={SECTION}
      slug={slug}
      locale={locale}
      extraJsonLd={extraJsonLd}
    />
  );
}
