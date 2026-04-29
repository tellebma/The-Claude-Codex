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
    nightOwl: { _name: "nightOwl" },
    nightOwlLight: { _name: "nightOwlLight" },
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
    // useTranslations mock: t("copyCode") -> "copyCode"
    const button = screen.getByRole("button", { name: "copyCode" });
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
    const button = screen.getByRole("button", { name: "copyCode" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test code");
    });

    await waitFor(() => {
      // After copy: t("copiedCode") -> "copiedCode"
      expect(
        screen.getByRole("button", { name: "copiedCode" })
      ).toBeInTheDocument();
    });
  });

  it("renders with default language of bash", () => {
    render(<CodeBlock code="ls" />);
    // The code should still render (we trust the Highlight mock)
    expect(screen.getByText("ls")).toBeInTheDocument();
  });

  it("uses --code-bg token on the container (not hardcoded slate-950)", () => {
    const { container } = render(<CodeBlock code="ls" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("bg-[color:var(--code-bg)]");
    expect(root.className).toContain("border-[color:var(--border-subtle)]");
    expect(root.className).not.toMatch(/bg-slate-950/);
  });

  it("renders the same code on bash, typescript, tsx, json, yaml", () => {
    // Smoke test of the 5 main languages — the mock just splits on \n,
    // we verify the component does not crash for any of them.
    const samples: ReadonlyArray<{ code: string; language: string }> = [
      { code: "echo hello", language: "bash" },
      { code: "const x: number = 1;", language: "typescript" },
      { code: "<div>hello</div>", language: "tsx" },
      { code: '{"a": 1}', language: "json" },
      { code: "key: value", language: "yaml" },
    ];
    for (const { code, language } of samples) {
      const { unmount } = render(<CodeBlock code={code} language={language} />);
      expect(screen.getByText(code)).toBeInTheDocument();
      unmount();
    }
  });
});
