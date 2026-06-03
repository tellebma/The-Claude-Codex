import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkflowDiagram } from "@/components/mdx/WorkflowDiagram";

describe("WorkflowDiagram", () => {
  it("rend une etape par item passe en steps", () => {
    render(
      <WorkflowDiagram
        steps={[
          { label: "Research" },
          { label: "Plan" },
          { label: "Execute" },
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: "Research" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Execute" })).toBeInTheDocument();
  });

  it("affiche la description sous le label quand fournie", () => {
    render(
      <WorkflowDiagram
        steps={[{ label: "Ship", description: "Deployer en production" }]}
      />
    );
    expect(screen.getByText("Deployer en production")).toBeInTheDocument();
  });

  it("rend la region avec aria-label custom", () => {
    render(
      <WorkflowDiagram
        ariaLabel="Pipeline CI/CD"
        steps={[{ label: "Build" }, { label: "Deploy" }]}
      />
    );
    expect(screen.getByRole("region", { name: "Pipeline CI/CD" })).toBeInTheDocument();
  });

  it("rend l'icone optionnelle decorativement (aria-hidden)", () => {
    const { container } = render(
      <WorkflowDiagram
        steps={[
          {
            label: "Research",
            icon: <svg data-testid="research-icon" aria-hidden="true" />,
          },
        ]}
      />
    );
    // L'icone est dans un wrapper aria-hidden
    const iconWrapper = container.querySelector('[aria-hidden="true"] svg[data-testid="research-icon"]');
    expect(iconWrapper).not.toBeNull();
  });

  it("ne rend rien si steps est vide", () => {
    const { container } = render(<WorkflowDiagram steps={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("dedupe les keys avec le label + index pour eviter les warnings React", () => {
    // 2 etapes avec le meme label : ne doit pas warning sur les keys
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <WorkflowDiagram
        steps={[{ label: "Same" }, { label: "Same" }, { label: "Different" }]}
      />
    );
    const warnedAboutKeys = consoleSpy.mock.calls.some((call) =>
      call.some((arg) => typeof arg === "string" && arg.includes("key"))
    );
    expect(warnedAboutKeys).toBe(false);
    consoleSpy.mockRestore();
  });
});
