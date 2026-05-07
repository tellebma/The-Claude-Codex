import { Calendar, RefreshCw } from "lucide-react";

interface ArticleHeroProps {
  readonly category?: string;
  readonly title: string;
  readonly /** Optional gradient-highlighted suffix of the title (after a line break). */ titleHighlight?: string;
  readonly lead?: string;
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly publishedLabel?: string;
  readonly modifiedLabel?: string;
  readonly themeBadges?: React.ReactNode;
}

/**
 * RG2-01 — Article hero editorial.
 *
 * Reproduit `.art-hero` du design source : pill categorie pulsante, titre
 * massif (clamp 36-60px / 800 / -0.03em), lead 21px secondaire, meta
 * (auteur + dates).
 *
 * Atmosphere : `::before` halos rouges/ambres + linear soft, `::after`
 * grid pattern subtil avec mask radial. Le tout via les variables
 * `--art-hero-bg-*` exposees dans globals.css (light + dark).
 *
 * Source : `design-source/.../article.css` `.art-hero`, `.art-cat-pill`,
 * `.art-title`, `.art-lead`, `.art-meta`.
 */
export function ArticleHero({
  category,
  title,
  titleHighlight,
  lead,
  datePublished,
  dateModified,
  publishedLabel = "Publié",
  modifiedLabel = "Mis à jour",
  themeBadges,
}: ArticleHeroProps) {
  const formattedPublished = datePublished
    ? formatDate(datePublished)
    : null;
  const formattedModified =
    dateModified && dateModified !== datePublished
      ? formatDate(dateModified)
      : null;

  return (
    <header className="art-hero">
      <div className="art-hero-inner">
        {category && (
          <span className="art-cat-pill">
            <span aria-hidden="true" className="art-cat-pill-dot" />
            {category}
          </span>
        )}
        <h1 className="art-title">
          {titleHighlight ? (
            <>
              {title}
              <br />
              <span className="art-title-hl">{titleHighlight}</span>
            </>
          ) : (
            title
          )}
        </h1>
        {lead && <p className="art-lead">{lead}</p>}
        {themeBadges && <div className="mt-6">{themeBadges}</div>}
        {(formattedPublished || formattedModified) && (
          <div className="art-meta">
            <div className="art-meta-dates">
              {formattedPublished && (
                <span className="art-meta-date">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>
                    {publishedLabel} <time dateTime={datePublished}>{formattedPublished}</time>
                  </span>
                </span>
              )}
              {formattedModified && (
                <span className="art-meta-date">
                  <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>
                    {modifiedLabel} <time dateTime={dateModified}>{formattedModified}</time>
                  </span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
