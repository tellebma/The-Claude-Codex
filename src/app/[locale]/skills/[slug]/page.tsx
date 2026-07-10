import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getSectionMdxBySlug, getSectionMdxSlugs, getSectionSlugParams } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import { getPageExtraSchemas } from "@/data/page-schemas";
import { createFAQPageSchema } from "@/lib/structured-data";
import { getPageFaqs } from "@/data/page-faqs";
import { TutoArticleContent } from "@/components/layout/TutoArticleContent";

const SECTION = "skills";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}): Array<{ slug: string }> {
  return getSectionSlugParams(SECTION, params.locale);
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

export default async function SkillsSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // TUTO-6 (batch 1) — section skills entierement migree vers le shell article.
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
