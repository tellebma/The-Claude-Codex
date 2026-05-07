import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ArticleShareRail } from "@/components/ui/ArticleShareRail";

describe("ArticleShareRail", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders the label", () => {
    render(
      <ArticleShareRail
        url="https://x.test/a"
        title="A"
        label="Partager"
      />
    );
    expect(screen.getByText("Partager")).toBeInTheDocument();
  });

  it("renders Twitter / X share link with intent URL and encoded params", () => {
    render(
      <ArticleShareRail url="https://x.test/a" title="Mon article" />
    );
    const x = screen.getByRole("link", { name: /Partager sur X/ });
    expect(x.getAttribute("href")).toContain(
      "https://twitter.com/intent/tweet"
    );
    expect(x.getAttribute("href")).toContain("Mon%20article");
    expect(x.getAttribute("href")).toContain("https%3A%2F%2Fx.test%2Fa");
  });

  it("renders LinkedIn share link with sharing URL", () => {
    render(
      <ArticleShareRail url="https://x.test/a" title="A" />
    );
    const li = screen.getByRole("link", { name: /Partager sur LinkedIn/ });
    expect(li.getAttribute("href")).toContain(
      "linkedin.com/sharing/share-offsite"
    );
  });

  it("copies the URL to clipboard on click and toggles the aria-label", async () => {
    render(
      <ArticleShareRail
        url="https://x.test/article"
        title="A"
        copyAriaLabel="Copier"
        copiedLabel="Copie"
      />
    );
    const button = screen.getByRole("button", { name: "Copier" });
    fireEvent.click(button);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://x.test/article"
      );
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copie" })).toBeInTheDocument();
    });
  });

  it("opens external links in a new tab with rel noopener noreferrer", () => {
    render(<ArticleShareRail url="https://x.test/a" title="A" />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
