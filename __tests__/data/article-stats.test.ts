/**
 * Tests des type guards du schema ArticleStatsFile (CTN-6).
 */
import { describe, expect, it } from "vitest";
import {
  isArticleLocale,
  isArticleStatsEntry,
  isArticleStatsFile,
} from "@/data/article-stats";

describe("isArticleLocale", () => {
  it("accepts 'fr' and 'en'", () => {
    expect(isArticleLocale("fr")).toBe(true);
    expect(isArticleLocale("en")).toBe(true);
  });

  it("rejects any other value", () => {
    expect(isArticleLocale("es")).toBe(false);
    expect(isArticleLocale("")).toBe(false);
    expect(isArticleLocale(undefined)).toBe(false);
    expect(isArticleLocale(null)).toBe(false);
    expect(isArticleLocale(42)).toBe(false);
  });
});

describe("isArticleStatsEntry", () => {
  const valid = {
    slug: "foo",
    locale: "fr" as const,
    pageviewsLast30d: 10,
    pageviewsLast7d: 4,
    pageviewsPrev7d: 2,
    deltaPct: 100,
    scrollDepth75Pct: 0.5,
  };

  it("accepts a fully valid entry", () => {
    expect(isArticleStatsEntry(valid)).toBe(true);
  });

  it("rejects when slug is empty", () => {
    expect(isArticleStatsEntry({ ...valid, slug: "" })).toBe(false);
  });

  it("rejects when locale is invalid", () => {
    expect(isArticleStatsEntry({ ...valid, locale: "es" })).toBe(false);
  });

  it("rejects when any numeric field is missing or wrong type", () => {
    expect(isArticleStatsEntry({ ...valid, pageviewsLast30d: "10" })).toBe(false);
    expect(isArticleStatsEntry({ ...valid, deltaPct: null })).toBe(false);
    const { scrollDepth75Pct: _drop, ...withoutScroll } = valid;
    expect(isArticleStatsEntry(withoutScroll)).toBe(false);
  });

  it("rejects non-object inputs", () => {
    expect(isArticleStatsEntry(null)).toBe(false);
    expect(isArticleStatsEntry("foo")).toBe(false);
    expect(isArticleStatsEntry(123)).toBe(false);
  });
});

describe("isArticleStatsFile", () => {
  const validEntry = {
    slug: "foo",
    locale: "fr" as const,
    pageviewsLast30d: 10,
    pageviewsLast7d: 4,
    pageviewsPrev7d: 2,
    deltaPct: 100,
    scrollDepth75Pct: 0.5,
  };

  const validFile = {
    generatedAt: "2026-05-21T00:00:00Z",
    matomoPeriodDays: 30,
    source: "matomo",
    articles: [validEntry],
  };

  it("accepts a valid file", () => {
    expect(isArticleStatsFile(validFile)).toBe(true);
  });

  it("accepts source 'override'", () => {
    expect(isArticleStatsFile({ ...validFile, source: "override" })).toBe(true);
  });

  it("rejects matomoPeriodDays other than 30", () => {
    expect(isArticleStatsFile({ ...validFile, matomoPeriodDays: 7 })).toBe(false);
  });

  it("rejects unknown source values", () => {
    expect(isArticleStatsFile({ ...validFile, source: "manual" })).toBe(false);
  });

  it("rejects when generatedAt is missing", () => {
    const { generatedAt: _drop, ...rest } = validFile;
    expect(isArticleStatsFile(rest)).toBe(false);
  });

  it("rejects when articles is not an array", () => {
    expect(isArticleStatsFile({ ...validFile, articles: "[]" })).toBe(false);
  });

  it("rejects when any article entry is malformed", () => {
    expect(
      isArticleStatsFile({
        ...validFile,
        articles: [validEntry, { slug: "x" }],
      }),
    ).toBe(false);
  });

  it("rejects null and primitives", () => {
    expect(isArticleStatsFile(null)).toBe(false);
    expect(isArticleStatsFile("file")).toBe(false);
  });
});
