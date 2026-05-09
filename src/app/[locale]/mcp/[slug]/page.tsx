import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Cable } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import { createFAQPageSchema } from "@/lib/structured-data";
import { getPageFaqs } from "@/data/page-faqs";
import SectionSlugContent from "@/components/layout/SectionSlugContent";

const SECTION = "mcp";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}): Array<{ slug: string }> {
  return [...getSectionMdxSlugs(SECTION, params.locale)].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
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

  const faqs = getPageFaqs(`/${SECTION}/${slug}`, locale);
  const extraJsonLd = faqs ? [createFAQPageSchema(faqs)] : undefined;

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={Cable}
      extraJsonLd={extraJsonLd}
    />
  );
}
