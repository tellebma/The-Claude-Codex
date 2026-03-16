"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { SearchDialog } from "@/components/ui/SearchDialog";
import clsx from "clsx";

const primaryNavKeys = [
  { key: "gettingStarted", href: "/getting-started" },
  { key: "mcp", href: "/mcp" },
  { key: "skills", href: "/skills" },
  { key: "prompting", href: "/prompting" },
  { key: "useCases", href: "/use-cases" },
  { key: "personas", href: "/personas" },
  { key: "enterprise", href: "/enterprise" },
  { key: "advanced", href: "/advanced" },
  { key: "configurator", href: "/configurator" },
] as const;

const secondaryNavKeys = [
  { key: "content", href: "/content" },
  { key: "limits", href: "/limits" },
  { key: "reference", href: "/reference" },
  { key: "glossary", href: "/glossary" },
  { key: "future", href: "/future" },
] as const;

const allNavKeys = [...primaryNavKeys, ...secondaryNavKeys];

const MOBILE_MENU_ID = "mobile-nav-menu";

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const isSecondaryActive = secondaryNavKeys.some(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(item.href + "/")
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "inline-flex min-h-[44px] items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isSecondaryActive
            ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t("more")}
        <ChevronDown
          className={clsx(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-200/60 bg-white/95 py-1 shadow-lg backdrop-blur dark:border-slate-700/40 dark:bg-slate-800/95">
          {secondaryNavKeys.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex min-h-[44px] items-center px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-500/10 text-brand-700 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("navigation");

  return (
    <header className="glass sticky top-0 z-50">
      <nav
        aria-label={t("mainNav")}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1800px]"
      >
        <Link
          href="/"
          aria-label="The Claude Codex"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <Logo />
          <span className="hidden sm:inline" aria-hidden="true">
            The Claude <span className="text-gradient">Codex</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryNavKeys.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <MoreDropdown />
        </div>

        <div className="flex items-center gap-2">
          <SearchDialog />
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white/80 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700 lg:hidden"
            aria-label={t("menuToggle")}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <div
        id={MOBILE_MENU_ID}
        className={clsx(
          "overflow-hidden border-t border-slate-200/50 transition-all duration-300 dark:border-slate-700/50 lg:hidden",
          mobileOpen ? "max-h-[30rem]" : "max-h-0"
        )}
        {...(!mobileOpen ? { inert: "" as unknown as boolean } : {})}
        aria-hidden={!mobileOpen}
      >
        <div className="space-y-1 px-4 py-3">
          {allNavKeys.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "block rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
