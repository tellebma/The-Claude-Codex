import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";
import { TableOfContents } from "@/components/ui/TableOfContents";

// ──────────────────────────────────────────────────────────────────────────────
// Observer mocks (declared at module scope so tests can access them)
// ──────────────────────────────────────────────────────────────────────────────

let intersectionCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

const mockMutationObserve = vi.fn();
const mockMutationDisconnect = vi.fn();

beforeEach(() => {
  // Reset the DOM between tests
  document.body.innerHTML = "";

  // Reset call counts
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  mockUnobserve.mockClear();
  mockMutationObserve.mockClear();
  mockMutationDisconnect.mockClear();

  // Mock IntersectionObserver — must be a proper constructor (used with `new`)
  const IntersectionObserverMock = function (
    this: IntersectionObserver,
    callback: IntersectionObserverCallback
  ) {
    intersectionCallback = callback;
    this.observe = mockObserve;
    this.disconnect = mockDisconnect;
    this.unobserve = mockUnobserve;
    (this as unknown as Record<string, unknown>).root = null;
    (this as unknown as Record<string, unknown>).rootMargin = "";
    (this as unknown as Record<string, unknown>).thresholds = [];
    this.takeRecords = () => [];
  } as unknown as typeof IntersectionObserver;
  window.IntersectionObserver = vi.fn(
    IntersectionObserverMock
  ) as unknown as typeof IntersectionObserver;

  // Mock MutationObserver — must be a proper constructor (used with `new`)
  const MutationObserverMock = function (
    this: MutationObserver,
    _callback: MutationCallback
  ) {
    this.observe = mockMutationObserve;
    this.disconnect = mockMutationDisconnect;
    this.takeRecords = () => [];
  } as unknown as typeof MutationObserver;
  window.MutationObserver = vi.fn(
    MutationObserverMock
  ) as unknown as typeof MutationObserver;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────────────────────
// Helper – inject headings inside a <main> element
// ──────────────────────────────────────────────────────────────────────────────

function setupHeadings() {
  const main = document.createElement("main");

  const h2 = document.createElement("h2");
  h2.id = "introduction";
  h2.textContent = "Introduction";
  main.appendChild(h2);

  const h3 = document.createElement("h3");
  h3.id = "getting-started";
  h3.textContent = "Getting Started";
  main.appendChild(h3);

  const h2b = document.createElement("h2");
  h2b.id = "conclusion";
  h2b.textContent = "Conclusion";
  main.appendChild(h2b);

  document.body.appendChild(main);
  return main;
}

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe("TableOfContents", () => {
  it("returns null when no headings exist in the DOM", () => {
    // No <main> element with headings – body is empty
    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a nav element with the correct aria-label when headings exist", () => {
    setupHeadings();
    const { container } = render(<TableOfContents />);

    const nav = container.querySelector("nav");
    expect(nav).not.toBeNull();
    // The setup mock returns the translation key as-is → "tableOfContents"
    expect(nav?.getAttribute("aria-label")).toBe("tableOfContents");
  });

  it("renders all discovered headings as links", () => {
    setupHeadings();
    const { container } = render(<TableOfContents />);

    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(3);

    const texts = Array.from(links).map((a) => a.textContent);
    expect(texts).toContain("Introduction");
    expect(texts).toContain("Getting Started");
    expect(texts).toContain("Conclusion");
  });

  it("gives h2 links pl-4 and h3 links pl-6 indentation classes", () => {
    setupHeadings();
    const { container } = render(<TableOfContents />);

    const links = Array.from(container.querySelectorAll("a"));

    const introLink = links.find((a) => a.textContent === "Introduction");
    const gettingLink = links.find((a) => a.textContent === "Getting Started");
    const conclusionLink = links.find((a) => a.textContent === "Conclusion");

    // h2 → pl-4
    expect(introLink?.className).toContain("pl-4");
    expect(conclusionLink?.className).toContain("pl-4");

    // h3 → pl-6
    expect(gettingLink?.className).toContain("pl-6");
  });

  it("sets correct href attributes on links", () => {
    setupHeadings();
    const { container } = render(<TableOfContents />);

    const links = Array.from(container.querySelectorAll("a"));

    const introLink = links.find((a) => a.textContent === "Introduction");
    const gettingLink = links.find((a) => a.textContent === "Getting Started");
    const conclusionLink = links.find((a) => a.textContent === "Conclusion");

    expect(introLink?.getAttribute("href")).toBe("#introduction");
    expect(gettingLink?.getAttribute("href")).toBe("#getting-started");
    expect(conclusionLink?.getAttribute("href")).toBe("#conclusion");
  });

  it("sets up an IntersectionObserver to track heading visibility", () => {
    setupHeadings();
    render(<TableOfContents />);

    // IntersectionObserver should have been constructed once
    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);

    // observe() should have been called once per heading (3 headings)
    expect(mockObserve).toHaveBeenCalledTimes(3);
  });

  it("sets up a MutationObserver to detect dynamically added headings", () => {
    setupHeadings();
    render(<TableOfContents />);

    expect(window.MutationObserver).toHaveBeenCalledTimes(1);
    expect(mockMutationObserve).toHaveBeenCalledTimes(1);
  });

  it("disconnects both observers on unmount", () => {
    setupHeadings();
    const { unmount } = render(<TableOfContents />);

    unmount();

    // MutationObserver disconnect is called during cleanup of the first effect
    expect(mockMutationDisconnect).toHaveBeenCalled();
    // IntersectionObserver disconnect is called during cleanup of the second effect
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("marks the active heading link with aria-current='location' when intersecting", () => {
    setupHeadings();
    const { container } = render(<TableOfContents />);

    // Simulate the IntersectionObserver firing for the "introduction" heading
    const introEl = document.getElementById("introduction")!;
    act(() => {
      intersectionCallback(
        [
          {
            isIntersecting: true,
            target: introEl,
            boundingClientRect: introEl.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: introEl.getBoundingClientRect(),
            rootBounds: null,
            time: 0,
          } as IntersectionObserverEntry,
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    const links = Array.from(container.querySelectorAll("a"));
    const introLink = links.find((a) => a.textContent === "Introduction");
    const gettingLink = links.find((a) => a.textContent === "Getting Started");

    expect(introLink?.getAttribute("aria-current")).toBe("location");
    expect(gettingLink?.getAttribute("aria-current")).toBeNull();
  });

  it("does not render the nav when headings have no id attribute", () => {
    const main = document.createElement("main");

    // Heading without id — should not be picked up by querySelectorAll("main h2[id]")
    const h2 = document.createElement("h2");
    h2.textContent = "No ID heading";
    main.appendChild(h2);

    document.body.appendChild(main);

    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });
});
