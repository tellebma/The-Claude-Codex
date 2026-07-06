import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string): string =>
  readFileSync(join(process.cwd(), relativePath), "utf8");

describe("content index SSG grid (garde anti-régression indexation Google)", () => {
  it("ArticleThemeFilter n'importe pas next/navigation (dé-opterait le prérendu SSG)", () => {
    const source = read("src/components/ui/ArticleThemeFilter.tsx");
    expect(source).not.toContain("next/navigation");
    expect(source).not.toContain("useSearchParams");
  });

  it("content/page.tsx ne wrappe plus la grille d'articles dans un Suspense", () => {
    const source = read("src/app/[locale]/content/page.tsx");
    expect(source).not.toContain("<Suspense");
    expect(source).not.toContain("Suspense");
  });
});
