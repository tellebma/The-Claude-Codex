import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface NextStepItem {
  readonly href: string;
  readonly label: string;
  readonly description?: string;
}

interface NextStepsProps {
  readonly title: string;
  readonly items: ReadonlyArray<NextStepItem>;
  readonly eyebrow?: string;
}

/**
 * RG2-07 — Card "Prochaines etapes" en fin d'article editorial.
 *
 * Atmosphere : gradient subtle cyan/amber + border brand-500/20. Eyebrow
 * brand uppercase 13px / 600, title 22px / 700 / -0.015em primary, items
 * en flex avec hover translate + bg white + border default.
 *
 * A11y : nav avec aria-labelledby pointant sur le titre, items rendus
 * comme <ul><li><a>, links localises via i18n/navigation.
 *
 * Source design : `article.css` `.art-next`, `.art-next-h`, `.art-next-title`,
 * `.art-next-list`.
 */
export function NextSteps({
  title,
  items,
  eyebrow = "Prochaines etapes",
}: Readonly<NextStepsProps>) {
  const titleId = `next-steps-${title.replaceAll(/\s+/g, "-").toLowerCase()}`;

  return (
    <nav
      aria-labelledby={titleId}
      className="mt-10 rounded-2xl border border-[color:rgba(6,182,212,0.2)] bg-[linear-gradient(135deg,rgba(6,182,212,0.06),rgba(245,158,11,0.04))] p-7 dark:border-[color:rgba(34,211,238,0.25)] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(245,158,11,0.05))]"
    >
      <p className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-[color:var(--color-brand-700)] dark:text-[color:rgba(103,232,249,1)]">
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className="mb-4 text-[22px] font-bold tracking-[-0.015em] text-[color:var(--fg-primary)]"
      >
        {title}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-start gap-2.5 rounded-xl border border-transparent px-3.5 py-2.5 text-[15px] font-medium text-[color:var(--fg-primary)] transition-colors hover:border-[color:var(--border-default)] hover:bg-white dark:hover:bg-[color:rgba(15,23,42,0.6)]"
            >
              <ArrowRight
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-brand-700)] transition-transform group-hover:translate-x-0.5 dark:text-[color:rgba(103,232,249,1)]"
              />
              <span className="min-w-0 flex-1">
                {item.label}
                {item.description && (
                  <span className="mt-0.5 block text-[13px] font-normal text-[color:var(--fg-muted)]">
                    {item.description}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
