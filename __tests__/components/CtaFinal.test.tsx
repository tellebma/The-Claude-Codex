import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaFinal } from "@/components/ui/CtaFinal";

describe("CtaFinal", () => {
  it("renders title and description", () => {
    render(
      <CtaFinal
        title="Ready to ship"
        description="Start building today"
        actions={<button type="button">Get started</button>}
      />
    );
    expect(screen.getByText("Ready to ship")).toBeInTheDocument();
    expect(screen.getByText("Start building today")).toBeInTheDocument();
  });

  it("renders the badge when provided (decorative pill above title)", () => {
    render(
      <CtaFinal
        badge="New"
        title="x"
        description="y"
        actions={<button type="button">go</button>}
      />
    );
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("does not render a badge element when badge is omitted", () => {
    const { container } = render(
      <CtaFinal title="x" description="y" actions={<button type="button">go</button>} />
    );
    expect(container.querySelector(".lp-cta-badge")).toBeNull();
  });

  it("renders title highlight as a separate gradient span", () => {
    const { container } = render(
      <CtaFinal
        title="Continue"
        titleHighlight="your journey"
        description="y"
        actions={<button type="button">go</button>}
      />
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toContain("Continue");
    expect(heading.textContent).toContain("your journey");
    expect(container.querySelector(".text-gradient")?.textContent).toBe("your journey");
  });

  it("uses canonical lp-cta-final class so source design CSS matches", () => {
    const { container } = render(
      <CtaFinal title="x" description="y" actions={<button type="button">go</button>} />
    );
    expect(container.querySelector("section")?.className).toContain("lp-cta-final");
  });

  it("renders actions inside a flex row container", () => {
    render(
      <CtaFinal
        title="x"
        description="y"
        actions={
          <>
            <button type="button">A</button>
            <button type="button">B</button>
          </>
        }
      />
    );
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
  });

  it("background gradient applied via inline style on the section (simplified — no decorative divs)", () => {
    const { container } = render(
      <CtaFinal title="x" description="y" actions={<button type="button">go</button>} />
    );
    const section = container.querySelector("section.lp-cta-final") as HTMLElement;
    expect(section.style.background).toContain("radial-gradient");
    expect(section.style.background).toContain("var(--bg-page)");
  });
});
