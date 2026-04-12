import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { PathCard } from "@/components/ui/PathCard";

vi.mock("@/components/ui/BorderBeam", () => ({
  BorderBeam: () => null,
}));

const MockIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <svg data-testid="mock-icon" ref={ref} {...props} />
) as unknown as typeof import("lucide-react").Terminal;

const defaultProps = {
  icon: MockIcon,
  level: "Débutant",
  title: "Installation",
  description: "Guide d'installation complet",
  items: ["Prérequis", "Configuration", "Premier pas"],
  href: "/getting-started/installation",
  color: "teal" as const,
  ctaLabel: "Commencer",
};

describe("PathCard", () => {
  it("renders as a link with correct href", () => {
    render(<PathCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/getting-started/installation");
  });

  it("has aria-label combining level and title", () => {
    render(<PathCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Débutant : Installation");
  });

  it("renders title as h3", () => {
    render(<PathCard {...defaultProps} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Installation" })
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PathCard {...defaultProps} />);
    expect(
      screen.getByText("Guide d'installation complet")
    ).toBeInTheDocument();
  });

  it("renders level badge text", () => {
    render(<PathCard {...defaultProps} />);
    expect(screen.getByText("Débutant")).toBeInTheDocument();
  });

  it("renders all items in the list", () => {
    render(<PathCard {...defaultProps} />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(list).getByText("Prérequis")).toBeInTheDocument();
    expect(within(list).getByText("Configuration")).toBeInTheDocument();
    expect(within(list).getByText("Premier pas")).toBeInTheDocument();
  });

  it("renders CTA label text", () => {
    render(<PathCard {...defaultProps} />);
    expect(screen.getByText("Commencer")).toBeInTheDocument();
  });

  it("icon is decorative (aria-hidden='true')", () => {
    render(<PathCard {...defaultProps} />);
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
