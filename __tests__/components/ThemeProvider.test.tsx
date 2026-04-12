import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

// Mock next-themes to verify it receives correct props
const mockNextThemesProvider = vi.fn(({ children }: { children: React.ReactNode }) => (
  <div data-testid="theme-provider">{children}</div>
));

vi.mock("next-themes", () => ({
  ThemeProvider: (props: { children: React.ReactNode } & Record<string, unknown>) => mockNextThemesProvider(props),
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <span>Content</span>
      </ThemeProvider>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("passes correct props to NextThemesProvider", () => {
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    );
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: "class",
        defaultTheme: "dark",
        enableSystem: true,
      })
    );
  });
});
