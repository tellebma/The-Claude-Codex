import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMatomoPageviewTracking } from "@/hooks/useMatomoPageviewTracking";

// Mock next/navigation : on retourne des valeurs constantes par defaut, on
// pourra spier dessus via des vi.fn() declares ci-dessous pour controler ce
// que le hook voit a chaque render.
const usePathnameMock = vi.fn<() => string>(() => "/fr/");
const useSearchParamsMock = vi.fn<() => URLSearchParams>(
  () => new URLSearchParams()
);

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
  useSearchParams: () => useSearchParamsMock(),
}));

function getPaq(): unknown[][] {
  return (window as unknown as { _paq: unknown[][] })._paq;
}

function getCommands(name: string): unknown[][] {
  return getPaq().filter((cmd) => cmd[0] === name);
}

describe("useMatomoPageviewTracking", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[][] })._paq = [];
    // jsdom : reset l'origin et le titre par defaut
    Object.defineProperty(window, "location", {
      value: { ...window.location, origin: "https://claude-codex.fr" },
      writable: true,
    });
    document.title = "Test page";
    usePathnameMock.mockReturnValue("/fr/");
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
    vi.clearAllMocks();
  });

  // Note : usePathname() retourne `string` (pas nullable) en App Router,
  // donc plus de cas "pathname null" a tester. cf. types next/navigation.
  it("emet setCustomUrl + setDocumentTitle + trackPageView au premier render", () => {
    renderHook(() => useMatomoPageviewTracking());
    const setUrl = getCommands("setCustomUrl");
    const setTitle = getCommands("setDocumentTitle");
    const tpv = getCommands("trackPageView");
    expect(setUrl).toHaveLength(1);
    expect(setUrl[0]?.[1]).toBe("https://claude-codex.fr/fr/");
    expect(setTitle).toHaveLength(1);
    expect(setTitle[0]?.[1]).toBe("Test page");
    expect(tpv).toHaveLength(1);
  });

  it("ajoute la query string a l'URL si presente", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("ref=hn"));
    renderHook(() => useMatomoPageviewTracking());
    const setUrl = getCommands("setCustomUrl");
    expect(setUrl[0]?.[1]).toBe("https://claude-codex.fr/fr/?ref=hn");
  });

  it("re-emet a chaque changement de pathname (navigation App Router)", () => {
    const { rerender } = renderHook(() => useMatomoPageviewTracking());
    expect(getCommands("trackPageView")).toHaveLength(1);

    usePathnameMock.mockReturnValue("/fr/mcp/");
    rerender();
    expect(getCommands("trackPageView")).toHaveLength(2);

    usePathnameMock.mockReturnValue("/fr/agents/");
    rerender();
    expect(getCommands("trackPageView")).toHaveLength(3);
  });

  it("ne fire pas a nouveau si pathname identique au render precedent", () => {
    const { rerender } = renderHook(() => useMatomoPageviewTracking());
    expect(getCommands("trackPageView")).toHaveLength(1);
    rerender();
    rerender();
    expect(getCommands("trackPageView")).toHaveLength(1);
  });
});
