"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { List } from "lucide-react";

interface TocHeading {
  readonly id: string;
  readonly text: string;
  readonly level: number;
}

function getHeadings(): ReadonlyArray<TocHeading> {
  const elements = document.querySelectorAll(
    "main h2[id], main h3[id]"
  );
  const headings: TocHeading[] = [];

  elements.forEach((el) => {
    const id = el.getAttribute("id");
    const text = el.textContent;
    if (id && text) {
      headings.push({
        id,
        text: text.trim(),
        level: el.tagName === "H2" ? 2 : 3,
      });
    }
  });

  return headings;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<ReadonlyArray<TocHeading>>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const updateHeadings = useCallback(() => {
    const found = getHeadings();
    setHeadings(found);
  }, []);

  useEffect(() => {
    updateHeadings();

    // Use MutationObserver to detect when headings are added/removed dynamically
    const mutationObserver = new MutationObserver(() => {
      updateHeadings();
    });

    const main = document.querySelector("main");
    if (main) {
      mutationObserver.observe(main, { childList: true, subtree: true });
    }

    return () => {
      mutationObserver.disconnect();
    };
  }, [updateHeadings]);

  useEffect(() => {
    if (headings.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const callback: IntersectionObserverCallback = (entries) => {
      // Find the first heading that is intersecting
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by position in the document (top of viewport)
        const sorted = [...visibleEntries].sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        const id = sorted[0].target.getAttribute("id");
        if (id) {
          setActiveId(id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) {
        observerRef.current?.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Table des matieres"
      className="hidden xl:block"
    >
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
          <List className="h-3.5 w-3.5" aria-hidden="true" />
          Sur cette page
        </div>
        <ul className="space-y-1 border-l border-slate-200 dark:border-slate-700">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.id);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                      // Update URL hash without jumping
                      window.history.replaceState(null, "", `#${heading.id}`);
                    }
                  }}
                  aria-current={isActive ? "location" : undefined}
                  className={`block border-l-2 py-1 text-sm transition-colors ${
                    heading.level === 3 ? "pl-6" : "pl-4"
                  } ${
                    isActive
                      ? "-ml-px border-brand-500 font-medium text-brand-700 dark:text-brand-400"
                      : "-ml-px border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
