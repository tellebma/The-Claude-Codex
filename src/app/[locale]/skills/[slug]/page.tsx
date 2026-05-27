import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Wand2 } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import SectionSlugContent from "@/components/layout/SectionSlugContent";
import { TutoArticleContent } from "@/components/layout/TutoArticleContent";

const SECTION = "skills";

/** TUTO-3 — slugs migres vers le shell article premium (rollout progressif). */
const ARTICLE_SHELL_SLUGS = new Set(["what-are-skills"]);

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

  if (ARTICLE_SHELL_SLUGS.has(slug)) {
    return <TutoArticleContent section={SECTION} slug={slug} locale={locale} />;
  }

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={Wand2}
    />
  );
}
