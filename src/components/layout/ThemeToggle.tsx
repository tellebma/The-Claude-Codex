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
      className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white/80 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700"
      aria-label={
        theme === "dark" ? t("lightMode") : t("darkMode")
      }
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" aria-hidden="true" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" aria-hidden="true" />
    </button>
  );
}
