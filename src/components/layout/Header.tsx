"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  { key: "enterprise", href: "/enterprise" },
] as const;

const secondaryNavKeys = [
  { key: "personas", href: "/personas" },
  { key: "advanced", href: "/advanced" },
  { key: "configurator", href: "/configurator" },
  { key: "content", href: "/content" },
  { key: "limits", href: "/limits" },
  { key: "reference", href: "/reference" },
  { key: "glossary", href: "/glossary" },
  { key: "future", href: "/future" },
] as const;

const allNavKeys = [...primaryNavKeys, ...secondaryNavKeys];

const MOBILE_MENU_ID = "mobile-nav-menu";

// Classes communes pour les items de navigation. On centralise pour reduire la
// duplication et eviter les divergences entre nav desktop / dropdown / mobile.
const NAV_ITEM_BASE =
  "inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const NAV_ITEM_ACTIVE =
  "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300";
const NAV_ITEM_INACTIVE =
  "text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]";

type IsActive = (href: string) => boolean;

function makeIsActive(pathname: string): IsActive {
  return (href) => pathname === href || pathname.startsWith(href + "/");
}

// Handler clavier du bouton "More" : extrait pour rester sous le seuil de
// complexite cognitive S3776.
function handleMoreButtonKey(
  event: React.KeyboardEvent,
  setOpen: (next: boolean) => void
): void {
  const openKeys = ["ArrowDown", "Enter", " "];
  if (openKeys.includes(event.key)) {
    event.preventDefault();
    setOpen(true);
    return;
  }
  if (event.key === "Escape") {
    setOpen(false);
  }
}

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const isActive = makeIsActive(pathname);
  const isSecondaryActive = secondaryNavKeys.some((item) => isActive(item.href));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus first menuitem when menu opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        menuItemRefs.current[0]?.focus();
      });
    }
  }, [open]);

  const handleMenuKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = menuItemRefs.current.filter(
      (el): el is HTMLAnchorElement => el !== null
    );
    const count = items.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(index + 1) % count]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(index - 1 + count) % count]?.focus();
        break;
      case "Home":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        items[count - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => handleMoreButtonKey(e, setOpen)}
        className={clsx(
          NAV_ITEM_BASE,
          "gap-1",
          isSecondaryActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
        )}
        aria-expanded={open}
        aria-haspopup="menu"
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
        <div
          role="menu"
          aria-label={t("more")}
          className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-lg)] backdrop-blur"
        >
          {secondaryNavKeys.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el: HTMLAnchorElement | null) => {
                  menuItemRefs.current[index] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                onKeyDown={(e: React.KeyboardEvent) =>
                  handleMenuKeyDown(e, index)
                }
                className={clsx(
                  "flex min-h-[44px] items-center px-4 text-sm font-medium transition-colors",
                  active ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const isActive = makeIsActive(pathname);

  // Focus first link when mobile menu opens
  useEffect(() => {
    if (mobileOpen) {
      const firstLink = mobileMenuRef.current?.querySelector("a");
      if (firstLink) {
        requestAnimationFrame(() => {
          (firstLink as HTMLElement).focus();
        });
      }
    }
  }, [mobileOpen]);

  // Fermeture du menu mobile sur Escape : completion du focus trap deja
  // fourni par `inert={!mobileOpen}` sur le conteneur.
  useEffect(() => {
    if (!mobileOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        requestAnimationFrame(() => mobileToggleRef.current?.focus());
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => {
      if (prev) {
        // Closing: focus back to toggle button
        requestAnimationFrame(() => mobileToggleRef.current?.focus());
      }
      return !prev;
    });
  }, []);

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
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  NAV_ITEM_BASE,
                  "relative",
                  active ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE,
                  // Underline brand pour renforcer l'indication d'item actif
                  active &&
                    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-500"
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
            ref={mobileToggleRef}
            onClick={toggleMobile}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--fg-primary)] transition-colors hover:bg-[var(--bg-subtle)] lg:hidden"
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
        ref={mobileMenuRef}
        className={clsx(
          "overflow-hidden border-t border-[var(--border-subtle)] transition-all duration-300 lg:hidden",
          mobileOpen
            ? "max-h-[calc(100vh-4rem)] overflow-y-auto"
            : "max-h-0"
        )}
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
      >
        <div className="space-y-1 px-4 py-3">
          {allNavKeys.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex min-h-[44px] items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  active ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
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
