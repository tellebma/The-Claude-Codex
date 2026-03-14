# MEGA-PROMPT — Claude Code Guide : Site web de référence

> Ce prompt est conçu pour être donné à Claude Code en une seule fois.
> Il décrit l'intégralité du projet, page par page, avec la stratégie SEO,
> le configurateur interactif, les données fraîches sur les MCP/plugins,
> et l'architecture Docker.

---

## 1. CONTEXTE & VISION

Tu es l'architecte principal d'un projet ambitieux : un site web appelé **"The Claude Codex"**.

**Mission** : Démocratiser Claude Code. Rendre accessible à TOUS — développeurs, entrepreneurs, créatifs, étudiants, curieux — les bonnes pratiques, outils et méthodologies pour tirer le meilleur parti de l'IA au quotidien.

**Principes fondateurs** :
- Gratuit, sans paywall, sans tracking intrusif
- Contenu frais et actionable, pas de la théorie abstraite
- Chaque page cible UNE intention de recherche (stratégie SEO granulaire)
- Un configurateur interactif génère des configs prêtes à l'emploi
- Le site lui-même est un showcase de ce que Claude Code peut produire

---

## 2. ÉQUIPE D'EXPERTS VIRTUELS

Pour chaque section, adopte le rôle de l'expert le plus pertinent :

| Expert | Domaine | Quand l'invoquer |
|--------|---------|-----------------|
| **DevSecOps** | Docker, Nginx, sécurité, CI/CD, architecture | Infrastructure, Dockerfile, headers |
| **UX/UI Designer** | Design system, landing page, responsive, a11y | Toute page visuelle, composants |
| **Pédagogue Tech** | Rédaction MDX, vulgarisation, SEO | Contenu éditorial, guides, tutos |
| **Expert Claude Code** | MCP, Skills, Plugins, Agent Teams, Prompting | Contenu technique, fact-checking |
| **SEO Strategist** | Structure, maillage interne, méta-données | Architecture des pages, URLs |

---

## 3. STACK TECHNIQUE

Choisis la stack la plus adaptée (Next.js App Router, Astro, ou Docusaurus — justifie ton choix), avec :
- TypeScript strict
- Tailwind CSS (utility classes uniquement)
- MDX pour le contenu éditorial
- SSG (Static Site Generation) — pas de SSR, pas d'API routes
- framer-motion pour les animations
- next-themes pour dark/light mode

---

## 4. ARCHITECTURE DES PAGES — STRATÉGIE SEO GRANULAIRE

**Principe : 1 page = 1 intention de recherche = 1 URL optimisée**

Chaque page a : un title unique, une meta description, des og:tags, un fil d'Ariane, et un maillage interne vers les pages connexes.

### 4.1 LANDING PAGE — `/`

C'est LA page la plus importante. Elle doit être **visuellement spectaculaire et mémorable**.

Lis et applique les principes du skill frontend-design : typographie distinctive, palette de couleurs audacieuse (PAS le violet Anthropic), composition spatiale inattendue, animations au scroll.

**Sections** :
1. **Hero** : Titre percutant + sous-titre promesse de valeur + CTA + animation/illustration engageante
2. **"Ce que vous pouvez faire"** : Galerie visuelle de 6-8 cas d'usage concrets (créer un site, automatiser, coder, documenter, tester, designer...)
3. **"Pour qui ?"** : 4 profils (Développeur, Entrepreneur, Créatif, Curieux) avec pictos
4. **"Parcours"** : 3 chemins (Débutant → Intermédiaire → Avancé) cliquables
5. **"Configurateur rapide"** : Teaser du configurateur interactif avec CTA
6. **Témoignages** / cas d'usage inspirants
7. **Footer** : liens, crédits, GitHub

### 4.2 GETTING STARTED (4 pages)

| Page | URL | Intention de recherche |
|------|-----|----------------------|
| Qu'est-ce que Claude Code ? | `/getting-started/what-is-claude-code` | "claude code c'est quoi" |
| Prérequis et installation | `/getting-started/installation` | "installer claude code" |
| Configuration de l'environnement | `/getting-started/environment-setup` | "configurer claude code" |
| Premier projet pas à pas | `/getting-started/first-project` | "tutoriel claude code débutant" |

### 4.3 MCP — Model Context Protocol (6 pages)

| Page | URL | Intention |
|------|-----|-----------|
| Comprendre les MCP en 5 minutes | `/mcp/what-are-mcps` | "MCP claude code explication" |
| Installer et configurer un MCP | `/mcp/setup` | "installer MCP claude code" |
| Top MCP pour la productivité | `/mcp/best-productivity` | "meilleurs MCP productivité" |
| Top MCP pour le développement | `/mcp/best-development` | "meilleurs MCP développement" |
| Top MCP pour le design & UI | `/mcp/best-design` | "MCP figma playwright design" |
| Créer son premier workflow MCP | `/mcp/first-workflow` | "tutoriel workflow MCP" |

**CONTENU FRAIS SUR LES MCP** — Inclure ces MCP avec des fiches détaillées :

**MCP Productivité & Design :**
- **Figma MCP** — Connexion directe à Figma, extraction de design tokens, Code to Canvas, implémentation depuis un lien Figma. Mentionner le setup OAuth dans Claude Code (`/mcp` → select figma → Authenticate) ET le mode Desktop MCP (`http://127.0.0.1:3845/mcp`). Mentionner aussi Code Connect pour mapper les composants Figma au code existant.
- **Playwright MCP** (par Microsoft) — Automatisation de navigateur via accessibility snapshots, sans modèle de vision. Claude contrôle un navigateur visible en temps réel. Idéal pour tester des flows UI.
- **Chrome DevTools MCP** — Debugging de sessions authentifiées en direct. Inspection réseau, console errors, DOM. Plus léger que Playwright pour le debug.
- **21st.dev Magic MCP** — Génération de composants UI craft inspirés des meilleurs design engineers. Nécessite une API key 21st.dev.
- **Lighthouse MCP** — Audits performance, accessibilité, SEO directement depuis Claude Code.

**MCP Développement :**
- **Context7** (par Upstash) — Documentation à jour et version-specific pour des milliers de librairies. Résout le problème des réponses basées sur des API obsolètes. Indispensable pour React 19, Next.js 15, etc.
- **Puppeteer MCP** — Alternative à Playwright, plus légère pour le scraping.
- **Firecrawl MCP** — Web scraping avancé avec extraction structurée, batch processing, analyse LLM.
- **Sentry MCP** — Connexion directe au monitoring d'erreurs.
- **Linear MCP** — Gestion de tickets depuis Claude Code.
- **PostgreSQL MCP**, **Supabase MCP** — Accès base de données.

### 4.4 PLUGINS (5 pages)

| Page | URL | Intention |
|------|-----|-----------|
| Comprendre les plugins Claude Code | `/plugins/what-are-plugins` | "plugins claude code explication" |
| Installer et gérer ses plugins | `/plugins/setup` | "installer plugins claude code" |
| Top plugins essentiels 2026 | `/plugins/best-essential` | "meilleurs plugins claude code" |
| Plugins pour le design & frontend | `/plugins/best-design` | "plugins design frontend claude" |
| Plugins pour la sécurité & qualité | `/plugins/best-security` | "plugins sécurité claude code" |

**PLUGINS À DOCUMENTER EN PRIORITÉ** (données fraîches) :

| Plugin | Marketplace | Installs | Description |
|--------|------------|----------|-------------|
| **Frontend Design** | claude-plugins-official | 96K | Design frontend production-grade |
| **Context7** | claude-plugins-official | 71K | Docs à jour pour les librairies |
| **Everything Claude Code** | everything-claude-code | 57K+ | Framework complet (agents, skills, commands) par Affaan Mustafa, gagnant du hackathon Cerebral Valley × Anthropic |
| **Security Guidance** | claude-plugins-official | 25K | Scan sécurité avant écriture de fichiers |
| **UI UX Pro Max** | ui-ux-pro-max-skill | — | Design UI/UX avancé |
| **Prompt Improver** | severity1-marketplace | — | Hook intelligent d'amélioration de prompts |
| **Code Review** | claude-plugins-official | 50K | Revue de code multi-agents |
| **Playwright** | claude-plugins-official | 28K | Automatisation navigateur |
| **Ralph Loop** | — | 57K | Boucles itératives autonomes |
| **Repomix** | — | — | Analyse de codebase via MCP |

Mentionner aussi les commandes d'installation :
```
/plugin marketplace add <org>/<repo>
/plugin install <plugin-name>
```

Et la commande pour lister ses plugins : `claude plugins list`

### 4.5 SKILLS (4 pages)

| Page | URL | Intention |
|------|-----|-----------|
| Qu'est-ce qu'un skill ? | `/skills/what-are-skills` | "skills claude code explication" |
| Top skills recommandés | `/skills/best-skills` | "meilleurs skills claude code" |
| Créer un skill custom | `/skills/create-custom` | "créer skill claude code" |
| Skills vs MCP vs Plugins — le guide | `/skills/comparison` | "différence skills MCP plugins" |

### 4.6 AGENTS & SUBAGENTS (5 pages)

| Page | URL | Intention |
|------|-----|-----------|
| Comprendre les agents et subagents | `/agents/what-are-agents` | "agents claude code" |
| Créer un subagent spécialisé | `/agents/create-subagent` | "créer subagent claude code" |
| Agent Teams — le guide complet | `/agents/agent-teams` | "agent teams claude code" |
| Top agents par cas d'usage | `/agents/best-agents` | "meilleurs agents claude code" |
| Orchestration multi-agents avancée | `/agents/orchestration` | "orchestration agents IA" |

**Contenu clé** : Expliquer la différence entre subagents (mono-session, rapport au parent) et agent teams (multi-session, communication inter-agents, task list partagée). Mentionner que les agent teams nécessitent `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` dans settings.json et que c'est en research preview.

### 4.7 PROMPTING (6 pages)

| Page | URL | Intention |
|------|-----|-----------|
| Les bases du prompting | `/prompting/basics` | "comment prompter claude code" |
| Les directives qui font la différence | `/prompting/directives` | "directives claude code" |
| Templates de prompts par métier | `/prompting/templates` | "templates prompts claude code" |
| Erreurs courantes à éviter | `/prompting/mistakes` | "erreurs prompting IA" |
| Le fichier CLAUDE.md — guide complet | `/prompting/claude-md` | "CLAUDE.md guide" |
| Prompting avancé & multi-agents | `/prompting/advanced` | "prompting avancé IA agents" |

**Contenu clé pour CLAUDE.md** : Rester concis (< 200 lignes), progressive disclosure, commandes en premier, ne pas surcharger le contexte. Mentionner `/init` pour générer un starter. Donner des exemples réels.

### 4.8 LE CONFIGURATEUR INTERACTIF (3 pages)

C'est la **killer feature** du site. Un outil interactif qui génère des configurations prêtes à télécharger.

| Page | URL | Description |
|------|-----|-------------|
| Configurateur principal | `/configurator` | L'outil interactif |
| Configurations pré-faites | `/configurator/presets` | Configs par cas d'usage |
| Importer / exporter sa config | `/configurator/import-export` | Guide import/export |

#### FONCTIONNEMENT DU CONFIGURATEUR (`/configurator`)

**Étape 1 — Profil** (single select) :
- 🧑‍💻 Développeur Web (Frontend / Fullstack)
- 📱 Développeur Mobile (iOS / Android / React Native / Flutter)
- ⚙️ Développeur Backend / API
- 🏗️ DevOps / Infrastructure
- 🎨 Designer / Créatif
- ✍️ Rédacteur / Content Creator
- 📊 Data / Analytics
- 🌱 Débutant / Curieux (pas de code)

**Étape 2 — Stack technique** (multi-select conditionnel selon le profil) :
- Web : React, Next.js, Vue, Nuxt, Svelte, Angular, Astro, HTML/CSS
- Mobile : Swift/SwiftUI, Kotlin, React Native, Flutter, Expo
- Backend : Node.js, Python, Go, Rust, Java, PHP/Laravel
- DevOps : Docker, Kubernetes, Terraform, AWS, GCP, Azure
- Design : Figma, Tailwind
- Scripting : Bash, Python scripting, Automation

**Étape 3 — Abonnement** (single select) :
- 🆓 Free (Claude Code limité)
- 💰 Pro ($20/mois — 2-3 agent teams/jour)
- 🚀 Max $100 (8-10 tasks complexes / 5h)
- 💎 Max $200 (usage intensif)
- 🔑 API (pay-per-token)

**Étape 4 — Fonctionnalités souhaitées** (multi-select) :
- Agent Teams (multi-agents parallèles)
- Subagents spécialisés
- MCP serveurs
- Plugins recommandés
- Hooks de sécurité
- Skills custom

**OUTPUT** : Le configurateur génère un **ZIP téléchargeable** contenant :

```
claude-code-config/
├── CLAUDE.md                    # Adapté à la stack
├── .claude/
│   ├── settings.local.json     # Permissions + env adaptés à l'abonnement
│   └── agents/                 # Agents adaptés au profil
│       ├── [agent-1].md
│       ├── [agent-2].md
│       └── ...
├── .mcp.json                   # MCP recommandés pour la stack
├── INSTALL.md                  # Guide d'installation pas à pas
└── README.md                   # Explication de chaque fichier
```

**LOGIQUE DE GÉNÉRATION** :

Pour l'abonnement **Free** :
- Pas d'agent teams
- Sonnet uniquement
- 2-3 MCP max recommandés
- `settings.local.json` minimaliste

Pour **Pro** :
- Agent teams activé mais usage modéré (2-3/jour)
- Mix Opus/Sonnet pour les agents
- 4-5 MCP recommandés
- Subagents activés

Pour **Max** :
- Agent teams sans restriction
- Opus pour les agents critiques
- MCP complets
- `CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000`
- Hooks avancés

**PRESETS PAR CAS D'USAGE** (`/configurator/presets`) :

| Preset | Contenu |
|--------|---------|
| **Scripting basique** | CLAUDE.md minimaliste, pas d'agents, Bash permissions |
| **Site web / Frontend** | Agents UX + code-reviewer, MCP Figma + Playwright + Context7 + 21st.dev, plugins Frontend Design + UI UX Pro Max |
| **App Mobile (React Native)** | Agents mobile-dev + tester, MCP Context7, Expo config |
| **App Mobile (Swift/Kotlin)** | Agents iOS/Android, MCP Context7 + Xcode/Gradle |
| **Backend API** | Agents architect + security, MCP PostgreSQL + Sentry, plugin Security Guidance |
| **DevOps / Infra** | Agents DevSecOps, MCP Docker, hooks CI/CD, plugin Security Guidance |
| **Design / Créatif** | Agents UX-designer, MCP Figma + Magic 21st.dev + Lighthouse, plugins Frontend Design + UI UX Pro Max |
| **Rédaction / Content** | Agents content-writer, MCP Firecrawl, plugin Prompt Improver |
| **Data / Analytics** | Agents data-analyst, MCP PostgreSQL + Supabase |
| **Débutant complet** | CLAUDE.md commenté, settings safe, pas d'agents, README ultra-détaillé |

Le configurateur doit être une **page React interactive** avec :
- Sélection progressive (chaque étape affichée après la précédente)
- Preview en temps réel du contenu généré (code viewer avec syntax highlighting)
- Bouton "Télécharger le ZIP"
- Bouton "Copier le CLAUDE.md" (clipboard)
- Estimation du coût en tokens par session

### 4.9 VISION & FUTUR (3 pages)

| Page | URL | Intention |
|------|-----|-----------|
| Pourquoi l'IA va transformer votre métier | `/future/why-ai-matters` | "impact IA métiers futur" |
| Tendances IA à suivre en 2026 | `/future/trends-2026` | "tendances IA 2026" |
| Roadmap du projet | `/future/roadmap` | Info interne |

---

## 5. DESIGN & UX (Expert UX/UI Designer)

- **Identité visuelle propre** — NE PAS copier le violet Anthropic. Créer une identité distinctive et mémorable. Typographie audacieuse (pas Inter, pas Roboto), palette de couleurs forte.
- **Mobile-first**, responsive sur tous les breakpoints
- **Dark mode / Light mode** via next-themes
- **Animations** subtiles au scroll (framer-motion), respecter `prefers-reduced-motion`
- **Navigation** : sidebar sticky sur les pages de doc, breadcrumbs, search global
- **Composants** : design system avec Cards, Callouts (tip/warning/info), CodeBlocks avec syntax highlighting, Tabs, Steps, TableOfContents auto-généré
- **Score Lighthouse** > 90 sur les 4 métriques
- **Accessibilité** : WCAG 2.1 AA (focus visible, contrastes, aria-labels)

---

## 6. DOCKER & DÉPLOIEMENT (Expert DevSecOps)

- **Dockerfile** multi-stage : `node:20-alpine` (build) → `nginx:alpine` (serve)
- Image finale < 50 MB
- **Nginx** configuré avec headers de sécurité :
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
- **docker-compose.yml** : port 8080, health check, restart policy
- **Non-root user** dans le container
- `.dockerignore` exhaustif
- `npm audit` sans vulnérabilités critiques

---

## 7. CONTENU & RÉDACTION (Expert Pédagogue)

- Langue : **Français**, termes techniques en anglais
- Ton : accessible, enthousiaste, jamais condescendant
- Structure de chaque page : Intro (pourquoi ça compte) → Corps → Exemple concret → Prochaines étapes
- Utiliser des analogies concrètes pour chaque concept
- Composants MDX : `<Callout>`, `<CodeBlock>`, `<Tabs>`, `<Steps>`, `<Card>`
- Chaque page a des liens internes vers les pages connexes (maillage SEO)
- Code examples testés et commentés

---

## 8. SEO TECHNIQUE (Expert SEO)

- **Sitemap** XML auto-généré
- **robots.txt** bien configuré
- **Structured data** (JSON-LD) pour les articles/guides
- **Open Graph** + **Twitter Card** pour chaque page
- **Canonical URLs**
- **Fil d'Ariane** (breadcrumbs) sur chaque page
- **URLs propres** en kebab-case, pas de trailing slashes
- **Images** en WebP, lazy loaded, avec alt text descriptif
- **Temps de chargement** < 2s sur mobile 3G

---

## 9. LIVRABLES ATTENDUS

1. **Code source complet** avec toutes les pages (~35 pages)
2. **Configurateur interactif** fonctionnel avec génération de ZIP
3. **Dockerfile** multi-stage optimisé
4. **docker-compose.yml** prêt à l'emploi
5. **nginx.conf** avec headers de sécurité
6. **README.md** complet (description, install, Docker, contribution)
7. **.dockerignore** et **.gitignore**

---

## 10. INSTRUCTIONS DE TRAVAIL

1. **Commence par le choix de stack** avec justification
2. **Montre l'arborescence complète** du projet
3. **Développe la landing page en premier** — c'est le showcase
4. **Puis le configurateur** — c'est la killer feature
5. **Puis les pages par section** (Getting Started → MCP → Plugins → Skills → Agents → Prompting → Future)
6. **Docker en dernier** une fois le contenu stabilisé
7. **Pour chaque page** : adopte l'expert le plus pertinent
8. **Teste le build** (`npm run build` + `docker build`) régulièrement
9. **Commite après chaque page terminée**
10. Sois créatif, surprends-moi, et propose des améliorations

**IMPORTANT** : Le contenu doit être RÉEL et UTILE. Pas de lorem ipsum, pas de "contenu à venir". Chaque page doit apporter de la valeur dès la v1.

Commence maintenant.