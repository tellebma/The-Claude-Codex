import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useExternalLinkTracking } from "@/hooks/useExternalLinkTracking";

function getExternalLinkEvents(): string[] {
  const paq = (window as unknown as { _paq: unknown[][] })._paq;
  return paq
    .filter(
      (cmd) => cmd[0] === "trackEvent" && cmd[2] === "external_link_click"
    )
    .map((cmd) => cmd[3] as string);
}

function clickAnchor(href: string) {
  const a = document.createElement("a");
  a.setAttribute("href", href);
  a.textContent = "link";
  document.body.appendChild(a);
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  a.dispatchEvent(event);
  return a;
}

describe("useExternalLinkTracking", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[] })._paq = [];
    document.body.innerHTML = "";
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
  });

  it("tracks external http(s) links", () => {
    renderHook(() => useExternalLinkTracking());
    clickAnchor("https://anthropic.com/claude");
    clickAnchor("https://github.com/anthropics/claude-code");

    const events = getExternalLinkEvents();
    expect(events).toHaveLength(2);
    expect(events[0]).toBe("https://anthropic.com/claude");
    expect(events[1]).toBe("https://github.com/anthropics/claude-code");
  });

  it("ignores same-origin and relative links", () => {
    renderHook(() => useExternalLinkTracking());
    clickAnchor("/fr/getting-started");
    clickAnchor("#section");
    clickAnchor(`${window.location.origin}/about`);

    expect(getExternalLinkEvents()).toHaveLength(0);
  });

  it("ignores mailto: and tel: links", () => {
    renderHook(() => useExternalLinkTracking());
    clickAnchor("mailto:hello@example.com");
    clickAnchor("tel:+33123456789");

    expect(getExternalLinkEvents()).toHaveLength(0);
  });

  it("ignores dangerous non-http schemes (javascript:, data:, vbscript:)", () => {
    renderHook(() => useExternalLinkTracking());
    clickAnchor("javascript:alert(1)");
    clickAnchor("data:text/html,<script>alert(1)</script>");
    clickAnchor("vbscript:msgbox('x')");

    expect(getExternalLinkEvents()).toHaveLength(0);
  });

  it("ignores anchors without href", () => {
    renderHook(() => useExternalLinkTracking());
    const a = document.createElement("a");
    a.textContent = "no href";
    document.body.appendChild(a);
    a.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
    );
    expect(getExternalLinkEvents()).toHaveLength(0);
  });

  it("tracks clicks that originate from nested elements inside the link", () => {
    renderHook(() => useExternalLinkTracking());
    const a = document.createElement("a");
    a.setAttribute("href", "https://npmjs.com/package/foo");
    const span = document.createElement("span");
    span.textContent = "nested";
    a.appendChild(span);
    document.body.appendChild(a);

    span.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
    );
    expect(getExternalLinkEvents()).toEqual([
      "https://npmjs.com/package/foo",
    ]);
  });
});
