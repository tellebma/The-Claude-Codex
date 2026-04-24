import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { getMdxBySlug, getAllMdxSlugs, getAllMdxFiles } from "@/lib/mdx";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { ArticleDates } from "@/components/ui/ArticleDates";
import { createPageMetadata } from "@/lib/metadata";
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
  const { frontmatter, content } = getMdxBySlug(resolvedParams.slug, resolvedParams.locale);
  const { prev, next } = getAdjacentArticles(resolvedParams.slug, resolvedParams.locale);
  const tCommon = await getTranslations("common");

  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <div className="text-center">
            {frontmatter.badge && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {frontmatter.badge}
              </div>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                {frontmatter.description}
              </p>
            )}
            <div className="mx-auto mt-4 max-w-2xl">
              <ArticleDates
                datePublished={frontmatter.datePublished}
                dateModified={frontmatter.dateModified}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:px-6 lg:px-0">
          <MdxRenderer source={content} locale={resolvedParams.locale} />
        </div>
      </section>

      {/* Navigation between articles */}
      <section className="border-t border-slate-200/50 py-12 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={`/${resolvedParams.locale}/content/${sanitizeSlugForHref(prev.slug)}`}
                className="group flex items-center gap-2 rounded-xl border border-slate-200/50 px-6 py-4 transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-1 dark:text-slate-400" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tCommon("previous")}</p>
                  <p className="text-sm font-semibold">{prev.frontmatter.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/${resolvedParams.locale}/content/${sanitizeSlugForHref(next.slug)}`}
                className="group flex items-center justify-end gap-2 rounded-xl border border-slate-200/50 px-6 py-4 text-right transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tCommon("next")}</p>
                  <p className="text-sm font-semibold">{next.frontmatter.title}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 dark:text-slate-400" aria-hidden="true" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
