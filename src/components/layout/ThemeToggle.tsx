"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-11 w-11" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--fg-primary)] hover:bg-[color:var(--bg-subtle)]"
      style={{
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "var(--duration-base)",
        transitionTimingFunction: "var(--ease-out)",
      }}
      aria-label={
        theme === "dark" ? t("lightMode") : t("darkMode")
      }
    >
      <Sun
        className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
        style={{
          transitionProperty: "transform",
          transitionDuration: "var(--duration-base)",
          transitionTimingFunction: "var(--ease-out)",
        }}
        aria-hidden="true"
      />
      <Moon
        className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100"
        style={{
          transitionProperty: "transform",
          transitionDuration: "var(--duration-base)",
          transitionTimingFunction: "var(--ease-out)",
        }}
        aria-hidden="true"
      />
    </button>
  );
}
