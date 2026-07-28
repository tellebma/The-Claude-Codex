/**
 * Integrite referentielle du socle benchmarks.
 *
 * Ces tests sont la garde anti-hallucination du fichier de donnees : tout score
 * doit pointer un modele et un benchmark declares, porter une source https et
 * une date de releve plausible, et rester unique pour un couple
 * (modele, benchmark, type de source).
 */
import { describe, expect, it } from "vitest";
import {
  benchmarks,
  getBenchmark,
  getBenchmarksByCategory,
  getModel,
  getScoresForBenchmark,
  lastReviewedAt,
  models,
  scores,
} from "@/data/llm-benchmarks";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

describe("benchmark definitions", () => {
  it("declares at least one benchmark per category covered by the page", () => {
    const categories = [
      "coding-agentic",
      "reasoning",
      "agents-tools",
      "long-context",
      "human-preference",
      "meta-index",
    ] as const;
    for (const category of categories) {
      expect(
        getBenchmarksByCategory(category).length,
        `no benchmark for category ${category}`,
      ).toBeGreaterThan(0);
    }
  });

  it("uses unique ids", () => {
    const ids = benchmarks.map((benchmark) => benchmark.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a non-empty label, maintainer and an http(s) leaderboard url", () => {
    for (const benchmark of benchmarks) {
      expect(benchmark.label.length, benchmark.id).toBeGreaterThan(0);
      expect(benchmark.maintainer.length, benchmark.id).toBeGreaterThan(0);
      expect(benchmark.leaderboardUrl, benchmark.id).toMatch(/^https?:\/\//);
    }
  });

  it("has at least one score for every declared benchmark", () => {
    for (const benchmark of benchmarks) {
      expect(
        getScoresForBenchmark(benchmark.id).length,
        `benchmark ${benchmark.id} has no score`,
      ).toBeGreaterThan(0);
    }
  });
});

describe("model entries", () => {
  it("uses unique ids", () => {
    const ids = models.map((model) => model.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a non-empty label, vendor and license", () => {
    for (const model of models) {
      expect(model.label.length, model.id).toBeGreaterThan(0);
      expect(model.vendor.length, model.id).toBeGreaterThan(0);
      expect(model.license.length, model.id).toBeGreaterThan(0);
    }
  });

  it("uses an ISO release date that is not in the future when documented", () => {
    for (const model of models) {
      if (model.releasedAt === undefined) continue;
      expect(isValidIsoDate(model.releasedAt), `${model.id}: ${model.releasedAt}`).toBe(
        true,
      );
      expect(model.releasedAt <= lastReviewedAt, model.id).toBe(true);
    }
  });

  it("covers the models required by the design", () => {
    const required = [
      "claude-opus-5",
      "claude-fable-5",
      "claude-opus-4-8",
      "claude-sonnet-5",
      "gpt-5-6-sol",
      "gpt-5-6-terra",
      "gpt-5-6-luna",
      "gpt-5-5",
      "kimi-k3",
      "glm-5-2",
      "gemini-3-1-pro",
    ];
    for (const id of required) {
      expect(getModel(id), `missing model ${id}`).toBeDefined();
    }
  });

  it("is fully referenced: every declared model carries at least one score", () => {
    const scored = new Set(scores.map((score) => score.modelId));
    const orphans = models.filter((model) => !scored.has(model.id)).map((m) => m.id);
    expect(orphans, `models without any score: ${orphans.join(", ")}`).toEqual([]);
  });
});

describe("score entries", () => {
  it("references an existing model", () => {
    for (const score of scores) {
      expect(
        getModel(score.modelId),
        `unknown modelId ${score.modelId} on ${score.benchmarkId}`,
      ).toBeDefined();
    }
  });

  it("references an existing benchmark", () => {
    for (const score of scores) {
      expect(
        getBenchmark(score.benchmarkId),
        `unknown benchmarkId ${score.benchmarkId} for ${score.modelId}`,
      ).toBeDefined();
    }
  });

  it("always carries an https source url", () => {
    for (const score of scores) {
      expect(
        score.sourceUrl.startsWith("https://"),
        `${score.modelId}/${score.benchmarkId}: ${score.sourceUrl}`,
      ).toBe(true);
    }
  });

  it("always carries a publisher", () => {
    for (const score of scores) {
      expect(
        score.publisher.length,
        `${score.modelId}/${score.benchmarkId}`,
      ).toBeGreaterThan(0);
    }
  });

  it("uses an ISO measure date that is not in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const score of scores) {
      const label = `${score.modelId}/${score.benchmarkId}: ${score.measuredAt}`;
      expect(isValidIsoDate(score.measuredAt), label).toBe(true);
      expect(score.measuredAt <= today, label).toBe(true);
    }
  });

  it("uses a finite, positive numeric value", () => {
    for (const score of scores) {
      const label = `${score.modelId}/${score.benchmarkId}`;
      expect(Number.isFinite(score.value), label).toBe(true);
      expect(score.value, label).toBeGreaterThan(0);
    }
  });

  it("keeps percent scores within 0 and 100", () => {
    for (const score of scores) {
      if (score.unit !== "percent") continue;
      expect(score.value, `${score.modelId}/${score.benchmarkId}`).toBeLessThanOrEqual(
        100,
      );
    }
  });

  it("uses a single unit per benchmark", () => {
    for (const benchmark of benchmarks) {
      const units = new Set(
        getScoresForBenchmark(benchmark.id).map((score) => score.unit),
      );
      expect(units.size, `${benchmark.id} mixes units: ${[...units].join(", ")}`).toBe(1);
    }
  });

  it("has no duplicate (modelId, benchmarkId, sourceType)", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const score of scores) {
      const key = `${score.modelId}|${score.benchmarkId}|${score.sourceType}`;
      if (seen.has(key)) duplicates.push(key);
      seen.add(key);
    }
    expect(duplicates, `duplicates: ${duplicates.join(", ")}`).toEqual([]);
  });

  it("uses a single publisher per (benchmark, sourceType, model)", () => {
    // Deux publieurs pour la meme cellule signalerait une valeur non arbitree.
    const byKey = new Map<string, Set<string>>();
    for (const score of scores) {
      const key = `${score.benchmarkId}|${score.sourceType}|${score.modelId}`;
      const publishers = byKey.get(key) ?? new Set<string>();
      publishers.add(score.publisher);
      byKey.set(key, publishers);
    }
    const conflicts = [...byKey.entries()]
      .filter(([, publishers]) => publishers.size > 1)
      .map(([key]) => key);
    expect(conflicts).toEqual([]);
  });
});

describe("getScoresForBenchmark", () => {
  it("sorts by descending value", () => {
    for (const benchmark of benchmarks) {
      const values = getScoresForBenchmark(benchmark.id).map((score) => score.value);
      const sorted = [...values].sort((a, b) => b - a);
      expect(values, benchmark.id).toEqual(sorted);
    }
  });

  it("returns an empty array for an unknown benchmark", () => {
    expect(getScoresForBenchmark("does-not-exist")).toEqual([]);
  });

  it("does not mutate the source array", () => {
    const before = scores.map((score) => `${score.modelId}|${score.benchmarkId}`);
    getScoresForBenchmark("aa-intelligence-index-v4-1");
    const after = scores.map((score) => `${score.modelId}|${score.benchmarkId}`);
    expect(after).toEqual(before);
  });
});

describe("lookup helpers", () => {
  it("getBenchmark returns the matching definition or undefined", () => {
    expect(getBenchmark("swe-bench-verified")?.label).toBe("SWE-bench Verified");
    expect(getBenchmark("nope")).toBeUndefined();
  });

  it("getModel returns the matching entry or undefined", () => {
    expect(getModel("claude-opus-5")?.vendor).toBe("Anthropic");
    expect(getModel("nope")).toBeUndefined();
  });

  it("getBenchmarksByCategory filters on the category", () => {
    const humanPreference = getBenchmarksByCategory("human-preference");
    expect(humanPreference.map((benchmark) => benchmark.id)).toContain("text-arena");
    expect(
      humanPreference.every((benchmark) => benchmark.category === "human-preference"),
    ).toBe(true);
  });
});

describe("lastReviewedAt", () => {
  it("is an ISO date not in the future", () => {
    expect(isValidIsoDate(lastReviewedAt)).toBe(true);
    expect(lastReviewedAt <= new Date().toISOString().slice(0, 10)).toBe(true);
  });

  it("is not older than the most recent measure", () => {
    const newest = scores
      .map((score) => score.measuredAt)
      .reduce((max, date) => (date > max ? date : max), "0000-00-00");
    expect(lastReviewedAt >= newest).toBe(true);
  });
});
