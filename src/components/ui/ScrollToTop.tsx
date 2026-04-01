"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

const SCROLL_THRESHOLD = 300;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("common");

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "instant" : "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={t("scrollToTop")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-slate-100 dark:border-slate-700/50 dark:bg-slate-800/90 dark:hover:bg-slate-700 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4 text-slate-700 dark:text-slate-300" aria-hidden="true" />
    </button>
  );
}
