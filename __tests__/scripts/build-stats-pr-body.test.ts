/**
 * Tests unitaires du generateur de body PR hebdomadaire (CTN-7).
 */
import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  buildPrBody,
  DELTA_HIGHLIGHT_THRESHOLD,
  formatDeltaPct,
  loadStatsFile,
  renderHighlightedSection,
  renderRecapTable,
  selectHighlighted,
  sortForRecap,
} from "../../scripts/build-stats-pr-body";
import type {
  ArticleStatsEntry,
  ArticleStatsFile,
} from "@/data/article-stats";

const baseEntry: ArticleStatsEntry = {
  slug: "alpha",
  locale: "fr",
  pageviewsLast30d: 400,
  pageviewsLast7d: 100,
  pageviewsPrev7d: 80,
  deltaPct: 25,
  scrollDepth75Pct: 0.42,
};

describe("formatDeltaPct", () => {
  it("prefixes positives with +", () => {
    expect(formatDeltaPct(33.3)).toBe("+33.3 %");
  });

  it("keeps the negative sign", () => {
    expect(formatDeltaPct(-12.4)).toBe("-12.4 %");
  });

  it("renders 0 with no sign", () => {
    expect(formatDeltaPct(0)).toBe("0.0 %");
  });
});

describe("selectHighlighted", () => {
  it("keeps only entries with delta >= 50 sorted descending", () => {
    const result = selectHighlighted([
      { ...baseEntry, slug: "low", deltaPct: 10 },
      { ...baseEntry, slug: "mid", deltaPct: 60 },
      { ...baseEntry, slug: "high", deltaPct: 120 },
      { ...baseEntry, slug: "exact", deltaPct: 50 },
    ]);
    expect(result.map((e) => e.slug)).toEqual(["high", "mid", "exact"]);
  });

  it("returns empty when no article hits the threshold", () => {
    expect(selectHighlighted([baseEntry])).toEqual([]);
  });

  it("supports a custom threshold", () => {
    const result = selectHighlighted([baseEntry], 20);
    expect(result).toHaveLength(1);
  });
});

describe("sortForRecap", () => {
  it("sorts by pageviewsLast30d descending", () => {
    const result = sortForRecap([
      { ...baseEntry, slug: "small", pageviewsLast30d: 50 },
      { ...baseEntry, slug: "big", pageviewsLast30d: 5000 },
      { ...baseEntry, slug: "mid", pageviewsLast30d: 500 },
    ]);
    expect(result.map((e) => e.slug)).toEqual(["big", "mid", "small"]);
  });

  it("does not mutate the input array", () => {
    const input = [baseEntry];
    const copy = [...input];
    sortForRecap(input);
    expect(input).toEqual(copy);
  });
});

describe("renderHighlightedSection", () => {
  it("renders bullets for each highlighted article", () => {
    const out = renderHighlightedSection([
      { ...baseEntry, slug: "viral-fr", deltaPct: 120, pageviewsLast7d: 220, pageviewsPrev7d: 100 },
      { ...baseEntry, slug: "viral-en", locale: "en", deltaPct: 80 },
    ]);
    expect(out).toContain("- [`/fr/content/viral-fr/`]");
    expect(out).toContain("https://claude-codex.fr/fr/content/viral-fr/");
    expect(out).toContain("+120.0 %");
    expect(out).toContain("220 vs 100 pageviews");
    expect(out).toContain("/en/content/viral-en/");
  });

  it("renders a fallback message when empty", () => {
    expect(renderHighlightedSection([])).toMatch(/Aucun article/);
  });
});

describe("renderRecapTable", () => {
  it("renders a markdown table with header and rows", () => {
    const out = renderRecapTable([baseEntry]);
    expect(out).toContain("| Locale | Slug |");
    expect(out).toContain("| fr | `alpha` |");
    expect(out).toContain("42.0 %");
    expect(out).toContain("+25.0 %");
  });

  it("returns a fallback when articles is empty", () => {
    expect(renderRecapTable([])).toMatch(/Pas de donnees Matomo/);
  });
});

describe("buildPrBody", () => {
  it("includes generatedAt, source, and both sections", () => {
    const file: ArticleStatsFile = {
      generatedAt: "2026-05-21T08:00:00Z",
      matomoPeriodDays: 30,
      source: "matomo",
      articles: [
        { ...baseEntry, slug: "viral", deltaPct: 120 },
        { ...baseEntry, slug: "calm", deltaPct: 5 },
      ],
    };
    const body = buildPrBody(file);
    expect(body).toContain("2026-05-21T08:00:00Z");
    expect(body).toContain("Source : `matomo`");
    expect(body).toContain("2 articles suivis");
    expect(body).toContain(`### Articles avec delta > ${DELTA_HIGHLIGHT_THRESHOLD} %`);
    expect(body).toContain("### Recapitulatif");
    expect(body).toContain("/fr/content/viral/");
    expect(body).toContain("CTN-7");
  });

  it("renders pluralization correctly for 1 article", () => {
    const file: ArticleStatsFile = {
      generatedAt: "2026-05-21T08:00:00Z",
      matomoPeriodDays: 30,
      source: "override",
      articles: [baseEntry],
    };
    const body = buildPrBody(file);
    expect(body).toContain("1 article suivi");
    expect(body).not.toContain("1 articles suivis");
    expect(body).toContain("Source : `override`");
  });
});

describe("loadStatsFile", () => {
  let tmpDir: string;

  afterEach(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loads and validates a well-formed file", () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-pr-"));
    const file: ArticleStatsFile = {
      generatedAt: "2026-05-21T08:00:00Z",
      matomoPeriodDays: 30,
      source: "matomo",
      articles: [baseEntry],
    };
    const target = path.join(tmpDir, "stats.json");
    fs.writeFileSync(target, JSON.stringify(file));
    const loaded = loadStatsFile(target);
    expect(loaded.articles).toHaveLength(1);
  });

  it("throws on missing file", () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-pr-"));
    expect(() => loadStatsFile(path.join(tmpDir, "missing.json"))).toThrow(
      /not found/,
    );
  });

  it("throws on invalid JSON", () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-pr-"));
    const target = path.join(tmpDir, "bad.json");
    fs.writeFileSync(target, "{not-json");
    expect(() => loadStatsFile(target)).toThrow(/valid JSON/);
  });

  it("throws on schema mismatch", () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-pr-"));
    const target = path.join(tmpDir, "wrong.json");
    fs.writeFileSync(target, JSON.stringify({ foo: "bar" }));
    expect(() => loadStatsFile(target)).toThrow(/ArticleStatsFile schema/);
  });
});
