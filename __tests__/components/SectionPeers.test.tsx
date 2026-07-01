import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import { SectionPeers } from "@/components/layout/SectionPeers";

// Le mock global de `next-intl/server` (cf. __tests__/setup.tsx) renvoie la
// cle de traduction telle quelle. Donc t("getting-started.title")
// => "getting-started.title", t("section-peers.toggleLabel", ...)
// => "section-peers.toggleLabel".

async function renderAsync(node: React.ReactNode) {
  const resolved = await node;
  return render(resolved as React.ReactElement);
}

describe("SectionPeers", () => {
  describe("returns null when no rendering is appropriate", () => {
    it("returns null for an unknown section key", async () => {
      const { container } = await renderAsync(
        SectionPeers({ section: "unknown-section", locale: "fr" })
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null when section has only one item (e.g. configurator)", async () => {
      const { container } = await renderAsync(
        SectionPeers({ section: "configurator", locale: "fr" })
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("rendu complet (pas de troncature par defaut)", () => {
    it("renders all items of the getting-started section (8 items)", async () => {
      await renderAsync(
        SectionPeers({ section: "getting-started", locale: "fr" })
      );
      // Le composant rend la liste 2 fois (variante < xl et >= xl), donc
      // chaque href apparait 2 fois (+ 2 fois le lien overview).
      const hrefs = [
        "/getting-started",
        "/getting-started/prerequisites-zero",
        "/getting-started/what-is-claude-code",
        "/getting-started/installation",
        "/getting-started/environment-setup",
        "/getting-started/first-project",
        "/getting-started/templates-starter-kits",
        "/getting-started/faq-beginner",
      ];
      for (const href of hrefs) {
        const links = screen
          .getAllByRole("link")
          .filter((el) => el.getAttribute("href") === href);
        expect(
          links.length,
          `Expected at least one link with href="${href}"`
        ).toBeGreaterThanOrEqual(1);
      }
    });

    it("honors maxItems override when provided", async () => {
      await renderAsync(
        SectionPeers({
          section: "getting-started",
          locale: "fr",
          maxItems: 3,
        })
      );
      // Avec maxItems=3, seuls 3 items sont rendus (+ link overview, +
      // duplication pour la variante xl). On verifie qu'un item au-dela
      // de l'index 3 n'apparait pas dans la liste tronquee.
      const truncatedHref = "/getting-started/faq-beginner";
      const truncatedLinks = screen
        .queryAllByRole("link")
        .filter((el) => el.getAttribute("href") === truncatedHref);
      expect(truncatedLinks).toHaveLength(0);
    });
  });

  describe("aria-current et navigation", () => {
    it("marks the currentSlug item with aria-current='page'", async () => {
      await renderAsync(
        SectionPeers({
          section: "getting-started",
          currentSlug: "installation",
          locale: "fr",
        })
      );
      const activeLinks = screen.getAllByRole("link", { current: "page" });
      // Rendered dans les deux variantes (< xl et >= xl)
      expect(activeLinks.length).toBeGreaterThanOrEqual(1);
      for (const link of activeLinks) {
        expect(link.getAttribute("href")).toBe("/getting-started/installation");
      }
    });

    it("does not set aria-current on non-active links", async () => {
      await renderAsync(
        SectionPeers({
          section: "getting-started",
          currentSlug: "installation",
          locale: "fr",
        })
      );
      const nonActiveLinks = screen
        .getAllByRole("link")
        .filter(
          (link) => link.getAttribute("href") !== "/getting-started/installation"
        );
      for (const link of nonActiveLinks) {
        expect(link.getAttribute("aria-current")).toBeNull();
      }
    });

    it("does not mark any item active when currentSlug is omitted", async () => {
      await renderAsync(
        SectionPeers({ section: "getting-started", locale: "fr" })
      );
      const activeLinks = screen.queryAllByRole("link", { current: "page" });
      expect(activeLinks).toHaveLength(0);
    });
  });

  describe("locale handling", () => {
    it("preserves the canonical href for FR locale (no override)", async () => {
      await renderAsync(
        SectionPeers({ section: "mcp", currentSlug: "setup", locale: "fr" })
      );
      const setupLinks = screen
        .getAllByRole("link")
        .filter((el) => el.getAttribute("href") === "/mcp/setup");
      expect(setupLinks.length).toBeGreaterThanOrEqual(1);
    });

    it("resolves the locale-specific href for EN when hrefByLocale is defined", async () => {
      // L'item `mcp.securite-mcp` a `hrefByLocale: { en: "/mcp/mcp-security" }`
      await renderAsync(
        SectionPeers({ section: "mcp", locale: "en" })
      );
      const localizedLinks = screen
        .getAllByRole("link")
        .filter((el) => el.getAttribute("href") === "/mcp/mcp-security");
      expect(localizedLinks.length).toBeGreaterThanOrEqual(1);
      // L'ancien chemin FR ne doit pas etre rendu en EN
      const frenchOnlyLinks = screen
        .queryAllByRole("link")
        .filter((el) => el.getAttribute("href") === "/mcp/securite-mcp");
      expect(frenchOnlyLinks).toHaveLength(0);
    });
  });

  describe("overview link", () => {
    it("renders a 'view overview' link pointing to the section root", async () => {
      await renderAsync(
        SectionPeers({ section: "skills", locale: "fr" })
      );
      const overviewLinks = screen
        .getAllByRole("link")
        .filter((el) => el.getAttribute("href") === "/skills");
      // Au moins 2 occurrences : le 1er item de la liste (overview) +
      // le lien "voir toute la section" (rendu dans les 2 variantes).
      expect(overviewLinks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("accordeon < xl", () => {
    it("renders a <details> element collapsed by default for the < xl variant", async () => {
      const { container } = await renderAsync(
        SectionPeers({ section: "getting-started", locale: "fr" })
      );
      const details = container.querySelector("details");
      expect(details).toBeTruthy();
      // <details> sans attribut `open` = replie par defaut
      expect(details?.hasAttribute("open")).toBe(false);
    });

    it("renders a <summary> that is the accessible label of the accordeon", async () => {
      const { container } = await renderAsync(
        SectionPeers({ section: "getting-started", locale: "fr" })
      );
      const summary = container.querySelector("summary");
      expect(summary).toBeTruthy();
    });
  });

  describe("section landmark", () => {
    it("renders a section with an accessible aria-label referencing the section title", async () => {
      await renderAsync(
        SectionPeers({ section: "skills", locale: "fr" })
      );
      // Le mock retourne la cle telle quelle, donc l'aria-label est
      // "Pages de la section skills.title"
      const section = screen.getByRole("region", {
        name: /Pages de la section/i,
      });
      expect(section).toBeInTheDocument();
    });

    it("exposes the section key as a data-attribute for styling and tests", async () => {
      const { container } = await renderAsync(
        SectionPeers({ section: "agents", locale: "fr" })
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper?.getAttribute("data-section")).toBe("agents");
    });
  });

  describe("TUTO-10: Matomo tracking attributes", () => {
    it("tags every item link with tuto_section_peers / item_click", async () => {
      await renderAsync(SectionPeers({ section: "skills", locale: "fr" }));
      const itemLinks = screen
        .getAllByRole("link")
        .filter(
          (el) => el.getAttribute("data-track-action") === "item_click"
        );
      expect(itemLinks.length).toBeGreaterThan(0);
      for (const link of itemLinks) {
        expect(link.getAttribute("data-track-category")).toBe(
          "tuto_section_peers"
        );
        expect(link.getAttribute("data-track-label")).toBe("skills");
      }
    });

    it("tags both overview links (accordeon + aside) with overview_click", async () => {
      await renderAsync(SectionPeers({ section: "skills", locale: "fr" }));
      const overviewLinks = screen
        .getAllByRole("link")
        .filter(
          (el) => el.getAttribute("data-track-action") === "overview_click"
        );
      // Une occurrence par variante (< xl accordeon + >= xl aside)
      expect(overviewLinks).toHaveLength(2);
      for (const link of overviewLinks) {
        expect(link.getAttribute("data-track-category")).toBe(
          "tuto_section_peers"
        );
        expect(link.getAttribute("data-track-label")).toBe("skills");
      }
    });
  });
});
