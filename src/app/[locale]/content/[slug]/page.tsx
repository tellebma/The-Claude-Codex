import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getMdxBySlug, getAllMdxSlugs, getAllMdxFiles } from "@/lib/mdx";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { ArticleSubNav } from "@/components/layout/ArticleSubNav";
import { ArticleHero } from "@/components/layout/ArticleHero";
import { ArticleShell } from "@/components/layout/ArticleShell";
import { ArticlePager } from "@/components/layout/ArticlePager";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { ThemeBadges } from "@/components/ui/ThemeBadges";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { sanitizeSlugForHref } from "@/lib/section-utils";

interface ContentPageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

/**
 * Generate static params for all MDX content files in the target locale.
 * Required for SSG with `output: 'export'`. Reading per-locale directories
 * ensures URLs stay in sync with the locale-specific slugs on disk, which
 * matters when slugs diverge between languages (for example when a French
 * slug has been translated to English).
 */
export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}): Array<{ slug: string }> {
  const slugs = getAllMdxSlugs(params.locale);
  return [...slugs].map((slug) => ({ slug }));
}

/**
 * Generate metadata from MDX frontmatter.
 */
export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { frontmatter } = getMdxBySlug(resolvedParams.slug, resolvedParams.locale);

  return createPageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/${resolvedParams.locale}/content/${resolvedParams.slug}`,
    locale: resolvedParams.locale,
  });
}

/**
 * Resolve previous and next articles for navigation.
 */
function getAdjacentArticles(currentSlug: string, locale: string) {
  const allFiles = getAllMdxFiles(locale);
  const currentIndex = allFiles.findIndex((f) => f.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? allFiles[currentIndex - 1] : null,
    next: currentIndex !== -1 && currentIndex < allFiles.length - 1 ? allFiles[currentIndex + 1] : null,
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  const { frontmatter, content } = getMdxBySlug(
    resolvedParams.slug,
    resolvedParams.locale
  );
  const { prev, next } = getAdjacentArticles(
    resolvedParams.slug,
    resolvedParams.locale
  );
  const tCommon = await getTranslations("common");
  const tBreadcrumb = await getTranslations("breadcrumb");
  const locale: "fr" | "en" = resolvedParams.locale === "en" ? "en" : "fr";
  const articleUrl = `${SITE_URL}/${resolvedParams.locale}/content/${resolvedParams.slug}/`;

  return (
    <>
      {/* RG2-02 — Barre de progression de lecture en haut de page */}
      <ReadingProgressBar />

      <ArticleSubNav
        currentLocale={locale}
        otherLocaleHref={`/content/${resolvedParams.slug}/`}
        ariaLabelBreadcrumb={tBreadcrumb("ariaLabel")}
        crumbs={[
          { label: tCommon("home"), href: "/" },
          {
            label: tBreadcrumb("sections.content"),
            href: "/content/",
          },
          { label: frontmatter.title },
        ]}
      />

      <ArticleHero
        category={frontmatter.badge}
        title={frontmatter.title}
        lead={frontmatter.description}
        datePublished={frontmatter.datePublished}
        dateModified={frontmatter.dateModified}
        publishedLabel={tCommon("published")}
        modifiedLabel={tCommon("updated")}
        themeBadges={
          frontmatter.themes && frontmatter.themes.length > 0 ? (
            <ThemeBadges themes={frontmatter.themes} />
          ) : null
        }
      />

      <ArticleShell
        shareUrl={articleUrl}
        shareTitle={frontmatter.title}
        shareLabel={tCommon("share")}
        copyAriaLabel={tCommon("copyLink")}
        copiedLabel={tCommon("linkCopied")}
      >
        <MdxRenderer source={content} locale={resolvedParams.locale} />
      </ArticleShell>

      {/* RG2-08 — Pager refondu */}
      <ArticlePager
        previousLabel={tCommon("previous")}
        nextLabel={tCommon("next")}
        prev={
          prev
            ? {
                href: `/content/${sanitizeSlugForHref(prev.slug)}/`,
                title: prev.frontmatter.title,
              }
            : null
        }
        next={
          next
            ? {
                href: `/content/${sanitizeSlugForHref(next.slug)}/`,
                title: next.frontmatter.title,
              }
            : null
        }
      />
    </>
  );
}
