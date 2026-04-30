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
export function KeyboardShortcut({ keys, separator = "+" }: Readonly<KeyboardShortcutProps>) {
  const keyList = Array.isArray(keys) ? keys : String(keys).split(",").map((k) => k.trim());

  // <span> avec aria-label suffit : le raccourci est annoncé comme
  // un tout par les lecteurs d'écran. Le role="group" (S6819) était
  // redondant pour ce cas inline.
  return (
    <span
      className={`inline-flex items-center ${separator === " " ? "gap-2" : "gap-1"}`}
      aria-label={keyList.join(separator === "+" ? " + " : " then ")}
    >
      {keyList.map((key, index) => (
        <span key={`${key}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 && separator === "+" && (
            <span
              className="text-xs text-[color:var(--fg-muted)]"
              aria-hidden="true"
            >
              +
            </span>
          )}
          <kbd
            className="inline-flex items-center rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-2 py-0.5 font-mono text-sm text-[color:var(--fg-secondary)] shadow-sm"
          >
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
}
