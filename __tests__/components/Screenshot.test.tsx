import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Screenshot } from "@/components/ui/Screenshot";

const DEFAULT_PROPS = {
  src: "/images/test.png",
  alt: "Test screenshot",
};

describe("Screenshot", () => {
  it("renders image with src and alt", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    const img = screen.getAllByRole("img")[0];
    expect(img).toHaveAttribute("src", "/images/test.png");
    expect(img).toHaveAttribute("alt", "Test screenshot");
  });

  it("renders caption in figcaption when provided", () => {
    render(<Screenshot {...DEFAULT_PROPS} caption="A caption" />);
    const figcaption = document.querySelector("figcaption");
    expect(figcaption).not.toBeNull();
    expect(figcaption?.textContent).toBe("A caption");
  });

  it("does not render figcaption when no caption provided", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    const figcaption = document.querySelector("figcaption");
    expect(figcaption).toBeNull();
  });

  it("trigger button has correct aria-label", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    const button = screen.getByRole("button", {
      name: "Agrandir l'image : Test screenshot",
    });
    expect(button).toBeInTheDocument();
  });

  it("trigger button has aria-haspopup dialog", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    const button = screen.getByRole("button", {
      name: "Agrandir l'image : Test screenshot",
    });
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("clicking trigger opens lightbox dialog", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    expect(screen.queryByRole("dialog")).toBeNull();

    const trigger = screen.getByRole("button", {
      name: "Agrandir l'image : Test screenshot",
    });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("lightbox has role='dialog' and aria-modal='true'", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Agrandir l'image : Test screenshot",
      })
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("close button closes lightbox", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Agrandir l'image : Test screenshot",
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // The visible close button (X icon) — exact match (the backdrop
    // button has a longer aria-label with "(arrière-plan)").
    const closeBtn = screen.getByRole("button", {
      name: /^Fermer l'image agrandie$/,
    });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Escape key closes lightbox", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Agrandir l'image : Test screenshot",
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("clicking backdrop button closes lightbox", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Agrandir l'image : Test screenshot",
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = screen.getByTestId("lightbox-backdrop");
    fireEvent.click(backdrop);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("clicking the image does not close lightbox (image is above backdrop)", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Agrandir l'image : Test screenshot",
      })
    );

    const dialog = screen.getByRole("dialog");
    const imageInside = dialog.querySelector("img");
    expect(imageInside).not.toBeNull();

    if (imageInside) {
      fireEvent.click(imageInside);
    }

    // The image sits above the backdrop (z-10 vs z-0), clicking the
    // image should not bubble to the backdrop button.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("image has lazy loading attribute", () => {
    render(<Screenshot {...DEFAULT_PROPS} />);
    const img = screen.getAllByRole("img")[0];
    expect(img).toHaveAttribute("loading", "lazy");
  });
});
