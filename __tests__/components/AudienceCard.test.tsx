import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AudienceCard } from "@/components/ui/AudienceCard";

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="icon" {...props} />
);

describe("AudienceCard", () => {
  it("renders title as heading", () => {
    render(
      <AudienceCard
        icon={MockIcon as any}
        title="Développeurs"
        description="Pour les devs qui veulent aller vite."
      />
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Développeurs" })
    ).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(
      <AudienceCard
        icon={MockIcon as any}
        title="Développeurs"
        description="Pour les devs qui veulent aller vite."
      />
    );
    expect(
      screen.getByText("Pour les devs qui veulent aller vite.")
    ).toBeInTheDocument();
  });

  it("icon is decorative (aria-hidden='true')", () => {
    render(
      <AudienceCard
        icon={MockIcon as any}
        title="Développeurs"
        description="Pour les devs qui veulent aller vite."
      />
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
