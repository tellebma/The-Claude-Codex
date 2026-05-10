import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleAlert } from "@/components/mdx/ArticleAlert";

describe("ArticleAlert", () => {
  it("renders children content", () => {
    render(<ArticleAlert>Body content</ArticleAlert>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <ArticleAlert title="Heads up">Body content</ArticleAlert>
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("defaults to info variant with role=status when no variant provided", () => {
    render(<ArticleAlert>Info</ArticleAlert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses role=alert for the urgent variant (assistive tech announces immediately)", () => {
    render(<ArticleAlert variant="urgent">Critical</ArticleAlert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses role=status for the warning variant", () => {
    render(<ArticleAlert variant="warning">Warn</ArticleAlert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders an icon for each variant", () => {
    const { rerender } = render(<ArticleAlert variant="info">x</ArticleAlert>);
    expect(document.querySelector("svg")).toBeInTheDocument();
    rerender(<ArticleAlert variant="urgent">x</ArticleAlert>);
    expect(document.querySelector("svg")).toBeInTheDocument();
    rerender(<ArticleAlert variant="warning">x</ArticleAlert>);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render the title element when title is omitted", () => {
    render(<ArticleAlert>only body</ArticleAlert>);
    expect(screen.queryByText(/^heads/i)).toBeNull();
  });

  it("applies the variant container class for urgent (gradient + glow)", () => {
    const { container } = render(
      <ArticleAlert variant="urgent">x</ArticleAlert>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("rgba(239,68,68");
  });
});
