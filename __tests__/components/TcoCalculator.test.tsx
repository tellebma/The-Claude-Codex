import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TcoCalculator } from "@/components/ui/TcoCalculator";

describe("TcoCalculator", () => {
  // ──────────────────────────────────────────
  // Section rendering
  // ──────────────────────────────────────────

  it("renders the team parameters section", () => {
    render(<TcoCalculator />);
    expect(
      screen.getByText("Parametres de votre equipe")
    ).toBeInTheDocument();
  });

  it("renders the estimated costs section", () => {
    render(<TcoCalculator />);
    expect(screen.getByText("Couts estimes")).toBeInTheDocument();
  });

  it("renders the ROI estimation section", () => {
    render(<TcoCalculator />);
    expect(screen.getByText("Estimation du ROI")).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Default cost calculations (10 devs × $100 = $1 000/month)
  // ──────────────────────────────────────────

  it("shows default monthly cost label", () => {
    render(<TcoCalculator />);
    expect(screen.getByText("Cout mensuel")).toBeInTheDocument();
  });

  it("shows default monthly cost value ($1 000)", () => {
    render(<TcoCalculator />);
    // toLocaleString("fr-FR") may produce non-breaking space; use regex
    expect(
      screen.getAllByText(/\$1.?000/).length
    ).toBeGreaterThan(0);
  });

  it("shows default annual cost value ($12 000)", () => {
    render(<TcoCalculator />);
    expect(screen.getByText(/\$12.?000/)).toBeInTheDocument();
  });

  it("shows default cost per dev ($100)", () => {
    render(<TcoCalculator />);
    // The cost-per-dev card and the competitor row both show $100
    const matches = screen.getAllByText(/\$100/);
    expect(matches.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────
  // Plan change: switching to API plan
  // ──────────────────────────────────────────

  it("updates monthly cost when switching to API plan (10 × $40 = $400)", () => {
    render(<TcoCalculator />);
    // The API plan label contains "API Team"
    const apiRadio = screen.getByRole("radio", { name: /API Team/i });
    fireEvent.click(apiRadio);

    // Multiple $400 elements exist (cost card + competitor row + Claude row)
    expect(screen.getAllByText(/\$400/).length).toBeGreaterThan(0);
  });

  it("updates annual cost when switching to API plan (10 × $40 × 12 = $4 800)", () => {
    render(<TcoCalculator />);
    const apiRadio = screen.getByRole("radio", { name: /API Team/i });
    fireEvent.click(apiRadio);

    expect(screen.getByText(/\$4.?800/)).toBeInTheDocument();
  });

  it("updates cost per dev when switching to Max 20x plan ($200)", () => {
    render(<TcoCalculator />);
    const max20Radio = screen.getByRole("radio", { name: /Max 20x/i });
    fireEvent.click(max20Radio);

    // Cost per dev = $200
    const matches = screen.getAllByText(/\$200/);
    expect(matches.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────
  // Dev count input
  // ──────────────────────────────────────────

  it("renders the dev count input with default value 10", () => {
    render(<TcoCalculator />);
    const input = screen.getByLabelText(/Nombre de developpeurs/i);
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("10");
  });

  it("updates costs when dev count changes to 5 (5 × $100 = $500/month)", () => {
    render(<TcoCalculator />);
    const input = screen.getByLabelText(/Nombre de developpeurs/i);
    fireEvent.change(input, { target: { value: "5" } });

    // Monthly cost card + Claude comparison row both show $500
    expect(screen.getAllByText(/\$500/).length).toBeGreaterThan(0);
  });

  it("updates annual cost when dev count changes to 5 (5 × $100 × 12 = $6 000)", () => {
    render(<TcoCalculator />);
    const input = screen.getByLabelText(/Nombre de developpeurs/i);
    fireEvent.change(input, { target: { value: "5" } });

    expect(screen.getByText(/\$6.?000/)).toBeInTheDocument();
  });

  it("ignores dev count values outside the valid range (1–1000)", () => {
    render(<TcoCalculator />);
    const input = screen.getByLabelText(/Nombre de developpeurs/i);

    // Value below min should not change state
    fireEvent.change(input, { target: { value: "0" } });
    expect((input as HTMLInputElement).value).toBe("10");

    // Value above max should not change state
    fireEvent.change(input, { target: { value: "1001" } });
    expect((input as HTMLInputElement).value).toBe("10");
  });

  // ──────────────────────────────────────────
  // Competitor comparison
  // ──────────────────────────────────────────

  it("shows GitHub Copilot Enterprise in the competitor comparison", () => {
    render(<TcoCalculator />);
    expect(screen.getByText(/GitHub Copilot Enterprise/)).toBeInTheDocument();
  });

  it("shows Cursor Business in the competitor comparison", () => {
    render(<TcoCalculator />);
    expect(screen.getByText(/Cursor Business/)).toBeInTheDocument();
  });

  it("shows correct competitor monthly cost for Copilot (10 × $39 = $390)", () => {
    render(<TcoCalculator />);
    expect(screen.getByText(/\$390/)).toBeInTheDocument();
  });

  it("shows correct competitor monthly cost for Cursor (10 × $40 = $400)", () => {
    render(<TcoCalculator />);
    // With default max5x plan the Claude cost is $1 000; Cursor is $400
    const matches = screen.getAllByText(/\$400/);
    expect(matches.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────
  // Radio buttons for plan selection
  // ──────────────────────────────────────────

  it("renders three plan radio buttons", () => {
    render(<TcoCalculator />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });

  it("has the max5x plan selected by default", () => {
    render(<TcoCalculator />);
    const max5Radio = screen.getByRole("radio", { name: /Max 5x/i });
    expect((max5Radio as HTMLInputElement).checked).toBe(true);
  });

  it("selects a radio button when clicked", () => {
    render(<TcoCalculator />);
    const max20Radio = screen.getByRole("radio", { name: /Max 20x/i });
    expect((max20Radio as HTMLInputElement).checked).toBe(false);

    fireEvent.click(max20Radio);
    expect((max20Radio as HTMLInputElement).checked).toBe(true);
  });

  // ──────────────────────────────────────────
  // ROI section
  // ──────────────────────────────────────────

  it("shows ROI gain labels", () => {
    render(<TcoCalculator />);
    expect(screen.getByText("Gain mensuel/dev")).toBeInTheDocument();
    expect(screen.getByText("Gain mensuel total")).toBeInTheDocument();
    expect(screen.getByText("Gain annuel total")).toBeInTheDocument();
  });

  it("shows ROI multiplier with 'x' suffix", () => {
    render(<TcoCalculator />);
    // ROI value ends with "x", e.g. "12.8x"
    expect(screen.getByText(/\d+\.\d+x/)).toBeInTheDocument();
  });

  it("shows the ROI descriptor label", () => {
    render(<TcoCalculator />);
    expect(screen.getByText("ROI")).toBeInTheDocument();
  });

  it("shows the cost multiplier description", () => {
    render(<TcoCalculator />);
    expect(screen.getByText(/le cout de l/i)).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Salary input
  // ──────────────────────────────────────────

  it("renders the annual salary input with correct label", () => {
    render(<TcoCalculator />);
    const salaryInput = screen.getByLabelText(/Salaire annuel brut/i);
    expect(salaryInput).toBeInTheDocument();
  });

  it("renders the salary input with default value 80000", () => {
    render(<TcoCalculator />);
    const salaryInput = screen.getByLabelText(/Salaire annuel brut/i);
    expect((salaryInput as HTMLInputElement).value).toBe("80000");
  });

  it("ignores salary values outside the valid range (20000–300000)", () => {
    render(<TcoCalculator />);
    const salaryInput = screen.getByLabelText(/Salaire annuel brut/i);

    fireEvent.change(salaryInput, { target: { value: "1000" } });
    expect((salaryInput as HTMLInputElement).value).toBe("80000");

    fireEvent.change(salaryInput, { target: { value: "500000" } });
    expect((salaryInput as HTMLInputElement).value).toBe("80000");
  });

  it("updates ROI when salary changes", () => {
    render(<TcoCalculator />);
    const salaryInput = screen.getByLabelText(/Salaire annuel brut/i);

    // Capture current ROI multiplier
    const roiBefore = screen.getByText(/\d+\.\d+x/).textContent;

    // Double the salary → ROI should increase
    fireEvent.change(salaryInput, { target: { value: "160000" } });
    const roiAfter = screen.getByText(/\d+\.\d+x/).textContent;

    expect(roiAfter).not.toBe(roiBefore);
  });

  // ──────────────────────────────────────────
  // Hours slider
  // ──────────────────────────────────────────

  it("renders the hours-gained slider with correct label", () => {
    render(<TcoCalculator />);
    const slider = screen.getByLabelText(/Heures gagnees par semaine/i);
    expect(slider).toBeInTheDocument();
    expect((slider as HTMLInputElement).type).toBe("range");
  });

  it("renders the slider with default value 7", () => {
    render(<TcoCalculator />);
    const slider = screen.getByLabelText(/Heures gagnees par semaine/i);
    expect((slider as HTMLInputElement).value).toBe("7");
  });

  it("shows the default hours value label (7h/semaine)", () => {
    render(<TcoCalculator />);
    expect(screen.getByText("7h/semaine")).toBeInTheDocument();
  });

  it("updates displayed hours when slider changes", () => {
    render(<TcoCalculator />);
    const slider = screen.getByLabelText(/Heures gagnees par semaine/i);
    fireEvent.change(slider, { target: { value: "10" } });

    expect(screen.getByText("10h/semaine")).toBeInTheDocument();
  });

  it("slider has correct min (1) and max (20) attributes", () => {
    render(<TcoCalculator />);
    const slider = screen.getByLabelText(/Heures gagnees par semaine/i);
    expect((slider as HTMLInputElement).min).toBe("1");
    expect((slider as HTMLInputElement).max).toBe("20");
  });

  // ──────────────────────────────────────────
  // Accessible labels on form inputs
  // ──────────────────────────────────────────

  it("has an accessible label on the dev count input", () => {
    render(<TcoCalculator />);
    expect(
      screen.getByLabelText(/Nombre de developpeurs/i)
    ).toBeInTheDocument();
  });

  it("has an accessible label on the salary input", () => {
    render(<TcoCalculator />);
    expect(
      screen.getByLabelText(/Salaire annuel brut/i)
    ).toBeInTheDocument();
  });

  it("has an accessible label on the hours slider", () => {
    render(<TcoCalculator />);
    expect(
      screen.getByLabelText(/Heures gagnees par semaine/i)
    ).toBeInTheDocument();
  });

  it("has a fieldset legend for the plan selector", () => {
    render(<TcoCalculator />);
    // The legend text is used as the fieldset group label
    expect(screen.getByText("Plan Claude Code")).toBeInTheDocument();
  });
});
