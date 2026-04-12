import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { StepFeatures } from "@/components/configurator/StepFeatures";
import { FEATURES } from "@/lib/configurator/presets";

describe("StepFeatures", () => {
  const mockOnToggle = vi.fn();

  it("renders all features", () => {
    render(
      <StepFeatures
        selected={[]}
        subscription="pro"
        onToggle={mockOnToggle}
      />
    );
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.label)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }
  });

  it("marks selected features with aria-pressed=true", () => {
    render(
      <StepFeatures
        selected={["mcp"]}
        subscription="pro"
        onToggle={mockOnToggle}
      />
    );
    const mcpFeature = FEATURES.find((f) => f.id === "mcp")!;
    const btn = screen.getByLabelText(`Désactiver ${mcpFeature.label}`);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("marks non-selected features with aria-pressed=false", () => {
    render(
      <StepFeatures
        selected={[]}
        subscription="pro"
        onToggle={mockOnToggle}
      />
    );
    const mcpFeature = FEATURES.find((f) => f.id === "mcp")!;
    const btn = screen.getByLabelText(`Activer ${mcpFeature.label}`);
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onToggle when an unlocked feature is clicked", () => {
    mockOnToggle.mockClear();
    render(
      <StepFeatures
        selected={[]}
        subscription="pro"
        onToggle={mockOnToggle}
      />
    );
    const mcpFeature = FEATURES.find((f) => f.id === "mcp")!;
    const btn = screen.getByLabelText(`Activer ${mcpFeature.label}`);
    fireEvent.click(btn);
    expect(mockOnToggle).toHaveBeenCalledWith("mcp");
  });

  it("disables features that require a higher subscription", () => {
    // With free subscription, features that require pro+ should be locked
    const lockedFeatures = FEATURES.filter(
      (f) => f.requiresSubscription && f.requiresSubscription !== "free"
    );
    if (lockedFeatures.length === 0) return; // Skip if no locked features

    render(
      <StepFeatures
        selected={[]}
        subscription="free"
        onToggle={mockOnToggle}
      />
    );

    for (const feature of lockedFeatures) {
      const btn = screen.getByLabelText(`Activer ${feature.label}`);
      expect(btn).toBeDisabled();
    }
  });

  it("does not call onToggle for locked features", () => {
    mockOnToggle.mockClear();
    const lockedFeatures = FEATURES.filter(
      (f) => f.requiresSubscription && f.requiresSubscription !== "free"
    );
    if (lockedFeatures.length === 0) return;

    render(
      <StepFeatures
        selected={[]}
        subscription="free"
        onToggle={mockOnToggle}
      />
    );

    const lockedFeature = lockedFeatures[0];
    const btn = screen.getByLabelText(`Activer ${lockedFeature.label}`);
    fireEvent.click(btn);
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it("shows lock icon and required subscription label for locked features", () => {
    const lockedFeatures = FEATURES.filter(
      (f) => f.requiresSubscription && f.requiresSubscription !== "free"
    );
    if (lockedFeatures.length === 0) return;

    render(
      <StepFeatures
        selected={[]}
        subscription="free"
        onToggle={mockOnToggle}
      />
    );

    // Locked features should show "Nécessite ..." text
    const necessite = screen.queryAllByText(/Nécessite/);
    expect(necessite.length).toBeGreaterThan(0);
  });

  it("unlocks all features for API subscription", () => {
    render(
      <StepFeatures
        selected={[]}
        subscription="api"
        onToggle={mockOnToggle}
      />
    );

    // All features should be enabled
    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).not.toBeDisabled();
    }
  });
});
