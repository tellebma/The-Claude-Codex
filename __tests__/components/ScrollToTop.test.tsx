import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders the scroll-to-top button", () => {
    const { container } = render(<ScrollToTop />);
    const button = container.querySelector(
      'button[aria-label="Retour en haut de la page"]'
    );
    expect(button).not.toBeNull();
  });

  it("is hidden when page is at the top (scrollY < 300)", () => {
    const { container } = render(<ScrollToTop />);
    const button = container.querySelector(
      'button[aria-label="Retour en haut de la page"]'
    );
    expect(button).not.toBeNull();
    expect(button?.getAttribute("aria-hidden")).toBe("true");
    expect(button?.getAttribute("tabindex")).toBe("-1");
  });

  it("becomes visible when scrolled past threshold", () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, "scrollY", { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", {
      name: "Retour en haut de la page",
    });
    expect(button.getAttribute("aria-hidden")).toBe("false");
    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("calls window.scrollTo when clicked", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });

    render(<ScrollToTop />);
    fireEvent.scroll(window);

    const button = screen.getByRole("button", {
      name: "Retour en haut de la page",
    });
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("hides again when scrolling back to top", () => {
    const { container } = render(<ScrollToTop />);

    // Scroll down
    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    const button = container.querySelector(
      'button[aria-label="Retour en haut de la page"]'
    );
    expect(button?.getAttribute("aria-hidden")).toBe("false");

    // Scroll back up
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(button?.getAttribute("aria-hidden")).toBe("true");
  });
});
