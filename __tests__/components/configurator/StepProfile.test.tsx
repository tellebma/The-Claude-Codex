import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { StepProfile } from "@/components/configurator/StepProfile";
import { PROFILES } from "@/lib/configurator/presets";
import type { Profile } from "@/lib/configurator/types";

describe("StepProfile", () => {
  const mockOnSelect = vi.fn();

  it("renders all profiles from PROFILES", () => {
    render(<StepProfile selected={null} onSelect={mockOnSelect} />);
    for (const profile of PROFILES) {
      expect(
        screen.getByRole("button", {
          name: `Sélectionner le profil ${profile.label}`,
        })
      ).toBeInTheDocument();
    }
  });

  it("renders profile labels and descriptions", () => {
    render(<StepProfile selected={null} onSelect={mockOnSelect} />);
    for (const profile of PROFILES) {
      expect(screen.getByText(profile.label)).toBeInTheDocument();
      expect(screen.getByText(profile.description)).toBeInTheDocument();
    }
  });

  it("marks selected profile with aria-pressed=true", () => {
    render(
      <StepProfile selected="web-frontend" onSelect={mockOnSelect} />
    );
    const selectedBtn = screen.getByRole("button", {
      name: `Sélectionner le profil ${PROFILES.find((p) => p.id === "web-frontend")!.label}`,
    });
    expect(selectedBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("marks non-selected profiles with aria-pressed=false", () => {
    render(
      <StepProfile selected="web-frontend" onSelect={mockOnSelect} />
    );
    const backendProfile = PROFILES.find((p) => p.id === "web-backend")!;
    const btn = screen.getByRole("button", {
      name: `Sélectionner le profil ${backendProfile.label}`,
    });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect with profile id when clicked", () => {
    mockOnSelect.mockClear();
    render(<StepProfile selected={null} onSelect={mockOnSelect} />);
    const firstProfile = PROFILES[0];
    const btn = screen.getByRole("button", {
      name: `Sélectionner le profil ${firstProfile.label}`,
    });
    fireEvent.click(btn);
    expect(mockOnSelect).toHaveBeenCalledWith(firstProfile.id);
  });

  it("shows visual indicator for selected profile", () => {
    const { container } = render(
      <StepProfile selected="web-frontend" onSelect={mockOnSelect} />
    );
    // Selected profile should have the brand border
    const selectedButtons = container.querySelectorAll("[aria-pressed='true']");
    expect(selectedButtons.length).toBe(1);
    expect(selectedButtons[0].className).toContain("border-brand-500");
  });
});
