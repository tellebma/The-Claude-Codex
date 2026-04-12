import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

vi.mock("@/data/glossary", () => ({
  glossaryTerms: [
    {
      term: "Terminal",
      definition: "Interface en mode texte",
      analogy: "Comme parler a votre ordinateur par ecrit",
      link: "/getting-started/prerequisites-zero",
    },
    {
      term: "CLI",
      definition: "Command-Line Interface",
      analogy: "Le volant vs les pedales",
    },
  ],
}));

import { GlossaryTooltip } from "@/components/ui/GlossaryTooltip";

describe("GlossaryTooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a plain span when the term is not found in glossary", () => {
    render(<GlossaryTooltip term="UnknownTerm" />);
    expect(screen.getByText("UnknownTerm")).toBeInTheDocument();
    expect(screen.getByText("UnknownTerm").tagName.toLowerCase()).toBe("span");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders a button with term text when term is found", () => {
    render(<GlossaryTooltip term="Terminal" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Terminal");
  });

  it("shows tooltip on mouse enter with definition and analogy", () => {
    render(<GlossaryTooltip term="Terminal" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Terminal");
    expect(tooltip).toHaveTextContent("Interface en mode texte");
    expect(tooltip).toHaveTextContent("Comme parler a votre ordinateur par ecrit");
  });

  it("hides tooltip on mouse leave after 250ms delay", () => {
    render(<GlossaryTooltip term="Terminal" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.mouseLeave(button);

    // Tooltip still visible before delay elapses
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("toggles tooltip on click", () => {
    render(<GlossaryTooltip term="Terminal" />);
    const button = screen.getByRole("button");

    // Open
    fireEvent.click(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Close
    fireEvent.click(button);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("closes tooltip with Escape key", () => {
    render(<GlossaryTooltip term="Terminal" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("renders children instead of term text when children are provided", () => {
    render(
      <GlossaryTooltip term="Terminal">
        <strong>le terminal</strong>
      </GlossaryTooltip>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("le terminal");
    expect(button.querySelector("strong")).toBeInTheDocument();
  });

  it("shows a learn more link when the glossary entry has a link", () => {
    render(<GlossaryTooltip term="Terminal" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);

    const tooltip = screen.getByRole("tooltip");
    const link = tooltip.querySelector("a");
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("href", "/getting-started/prerequisites-zero");
  });

  it("does not show a learn more link when the entry has no link", () => {
    render(<GlossaryTooltip term="CLI" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Command-Line Interface");
    const link = tooltip.querySelector("a");
    expect(link).toBeNull();
  });
});
