import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import SectionSlugContent from "@/components/layout/SectionSlugContent";

const SECTION = "use-cases";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return [...getSectionMdxSlugs(SECTION)].map((slug) => ({ slug }));
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

export default async function UseCasesSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={Lightbulb}
    />
  );
}
