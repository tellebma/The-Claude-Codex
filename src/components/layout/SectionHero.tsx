import { Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeroProps {
  /** Pill catégorie en haut (badge texte court avec dot pulsant). */
  readonly category: string;
  /** Icône Lucide à afficher dans la pill (optionnel — défaut Sparkles). */
  readonly categoryIcon?: LucideIcon;
  /** Titre principal (sans le morceau highlight). */
  readonly title: string;
  /** Suffixe du titre rendu en gradient (saut de ligne ou inline selon `highlightInline`). */
  readonly titleHighlight?: string;
  /** Si true, le highlight reste sur la même ligne ; sinon saut de ligne (défaut false). */
  readonly highlightInline?: boolean;
  /** Sous-titre long (lead, secondaire). */
  readonly lead: string;
  /** Variante de fond : "dark" (gradient-hero, défaut) ou "soft" (slate-50 / slate-950). */
  readonly tone?: "dark" | "soft";
  /** Compteur optionnel à afficher en meta sous le lead (ex: "6 guides"). */
  readonly count?: string;
  /**
   * Slot d'actions optionnel rendu sous le lead/count (ex: boutons CTA).
   * Extension par rapport à la spec POL-1 pour conserver les CTA de `/content/`,
   * sur le même principe que le slot `themeBadges` de `<ArticleHero>`.
   */
  readonly actions?: ReactNode;
}

/**
 * POL-1 — Section hero éditorial.
 *
 * Composant soeur de `<ArticleHero>` pour les pages landing de section.
 * Reprend l'identité du gold standard : pill catégorie pulsante, titre massif
 * (clamp 2.5-4.5rem / 800 / -0.03em), lead secondaire, atmosphère CSS cyan/ambre.
 *
 * Atmosphère via les classes `.sec-hero*` et les variables `--sec-hero-*` /
 * `--sec-cat-pill-*` exposées dans globals.css (light + dark, tone dark + soft).
 */
export function SectionHero({
  category,
  categoryIcon: CategoryIcon = Sparkles,
  title,
  titleHighlight,
  highlightInline = false,
  lead,
  tone = "dark",
  count,
  actions,
}: Readonly<SectionHeroProps>) {
  return (
    <header className="sec-hero" data-tone={tone}>
      <div className="sec-hero-inner">
        <span className="sec-cat-pill">
          <CategoryIcon aria-hidden="true" className="h-3.5 w-3.5" />
          <span aria-hidden="true" className="sec-cat-pill-dot" />
          {category}
        </span>
        <h1 className="sec-title">
          {renderTitle(title, titleHighlight, highlightInline)}
        </h1>
        <p className="sec-lead">{lead}</p>
        {actions}
        {count && <p className="sec-count">{count}</p>}
      </div>
    </header>
  );
}

function renderTitle(
  title: string,
  titleHighlight: string | undefined,
  highlightInline: boolean,
): ReactNode {
  if (!titleHighlight) {
    return title;
  }
  return (
    <>
      {title}
      {highlightInline ? " " : <br />}
      <span className="sec-title-hl">{titleHighlight}</span>
    </>
  );
}
