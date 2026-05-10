import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx/MdxComponents";

const components: MDXComponents = mdxComponents;

function renderTable() {
  const Table = components.table as React.ComponentType<React.HTMLAttributes<HTMLTableElement>>;
  const Th = components.th as React.ComponentType<React.HTMLAttributes<HTMLTableCellElement>>;
  const Td = components.td as React.ComponentType<React.HTMLAttributes<HTMLTableCellElement>>;
  return render(
    <Table>
      <thead>
        <tr>
          <Th>Header A</Th>
          <Th>Header B</Th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Td>row1-a</Td>
          <Td>row1-b</Td>
        </tr>
        <tr>
          <Td>row2-a</Td>
          <Td>row2-b</Td>
        </tr>
      </tbody>
    </Table>
  );
}

describe("RG2-09 MdxComponents table override", () => {
  it("wraps table in a rounded bordered container (overflow-hidden + radius)", () => {
    const { container } = renderTable();
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("rounded-2xl");
    expect(wrapper.className).toContain("border-[color:var(--border-default)]");
    expect(wrapper.className).toContain("overflow-hidden");
  });

  it("inner div allows horizontal overflow for narrow viewports", () => {
    const { container } = renderTable();
    const wrapper = container.firstElementChild as HTMLElement;
    const inner = wrapper.firstElementChild as HTMLElement;
    expect(inner.className).toContain("overflow-x-auto");
  });

  it("TH gets uppercase 13px muted with bg-subtle (label tone, not data)", () => {
    const { container } = renderTable();
    const th = container.querySelector("th") as HTMLElement;
    expect(th.className).toContain("uppercase");
    expect(th.className).toContain("text-[13px]");
    expect(th.className).toContain("text-[var(--fg-muted)]");
    expect(th.className).toContain("bg-[var(--bg-subtle)]");
  });

  it("TD gets bottom border + secondary text color (data row)", () => {
    const { container } = renderTable();
    const td = container.querySelector("td") as HTMLElement;
    expect(td.className).toContain("border-b");
    expect(td.className).toContain("border-[var(--border-default)]");
    expect(td.className).toContain("text-[var(--fg-secondary)]");
  });

  it("table has hover effect on tbody rows via tailwind arbitrary selector", () => {
    const { container } = renderTable();
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("[&_tbody_tr:hover_td]:bg-[color:rgba(6,182,212,0.04)]");
  });

  it("table removes the bottom border on last row to avoid double border with wrapper", () => {
    const { container } = renderTable();
    const table = container.querySelector("table") as HTMLElement;
    expect(table.className).toContain("[&_tbody_tr:last-child_td]:border-b-0");
  });
});
