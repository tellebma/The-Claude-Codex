import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHero } from "@/components/layout/SectionHero";
import {
  countAllArticles,
  getAllMdxFiles,
  getMostRecentArticles,
  type RecentArticle,
} from "@/lib/mdx";
import {
  computeContentSections,
  type TrendingItem,
} from "@/lib/content-sections";
import { loadArticleStats } from "@/lib/load-article-stats";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createItemListSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import type { ThemeKey } from "@/lib/themes";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContentHeroActions } from "@/components/ui/ContentHeroActions";
import { ArticleCard, type ArticleCardArticle } from "@/components/ui/ArticleCard";
import {
  ArticleThemeFilter,
  type ArticleThemeFilterLabels,
} from "@/components/ui/ArticleThemeFilter";
import { PINNED_ARTICLE_SLUG } from "@/data/pinned-article";

const HAS_PART_LIMIT = 16;

const translations = {
  fr: {
    metaTitle: "Contenus editoriaux",
    metaDescription:
      "Tous les articles et guides editoriaux du Claude Codex. Securite, architecture, DevSecOps, prompting : 16 guides independants pour maitriser Claude Code en profondeur.",
    collectionName: "Contenus editoriaux",
    collectionDescription:
      "Tous les articles et guides editoriaux du Claude Codex sur Claude Code, les MCP, les Skills et le prompting.",
    breadcrumbHome: "Accueil",
    breadcrumbContent: "Contenus editoriaux",
    eyebrowGuides: "guides independants",
    heroTitle: "Contenus editoriaux",
    heroTitleHighlight: "pour comprendre Claude Code.",
    heroSubtitle:
      "Securite, architecture, DevSecOps, prompting. 16 guides longue forme, classes et filtrables, ecrits par des experts.",
    ctaFilter: "Filtrer par theme",
    ctaLatest: "Voir les derniers",
    pinnedLatestTitleWithPinned: "A la une et derniers articles",
    pinnedLatestTitleWithoutPinned: "Derniers articles",
    pinnedLatestSeeAll: "Voir tous les articles",
    trendingTitle: "Tendances cette semaine",
    trendingItemListName: "Tendances cette semaine",
    trendingItemListDescription:
      "Articles editoriaux dont la frequentation a le plus augmente sur les 7 derniers jours.",
    trendingLabel: "Tendance",
    trendingSource: "Stats Matomo, mises a jour le",
    mostReadTitle: "Les plus lus ces 30 derniers jours",
    mostReadItemListName: "Articles les plus lus ces 30 derniers jours",
    mostReadItemListDescription:
      "Top 6 des articles editoriaux par nombre de vues sur les 30 derniers jours.",
    mostReadSource: "Stats Matomo, mises a jour le",
    sectionBadge: "Articles",
    sectionTitle: "Tous les articles",
    sectionDescription:
      "Filtrez par theme pour trouver le guide qui vous interesse.",
    filterAriaLabel: "Filtrer par theme",
    filterTypeGroup: "Type",
    filterDomainGroup: "Domaine",
    filterCountSingular: "article",
    filterCountPlural: "articles",
    filterReset: "Reinitialiser les filtres",
    filterEmptyTitle: "Aucun article ne correspond a ces filtres.",
    filterEmptyCta: "Reinitialiser les filtres",
    themeNames: {
      tutorial: "Tutoriel",
      guide: "Guide",
      reference: "Reference",
      comparison: "Comparatif",
      "use-case": "Cas d'usage",
      security: "Securite",
      devsecops: "DevSecOps",
      architecture: "Architecture",
      performance: "Performance",
      tooling: "Outils",
      productivity: "Productivite",
      migration: "Migration",
    } as Readonly<Record<ThemeKey, string>>,
  },
  en: {
    metaTitle: "Editorial content",
    metaDescription:
      "All editorial articles and guides from The Claude Codex. Security, architecture, DevSecOps, prompting: in-depth guides to master Claude Code.",
    collectionName: "Editorial content",
    collectionDescription:
      "All editorial articles and guides from The Claude Codex on Claude Code, MCPs, Skills, and prompting.",
    breadcrumbHome: "Home",
    breadcrumbContent: "Editorial content",
    eyebrowGuides: "independent guides",
    heroTitle: "Editorial content",
    heroTitleHighlight: "to understand Claude Code.",
    heroSubtitle:
      "Security, architecture, DevSecOps, prompting. Long-form guides written by experts, sortable and filterable.",
    ctaFilter: "Filter by theme",
    ctaLatest: "See the latest",
    pinnedLatestTitleWithPinned: "Featured and latest articles",
    pinnedLatestTitleWithoutPinned: "Latest articles",
    pinnedLatestSeeAll: "See all articles",
    trendingTitle: "Trending this week",
    trendingItemListName: "Trending this week",
    trendingItemListDescription:
      "Editorial articles with the largest pageview growth over the last 7 days.",
    trendingLabel: "Trending",
    trendingSource: "Matomo stats, refreshed on",
    mostReadTitle: "Most read in the last 30 days",
    mostReadItemListName: "Most read articles in the last 30 days",
    mostReadItemListDescription:
      "Top 6 editorial articles by pageviews over the last 30 days.",
    mostReadSource: "Matomo stats, refreshed on",
    sectionBadge: "Articles",
    sectionTitle: "All articles",
    sectionDescription:
      "Filter by theme to find the guide that matches your interest.",
    filterAriaLabel: "Filter by theme",
    filterTypeGroup: "Type",
    filterDomainGroup: "Domain",
    filterCountSingular: "article",
    filterCountPlural: "articles",
    filterReset: "Reset filters",
    filterEmptyTitle: "No article matches these filters.",
    filterEmptyCta: "Reset filters",
    themeNames: {
      tutorial: "Tutorial",
      guide: "Guide",
      reference: "Reference",
      comparison: "Comparison",
      "use-case": "Use case",
      security: "Security",
      devsecops: "DevSecOps",
      architecture: "Architecture",
      performance: "Performance",
      tooling: "Tooling",
      productivity: "Productivity",
      migration: "Migration",
    } as Readonly<Record<ThemeKey, string>>,
  },
};

type LocaleKey = keyof typeof translations;

function asLocaleKey(locale: string): LocaleKey {
  return locale === "en" ? "en" : "fr";
}

interface DataSectionShellProps {
  readonly id: string;
  readonly dataSection: string;
  readonly title: string;
  readonly sourceDate: string | null;
  readonly sourceLabel: string;
  readonly backgroundClass: string;
  readonly children: ReactNode;
}

function DataSectionShell({
  id,
  dataSection,
  title,
  sourceDate,
  sourceLabel,
  backgroundClass,
  children,
}: DataSectionShellProps) {
  return (
    <section
      id={id}
      data-section={dataSection}
      aria-labelledby={`${id}-title`}
      className={`${backgroundClass} py-16 sm:py-20 lg:py-24`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2
            id={`${id}-title`}
            className="cc-h2 text-[color:var(--fg-primary)]"
            style={{ textWrap: "balance" }}
          >
            {title}
          </h2>
          {sourceDate ? (
            <p className="text-xs text-[color:var(--fg-muted)]">
              {sourceLabel} {sourceDate}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

interface TrendingSectionProps {
  readonly trending: ReadonlyArray<TrendingItem>;
  readonly statsGeneratedDate: string | null;
  readonly title: string;
  readonly sourceLabel: string;
  readonly locale: string;
}

function TrendingSection({
  trending,
  statsGeneratedDate,
  title,
  sourceLabel,
  locale,
}: TrendingSectionProps) {
  if (trending.length === 0) return null;
  return (
    <DataSectionShell
      id="trending"
      dataSection="trending"
      title={title}
      sourceDate={statsGeneratedDate}
      sourceLabel={sourceLabel}
      backgroundClass="bg-[color:var(--bg-subtle)]"
    >
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-1">
        {trending.map((item) => (
          <ArticleCard
            key={item.article.slug}
            article={item.article}
            size="row"
            locale={locale}
            deltaPct={item.deltaPct}
          />
        ))}
      </div>
    </DataSectionShell>
  );
}

interface MostReadSectionProps {
  readonly mostRead: ReadonlyArray<ArticleCardArticle>;
  readonly statsGeneratedDate: string | null;
  readonly title: string;
  readonly sourceLabel: string;
  readonly locale: string;
}

function MostReadSection({
  mostRead,
  statsGeneratedDate,
  title,
  sourceLabel,
  locale,
}: MostReadSectionProps) {
  if (mostRead.length === 0) return null;
  return (
    <DataSectionShell
      id="most-read"
      dataSection="most-read"
      title={title}
      sourceDate={statsGeneratedDate}
      sourceLabel={sourceLabel}
      backgroundClass=""
    >
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
        {mostRead.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            size="grid"
            locale={locale}
          />
        ))}
      </div>
    </DataSectionShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = translations[asLocaleKey(locale)];
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/content`,
    locale,
  });
}

function buildHasPart(
  articles: ReadonlyArray<RecentArticle>,
  locale: string
): ReadonlyArray<{
  readonly name: string;
  readonly url: string;
  readonly dateModified?: string;
}> {
  return articles.slice(0, HAS_PART_LIMIT).map((article) => {
    const localePath = `/${locale}`;
    const sectionPath = article.section ? `/${article.section}` : "/content";
    const url = `${localePath}${sectionPath}/${article.slug}`;
    return {
      name: article.title,
      url,
      dateModified: article.dateModified || undefined,
    };
  });
}

function pickCollectionDateModified(
  articles: ReadonlyArray<RecentArticle>
): string | undefined {
  for (const article of articles) {
    if (article.dateModified) return article.dateModified;
  }
  return undefined;
}

function buildCollectionJsonLd(locale: string) {
  const t = translations[asLocaleKey(locale)];
  const recent = getMostRecentArticles(HAS_PART_LIMIT, locale);
  return createCollectionPageSchema({
    name: t.collectionName,
    description: t.collectionDescription,
    url: `${SITE_URL}/${locale}/content`,
    locale,
    dateModified: pickCollectionDateModified(recent),
    hasPart: buildHasPart(recent, locale),
  });
}

function buildBreadcrumbJsonLd(locale: string) {
  const t = translations[asLocaleKey(locale)];
  return createBreadcrumbSchema([
    { name: t.breadcrumbHome, href: `/${locale}/` },
    { name: t.breadcrumbContent, href: `/${locale}/content/` },
  ]);
}

function buildFilterLabels(
  t: (typeof translations)[LocaleKey],
): ArticleThemeFilterLabels {
  return {
    ariaLabel: t.filterAriaLabel,
    typeGroup: t.filterTypeGroup,
    domainGroup: t.filterDomainGroup,
    themeNames: t.themeNames,
    countSingular: t.filterCountSingular,
    countPlural: t.filterCountPlural,
    reset: t.filterReset,
    emptyTitle: t.filterEmptyTitle,
    emptyCta: t.filterEmptyCta,
  };
}

export default async function ContentIndexPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const localeKey = asLocaleKey(locale);
  const t = translations[localeKey];
  const allFiles = getAllMdxFiles(locale);
  const totalArticles = countAllArticles();
  const articleStats = loadArticleStats();
  const { pinned, trending, mostRead, latest, all } = computeContentSections({
    files: allFiles,
    locale: localeKey,
    pinnedSlug: PINNED_ARTICLE_SLUG,
    stats: articleStats,
    latestLimit: 6,
  });
  const hasPinned = pinned !== null;
  const latestTopRow = hasPinned ? latest.slice(0, 2) : [];
  const latestBottomRow = hasPinned ? latest.slice(2, 5) : latest.slice(0, 6);
  const pinnedLatestTitle = hasPinned
    ? t.pinnedLatestTitleWithPinned
    : t.pinnedLatestTitleWithoutPinned;
  const cardsBySlug: Record<string, ReactNode> = Object.fromEntries(
    all.map((article) => [
      article.slug,
      <ArticleCard
        key={article.slug}
        article={article}
        size="grid"
        locale={locale}
      />,
    ]),
  );

  const statsGeneratedDate = articleStats
    ? articleStats.generatedAt.slice(0, 10)
    : null;
  const trendingItemList =
    trending.length > 0
      ? createItemListSchema({
          name: t.trendingItemListName,
          description: t.trendingItemListDescription,
          locale,
          items: trending.map((item, index) => ({
            position: index + 1,
            url: `/${locale}/content/${item.article.slug}/`,
            name: item.article.title,
          })),
        })
      : null;
  const mostReadItemList =
    mostRead.length > 0
      ? createItemListSchema({
          name: t.mostReadItemListName,
          description: t.mostReadItemListDescription,
          locale,
          items: mostRead.map((article, index) => ({
            position: index + 1,
            url: `/${locale}/content/${article.slug}/`,
            name: article.title,
          })),
        })
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildCollectionJsonLd(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildBreadcrumbJsonLd(locale)),
        }}
      />
      {trendingItemList ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(trendingItemList),
          }}
        />
      ) : null}
      {mostReadItemList ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(mostReadItemList),
          }}
        />
      ) : null}
      {/* Hero CTN-4 / POL-3 : SectionHero editorial */}
      <SectionHero
        category={`${totalArticles} ${t.eyebrowGuides}`}
        categoryIcon={BookOpen}
        title={t.heroTitle}
        titleHighlight={t.heroTitleHighlight}
        highlightInline
        lead={t.heroSubtitle}
        tone="dark"
        actions={
          <ContentHeroActions
            primaryLabel={t.ctaFilter}
            secondaryLabel={t.ctaLatest}
          />
        }
      />

      {/* Pinned + Latest combines (CTN-3) */}
      <section
        id="pinned-latest"
        aria-labelledby="pinned-latest-title"
        className="py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="pinned-latest-title"
              className="cc-h2 text-[color:var(--fg-primary)]"
              style={{ textWrap: "balance" }}
            >
              {pinnedLatestTitle}
            </h2>
            <Link
              href="/content/#all-articles"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand-primary)] transition-[gap] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              {t.pinnedLatestSeeAll}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {hasPinned ? (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
              <ArticleCard article={pinned} size="hero" locale={locale} />
              <div className="grid grid-cols-1 gap-6">
                {latestTopRow.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    size="grid"
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${hasPinned ? "mt-6 lg:mt-8" : "mt-8 lg:mt-10"}`}
          >
            {latestBottomRow.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                size="grid"
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tendances 7 jours (CTN-9) */}
      <TrendingSection
        trending={trending}
        statsGeneratedDate={statsGeneratedDate}
        title={t.trendingTitle}
        sourceLabel={t.trendingSource}
        locale={locale}
      />

      {/* Les plus lus 30 jours (CTN-8) */}
      <MostReadSection
        mostRead={mostRead}
        statsGeneratedDate={statsGeneratedDate}
        title={t.mostReadTitle}
        sourceLabel={t.mostReadSource}
        locale={locale}
      />

      {/* Articles filtrables par theme (CTN-5) */}
      <section
        id="all-articles"
        className="bg-[color:var(--bg-subtle)] py-16 sm:py-20 lg:py-24"
        aria-label={t.sectionTitle}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={t.sectionBadge}
            title={t.sectionTitle}
            description={t.sectionDescription}
          />

          <div className="mt-10 sm:mt-12">
            <ArticleThemeFilter
              articles={all}
              cardsBySlug={cardsBySlug}
              labels={buildFilterLabels(t)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
