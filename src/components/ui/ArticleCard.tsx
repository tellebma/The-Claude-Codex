import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { ThemeKey } from "@/lib/themes";
import { ThemeBadges } from "@/components/ui/ThemeBadges";
import clsx from "clsx";

/**
 * CTN-2 — Carte unifiee pour les articles editoriaux du site, utilisee
 * par la vitrine `/content/` redessinee (CTN-3 / CTN-8 / CTN-9 / CTN-5)
 * et reutilisable partout ou un teaser d'article est rendu.
 *
 * Server Component testable isolement. Trois variants pilotes par la prop
 * `size`. L'API est uniforme, le markup interne s'adapte. Aucun hook client.
 *
 * Choix design tranches par l'agent ux-designer le 2026-05-19, cf.
 * `docs/epics/2026-05-content-redesign/design-decisions.md`.
 */

const READING_WORDS_PER_MINUTE = 200;
const DESCRIPTION_LIMIT_GRID = 120;
const DESCRIPTION_LIMIT_HERO = 200;
const DAY_MS = 86_400_000;
const RELATIVE_THRESHOLD_DAYS = 14;

export type ArticleCardSize = "grid" | "hero" | "row";

export interface ArticleCardArticle {
  readonly title: string;
  readonly description: string;
  /** Locale de l'article (ex: "fr", "en"). */
  readonly locale: string;
  /**
   * Slug "section/slug" pour un article de section, ou "slug" nu pour un
   * article racine (`content/{locale}/<slug>.mdx`). Le composant resout
   * automatiquement le href correct.
   */
  readonly slug: string;
  /** Section parente quand applicable (`/content/`, `/skills/`, etc.). */
  readonly section?: string | null;
  /** ISO 8601 (YYYY-MM-DD ou full). Utilise pour la date relative et `<time>`. */
  readonly dateModified: string;
  /** Themes valides selon `src/lib/themes.ts`. */
  readonly themes?: ReadonlyArray<ThemeKey>;
  /** Nombre de mots du contenu (pour la duree de lecture). Optionnel. */
  readonly wordCount?: number;
  /** URL absolue ou chemin public d'une vignette Open Graph. Optionnel. */
  readonly ogImageUrl?: string;
}

export interface ArticleCardProps {
  readonly article: ArticleCardArticle;
  /** Default: `"grid"`. */
  readonly size?: ArticleCardSize;
  /** Pour variant `row` : delta % (positif uniquement, filtre cote serveur). */
  readonly deltaPct?: number;
  /** Locale active de la page rendue (pour les labels i18n). */
  readonly locale: string;
}

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}

function estimateReadingMinutes(wordCount?: number): number | null {
  if (typeof wordCount !== "number" || wordCount <= 0) return null;
  return Math.max(1, Math.round(wordCount / READING_WORDS_PER_MINUTE));
}

function buildArticleHref(slug: string, section?: string | null): string {
  if (section) {
    return `/${section}/${slug}`;
  }
  if (slug.startsWith("/")) return slug;
  return `/content/${slug}`;
}

interface RelativeDateLabel {
  readonly relative: string;
  readonly absolute: string;
  readonly iso: string;
}

function buildRelativeDate(
  isoLike: string,
  locale: string,
  labels: {
    today: string;
    yesterday: string;
    daysAgo: (days: number) => string;
  },
): RelativeDateLabel | null {
  const ts = Date.parse(isoLike);
  if (Number.isNaN(ts)) return null;
  const date = new Date(ts);
  const now = Date.now();
  const diffDays = Math.max(0, Math.floor((now - ts) / DAY_MS));

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const absolute = formatter.format(date);

  let relative: string;
  if (diffDays <= 0) relative = labels.today;
  else if (diffDays === 1) relative = labels.yesterday;
  else if (diffDays < RELATIVE_THRESHOLD_DAYS) relative = labels.daysAgo(diffDays);
  else relative = absolute;

  return {
    relative,
    absolute,
    iso: date.toISOString(),
  };
}

interface CardImageProps {
  readonly src?: string;
  readonly alt: string;
  readonly title: string;
  readonly priority?: boolean;
  readonly aspect?: "16/9" | "1/1";
}

function CardImage({
  src,
  alt,
  title,
  priority = false,
  aspect = "16/9",
}: Readonly<CardImageProps>) {
  const aspectClass = aspect === "1/1" ? "aspect-square" : "aspect-[16/9]";

  if (src) {
    return (
      <div className={clsx("relative w-full overflow-hidden", aspectClass)}>
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // Fallback degrade : premier mot du titre en typo display
  const firstWord = title.split(/\s+/)[0] ?? "·";
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "relative flex w-full items-center justify-center overflow-hidden bg-[image:var(--gradient-card)] text-[color:var(--brand-primary)]",
        aspectClass,
      )}
    >
      <span className="cc-display-2 select-none px-4 text-center uppercase tracking-tight opacity-70">
        {firstWord}
      </span>
    </div>
  );
}

export async function ArticleCard({
  article,
  size = "grid",
  deltaPct,
  locale,
}: Readonly<ArticleCardProps>) {
  const t = await getTranslations({ locale, namespace: "articleCard" });

  const href = buildArticleHref(article.slug, article.section);
  const readingMinutes = estimateReadingMinutes(article.wordCount);

  const dateLabels = buildRelativeDate(article.dateModified, locale, {
    today: t("dateToday"),
    yesterday: t("dateYesterday"),
    daysAgo: (days: number) => t("dateDaysAgo", { days }),
  });

  const ariaLabel = t("readLabel", { title: article.title });

  if (size === "hero") {
    const descriptionTruncated = truncate(
      article.description,
      DESCRIPTION_LIMIT_HERO,
    );
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className="article-card article-card--hero group relative grid h-full overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-lg)] transition-shadow duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-xl)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 lg:grid-cols-[1.6fr_1fr]"
        data-matomo-category="engagement"
        data-matomo-action="article_card_click"
        data-matomo-name={article.slug}
      >
        <CardImage
          src={article.ogImageUrl}
          alt=""
          title={article.title}
          priority
          aspect="16/9"
        />
        <div className="flex flex-col gap-3 p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-primary)]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--brand-primary)]"
            />
            {t("pinnedLabel")}
          </span>
          <h3
            title={article.title}
            className="line-clamp-2 text-2xl font-bold leading-tight text-[color:var(--fg-primary)] sm:text-3xl"
          >
            {article.title}
          </h3>
          <p className="line-clamp-3 text-base leading-relaxed text-[color:var(--fg-secondary)]">
            {descriptionTruncated}
          </p>
          {article.themes && article.themes.length > 0 && (
            <div className="mt-1">
              <ThemeBadges themes={article.themes} />
            </div>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[color:var(--border-subtle)] pt-4 text-xs text-[color:var(--fg-muted)]">
            {dateLabels && (
              <time dateTime={dateLabels.iso} title={dateLabels.absolute}>
                {dateLabels.relative}
              </time>
            )}
            {dateLabels && readingMinutes !== null && (
              <span aria-hidden="true">·</span>
            )}
            {readingMinutes !== null && (
              <span>{t("readingMinutes", { minutes: readingMinutes })}</span>
            )}
          </div>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand-primary)] transition-[gap] duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:gap-2">
            {t("readCta")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    );
  }

  if (size === "row") {
    const descriptionTruncated = truncate(
      article.description,
      DESCRIPTION_LIMIT_GRID,
    );
    const hasDelta = typeof deltaPct === "number" && deltaPct > 0;
    return (
      <>
        {/* Variant >= md : ligne horizontale */}
        <Link
          href={href}
          aria-label={ariaLabel}
          className="article-card article-card--row group relative hidden md:flex md:items-stretch md:gap-5 md:overflow-hidden md:rounded-2xl md:border md:border-[color:var(--border-default)] md:bg-[color:var(--bg-elevated)] md:p-4 md:shadow-[var(--shadow-card)] md:transition-all md:duration-[var(--duration-base)] md:ease-[var(--ease-out)] md:hover:-translate-y-px md:hover:shadow-[var(--shadow-md)] md:focus-visible:outline md:focus-visible:outline-2 md:focus-visible:outline-offset-2 md:focus-visible:outline-brand-700"
          data-matomo-category="engagement"
          data-matomo-action="article_card_click"
          data-matomo-name={article.slug}
        >
          <div className="relative w-32 shrink-0 overflow-hidden rounded-xl sm:w-40">
            <CardImage
              src={article.ogImageUrl}
              alt=""
              title={article.title}
              aspect="1/1"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {article.themes && article.themes.length > 0 && (
              <ThemeBadges themes={article.themes} />
            )}
            <h3
              title={article.title}
              className="line-clamp-2 text-base font-semibold leading-snug text-[color:var(--fg-primary)] sm:text-lg"
            >
              {article.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-[color:var(--fg-secondary)]">
              {descriptionTruncated}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs text-[color:var(--fg-muted)]">
              {dateLabels && (
                <time dateTime={dateLabels.iso} title={dateLabels.absolute}>
                  {dateLabels.relative}
                </time>
              )}
              {readingMinutes !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{t("readingMinutes", { minutes: readingMinutes })}</span>
                </>
              )}
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-warning)]/12 px-2 py-0.5 font-medium text-[color:var(--color-warning)]"
                aria-label={t("trendingLabel")}
              >
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                <span aria-hidden="true">{t("trendingLabel")}</span>
              </span>
              {hasDelta && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-success)]/12 px-2 py-0.5 font-semibold text-[color:var(--color-success)]"
                  aria-label={t("deltaLabel", { delta: deltaPct })}
                >
                  <span aria-hidden="true">+{deltaPct}%</span>
                  <span aria-hidden="true">↗</span>
                </span>
              )}
            </div>
          </div>
        </Link>
        {/* Variant < md : retombe sur grid avec badge overlay */}
        <Link
          href={href}
          aria-label={ariaLabel}
          className="article-card article-card--row-mobile group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:hidden"
          data-matomo-category="engagement"
          data-matomo-action="article_card_click"
          data-matomo-name={article.slug}
        >
          <div className="relative">
            <CardImage src={article.ogImageUrl} alt="" title={article.title} />
            <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[color:var(--bg-page)]/85 px-2 py-1 text-[10px] font-semibold text-[color:var(--color-warning)] backdrop-blur">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              {hasDelta ? (
                <span>+{deltaPct}%</span>
              ) : (
                <span>{t("trendingLabel")}</span>
              )}
            </div>
            <span className="sr-only">
              {hasDelta
                ? t("deltaLabel", { delta: deltaPct })
                : t("trendingLabel")}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            {article.themes && article.themes.length > 0 && (
              <ThemeBadges themes={article.themes} />
            )}
            <h3
              title={article.title}
              className="line-clamp-2 text-base font-semibold leading-snug text-[color:var(--fg-primary)]"
            >
              {article.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-[color:var(--fg-secondary)]">
              {descriptionTruncated}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-[color:var(--fg-muted)]">
              {dateLabels && (
                <time dateTime={dateLabels.iso} title={dateLabels.absolute}>
                  {dateLabels.relative}
                </time>
              )}
              {readingMinutes !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{t("readingMinutes", { minutes: readingMinutes })}</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </>
    );
  }

  // Variant `grid` (default)
  const descriptionTruncated = truncate(
    article.description,
    DESCRIPTION_LIMIT_GRID,
  );
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="article-card article-card--grid group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-px hover:border-brand-500/30 hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      data-matomo-category="engagement"
      data-matomo-action="article_card_click"
      data-matomo-name={article.slug}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-brand-500 to-accent-500"
      />
      <CardImage src={article.ogImageUrl} alt="" title={article.title} />
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        {article.themes && article.themes.length > 0 && (
          <ThemeBadges themes={article.themes} />
        )}
        <h3
          title={article.title}
          className="line-clamp-2 text-lg font-semibold leading-snug text-[color:var(--fg-primary)]"
        >
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[color:var(--fg-secondary)]">
          {descriptionTruncated}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[color:var(--border-subtle)] pt-4 text-xs text-[color:var(--fg-muted)]">
          {dateLabels && (
            <time dateTime={dateLabels.iso} title={dateLabels.absolute}>
              {dateLabels.relative}
            </time>
          )}
          {dateLabels && readingMinutes !== null && (
            <span aria-hidden="true">·</span>
          )}
          {readingMinutes !== null && (
            <span>{t("readingMinutes", { minutes: readingMinutes })}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
