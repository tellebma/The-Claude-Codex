import clsx from "clsx";

type AvatarColor = "teal" | "amber" | "purple" | "rose" | "emerald";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  result: string;
  avatarColor?: AvatarColor;
}

// Couleurs avatar : fond et texte semitransparents/saturés via les classes
// Tailwind @theme. Plus de prefixe dark:* — les variantes /15 et 700 ont un
// contraste suffisant en light comme en dark grace a leur saturation native.
const avatarColors: Record<AvatarColor, string> = {
  teal: "bg-brand-500/15 text-brand-700",
  amber: "bg-accent-500/15 text-accent-700",
  purple: "bg-violet-500/15 text-violet-700",
  rose: "bg-rose-500/15 text-rose-700",
  emerald: "bg-emerald-500/15 text-emerald-700",
};

function getInitials(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export function TestimonialCard({
  quote,
  author,
  role,
  result,
  avatarColor = "teal",
}: Readonly<TestimonialCardProps>) {
  const initials = getInitials(author);

  return (
    <figure
      className="glass-card flex h-full flex-col p-6 transition-all hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
      style={{
        transitionDuration: "var(--duration-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <div className="mb-4 text-3xl text-[color:var(--brand-primary)]" aria-hidden="true">&ldquo;</div>
      <blockquote className="mb-4 flex-1 text-base leading-relaxed text-[color:var(--fg-secondary)]">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="mt-auto border-t border-[color:var(--border-subtle)] pt-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              avatarColors[avatarColor]
            )}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[color:var(--fg-primary)]">{author}</p>
            <p className="text-sm text-[color:var(--fg-muted)]">{role}</p>
          </div>
        </div>
        <p className="mt-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
          {result}
        </p>
      </figcaption>
    </figure>
  );
}
