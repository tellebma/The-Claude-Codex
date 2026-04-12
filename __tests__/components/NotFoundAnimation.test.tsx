import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock framer-motion
let mockReducedMotion = false;
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div data-testid="motion-div" {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => mockReducedMotion,
}));

import { NotFoundAnimation } from "@/components/ui/NotFoundAnimation";

describe("NotFoundAnimation", () => {
  it("renders children content", () => {
    render(<NotFoundAnimation><p>404 Not Found</p></NotFoundAnimation>);
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
  });

  it("renders motion wrapper when reduced motion is not preferred", () => {
    mockReducedMotion = false;
    const { container } = render(
      <NotFoundAnimation><span>Content</span></NotFoundAnimation>
    );
    expect(container.querySelector("[data-testid='motion-div']")).toBeInTheDocument();
  });

  it("renders plain div when reduced motion is preferred", () => {
    mockReducedMotion = true;
    const { container } = render(
      <NotFoundAnimation><span>Content</span></NotFoundAnimation>
    );
    expect(container.querySelector("[data-testid='motion-div']")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
