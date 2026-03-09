import Link from "next/link";
import { ArrowRight, Settings, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Configurateur Claude Code",
  description:
    "Configurez Claude Code de manière interactive. Générez votre CLAUDE.md, settings.json et plus encore.",
  path: "/configurator",
  type: "website",
});

export default function ConfiguratorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Bientôt disponible
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Configurateur</span> interactif
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Cette section est en cours de construction. Bientôt, vous pourrez
              configurer Claude Code de manière interactive et générer vos
              fichiers de configuration.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            badge="En construction"
            title="Contenu à venir"
            description="En attendant, explorez les autres sections du guide."
          />

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/getting-started"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Commencer le guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
