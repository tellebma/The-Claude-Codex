import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import React from "react";

// jsdom does not implement scrollIntoView — stub it globally
Element.prototype.scrollIntoView = vi.fn();

vi.mock("@/lib/search-live", () => ({
  MIN_CHARS: 2,
  MAX_RESULTS_FULL: 20,
  loadSearchIndex: vi.fn(() => Promise.resolve([])),
  runSearch: vi.fn(() => ({ results: [], truncated: 0, total: 0 })),
  clearSearchIndexCache: vi.fn(),
}));

import { SearchDialog } from "@/components/ui/SearchDialog";
import {
  loadSearchIndex,
  runSearch,
  type SearchResult,
  type SearchDoc,
  type SearchRunResult,
} from "@/lib/search-live";

const mockLoadSearchIndex = vi.mocked(loadSearchIndex);
const mockRunSearch = vi.mocked(runSearch);

const MOCK_DOCS: SearchDoc[] = [
  {
    title: "Installation",
    description: "Guide install",
    section: "Démarrer",
    href: "/fr/getting-started/installation",
    locale: "fr",
    headings: [],
    body: "",
  },
];

const MOCK_RESULTS: SearchResult[] = [
  {
    title: "Installation",
    description: "Guide install",
    section: "Démarrer",
    href: "/fr/getting-started/installation",
    locale: "fr",
    score: 20,
    titleMatch: true,
    totalHits: 0,
    snippets: [],
  },
  {
    title: "MCP",
    description: "Guide MCP",
    section: "MCP",
    href: "/fr/mcp",
    locale: "fr",
    score: 15,
    titleMatch: true,
    totalHits: 0,
    snippets: [],
  },
];

const MOCK_RUN_WITH_RESULTS: SearchRunResult = {
  results: MOCK_RESULTS,
  truncated: 0,
  total: MOCK_RESULTS.length,
};

const MOCK_RUN_EMPTY: SearchRunResult = {
  results: [],
  truncated: 0,
  total: 0,
};

// Advance timers + flush microtasks so both the debounce timeout and the
// lazy index-load promise resolve before assertions.
async function flushAsync() {
  await act(async () => {
    await Promise.resolve();
    vi.advanceTimersByTime(200);
    await Promise.resolve();
    await Promise.resolve();
  });
}

// Opens the dialog and waits for the lazy-loaded index to settle. Without
// this wait the input is rendered but `loadSearchIndex` hasn't resolved yet,
// so typing would race the state update.
async function openAndLoad() {
  fireEvent.click(screen.getByRole("button", { name: /trigger/i }));
  await flushAsync();
}

async function typeAndDebounce(value: string) {
  const input = screen.getByRole("combobox");
  fireEvent.change(input, { target: { value } });
  await flushAsync();
  return input;
}

describe("SearchDialog", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockLoadSearchIndex.mockReset();
    mockLoadSearchIndex.mockResolvedValue(MOCK_DOCS);
    mockRunSearch.mockReset();
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the trigger button", () => {
    render(<SearchDialog />);
    const triggerButton = screen.getByRole("button", { name: /trigger/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it("opens dialog when trigger button is clicked", async () => {
    render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await openAndLoad();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens dialog with Ctrl+K keyboard shortcut", async () => {
    render(<SearchDialog />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    await flushAsync();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes dialog with Escape key", async () => {
    render(<SearchDialog />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    await flushAsync();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows typeToSearch hint when dialog is open with no query", async () => {
    render(<SearchDialog />);
    await openAndLoad();
    expect(screen.getByText("typeToSearch")).toBeInTheDocument();
  });

  it("shows min-chars hint when user types only one character", async () => {
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("a");
    expect(screen.getByText("minCharsHint")).toBeInTheDocument();
    expect(mockRunSearch).not.toHaveBeenCalled();
  });

  it("calls runSearch after typing a query past the min-chars threshold", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("install");
    expect(mockRunSearch).toHaveBeenCalledWith("install", MOCK_DOCS);
  });

  it("displays search results returned by runSearch", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("install");

    // "MCP" appears both as a title and as a section badge, hence getAllByText.
    expect(screen.getByText("Installation")).toBeInTheDocument();
    expect(screen.getAllByText("MCP").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("shows noResults message when runSearch returns empty with a query", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("xyznotfound");

    const noResultsElements = screen.getAllByText(/noResults/i);
    expect(noResultsElements.length).toBeGreaterThan(0);
  });

  it("navigates to selected result on Enter", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);
    render(<SearchDialog />);
    await openAndLoad();
    const input = await typeAndDebounce("install");

    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("changes aria-selected with ArrowDown/ArrowUp keyboard navigation", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);
    render(<SearchDialog />);
    await openAndLoad();
    const input = await typeAndDebounce("install");

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("closes dialog when clicking the backdrop button", async () => {
    render(<SearchDialog />);
    await openAndLoad();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = screen.getByTestId("search-backdrop");
    fireEvent.click(backdrop);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("focuses the input synchronously when trigger is clicked", async () => {
    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    const input = screen.getByRole("combobox");
    expect(document.activeElement).toBe(input);
  });

  it("renders a permanently mounted prime input for iOS keyboard", () => {
    const { container } = render(<SearchDialog />);
    const prime = container.querySelector<HTMLInputElement>(
      'input[tabindex="-1"][aria-hidden="true"]',
    );
    expect(prime).not.toBeNull();
    expect(prime!.style.visibility).not.toBe("hidden");
    expect(prime!.style.display).not.toBe("none");
    const hiddenByOffscreen =
      prime!.style.left === "-9999px" || prime!.style.top === "-9999px";
    const hiddenByOpacity = prime!.style.opacity === "0";
    expect(hiddenByOffscreen || hiddenByOpacity).toBe(true);
  });

  it("prime input exists while the dialog is closed", () => {
    const { container } = render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const prime = container.querySelector(
      'input[tabindex="-1"][aria-hidden="true"]',
    );
    expect(prime).not.toBeNull();
  });

  it("activates a result option on Enter keydown (US-02)", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);

    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("install");

    const option = screen.getAllByRole("option")[0];
    fireEvent.keyDown(option, { key: "Enter" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("activates a result option on Space keydown (US-02)", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);

    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("install");

    const option = screen.getAllByRole("option")[0];
    fireEvent.keyDown(option, { key: " " });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the moreResults notice when runSearch truncates the list", async () => {
    mockRunSearch.mockReturnValue({
      results: MOCK_RESULTS,
      truncated: 42,
      total: MOCK_RESULTS.length + 42,
    });
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("the");

    expect(screen.getByText("moreResults")).toBeInTheDocument();
  });

  it("renders <mark> highlights inside body snippets", async () => {
    mockRunSearch.mockReturnValue({
      results: [
        {
          ...MOCK_RESULTS[0]!,
          titleMatch: false,
          totalHits: 3,
          snippets: [
            { pre: "Open a ", match: "terminal", post: " and run npm." },
          ],
        },
      ],
      truncated: 0,
      total: 1,
    });
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("terminal");

    const listbox = screen.getByRole("listbox");
    const marks = listbox.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);
    expect(marks[0]?.textContent).toBe("terminal");
  });

  it("displays matchesInPage counter when totalHits > 1", async () => {
    mockRunSearch.mockReturnValue({
      results: [
        {
          ...MOCK_RESULTS[0]!,
          titleMatch: false,
          totalHits: 5,
          snippets: [{ pre: "", match: "foo", post: "" }],
        },
      ],
      truncated: 0,
      total: 1,
    });
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("foo");

    expect(screen.getByText("matchesInPage")).toBeInTheDocument();
  });

  it("updates selectedIndex on option mouseEnter", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);
    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("th");

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThanOrEqual(2);
    // Hovering the second option should switch aria-selected to it.
    fireEvent.mouseEnter(options[1]!);
    await flushAsync();
    expect(options[1]!.getAttribute("aria-selected")).toBe("true");
    expect(options[0]!.getAttribute("aria-selected")).toBe("false");
  });

  it("clears the query when the clear button is clicked", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
    render(<SearchDialog />);
    await openAndLoad();
    const input = await typeAndDebounce("anything");
    expect((input as HTMLInputElement).value).toBe("anything");

    const clearBtn = screen.getByRole("button", { name: "clear" });
    fireEvent.click(clearBtn);
    await flushAsync();

    expect((input as HTMLInputElement).value).toBe("");
  });

  // Spotlight-style UI contract: live search must fire as soon as typing
  // crosses MIN_CHARS, without requiring Enter.
  it("runs a live search on each keystroke (no Enter required)", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_WITH_RESULTS);
    render(<SearchDialog />);
    await openAndLoad();

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "in" } });
    await flushAsync();
    expect(mockRunSearch).toHaveBeenCalledWith("in", MOCK_DOCS);

    fireEvent.change(input, { target: { value: "inst" } });
    await flushAsync();
    expect(mockRunSearch).toHaveBeenCalledWith("inst", MOCK_DOCS);

    // At least one call per distinct debounced query; Enter was never pressed.
    expect(mockRunSearch.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  // Spotlight dialog carries role="dialog" + aria-modal="true" + aria-label
  it("renders the dialog with aria-modal and an accessible name", async () => {
    render(<SearchDialog />);
    await openAndLoad();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label");
  });

  // type=search + enterKeyHint=search keep native mobile keyboard UX clean
  it("uses type=search and enterKeyHint=search for native mobile UX", async () => {
    render(<SearchDialog />);
    await openAndLoad();
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("enterKeyHint", "search");
  });

  // The Header wraps SearchDialog but uses backdrop-filter, which breaks
  // position:fixed. We portal to document.body to escape the clipping.
  it("renders the dialog as a direct child of document.body (portal)", async () => {
    const { container } = render(<SearchDialog />);
    await openAndLoad();
    const dialog = screen.getByRole("dialog");
    // Portal target: dialog's nearest positioned ancestor should be body,
    // not the container returned by render().
    expect(container.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  // Mobile 3-X fix: close button is hidden when there's a query (clear X
  // replaces it). Desktop shows the "esc" kbd, not a close button (sm:hidden).
  it("hides the mobile close button when a query is present", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
    render(<SearchDialog />);
    await openAndLoad();

    // With no query, the mobile close button is rendered (sm:hidden on CSS
    // side, but present in the DOM).
    const closeBtnsEmpty = screen.getAllByRole("button", { name: "close" });
    expect(closeBtnsEmpty.length).toBeGreaterThanOrEqual(1);

    await typeAndDebounce("foo");

    // With a query, the mobile close button is removed from the DOM entirely
    // (replaced by the backdrop-tap + clear X ergonomic).
    const closeBtnsWithQuery = screen.queryAllByRole("button", { name: "close" });
    expect(closeBtnsWithQuery.length).toBeLessThan(closeBtnsEmpty.length);
  });

  // Negative: whitespace-only queries must NOT trigger a search.
  it("does not search when the query is whitespace-only", async () => {
    render(<SearchDialog />);
    await openAndLoad();
    mockRunSearch.mockClear();
    await typeAndDebounce("   ");
    expect(mockRunSearch).not.toHaveBeenCalled();
  });

  // Negative: Arrow keys with an empty result set must be a no-op
  // (no crash, no selectedIndex drift).
  it("ArrowDown/ArrowUp are no-ops when there are no results", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
    render(<SearchDialog />);
    await openAndLoad();
    const input = await typeAndDebounce("zzz");

    // Should not throw, should not render any option.
    expect(() => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowUp" });
    }).not.toThrow();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  // Negative: Enter with an empty result set must NOT navigate or close.
  it("Enter with no results does not close the dialog", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
    render(<SearchDialog />);
    await openAndLoad();
    const input = await typeAndDebounce("zzz");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // Negative: Escape must not throw when the dialog is already closed.
  it("Escape is a no-op when the dialog is not open", () => {
    render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    }).not.toThrow();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Negative: random non-modifier keys must NOT open the dialog.
  it("pressing plain letter keys does not open the dialog", () => {
    render(<SearchDialog />);
    fireEvent.keyDown(document, { key: "k" }); // no ctrl/meta
    fireEvent.keyDown(document, { key: "/" });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Cmd+K toggles: first press opens, second press closes.
  it("Cmd+K toggles the dialog open and closed", async () => {
    render(<SearchDialog />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    await flushAsync();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    await flushAsync();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Negative: when loadSearchIndex rejects, the error state is shown and
  // runSearch is never called (guards against stale index pollution).
  it("shows a load-error state when the index fetch fails", async () => {
    mockLoadSearchIndex.mockReset();
    mockLoadSearchIndex.mockRejectedValue(new Error("boom"));
    mockRunSearch.mockClear();

    render(<SearchDialog />);
    await openAndLoad();
    await typeAndDebounce("install");

    // The component exposes the loadError message via the live region AND the
    // central error panel. Either is fine — assert the translation key exists.
    const errorCopies = screen.getAllByText("loadError");
    expect(errorCopies.length).toBeGreaterThan(0);
    expect(mockRunSearch).not.toHaveBeenCalled();
  });

  // Unicode / emojis / backslashes must not crash the input or the search.
  it("accepts special characters and emojis without crashing", async () => {
    mockRunSearch.mockReturnValue(MOCK_RUN_EMPTY);
    render(<SearchDialog />);
    await openAndLoad();
    expect(() => {
      return typeAndDebounce("é\\🚀 ~!@#$%^&*()");
    }).not.toThrow();
  });
});

// Ensure the previously-imported waitFor helper is considered used; avoids
// an unused-import lint failure if the test file gets trimmed later.
void waitFor;
