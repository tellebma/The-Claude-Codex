import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BenchmarkTable } from "@/components/ui/BenchmarkTable";
import { getModel, getScoresForBenchmark } from "@/data/llm-benchmarks";

/**
 * Le mock next-intl de `__tests__/setup.tsx` renvoie la cle de traduction :
 * les assertions portent donc sur les cles, pas sur le texte francais.
 */

function rowLabels(): string[] {
  return screen
    .getAllByRole("row")
    .slice(1) // la premiere ligne est l'en-tete
    .map((row) => within(row).getAllByRole("rowheader")[0].textContent ?? "");
}

describe("BenchmarkTable", () => {
  it("renders a table with a caption defaulting to the benchmark label", () => {
    const { container } = render(<BenchmarkTable benchmarkId="text-arena" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(container.querySelector("caption")?.textContent).toBe("Text Arena");
  });

  it("uses the caption prop when provided", () => {
    const { container } = render(
      <BenchmarkTable benchmarkId="text-arena" caption="Préférence humaine" />,
    );
    expect(container.querySelector("caption")?.textContent).toBe("Préférence humaine");
  });

  it("renders every translated column header with scope=col", () => {
    render(<BenchmarkTable benchmarkId="text-arena" />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.map((header) => header.textContent)).toEqual([
      "columns.model",
      "columns.vendor",
      "columns.license",
      "columns.score",
      "columns.sourceType",
      "columns.source",
      "columns.measuredAt",
    ]);
    for (const header of headers) {
      expect(header.getAttribute("scope")).toBe("col");
    }
  });

  it("renders one row per score, sorted by descending value", () => {
    const expected = getScoresForBenchmark("webdev-arena").map(
      (score) => getModel(score.modelId)?.label ?? score.modelId,
    );
    render(<BenchmarkTable benchmarkId="webdev-arena" />);
    const labels = rowLabels();
    expect(labels.length).toBe(expected.length);
    expect(labels.map((label) => label.split("effort")[0].trim())[0]).toContain(
      expected[0],
    );
    // L'ordre complet doit correspondre au tri decroissant du helper.
    expected.forEach((modelLabel, index) => {
      expect(labels[index]).toContain(modelLabel);
    });
  });

  it("marks each row header with scope=row", () => {
    render(<BenchmarkTable benchmarkId="aa-lcr" />);
    for (const header of screen.getAllByRole("rowheader")) {
      expect(header.getAttribute("scope")).toBe("row");
    }
  });

  it("renders the vendor and the resolved license label", () => {
    render(<BenchmarkTable benchmarkId="webdev-arena" />);
    // Licence proprietaire : cle traduite. Licence nommee : affichee telle quelle.
    expect(screen.getAllByText("license.proprietary").length).toBeGreaterThan(0);
    expect(screen.getByText("Kimi K3 License")).toBeInTheDocument();
    expect(screen.getAllByText("Moonshot AI").length).toBeGreaterThan(0);
  });

  it("shows both source-type badges and the publisher on a mixed benchmark", () => {
    render(<BenchmarkTable benchmarkId="swe-bench-verified" />);
    expect(screen.getAllByText("sourceType.vendorReported").length).toBe(1);
    expect(screen.getAllByText("sourceType.independent").length).toBe(6);
    expect(screen.getAllByText("Anthropic").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SWE-bench").length).toBeGreaterThan(0);
  });

  it("renders a source link per row, opening in a new tab", () => {
    render(<BenchmarkTable benchmarkId="aa-lcr" />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") !== null);
    const sourceLinks = links.filter((link) =>
      link.getAttribute("href")?.includes("artificialanalysis.ai/evaluations"),
    );
    expect(sourceLinks.length).toBeGreaterThanOrEqual(3);
    for (const link of sourceLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getAllByText("artificialanalysis.ai").length).toBeGreaterThan(0);
  });

  it("renders the measure date in a <time> element", () => {
    const { container } = render(<BenchmarkTable benchmarkId="aa-lcr" />);
    const times = Array.from(container.querySelectorAll("time"));
    expect(times.length).toBe(getScoresForBenchmark("aa-lcr").length);
    for (const time of times) {
      expect(time.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("renders the note of a score when present", () => {
    render(<BenchmarkTable benchmarkId="terminal-bench-2-1-aa" />);
    expect(screen.getAllByText(/agent=Terminus 2/).length).toBe(2);
    expect(screen.getByText(/effort=max · mode=adaptive/)).toBeInTheDocument();
  });

  it("appends a percent sign to percent scores only", () => {
    const { container: percentTable } = render(
      <BenchmarkTable benchmarkId="aa-lcr" />,
    );
    expect(percentTable.textContent).toContain("%");

    const { container: eloTable } = render(<BenchmarkTable benchmarkId="text-arena" />);
    const eloCells = Array.from(eloTable.querySelectorAll("td.tabular-nums"));
    expect(eloCells.every((cell) => !cell.textContent?.includes("%"))).toBe(true);
  });

  it("links to the official leaderboard with its maintainer", () => {
    render(<BenchmarkTable benchmarkId="swe-bench-pro" />);
    const leaderboardLink = screen.getByText("leaderboard").closest("a");
    expect(leaderboardLink).toHaveAttribute(
      "href",
      "https://labs.scale.com/leaderboard/swe_bench_pro_public",
    );
    expect(screen.getByText(/maintainer/)).toBeInTheDocument();
  });

  it("renders a fallback message for an unknown benchmark id", () => {
    render(<BenchmarkTable benchmarkId="does-not-exist" />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("empty")).toBeInTheDocument();
  });
});
