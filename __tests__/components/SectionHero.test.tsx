import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Shield } from "lucide-react";
import { SectionHero } from "@/components/layout/SectionHero";

const baseProps = {
  category: "Articles",
  title: "Contenus editoriaux",
  lead: "Une introduction de section.",
} as const;

describe("SectionHero", () => {
  it("renders the category pill and an h1 title", () => {
    const { container } = render(<SectionHero {...baseProps} />);
    expect(container.querySelector(".sec-cat-pill")).not.toBeNull();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Contenus editoriaux",
    );
  });

  it("renders the lead paragraph", () => {
    render(<SectionHero {...baseProps} />);
    expect(
      screen.getByText("Une introduction de section."),
    ).toBeInTheDocument();
  });

  it("renders a gradient highlight on a new line by default", () => {
    const { container } = render(
      <SectionHero {...baseProps} titleHighlight="pour comprendre Claude Code" />,
    );
    expect(container.querySelector(".sec-title-hl")).not.toBeNull();
    expect(container.querySelector("h1 br")).not.toBeNull();
    expect(
      screen.getByText("pour comprendre Claude Code"),
    ).toBeInTheDocument();
  });

  it("keeps the highlight inline when highlightInline is true", () => {
    const { container } = render(
      <SectionHero
        {...baseProps}
        titleHighlight="inline part"
        highlightInline
      />,
    );
    expect(container.querySelector(".sec-title-hl")).not.toBeNull();
    expect(container.querySelector("h1 br")).toBeNull();
  });

  it("defaults to the dark tone and switches to soft on demand", () => {
    const { container, rerender } = render(<SectionHero {...baseProps} />);
    expect(
      container.querySelector(".sec-hero")?.getAttribute("data-tone"),
    ).toBe("dark");
    rerender(<SectionHero {...baseProps} tone="soft" />);
    expect(
      container.querySelector(".sec-hero")?.getAttribute("data-tone"),
    ).toBe("soft");
  });

  it("renders the count pill only when count is provided", () => {
    const { container, rerender } = render(<SectionHero {...baseProps} />);
    expect(container.querySelector(".sec-count")).toBeNull();
    rerender(<SectionHero {...baseProps} count="16 guides" />);
    expect(container.querySelector(".sec-count")).not.toBeNull();
    expect(screen.getByText("16 guides")).toBeInTheDocument();
  });

  it("renders the actions slot when provided", () => {
    render(
      <SectionHero
        {...baseProps}
        actions={<button type="button">Filtrer</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Filtrer" }),
    ).toBeInTheDocument();
  });

  it("renders a custom category icon", () => {
    const { container } = render(
      <SectionHero {...baseProps} categoryIcon={Shield} />,
    );
    expect(container.querySelector(".sec-cat-pill svg")).not.toBeNull();
  });
});
