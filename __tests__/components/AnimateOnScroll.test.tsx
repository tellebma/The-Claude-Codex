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

import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { useReducedMotion } from "framer-motion";

const mockUseReducedMotion = vi.mocked(useReducedMotion);

describe("AnimateOnScroll", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders children content", () => {
    render(
      <AnimateOnScroll>
        <span>Hello world</span>
      </AnimateOnScroll>
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders as div by default", () => {
    const { container } = render(
      <AnimateOnScroll>
        <span>Content</span>
      </AnimateOnScroll>
    );
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as custom tag when `as` prop is specified", () => {
    const { container } = render(
      <AnimateOnScroll as="section">
        <span>Section content</span>
      </AnimateOnScroll>
    );
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("applies className to the wrapper element", () => {
    const { container } = render(
      <AnimateOnScroll className="my-custom-class">
        <span>Content</span>
      </AnimateOnScroll>
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("renders children when reduced motion is preferred (no animation path)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(
      <AnimateOnScroll>
        <span>Reduced motion content</span>
      </AnimateOnScroll>
    );
    expect(screen.getByText("Reduced motion content")).toBeInTheDocument();
  });
});

describe("StaggerChildren", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders children content", () => {
    render(
      <StaggerChildren>
        <span>Child one</span>
        <span>Child two</span>
      </StaggerChildren>
    );
    expect(screen.getByText("Child one")).toBeInTheDocument();
    expect(screen.getByText("Child two")).toBeInTheDocument();
  });

  it("applies className to the wrapper element", () => {
    const { container } = render(
      <StaggerChildren className="stagger-class">
        <span>Content</span>
      </StaggerChildren>
    );
    expect(container.firstChild).toHaveClass("stagger-class");
  });

  it("renders children when reduced motion is preferred (plain div fallback)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(
      <StaggerChildren>
        <span>Reduced child</span>
      </StaggerChildren>
    );
    expect(screen.getByText("Reduced child")).toBeInTheDocument();
  });
});
