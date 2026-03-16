"use client";

import { Link } from "@/i18n/navigation";
import {
  Home,
  BookOpen,
  Puzzle,
  MessageSquare,
  Search,
  Terminal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { NotFoundAnimation } from "@/components/ui/NotFoundAnimation";

export default function NotFound() {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navigation");

  const suggestedLinks = [
    {
      name: tCommon("home"),
      href: "/",
      icon: Home,
      description: tCommon("backToHome"),
    },
    {
      name: tNav("gettingStarted"),
      href: "/getting-started",
      icon: BookOpen,
      description: "",
    },
    {
      name: tNav("mcp"),
      href: "/mcp",
      icon: Puzzle,
      description: "",
    },
    {
      name: tNav("prompting"),
      href: "/prompting",
      icon: MessageSquare,
      description: "",
    },
  ];

  return (
    <section className="relative flex min-h-[calc(100vh-8rem)] items-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, var(--gradient-hero-radial-1), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, var(--gradient-hero-radial-2), transparent 60%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        {/* Animated terminal icon */}
        <NotFoundAnimation>
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25 sm:h-24 sm:w-24">
            <Terminal
              className="h-10 w-10 text-white sm:h-12 sm:w-12"
              aria-hidden="true"
            />
          </div>
        </NotFoundAnimation>

        {/* Error code */}
        <p className="text-6xl font-extrabold tracking-tight sm:text-8xl">
          <span className="text-gradient">404</span>
        </p>

        {/* Message */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {tCommon("pageNotFound")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-slate-600 dark:text-slate-300 sm:text-lg">
          {tCommon("pageNotFoundDescription")}
        </p>

        {/* Search hint */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/60 px-4 py-3 text-sm text-slate-500 backdrop-blur dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-300">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-xs font-medium text-slate-700 dark:bg-slate-700/80 dark:text-slate-300">
              Ctrl+K
            </kbd>
          </span>
        </div>

        {/* Navigation cards */}
        <nav
          aria-label={tCommon("pageNotFound")}
          className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2"
        >
          {suggestedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-left backdrop-blur transition-all hover:border-brand-300 hover:bg-white hover:shadow-md dark:border-slate-700/40 dark:bg-slate-800/40 dark:hover:border-brand-600 dark:hover:bg-slate-800/70"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-700 transition-colors group-hover:bg-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400">
                <link.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {link.name}
                </p>
                {link.description && (
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-300">
                    {link.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Back to home CTA */}
        <div className="mt-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            {tCommon("backToHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
