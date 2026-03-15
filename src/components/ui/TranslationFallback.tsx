import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

interface TranslationFallbackProps {
  readonly locale: string;
  readonly slug: string;
  readonly section?: string;
}

const messages = {
  en: {
    title: "This page is not yet available in English",
    description:
      "We are actively working on translating this content. In the meantime, you can read the French version.",
    cta: "Read in French",
  },
  fr: {
    title: "Cette page n'est pas encore disponible en français",
    description:
      "Nous travaillons activement à la traduction de ce contenu. En attendant, vous pouvez lire la version anglaise.",
    cta: "Lire en anglais",
  },
} as const;

export function TranslationFallback({
  locale,
  slug,
  section,
}: TranslationFallbackProps) {
  const fallbackLocale = locale === "en" ? "fr" : "en";
  const t = locale === "en" ? messages.en : messages.fr;
  const href = section
    ? `/${fallbackLocale}/${section}/${slug}`
    : `/${fallbackLocale}/content/${slug}`;

  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 dark:bg-brand-500/20">
        <Globe className="h-8 w-8 text-brand-600 dark:text-brand-400" />
      </div>
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
        {t.title}
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-300">
        {t.description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        {t.cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
