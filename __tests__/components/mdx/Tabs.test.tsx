import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Tabs } from "@/components/mdx/Tabs";

const threeItems = [
  { label: "Tab A", content: <p>Content A</p> },
  { label: "Tab B", content: <p>Content B</p> },
  { label: "Tab C", content: <p>Content C</p> },
];

describe("Tabs", () => {
  it("returns null when items array is empty", () => {
    const { container } = render(<Tabs items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders all tab labels", () => {
    render(<Tabs items={threeItems} />);
    expect(screen.getByRole("tab", { name: "Tab A" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab B" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab C" })).toBeInTheDocument();
  });

  it("first tab is active by default (aria-selected=true)", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });

  it("only the active tab panel is visible, others are hidden", () => {
    render(<Tabs items={threeItems} />);
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels[0]).not.toHaveAttribute("hidden");
    expect(panels[1]).toHaveAttribute("hidden");
    expect(panels[2]).toHaveAttribute("hidden");
  });

  it("clicking a tab switches the active panel", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.click(tabs[1]);

    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels[1]).not.toHaveAttribute("hidden");
    expect(panels[0]).toHaveAttribute("hidden");
  });

  it("active tab has tabIndex 0, inactive tabs have tabIndex -1", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowRight moves focus to the next tab", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });

    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");
  });

  it("ArrowLeft moves focus to the previous tab", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");

    // Activate second tab first
    fireEvent.click(tabs[1]);
    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
  });

  it("Home key moves focus to the first tab", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.click(tabs[2]);
    fireEvent.keyDown(tabs[2], { key: "Home" });

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("End key moves focus to the last tab", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[0], { key: "End" });

    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowRight wraps from last tab to first tab", () => {
    render(<Tabs items={threeItems} />);
    const tabs = screen.getAllByRole("tab");

    // Move to last tab
    fireEvent.click(tabs[2]);
    // ArrowRight on last should wrap to first
    fireEvent.keyDown(tabs[2], { key: "ArrowRight" });

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("tab panels have correct aria-labelledby referencing their tab id", () => {
    render(<Tabs items={threeItems} />);
    const panels = screen.getAllByRole("tabpanel", { hidden: true });

    panels.forEach((panel, index) => {
      expect(panel).toHaveAttribute("aria-labelledby", `tab-${index}`);
      expect(panel).toHaveAttribute("id", `tabpanel-${index}`);
    });

    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab, index) => {
      expect(tab).toHaveAttribute("id", `tab-${index}`);
    });
  });
});
