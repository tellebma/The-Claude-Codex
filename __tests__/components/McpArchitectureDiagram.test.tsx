import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// AnimatedBeam uses framer-motion + SVG animations that aren't
// meaningful at unit-test level; stubbing it gives a clean smoke test
// of the MCP architecture node layout.
vi.mock("@/components/ui/AnimatedBeam", () => ({
  AnimatedBeam: ({
    direction,
    color,
  }: {
    direction: string;
    color: string;
  }) => (
    <div
      data-testid="animated-beam"
      data-direction={direction}
      data-color={color}
    />
  ),
}));

import { McpArchitectureDiagram } from "@/components/ui/McpArchitectureDiagram";

describe("McpArchitectureDiagram", () => {
  it("renders the 4 architecture nodes (Vous → Claude Code → MCP → Service)", () => {
    render(<McpArchitectureDiagram />);
    expect(screen.getByText("Vous")).toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
    expect(screen.getByText("MCP Server")).toBeInTheDocument();
    expect(screen.getByText("Service externe")).toBeInTheDocument();
  });

  it("renders a description under each node", () => {
    render(<McpArchitectureDiagram />);
    expect(
      screen.getByText(/Montre-moi les issues GitHub ouvertes/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Comprend votre demande/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Traduit la requête/)).toBeInTheDocument();
    expect(screen.getByText(/GitHub, Slack, Gmail/)).toBeInTheDocument();
  });

  it("renders exactly 3 beams between the 4 nodes (desktop + mobile duplicates)", () => {
    render(<McpArchitectureDiagram />);
    // 3 transitions × 2 orientations (hidden with sm:block) = 6 beams in DOM
    const beams = screen.getAllByTestId("animated-beam");
    expect(beams.length).toBe(6);
  });

  it("renders horizontal and vertical beam variants", () => {
    render(<McpArchitectureDiagram />);
    const horizontals = screen
      .getAllByTestId("animated-beam")
      .filter((b) => b.getAttribute("data-direction") === "horizontal");
    const verticals = screen
      .getAllByTestId("animated-beam")
      .filter((b) => b.getAttribute("data-direction") === "vertical");
    expect(horizontals.length).toBe(3);
    expect(verticals.length).toBe(3);
  });
});
