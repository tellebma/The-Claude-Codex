import clsx from "clsx";
import { Check, X, Minus } from "lucide-react";

interface ComparisonColumn {
  readonly key: string;
  readonly label: string;
  readonly recommended?: boolean;
}

/**
 * Cell value : les 3 littéraux ci-dessous sont des icônes spéciales
 * (yes/no/partial) — toute autre chaîne est rendue en texte brut.
 * Le type est un string simple : TypeScript n'offre pas de narrowing
 * utile pour ce use-case et le switch/case dans CellValue gère le
 * dispatch à runtime.
 */
type ComparisonCellValue = string;

interface ComparisonRow {
  readonly feature: string;
  readonly values: Record<string, ComparisonCellValue>;
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
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full border-collapse text-sm" role="table">
        {caption && (
          <caption className="px-4 pb-3 pt-2 text-left text-sm text-slate-500 dark:text-slate-400 caption-bottom">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {/* Feature column header */}
            <th
              scope="col"
              className={clsx(
                "sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900",
                "dark:border-slate-700 dark:bg-slate-800 dark:text-white",
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
                  "border-b border-slate-200 px-4 py-3 text-center font-semibold",
                  "dark:border-slate-700",
                  "min-w-[120px]",
                  col.recommended
                    ? "bg-brand-50 text-brand-900 dark:bg-brand-950/30 dark:text-brand-200"
                    : "bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-white"
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.recommended && (
                    <span className="inline-flex items-center rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white">
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
                "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                rowIndex < rows.length - 1 && "border-b border-slate-200 dark:border-slate-700"
              )}
            >
              {/* Feature name, sticky on mobile */}
              <th
                scope="row"
                className={clsx(
                  "sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-3 text-left font-medium text-slate-700",
                  "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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
                      "px-4 py-3 text-center text-slate-600 dark:text-slate-300",
                      col.recommended && "bg-brand-50/50 dark:bg-brand-950/20"
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
