import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import {
  countAllArticles,
  getAllMdxFiles,
  getMostRecentArticles,
  type RecentArticle,
} from "@/lib/mdx";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContentHeroActions } from "@/components/ui/ContentHeroActions";

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
    introParagraph1:
      "Les articles editoriaux du Claude Codex sont des guides autonomes. Chacun traite un sujet precis : securite, couts reels, bonnes pratiques, mythes a deconstruire. Vous pouvez les lire dans l'ordre que vous voulez.",
    introParagraph2:
      "Chaque article se lit en 5 a 15 minutes. Si vous debutez, commencez par le guide Demarrer, puis revenez ici pour approfondir.",
    sectionBadge: "Articles",
    sectionTitle: "Guides disponibles",
    sectionDescription:
      "Cliquez sur un article pour le lire. Les contenus sont classes par ordre de progression.",
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
    introParagraph1:
      "Editorial articles from The Claude Codex are self-contained guides. Each covers a specific topic: security, real costs, best practices, myths to bust. Read them in any order.",
    introParagraph2:
      "Each article takes 5 to 15 minutes. If you're starting out, begin with the Getting Started guide and come back here to dive deeper.",
    sectionBadge: "Articles",
    sectionTitle: "Available guides",
    sectionDescription:
      "Click an article to read it. Content is sorted by progression order.",
  },
};

type LocaleKey = keyof typeof translations;

function asLocaleKey(locale: string): LocaleKey {
  return locale === "en" ? "en" : "fr";
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

export default async function ContentIndexPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[asLocaleKey(locale)];
  const allFiles = getAllMdxFiles(locale);
  const totalArticles = countAllArticles();

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
      {/* Hero CTN-4 */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top left, var(--gradient-hero-radial-1), transparent 60%), radial-gradient(ellipse at bottom right, var(--gradient-hero-radial-2), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="cc-eyebrow inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="relative inline-flex h-2 w-2"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand-primary)] opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--brand-primary)]" />
              </span>
              {totalArticles}&nbsp;{t.eyebrowGuides}
            </p>
            <h1
              className="cc-h1 mt-4"
              style={{ textWrap: "balance" }}
            >
              {t.heroTitle}{" "}
              <span className="text-gradient">{t.heroTitleHighlight}</span>
            </h1>
            <p
              className="cc-lead mx-auto mt-6 max-w-[60ch]"
              style={{ textWrap: "pretty" }}
            >
              {t.heroSubtitle}
            </p>
            <ContentHeroActions
              primaryLabel={t.ctaFilter}
              secondaryLabel={t.ctaLatest}
            />
          </div>
        </div>
      </section>

      {/* Introduction (provisoire, remplacee par CTN-3 Pinned + Latest) */}
      <section id="pinned-latest" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-0">
          <div className="space-y-6 cc-body">
            <p>{t.introParagraph1}</p>
            <p>{t.introParagraph2}</p>
          </div>
        </div>
      </section>

      {/* Articles list */}
      <section
        id="all-articles"
        className="bg-[color:var(--bg-subtle)] py-16 sm:py-20"
        aria-label={t.sectionTitle}
      >
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.sectionBadge}
            title={t.sectionTitle}
            description={t.sectionDescription}
          />

          <div className="mt-12 space-y-4">
            {allFiles.map((file) => (
              <Link
                key={file.slug}
                href={`/content/${file.slug}`}
                className="group flex items-center justify-between rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] p-6 transition-all hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
              >
                <div>
                  {file.frontmatter.badge && (
                    <span className="mb-2 inline-block rounded-full bg-brand-500/10 px-3 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-400">
                      {file.frontmatter.badge}
                    </span>
                  )}
                  <h2 className="text-lg font-semibold text-[color:var(--fg-primary)]">
                    {file.frontmatter.title}
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--fg-secondary)]">
                    {file.frontmatter.description}
                  </p>
                </div>
                <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-[color:var(--fg-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--brand-primary)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
