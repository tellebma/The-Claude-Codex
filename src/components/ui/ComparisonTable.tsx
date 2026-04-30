import clsx from "clsx";
import { Check, X, Minus } from "lucide-react";

interface ComparisonColumn {
  readonly key: string;
  readonly label: string;
  readonly recommended?: boolean;
}

interface ComparisonRow {
  readonly feature: string;
  /**
   * Cell value : 3 littéraux spéciaux sont rendus en icône
   * (yes → ✓ vert, no → ✗ rouge, partial → ~ ambre). Toute autre
   * chaîne est rendue en texte brut. Le switch/case dans CellValue
   * fait le dispatch à runtime — pas de narrowing TypeScript utile
   * ici, donc on type simplement en string.
   */
  readonly values: Record<string, string>;
}

interface ComparisonTableProps {
  readonly columns: readonly ComparisonColumn[];
  readonly rows: readonly ComparisonRow[];
  readonly caption?: string;
}

/**
 * Renders a cell value as an icon or plain text.
 * - "yes"     : green checkmark
 * - "no"      : red cross
 * - "partial" : orange tilde
 * - anything else : raw text
 */
function CellValue({ value }: { readonly value: string }) {
  switch (value) {
    case "yes":
      return (
        <span className="inline-flex items-center justify-center" aria-label="Oui">
          <Check
            className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
        </span>
      );
    case "no":
      return (
        <span className="inline-flex items-center justify-center" aria-label="Non">
          <X
            className="h-5 w-5 text-red-500 dark:text-red-400"
            aria-hidden="true"
          />
        </span>
      );
    case "partial":
      return (
        <span className="inline-flex items-center justify-center" aria-label="Partiel">
          <Minus
            className="h-5 w-5 text-amber-500 dark:text-amber-400"
            aria-hidden="true"
          />
        </span>
      );
    default:
      return <span>{value}</span>;
  }
}

/**
 * Comparison table for MDX content.
 *
 * Displays a feature-by-feature comparison across multiple columns.
 * One column can be marked as "recommended" and receives a brand-tinted
 * background to stand out.
 *
 * Responsive: on screens narrower than md, the table scrolls horizontally
 * with the feature column sticky on the left.
 *
 * Accessibility: uses native <table> with scope attributes on headers,
 * aria-labels on icon cells, and a <caption> when provided.
 *
 * Usage in MDX:
 *   <ComparisonTable
 *     columns={[
 *       { key: "a", label: "Option A", recommended: true },
 *       { key: "b", label: "Option B" },
 *     ]}
 *     rows={[
 *       { feature: "Fast", values: { a: "yes", b: "no" } },
 *       { feature: "Free", values: { a: "partial", b: "yes" } },
 *     ]}
 *     caption="Comparaison des options"
 *   />
 */
export function ComparisonTable({ columns, rows, caption }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-[color:var(--border-default)]">
      <table className="w-full border-collapse text-sm" role="table">
        {caption && (
          <caption className="px-4 pb-3 pt-2 text-left text-sm text-[color:var(--fg-muted)] caption-bottom">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {/* Feature column header */}
            <th
              scope="col"
              className={clsx(
                "sticky left-0 z-10 border-b border-r border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-3 text-left font-semibold text-[color:var(--fg-primary)]",
                "min-w-[140px]"
              )}
            >
              <span className="sr-only">Fonctionnalit&eacute;</span>
            </th>

            {/* Value column headers */}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={clsx(
                  "border-b border-[color:var(--border-default)] px-4 py-3 text-center font-semibold",
                  "min-w-[120px]",
                  col.recommended
                    ? "bg-brand-500/10 text-[color:var(--brand-primary)]"
                    : "bg-[color:var(--bg-subtle)] text-[color:var(--fg-primary)]"
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.recommended && (
                    <span className="inline-flex items-center rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-[color:var(--fg-on-brand)]">
                      rec.
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.feature}
              className={clsx(
                "transition-colors hover:bg-[color:var(--bg-subtle)]",
                rowIndex < rows.length - 1 && "border-b border-[color:var(--border-default)]"
              )}
            >
              {/* Feature name, sticky on mobile */}
              <th
                scope="row"
                className={clsx(
                  "sticky left-0 z-10 border-r border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-4 py-3 text-left font-medium text-[color:var(--fg-secondary)]"
                )}
              >
                {row.feature}
              </th>

              {/* Value cells */}
              {columns.map((col) => {
                const value = row.values[col.key] ?? "";
                return (
                  <td
                    key={col.key}
                    className={clsx(
                      "px-4 py-3 text-center text-[color:var(--fg-secondary)]",
                      col.recommended && "bg-brand-500/5"
                    )}
                  >
                    <CellValue value={value} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
