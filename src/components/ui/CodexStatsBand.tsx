import { getTranslations } from "next-intl/server";
import {
  countAllArticles,
  countAllSections,
  getLastModifiedDate,
} from "@/lib/mdx";

interface CodexStatsBandProps {
  readonly locale: string;
}

const LANGUAGES_COUNT = 2; // FR + EN

/**
 * Bande de statistiques factuelles de la landing (RG-32).
 *
 * Calcule au build :
 * - Nombre d'articles publies (deduplique sur le slug, FR + EN)
 * - Nombre de sections (10 actuellement)
 * - Nombre de langues (2 : FR + EN)
 * - Date de derniere mise a jour (max des dateModified MDX)
 *
 * En cas d'erreur de comptage (0 articles), la section est cachee plutot
 * que d'afficher des "0 articles" qui seraient trompeurs.
 *
 * SSG-compatible : tous les calculs sont faits au build.
 */
export async function CodexStatsBand({
  locale,
}: Readonly<CodexStatsBandProps>) {
  const t = await getTranslations({ locale, namespace: "landing.stats" });

  const articlesCount = countAllArticles();
  const sectionsCount = countAllSections();
  const lastModified = getLastModifiedDate();

  // Fallback gracieux : si pas d'article compte, on cache la section.
  if (articlesCount === 0) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const lastUpdateLabel = lastModified ? formatter.format(lastModified) : "—";

  return (
    <section
      aria-label={t("ariaLabel")}
      // RG2-19 : classe canonique `lp-stats` du source design + halos
      // ::before lateraux deja en place (RG-32). Always-dark (decision
      // design RG-32) pour creer une demarcation visuelle forte avec le
      // hero clair. Le token primitif --color-slate-900 est defini dans
      // @theme et ne bascule pas avec le mode.
      className="lp-stats relative overflow-hidden bg-[color:var(--color-slate-900)] py-12 sm:py-16"
    >
      {/* Halos lateraux cyan/ambre (tokens RG-32) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-stats-glow-1)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-stats-glow-2)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
          Pas de <dl> ici : axe-core (only-dlitems WCAG) impose des enfants
          directs <dt>/<dd> uniquement. Un layout <div> classique avec un
          aria-label sur la section parente couvre la semantique sans
          contraindre la structure HTML.

          RG2-19 : border-left subtile entre les stats items (cf source
          .lp-stat + .lp-stat). Sur lg+ (4 colonnes) : border entre tous
          sauf le premier. Sur mobile (2 cols) : border seulement sur les
          colonnes de droite (chaque 2eme item).
        */}
        <div className="lp-stats-inner grid grid-cols-2 gap-6 text-center sm:gap-8 lg:grid-cols-4 lg:[&>*+*]:border-l lg:[&>*+*]:border-[color:rgba(51,65,85,0.5)]">
          <Stat value={String(articlesCount)} label={t("articles")} />
          <Stat value={String(sectionsCount)} label={t("sections")} />
          <Stat value={String(LANGUAGES_COUNT)} label={t("languages")} />
          <Stat value={lastUpdateLabel} label={t("lastUpdate")} />
        </div>
      </div>
    </section>
  );
}

interface StatProps {
  readonly value: string;
  readonly label: string;
}

function Stat({ value, label }: Readonly<StatProps>) {
  return (
    <div>
      <p
        className="font-extrabold tabular-nums text-[color:var(--color-slate-50)]"
        style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", lineHeight: 1.1 }}
      >
        {value}
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[color:var(--color-slate-400)]">
        {label}
      </p>
    </div>
  );
}
