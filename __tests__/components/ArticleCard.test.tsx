import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";

import { ArticleCard, type ArticleCardArticle } from "@/components/ui/ArticleCard";

async function renderAsync(node: React.ReactNode) {
  const resolved = await node;
  return render(resolved as React.ReactElement);
}

const baseArticle: ArticleCardArticle = {
  title: "Comprendre Claude Code en profondeur",
  description:
    "Un guide dense, exhaustif et pratique sur le fonctionnement interne de Claude Code, ses commandes avancees, et comment l'integrer dans une stack productive moderne. Cette description fait plus de 120 caracteres exprès pour tester la troncature.",
  locale: "fr",
  slug: "comprendre-claude-code-internals",
  section: null,
  dateModified: "2026-05-15",
  themes: ["guide", "tooling"],
  wordCount: 1200,
};

describe("ArticleCard", () => {
  describe("Variant grid (default)", () => {
    it("renders the article title in an h3", async () => {
      await renderAsync(ArticleCard({ article: baseArticle, locale: "fr" }));
      const heading = screen.getByRole("heading", {
        level: 3,
        name: baseArticle.title,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders a link to /content/<slug> when no section", async () => {
      await renderAsync(ArticleCard({ article: baseArticle, locale: "fr" }));
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/content/comprendre-claude-code-internals");
    });

    it("renders a link to /<section>/<slug> when section is provided", async () => {
      await renderAsync(
        ArticleCard({
          article: { ...baseArticle, section: "skills", slug: "find-skills" },
          locale: "fr",
        }),
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/skills/find-skills");
    });

    it("truncates description to 120 characters (grid variant)", async () => {
      const { container } = await renderAsync(
        ArticleCard({ article: baseArticle, locale: "fr" }),
      );
      const description = container.querySelector("p.line-clamp-2");
      expect(description).not.toBeNull();
      const text = description?.textContent ?? "";
      // 120 - 1 for ellipsis, but we also allow word-cut backoff
      expect(text.length).toBeLessThanOrEqual(121);
      expect(text).toMatch(/…$/);
    });

    it("emits Matomo data attributes on the link", async () => {
      await renderAsync(ArticleCard({ article: baseArticle, locale: "fr" }));
      const link = screen.getByRole("link");
      expect(link.getAttribute("data-matomo-category")).toBe("engagement");
      expect(link.getAttribute("data-matomo-action")).toBe("article_card_click");
      expect(link.getAttribute("data-matomo-name")).toBe(
        baseArticle.slug,
      );
    });

    it("renders a fallback gradient block when no OG image is provided", async () => {
      const { container } = await renderAsync(
        ArticleCard({ article: baseArticle, locale: "fr" }),
      );
      // First word of title used as fallback display
      const firstWord = baseArticle.title.split(" ")[0]!;
      const fallback = within(container as unknown as HTMLElement).getByText(
        firstWord,
      );
      expect(fallback).toBeInTheDocument();
      expect(container.querySelector("img")).toBeNull();
    });

    it("renders an <img> when ogImageUrl is provided (lazy by default for grid)", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: { ...baseArticle, ogImageUrl: "/og/sample.png" },
          locale: "fr",
        }),
      );
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img?.getAttribute("loading")).toBe("lazy");
      expect(img?.getAttribute("src")).toBe("/og/sample.png");
    });

    it("renders a reading minutes label when wordCount is provided", async () => {
      const { container } = await renderAsync(
        ArticleCard({ article: baseArticle, locale: "fr" }),
      );
      // 1200 / 200 = 6 minutes. Le mock i18n renvoie la cle telle quelle,
      // donc on verifie la presence du span avec la cle readingMinutes.
      expect(container.textContent).toContain("readingMinutes");
    });

    it("does not render reading minutes when wordCount is absent", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: { ...baseArticle, wordCount: undefined },
          locale: "fr",
        }),
      );
      expect(container.textContent).not.toContain("readingMinutes");
    });
  });

  describe("Variant hero (Pinned)", () => {
    it("renders a 'Pinned' badge", async () => {
      const { container } = await renderAsync(
        ArticleCard({ article: baseArticle, locale: "fr", size: "hero" }),
      );
      expect(container.textContent).toContain("pinnedLabel");
    });

    it("uses loading='eager' and fetchPriority='high' on the image", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: { ...baseArticle, ogImageUrl: "/og/sample.png" },
          locale: "fr",
          size: "hero",
        }),
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("loading")).toBe("eager");
      // React converts fetchPriority => fetchpriority attribute on rendered HTML
      expect(img?.getAttribute("fetchpriority")).toBe("high");
    });

    it("renders an explicit 'Read article' CTA", async () => {
      const { container } = await renderAsync(
        ArticleCard({ article: baseArticle, locale: "fr", size: "hero" }),
      );
      expect(container.textContent).toContain("readCta");
    });

    it("truncates description to 200 characters (hero variant)", async () => {
      const longDescription = "x".repeat(300);
      const { container } = await renderAsync(
        ArticleCard({
          article: { ...baseArticle, description: longDescription },
          locale: "fr",
          size: "hero",
        }),
      );
      const para = container.querySelector("p.line-clamp-3");
      expect(para).not.toBeNull();
      const text = para?.textContent ?? "";
      expect(text.length).toBeLessThanOrEqual(201);
    });
  });

  describe("Variant row (Trending)", () => {
    it("renders two variants in DOM (md+ row + mobile grid)", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: baseArticle,
          locale: "fr",
          size: "row",
          deltaPct: 33,
        }),
      );
      // Variant row + fallback grid mobile -> 2 links rendus
      const links = container.querySelectorAll("a[data-matomo-name]");
      expect(links).toHaveLength(2);
    });

    it("renders the trending badge with TrendingUp icon (aria-hidden)", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: baseArticle,
          locale: "fr",
          size: "row",
          deltaPct: 33,
        }),
      );
      // L'icone TrendingUp doit etre presente avec aria-hidden
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThanOrEqual(2);
      for (const svg of svgs) {
        // aria-hidden ou pas de role
        const ariaHidden = svg.getAttribute("aria-hidden");
        const role = svg.getAttribute("role");
        expect(ariaHidden === "true" || role !== "img").toBeTruthy();
      }
    });

    it("renders the delta % when provided", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: baseArticle,
          locale: "fr",
          size: "row",
          deltaPct: 33,
        }),
      );
      expect(container.textContent).toMatch(/\+33%/);
    });

    it("does not render delta block when deltaPct is undefined", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: baseArticle,
          locale: "fr",
          size: "row",
        }),
      );
      expect(container.textContent).not.toMatch(/\+[0-9]+%/);
    });
  });

  describe("aria-label propagation", () => {
    it("renders an aria-label attribute on the link", async () => {
      await renderAsync(ArticleCard({ article: baseArticle, locale: "fr" }));
      const link = screen.getByRole("link");
      // Mock i18n returns the key verbatim; we just assert presence + non-empty.
      const aria = link.getAttribute("aria-label");
      expect(aria).toBeTruthy();
      expect(aria?.length).toBeGreaterThan(0);
    });
  });

  describe("ThemeBadges integration", () => {
    it("renders ThemeBadges when article.themes is present", async () => {
      const { container } = await renderAsync(
        ArticleCard({ article: baseArticle, locale: "fr" }),
      );
      // ThemeBadges renders a <ul aria-label="badgesLabel">
      const list = container.querySelector("ul[aria-label]");
      expect(list).not.toBeNull();
    });

    it("does not render ThemeBadges block when article.themes is empty", async () => {
      const { container } = await renderAsync(
        ArticleCard({
          article: { ...baseArticle, themes: [] },
          locale: "fr",
        }),
      );
      const list = container.querySelector("ul[aria-label]");
      expect(list).toBeNull();
    });
  });
});
