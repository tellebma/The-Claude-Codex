import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionLayout } from "@/components/layout/SectionLayout";

vi.mock("@/components/ui/Breadcrumb", () => ({
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));
vi.mock("@/components/ui/ScrollToTop", () => ({
  ScrollToTop: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}));
vi.mock("@/components/ui/TableOfContents", () => ({
  TableOfContents: () => <div data-testid="toc">TableOfContents</div>,
}));
vi.mock("@/components/layout/SectionSidebar", () => ({
  SectionSidebar: () => <div data-testid="sidebar">SectionSidebar</div>,
}));

describe("SectionLayout", () => {
  it("renders children content", () => {
    render(
      <SectionLayout>
        <p data-testid="child-content">Hello from children</p>
      </SectionLayout>
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Hello from children")).toBeInTheDocument();
  });

  it("includes Breadcrumb component", () => {
    render(
      <SectionLayout>
        <div>content</div>
      </SectionLayout>
    );
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
  });

  it("includes SectionSidebar component", () => {
    render(
      <SectionLayout>
        <div>content</div>
      </SectionLayout>
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("includes TableOfContents component", () => {
    render(
      <SectionLayout>
        <div>content</div>
      </SectionLayout>
    );
    expect(screen.getByTestId("toc")).toBeInTheDocument();
  });

  it("includes ScrollToTop component", () => {
    render(
      <SectionLayout>
        <div>content</div>
      </SectionLayout>
    );
    expect(screen.getByTestId("scroll-to-top")).toBeInTheDocument();
  });
});
