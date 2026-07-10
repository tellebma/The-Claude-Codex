import type { SearchEntry } from "@/data/search-index-fr";
import { searchIndexFr } from "@/data/search-index-fr";
import { searchIndexEn } from "@/data/search-index-en";
import { searchIndexEs } from "@/data/search-index-es";

// Re-export for backward compatibility
export type { SearchEntry } from "@/data/search-index-fr";
export { searchIndexFr } from "@/data/search-index-fr";
export { searchIndexEn } from "@/data/search-index-en";
export { searchIndexEs } from "@/data/search-index-es";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreEntries(
  index: ReadonlyArray<SearchEntry>,
  query: string
): ReadonlyArray<SearchEntry> {
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  const queryTokens = normalizedQuery.split(/\s+/);

  const scored = index
    .map((entry) => {
      const titleNorm = normalizeText(entry.title);
      const descNorm = normalizeText(entry.description);
      const keywordsNorm = entry.keywords
        .map((k) => normalizeText(k))
        .join(" ");

      let score = 0;

      for (const token of queryTokens) {
        if (titleNorm.includes(token)) {
          score += 10;
        }
        if (keywordsNorm.includes(token)) {
          score += 5;
        }
        if (descNorm.includes(token)) {
          score += 2;
        }
      }

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.entry);
}

function resolveIndex(locale: string): ReadonlyArray<SearchEntry> {
  if (locale === "en") return searchIndexEn;
  if (locale === "es") return searchIndexEs;
  return searchIndexFr;
}

export function searchEntries(
  query: string,
  locale: string = "fr"
): ReadonlyArray<SearchEntry> {
  return scoreEntries(resolveIndex(locale), query);
}
