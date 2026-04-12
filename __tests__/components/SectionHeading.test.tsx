import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

describe("SectionHeading", () => {
  it("renders title as h2", () => {
    render(<SectionHeading title="Mon titre de section" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Mon titre de section" })
    ).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(<SectionHeading title="Titre" badge="NOUVEAU" />);
    expect(screen.getByText("NOUVEAU")).toBeInTheDocument();
  });

  it("does not render badge when not provided", () => {
    const { container } = render(<SectionHeading title="Titre" />);
    expect(container.querySelector("span")).toBeNull();
  });

  it("renders description when provided", () => {
    render(
      <SectionHeading
        title="Titre"
        description="Une description utile pour cette section."
      />
    );
    expect(
      screen.getByText("Une description utile pour cette section.")
    ).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<SectionHeading title="Titre" />);
    expect(screen.queryByRole("paragraph")).toBeNull();
  });

  it("is centered by default (has mx-auto text-center classes)", () => {
    const { container } = render(<SectionHeading title="Titre" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("mx-auto");
    expect(wrapper.className).toContain("text-center");
  });

  it("is not centered when centered={false}", () => {
    const { container } = render(
      <SectionHeading title="Titre" centered={false} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toContain("mx-auto");
    expect(wrapper.className).not.toContain("text-center");
  });
});
