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
    <div className="my-6 overflow-hidden rounded-xl border border-[color:var(--border-subtle)]">
      {/* Tab headers */}
      <div
        className="flex border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]"
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
                ? "border-b-2 border-brand-500 text-[color:var(--brand-primary)]"
                : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg-secondary)]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content : transition opacity + translateY via tokens motion (RG-15 AC) */}
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={item.label}
            id={`tabpanel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            hidden={!isActive}
            className="p-4 sm:p-6"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(0.25rem)",
              transitionProperty: "opacity, transform",
              transitionDuration: "var(--duration-fast)",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
