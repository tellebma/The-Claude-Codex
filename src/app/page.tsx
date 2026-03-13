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

export default function HomePage() {
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
              Guide gratuit & open-source
            </div>

            {/* Title */}
            <h1
              className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: "var(--hero-text-primary)" }}
            >
              Maîtrisez{" "}
              <span className="text-gradient">Claude Code</span>
              <br />
              en partant de zéro
            </h1>

            {/* Subtitle */}
            <p
              className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl"
              style={{ color: "var(--hero-text-secondary)" }}
            >
              Le guide de référence pour exploiter toute la puissance de l&apos;IA
              dans votre quotidien. Que vous soyez développeur, entrepreneur ou
              simplement curieux, tout commence ici.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/getting-started"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Commencer le guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/mcp"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all"
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "var(--hero-cta-secondary-border)",
                  color: "var(--hero-cta-secondary-text)",
                }}
              >
                Découvrir les MCP
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
                    <span className="text-accent-400">{">"}</span> Crée-moi un site web moderne avec une landing page,{" "}
                  </div>
                  <div className="text-slate-400">
                    {"  "}un système d&apos;authentification et un dashboard admin.
                  </div>
                  <div className="mt-3 text-emerald-400">
                    Bien sûr ! Je vais créer votre projet étape par étape...
                  </div>
                  <div className="mt-1 text-slate-400">
                    {"  "}Analyse des besoins...{" "}
                    <span className="text-brand-400">fait</span>
                  </div>
                  <div className="text-slate-400">
                    {"  "}Création de l&apos;architecture...{" "}
                    <span className="text-brand-400">fait</span>
                  </div>
                  <div className="text-slate-400">
                    {"  "}Génération du code...{" "}
                    <span className="animate-pulse text-accent-400">en cours</span>
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
              badge="Possibilités"
              title="Ce que vous pouvez faire avec Claude Code"
              description="Claude Code n'est pas un simple chatbot. C'est un partenaire de création qui comprend votre contexte et agit dans votre environnement."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            <FeatureCard
              icon={Globe}
              title="Créer un site web"
              description="De la landing page au e-commerce complet, Claude Code génère, structure et déploie vos projets web."
              gradient="teal"
            />
            <FeatureCard
              icon={FileText}
              title="Générer des documents"
              description="Rapports, présentations, documentation technique : laissez l'IA structurer et rédiger pour vous."
              gradient="amber"
            />
            <FeatureCard
              icon={Zap}
              title="Automatiser vos tâches"
              description="Scripts, pipelines CI/CD, migrations de données. Transformez des heures de travail en quelques minutes."
              gradient="purple"
            />
            <FeatureCard
              icon={BarChart3}
              title="Analyser des données"
              description="Connectez vos sources, explorez vos datasets et obtenez des insights en langage naturel."
              gradient="green"
            />
            <FeatureCard
              icon={Code2}
              title="Coder sans être dev"
              description="Décrivez ce que vous voulez en français. Claude Code traduit vos idées en code fonctionnel."
              gradient="teal"
            />
            <FeatureCard
              icon={Palette}
              title="Designer des interfaces"
              description="Créez des interfaces modernes et accessibles en décrivant simplement votre vision."
              gradient="amber"
            />
            <FeatureCard
              icon={Puzzle}
              title="Connecter vos outils"
              description="Grâce aux MCP, intégrez Gmail, Slack, GitHub, bases de données et bien plus encore."
              gradient="purple"
            />
            <FeatureCard
              icon={Rocket}
              title="Déployer en production"
              description="Docker, CI/CD, monitoring : Claude Code gère votre infrastructure de A à Z."
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
              badge="Pour tous"
              title="Peu importe votre profil, Claude Code est fait pour vous"
              description="L'IA n'est plus réservée aux ingénieurs. Chaque personne créative, ambitieuse ou simplement curieuse peut en tirer parti."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            <AudienceCard
              icon={Code2}
              title="Développeurs"
              description="Accélérez votre workflow x10. Code review, refactoring, tests automatisés, debugging assisté. Votre copilote ultime."
            />
            <AudienceCard
              icon={Briefcase}
              title="Entrepreneurs"
              description="Lancez votre MVP en jours au lieu de semaines. Prototypez, itérez et déployez sans équipe technique."
            />
            <AudienceCard
              icon={Palette}
              title="Créatifs & Designers"
              description="Transformez vos maquettes en sites vivants. Générez des animations, des composants UI sur mesure."
            />
            <AudienceCard
              icon={GraduationCap}
              title="Étudiants"
              description="Apprenez en faisant. Claude Code explique chaque concept, corrige vos erreurs et vous guide pas à pas."
            />
            <AudienceCard
              icon={Lightbulb}
              title="Curieux & Autodidactes"
              description="Explorez le monde du code sans prérequis. Posez vos questions, expérimentez, créez vos premiers projets."
            />
            <AudienceCard
              icon={Users}
              title="Équipes & Managers"
              description="Standardisez vos workflows, documentez automatiquement, et donnez des super-pouvoirs à toute votre équipe."
            />
          </StaggerChildren>
        </div>
      </section>

      {/* ===== PARCOURS ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Parcours"
              title="Choisissez votre chemin"
              description="Trois parcours adaptés à votre niveau. Commencez là où vous êtes, progressez à votre rythme."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-8 lg:grid-cols-3" staggerDelay={0.12}>
            <PathCard
              icon={BookOpen}
              level="Débutant"
              title="Les fondamentaux"
              description="Vous n'avez jamais utilisé Claude Code ? Parfait. On part de zéro, ensemble."
              items={[
                "Installer Claude Code en 5 minutes",
                "Comprendre le terminal et les bases",
                "Votre premier projet guidé pas à pas",
                "Les commandes essentielles à connaître",
              ]}
              href="/getting-started"
              color="teal"
            />
            <PathCard
              icon={Puzzle}
              level="Intermédiaire"
              title="Maîtrise des outils"
              description="Vous savez utiliser Claude Code ? Découvrez les MCP, les Skills et le prompting avancé."
              items={[
                "Connecter vos outils favoris via les MCP",
                "Créer et utiliser des Skills personnalisés",
                "Techniques de prompting qui font la différence",
                "Automatiser vos workflows quotidiens",
              ]}
              href="/mcp"
              color="amber"
            />
            <PathCard
              icon={Rocket}
              level="Avancé"
              title="Expert & Architecte"
              description="Poussez Claude Code dans ses retranchements. Multi-agents, workflows complexes, déploiements."
              items={[
                "Orchestration multi-agents",
                "Workflows complexes et chaînage de prompts",
                "CI/CD et déploiement automatisé",
                "Créer vos propres MCP servers",
              ]}
              href="/prompting"
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
              badge="Configurateur"
              title="Votre configuration sur mesure en 2 minutes"
              description="Pas besoin de tout lire. Répondez à quelques questions et recevez une configuration personnalisée, prête à l'emploi."
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
            Prêt à transformer votre façon de{" "}
            <span className="text-gradient">travailler</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Le guide est gratuit, open-source et fait pour durer. Commencez
            maintenant et rejoignez une communauté qui repousse les limites du
            possible.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/getting-started"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 dark:bg-white dark:from-white dark:to-white dark:text-slate-900 dark:shadow-none dark:hover:bg-slate-100 dark:hover:shadow-none"
            >
              <Logo size="sm" />
              Commencer maintenant
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/future"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:border-slate-500 dark:hover:bg-white/5"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Voir la vision
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
