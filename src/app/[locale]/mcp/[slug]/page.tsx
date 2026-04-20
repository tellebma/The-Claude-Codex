import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Cable } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import SectionSlugContent from "@/components/layout/SectionSlugContent";

const SECTION = "mcp";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Array<{ slug: string }>> {
  const { locale } = await params;
  return [...getSectionMdxSlugs(SECTION, locale)].map((slug) => ({ slug }));
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

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={Cable}
    />
  );
}
