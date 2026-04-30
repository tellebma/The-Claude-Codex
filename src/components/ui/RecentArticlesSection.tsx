import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getMostRecentArticles, type RecentArticle } from "@/lib/mdx";

interface RecentArticlesSectionProps {
  readonly locale: string;
}

const ARTICLES_LIMIT = 3;

/**
 * Section "Articles recents" de la landing (RG-32).
 *
 * Affiche les 3 derniers articles MDX par dateModified decroissant, toutes
 * sections confondues. Layout "1 hero + 2 small" sur lg+ :
 * - 1 article large a gauche (1.6fr)
 * - 2 articles small empiles a droite (1fr)
 * Sur mobile : stack vertical.
 *
 * Si moins de 3 articles disponibles, affiche uniquement ceux qui existent
 * ou cache la section (graceful fallback).
 *
 * SSG-compatible : tous les calculs sont faits au build via lib/mdx.
 */
export async function RecentArticlesSection({
  locale,
}: Readonly<RecentArticlesSectionProps>) {
  const t = await getTranslations({ locale, namespace: "landing.recent" });
  const articles = getMostRecentArticles(ARTICLES_LIMIT, locale);

  if (articles.length === 0) {
    return null;
  }

  const [hero, ...small] = articles;

  return (
    <section
      aria-label={t("ariaLabel")}
      className="bg-[color:var(--bg-page)] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <h2 className="text-h2 font-bold tracking-tight text-[color:var(--fg-primary)]">
            {t("title")}
          </h2>
          <p className="mt-3 text-lead text-[color:var(--fg-secondary)]">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          <ArticleHeroCard article={hero} ctaLabel={t("readArticle")} />

          {small.length > 0 && (
            <div className="grid gap-6">
              {small.map((article) => (
                <ArticleSmallCard
                  key={`${article.section ?? "_"}/${article.slug}`}
                  article={article}
                  ctaLabel={t("readArticle")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function articleHref(article: RecentArticle): string {
  return article.section
    ? `/${article.section}/${article.slug}`
    : `/content/${article.slug}`;
}

interface ArticleCardProps {
  readonly article: RecentArticle;
  readonly ctaLabel: string;
}

// Classes communes aux 2 variantes (hero + small) — factorisees pour eviter
// la duplication signalee par SonarQube et garder le pattern d'interactivite
// (focus ring, hover lift, shadow tokens) coherent.
const CARD_BASE_CLASSES =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]";

function ArticleHeroCard({ article, ctaLabel }: Readonly<ArticleCardProps>) {
  return (
    <Link
      href={articleHref(article)}
      aria-label={`${ctaLabel} : ${article.title}`}
      className={`${CARD_BASE_CLASSES} p-8 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]`}
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "var(--duration-base)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500"
      />
      {article.section && (
        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-primary)]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500"
          />
          {article.section}
        </span>
      )}
      <h3
        className="text-2xl font-bold leading-tight text-[color:var(--fg-primary)] sm:text-3xl"
        style={{ fontSize: "clamp(1.75rem, 2.5vw, 2rem)" }}
      >
        {article.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-base text-[color:var(--fg-secondary)]">
        {article.description}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-[color:var(--brand-primary)] transition-all group-hover:gap-2">
        {ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

function ArticleSmallCard({ article, ctaLabel }: Readonly<ArticleCardProps>) {
  return (
    <Link
      href={articleHref(article)}
      aria-label={`${ctaLabel} : ${article.title}`}
      className={`${CARD_BASE_CLASSES} p-6 hover:-translate-y-px hover:shadow-[var(--shadow-md)]`}
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "var(--duration-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-500 to-accent-500"
      />
      {article.section && (
        <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
          {article.section}
        </span>
      )}
      <h3 className="text-lg font-semibold leading-snug text-[color:var(--fg-primary)]">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-[color:var(--fg-secondary)]">
        {article.description}
      </p>
    </Link>
  );
}
