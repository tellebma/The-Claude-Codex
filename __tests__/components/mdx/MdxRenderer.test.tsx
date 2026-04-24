import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// MdxRenderer compiles MDX via `@mdx-js/mdx`'s `evaluate` and produces an
// async server component. At unit-test level we stub `evaluate` so we can
// assert that MdxRenderer forwards the expected arguments (source, options)
// and passes the correct components map to the rendered MDX tree.
const evaluateSpy = vi.fn();

vi.mock("@mdx-js/mdx", () => ({
  evaluate: (source: string, options: Record<string, unknown>) => {
    evaluateSpy(source, options);
    const MdxContent = (props: { components: Record<string, unknown> }) => (
      <div data-testid="mdx-content" data-source={source}>
        {/* Serialize the components map keys to assert what was passed to the tree. */}
        <span data-testid="mdx-components-keys">
          {Object.keys(props.components).join(",")}
        </span>
      </div>
    );
    return Promise.resolve({ default: MdxContent });
  },
}));

vi.mock("remark-gfm", () => ({
  default: function remarkGfmStub() {},
}));

vi.mock("@/components/mdx/MdxComponents", () => ({
  mdxComponents: { h1: "h1-default" },
  createLocaleMdxComponents: (locale: string) => ({ h1: `h1-${locale}` }),
}));

import { MdxRenderer } from "@/components/mdx/MdxRenderer";

// MdxRenderer is an async server component. Callers await it indirectly
// through React 19's RSC runtime; in unit tests we await it and render
// the returned JSX.
async function renderMdx(props: { source: string; locale?: string }) {
  const element = await MdxRenderer(props);
  return render(element);
}

describe("MdxRenderer", () => {
  it("renders the MDX content inside a centered container", async () => {
    await renderMdx({ source: "# Hello" });
    const container = screen.getByTestId("mdx-content").parentElement as HTMLElement;
    expect(container.className).toContain("mdx-content");
    expect(container.className).toContain("mx-auto");
    expect(container.className).toContain("max-w-3xl");
  });

  it("forwards the source string to @mdx-js/mdx evaluate", async () => {
    evaluateSpy.mockClear();
    await renderMdx({ source: "# source content" });
    expect(evaluateSpy).toHaveBeenCalledTimes(1);
    const [source] = evaluateSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(source).toBe("# source content");
  });

  it("passes default MDX components to the rendered content when no locale is provided", async () => {
    await renderMdx({ source: "x" });
    const keys = screen.getByTestId("mdx-components-keys").textContent ?? "";
    expect(keys).toBe("h1");
  });

  it("passes locale-specific MDX components to evaluate's useMDXComponents hook", async () => {
    evaluateSpy.mockClear();
    await renderMdx({ source: "x", locale: "fr" });
    const [, opts] = evaluateSpy.mock.calls[0] as [
      string,
      { useMDXComponents: () => Record<string, unknown> },
    ];
    expect(opts.useMDXComponents()).toEqual({ h1: "h1-fr" });

    evaluateSpy.mockClear();
    await renderMdx({ source: "x", locale: "en" });
    const [, opts2] = evaluateSpy.mock.calls[0] as [
      string,
      { useMDXComponents: () => Record<string, unknown> },
    ];
    expect(opts2.useMDXComponents()).toEqual({ h1: "h1-en" });
  });

  it("registers remark-gfm as a remark plugin", async () => {
    evaluateSpy.mockClear();
    await renderMdx({ source: "x" });
    const [, opts] = evaluateSpy.mock.calls[0] as [
      string,
      { remarkPlugins: unknown[] },
    ];
    expect(opts.remarkPlugins).toHaveLength(1);
  });
});
