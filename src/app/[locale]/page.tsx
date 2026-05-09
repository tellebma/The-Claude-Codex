import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Globe,
  FileText,
  Zap,
  Code2,
  Palette,
  BarChart3,
  Rocket,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Users,
  Sparkles,
  BookOpen,
  Puzzle,
  MessageSquare,
  ChevronDown,
  GitBranch,
  Languages,
  ShieldCheck,
  Plug,
} from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PathCard } from "@/components/ui/PathCard";
import { AudienceCard } from "@/components/ui/AudienceCard";
import { ConfiguratorTeaser } from "@/components/ui/ConfiguratorTeaser";
import { Logo } from "@/components/layout/Logo";
import { HeroTerminal } from "@/components/ui/HeroTerminal";
import { HeroChips } from "@/components/ui/HeroChips";
import { TrustBar } from "@/components/ui/TrustBar";
import { CodexStatsBand } from "@/components/ui/CodexStatsBand";
import { RecentArticlesSection } from "@/components/ui/RecentArticlesSection";
import { CtaFinal } from "@/components/ui/CtaFinal";
import {
  AnimateOnScroll,
  StaggerChildren,
} from "@/components/ui/AnimateOnScroll";

export default async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations("hero");
  const tSections = await getTranslations("sections");
  const tFeatures = await getTranslations("features");
  const tAudience = await getTranslations("audience");
  const tPaths = await getTranslations("paths");
  const tTrust = await getTranslations("landing.trust");

  const trustItems = [
    { Icon: GitBranch, label: tTrust("openSource") },
    { Icon: Languages, label: tTrust("bilingual") },
    { Icon: ShieldCheck, label: tTrust("noTracking") },
    { Icon: Plug, label: tTrust("officialMcp") },
  ] as const;

  const terminalLines = [
    { text: "$ claude", className: "text-slate-400", delay: 500 },
    {
      text: `> ${tHero("terminalPrompt")}`,
      className: "text-slate-400 mt-2",
      delay: 400,
    },
    {
      text: `  ${tHero("terminalPrompt2")}`,
      className: "text-slate-400",
      delay: 200,
    },
    {
      text: tHero("terminalResponse"),
      className: "text-emerald-400 mt-3",
      delay: 600,
    },
    {
      text: `  ${tHero("terminalStep1")} ${tHero("terminalDone")}`,
      className: "text-slate-400 mt-1",
      delay: 400,
    },
    {
      text: `  ${tHero("terminalStep2")} ${tHero("terminalDone")}`,
      className: "text-slate-400",
      delay: 400,
    },
    {
      text: `  ${tHero("terminalStep3")} ${tHero("terminalInProgress")}`,
      className: "text-accent-400",
      delay: 300,
    },
  ] as const;

  return (
    <>
      {/* ===== HERO ===== Layout split (RG-18) : 1.05fr 1fr sur lg+ */}
      <section className="relative overflow-hidden bg-[color:var(--bg-page)]">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top right, var(--gradient-hero-radial-1), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom left, var(--gradient-hero-radial-2), transparent 60%)" }} />

        {/* Grid pattern — animated (RG2-12 : keyframe canonique lp-grid-fade
            9s ease-in-out infinite, opacity oscille 0.4 → 1.0 → 0.4 pour
            respirer la grille comme decrit dans SYNTHESIS section 2.7). */}
        <div
          className="absolute inset-0 animate-lp-grid-fade"
          style={{
            backgroundImage:
              "linear-gradient(var(--hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
          {/*
            Layout split (AC RG-18) : sur mobile/tablet, stack vertical
            (texte au-dessus, terminal en-dessous, centred). Sur lg+,
            grille 1.05fr / 1fr (texte gauche, terminal droite, gap 64).
          */}
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "var(--hero-badge-border)",
                  backgroundColor: "var(--hero-badge-bg)",
                  color: "var(--hero-badge-text)",
                }}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {tHero("badge")}
              </div>

              {/* Title — token typo display-1 (clamp 44px → 76px) + tracking-display (-0.03em) */}
              <h1
                className="text-display-1 font-extrabold leading-tight tracking-display"
                style={{ color: "var(--hero-text-primary)" }}
              >
                {tHero("title")}{" "}
                <span className="text-gradient">{tHero("titleHighlight")}</span>
                <br />
                {tHero("titleEnd")}
              </h1>

              {/* Subtitle */}
              <p
                className="mx-auto mt-6 max-w-2xl text-lead lg:mx-0"
                style={{ color: "var(--hero-text-secondary)" }}
              >
                {tHero("subtitle")}
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/getting-started"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-[color:var(--fg-on-brand)] shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
                  style={{
                    transitionDuration: "var(--duration-fast)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  {tHero("ctaPrimary")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/mcp"
                  className="hero-cta-secondary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "var(--hero-cta-secondary-border)",
                    color: "var(--hero-cta-secondary-text)",
                    transitionDuration: "var(--duration-fast)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  {tHero("ctaSecondary")}
                </Link>
              </div>
            </div>

            {/* Terminal preview — animated typing (a droite sur lg+) */}
            {/* RG2-11 : chips orbitaux flottants autour du terminal */}
            <div className="relative w-full">
              <HeroTerminal lines={terminalLines} />
              <HeroChips />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 flex justify-center lg:mt-16">
            <ChevronDown className="h-6 w-6 animate-float text-[color:var(--fg-muted)]" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR (RG2-15) ===== Bande mono "pourquoi le Codex" */}
      <TrustBar label={tTrust("label")} items={trustItems} />

      {/* ===== STATS BAND (RG-32) ===== Bande always-dark factuelle */}
      <CodexStatsBand locale={locale} />

      {/* ===== CE QUE VOUS POUVEZ FAIRE ===== */}
      <section className="bg-[color:var(--bg-page)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={tSections("features.badge")}
              title={tSections("features.title")}
              description={tSections("features.description")}
            />
          </AnimateOnScroll>

          {/* Bento grid layout — varied card sizes for visual hierarchy */}
          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            <div className="sm:col-span-2">
              <FeatureCard
                icon={Globe}
                title={tFeatures("createWebsite.title")}
                description={tFeatures("createWebsite.description")}
                gradient="teal"
              />
            </div>
            <FeatureCard
              icon={FileText}
              title={tFeatures("generateDocs.title")}
              description={tFeatures("generateDocs.description")}
              gradient="amber"
            />
            <FeatureCard
              icon={Zap}
              title={tFeatures("automate.title")}
              description={tFeatures("automate.description")}
              gradient="purple"
            />
            <FeatureCard
              icon={BarChart3}
              title={tFeatures("analyzeData.title")}
              description={tFeatures("analyzeData.description")}
              gradient="green"
            />
            <FeatureCard
              icon={Code2}
              title={tFeatures("codeNoDev.title")}
              description={tFeatures("codeNoDev.description")}
              gradient="teal"
            />
            <div className="sm:col-span-2">
              <FeatureCard
                icon={Puzzle}
                title={tFeatures("connectTools.title")}
                description={tFeatures("connectTools.description")}
                gradient="purple"
                href="/mcp"
              />
            </div>
            <FeatureCard
              icon={Palette}
              title={tFeatures("designUI.title")}
              description={tFeatures("designUI.description")}
              gradient="amber"
            />
            <FeatureCard
              icon={Rocket}
              title={tFeatures("deploy.title")}
              description={tFeatures("deploy.description")}
              gradient="green"
            />
          </StaggerChildren>
        </div>
      </section>

      {/* ===== POUR QUI ? ===== */}
      <section className="bg-[color:var(--bg-subtle)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={tSections("audience.badge")}
              title={tSections("audience.title")}
              description={tSections("audience.description")}
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            <AudienceCard
              icon={Code2}
              title={tAudience("developers.title")}
              description={tAudience("developers.description")}
            />
            <AudienceCard
              icon={Briefcase}
              title={tAudience("entrepreneurs.title")}
              description={tAudience("entrepreneurs.description")}
            />
            <AudienceCard
              icon={Palette}
              title={tAudience("creatives.title")}
              description={tAudience("creatives.description")}
            />
            <AudienceCard
              icon={GraduationCap}
              title={tAudience("students.title")}
              description={tAudience("students.description")}
            />
            <AudienceCard
              icon={Lightbulb}
              title={tAudience("curious.title")}
              description={tAudience("curious.description")}
            />
            <AudienceCard
              icon={Users}
              title={tAudience("teams.title")}
              description={tAudience("teams.description")}
            />
          </StaggerChildren>
        </div>
      </section>

      {/* ===== PARCOURS ===== */}
      <section className="bg-[color:var(--bg-page)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={tSections("paths.badge")}
              title={tSections("paths.title")}
              description={tSections("paths.description")}
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-8 lg:grid-cols-3" staggerDelay={0.12}>
            <PathCard
              icon={BookOpen}
              level={tPaths("beginner.level")}
              title={tPaths("beginner.title")}
              description={tPaths("beginner.description")}
              items={[
                tPaths("beginner.items.0"),
                tPaths("beginner.items.1"),
                tPaths("beginner.items.2"),
                tPaths("beginner.items.3"),
              ]}
              href="/getting-started"
              color="teal"
              ctaLabel={tPaths("ctaLabel")}
            />
            <PathCard
              icon={Puzzle}
              level={tPaths("intermediate.level")}
              title={tPaths("intermediate.title")}
              description={tPaths("intermediate.description")}
              items={[
                tPaths("intermediate.items.0"),
                tPaths("intermediate.items.1"),
                tPaths("intermediate.items.2"),
                tPaths("intermediate.items.3"),
              ]}
              href="/mcp"
              color="amber"
              ctaLabel={tPaths("ctaLabel")}
            />
            <PathCard
              icon={Rocket}
              level={tPaths("advanced.level")}
              title={tPaths("advanced.title")}
              description={tPaths("advanced.description")}
              items={[
                tPaths("advanced.items.0"),
                tPaths("advanced.items.1"),
                tPaths("advanced.items.2"),
                tPaths("advanced.items.3"),
              ]}
              href="/prompting"
              color="purple"
              ctaLabel={tPaths("ctaLabel")}
            />
          </StaggerChildren>
        </div>
      </section>

      {/* ===== CONFIGURATEUR RAPIDE ===== */}
      <section className="bg-[color:var(--bg-subtle)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={tSections("configurator.badge")}
              title={tSections("configurator.title")}
              description={tSections("configurator.description")}
            />
          </AnimateOnScroll>

          <AnimateOnScroll preset="scale" delay={0.2} className="mt-12">
            <ConfiguratorTeaser />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== ARTICLES RECENTS (RG-32) ===== */}
      <RecentArticlesSection locale={locale} />

      {/* ===== CTA FINAL (RG2-16) ===== Pattern lp-cta-final dedie */}
      <CtaFinal
        title={tSections("cta.title")}
        titleHighlight={`${tSections("cta.titleHighlight")} ?`}
        description={tSections("cta.description")}
        actions={
          <>
            <Link
              href="/getting-started"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-[color:var(--fg-on-brand)] shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              style={{
                transitionDuration: "var(--duration-fast)",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              <Logo size="sm" />
              {tSections("cta.ctaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/future"
              className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--border-default)] px-8 py-3.5 text-base font-semibold text-[color:var(--fg-secondary)] transition-all hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated)]"
              style={{
                transitionDuration: "var(--duration-fast)",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              {tSections("cta.ctaSecondary")}
            </Link>
          </>
        }
      />
    </>
  );
}
