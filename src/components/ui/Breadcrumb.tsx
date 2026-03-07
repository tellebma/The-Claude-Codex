"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Home } from "lucide-react";
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

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

/**
 * Renders a breadcrumb navigation with schema.org BreadcrumbList JSON-LD.
 * The JSON-LD content is safe: it is built from our own static labels
 * serialized via JSON.stringify — no user-supplied HTML is involved.
 */
export function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(
    () => (pathname === "/" ? [] : buildBreadcrumbs(pathname)),
    [pathname]
  );

  const breadcrumbJsonLd = useMemo(() => {
    if (breadcrumbs.length === 0) return null;

    const items = [
      { name: "Accueil", href: "/" },
      ...breadcrumbs.map((crumb) => ({
        name: crumb.label,
        href: crumb.href,
      })),
    ];

    return serializeJsonLd(createBreadcrumbSchema(items));
  }, [breadcrumbs]);

  if (pathname === "/" || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <>
      {/* JSON-LD: content is safe — serialized from static schema, no user HTML */}
      {breadcrumbJsonLd !== null && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- safe: JSON.stringify of static schema
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
      )}
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
    </>
  );
}
