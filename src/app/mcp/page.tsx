import Link from "next/link";
import {
  ArrowRight,
  Plug,
  FolderOpen,
  Github,
  Database,
  Globe,
  MessageSquare,
  Mail,
  Zap,
  ChevronRight,
  Settings,
  Terminal,
  BookOpen,
  Sparkles,
  Shield,
  Cable,
  HelpCircle,
  Wrench,
  Briefcase,
  Code2,
  Palette,
  Route,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Les MCP pour Claude Code",
  description:
    "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris : GitHub, Slack, Gmail, bases de donnees et plus encore.",
  path: "/mcp",
});

const articleJsonLd = createArticleSchema({
  title: "Les MCP pour Claude Code",
  description:
    "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris.",
  url: `${SITE_URL}/mcp`,
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
});

const recommendedMcps = [
  {
    name: "Filesystem",
    description:
      "Lire et ecrire des fichiers, explorer des repertoires, rechercher du contenu. L'outil de base pour interagir avec votre systeme de fichiers.",
    difficulty: "Debutant",
    difficultyColor: "bg-emerald-500/10 text-emerald-500",
    useCase: "Organiser, analyser et transformer vos fichiers locaux",
    gradient: "teal" as const,
    icon: FolderOpen,
  },
  {
    name: "GitHub",
    description:
      "Gerer les pull requests, issues, rechercher du code, consulter les workflows CI/CD. Indispensable pour les developpeurs.",
    difficulty: "Intermediaire",
    difficultyColor: "bg-accent-500/10 text-accent-500",
    useCase: "Automatiser la gestion de vos repositories",
    gradient: "purple" as const,
    icon: Github,
  },
  {
    name: "PostgreSQL / SQLite",
    description:
      "Interroger vos bases de donnees directement depuis Claude Code. Executer des requetes SQL, analyser les schemas, exporter des resultats.",
    difficulty: "Intermediaire",
    difficultyColor: "bg-accent-500/10 text-accent-500",
    useCase: "Explorer et analyser vos donnees sans quitter le terminal",
    gradient: "green" as const,
    icon: Database,
  },
  {
    name: "Puppeteer / Playwright",
    description:
      "Automatiser un navigateur web : prendre des screenshots, remplir des formulaires, scraper des pages, tester des interfaces.",
    difficulty: "Avance",
    difficultyColor: "bg-violet-500/10 text-violet-500",
    useCase: "Tests E2E, web scraping et automatisation de navigateur",
    gradient: "purple" as const,
    icon: Globe,
  },
  {
    name: "Slack",
    description:
      "Lire et envoyer des messages, gerer les channels, rechercher dans l'historique. Connectez votre communication d'equipe a Claude.",
    difficulty: "Debutant",
    difficultyColor: "bg-emerald-500/10 text-emerald-500",
    useCase: "Automatiser les notifications et la veille d'equipe",
    gradient: "amber" as const,
    icon: MessageSquare,
  },
  {
    name: "Gmail",
    description:
      "Lire, rechercher et trier vos emails. Creer des brouillons, analyser des conversations, extraire des informations cles.",
    difficulty: "Debutant",
    difficultyColor: "bg-emerald-500/10 text-emerald-500",
    useCase: "Gagner du temps sur la gestion de vos emails",
    gradient: "teal" as const,
    icon: Mail,
  },
];

/**
 * Sub-pages of the MCP section, displayed as clickable cards.
 */
const SUB_PAGES = [
  {
    href: "/mcp/what-are-mcps",
    icon: HelpCircle,
    step: "01",
    title: "Comprendre les MCP en 5 minutes",
    description:
      "Le protocole MCP expliqué simplement : architecture client-serveur, JSON-RPC, différences avec les plugins et skills.",
    color: "brand" as const,
  },
  {
    href: "/mcp/setup",
    icon: Wrench,
    step: "02",
    title: "Installer et configurer un MCP",
    description:
      "Le fichier .mcp.json, la commande claude mcp add, les trois méthodes d’installation et le debug des problèmes courants.",
    color: "brand" as const,
  },
  {
    href: "/mcp/best-productivity",
    icon: Briefcase,
    step: "03",
    title: "Top MCP productivité",
    description:
      "Figma, Lighthouse, Gmail, Slack, Google Calendar : les MCP qui transforment votre quotidien professionnel.",
    color: "accent" as const,
  },
  {
    href: "/mcp/best-development",
    icon: Code2,
    step: "04",
    title: "Top MCP développement",
    description:
      "Context7, Sentry, Linear, PostgreSQL, GitHub : les MCP essentiels pour les développeurs.",
    color: "accent" as const,
  },
  {
    href: "/mcp/best-design",
    icon: Palette,
    step: "05",
    title: "Top MCP design & UI",
    description:
      "Playwright, Chrome DevTools, 21st.dev Magic, Puppeteer : voir et interagir avec le web.",
    color: "brand" as const,
  },
  {
    href: "/mcp/first-workflow",
    icon: Route,
    step: "06",
    title: "Créer son premier workflow MCP",
    description:
      "Tutoriel concret : combinez Context7 + GitHub + Playwright dans un flux de travail complet.",
    color: "accent" as const,
  },
] as const;

const colorStyles = {
  brand: {
    iconBg: "bg-brand-500/10",
    iconText: "text-brand-700 dark:text-brand-400",
    hoverBorder: "hover:border-brand-500/30",
    linkText: "text-brand-700 dark:text-brand-400",
    linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300",
    step: "text-brand-500/40",
  },
  accent: {
    iconBg: "bg-accent-500/10",
    iconText: "text-accent-600 dark:text-accent-400",
    hoverBorder: "hover:border-accent-500/30",
    linkText: "text-accent-600 dark:text-accent-400",
    linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300",
    step: "text-accent-500/40",
  },
};

export default function McpPage() {
  return (
    <>
      {/* JSON-LD structured data — safe: static schema via JSON.stringify */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Cable className="h-4 w-4" aria-hidden="true" />
              Model Context Protocol
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Les <span className="text-gradient">MCP</span> : Donnez des
              <br />
              super-pouvoirs &agrave; Claude Code
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Connectez Claude Code &agrave; vos outils favoris (GitHub, Slack,
              Gmail, bases de donn&eacute;es) et transformez-le en assistant
              tout-puissant qui agit dans votre environnement r&eacute;el.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                6 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez les MCP en profondeur
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                De la th&eacute;orie &agrave; la pratique, chaque guide couvre un aspect
                essentiel des MCP. Suivez-les dans l&apos;ordre ou piochez
                directement celui qui vous int&eacute;resse.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_PAGES.map((page) => {
              const Icon = page.icon;
              const styles = colorStyles[page.color];

              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <Link
                    href={page.href}
                    className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}
                      >
                        <Icon
                          className={`h-6 w-6 ${styles.iconText}`}
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className={`text-3xl font-black ${styles.step}`}
                      >
                        {page.step}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {page.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {page.description}
                    </p>

                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}
                    >
                      Lire le guide
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== QU'EST-CE QU'UN MCP ? ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Concept"
              title="Qu'est-ce qu'un MCP ?"
              description="Le Model Context Protocol, c'est l'adaptateur universel entre Claude Code et le reste du monde numerique."
            />
          </AnimateOnScroll>

          <div className="mt-16">
            <div className="glass-card p-8 sm:p-10">
              <h3 className="mb-4 text-xl font-bold">
                L&apos;analogie simple
              </h3>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                Imaginez que Claude Code est un expert polyvalent enferme dans
                une piece. Il est brillant, mais il ne peut rien{" "}
                <strong>toucher</strong> en dehors de cette piece. Les MCP,
                ce sont des <strong>prises universelles</strong> que vous
                branchez entre Claude et vos outils : votre boite mail, votre
                code source, vos bases de donnees, votre navigateur...
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Chaque MCP ouvre une nouvelle porte. Sans MCP, Claude Code
                peut seulement lire et ecrire des fichiers locaux. Avec les
                MCP, il peut envoyer un message Slack, creer une pull request
                GitHub, lancer une requete SQL, et bien plus encore.{" "}
                <strong>tout ca depuis le terminal</strong>.
              </p>
            </div>

            {/* Visual analogy */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Terminal className="h-7 w-7 text-brand-700 dark:text-brand-400" />
                </div>
                <h4 className="mb-2 font-semibold">Sans MCP</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Claude Code lit et ecrit des fichiers locaux. Puissant, mais
                  isole.
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Plug className="h-7 w-7 text-accent-500" />
                </div>
                <h4 className="mb-2 font-semibold">+ MCP</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vous branchez des adaptateurs qui connectent Claude a vos
                  services.
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <Sparkles className="h-7 w-7 text-emerald-500" />
                </div>
                <h4 className="mb-2 font-semibold">Resultat</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Un assistant qui agit dans votre environnement reel, pas
                  juste dans un chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMENT CA MARCHE ? ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Architecture"
            title="Comment ca marche ?"
            description="Le MCP agit comme un pont standardise entre Claude Code et les services externes."
          />

          {/* Flow diagram */}
          <div className="mt-16">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
              {/* User */}
              <div className="glass-card flex-1 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <BookOpen className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                </div>
                <p className="text-sm font-semibold">Vous</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  &quot;Montre-moi les issues GitHub ouvertes&quot;
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" />
              </div>

              {/* Claude Code */}
              <div className="glass-card flex-1 border-brand-500/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Terminal className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                </div>
                <p className="text-sm font-semibold">Claude Code</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Comprend votre demande et appelle le bon MCP
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" />
              </div>

              {/* MCP Server */}
              <div className="glass-card flex-1 border-accent-500/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Plug className="h-6 w-6 text-accent-500" />
                </div>
                <p className="text-sm font-semibold">MCP Server</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Traduit la requete en appels API
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" />
              </div>

              {/* External Service */}
              <div className="glass-card flex-1 border-emerald-500/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <Globe className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold">Service externe</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  GitHub, Slack, Gmail, BDD...
                </p>
              </div>
            </div>

            <Callout type="info" title="Protocole standard">
              Le MCP est un protocole ouvert cree par Anthropic. Chaque MCP
              server expose un ensemble d&apos;outils (tools) que Claude Code
              peut appeler automatiquement. Vous n&apos;avez pas besoin
              d&apos;ecrire du code, juste de configurer la connexion.
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== COMMENT INSTALLER UN MCP ? ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Installation"
            title="Comment installer un MCP ?"
            description="Trois etapes simples pour connecter un nouveau service a Claude Code."
          />

          <div className="mt-16 space-y-12">
            {/* Step 1 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-xl font-bold">
                  Ouvrir la configuration de Claude Code
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Les MCP se configurent dans le fichier{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-brand-600 dark:bg-slate-800 dark:text-brand-400">
                  settings.json
                </code>{" "}
                de Claude Code. Vous pouvez le modifier directement ou
                utiliser la commande dediee.
              </p>
              <CodeBlock
                code={`# Ouvrir la configuration via Claude Code
claude mcp add <nom-du-mcp> -- <commande> <args>

# Ou editer manuellement le fichier de configuration
# ~/.claude/settings.json (configuration globale)
# .claude/settings.json  (configuration par projet)`}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 2 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-xl font-bold">
                  Ajouter le MCP dans settings.json
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Chaque MCP est declare dans la section{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-brand-600 dark:bg-slate-800 dark:text-brand-400">
                  mcpServers
                </code>
                . Voici la structure type :
              </p>
              <CodeBlock
                code={`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/chemin/vers/votre/dossier"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_votre_token_ici"
      }
    }
  }
}`}
                language="json"
                filename="~/.claude/settings.json"
              />
              <Callout type="warning" title="Securite des tokens">
                Ne commitez jamais vos tokens dans un repository Git.
                Utilisez des variables d&apos;environnement ou un gestionnaire
                de secrets pour les informations sensibles. Preferez la
                configuration globale (
                <code className="text-xs">~/.claude/settings.json</code>)
                pour les tokens personnels.
              </Callout>
            </div>

            {/* Step 3 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-xl font-bold">
                  Verifier que le MCP est actif
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Relancez Claude Code et verifiez que les outils du MCP sont
                disponibles. Claude Code detecte automatiquement les MCP
                configures au demarrage.
              </p>
              <CodeBlock
                code={`# Lister les MCP configures
claude mcp list

# Tester un MCP en demandant a Claude de l'utiliser
claude "Liste les fichiers dans mon dossier projet"`}
                language="bash"
                filename="Terminal"
              />
              <Callout type="tip" title="Astuce">
                Si un MCP ne se connecte pas, verifiez que la commande (npx,
                uvx, etc.) est bien installee et accessible dans votre PATH.
                Vous pouvez aussi regarder les logs avec{" "}
                <code className="text-xs">claude mcp logs</code>.
              </Callout>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOP MCP RECOMMANDES ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Recommandations"
              title="Les MCP incontournables"
              description="Notre selection des meilleurs MCP servers pour debuter et aller plus loin avec Claude Code."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {recommendedMcps.map((mcp) => (
              <div
                key={mcp.name}
                className="glass-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                    <mcp.icon className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${mcp.difficultyColor}`}
                  >
                    {mcp.difficulty}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{mcp.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {mcp.description}
                </p>
                <div className="rounded-lg bg-slate-100/80 px-3 py-2 dark:bg-slate-800/80">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Zap className="mr-1.5 inline h-3 w-3 text-accent-500" />
                    {mcp.useCase}
                  </p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== TUTORIAL : PREMIER WORKFLOW MCP ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Tutoriel"
            title="Votre premier workflow MCP"
            description="Installez et utilisez le MCP Filesystem en 5 minutes pour decouvrir la puissance des MCP."
          />

          <div className="mt-16 space-y-10">
            {/* Step 1 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold">
                  Installer le MCP Filesystem
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Le MCP Filesystem est le plus simple pour debuter. Il permet a
                Claude Code de lire et manipuler les fichiers d&apos;un
                dossier que vous choisissez.
              </p>
              <CodeBlock
                code={`# Ajouter le MCP Filesystem en une commande
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /home/votre-user/projets`}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-lg font-bold">
                  Verifier la configuration
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Assurez-vous que le MCP est bien enregistre dans votre
                configuration.
              </p>
              <CodeBlock
                code={`claude mcp list

# Resultat attendu :
# filesystem: connected
#   Tools: read_file, write_file, list_directory, search_files, ...`}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-lg font-bold">
                  Utiliser le MCP dans une conversation
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Lancez Claude Code et demandez-lui d&apos;utiliser les
                fichiers. Il detectera automatiquement le MCP Filesystem
                et l&apos;utilisera.
              </p>
              <CodeBlock
                code={`# Lancer Claude Code
claude

# Puis demandez par exemple :
> Liste tous les fichiers TypeScript dans mon dossier projets
> et donne-moi un resume de chaque fichier.

# Claude va automatiquement :
# 1. Utiliser list_directory pour explorer le dossier
# 2. Utiliser read_file pour lire chaque fichier .ts
# 3. Vous fournir un resume structure`}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 4 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                  4
                </span>
                <h3 className="text-lg font-bold">
                  Aller plus loin
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Combinez plusieurs MCP pour creer des workflows puissants.
                Par exemple, utilisez Filesystem + GitHub pour analyser un
                projet local et creer automatiquement une pull request.
              </p>
              <CodeBlock
                code={`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/votre-user/projets"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}`}
                language="json"
                filename="~/.claude/settings.json"
              />
              <Callout type="tip" title="Workflow concret">
                Essayez : &quot;Analyse les fichiers modifies cette semaine dans mon
                projet, cree une pull request avec un resume des changements,
                et envoie une notification Slack a l&apos;equipe.&quot; Claude Code
                enchainera les trois MCP automatiquement.
              </Callout>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BONNES PRATIQUES ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Bonnes pratiques"
            title="Tirer le meilleur des MCP"
          />

          <div className="mt-16 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FeatureCard
                icon={Shield}
                title="Principe du moindre privilege"
                description="N'accordez a chaque MCP que les permissions necessaires. Limitez les dossiers accessibles au MCP Filesystem, utilisez des tokens avec des scopes restreints pour GitHub."
                gradient="teal"
              />
              <FeatureCard
                icon={Settings}
                title="Configuration par projet"
                description="Utilisez le fichier .claude/settings.json a la racine de chaque projet pour des MCP specifiques. Reservez la config globale (~/.claude/settings.json) pour les MCP universels."
                gradient="amber"
              />
              <FeatureCard
                icon={Zap}
                title="Combinez les MCP"
                description="La vraie puissance emerge quand Claude enchaine plusieurs MCP dans un meme workflow. Filesystem + GitHub + Slack = automatisation complete."
                gradient="purple"
              />
              <FeatureCard
                icon={BookOpen}
                title="Documentez vos configurations"
                description="Ajoutez un fichier CLAUDE.md a la racine de vos projets pour expliquer quels MCP sont utilises et pourquoi. Claude Code le lira automatiquement."
                gradient="green"
              />
            </div>

            <Callout type="warning" title="Limites a connaitre">
              Les MCP executent des actions reelles (envoi de messages,
              creation de fichiers, requetes API). Claude Code vous demandera
              toujours confirmation avant d&apos;executer une action sensible.
              Ne desactivez pas cette protection avec{" "}
              <code className="text-xs">--dangerously-skip-permissions</code>{" "}
              en production.
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== NEXT STEPS ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Continuez votre{" "}
            <span className="text-gradient">apprentissage</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Les MCP ne sont qu&apos;une piece du puzzle. Decouvrez les Skills
            pour enseigner des comportements personnalises a Claude Code,
            et maitrisez le prompting avance pour des resultats exceptionnels.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/skills"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              <Sparkles className="h-4 w-4" />
              Decouvrir les Skills
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/prompting"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <MessageSquare className="h-4 w-4" />
              Maitriser le prompting
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
