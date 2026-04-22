# The Claude Codex

[![PR Checks](https://github.com/tellebma/The-Claude-Codex/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/tellebma/The-Claude-Codex/actions/workflows/pr-checks.yml)
[![Develop Merge](https://github.com/tellebma/The-Claude-Codex/actions/workflows/develop-merge.yml/badge.svg)](https://github.com/tellebma/The-Claude-Codex/actions/workflows/develop-merge.yml)
[![CodeQL](https://github.com/tellebma/The-Claude-Codex/actions/workflows/codeql.yml/badge.svg)](https://github.com/tellebma/The-Claude-Codex/actions/workflows/codeql.yml)
[![CD — Docker Hub](https://github.com/tellebma/The-Claude-Codex/actions/workflows/cd.yml/badge.svg)](https://github.com/tellebma/The-Claude-Codex/actions/workflows/cd.yml)
[![Release](https://github.com/tellebma/The-Claude-Codex/actions/workflows/release.yml/badge.svg)](https://github.com/tellebma/The-Claude-Codex/actions/workflows/release.yml)

[![Quality Gate](https://sonarqube.tellebma.fr/api/project_badges/measure?project=the-claude-codex&metric=alert_status&token=sqb_aa2be756f3c995c628c5e0fd7c1e506af46a5b1c)](https://sonarqube.tellebma.fr/dashboard?id=the-claude-codex)
[![Coverage](https://sonarqube.tellebma.fr/api/project_badges/measure?project=the-claude-codex&metric=coverage&token=sqb_aa2be756f3c995c628c5e0fd7c1e506af46a5b1c)](https://sonarqube.tellebma.fr/component_measures?id=the-claude-codex&metric=coverage)
[![Bugs](https://sonarqube.tellebma.fr/api/project_badges/measure?project=the-claude-codex&metric=bugs&token=sqb_aa2be756f3c995c628c5e0fd7c1e506af46a5b1c)](https://sonarqube.tellebma.fr/project/issues?id=the-claude-codex&types=BUG)
[![Code Smells](https://sonarqube.tellebma.fr/api/project_badges/measure?project=the-claude-codex&metric=code_smells&token=sqb_aa2be756f3c995c628c5e0fd7c1e506af46a5b1c)](https://sonarqube.tellebma.fr/project/issues?id=the-claude-codex&types=CODE_SMELL)
[![Security Rating](https://sonarqube.tellebma.fr/api/project_badges/measure?project=the-claude-codex&metric=security_rating&token=sqb_aa2be756f3c995c628c5e0fd7c1e506af46a5b1c)](https://sonarqube.tellebma.fr/project/issues?id=the-claude-codex&types=VULNERABILITY)

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: open source](https://img.shields.io/badge/license-open--source-brightgreen)](#licence)

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

Le pipeline CI/CD est réparti sur cinq workflows :

### `.github/workflows/pr-checks.yml` — sur chaque PR vers `develop` / `main`

Exécuté en parallèle pour un feedback rapide (≈ 4–6 min total) :

- **gitleaks** — secret-scan sur l'historique complet
- **npm-audit** — dépendances prod (`--omit=dev --audit-level=critical`)
- **lint-types** — ESLint + `tsc --noEmit`
- **unit-tests** — Vitest avec gate coverage ≥ 80 % (config `vitest.config.ts`)
- **build** — export Next.js SSG + vérif i18n (présence `out/fr/index.html` et `out/en/index.html`)
- **validate-seo-files** — sitemap, robots, llms.txt, llms-full.txt (structure + URLs FR/EN)
- **lighthouse** — 6 pages × 3 runs, budgets perf ≥ 0.9 (warn), SEO ≥ 0.95 (error), a11y ≥ 0.95 (error)
- **lychee** — vérif liens cassés sur `out/**/*.html` avec cache 1 jour
- **e2e-smoke** — Playwright chromium sur le build statique (smoke tests)
- **sonarqube** — scan self-hosted + quality gate bloquant
- **deploy-preview** — déploiement Vercel preview **uniquement après** validation de tous les autres jobs

### `.github/workflows/develop-merge.yml` — sur `push develop`

Suite complète après merge sur `develop` :

- **build** réutilisable via artifact
- **e2e-full** matrix 3 browsers (chromium/firefox/webkit) × 2 shards, blob-report mergé en HTML
- **docker-verify** — build + smoke-run + scan Trivy (CRITICAL/HIGH bloquant, `.trivyignore` documenté)

### `.github/workflows/codeql.yml` — PR + push + nightly

SAST JavaScript/TypeScript, query set `security-and-quality`. Cron hebdo le lundi 06:00 UTC.

### `.github/workflows/cd.yml` — sur `push main`

1. Verify inline (lint + types + tests + build)
2. Build image Docker + scan Trivy **avant push** (bloque les CVE CRITICAL/HIGH)
3. Push Docker Hub avec provenance + SBOM + tags `latest`/`vX.Y.Z`/`<sha>`

### `.github/workflows/release.yml` — sur `push main`

Semantic-release (changelog + tag git + release GitHub).

---

### Qualité & sécurité — standards zéro-tolérance

- Coverage ≥ 80 % (statements / branches / functions / lines) appliqué par Vitest
- SonarQube Quality Gate bloquant : 0 bug, 0 hotspot, duplication < 3 % sur le new code
- axe-core intégré à Playwright (règles WCAG 2.1 A/AA)
- Budgets Lighthouse stricts sur SEO et a11y (error), permissifs sur perf / best-practices (warn)
- Secret-scan + SAST + container-scan sur chaque PR

### Pièges évités

- Concurrency : anciens runs PR annulés (`cancel-in-progress: true`)
- Sharding E2E avec `blob` reporter + `merge-reports` pour un rapport HTML unique malgré 6 jobs
- Animations Tailwind gatées par `motion-safe:` + `reducedMotion: 'reduce'` en CI pour éviter les flakes Playwright (opacity 0, not stable)
- Dependabot (npm + github-actions) hebdo : les actions externes pinnées par tag seront SHA-pinnées automatiquement

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
