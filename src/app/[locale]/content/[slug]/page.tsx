import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getMdxBySlug, getAllMdxSlugs, getAllMdxFiles } from "@/lib/mdx";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { ArticleSubNav } from "@/components/layout/ArticleSubNav";
import { ArticleHero } from "@/components/layout/ArticleHero";
import { ArticleShell } from "@/components/layout/ArticleShell";
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
  const locale = resolvedParams.locale as "fr" | "en";
  const otherLocale = locale === "fr" ? "en" : "fr";

  const articleUrl = `${SITE_URL}/${resolvedParams.locale}/content/${resolvedParams.slug}/`;

  return (
    <>
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

      {/* Pager prev / next */}
      <section className="mx-auto max-w-7xl border-t border-[color:var(--border-default)] px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={`/content/${sanitizeSlugForHref(prev.slug)}/`}
              className="group flex items-center gap-2 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-6 py-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[var(--shadow-md)]"
            >
              <ArrowLeft
                className="h-4 w-4 text-[color:var(--fg-muted)] transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
                  {tCommon("previous")}
                </p>
                <p className="text-sm font-semibold text-[color:var(--fg-primary)]">
                  {prev.frontmatter.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/content/${sanitizeSlugForHref(next.slug)}/`}
              className="group flex items-center justify-end gap-2 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-6 py-4 text-right transition-all hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[var(--shadow-md)]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
                  {tCommon("next")}
                </p>
                <p className="text-sm font-semibold text-[color:var(--fg-primary)]">
                  {next.frontmatter.title}
                </p>
              </div>
              <ArrowRight
                className="h-4 w-4 text-[color:var(--fg-muted)] transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </>
  );
}
