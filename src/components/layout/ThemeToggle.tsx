"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/80 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700"
      aria-label={
        theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"
      }
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" aria-hidden="true" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" aria-hidden="true" />
    </button>
  );
}
