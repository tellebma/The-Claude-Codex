import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Logo } from "@/components/layout/Logo";

describe("Logo", () => {
  it("renders an svg", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("defaults to medium size (h-8 w-8)", () => {
    const { container } = render(<Logo />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-8");
    expect(wrapper.className).toContain("w-8");
  });

  it("uses smaller dimensions when size=sm", () => {
    const { container } = render(<Logo size="sm" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-7");
    expect(wrapper.className).toContain("w-7");
  });

  it("is aria-hidden (decorative)", () => {
    const { container } = render(<Logo />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies the brand-to-accent gradient background", () => {
    const { container } = render(<Logo />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("from-brand-500");
    expect(wrapper.className).toContain("to-accent-500");
  });
});
