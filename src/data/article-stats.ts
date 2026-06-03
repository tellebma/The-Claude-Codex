/**
 * Snapshot Matomo des statistiques par article (CTN-6).
 *
 * Le fichier `article-stats.json` est genere par `scripts/refresh-article-stats.ts`
 * (workflow hebdo CTN-7). Schema strict, tous les champs `readonly`, aucun `null` :
 * une donnee manquante doit etre representee par `0` (compteur) ou la valeur
 * absente d'un article (slug non present dans `articles`).
 *
 * Une override PO ponctuelle peut etre placee dans `article-stats.override.json`
 * avec `source: "override"` ; la page la prefere si elle existe (cf. CTN-8/9).
 */

export type ArticleLocale = "fr" | "en";

export type ArticleStatsSource = "matomo" | "override";

export interface ArticleStatsEntry {
  readonly slug: string;
  readonly locale: ArticleLocale;
  readonly pageviewsLast30d: number;
  readonly pageviewsLast7d: number;
  readonly pageviewsPrev7d: number;
  /** Pourcentage de variation last7 vs prev7, arrondi a 1 decimale. */
  readonly deltaPct: number;
  /** Ratio 0..1 d'utilisateurs ayant atteint 75 % de profondeur de scroll. */
  readonly scrollDepth75Pct: number;
}

export interface ArticleStatsFile {
  /** Date de generation ISO 8601 UTC. */
  readonly generatedAt: string;
  /** Periode de reference du snapshot, en jours (fixe a 30). */
  readonly matomoPeriodDays: 30;
  readonly source: ArticleStatsSource;
  readonly articles: ReadonlyArray<ArticleStatsEntry>;
}

export function isArticleLocale(value: unknown): value is ArticleLocale {
  return value === "fr" || value === "en";
}

export function isArticleStatsEntry(value: unknown): value is ArticleStatsEntry {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["slug"] === "string" &&
    v["slug"].length > 0 &&
    isArticleLocale(v["locale"]) &&
    typeof v["pageviewsLast30d"] === "number" &&
    typeof v["pageviewsLast7d"] === "number" &&
    typeof v["pageviewsPrev7d"] === "number" &&
    typeof v["deltaPct"] === "number" &&
    typeof v["scrollDepth75Pct"] === "number"
  );
}

export function isArticleStatsFile(value: unknown): value is ArticleStatsFile {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v["generatedAt"] !== "string") return false;
  if (v["matomoPeriodDays"] !== 30) return false;
  if (v["source"] !== "matomo" && v["source"] !== "override") return false;
  if (!Array.isArray(v["articles"])) return false;
  return v["articles"].every(isArticleStatsEntry);
}
