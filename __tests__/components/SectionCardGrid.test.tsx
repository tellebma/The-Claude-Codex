import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("framer-motion", () => {
  const ReactLib = require("react");
  const motion = new Proxy(
    {},
    {
      get: (_target: object, prop: string | symbol) => {
        if (typeof prop !== "string") return undefined;
        return ReactLib.forwardRef(
          (props: Record<string, unknown>, ref: React.Ref<unknown>) => {
            const { initial, animate, variants, style, ...rest } = props;
            return ReactLib.createElement(prop, { ...rest, ref, style });
          },
        );
      },
    },
  );
  return {
    motion,
    useInView: vi.fn(() => true),
    useReducedMotion: vi.fn(() => false),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

import { Shield, DollarSign, GitBranch } from "lucide-react";
import {
  SectionCardGrid,
  type SectionCardItem,
} from "@/components/layout/SectionCardGrid";

const items: ReadonlyArray<SectionCardItem> = [
  {
    href: "/content/a",
    icon: Shield,
    title: "Securite",
    description: "Proteger ses cles.",
    color: "brand",
    step: "01",
  },
  {
    href: "/content/b",
    icon: DollarSign,
    title: "Couts",
    description: "Comprendre la facture.",
    color: "accent",
    badge: "NEW",
  },
  {
    href: "/content/c",
    icon: GitBranch,
    title: "CI/CD",
    description: "Integrer dans la pipeline.",
    color: "emerald",
  },
  {
    href: "/content/d",
    icon: Shield,
    title: "Quatrieme",
    description: "Un quatrieme guide.",
    color: "brand",
  },
];

function gridEl(container: HTMLElement): HTMLElement {
  const grid = container.querySelector("div.grid");
  if (!grid) throw new Error("grid container not found");
  return grid as HTMLElement;
}

describe("SectionCardGrid", () => {
  it("renders every item with title, description, cta and href", () => {
    render(<SectionCardGrid items={items} cta="Lire le guide" />);
    expect(screen.getByText("Securite")).toBeInTheDocument();
    expect(screen.getByText("Proteger ses cles.")).toBeInTheDocument();
    expect(screen.getAllByText("Lire le guide")).toHaveLength(items.length);
    const link = screen.getByText("Securite").closest("a");
    expect(link).toHaveAttribute("href", "/content/a");
  });

  it("defaults to 3 columns for 4+ items", () => {
    const { container } = render(
      <SectionCardGrid items={items} cta="Lire" />,
    );
    expect(gridEl(container).className).toContain("lg:grid-cols-3");
  });

  it("defaults to 2 columns for fewer than 4 items", () => {
    const { container } = render(
      <SectionCardGrid items={items.slice(0, 2)} cta="Lire" />,
    );
    expect(gridEl(container).className).toContain("lg:grid-cols-2");
  });

  it("honours an explicit columns prop", () => {
    const { container } = render(
      <SectionCardGrid items={items} columns={2} cta="Lire" />,
    );
    expect(gridEl(container).className).toContain("lg:grid-cols-2");
  });

  it("renders a badge only when provided", () => {
    render(<SectionCardGrid items={items} cta="Lire" />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("renders a step only when provided", () => {
    render(<SectionCardGrid items={items} cta="Lire" />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders cards without animation when animate is false", () => {
    render(<SectionCardGrid items={items} cta="Lire" animate={false} />);
    expect(screen.getByText("CI/CD")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(items.length);
  });
});
