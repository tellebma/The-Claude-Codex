import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTutoComponentTracking } from "@/hooks/useTutoComponentTracking";

function getTrackedEvents(): Array<[string, string, string | undefined]> {
  const paq = (window as unknown as { _paq: unknown[][] })._paq;
  return paq
    .filter((cmd) => cmd[0] === "trackEvent")
    .map((cmd) => [cmd[1] as string, cmd[2] as string, cmd[3] as string]);
}

function clickElement(attrs: Record<string, string>, tag = "a") {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.textContent = "target";
  document.body.appendChild(el);
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
  );
  return el;
}

describe("useTutoComponentTracking", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[] })._paq = [];
    document.body.innerHTML = "";
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
  });

  it("tracks clicks on elements with data-track-category and data-track-action", () => {
    renderHook(() => useTutoComponentTracking());
    clickElement({
      href: "/fr/skills/best-skills/",
      "data-track-category": "tuto_pager",
      "data-track-action": "next",
    });

    expect(getTrackedEvents()).toEqual([
      ["tuto_pager", "next", "http://localhost:3000/fr/skills/best-skills/"],
    ]);
  });

  it("uses data-track-label when provided instead of the href", () => {
    renderHook(() => useTutoComponentTracking());
    clickElement({
      href: "/fr/skills/best-skills/",
      "data-track-category": "tuto_section_peers",
      "data-track-action": "item_click",
      "data-track-label": "skills",
    });

    expect(getTrackedEvents()).toEqual([
      ["tuto_section_peers", "item_click", "skills"],
    ]);
  });

  it("ignores clicks on elements without tracking attributes", () => {
    renderHook(() => useTutoComponentTracking());
    clickElement({ href: "/fr/skills/best-skills/" });

    expect(getTrackedEvents()).toHaveLength(0);
  });

  it("ignores incomplete tracking attributes (category without action)", () => {
    renderHook(() => useTutoComponentTracking());
    clickElement({
      href: "/fr/skills/best-skills/",
      "data-track-category": "tuto_pager",
    });

    expect(getTrackedEvents()).toHaveLength(0);
  });

  it("tracks clicks that originate from nested elements inside the tracked link", () => {
    renderHook(() => useTutoComponentTracking());
    const a = document.createElement("a");
    a.setAttribute("href", "/fr/agents/orchestration/");
    a.setAttribute("data-track-category", "tuto_section_peers");
    a.setAttribute("data-track-action", "overview_click");
    a.setAttribute("data-track-label", "agents");
    const span = document.createElement("span");
    span.textContent = "nested";
    a.appendChild(span);
    document.body.appendChild(a);

    span.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
    );

    expect(getTrackedEvents()).toEqual([
      ["tuto_section_peers", "overview_click", "agents"],
    ]);
  });

  it("does not track on non-anchor elements without an explicit label", () => {
    renderHook(() => useTutoComponentTracking());
    clickElement(
      {
        "data-track-category": "tuto_pager",
        "data-track-action": "prev",
      },
      "button"
    );

    expect(getTrackedEvents()).toEqual([["tuto_pager", "prev", undefined]]);
  });
});
