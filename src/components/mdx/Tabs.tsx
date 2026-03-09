"use client";

import { useState, useCallback, useRef } from "react";
import clsx from "clsx";

interface TabItem {
  readonly label: string;
  readonly content: React.ReactNode;
}

interface TabsProps {
  readonly items: ReadonlyArray<TabItem>;
}

/**
 * Accessible tab component following WAI-ARIA Authoring Practices 1.1.
 * Keyboard navigation: Arrow keys move between tabs, Home/End jump to first/last.
 * Uses roving tabIndex pattern: only the active tab is in the tab order.
 */
export function Tabs({ items }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      const lastIndex = items.length - 1;
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          focusTab(currentIndex < lastIndex ? currentIndex + 1 : 0);
          break;
        case "ArrowLeft":
          event.preventDefault();
          focusTab(currentIndex > 0 ? currentIndex - 1 : lastIndex);
          break;
        case "Home":
          event.preventDefault();
          focusTab(0);
          break;
        case "End":
          event.preventDefault();
          focusTab(lastIndex);
          break;
        default:
          break;
      }
    },
    [items.length, focusTab]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      {/* Tab headers */}
      <div
        className="flex border-b border-slate-200/50 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-800/50"
        role="tablist"
      >
        {items.map((item, index) => (
          <button
            key={item.label}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={clsx(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeIndex === index
                ? "border-b-2 border-brand-500 text-brand-700 dark:text-brand-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {items.map((item, index) => (
        <div
          key={item.label}
          id={`tabpanel-${index}`}
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          hidden={activeIndex !== index}
          className="p-4 sm:p-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
