import clsx from "clsx";

type AvatarColor = "teal" | "amber" | "purple" | "rose" | "emerald";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  result: string;
  avatarColor?: AvatarColor;
}

const avatarColors: Record<AvatarColor, string> = {
  teal: "bg-brand-500/15 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
  amber: "bg-accent-500/15 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300",
  purple: "bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  rose: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
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
    <figure className="glass-card flex h-full flex-col p-6">
      <div className="mb-4 text-3xl text-brand-700 dark:text-brand-400" aria-hidden="true">&ldquo;</div>
      <blockquote className="mb-4 flex-1 text-base leading-relaxed text-slate-600 dark:text-slate-300">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="mt-auto border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
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
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">{role}</p>
          </div>
        </div>
        <p className="mt-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {result}
        </p>
      </figcaption>
    </figure>
  );
}
