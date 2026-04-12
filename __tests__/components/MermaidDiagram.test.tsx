import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import React from "react";

// Mock next-themes to control the theme
let mockTheme = "light";
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: mockTheme, setTheme: vi.fn() }),
}));

// Mock mermaid to avoid complex rendering
const mockRender = vi.fn();
const mockInitialize = vi.fn();
vi.mock("mermaid", () => ({
  default: {
    initialize: (...args: unknown[]) => mockInitialize(...args),
    render: (...args: unknown[]) => mockRender(...args),
  },
}));

import { MermaidDiagram } from "@/components/ui/MermaidDiagram";

describe("MermaidDiagram", () => {
  beforeEach(() => {
    mockTheme = "light";
    mockInitialize.mockClear();
    mockRender.mockClear();
    mockRender.mockResolvedValue({ svg: '<svg data-testid="mermaid-svg">chart</svg>' });
  });

  it("renders a figure element", () => {
    render(<MermaidDiagram chart="graph LR\nA-->B" />);
    const figure = screen.getByRole("figure");
    expect(figure).toBeInTheDocument();
  });

  it("renders figcaption when caption is provided", async () => {
    render(<MermaidDiagram chart="graph LR\nA-->B" caption="My diagram" />);
    const caption = screen.getByText("My diagram");
    expect(caption.tagName).toBe("FIGCAPTION");
  });

  it("does not render figcaption when no caption", () => {
    const { container } = render(<MermaidDiagram chart="graph LR\nA-->B" />);
    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });

  it("initializes mermaid with light theme variables by default", async () => {
    render(<MermaidDiagram chart="graph LR\nA-->B" />);

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalled();
    });

    const initCall = mockInitialize.mock.calls[0][0];
    expect(initCall.theme).toBe("base");
    expect(initCall.look).toBe("classic");
    // Light theme should have light primary text color
    expect(initCall.themeVariables.primaryTextColor).toBe("#0f172a");
  });

  it("initializes mermaid with dark theme variables when theme is dark", async () => {
    mockTheme = "dark";
    render(<MermaidDiagram chart="graph LR\nA-->B" />);

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalled();
    });

    const initCall = mockInitialize.mock.calls[0][0];
    expect(initCall.themeVariables.primaryTextColor).toBe("#e2e8f0");
  });

  it("uses handDrawn look when handDrawn prop is true", async () => {
    render(<MermaidDiagram chart="graph LR\nA-->B" handDrawn />);

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalled();
    });

    const initCall = mockInitialize.mock.calls[0][0];
    expect(initCall.look).toBe("handDrawn");
  });

  it("renders SVG output from mermaid into container", async () => {
    const { container } = render(<MermaidDiagram chart="graph LR\nA-->B" />);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalled();
    });

    // The SVG should be injected via innerHTML
    await waitFor(() => {
      const svgContainer = container.querySelector("[class*='overflow-x-auto']");
      expect(svgContainer?.innerHTML).toContain("mermaid-svg");
    });
  });

  it("shows error message when mermaid render fails", async () => {
    mockRender.mockRejectedValue(new Error("Parse error in chart"));

    render(<MermaidDiagram chart="invalid chart syntax" />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur de rendu Mermaid/)).toBeInTheDocument();
      expect(screen.getByText(/Parse error in chart/)).toBeInTheDocument();
    });
  });

  it("starts with opacity-0 and transitions to opacity-100 after render", async () => {
    const { container } = render(<MermaidDiagram chart="graph LR\nA-->B" />);

    // Initially opacity-0
    const svgContainer = container.querySelector("[class*='overflow-x-auto']");
    expect(svgContainer?.className).toContain("opacity-0");

    await waitFor(() => {
      expect(svgContainer?.className).toContain("opacity-100");
    });
  });
});
