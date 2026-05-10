import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";

function setMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe("ReadingProgressBar", () => {
  beforeEach(() => {
    setMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a fixed bar at top of viewport with z-100", () => {
    const { container } = render(<ReadingProgressBar />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toContain("art-progress");
    expect(bar.className).toContain("fixed");
    expect(bar.className).toContain("top-0");
    expect(bar.className).toContain("z-[100]");
  });

  it("renders an inner fill div with width 0% initially", () => {
    const { container } = render(<ReadingProgressBar />);
    const fill = container.querySelector(".art-progress-fill") as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill.style.width).toBe("0%");
  });

  it("uses the canonical 80ms linear transition by default", () => {
    const { container } = render(<ReadingProgressBar />);
    const fill = container.querySelector(".art-progress-fill") as HTMLElement;
    expect(fill.style.transition).toContain("80ms linear");
  });

  it("disables the transition when prefers-reduced-motion is set", () => {
    setMatchMedia(true);
    const { container } = render(<ReadingProgressBar />);
    const fill = container.querySelector(".art-progress-fill") as HTMLElement;
    expect(fill.style.transition).toBe("none");
  });

  it("uses tokens (no raw hex) for the gradient fill", () => {
    const { container } = render(<ReadingProgressBar />);
    const fill = container.querySelector(".art-progress-fill") as HTMLElement;
    expect(fill.style.background).toContain("var(--color-brand-500)");
    expect(fill.style.background).toContain("var(--color-accent-500)");
    expect(fill.style.background).toContain("var(--color-error)");
  });

  it("bar wrapper is decorative (aria-hidden)", () => {
    const { container } = render(<ReadingProgressBar />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.getAttribute("aria-hidden")).toBe("true");
  });
});
