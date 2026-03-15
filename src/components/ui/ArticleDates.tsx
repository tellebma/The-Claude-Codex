import { Calendar, RefreshCw } from "lucide-react";

interface ArticleDatesProps {
  readonly datePublished?: string;
  readonly dateModified?: string;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Displays article publication and modification dates.
 * Only renders if at least one date is provided.
 */
export function ArticleDates({
  datePublished,
  dateModified,
}: ArticleDatesProps) {
  if (!datePublished && !dateModified) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
      {datePublished && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={datePublished}>
            Publié le {formatDate(datePublished)}
          </time>
        </span>
      )}
      {dateModified && dateModified !== datePublished && (
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={dateModified}>
            Mis à jour le {formatDate(dateModified)}
          </time>
        </span>
      )}
    </div>
  );
}
