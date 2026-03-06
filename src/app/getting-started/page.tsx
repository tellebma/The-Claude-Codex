import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  CheckCircle2,
  Settings,
  AlertCircle,
  BookOpen,
  Puzzle,
  MessageSquare,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Premiers pas avec Claude Code",
  description:
    "Guide complet pour installer, configurer et utiliser Claude Code. De zero a votre premier projet en quelques minutes.",
  openGraph: {
    title: "Premiers pas avec Claude Code | The Claude Codex",
    description:
      "Guide complet pour installer, configurer et utiliser Claude Code. De zero a votre premier projet en quelques minutes.",
  },
};

export default function GettingStartedPage() {
  return (
    <>
      {/* ===== HERO / INTRO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Sparkles className="h-4 w-4" />
              Guide pas a pas
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Premiers pas avec{" "}
              <span className="text-gradient">Claude Code</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Vous etes au bon endroit. Que vous soyez developpeur experimente ou
              que vous n&apos;ayez jamais ouvert un terminal, ce guide vous
              accompagne de l&apos;installation a votre premier projet concret.
              Pas de jargon inutile, juste l&apos;essentiel.
            </p>
          </div>
        </div>
      </section>

      {/* ===== PREREQUIS ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Etape 0"
            title="Prerequis"
            description="Avant de commencer, assurez-vous d'avoir ces trois elements. Si l'un d'entre eux vous manque, pas de panique — on vous explique tout."
            centered={false}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <Terminal className="h-5 w-5 text-brand-700 dark:text-brand-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Node.js 18+
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Le runtime JavaScript necessaire pour executer Claude Code.
                Telechargez-le sur{" "}
                <a
                  href="https://nodejs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 dark:text-brand-400 underline hover:text-brand-700 dark:hover:text-brand-300"
                >
                  nodejs.org
                </a>
                .
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <FolderOpen className="h-5 w-5 text-brand-700 dark:text-brand-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Un terminal
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Terminal (macOS), PowerShell ou WSL (Windows), ou n&apos;importe
                quel terminal Linux. Claude Code vit dans le terminal.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                <Settings className="h-5 w-5 text-accent-500" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Un compte Anthropic
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Creez votre compte sur{" "}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 dark:text-brand-400 underline hover:text-brand-700 dark:hover:text-brand-300"
                >
                  console.anthropic.com
                </a>{" "}
                et generez une API key.
              </p>
            </div>
          </div>

          <Callout type="tip" title="Verifiez votre version de Node.js">
            <p>
              Ouvrez votre terminal et tapez{" "}
              <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                node --version
              </code>
              . Vous devez voir un numero superieur ou egal a{" "}
              <strong>v18.0.0</strong>. Si ce n&apos;est pas le cas, mettez a
              jour Node.js avant de continuer.
            </p>
          </Callout>

          <CodeBlock
            code="node --version
# v22.4.0  ← Parfait, vous etes pret !"
            language="bash"
            filename="terminal"
          />
        </div>
      </section>

      {/* ===== INSTALLATION ===== */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Etape 1"
            title="Installation"
            description="Deux commandes suffisent pour installer Claude Code et lancer votre premiere session."
            centered={false}
          />

          <div className="mt-10 space-y-8">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Installez Claude Code globalement
                </h3>
              </div>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Cette commande installe Claude Code en tant qu&apos;outil global
                sur votre machine. Vous pourrez l&apos;utiliser depuis
                n&apos;importe quel dossier.
              </p>
              <CodeBlock
                code="npm install -g @anthropic-ai/claude-code"
                language="bash"
                filename="terminal"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Lancez Claude Code
                </h3>
              </div>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Placez-vous dans le dossier de votre projet (ou n&apos;importe quel
                dossier pour commencer) et lancez la commande{" "}
                <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                  claude
                </code>
                .
              </p>
              <CodeBlock
                code={`cd ~/mon-projet
claude`}
                language="bash"
                filename="terminal"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Authentifiez-vous
                </h3>
              </div>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Lors du premier lancement, Claude Code vous demandera de vous
                connecter. Vous pouvez choisir entre votre compte Anthropic
                (avec abonnement Max) ou une API key.
              </p>
              <CodeBlock
                code={`claude

# Claude Code va afficher :
# ? How would you like to authenticate?
# > Anthropic Console (API key)
#   Claude App (Max subscription)
#
# Choisissez votre methode et suivez les instructions.`}
                language="bash"
                filename="terminal"
              />
            </div>
          </div>

          <Callout type="info" title="Installation alternative avec Max">
            <p>
              Si vous avez un abonnement Claude Max (ou Pro/Team), vous pouvez
              utiliser Claude Code sans API key separee. Selectionnez simplement
              &quot;Claude App&quot; lors de l&apos;authentification et
              connectez-vous avec votre compte.
            </p>
          </Callout>

          <Callout type="warning" title="Erreur de permissions ?">
            <p>
              Sur macOS/Linux, si vous obtenez une erreur{" "}
              <code className="rounded bg-amber-100/50 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900/30">
                EACCES
              </code>
              , ne lancez surtout pas{" "}
              <code className="rounded bg-amber-100/50 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900/30">
                sudo npm install
              </code>
              . Configurez plutot le prefix npm pour eviter les problemes de
              permissions :
            </p>
            <CodeBlock
              code={`mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc`}
              language="bash"
              filename="terminal"
            />
          </Callout>
        </div>
      </section>

      {/* ===== CONFIGURATION ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Etape 2"
            title="Configuration"
            description="Personnalisez Claude Code pour qu'il s'adapte parfaitement a votre facon de travailler."
            centered={false}
          />

          <div className="mt-10 space-y-10">
            {/* API Key */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Configurer votre API key
              </h3>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Si vous utilisez une API key, la methode la plus propre est de
                definir une variable d&apos;environnement. Ajoutez cette ligne a
                votre fichier de configuration shell (
                <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                  .bashrc
                </code>
                ,{" "}
                <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                  .zshrc
                </code>
                , etc.) :
              </p>
              <CodeBlock
                code={`# Ajoutez cette ligne a votre ~/.bashrc ou ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-votre-cle-ici"

# Rechargez votre configuration
source ~/.bashrc  # ou source ~/.zshrc`}
                language="bash"
                filename="~/.bashrc"
              />

              <Callout type="warning" title="Securite de votre API key">
                <p>
                  Ne partagez jamais votre API key. Ne la commitez jamais dans un
                  depot Git. Si vous pensez qu&apos;elle a ete exposee, regenerez-la
                  immediatement depuis{" "}
                  <a
                    href="https://console.anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 underline hover:text-amber-500 dark:text-amber-400"
                  >
                    console.anthropic.com
                  </a>
                  .
                </p>
              </Callout>
            </div>

            {/* settings.json */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Le fichier settings.json
              </h3>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Claude Code stocke ses preferences dans le fichier{" "}
                <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                  ~/.claude/settings.json
                </code>
                . Vous pouvez le modifier pour personnaliser le comportement par
                defaut, gerer les permissions des outils ou activer le mode
                extended thinking.
              </p>
              <CodeBlock
                code={`{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git *)"
    ],
    "deny": [
      "Bash(rm -rf *)"
    ]
  },
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-..."
  }
}`}
                language="json"
                filename="~/.claude/settings.json"
              />
            </div>

            {/* CLAUDE.md */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Le fichier CLAUDE.md
              </h3>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                C&apos;est le fichier le plus puissant de votre configuration.
                Placez un fichier{" "}
                <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                  CLAUDE.md
                </code>{" "}
                a la racine de votre projet pour donner du contexte permanent a
                Claude Code. Il le lira automatiquement a chaque session.
              </p>
              <CodeBlock
                code={`# CLAUDE.md

## A propos de ce projet
Application e-commerce construite avec Next.js 14, TypeScript et Prisma.

## Conventions de code
- Utiliser des composants fonctionnels React uniquement
- Nommer les fichiers en kebab-case
- Ecrire les tests avec Vitest
- Toujours utiliser les imports absolus (@/)

## Commandes utiles
- \`npm run dev\` — Lancer le serveur de dev
- \`npm run test\` — Lancer les tests
- \`npm run build\` — Build de production

## Structure du projet
- src/app/ — Pages Next.js (App Router)
- src/components/ — Composants reutilisables
- src/lib/ — Utilitaires et configuration
- prisma/ — Schema et migrations`}
                language="markdown"
                filename="CLAUDE.md"
              />

              <Callout type="tip" title="Astuce : CLAUDE.md hierarchique">
                <p>
                  Vous pouvez placer un{" "}
                  <code className="rounded bg-emerald-100/50 px-1.5 py-0.5 font-mono text-xs dark:bg-emerald-900/30">
                    CLAUDE.md
                  </code>{" "}
                  dans n&apos;importe quel sous-dossier. Claude Code lira tous les
                  fichiers CLAUDE.md entre la racine du projet et le dossier
                  courant, du plus general au plus specifique. Parfait pour les
                  monorepos.
                </p>
              </Callout>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PREMIER PROJET ===== */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Etape 3"
            title="Hello World avec Claude Code"
            description="Passons a la pratique. En 5 minutes, vous allez creer une page web complete en partant d'un dossier vide."
            centered={false}
          />

          <div className="mt-10 space-y-8">
            {/* Step 1 */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Creez un dossier et lancez Claude Code
                </h3>
              </div>
              <CodeBlock
                code={`mkdir ~/hello-claude && cd ~/hello-claude
claude`}
                language="bash"
                filename="terminal"
              />
            </div>

            {/* Step 2 */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Decrivez ce que vous voulez
                </h3>
              </div>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Une fois dans Claude Code, tapez votre demande en langage naturel.
                Soyez precis sur ce que vous souhaitez obtenir :
              </p>
              <CodeBlock
                code={`> Cree-moi une page web HTML moderne avec :
> - Un titre "Bienvenue sur mon site"
> - Une description de 2 lignes sur l'IA et la creativite
> - Un bouton "En savoir plus" avec un effet hover
> - Un design sombre et elegant avec des touches de cyan
> - Le tout responsive et accessible`}
                language="text"
                filename="claude"
              />
            </div>

            {/* Step 3 */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Observez Claude Code travailler
                </h3>
              </div>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Claude Code va analyser votre demande, creer le fichier{" "}
                <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                  index.html
                </code>{" "}
                avec tout le CSS integre, et vous montrer le resultat. Il vous
                demandera votre autorisation avant d&apos;ecrire chaque fichier.
              </p>
              <CodeBlock
                code={`# Claude Code va generer quelque chose comme :

Claude > Je vais creer votre page web. Voici le plan :
  1. Creer index.html avec le HTML semantique
  2. Integrer le CSS directement dans le fichier
  3. Ajouter les interactions JavaScript pour le bouton

Claude > Puis-je creer le fichier index.html ? (y/n)`}
                language="text"
                filename="claude"
              />
            </div>

            {/* Step 4 */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                  4
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Ouvrez votre page et iterez
                </h3>
              </div>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                Ouvrez le fichier dans votre navigateur pour voir le resultat.
                Vous pouvez ensuite demander des modifications directement dans
                la meme session :
              </p>
              <CodeBlock
                code={`> Ajoute une animation d'apparition progressive sur le titre
> et un footer avec l'annee courante et un lien vers mon GitHub`}
                language="text"
                filename="claude"
              />
            </div>
          </div>

          <Callout type="tip" title="L'iteration, c'est la cle">
            <p>
              Ne cherchez pas a tout decrire parfaitement du premier coup.
              Commencez par une demande simple, puis affinez etape par etape.
              Claude Code garde le contexte de toute la conversation et comprend
              vos retours. C&apos;est exactement comme travailler avec un collegue.
            </p>
          </Callout>
        </div>
      </section>

      {/* ===== TROUBLESHOOTING ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Aide"
            title="Problemes courants et solutions"
            description="Quelque chose ne fonctionne pas ? Voici les erreurs les plus frequentes et comment les resoudre."
            centered={false}
          />

          <div className="mt-10 space-y-6">
            {/* Error 1 */}
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  &quot;API key not found&quot; ou &quot;Invalid API key&quot;
                </h3>
              </div>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                Claude Code ne trouve pas votre cle API ou celle-ci est invalide.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Verifiez que la variable{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      ANTHROPIC_API_KEY
                    </code>{" "}
                    est bien definie :{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      echo $ANTHROPIC_API_KEY
                    </code>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Assurez-vous que la cle commence par{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      sk-ant-
                    </code>{" "}
                    et qu&apos;elle n&apos;a pas ete revoquee.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Si vous avez modifie votre{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      .bashrc
                    </code>
                    , n&apos;oubliez pas de relancer votre terminal ou de faire{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      source ~/.bashrc
                    </code>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Error 2 */}
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  &quot;Node.js version too old&quot; ou &quot;Unsupported
                  engine&quot;
                </h3>
              </div>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                Votre version de Node.js est trop ancienne pour Claude Code.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Mettez a jour Node.js vers la version 18 ou superieure via{" "}
                    <a
                      href="https://nodejs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 dark:text-brand-400 underline hover:text-brand-700 dark:hover:text-brand-300"
                    >
                      nodejs.org
                    </a>{" "}
                    ou avec un gestionnaire de versions.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Utilisez{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      nvm
                    </code>{" "}
                    pour gerer plusieurs versions facilement :
                  </p>
                </div>
              </div>
              <CodeBlock
                code={`# Installer nvm (si pas deja fait)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Installer et utiliser Node.js 22 (LTS)
nvm install 22
nvm use 22`}
                language="bash"
                filename="terminal"
              />
            </div>

            {/* Error 3 */}
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  &quot;EACCES: permission denied&quot;
                </h3>
              </div>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                npm n&apos;a pas les permissions pour installer des paquets globaux.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ne jamais utiliser{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      sudo
                    </code>{" "}
                    avec npm. Cela cree des problemes de permissions en cascade.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Configurez un repertoire global pour npm (voir la section
                    Installation ci-dessus) ou utilisez{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      nvm
                    </code>{" "}
                    qui gere les permissions automatiquement.
                  </p>
                </div>
              </div>
            </div>

            {/* Error 4 */}
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-3 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  &quot;command not found: claude&quot;
                </h3>
              </div>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                Le terminal ne trouve pas la commande claude apres l&apos;installation.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Fermez et rouvrez votre terminal, ou faites{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      source ~/.bashrc
                    </code>
                    .
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Verifiez que le dossier global npm est dans votre PATH :{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      npm config get prefix
                    </code>{" "}
                    doit pointer vers un dossier dont le sous-dossier{" "}
                    <code className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700/50">
                      bin/
                    </code>{" "}
                    est dans votre PATH.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCHAINES ETAPES ===== */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              Et ensuite ?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Vous etes pret. Continuez votre{" "}
              <span className="text-gradient">apprentissage</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Maintenant que Claude Code est installe et configure, explorez les
              fonctionnalites avancees qui vont transformer votre quotidien.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href="/mcp"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80"
            >
              <Puzzle className="mb-3 h-8 w-8 text-brand-400" />
              <h3 className="mb-2 font-semibold text-white">
                Les MCP
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Connectez Claude Code a Gmail, GitHub, Slack, vos bases de donnees
                et des dizaines d&apos;autres outils.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Decouvrir les MCP
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/skills"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80"
            >
              <BookOpen className="mb-3 h-8 w-8 text-accent-400" />
              <h3 className="mb-2 font-semibold text-white">
                Les Skills
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Creez des competences reutilisables pour automatiser vos taches
                repetitives et standardiser vos workflows.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                Explorer les Skills
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/prompting"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80"
            >
              <MessageSquare className="mb-3 h-8 w-8 text-emerald-400" />
              <h3 className="mb-2 font-semibold text-white">
                Le Prompting
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Maitrisez l&apos;art de communiquer avec Claude Code pour obtenir
                des resultats precis et de haute qualite.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                Apprendre le prompting
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
