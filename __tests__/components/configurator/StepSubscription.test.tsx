import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { StepSubscription } from "@/components/configurator/StepSubscription";
import { SUBSCRIPTIONS } from "@/lib/configurator/presets";

describe("StepSubscription", () => {
  const mockOnSelect = vi.fn();

  it("renders all subscription options", () => {
    render(<StepSubscription selected={null} onSelect={mockOnSelect} />);
    for (const sub of SUBSCRIPTIONS) {
      expect(screen.getByText(sub.label)).toBeInTheDocument();
      expect(screen.getByText(sub.price)).toBeInTheDocument();
    }
  });

  it("renders subscription descriptions", () => {
    render(<StepSubscription selected={null} onSelect={mockOnSelect} />);
    for (const sub of SUBSCRIPTIONS) {
      expect(screen.getByText(sub.description)).toBeInTheDocument();
    }
  });

  it("renders subscription features as list items", () => {
    render(<StepSubscription selected={null} onSelect={mockOnSelect} />);
    for (const sub of SUBSCRIPTIONS) {
      for (const feature of sub.features) {
        // Some feature strings may appear in multiple subscriptions
        const matches = screen.getAllByText(feature);
        expect(matches.length).toBeGreaterThan(0);
      }
    }
  });

  it("marks selected subscription with aria-pressed=true", () => {
    render(<StepSubscription selected="pro" onSelect={mockOnSelect} />);
    const proSub = SUBSCRIPTIONS.find((s) => s.id === "pro")!;
    const btn = screen.getByRole("button", {
      name: new RegExp(`Sélectionner l'abonnement ${proSub.label}`),
    });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("shows recommended badge on the default recommended subscription (pro)", () => {
    render(<StepSubscription selected={null} onSelect={mockOnSelect} />);
    expect(screen.getByText("Recommandé")).toBeInTheDocument();
  });

  it("shows recommended badge on custom recommended subscription", () => {
    render(
      <StepSubscription
        selected={null}
        recommended="max-100"
        onSelect={mockOnSelect}
      />
    );
    // The recommended badge should still appear
    expect(screen.getByText("Recommandé")).toBeInTheDocument();
  });

  it("calls onSelect with subscription id when clicked", () => {
    mockOnSelect.mockClear();
    render(<StepSubscription selected={null} onSelect={mockOnSelect} />);
    const firstSub = SUBSCRIPTIONS[0];
    const btn = screen.getByRole("button", {
      name: new RegExp(`Sélectionner l'abonnement ${firstSub.label}`),
    });
    fireEvent.click(btn);
    expect(mockOnSelect).toHaveBeenCalledWith(firstSub.id);
  });

  it("applies selected styles to the chosen subscription", () => {
    render(<StepSubscription selected="pro" onSelect={mockOnSelect} />);
    const proSub = SUBSCRIPTIONS.find((s) => s.id === "pro")!;
    const btn = screen.getByRole("button", {
      name: new RegExp(`Sélectionner l'abonnement ${proSub.label}`),
    });
    expect(btn.className).toContain("border-brand-500");
  });
});
