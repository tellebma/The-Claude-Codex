import Link from "next/link";
import {
  ArrowRight,
  Terminal,
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
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { AudienceCard } from "@/components/ui/AudienceCard";

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Sparkles className="h-4 w-4" />
              Guide gratuit & open-source
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Maitrisez{" "}
              <span className="text-gradient">Claude Code</span>
              <br />
              en partant de zero
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Le guide de reference pour exploiter toute la puissance de l&apos;IA
              dans votre quotidien. Que vous soyez developpeur, entrepreneur ou
              simplement curieux — tout commence ici.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/getting-started"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Commencer le guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/mcp"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/5"
              >
                Decouvrir les MCP
              </Link>
            </div>

            {/* Terminal preview */}
            <div className="mx-auto mt-16 max-w-2xl">
              <div className="glow overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/90 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500">terminal</span>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed">
                  <div className="text-slate-500">
                    $ <span className="text-brand-400">claude</span>
                  </div>
                  <div className="mt-2 text-slate-400">
                    <span className="text-accent-400">{">"}</span> Cree-moi un site web moderne avec une landing page,{" "}
                  </div>
                  <div className="text-slate-400">
                    {"  "}un systeme d&apos;authentification et un dashboard admin.
                  </div>
                  <div className="mt-3 text-emerald-400">
                    Bien sur ! Je vais creer votre projet etape par etape...
                  </div>
                  <div className="mt-1 text-slate-500">
                    {"  "}Analyse des besoins...{" "}
                    <span className="text-brand-400">fait</span>
                  </div>
                  <div className="text-slate-500">
                    {"  "}Creation de l&apos;architecture...{" "}
                    <span className="text-brand-400">fait</span>
                  </div>
                  <div className="text-slate-500">
                    {"  "}Generation du code...{" "}
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
          <SectionHeading
            badge="Possibilites"
            title="Ce que vous pouvez faire avec Claude Code"
            description="Claude Code n'est pas un simple chatbot. C'est un partenaire de creation qui comprend votre contexte et agit dans votre environnement."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Globe}
              title="Creer un site web"
              description="De la landing page au e-commerce complet, Claude Code genere, structure et deploie vos projets web."
              gradient="teal"
            />
            <FeatureCard
              icon={FileText}
              title="Generer des documents"
              description="Rapports, presentations, documentation technique — laissez l'IA structurer et rediger pour vous."
              gradient="amber"
            />
            <FeatureCard
              icon={Zap}
              title="Automatiser vos taches"
              description="Scripts, pipelines CI/CD, migrations de donnees. Transformez des heures de travail en quelques minutes."
              gradient="purple"
            />
            <FeatureCard
              icon={BarChart3}
              title="Analyser des donnees"
              description="Connectez vos sources, explorez vos datasets et obtenez des insights en langage naturel."
              gradient="green"
            />
            <FeatureCard
              icon={Code2}
              title="Coder sans etre dev"
              description="Decrivez ce que vous voulez en francais. Claude Code traduit vos idees en code fonctionnel."
              gradient="teal"
            />
            <FeatureCard
              icon={Palette}
              title="Designer des interfaces"
              description="Creez des interfaces modernes et accessibles en decrivant simplement votre vision."
              gradient="amber"
            />
            <FeatureCard
              icon={Puzzle}
              title="Connecter vos outils"
              description="Grace aux MCP, integrez Gmail, Slack, GitHub, bases de donnees et bien plus encore."
              gradient="purple"
            />
            <FeatureCard
              icon={Rocket}
              title="Deployer en production"
              description="Docker, CI/CD, monitoring — Claude Code gere votre infrastructure de A a Z."
              gradient="green"
            />
          </div>
        </div>
      </section>

      {/* ===== POUR QUI ? ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Pour tous"
            title="Peu importe votre profil, Claude Code est fait pour vous"
            description="L'IA n'est plus reservee aux ingenieurs. Chaque personne creative, ambitieuse ou simplement curieuse peut en tirer parti."
          />

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AudienceCard
              icon={Code2}
              title="Developpeurs"
              description="Accelerez votre workflow x10. Code review, refactoring, tests automatises, debugging assiste. Votre copilote ultime."
            />
            <AudienceCard
              icon={Briefcase}
              title="Entrepreneurs"
              description="Lancez votre MVP en jours au lieu de semaines. Prototypez, iterez et deployez sans equipe technique."
            />
            <AudienceCard
              icon={Palette}
              title="Creatifs & Designers"
              description="Transformez vos maquettes en sites vivants. Generez des animations, des composants UI sur mesure."
            />
            <AudienceCard
              icon={GraduationCap}
              title="Etudiants"
              description="Apprenez en faisant. Claude Code explique chaque concept, corrige vos erreurs et vous guide pas a pas."
            />
            <AudienceCard
              icon={Lightbulb}
              title="Curieux & Autodidactes"
              description="Explorez le monde du code sans prerequis. Posez vos questions, experimentez, creez vos premiers projets."
            />
            <AudienceCard
              icon={Users}
              title="Equipes & Managers"
              description="Standardisez vos workflows, documentez automatiquement, et donnez des super-pouvoirs a toute votre equipe."
            />
          </div>
        </div>
      </section>

      {/* ===== PARCOURS ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Parcours"
            title="Choisissez votre chemin"
            description="Trois parcours adaptes a votre niveau. Commencez la ou vous etes, progressez a votre rythme."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <PathCard
              icon={BookOpen}
              level="Debutant"
              title="Les fondamentaux"
              description="Vous n'avez jamais utilise Claude Code ? Parfait. On part de zero, ensemble."
              items={[
                "Installer Claude Code en 5 minutes",
                "Comprendre le terminal et les bases",
                "Votre premier projet guide pas a pas",
                "Les commandes essentielles a connaitre",
              ]}
              href="/getting-started"
              color="teal"
            />
            <PathCard
              icon={Puzzle}
              level="Intermediaire"
              title="Maitrise des outils"
              description="Vous savez utiliser Claude Code ? Decouvrez les MCP, les Skills et le prompting avance."
              items={[
                "Connecter vos outils favoris via les MCP",
                "Creer et utiliser des Skills personnalises",
                "Techniques de prompting qui font la difference",
                "Automatiser vos workflows quotidiens",
              ]}
              href="/mcp"
              color="amber"
            />
            <PathCard
              icon={Rocket}
              level="Avance"
              title="Expert & Architecte"
              description="Poussez Claude Code dans ses retranchements. Multi-agents, workflows complexes, deployments."
              items={[
                "Orchestration multi-agents",
                "Workflows complexes et chainage de prompts",
                "CI/CD et deploiement automatise",
                "Creer vos propres MCP servers",
              ]}
              href="/prompting"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* ===== TEMOIGNAGES ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Temoignages"
            title="Ils ont transforme leur quotidien"
            description="Decouvrez comment des personnes de tous horizons utilisent Claude Code pour creer, apprendre et innover."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="Je n'avais jamais ecrit une ligne de code. En une semaine avec Claude Code, j'ai lance le site de mon restaurant avec reservation en ligne. Mes clients n'en reviennent pas."
              author="Marie L."
              role="Restauratrice, Lyon"
              result="Site web lance en 7 jours"
            />
            <TestimonialCard
              quote="En connectant le MCP GitHub et le MCP PostgreSQL, j'ai automatise tout le pipeline de review de mon equipe. On gagne 3 heures par jour, facile."
              author="Thomas K."
              role="Lead Developer, Paris"
              result="3h gagnees par jour"
            />
            <TestimonialCard
              quote="Pour mon memoire de master, Claude Code m'a aide a analyser 500 articles scientifiques et a structurer ma revue de litterature. Mon directeur etait impressionne."
              author="Amina B."
              role="Etudiante en sociologie, Bordeaux"
              result="Memoire termine 2 mois en avance"
            />
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Pret a transformer votre facon de{" "}
            <span className="text-gradient">travailler</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Le guide est gratuit, open-source et fait pour durer. Commencez
            maintenant et rejoignez une communaute qui repousse les limites du
            possible.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/getting-started"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              <Terminal className="h-4 w-4" />
              Commencer maintenant
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/future"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <MessageSquare className="h-4 w-4" />
              Voir la vision
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
