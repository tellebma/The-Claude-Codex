import Link from "next/link";
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
} from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PathCard } from "@/components/ui/PathCard";
import { AudienceCard } from "@/components/ui/AudienceCard";
import { ConfiguratorTeaser } from "@/components/ui/ConfiguratorTeaser";
import { Logo } from "@/components/layout/Logo";
import {
  AnimateOnScroll,
  StaggerChildren,
} from "@/components/ui/AnimateOnScroll";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = (href: string) => `/${locale}${href}`;

  const tHero = await getTranslations("hero");
  const tSections = await getTranslations("sections");
  const tFeatures = await getTranslations("features");
  const tAudience = await getTranslations("audience");
  const tPaths = await getTranslations("paths");

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top right, var(--gradient-hero-radial-1), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom left, var(--gradient-hero-radial-2), transparent 60%)" }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
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

            {/* Title */}
            <h1
              className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl sm:leading-tight lg:text-7xl lg:leading-[1.1]"
              style={{ color: "var(--hero-text-primary)" }}
            >
              {tHero("title")}{" "}
              <span className="text-gradient">{tHero("titleHighlight")}</span>
              <br />
              {tHero("titleEnd")}
            </h1>

            {/* Subtitle */}
            <p
              className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl"
              style={{ color: "var(--hero-text-secondary)" }}
            >
              {tHero("subtitle")}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={l("/getting-started")}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                {tHero("ctaPrimary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href={l("/mcp")}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all"
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "var(--hero-cta-secondary-border)",
                  color: "var(--hero-cta-secondary-text)",
                }}
              >
                {tHero("ctaSecondary")}
              </Link>
            </div>

            {/* Terminal preview */}
            <div className="mx-auto mt-16 max-w-2xl">
              <div
                className="glow overflow-hidden rounded-2xl shadow-2xl backdrop-blur"
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "var(--hero-terminal-border)",
                  backgroundColor: "var(--hero-terminal-bg)",
                }}
              >
                <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-400">terminal</span>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed">
                  <div className="text-slate-400">
                    $ <span className="text-brand-400">claude</span>
                  </div>
                  <div className="mt-2 text-slate-400">
                    <span className="text-accent-400">{">"}</span> {tHero("terminalPrompt")}{" "}
                  </div>
                  <div className="text-slate-400">
                    {"  "}{tHero("terminalPrompt2")}
                  </div>
                  <div className="mt-3 text-emerald-400">
                    {tHero("terminalResponse")}
                  </div>
                  <div className="mt-1 text-slate-400">
                    {"  "}{tHero("terminalStep1")}{" "}
                    <span className="text-brand-400">{tHero("terminalDone")}</span>
                  </div>
                  <div className="text-slate-400">
                    {"  "}{tHero("terminalStep2")}{" "}
                    <span className="text-brand-400">{tHero("terminalDone")}</span>
                  </div>
                  <div className="text-slate-400">
                    {"  "}{tHero("terminalStep3")}{" "}
                    <span className="animate-pulse text-accent-400">{tHero("terminalInProgress")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CE QUE VOUS POUVEZ FAIRE ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={tSections("features.badge")}
              title={tSections("features.title")}
              description={tSections("features.description")}
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            <FeatureCard
              icon={Globe}
              title={tFeatures("createWebsite.title")}
              description={tFeatures("createWebsite.description")}
              gradient="teal"
            />
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
            <FeatureCard
              icon={Palette}
              title={tFeatures("designUI.title")}
              description={tFeatures("designUI.description")}
              gradient="amber"
            />
            <FeatureCard
              icon={Puzzle}
              title={tFeatures("connectTools.title")}
              description={tFeatures("connectTools.description")}
              gradient="purple"
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
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
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
      <section className="py-20 sm:py-28">
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
              href={l("/getting-started")}
              color="teal"
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
              href={l("/mcp")}
              color="amber"
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
              href={l("/prompting")}
              color="purple"
            />
          </StaggerChildren>
        </div>
      </section>

      {/* ===== CONFIGURATEUR RAPIDE ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
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

      {/* ===== CTA FINAL ===== */}
      <section className="relative overflow-hidden bg-slate-100 py-20 dark:bg-slate-950 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 dark:from-brand-950 dark:via-slate-900 dark:to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08),_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <AnimateOnScroll preset="fade-up" className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {tSections("cta.title")}{" "}
            <span className="text-gradient">{tSections("cta.titleHighlight")}</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {tSections("cta.description")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={l("/getting-started")}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 dark:bg-white dark:from-white dark:to-white dark:text-slate-900 dark:shadow-none dark:hover:bg-slate-100 dark:hover:shadow-none"
            >
              <Logo size="sm" />
              {tSections("cta.ctaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href={l("/future")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:border-slate-500 dark:hover:bg-white/5"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              {tSections("cta.ctaSecondary")}
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
