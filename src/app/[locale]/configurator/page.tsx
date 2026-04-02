import { setRequestLocale } from "next-intl/server";
import { Settings, Wand2, FileCode2 } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { ConfiguratorWizard } from "@/components/configurator/ConfiguratorWizard";

const translations = {
  fr: {
    metaTitle: "Configurateur interactif Claude Code",
    metaDescription:
      "Générez votre configuration Claude Code sur mesure. CLAUDE.md, settings.json, .mcp.json et agents, en quelques clics.",
    heroBadge: "Configurateur interactif",
    heroTitle: "Générez votre configuration",
    heroSubtitle:
      "Choisissez votre profil, vos stacks et vos features. Obtenez un",
    heroSubtitleEnd: "et des agents personnalisés en quelques clics.",
    presetsLabel: "10 presets prêts à l'emploi",
    filesLabel: "5 fichiers générés",
  },
  en: {
    metaTitle: "Interactive Claude Code Configurator",
    metaDescription:
      "Generate your custom Claude Code configuration. CLAUDE.md, settings.json, .mcp.json, and agents in just a few clicks.",
    heroBadge: "Interactive configurator",
    heroTitle: "Generate your",
    heroSubtitle:
      "Choose your profile, stacks, and features. Get a",
    heroSubtitleEnd: "and custom agents in just a few clicks.",
    presetsLabel: "10 ready-to-use presets",
    filesLabel: "5 generated files",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"];
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/configurator`,
    locale,
    type: "website",
  });
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--hero-badge-border)] bg-[var(--hero-badge-bg)] px-4 py-1.5 text-sm text-[var(--hero-badge-text)]">
              <Settings className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--hero-text-primary)] sm:text-4xl lg:text-5xl">
              {t.heroTitle}{" "}
              <span className="text-gradient">Claude Code</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--hero-text-secondary)] sm:text-lg">
              {t.heroSubtitle}{" "}
              <code className="rounded bg-slate-200/60 px-1.5 py-0.5 text-sm font-mono dark:bg-slate-700/60">
                CLAUDE.md
              </code>
              ,{" "}
              <code className="rounded bg-slate-200/60 px-1.5 py-0.5 text-sm font-mono dark:bg-slate-700/60">
                settings.json
              </code>{" "}
              {t.heroSubtitleEnd}
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
              <div className="flex items-center gap-2 text-sm text-[var(--hero-text-secondary)]">
                <Wand2
                  className="h-4 w-4 text-brand-500"
                  aria-hidden="true"
                />
                {t.presetsLabel}
              </div>
              <span className="hidden text-slate-300 dark:text-slate-600 sm:inline">
                |
              </span>
              <div className="flex items-center gap-2 text-sm text-[var(--hero-text-secondary)]">
                <FileCode2
                  className="h-4 w-4 text-brand-500"
                  aria-hidden="true"
                />
                {t.filesLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configurateur */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1600px]">
          <ConfiguratorWizard />
        </div>
      </section>
    </>
  );
}
