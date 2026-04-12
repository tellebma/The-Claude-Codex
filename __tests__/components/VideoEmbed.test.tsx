import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { VideoEmbed } from "@/components/ui/VideoEmbed";

const DEFAULT_PROPS = {
  videoId: "dQw4w9WgXcQ",
  title: "My Test Video",
};

describe("VideoEmbed", () => {
  it("renders play button initially (no iframe)", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    // The mock returns the key, so aria-label will be "play" (from t("play", { title }))
    const playButton = screen.getByRole("button");
    expect(playButton).toBeInTheDocument();
    expect(screen.queryByTitle("My Test Video")).toBeNull();
  });

  it("shows thumbnail image with correct src", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    );
  });

  it("play button has correct aria-label from translation key", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    // The mock t("play", { title }) returns "play" (key is returned as-is)
    const playButton = screen.getByRole("button", { name: "play" });
    expect(playButton).toBeInTheDocument();
  });

  it("clicking play button shows iframe with correct embed URL", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole("button"));

    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute("src")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
    );
  });

  it("iframe has correct title attribute", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole("button"));

    const iframe = document.querySelector("iframe");
    expect(iframe).toHaveAttribute("title", "My Test Video");
  });

  it("iframe has allowFullScreen", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole("button"));

    const iframe = document.querySelector("iframe");
    // allowFullScreen is reflected as a boolean attribute
    expect(iframe).toHaveAttribute("allowfullscreen");
  });

  it("renders caption when provided", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} caption="Watch the demo" />);
    const figcaption = document.querySelector("figcaption");
    expect(figcaption).not.toBeNull();
    expect(figcaption?.textContent).toBe("Watch the demo");
  });

  it("does not render caption when not provided", () => {
    render(<VideoEmbed {...DEFAULT_PROPS} />);
    const figcaption = document.querySelector("figcaption");
    expect(figcaption).toBeNull();
  });
});
