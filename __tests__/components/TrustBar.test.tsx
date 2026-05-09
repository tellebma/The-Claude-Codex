import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitBranch, Languages } from "lucide-react";
import { TrustBar } from "@/components/ui/TrustBar";

const items = [
  { Icon: GitBranch, label: "Open source" },
  { Icon: Languages, label: "Bilingual" },
];

describe("TrustBar", () => {
  it("renders the label as section aria-label (named landmark)", () => {
    render(<TrustBar label="Why" items={items} />);
    const section = screen.getByRole("region", { name: "Why" });
    expect(section).toBeInTheDocument();
  });

  it("renders the label text (eyebrow)", () => {
    render(<TrustBar label="Why" items={items} />);
    expect(screen.getByText("Why")).toBeInTheDocument();
  });

  it("renders all items as list items", () => {
    render(<TrustBar label="Why" items={items} />);
    const list = screen.getByRole("list");
    const lis = list.querySelectorAll("li");
    expect(lis).toHaveLength(2);
    expect(screen.getByText("Open source")).toBeInTheDocument();
    expect(screen.getByText("Bilingual")).toBeInTheDocument();
  });

  it("renders an icon (svg) per item, decorative aria-hidden", () => {
    const { container } = render(<TrustBar label="Why" items={items} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
    svgs.forEach((svg) => {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("renders an empty list gracefully when items is empty", () => {
    render(<TrustBar label="Why" items={[]} />);
    const list = screen.getByRole("list");
    expect(list.querySelectorAll("li")).toHaveLength(0);
  });
});
