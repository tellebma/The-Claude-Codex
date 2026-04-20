# The Claude Codex

Le guide de référence gratuit pour maîtriser Claude Code. Créé par la communauté, pour la communauté.

## À propos

The Claude Codex est un site web open-source qui rend accessible à tous les bonnes pratiques, outils et méthodologies pour tirer le meilleur parti de Claude Code. Que vous soyez développeur, entrepreneur, étudiant ou simplement curieux — ce guide est fait pour vous.

### Contenu du site

- **Premiers pas** (4 pages) — Installation, configuration, premier projet avec Claude Code
  - Qu'est-ce que Claude Code ?
  - Prérequis et installation
  - Configuration de l'environnement
  - Premier projet pas à pas
- **MCP (Model Context Protocol)** — Connectez Claude Code à vos outils favoris
- **Plugins** — Étendez les capacités de Claude Code
- **Skills** — Enseignez de nouveaux talents à votre assistant IA
- **Agents & Subagents** — Orchestration multi-agents
- **Prompting** — L'art de communiquer efficacement avec l'IA
- **Configurateur** — Générez votre configuration Claude Code sur mesure
- **Vision & Futur** — Les tendances et l'avenir de l'IA
- **Contenus MDX** — Articles éditoriaux avec pipeline MDX

### Progression du backlog

13/18 epics terminées (72%) — voir [EPICS.md](./EPICS.md) pour le détail complet (32 epics au total).

### Roadmap

**Court terme — T1 2026**
- Refonte section Prompting (6 pages enrichies)
- Configurateur interactif (killer feature — génération de config ZIP)
- Audit de crédibilité et correction des informations fictives
- Contenu visuel : captures d'écran annotées, GIFs, vidéos embarquées

**Moyen terme — T2 2026**
- Parcours grand débutant et prérequis zéro (glossaire, tutoriel pas-à-pas)
- Documentation de référence technique (cheatsheet CLI, hooks, mode headless)
- Guides vidéo et walkthroughs visuels pour chaque section
- Contributions communautaires (recettes, workflows, retours d'expérience)

**Long terme — T3-T4 2026**
- Parcours différenciés par persona (novice, dev expérimenté, entreprise)
- Section Enterprise complète (sécurité, compliance, TCO, adoption d'équipe)
- Répertoire searchable de MCP & Skills
- Analytics self-hosted respectueux du RGPD (Matomo cookieless)
- Enrichissement des sections Skills et Agents pour profils avancés

**Très long terme — 2027+**
- Support multilingue (anglais, espagnol, arabe et plus)
- Tutoriels interactifs dans le navigateur
- Contenu non-développeur et cas d'usage universels
- Comparaisons objectives, limites et coûts réels de Claude Code

## Stack technique

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** | App Router, Static Export (SSG) |
| **TypeScript** | Mode strict, pas de `any` |
| **Tailwind CSS** | Utility-first styling |
| **MDX** | Contenu éditorial (next-mdx-remote + gray-matter) |
| **Framer Motion** | Animations reveal-on-scroll |
| **Lucide React** | Icônes |
| **next-themes** | Dark/light mode |
| **Nginx Alpine** | Serveur Docker avec Brotli + headers de sécurité |

## Démarrage rapide

### Développement local

```bash
# Cloner le projet
git clone https://github.com/tellebma/The-Claude-Codex.git
cd The-Claude-Codex

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

### Docker Compose (production)

```bash
# Build et lancement en une commande
docker compose up -d --build

# Arrêter le conteneur
docker compose down
```

Le site sera accessible sur `http://localhost:8080`.

## Structure du projet

```
/content                  Fichiers MDX du contenu éditorial
  /getting-started        4 pages Getting Started
/src
  /app                    Pages et layouts (App Router)
    /getting-started      Guide d'installation + [slug] dynamique
    /mcp                  Guide MCP
    /plugins              Section Plugins
    /skills               Guide Skills
    /agents               Section Agents
    /prompting            Guide Prompting
    /configurator         Configurateur interactif
    /future               Vision et futur
    /content              Pages MDX dynamiques
    globals.css           Variables CSS et design system
    layout.tsx            Layout racine avec SEO
    page.tsx              Landing page
    sitemap.ts            Sitemap XML auto-généré
    robots.ts             Configuration robots.txt
  /components
    /layout               Header, Footer, Logo, ThemeToggle, SectionLayout, SectionSidebar
    /ui                   Composants réutilisables (Callout, CodeBlock, PathCard, etc.)
    /mdx                  Composants MDX (Card, Tabs, Steps, MdxRenderer)
  /lib
    mdx.ts                Pipeline MDX (lecture, compilation, validation)
    metadata.ts           Helper SEO centralisé
    structured-data.ts    JSON-LD (Article, HowTo, BreadcrumbList)
    search-index.ts       Index de recherche statique
    section-navigation.ts Navigation latérale par section
/nginx
  nginx.conf              Configuration Nginx avec Brotli, headers de sécurité
/public                   Assets statiques (logo, og images)
Dockerfile                Build multi-stage optimisé (< 50 MB)
docker-compose.yml        Déploiement one-click
```

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` | Build de production (SSG) |
| `npm run lint` | Vérification ESLint |
| `npm run type-check` | Vérification TypeScript |
| `npm run docker:build` | Build image Docker |
| `npm run docker:push` | Push vers Docker Hub |
| `npm run docker:release` | Build + Push en une commande |
| `docker compose up -d --build` | Déploiement production |

## Intégration continue (GitHub Actions)

Le workflow `.github/workflows/ci.yml` s'exécute sur chaque `pull_request` vers `main` et chaque `push` sur `main`. Il enchaîne :

1. `npm ci` (Node 22 aligné avec le Dockerfile, `actions/setup-node` SHA-pinné pour la supply-chain)
2. `npm run lint`
3. `npm run type-check`
4. `npm run test`
5. `npm run build` (avec valeurs Matomo factices, injectées au build pour le SSG)
6. Vérification du build Docker (image construite puis démarrée pour tester `/fr/` et `/en/`)

Points clés :

- **Fail-fast** : la première étape qui échoue stoppe le run
- **Concurrency** : les anciens runs d'une même PR/branche sont annulés automatiquement
- **Timeout** : 15 minutes max par job
- **Pas de déploiement automatique** : le déploiement production se fait manuellement via Docker sur Unraid. Les workflows `cd.yml` (push Docker Hub) et `release.yml` (semantic-release) se déclenchent uniquement sur succès du CI sur `main`.

## Sécurité

Le site est déployé avec une configuration Nginx durcie incluant :
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS) conditionnel
- X-Frame-Options, X-Content-Type-Options
- Referrer-Policy, Permissions-Policy
- Conteneur en lecture seule, utilisateur non-root
- Compression Brotli pré-calculée

## Accessibilité

- WCAG 2.1 AA : contrastes vérifiés, focus visible, skip-to-content
- Navigation clavier complète (tabs WAI-ARIA)
- Icônes décoratives masquées (`aria-hidden`)
- Landmarks et aria-labels sur les zones de navigation

## Contribuer

Les contributions sont les bienvenues. Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feat/ma-feature`)
3. Committez vos changements (`git commit -m "feat: description"`)
4. Poussez la branche (`git push origin feat/ma-feature`)
5. Ouvrez une Pull Request

## Licence

Projet open-source.
