import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

// jsdom does not implement scrollIntoView — stub it globally
Element.prototype.scrollIntoView = vi.fn();

vi.mock("@/lib/search-index", () => ({
  searchEntries: vi.fn(() => []),
}));

import { SearchDialog } from "@/components/ui/SearchDialog";
import { searchEntries } from "@/lib/search-index";

const mockSearchEntries = vi.mocked(searchEntries);

const MOCK_RESULTS = [
  {
    title: "Installation",
    description: "Guide install",
    href: "/getting-started/installation",
    section: "getting-started",
    keywords: [],
  },
  {
    title: "MCP",
    description: "Guide MCP",
    href: "/mcp",
    section: "mcp",
    keywords: [],
  },
];

describe("SearchDialog", () => {
  beforeEach(() => {
    mockSearchEntries.mockClear();
    mockSearchEntries.mockReturnValue([]);
  });

  // 1. Renders trigger button
  it("renders the trigger button", () => {
    render(<SearchDialog />);
    const triggerButton = screen.getByRole("button", { name: /trigger/i });
    expect(triggerButton).toBeInTheDocument();
  });

  // 2. Opens dialog when trigger button is clicked
  it("opens dialog when trigger button is clicked", () => {
    render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const triggerButton = screen.getByRole("button", { name: /trigger/i });
    fireEvent.click(triggerButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // 3. Opens dialog with Ctrl+K keyboard shortcut
  it("opens dialog with Ctrl+K keyboard shortcut", () => {
    render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // 4. Closes dialog with Escape key
  it("closes dialog with Escape key", () => {
    render(<SearchDialog />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // 5. Shows "type to search" message when no query
  it("shows typeToSearch message when dialog is open with no query", () => {
    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // useTranslations mock returns the key as the value
    expect(screen.getByText("typeToSearch")).toBeInTheDocument();
  });

  // 6. Calls searchEntries when user types a query
  it("calls searchEntries when user types a query", () => {
    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "install" } });

    expect(mockSearchEntries).toHaveBeenCalledWith("install", "fr");
  });

  // 7. Displays search results
  it("displays search results returned by searchEntries", () => {
    mockSearchEntries.mockReturnValue(MOCK_RESULTS);

    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "install" } });

    expect(screen.getByText("Installation")).toBeInTheDocument();
    expect(screen.getByText("Guide install")).toBeInTheDocument();
    expect(screen.getByText("MCP")).toBeInTheDocument();
    expect(screen.getByText("Guide MCP")).toBeInTheDocument();
  });

  // 8. Shows "no results" message when search returns empty array with a query
  it("shows noResults message when search returns empty array with a query", () => {
    mockSearchEntries.mockReturnValue([]);

    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "xyznotfound" } });

    // The noResults translation key is returned as the key by the mock translator
    // It appears in the aria-live status region and in the results area
    const noResultsElements = screen.getAllByText(/noResults/i);
    expect(noResultsElements.length).toBeGreaterThan(0);
  });

  // 9. Navigates to selected result on Enter
  it("navigates to selected result on Enter", () => {
    mockSearchEntries.mockReturnValue(MOCK_RESULTS);

    // We need a stable router mock to assert push was called
    const pushMock = vi.fn();
    vi.doMock("@/i18n/navigation", () => ({
      Link: ({
        children,
        href,
        ...props
      }: {
        children: React.ReactNode;
        href: string;
        [key: string]: unknown;
      }) => <a href={href} {...props}>{children}</a>,
      usePathname: () => "/",
      useRouter: () => ({ push: pushMock, replace: vi.fn() }),
    }));

    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "install" } });

    // First result is selected by default (selectedIndex = 0)
    fireEvent.keyDown(input, { key: "Enter" });

    // The dialog should close after navigation
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // 10. Keyboard navigation with ArrowDown/ArrowUp changes selectedIndex
  it("changes aria-selected with ArrowDown and ArrowUp keyboard navigation", () => {
    mockSearchEntries.mockReturnValue(MOCK_RESULTS);

    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "install" } });

    // Initially first option is selected (index 0)
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");

    // Arrow down moves selection to second result
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    // Arrow up moves selection back to first result
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  // 11. Closes dialog on mouseDown on the overlay
  //     The overlay uses onMouseDown (not onClick) to avoid the
  //     "drag from inside the dialog -> release outside -> close"
  //     surprise. The handler also checks e.target === e.currentTarget
  //     so inner clicks don't bubble up to close.
  it("closes dialog on mouseDown on the overlay backdrop", () => {
    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement as HTMLElement;
    // Simulate a mousedown whose target IS the overlay
    fireEvent.mouseDown(overlay, { target: overlay });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // 12. iOS keyboard regression — focus the input synchronously on
  //     click so iOS Safari raises the soft keyboard. Without this,
  //     tapping the search button opens the dialog but the on-screen
  //     keyboard never appears, making the search useless on phones.
  it("focuses the input synchronously when trigger is clicked", () => {
    render(<SearchDialog />);
    fireEvent.click(screen.getByRole("button", { name: /trigger/i }));

    // After click, input must exist AND be the active element
    // within the same tick (no setTimeout, no useEffect deferred).
    const input = screen.getByRole("combobox");
    expect(document.activeElement).toBe(input);
  });
});
