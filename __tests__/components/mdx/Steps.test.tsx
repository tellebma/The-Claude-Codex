import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Steps, Step } from "@/components/mdx/Steps";

describe("Steps", () => {
  it("renders children inside the container", () => {
    render(
      <Steps>
        <p>Step content here</p>
      </Steps>
    );
    expect(screen.getByText("Step content here")).toBeInTheDocument();
  });
});

describe("Step", () => {
  it("renders title as h3", () => {
    render(<Step title="Install dependencies">Content</Step>);
    const heading = screen.getByRole("heading", { level: 3, name: "Install dependencies" });
    expect(heading).toBeInTheDocument();
  });

  it("renders step number in a badge when provided", () => {
    render(<Step title="Step title" stepNumber={2}>Content</Step>);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not render step number badge when stepNumber is not provided", () => {
    render(<Step title="Step title">Content</Step>);
    // No numeric badge should appear — only the title and children text
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("renders children content", () => {
    render(<Step title="Step title">Step body text</Step>);
    expect(screen.getByText("Step body text")).toBeInTheDocument();
  });

  it("shows the connecting line by default (isLast defaults to false)", () => {
    const { container } = render(<Step title="Not last step">Content</Step>);
    // The connecting line is a div with w-px class
    const line = container.querySelector(".w-px");
    expect(line).toBeInTheDocument();
  });

  it("hides the connecting line when isLast is true", () => {
    const { container } = render(
      <Step title="Last step" isLast>Content</Step>
    );
    const line = container.querySelector(".w-px");
    expect(line).not.toBeInTheDocument();
  });

  it("renders multiple steps correctly together", () => {
    render(
      <Steps>
        <Step title="First step" stepNumber={1}>Do this first</Step>
        <Step title="Second step" stepNumber={2}>Do this second</Step>
        <Step title="Third step" stepNumber={3} isLast>Do this last</Step>
      </Steps>
    );

    expect(screen.getByRole("heading", { name: "First step" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Second step" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Third step" })).toBeInTheDocument();
    expect(screen.getByText("Do this first")).toBeInTheDocument();
    expect(screen.getByText("Do this second")).toBeInTheDocument();
    expect(screen.getByText("Do this last")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
