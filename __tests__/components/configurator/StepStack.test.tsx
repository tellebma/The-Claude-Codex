import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { StepStack } from "@/components/configurator/StepStack";
import { PROFILES } from "@/lib/configurator/presets";

describe("StepStack", () => {
  const mockOnToggle = vi.fn();
  const frontendProfile = PROFILES.find((p) => p.id === "web-frontend")!;

  it("shows a message when no profile is selected", () => {
    render(
      <StepStack profile={null} selected={[]} onToggle={mockOnToggle} />
    );
    expect(
      screen.getByText(/Veuillez d'abord sélectionner un profil/)
    ).toBeInTheDocument();
  });

  it("renders available stacks for the selected profile", () => {
    render(
      <StepStack
        profile="web-frontend"
        selected={[]}
        onToggle={mockOnToggle}
      />
    );
    for (const stack of frontendProfile.stacks) {
      expect(
        screen.getByRole("button", { name: new RegExp(stack) })
      ).toBeInTheDocument();
    }
  });

  it("marks selected stacks with aria-pressed=true", () => {
    const firstStack = frontendProfile.stacks[0];
    render(
      <StepStack
        profile="web-frontend"
        selected={[firstStack]}
        onToggle={mockOnToggle}
      />
    );
    const btn = screen.getByRole("button", { name: new RegExp(firstStack) });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("marks non-selected stacks with aria-pressed=false", () => {
    render(
      <StepStack
        profile="web-frontend"
        selected={[]}
        onToggle={mockOnToggle}
      />
    );
    const firstStack = frontendProfile.stacks[0];
    const btn = screen.getByRole("button", { name: new RegExp(firstStack) });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onToggle with stack name when clicked", () => {
    mockOnToggle.mockClear();
    const firstStack = frontendProfile.stacks[0];
    render(
      <StepStack
        profile="web-frontend"
        selected={[]}
        onToggle={mockOnToggle}
      />
    );
    const btn = screen.getByRole("button", { name: new RegExp(firstStack) });
    fireEvent.click(btn);
    expect(mockOnToggle).toHaveBeenCalledWith(firstStack);
  });

  it("shows selected count when stacks are selected", () => {
    const stacks = frontendProfile.stacks.slice(0, 2);
    render(
      <StepStack
        profile="web-frontend"
        selected={[...stacks]}
        onToggle={mockOnToggle}
      />
    );
    expect(screen.getByText(/2 stacks sélectionnées/)).toBeInTheDocument();
  });

  it("shows singular form when only one stack is selected", () => {
    render(
      <StepStack
        profile="web-frontend"
        selected={[frontendProfile.stacks[0]]}
        onToggle={mockOnToggle}
      />
    );
    expect(screen.getByText(/1 stack sélectionnée$/)).toBeInTheDocument();
  });

  it("does not show count when no stacks are selected", () => {
    render(
      <StepStack
        profile="web-frontend"
        selected={[]}
        onToggle={mockOnToggle}
      />
    );
    expect(screen.queryByText(/stack.*sélectionnée/)).not.toBeInTheDocument();
  });

  it("uses aria-label with Ajouter for unselected stacks", () => {
    const firstStack = frontendProfile.stacks[0];
    render(
      <StepStack
        profile="web-frontend"
        selected={[]}
        onToggle={mockOnToggle}
      />
    );
    const btn = screen.getByRole("button", {
      name: `Ajouter ${firstStack}`,
    });
    expect(btn).toBeInTheDocument();
  });

  it("uses aria-label with Retirer for selected stacks", () => {
    const firstStack = frontendProfile.stacks[0];
    render(
      <StepStack
        profile="web-frontend"
        selected={[firstStack]}
        onToggle={mockOnToggle}
      />
    );
    const btn = screen.getByRole("button", {
      name: `Retirer ${firstStack}`,
    });
    expect(btn).toBeInTheDocument();
  });
});
