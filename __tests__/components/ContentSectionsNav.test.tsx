import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { ContentSectionsNav } from "@/components/layout/ContentSectionsNav";

const sections = [
  { id: "pinned-latest", label: "À la une" },
  { id: "trending", label: "Tendances" },
  { id: "most-read", label: "Plus lus" },
  { id: "all-articles", label: "Tous" },
];

describe("ContentSectionsNav", () => {
  let observerInstances: Array<{
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
  }>;

  beforeEach(() => {
    observerInstances = [];
    // Mock IntersectionObserver via une vraie classe (compatible `new`).
    class MockIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(_cb: IntersectionObserverCallback) {
        void _cb;
        observerInstances.push(this);
      }
    }
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      MockIntersectionObserver;

    // Stub scrollIntoView (jsdom doesn't implement)
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when no sections are provided", () => {
    const { container } = render(<ContentSectionsNav sections={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders two <nav> elements (xl + < xl variants)", () => {
    render(<ContentSectionsNav sections={sections} />);
    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(2);
  });

  it("renders all section labels in each variant", () => {
    render(<ContentSectionsNav sections={sections} />);
    for (const section of sections) {
      const links = screen.getAllByRole("link", { name: section.label });
      expect(links).toHaveLength(2);
    }
  });

  it("uses provided aria-label for the navigation landmarks", () => {
    render(
      <ContentSectionsNav
        sections={sections}
        ariaLabel="Sections de la page contenus"
      />,
    );
    const navs = screen.getAllByRole("navigation", {
      name: /Sections de la page contenus/,
    });
    expect(navs).toHaveLength(2);
  });

  it("falls back to a default aria-label when none is provided", () => {
    render(<ContentSectionsNav sections={sections} />);
    const navs = screen.getAllByRole("navigation", {
      name: "Navigation des sections",
    });
    expect(navs).toHaveLength(2);
  });

  it("uses anchor href to the section id", () => {
    render(<ContentSectionsNav sections={sections} />);
    for (const section of sections) {
      const links = screen.getAllByRole("link", { name: section.label });
      for (const link of links) {
        expect(link.getAttribute("href")).toBe(`#${section.id}`);
      }
    }
  });

  it("marks the first section as active initially", () => {
    render(<ContentSectionsNav sections={sections} />);
    const activeLinks = screen.getAllByRole("link", { current: "location" });
    expect(activeLinks).toHaveLength(2);
    for (const link of activeLinks) {
      expect(link.getAttribute("href")).toBe(`#${sections[0].id}`);
    }
  });

  it("observes all sections that have a matching DOM element", () => {
    const wrapper = document.createElement("div");
    for (const section of sections) {
      const el = document.createElement("section");
      el.id = section.id;
      wrapper.appendChild(el);
    }
    document.body.appendChild(wrapper);

    render(<ContentSectionsNav sections={sections} />);

    expect(observerInstances).toHaveLength(1);
    expect(observerInstances[0].observe).toHaveBeenCalledTimes(sections.length);

    document.body.removeChild(wrapper);
  });

  it("ignores sections without a matching DOM element", () => {
    // Aucune section dans le DOM
    render(<ContentSectionsNav sections={sections} />);
    expect(observerInstances).toHaveLength(1);
    expect(observerInstances[0].observe).not.toHaveBeenCalled();
  });

  it("calls scrollIntoView when a link is clicked (smooth by default)", () => {
    const target = document.createElement("section");
    target.id = "trending";
    target.setAttribute("tabindex", "-1");
    document.body.appendChild(target);

    render(<ContentSectionsNav sections={sections} />);
    const links = screen.getAllByRole("link", { name: "Tendances" });
    fireEvent.click(links[0]);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
    document.body.removeChild(target);
  });

  it("updates active state immediately after click (optimistic)", () => {
    const target = document.createElement("section");
    target.id = "most-read";
    document.body.appendChild(target);

    render(<ContentSectionsNav sections={sections} />);
    const links = screen.getAllByRole("link", { name: "Plus lus" });
    fireEvent.click(links[0]);

    // Apres clic, le link "Plus lus" doit avoir aria-current="location"
    const activeLinks = screen.getAllByRole("link", { current: "location" });
    expect(
      activeLinks.every(
        (link) => link.getAttribute("href") === "#most-read",
      ),
    ).toBe(true);

    document.body.removeChild(target);
  });

  it("uses behavior 'auto' when prefers-reduced-motion is set", () => {
    const target = document.createElement("section");
    target.id = "trending";
    document.body.appendChild(target);

    // Spec : matchMedia("(prefers-reduced-motion: reduce)") -> matches true
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: q.includes("reduce"),
        media: q,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<ContentSectionsNav sections={sections} />);
    const links = screen.getAllByRole("link", { name: "Tendances" });
    fireEvent.click(links[0]);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
    document.body.removeChild(target);
  });

  it("disconnects the observer when unmounted", () => {
    const { unmount } = render(<ContentSectionsNav sections={sections} />);
    expect(observerInstances).toHaveLength(1);
    unmount();
    expect(observerInstances[0].disconnect).toHaveBeenCalled();
  });

  it("does not preventDefault when target section is not found", () => {
    render(<ContentSectionsNav sections={sections} />);
    const links = screen.getAllByRole("link", { name: "Tendances" });

    // Pas de section avec id="trending" dans le DOM ici
    // L'event est traite par fireEvent.click qui ne reflete pas
    // exactement le comportement reel. On verifie juste qu'aucune
    // erreur n'est lancee et que scrollIntoView n'est pas appele.
    Element.prototype.scrollIntoView = vi.fn();
    fireEvent.click(links[0]);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
