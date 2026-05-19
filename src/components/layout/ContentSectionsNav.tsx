"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * CTN-14 — Navigation sticky inter-sections pour la vitrine `/content/`
 * redessinee (EPIC Content page redesign).
 *
 * Rend deux variantes en parallele controlees par Tailwind responsive :
 *
 * - `>= xl` : TOC laterale flottante (rail droit), sticky `top: 96px`,
 *   largeur 192 px, dot indicator sur l'item actif.
 * - `< xl` : tab bar horizontale sticky `top: 64px` (sous le header
 *   z-50), chips compacts cliquables.
 *
 * Scroll-spy via une instance unique d'IntersectionObserver partagee :
 * `rootMargin: "-72px 0px -60% 0px"`, `threshold: 0`. L'item actif est
 * mis a jour quand la section correspondante entre dans la zone active.
 *
 * Au clic, scroll smooth + focus programmatique sur le `<h2>` cible
 * (necessite `tabIndex={-1}` sur les H2 cote consommateur). Si
 * `prefers-reduced-motion`, `behavior: "auto"`.
 *
 * Cf. `docs/epics/2026-05-content-redesign/design-decisions.md` (CTN-14).
 */

export interface ContentSectionsNavItem {
  /** ID HTML de la section cible (sans le `#`). */
  readonly id: string;
  /** Libelle affiche (deja localise cote consommateur). */
  readonly label: string;
}

export interface ContentSectionsNavProps {
  readonly sections: ReadonlyArray<ContentSectionsNavItem>;
  /** aria-label localise. Defaut : "Navigation des sections". */
  readonly ariaLabel?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ContentSectionsNav({
  sections,
  ariaLabel = "Navigation des sections",
}: Readonly<ContentSectionsNavProps>) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // On garde la derniere entree intersectee comme active.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first?.target?.id) {
          setActiveId(first.target.id);
        }
      },
      {
        rootMargin: "-72px 0px -60% 0px",
        threshold: 0,
      },
    );
    observerRef.current = observer;

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [sections]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    event.preventDefault();
    const behavior: ScrollBehavior = prefersReducedMotion()
      ? "auto"
      : "smooth";
    target.scrollIntoView({ behavior, block: "start" });
    // Focus programmatique pour l'a11y : requiert tabIndex={-1} sur la cible.
    window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
    // Mise a jour optimiste de l'item actif (sans attendre l'observer).
    setActiveId(sectionId);
  };

  if (sections.length === 0) return null;

  return (
    <>
      {/* Variant >= xl : TOC laterale sticky */}
      <nav
        aria-label={ariaLabel}
        className="hidden xl:block"
      >
        <div className="sticky top-24 w-48">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
            {ariaLabel}
          </h2>
          <ul className="space-y-1">
            {sections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => handleClick(e, section.id)}
                    className={clsx(
                      "flex items-center gap-3 rounded-md py-2 pl-2 pr-3 text-sm transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                      isActive
                        ? "font-semibold text-[color:var(--fg-primary)]"
                        : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg-primary)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "inline-block h-2 w-2 rounded-full border transition-colors duration-[var(--duration-fast)]",
                        isActive
                          ? "border-[color:var(--brand-primary)] bg-[color:var(--brand-primary)]"
                          : "border-[color:var(--border-default)] bg-transparent",
                      )}
                    />
                    <span>{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Variant < xl : tab bar horizontale sticky */}
      <nav
        aria-label={ariaLabel}
        className="sticky top-16 z-30 -mx-4 border-b border-[color:var(--border-default)] bg-[color:var(--bg-page)]/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:hidden"
      >
        <ul className="scrollbar-hide flex h-12 items-center gap-1 overflow-x-auto">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => handleClick(e, section.id)}
                  className={clsx(
                    "inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                    isActive
                      ? "bg-brand-500/10 text-[color:var(--brand-primary)]"
                      : "text-[color:var(--fg-secondary)] hover:text-[color:var(--fg-primary)]",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
