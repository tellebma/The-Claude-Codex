import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => {
  function createTranslator() {
    const t = (key: string) => key;
    t.has = () => true;
    t.rich = (key: string) => key;
    t.raw = (key: string) => key;
    t.markup = (key: string) => key;
    return t;
  }
  return {
    useTranslations: () => createTranslator(),
    useLocale: () => "fr",
  };
});

// Mock @/i18n/navigation (used by most components)
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    const resolvedHref = typeof href === "object" ? "/" : href;
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock @/i18n/config
vi.mock("@/i18n/config", () => ({
  locales: ["fr", "en"] as const,
}));

// Mock next-intl/server (for server components imported in tests)
vi.mock("next-intl/server", () => ({
  getTranslations: () => (key: string) => key,
  setRequestLocale: () => {},
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

// Mock window.matchMedia (used by reduced-motion checks)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
