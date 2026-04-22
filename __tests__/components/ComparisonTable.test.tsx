import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ComparisonTable } from "@/components/ui/ComparisonTable";

const COLUMNS = [
  { key: "a", label: "Option A", recommended: true },
  { key: "b", label: "Option B" },
];

const ROWS = [
  { feature: "Fast", values: { a: "yes", b: "no" } },
  { feature: "Free", values: { a: "partial", b: "yes" } },
  { feature: "Custom value", values: { a: "10 MB", b: "20 MB" } },
  { feature: "Missing value", values: { a: "yes" } },
];

describe("ComparisonTable", () => {
  it("renders the column labels in the header row", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("marks the recommended column with a badge", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("rec.")).toBeInTheDocument();
  });

  it("renders each feature as a row header", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("Fast")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Custom value")).toBeInTheDocument();
  });

  it("renders icon cells with proper aria-labels for yes/no/partial", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    const yesCells = screen.getAllByLabelText("Oui");
    const noCells = screen.getAllByLabelText("Non");
    const partialCells = screen.getAllByLabelText("Partiel");
    expect(yesCells.length).toBeGreaterThan(0);
    expect(noCells.length).toBeGreaterThan(0);
    expect(partialCells.length).toBeGreaterThan(0);
  });

  it("renders raw text for non-standard values", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("10 MB")).toBeInTheDocument();
    expect(screen.getByText("20 MB")).toBeInTheDocument();
  });

  it("handles missing values by rendering nothing for that cell", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    const missingRow = screen.getByText("Missing value").closest("tr");
    expect(missingRow).not.toBeNull();
    // Row has the feature header and two value cells even if one is missing.
    const cells = within(missingRow as HTMLElement).getAllByRole("cell");
    expect(cells.length).toBe(COLUMNS.length);
  });

  it("renders the caption when provided", () => {
    render(
      <ComparisonTable
        columns={COLUMNS}
        rows={ROWS}
        caption="Comparaison des options"
      />
    );
    expect(screen.getByText("Comparaison des options")).toBeInTheDocument();
  });

  it("does not render a caption element when none is provided", () => {
    const { container } = render(
      <ComparisonTable columns={COLUMNS} rows={ROWS} />
    );
    expect(container.querySelector("caption")).toBeNull();
  });

  it("exposes a real <table> element for screen readers", () => {
    render(<ComparisonTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders one tbody row per input row", () => {
    const { container } = render(
      <ComparisonTable columns={COLUMNS} rows={ROWS} />
    );
    const bodyRows = container.querySelectorAll("tbody tr");
    expect(bodyRows.length).toBe(ROWS.length);
  });
});
