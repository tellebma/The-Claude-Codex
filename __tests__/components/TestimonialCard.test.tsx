import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

const defaultProps = {
  quote: "Claude Code a transformé mon workflow de développement.",
  author: "Jean Dupont",
  role: "Développeur fullstack",
  result: "+40% de productivité",
};

describe("TestimonialCard", () => {
  it("renders quote in blockquote", () => {
    render(<TestimonialCard {...defaultProps} />);
    const blockquote = screen.getByRole("blockquote");
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveTextContent(
      "Claude Code a transformé mon workflow de développement."
    );
  });

  it("renders author name", () => {
    render(<TestimonialCard {...defaultProps} />);
    expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
  });

  it("renders role", () => {
    render(<TestimonialCard {...defaultProps} />);
    expect(screen.getByText("Développeur fullstack")).toBeInTheDocument();
  });

  it("renders result badge", () => {
    render(<TestimonialCard {...defaultProps} />);
    expect(screen.getByText("+40% de productivité")).toBeInTheDocument();
  });

  it("generates correct initials from full name (2 words → 2 initials)", () => {
    render(<TestimonialCard {...defaultProps} />);
    // Avatar div is aria-hidden, query by its content via container
    const { container } = render(<TestimonialCard {...defaultProps} />);
    const avatarDivs = container.querySelectorAll(
      "[aria-hidden='true'][class*='rounded-full']"
    );
    expect(avatarDivs.length).toBeGreaterThan(0);
    expect(avatarDivs[0]).toHaveTextContent("JD");
  });

  it("uses figure/figcaption for semantic structure", () => {
    const { container } = render(<TestimonialCard {...defaultProps} />);
    expect(container.querySelector("figure")).not.toBeNull();
    expect(container.querySelector("figcaption")).not.toBeNull();
  });

  it("avatar shows initials", () => {
    const { container } = render(
      <TestimonialCard
        {...defaultProps}
        author="Marie Curie"
      />
    );
    const avatarDivs = container.querySelectorAll(
      "[aria-hidden='true'][class*='rounded-full']"
    );
    expect(avatarDivs[0]).toHaveTextContent("MC");
  });
});
