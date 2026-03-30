interface KeyboardShortcutProps {
  readonly keys: readonly string[] | string;
  readonly separator?: "+" | " ";
}

/**
 * Renders a keyboard shortcut as styled <kbd> elements.
 * Inline component suitable for use within paragraphs.
 *
 * Examples:
 *   <KeyboardShortcut keys={["Ctrl", "C"]} />          → Ctrl + C
 *   <KeyboardShortcut keys={["Esc", "Esc"]} separator=" " /> → Esc  Esc
 */
export function KeyboardShortcut({ keys, separator = "+" }: KeyboardShortcutProps) {
  const keyList = Array.isArray(keys) ? keys : String(keys).split(",").map((k) => k.trim());

  return (
    <span
      className={`inline-flex items-center ${separator === " " ? "gap-2" : "gap-1"}`}
      role="group"
      aria-label={keyList.join(separator === "+" ? " + " : " then ")}
    >
      {keyList.map((key, index) => (
        <span key={`${key}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 && separator === "+" && (
            <span
              className="text-xs text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            >
              +
            </span>
          )}
          <kbd
            className="inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-sm shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
}
