import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  mdxComponents,
  createLocaleMdxComponents,
} from "@/components/mdx/MdxComponents";

// We need to mock the heavy sub-components that mdxComponents imports
vi.mock("@/components/ui/CodeBlock", () => ({
  CodeBlock: ({ code, language }: { code: string; language: string }) => (
    <pre data-testid="code-block" data-language={language}>
      {code}
    </pre>
  ),
}));

vi.mock("@/components/ui/MermaidDiagram", () => ({
  MermaidDiagram: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram">{chart}</div>
  ),
}));

describe("mdxComponents", () => {
  describe("HTML element overrides", () => {
    it("renders h1 with correct classes", () => {
      const H1 = mdxComponents.h1 as React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
      render(<H1>My Heading</H1>);
      const heading = screen.getByText("My Heading");
      expect(heading.tagName).toBe("H1");
      expect(heading.className).toContain("text-3xl");
      expect(heading.className).toContain("font-extrabold");
    });

    it("renders h2 with correct classes", () => {
      const H2 = mdxComponents.h2 as React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
      render(<H2>Sub Heading</H2>);
      const heading = screen.getByText("Sub Heading");
      expect(heading.tagName).toBe("H2");
      expect(heading.className).toContain("text-2xl");
    });

    it("renders h3 with correct classes", () => {
      const H3 = mdxComponents.h3 as React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
      render(<H3>Third Level</H3>);
      const heading = screen.getByText("Third Level");
      expect(heading.tagName).toBe("H3");
      expect(heading.className).toContain("text-xl");
    });

    it("renders h4 with correct classes", () => {
      const H4 = mdxComponents.h4 as React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
      render(<H4>Fourth Level</H4>);
      const heading = screen.getByText("Fourth Level");
      expect(heading.tagName).toBe("H4");
      expect(heading.className).toContain("text-lg");
    });

    it("renders p with relaxed leading", () => {
      const P = mdxComponents.p as React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
      render(<P>A paragraph</P>);
      const p = screen.getByText("A paragraph");
      expect(p.tagName).toBe("P");
      expect(p.className).toContain("leading-relaxed");
    });

    it("renders ul with list-disc", () => {
      const UL = mdxComponents.ul as React.FC<React.HTMLAttributes<HTMLUListElement>>;
      render(<UL><li>Item</li></UL>);
      const ul = screen.getByRole("list");
      expect(ul.className).toContain("list-disc");
    });

    it("renders ol with list-decimal", () => {
      const OL = mdxComponents.ol as React.FC<React.HTMLAttributes<HTMLOListElement>>;
      render(<OL><li>Item</li></OL>);
      const ol = screen.getByRole("list");
      expect(ol.className).toContain("list-decimal");
    });

    it("renders blockquote with border-l-4", () => {
      const Blockquote = mdxComponents.blockquote as React.FC<React.HTMLAttributes<HTMLQuoteElement>>;
      render(<Blockquote>A quote</Blockquote>);
      const bq = screen.getByText("A quote");
      expect(bq.tagName).toBe("BLOCKQUOTE");
      expect(bq.className).toContain("border-l-4");
      expect(bq.className).toContain("italic");
    });

    it("renders inline code with mono font", () => {
      const Code = mdxComponents.code as React.FC<React.HTMLAttributes<HTMLElement>>;
      render(<Code>const x = 1</Code>);
      const code = screen.getByText("const x = 1");
      expect(code.tagName).toBe("CODE");
      expect(code.className).toContain("font-mono");
    });

    it("renders strong with font-semibold", () => {
      const Strong = mdxComponents.strong as React.FC<React.HTMLAttributes<HTMLElement>>;
      render(<Strong>Bold text</Strong>);
      const strong = screen.getByText("Bold text");
      expect(strong.tagName).toBe("STRONG");
      expect(strong.className).toContain("font-semibold");
    });

    it("renders hr", () => {
      const Hr = mdxComponents.hr as React.FC;
      const { container } = render(<Hr />);
      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });

    it("renders table wrapped in rounded bordered container with inner overflow-x", () => {
      // RG2-09 : wrapper externe a overflow-hidden (radius 14 + border default),
      // l'overflow horizontal est sur le div inner pour respecter le border-radius.
      const Table = mdxComponents.table as React.FC<React.HTMLAttributes<HTMLTableElement>>;
      const { container } = render(
        <Table>
          <tbody><tr><td>cell</td></tr></tbody>
        </Table>
      );
      const wrapper = container.firstElementChild;
      expect(wrapper?.className).toContain("rounded-2xl");
      expect(wrapper?.className).toContain("overflow-hidden");
      const inner = wrapper?.firstElementChild;
      expect(inner?.className).toContain("overflow-x-auto");
      expect(inner?.querySelector("table")).toBeInTheDocument();
    });

    it("renders th with header styles (RG2-09 uppercase muted label tone)", () => {
      const Th = mdxComponents.th as React.FC<React.HTMLAttributes<HTMLTableCellElement>>;
      render(<table><thead><tr><Th>Header</Th></tr></thead></table>);
      const th = screen.getByText("Header");
      expect(th.tagName).toBe("TH");
      expect(th.className).toContain("font-semibold");
      expect(th.className).toContain("uppercase");
    });

    it("renders td with border-bottom (RG2-09 row separator)", () => {
      const Td = mdxComponents.td as React.FC<React.HTMLAttributes<HTMLTableCellElement>>;
      render(<table><tbody><tr><Td>Cell</Td></tr></tbody></table>);
      const td = screen.getByText("Cell");
      expect(td.tagName).toBe("TD");
      expect(td.className).toContain("border-b");
    });
  });

  describe("anchor (a) component", () => {
    it("renders internal link without target=_blank", () => {
      const A = mdxComponents.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
      render(<A href="/getting-started">Get Started</A>);
      const link = screen.getByText("Get Started");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("renders external link with target=_blank and rel", () => {
      const A = mdxComponents.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
      render(<A href="https://example.com">External</A>);
      const link = screen.getByText("External");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("adds sr-only text for external links", () => {
      const A = mdxComponents.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
      render(<A href="https://example.com">External</A>);
      const srOnly = screen.getByText("(ouvre un nouvel onglet)");
      expect(srOnly.className).toContain("sr-only");
    });

    it("treats target=_blank as external even without http", () => {
      const A = mdxComponents.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
      render(<A href="/some-page" target="_blank">Link</A>);
      const link = screen.getByText("Link");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  describe("pre component (fenced code blocks)", () => {
    it("renders CodeBlock for code with language class", () => {
      const Pre = mdxComponents.pre as React.FC<{ children?: React.ReactNode }>;
      const codeChild = React.createElement("code", {
        className: "language-typescript",
        children: "const x = 1;",
      });
      render(<Pre>{codeChild}</Pre>);
      const codeBlock = screen.getByTestId("code-block");
      expect(codeBlock).toBeInTheDocument();
      expect(codeBlock).toHaveAttribute("data-language", "typescript");
      expect(codeBlock).toHaveTextContent("const x = 1;");
    });

    it("renders MermaidDiagram for mermaid language", () => {
      const Pre = mdxComponents.pre as React.FC<{ children?: React.ReactNode }>;
      const codeChild = React.createElement("code", {
        className: "language-mermaid",
        children: "graph LR\nA-->B",
      });
      render(<Pre>{codeChild}</Pre>);
      const diagram = screen.getByTestId("mermaid-diagram");
      expect(diagram).toBeInTheDocument();
    });

    it("falls back to plain pre when no language class", () => {
      const Pre = mdxComponents.pre as React.FC<{ children?: React.ReactNode }>;
      const codeChild = React.createElement("code", {
        children: "plain text",
      });
      render(<Pre>{codeChild}</Pre>);
      // Should render a plain <pre> element
      const pre = screen.getByText("plain text").closest("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.className).toContain("overflow-x-auto");
    });

    it("falls back to plain pre for non-object children", () => {
      const Pre = mdxComponents.pre as React.FC<{ children?: React.ReactNode }>;
      render(<Pre>Just text</Pre>);
      const pre = screen.getByText("Just text").closest("pre");
      expect(pre).toBeInTheDocument();
    });

    it("trims trailing whitespace from code content", () => {
      const Pre = mdxComponents.pre as React.FC<{ children?: React.ReactNode }>;
      const codeChild = React.createElement("code", {
        className: "language-bash",
        children: "echo hello   \n",
      });
      render(<Pre>{codeChild}</Pre>);
      const codeBlock = screen.getByTestId("code-block");
      expect(codeBlock).toHaveTextContent("echo hello");
    });
  });
});

describe("createLocaleMdxComponents", () => {
  it("returns an object with all mdxComponents keys", () => {
    const localizedComponents = createLocaleMdxComponents("fr");
    // Should have at least the same keys as mdxComponents
    for (const key of Object.keys(mdxComponents)) {
      expect(localizedComponents).toHaveProperty(key);
    }
  });

  it("prefixes internal links with locale", () => {
    const components = createLocaleMdxComponents("fr");
    const A = components.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    render(<A href="/getting-started">Link</A>);
    const link = screen.getByText("Link");
    expect(link).toHaveAttribute("href", "/fr/getting-started");
  });

  it("does not prefix external links", () => {
    const components = createLocaleMdxComponents("fr");
    const A = components.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    render(<A href="https://example.com">External</A>);
    const link = screen.getByText("External");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("does not double-prefix links already having locale", () => {
    const components = createLocaleMdxComponents("fr");
    const A = components.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    render(<A href="/fr/getting-started">Link</A>);
    const link = screen.getByText("Link");
    expect(link).toHaveAttribute("href", "/fr/getting-started");
  });

  it("does not prefix protocol-relative links (//)", () => {
    const components = createLocaleMdxComponents("en");
    const A = components.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    render(<A href="//cdn.example.com/file.js">CDN</A>);
    const link = screen.getByText("CDN");
    expect(link).toHaveAttribute("href", "//cdn.example.com/file.js");
  });

  it("prefixes with en locale correctly", () => {
    const components = createLocaleMdxComponents("en");
    const A = components.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    render(<A href="/mcp">MCP</A>);
    const link = screen.getByText("MCP");
    expect(link).toHaveAttribute("href", "/en/mcp");
  });

  it("handles links already having /en/ prefix", () => {
    const components = createLocaleMdxComponents("en");
    const A = components.a as React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    render(<A href="/en/mcp">MCP</A>);
    const link = screen.getByText("MCP");
    expect(link).toHaveAttribute("href", "/en/mcp");
  });
});
