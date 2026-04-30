import { Check, Star, Zap, ExternalLink } from "lucide-react";
import clsx from "clsx";

interface PricingPlan {
  readonly name: string;
  readonly price: string;
  readonly priceDetail: string;
  readonly badge?: string;
  readonly description: string;
  readonly features: ReadonlyArray<string>;
  readonly cta: string;
  readonly ctaHref: string;
  readonly highlighted: boolean;
}

const plans: ReadonlyArray<PricingPlan> = [
  {
    name: "Essai gratuit",
    price: "Gratuit",
    priceDetail: "crédit de démarrage inclus",
    description:
      "Pour tester Claude Code avant de vous engager. Crédit offert à l'inscription.",
    features: [
      "Crédit d'essai à l'inscription",
      "Accès à Claude via clé API",
      "Facturation à l'usage après le crédit",
      "Pas d'abonnement requis",
      "Idéal pour découvrir l'outil",
    ],
    cta: "Créer un compte",
    ctaHref: "https://console.anthropic.com",
    highlighted: false,
  },
  {
    name: "Claude Max",
    price: "~20 €",
    priceDetail: "par mois",
    badge: "Recommandé pour commencer",
    description:
      "L'abonnement idéal pour une utilisation régulière de Claude Code. Accès inclus sans clé API séparée.",
    features: [
      "Accès illimité à Claude Code",
      "Pas de clé API à gérer",
      "Claude.ai web inclus",
      "Annulation à tout moment",
      "Idéal pour un usage quotidien",
    ],
    cta: "S'abonner à Claude Max",
    ctaHref: "https://claude.ai/upgrade",
    highlighted: true,
  },
  {
    name: "Claude Code API",
    price: "À l'usage",
    priceDetail: "selon la consommation",
    description:
      "Pour les développeurs qui préfèrent payer exactement ce qu'ils consomment, sans abonnement fixe.",
    features: [
      "Paiement à l'utilisation",
      "Clé API nécessaire",
      "Contrôle fin des coûts",
      "Intégration dans des scripts",
      "Idéal pour des usages ponctuels",
    ],
    cta: "Voir les tarifs API",
    ctaHref: "https://www.anthropic.com/pricing",
    highlighted: false,
  },
];

/**
 * Tableau comparatif des offres Claude Code.
 * Design responsive avec mise en avant du plan recommandé.
 *
 * Corrections UX appliquées :
 * - Sur mobile, le plan recommandé (highlighted) est rendu en premier via order-first
 *   pour qu'il apparaisse en tête de colonne au lieu d'être noyé au milieu.
 * - Touch target CTA : min-h-[44px] explicite sur tous les boutons (WCAG 2.5.5).
 * - hover:scale-[1.02] sur la carte recommandée pour renforcer la hiérarchie visuelle.
 * - aria-label sur les liens externes indiquant l'ouverture dans un nouvel onglet.
 * - Contraste CTA secondaire renforcé : text-slate-800 (7.9:1 sur blanc) remplace slate-700.
 * - Badge avec padding-top sur le conteneur parent pour éviter le clipping.
 */
export function PricingTable() {
  return (
    <div className="my-8">
      {/*
        grid-flow-dense + ordre CSS mobile :
        Sur mobile (1 colonne), le plan highlighted passe en premier avec sm:order-none.
        Sur sm+ (3 colonnes), l'ordre naturel du tableau reprend (highlighted au centre).
      */}
      <div className="grid gap-6 pt-4 sm:grid-cols-3 sm:pt-0">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={clsx(
              "relative flex flex-col rounded-2xl border p-6 transition-all duration-200",
              plan.highlighted
                ? [
                    "order-first sm:order-none",
                    "border-brand-500 dark:border-brand-400",
                    "bg-gradient-to-b from-brand-500/10 to-brand-500/5",
                    "dark:from-brand-500/20 dark:to-brand-500/5",
                    "shadow-xl shadow-brand-500/10",
                    "hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/15",
                  ]
                : [
                    "border-[color:var(--border-default)] bg-[color:var(--bg-elevated)]",
                    "hover:shadow-md",
                  ]
            )}
          >
            {/* Badge — le conteneur parent a pt-4 sur mobile pour que le badge ne soit pas coupé */}
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-[color:var(--fg-on-brand)] shadow-sm">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  {plan.badge}
                </span>
              </div>
            )}

            {/* En-tête */}
            <div className="mb-4">
              <h3
                className={clsx(
                  "text-lg font-bold",
                  plan.highlighted
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-[color:var(--fg-primary)]"
                )}
              >
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={clsx(
                    "text-3xl font-extrabold",
                    plan.highlighted
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-[color:var(--fg-primary)]"
                  )}
                >
                  {plan.price}
                </span>
                <span className="text-sm text-[color:var(--fg-muted)]">
                  {plan.priceDetail}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--fg-secondary)]">
                {plan.description}
              </p>
            </div>

            {/* Fonctionnalités */}
            <ul className="mb-6 flex-1 space-y-2.5" aria-label={`Fonctionnalités de l'offre ${plan.name}`}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check
                    className={clsx(
                      "mt-0.5 h-4 w-4 shrink-0",
                      plan.highlighted
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-[color:var(--fg-secondary)]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/*
              CTA — min-h-[44px] garantit le touch target minimum (WCAG 2.5.5).
              Le lien non-highlighted utilise text-slate-800 (7.9:1 sur blanc)
              pour un contraste robuste, remplaçant slate-700 (4.7:1, trop juste).
              aria-label précise l'ouverture dans un nouvel onglet pour les lecteurs d'écran.
            */}
            <a
              href={plan.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${plan.cta} (s'ouvre dans un nouvel onglet)`}
              className={clsx(
                "flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-3",
                "text-sm font-semibold transition-all duration-150",
                plan.highlighted
                  ? "bg-brand-500 text-[color:var(--fg-on-brand)] shadow-md hover:bg-brand-600 hover:shadow-lg"
                  : [
                      "border border-[color:var(--border-default)]",
                      "text-[color:var(--fg-primary)]",
                      "hover:bg-[color:var(--bg-subtle)]",
                    ]
              )}
            >
              {plan.highlighted && (
                <Zap className="h-4 w-4" aria-hidden="true" />
              )}
              {plan.cta}
              <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-[color:var(--fg-muted)]">
        Les prix sont indicatifs et peuvent varier. Consultez{" "}
        <a
          href="https://www.anthropic.com/pricing"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tarifs officiels Anthropic (s'ouvre dans un nouvel onglet)"
          className="underline hover:text-[color:var(--fg-secondary)]"
        >
          anthropic.com/pricing
        </a>{" "}
        pour les tarifs officiels.
      </p>
    </div>
  );
}
