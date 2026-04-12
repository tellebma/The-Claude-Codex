import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FeatureCard } from "@/components/ui/FeatureCard";

const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />;

describe("FeatureCard", () => {
  it("renders title as h3", () => {
    render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description"
      />
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Mon titre" })
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description détaillée"
      />
    );
    expect(screen.getByText("Une description détaillée")).toBeInTheDocument();
  });

  it("icon is decorative (aria-hidden='true')", () => {
    render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description"
      />
    );
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders as div when no href is provided", () => {
    const { container } = render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description"
      />
    );
    const heading = screen.getByRole("heading", { level: 3 });
    const card = heading.closest("div");
    expect(card).toBeInTheDocument();
    expect(container.querySelector("a")).toBeNull();
  });

  it("renders as link when href is provided", () => {
    render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description"
        href="/some-page"
      />
    );
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("link has correct href", () => {
    render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description"
        href="/getting-started"
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/getting-started");
  });

  it("default gradient is teal (has brand gradient classes)", () => {
    const { container } = render(
      <FeatureCard
        icon={MockIcon}
        title="Mon titre"
        description="Une description"
      />
    );
    // The icon wrapper div should carry the teal gradient classes
    const gradientDiv = container.querySelector(".from-brand-100");
    expect(gradientDiv).toBeInTheDocument();
    expect(gradientDiv).toHaveClass("to-brand-50");
  });
});
