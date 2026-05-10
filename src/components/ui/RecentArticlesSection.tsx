import { getTranslations } from "next-intl/server";
import { getMostRecentArticles } from "@/lib/mdx";
import { RecentArticlesClient } from "./RecentArticlesClient";

interface RecentArticlesSectionProps {
  readonly locale: string;
}

/**
 * Section "Articles recents" de la landing.
 *
 * RG-32 : 1 hero + 2 small layout, charge les 3 derniers articles MDX
 * dedoublonnes par section/slug, tri par dateModified decroissant.
 *
 * RG2-13 : ajout des filtres par section + restyling des cards.
 * Server component qui charge 8 articles (vs 3 avant) pour permettre
 * le filtrage cote client. La grille reste "1 hero + 2 small" mais
 * recompute apres filtre.
 *
 * Si moins de 1 article : affiche rien (graceful fallback).
 *
 * SSG-compatible : tous les calculs sont faits au build via lib/mdx.
 */
const ARTICLES_LIMIT = 8;

export async function RecentArticlesSection({
  locale,
}: Readonly<RecentArticlesSectionProps>) {
  const t = await getTranslations({ locale, namespace: "landing.recent" });
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: "breadcrumb.sections",
  });
  const articles = getMostRecentArticles(ARTICLES_LIMIT, locale);

  if (articles.length === 0) {
    return null;
  }

  // Construit un map section -> label humain a partir des sections du
  // breadcrumb (sections.mcp -> "MCP", sections.skills -> "Skills", etc.).
  // Permet d'afficher des labels propres dans les pills filtres.
  const sectionLabels: Record<string, string> = {};
  const uniqueSections = new Set(
    articles.map((a) => a.section).filter((s): s is string => Boolean(s))
  );
  for (const section of uniqueSections) {
    try {
      sectionLabels[section] = tBreadcrumb(section);
    } catch {
      sectionLabels[section] = section;
    }
  }

  return (
    <RecentArticlesClient
      articles={articles}
      title={t("title")}
      subtitle={t("subtitle")}
      ariaLabel={t("ariaLabel")}
      readArticleLabel={t("readArticle")}
      allFilterLabel={t("filterAll")}
      sectionLabels={sectionLabels}
    />
  );
}
