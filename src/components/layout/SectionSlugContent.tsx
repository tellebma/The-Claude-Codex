import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { ArticleDates } from "@/components/ui/ArticleDates";
import { SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { getSectionMdxBySlug } from "@/lib/mdx";
import { getAdjacentPages, extractSimpleSlug } from "@/lib/section-utils";

interface SectionSlugContentProps {
  readonly section: string;
  readonly slug: string;
  readonly locale: string;
  readonly icon: LucideIcon;
  /** Optional additional JSON-LD schemas (e.g. FAQ, HowTo). */
  readonly extraJsonLd?: ReadonlyArray<Record<string, unknown>>;
}

/**
 * Shared server component for all section slug pages.
 * Renders hero, breadcrumb, MDX content, prev/next navigation, and JSON-LD.
 */
export default async function SectionSlugContent({
  section,
  slug,
  locale,
  icon: Icon,
  extraJsonLd,
}: SectionSlugContentProps) {
  const { frontmatter, content } = getSectionMdxBySlug(section, slug, locale);
  const { prev, next } = getAdjacentPages(section, slug, locale);
  const tCommon = await getTranslations("common");
  const tBreadcrumb = await getTranslations("breadcrumb");

  const articleJsonLd = createArticleSchema({
    title: frontmatter.title,
    description: frontmatter.description,
    url: `${SITE_URL}/${locale}/${section}/${slug}`,
    locale,
    datePublished: frontmatter.datePublished,
    dateModified: frontmatter.dateModified,
  });

  const breadcrumbJsonLd = createBreadcrumbSchema([
    { name: tCommon("home"), href: `/${locale}` },
    {
      name: tBreadcrumb(`sections.${section}`),
      href: `/${locale}/${section}`,
    },
    {
      name: frontmatter.title,
      href: `/${locale}/${section}/${slug}`,
    },
  ]);

  /*
   * JSON-LD structured data: safe static schema objects built from
   * our own frontmatter at build time, serialized via JSON.stringify.
   * No user input reaches this path.
   */
  const articleJsonLdHtml = serializeJsonLd(articleJsonLd);
  const breadcrumbJsonLdHtml = serializeJsonLd(breadcrumbJsonLd);

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLdHtml }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdHtml }}
      />
      {extraJsonLd?.map((schema, i) => (
        <script
          key={`extra-jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}

      {/* Hero section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label={tBreadcrumb("ariaLabel")}
            className="mb-6 flex items-center gap-2 text-sm text-slate-400"
          >
            <Link
              href={`/${locale}`}
              className="transition-colors hover:text-white"
            >
              {tCommon("home")}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/${locale}/${section}`}
              className="transition-colors hover:text-white"
            >
              {tBreadcrumb(`sections.${section}`)}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200">{frontmatter.title}</span>
          </nav>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tBreadcrumb(`sections.${section}`)}
            </div>
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
          <MdxRenderer source={content} locale={locale} />
        </div>
      </section>

      {/* Navigation between pages */}
      <section className="border-t border-slate-200/50 py-12 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={`/${locale}/${section}/${extractSimpleSlug(prev.slug)}`}
                className="group flex items-center gap-2 rounded-xl border border-slate-200/50 px-6 py-4 transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft
                  className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-slate-400">
                    {tCommon("previous")}
                  </p>
                  <p className="text-sm font-semibold">
                    {prev.frontmatter.title}
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href={`/${locale}/${section}`}
                className="group flex items-center gap-2 rounded-xl border border-slate-200/50 px-6 py-4 transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft
                  className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-slate-400">{tCommon("back")}</p>
                  <p className="text-sm font-semibold">
                    {tCommon("overview")}
                  </p>
                </div>
              </Link>
            )}
            {next ? (
              <Link
                href={`/${locale}/${section}/${extractSimpleSlug(next.slug)}`}
                className="group flex items-center justify-end gap-2 rounded-xl border border-slate-200/50 px-6 py-4 text-right transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <div>
                  <p className="text-xs text-slate-400">{tCommon("next")}</p>
                  <p className="text-sm font-semibold">
                    {next.frontmatter.title}
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
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
