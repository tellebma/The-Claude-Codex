import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { PresetCard } from "@/components/configurator/PresetCard";
import { PRESETS } from "@/lib/configurator/presets";
import type { Preset } from "@/lib/configurator/types";

describe("PresetCard", () => {
  const mockOnSelect = vi.fn();
  const samplePreset: Preset = PRESETS[0];

  it("renders the preset name", () => {
    render(<PresetCard preset={samplePreset} onSelect={mockOnSelect} />);
    expect(screen.getByText(samplePreset.name)).toBeInTheDocument();
  });

  it("renders the preset description on sm+ screens", () => {
    render(<PresetCard preset={samplePreset} onSelect={mockOnSelect} />);
    expect(screen.getByText(samplePreset.description)).toBeInTheDocument();
  });

  it("renders first 4 stack badges", () => {
    render(<PresetCard preset={samplePreset} onSelect={mockOnSelect} />);
    const maxDisplayed = Math.min(samplePreset.stacks.length, 4);
    for (let i = 0; i < maxDisplayed; i++) {
      expect(screen.getByText(samplePreset.stacks[i])).toBeInTheDocument();
    }
  });

  it("shows +N badge when preset has more than 4 stacks", () => {
    const manyStackPreset: Preset = {
      ...samplePreset,
      stacks: ["A", "B", "C", "D", "E", "F"],
    };
    render(<PresetCard preset={manyStackPreset} onSelect={mockOnSelect} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show +N badge when preset has 4 or fewer stacks", () => {
    const fewStackPreset: Preset = {
      ...samplePreset,
      stacks: ["A", "B"],
    };
    render(<PresetCard preset={fewStackPreset} onSelect={mockOnSelect} />);
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it("has accessible aria-label", () => {
    render(<PresetCard preset={samplePreset} onSelect={mockOnSelect} />);
    const btn = screen.getByRole("button", {
      name: `Utiliser le preset ${samplePreset.name}`,
    });
    expect(btn).toBeInTheDocument();
  });

  it("calls onSelect with the preset when clicked", () => {
    mockOnSelect.mockClear();
    render(<PresetCard preset={samplePreset} onSelect={mockOnSelect} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(mockOnSelect).toHaveBeenCalledWith(samplePreset);
  });
});
