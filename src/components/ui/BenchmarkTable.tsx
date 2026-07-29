"use client";

import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  getBenchmark,
  getModel,
  getScoresForBenchmark,
  type ScoreEntry,
  type ScoreUnit,
} from "@/data/llm-benchmarks";

interface BenchmarkTableProps {
  /** Identifiant d'un `BenchmarkDefinition` de `src/data/llm-benchmarks.ts`. */
  readonly benchmarkId: string;
  /** Legende du tableau. A defaut, le nom du benchmark est utilise. */
  readonly caption?: string;
}

/** Cles de licence traduites ; toute autre valeur est un nom affiche tel quel. */
const TRANSLATED_LICENSES = new Set(["proprietary", "unknown"]);

function formatScore(value: number, unit: ScoreUnit, locale: string): string {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
  return unit === "percent" ? `${formatted} %` : formatted;
}

/** Nom d'hote de la source, utilise comme libelle court du lien. */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Badge distinguant un score publie par un editeur de modeles d'un score
 * mesure par un tiers. C'est la valeur ajoutee de la page : les deux n'ont
 * pas le meme statut.
 */
function SourceTypeBadge({
  score,
  vendorLabel,
  independentLabel,
}: Readonly<{
  score: ScoreEntry;
  vendorLabel: string;
  independentLabel: string;
}>) {
  const isVendor = score.sourceType === "vendor-reported";
  return (
    <span
      className={clsx(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em]",
        isVendor
          ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
      )}
    >
      {isVendor ? vendorLabel : independentLabel}
    </span>
  );
}

/**
 * Tableau des scores d'un benchmark, trie par valeur decroissante.
 *
 * Chaque ligne porte le modele, son editeur, sa licence, le score, un badge
 * editeur / independant, le lien vers la source et la date de releve.
 *
 * Accessibilite : `<table>` natif avec `<caption>`, `scope` sur tous les
 * en-tetes, liens externes annonces au lecteur d'ecran. Le conteneur scrolle
 * horizontalement, jamais le body de la page.
 *
 * Usage dans un MDX :
 *   <BenchmarkTable benchmarkId="swe-bench-verified" />
 *   <BenchmarkTable benchmarkId="text-arena" caption="Preference humaine" />
 */
export function BenchmarkTable({ benchmarkId, caption }: Readonly<BenchmarkTableProps>) {
  const t = useTranslations("benchmarks");
  const locale = useLocale();

  const benchmark = getBenchmark(benchmarkId);
  const entries = getScoresForBenchmark(benchmarkId);

  if (!benchmark || entries.length === 0) {
    return (
      <p className="my-6 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-sm text-[color:var(--fg-muted)]">
        {t("empty")}
      </p>
    );
  }

  const vendorLabel = t("sourceType.vendorReported");
  const independentLabel = t("sourceType.independent");

  return (
    <figure className="my-6">
      <div className="overflow-x-auto rounded-xl border border-[color:var(--border-default)]">
        <table className="w-full border-collapse text-sm">
          <caption className="px-4 pb-3 pt-3 text-left text-sm text-[color:var(--fg-muted)]">
            {caption ?? benchmark.label}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="min-w-[180px] border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.model")}
              </th>
              <th
                scope="col"
                className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.vendor")}
              </th>
              <th
                scope="col"
                className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.license")}
              </th>
              <th
                scope="col"
                className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-right font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.score")}
              </th>
              <th
                scope="col"
                className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.sourceType")}
              </th>
              <th
                scope="col"
                className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.source")}
              </th>
              <th
                scope="col"
                className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]"
              >
                {t("columns.measuredAt")}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((score) => {
              const model = getModel(score.modelId);
              const license = model?.license ?? "unknown";
              return (
                <tr
                  key={`${score.modelId}-${score.sourceType}`}
                  className="border-b border-[color:var(--border-default)] last:border-b-0 transition-colors hover:bg-[color:var(--bg-subtle)]"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-medium text-[color:var(--fg-primary)]"
                  >
                    {model?.label ?? score.modelId}
                    {score.note && (
                      <span className="mt-0.5 block font-mono text-xs font-normal text-[color:var(--fg-muted)]">
                        {score.note}
                      </span>
                    )}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-[color:var(--fg-secondary)]">
                    {model?.vendor ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[color:var(--fg-secondary)]">
                    {TRANSLATED_LICENSES.has(license) ? t(`license.${license}`) : license}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-[color:var(--fg-primary)]">
                    {formatScore(score.value, score.unit, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <SourceTypeBadge
                      score={score}
                      vendorLabel={vendorLabel}
                      independentLabel={independentLabel}
                    />
                    <span className="mt-1 block text-xs text-[color:var(--fg-muted)]">
                      {score.publisher}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={score.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded text-[color:var(--brand-700)] underline underline-offset-2 transition-colors hover:text-[color:var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)]"
                    >
                      {hostnameOf(score.sourceUrl)}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">
                        {" "}
                        {t("openSource", { model: model?.label ?? score.modelId })}
                      </span>
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-[color:var(--fg-secondary)]">
                    <time dateTime={score.measuredAt}>{score.measuredAt}</time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-xs text-[color:var(--fg-muted)]">
        {t("maintainer", { maintainer: benchmark.maintainer })}{" "}
        <a
          href={benchmark.leaderboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded underline underline-offset-2 transition-colors hover:text-[color:var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)]"
        >
          {t("leaderboard")}
        </a>
      </figcaption>
    </figure>
  );
}
