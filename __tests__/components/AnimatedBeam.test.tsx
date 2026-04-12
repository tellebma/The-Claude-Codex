import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("framer-motion", () => {
  const React = require("react");
  const motion = new Proxy(
    {},
    {
      get: (_target: object, prop: string | symbol) => {
        if (typeof prop !== "string") return undefined;
        return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
          const { initial, animate, variants, whileInView, viewport, style, ...rest } = props;
          return React.createElement(prop, { ...rest, ref, style });
        });
      },
    }
  );
  return {
    motion,
    useInView: vi.fn(() => true),
    useReducedMotion: vi.fn(() => false),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock("@/lib/use-reduced-motion", () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const mockUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);

describe("AnimatedBeam", () => {
  beforeEach(() => {
    mockUsePrefersReducedMotion.mockReturnValue(false);
  });

  it("renders beam animation by default when no reduced motion", () => {
    const { container } = render(<AnimatedBeam />);
    // The animated beam renders a container div with the beam elements inside
    // (not an SVG arrow like in the reduced-motion fallback)
    expect(container.querySelector("svg")).toBeNull();
    expect(container.firstChild).not.toBeNull();
  });

  it("renders static SVG when reduced motion is preferred", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<AnimatedBeam />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("SVG has aria-hidden='true' in reduced motion mode", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<AnimatedBeam />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("uses horizontal direction by default", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<AnimatedBeam />);
    // In horizontal mode the SVG has rotate-0 and hidden sm:block classes
    // For SVG elements .className returns an SVGAnimatedString; use getAttribute instead
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("rotate-0");
  });

  it("accepts a custom color prop and applies it in animation mode", () => {
    const customColor = "#ff0000";
    const { container } = render(<AnimatedBeam color={customColor} />);
    // The beam dot element has an inline background style with the custom color
    const beamDot = container.querySelector("[style*='#ff0000']");
    expect(beamDot).not.toBeNull();
  });
});
