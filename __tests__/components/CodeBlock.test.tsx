import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CodeBlock } from "@/components/ui/CodeBlock";

// Mock prism-react-renderer to avoid complex syntax highlighting in tests
vi.mock("prism-react-renderer", () => ({
  Highlight: ({
    children,
    code,
  }: {
    children: (props: {
      className: string;
      style: Record<string, string>;
      tokens: Array<Array<{ content: string; types: string[] }>>;
      getLineProps: (opts: {
        line: Array<{ content: string; types: string[] }>;
      }) => Record<string, unknown>;
      getTokenProps: (opts: {
        token: { content: string; types: string[] };
      }) => Record<string, unknown>;
    }) => React.ReactNode;
    code: string;
    language: string;
    theme: unknown;
  }) => {
    const lines = code.split("\n").map((line) => [
      { content: line, types: ["plain"] },
    ]);
    return children({
      className: "prism-code",
      style: {},
      tokens: lines,
      getLineProps: () => ({}),
      getTokenProps: ({ token }: { token: { content: string } }) => ({
        children: token.content,
      }),
    });
  },
  themes: {
    nightOwl: {},
  },
}));

describe("CodeBlock", () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders the code content", () => {
    render(<CodeBlock code="echo hello" language="bash" />);
    expect(screen.getByText("echo hello")).toBeInTheDocument();
  });

  it("renders a copy button with correct aria-label", () => {
    render(<CodeBlock code="npm install" />);
    const button = screen.getByRole("button", { name: "Copier le code" });
    expect(button).toBeInTheDocument();
  });

  it("renders filename when provided", () => {
    render(
      <CodeBlock code="const x = 1;" language="ts" filename="index.ts" />
    );
    expect(screen.getByText("index.ts")).toBeInTheDocument();
    expect(screen.getByText("ts")).toBeInTheDocument();
  });

  it("does not render filename bar when no filename", () => {
    render(<CodeBlock code="ls -la" />);
    // The filename bar should not exist
    expect(screen.queryByText("bash")).not.toBeInTheDocument();
  });

  it("copies code to clipboard and updates aria-label", async () => {
    render(<CodeBlock code="test code" />);
    const button = screen.getByRole("button", { name: "Copier le code" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test code");
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Code copié" })
      ).toBeInTheDocument();
    });
  });

  it("renders with default language of bash", () => {
    render(<CodeBlock code="ls" />);
    // The code should still render (we trust the Highlight mock)
    expect(screen.getByText("ls")).toBeInTheDocument();
  });
});
