import { ArrowRight, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface WorkflowDiagramStep {
  /** Titre court de l'etape (1 a 3 mots, affiche en cc-eyebrow). */
  readonly label: string;
  /** Description optionnelle, 1 phrase max (text-sm). */
  readonly description?: string;
  /**
   * Icone Lucide React optionnelle (rendue dans le badge en haut de la
   * card). Passer le composant directement, ex: `icon={<Zap />}`.
   */
  readonly icon?: ReactNode;
}

interface WorkflowDiagramProps {
  /** Liste ordonnee des etapes du workflow (2 a 6 typiquement). */
  readonly steps: ReadonlyArray<WorkflowDiagramStep>;
  /**
   * Label aria-label pour la region (par defaut "Workflow"). Si le diagramme
   * decrit un pipeline specifique, fournir un nom plus explicite ameliore
   * l'accessibilite des screen readers.
   */
  readonly ariaLabel?: string;
}

/**
 * C4 — Pipeline visuel d'etapes connectees par des fleches.
 *
 * - Layout horizontal (flex-row) sur lg+
 * - Layout vertical (flex-col) sur mobile et tablet
 * - Connecteur entre etapes : ArrowRight (lg+) ou ChevronDown (mobile)
 *
 * Different de `<Steps>` qui est une liste verticale numerotee avec contenu
 * MDX detaille par etape. WorkflowDiagram est plus dense, scannable d'un
 * coup d'oeil, adapte aux pipelines (Research -> Plan -> Execute -> Review
 * -> Ship par exemple).
 *
 * Usage MDX :
 *   import { Search, Map, Hammer } from "lucide-react";
 *
 *   <WorkflowDiagram
 *     ariaLabel="Workflow Claude Code"
 *     steps={[
 *       { label: "Research", icon: <Search />, description: "Comprendre le contexte" },
 *       { label: "Plan", icon: <Map />, description: "Decouper le travail" },
 *       { label: "Execute", icon: <Hammer />, description: "Implementer pas a pas" },
 *     ]}
 *   />
 */
export function WorkflowDiagram({
  steps,
  ariaLabel = "Workflow",
}: Readonly<WorkflowDiagramProps>) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={ariaLabel}
      className="my-8 flex flex-col items-stretch gap-4 lg:flex-row lg:items-stretch lg:gap-2"
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const stepKey = `${step.label}-${index}`;
        return (
          <div
            key={stepKey}
            className="flex flex-col items-stretch gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-2"
          >
            <WorkflowCard step={step} />
            {!isLast && <WorkflowConnector />}
          </div>
        );
      })}
    </section>
  );
}

interface WorkflowCardProps {
  readonly step: WorkflowDiagramStep;
}

function WorkflowCard({ step }: Readonly<WorkflowCardProps>) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] p-5 shadow-[var(--shadow-card)]">
      {step.icon && (
        <div
          aria-hidden="true"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-primary)] [&>svg]:h-5 [&>svg]:w-5"
        >
          {step.icon}
        </div>
      )}
      <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--fg-primary)]">
        {step.label}
      </h3>
      {step.description && (
        <p className="text-sm leading-relaxed text-[color:var(--fg-secondary)]">
          {step.description}
        </p>
      )}
    </div>
  );
}

function WorkflowConnector() {
  return (
    <>
      {/* Mobile / tablet : fleche vers le bas, centree */}
      <div
        aria-hidden="true"
        className="flex justify-center text-[color:var(--fg-muted)] lg:hidden"
      >
        <ChevronDown className="h-5 w-5" />
      </div>
      {/* Desktop : fleche vers la droite, centree verticalement */}
      <div
        aria-hidden="true"
        className="hidden items-center justify-center text-[color:var(--fg-muted)] lg:flex"
      >
        <ArrowRight className="h-5 w-5 shrink-0" />
      </div>
    </>
  );
}
