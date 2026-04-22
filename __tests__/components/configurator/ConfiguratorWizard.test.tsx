import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ConfiguratorWizard } from "@/components/configurator/ConfiguratorWizard";
import { PROFILES, PRESETS } from "@/lib/configurator/presets";

// Mock prism-react-renderer used by ConfigPreview
vi.mock("prism-react-renderer", () => ({
  Highlight: ({
    children,
    code,
  }: {
    children: (props: {
      className: string;
      style: Record<string, string>;
      tokens: Array<Array<{ content: string; types: string[] }>>;
      getLineProps: (opts: {
        line: Array<{ content: string; types: string[] }>;
      }) => Record<string, unknown>;
      getTokenProps: (opts: {
        token: { content: string; types: string[] };
      }) => Record<string, unknown>;
    }) => React.ReactNode;
    code: string;
    language: string;
    theme: unknown;
  }) => {
    const lines = code.split("\n").map((line) => [
      { content: line, types: ["plain"] },
    ]);
    return children({
      className: "prism-code",
      style: {},
      tokens: lines,
      getLineProps: () => ({}),
      getTokenProps: ({ token }: { token: { content: string } }) => ({
        children: token.content,
      }),
    });
  },
  themes: { nightOwl: {} },
}));

describe("ConfiguratorWizard", () => {
  it("renders presets section", () => {
    render(<ConfiguratorWizard />);
    expect(screen.getByText("Presets rapides")).toBeInTheDocument();
  });

  it("renders all preset cards", () => {
    render(<ConfiguratorWizard />);
    for (const preset of PRESETS) {
      // Some preset names may appear in multiple locations (e.g. name + description)
      const matches = screen.getAllByText(preset.name);
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("renders the step-by-step wizard", () => {
    render(<ConfiguratorWizard />);
    expect(screen.getByText("Configurateur pas à pas")).toBeInTheDocument();
  });

  it("starts on step 1 (Profile)", () => {
    render(<ConfiguratorWizard />);
    expect(screen.getByText("Choisissez votre profil")).toBeInTheDocument();
  });

  it("renders stepper navigation with 4 steps", () => {
    render(<ConfiguratorWizard />);
    const nav = screen.getByRole("navigation", { name: /Progression/ });
    expect(nav).toBeInTheDocument();
    // Should have step buttons for 1-4
    expect(screen.getByLabelText(/Aller à l'étape 1/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aller à l'étape 2/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aller à l'étape 3/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aller à l'étape 4/)).toBeInTheDocument();
  });

  it("disables Next button when no profile is selected", () => {
    render(<ConfiguratorWizard />);
    const nextButton = screen.getByLabelText("Passer à l'étape suivante");
    expect(nextButton).toBeDisabled();
  });

  it("enables Next button after selecting a profile", () => {
    render(<ConfiguratorWizard />);
    const firstProfile = PROFILES[0];
    const profileBtn = screen.getByLabelText(`Sélectionner le profil ${firstProfile.label}`);
    fireEvent.click(profileBtn);

    const nextButton = screen.getByLabelText("Passer à l'étape suivante");
    expect(nextButton).not.toBeDisabled();
  });

  it("navigates to step 2 after selecting profile and clicking Next", () => {
    render(<ConfiguratorWizard />);
    const firstProfile = PROFILES[0];
    const profileBtn = screen.getByLabelText(`Sélectionner le profil ${firstProfile.label}`);
    fireEvent.click(profileBtn);

    const nextButton = screen.getByLabelText("Passer à l'étape suivante");
    fireEvent.click(nextButton);

    expect(screen.getByText("Choisissez vos stacks")).toBeInTheDocument();
  });

  it("navigates back with Previous button", () => {
    render(<ConfiguratorWizard />);
    // Select profile and go to step 2
    const firstProfile = PROFILES[0];
    fireEvent.click(screen.getByLabelText(`Sélectionner le profil ${firstProfile.label}`));
    fireEvent.click(screen.getByLabelText("Passer à l'étape suivante"));

    // Click Previous
    fireEvent.click(screen.getByLabelText("Étape précédente"));
    expect(screen.getByText("Choisissez votre profil")).toBeInTheDocument();
  });

  it("Previous button is disabled on step 1", () => {
    render(<ConfiguratorWizard />);
    const prevButton = screen.getByLabelText("Étape précédente");
    expect(prevButton).toBeDisabled();
  });

  it("renders progress bar", () => {
    render(<ConfiguratorWizard />);
    // Native <progress> : value = step - 1 (0-indexed), max = 3 (4 étapes - 1)
    const progressBar = screen.getByRole("progressbar") as HTMLProgressElement;
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.value).toBe(0);
    expect(progressBar.max).toBe(3);
  });

  it("applies a preset and shows preview", () => {
    // Mock scrollIntoView since jsdom doesn't implement it
    Element.prototype.scrollIntoView = vi.fn();

    render(<ConfiguratorWizard />);
    const firstPreset = PRESETS[0];
    const presetBtn = screen.getByLabelText(`Utiliser le preset ${firstPreset.name}`);
    fireEvent.click(presetBtn);

    // After preset selection, the config preview should appear
    expect(screen.getByText("Aperçu en temps réel")).toBeInTheDocument();
  });

  it("shows reset button after configuration starts", () => {
    render(<ConfiguratorWizard />);
    const firstProfile = PROFILES[0];
    fireEvent.click(screen.getByLabelText(`Sélectionner le profil ${firstProfile.label}`));

    const resetBtn = screen.getByLabelText("Réinitialiser la configuration");
    expect(resetBtn).toBeInTheDocument();
  });

  it("resets wizard when Reset button is clicked", () => {
    render(<ConfiguratorWizard />);
    const firstProfile = PROFILES[0];
    fireEvent.click(screen.getByLabelText(`Sélectionner le profil ${firstProfile.label}`));
    fireEvent.click(screen.getByLabelText("Passer à l'étape suivante"));

    // Reset
    fireEvent.click(screen.getByLabelText("Réinitialiser la configuration"));

    // Should be back to step 1 with empty state
    expect(screen.getByText("Choisissez votre profil")).toBeInTheDocument();
    // Next should be disabled again
    const nextButton = screen.getByLabelText("Passer à l'étape suivante");
    expect(nextButton).toBeDisabled();
  });

  it("does not allow skipping to step 3 without completing step 2", () => {
    render(<ConfiguratorWizard />);
    const firstProfile = PROFILES[0];
    fireEvent.click(screen.getByLabelText(`Sélectionner le profil ${firstProfile.label}`));

    // Step 3 should be disabled since step 2 (stacks) isn't complete
    const step3Btn = screen.getByLabelText(/Aller à l'étape 3/);
    expect(step3Btn).toBeDisabled();
  });

  it("shows Generate button on step 4", () => {
    Element.prototype.scrollIntoView = vi.fn();

    render(<ConfiguratorWizard />);
    // Use a preset to jump to fully configured state
    const firstPreset = PRESETS[0];
    fireEvent.click(screen.getByLabelText(`Utiliser le preset ${firstPreset.name}`));

    // Navigate to step 4
    const step4Btn = screen.getByLabelText(/Aller à l'étape 4/);
    fireEvent.click(step4Btn);

    expect(screen.getByText("Activez les features")).toBeInTheDocument();
    expect(screen.getByLabelText("Générer la configuration")).toBeInTheDocument();
  });
});
