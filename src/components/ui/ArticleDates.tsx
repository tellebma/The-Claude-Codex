import { Calendar, RefreshCw } from "lucide-react";

interface ArticleDatesProps {
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly publishedLabel?: string;
  readonly modifiedLabel?: string;
  /** Locale BCP-47 used to format dates (default "fr-FR"). */
  readonly locale?: string;
}

function formatDate(dateStr: string, locale: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale, {
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
  publishedLabel = "Publié le",
  modifiedLabel = "Mis à jour le",
  locale = "fr-FR",
}: ArticleDatesProps) {
  if (!datePublished && !dateModified) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
      {datePublished && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={datePublished}>
            {publishedLabel} {formatDate(datePublished, locale)}
          </time>
        </span>
      )}
      {dateModified && dateModified !== datePublished && (
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={dateModified}>
            {modifiedLabel} {formatDate(dateModified, locale)}
          </time>
        </span>
      )}
    </div>
  );
}
