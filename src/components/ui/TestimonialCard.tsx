interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  result: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  result,
}: TestimonialCardProps) {
  return (
    <div className="glass-card flex flex-col p-6">
      <div className="mb-4 text-3xl text-brand-700 dark:text-brand-400">&ldquo;</div>
      <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {quote}
      </blockquote>
      <div className="mt-auto border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
        <p className="font-semibold">{author}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        <p className="mt-2 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {result}
        </p>
      </div>
    </div>
  );
}
