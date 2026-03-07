"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbSegment {
  readonly label: string;
  readonly href: string;
}

const SECTION_LABELS: Readonly<Record<string, string>> = {
  "getting-started": "Demarrer",
  mcp: "MCP",
  plugins: "Plugins",
  skills: "Skills",
  agents: "Agents",
  prompting: "Prompting",
  future: "Vision",
  configurator: "Configurateur",
};

function buildBreadcrumbs(pathname: string): ReadonlyArray<BreadcrumbSegment> {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label =
      SECTION_LABELS[segment] ??
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400"
            aria-label="Accueil"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              <ChevronRight
                className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600"
                aria-hidden="true"
              />
              {isLast ? (
                <span
                  className="font-medium text-slate-900 dark:text-white"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
