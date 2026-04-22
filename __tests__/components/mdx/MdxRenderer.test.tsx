import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// MDXRemote is a React Server Component that compiles MDX at runtime.
// At unit-test level we only care that MdxRenderer forwards its props to
// MDXRemote (source, components, options) and wraps the output in the
// expected container — so we stub MDXRemote and inspect what it receives.
const mdxRemoteSpy = vi.fn();

vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: (props: {
    source: string;
    components: Record<string, unknown>;
    options: Record<string, unknown>;
  }) => {
    mdxRemoteSpy(props);
    return <div data-testid="mdx-remote">{props.source}</div>;
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

describe("MdxRenderer", () => {
  it("renders the source inside a centered container", () => {
    render(<MdxRenderer source="# Hello" />);
    const container = screen
      .getByTestId("mdx-remote")
      .parentElement as HTMLElement;
    expect(container.className).toContain("mdx-content");
    expect(container.className).toContain("mx-auto");
    expect(container.className).toContain("max-w-3xl");
  });

  it("forwards the source prop to MDXRemote", () => {
    mdxRemoteSpy.mockClear();
    render(<MdxRenderer source="# source content" />);
    expect(mdxRemoteSpy).toHaveBeenCalledTimes(1);
    const call = mdxRemoteSpy.mock.calls[0][0];
    expect(call.source).toBe("# source content");
  });

  it("uses default MDX components when no locale is provided", () => {
    mdxRemoteSpy.mockClear();
    render(<MdxRenderer source="x" />);
    const call = mdxRemoteSpy.mock.calls[0][0];
    expect(call.components).toEqual({ h1: "h1-default" });
  });

  it("uses locale-specific MDX components when a locale is provided", () => {
    mdxRemoteSpy.mockClear();
    render(<MdxRenderer source="x" locale="fr" />);
    const call = mdxRemoteSpy.mock.calls[0][0];
    expect(call.components).toEqual({ h1: "h1-fr" });

    mdxRemoteSpy.mockClear();
    render(<MdxRenderer source="x" locale="en" />);
    const call2 = mdxRemoteSpy.mock.calls[0][0];
    expect(call2.components).toEqual({ h1: "h1-en" });
  });

  it("passes remark-gfm as a remark plugin", () => {
    mdxRemoteSpy.mockClear();
    render(<MdxRenderer source="x" />);
    const call = mdxRemoteSpy.mock.calls[0][0];
    expect(call.options).toBeDefined();
    expect(
      (call.options as { mdxOptions: { remarkPlugins: unknown[] } })
        .mdxOptions.remarkPlugins
    ).toHaveLength(1);
  });
});
