# The Claude Codex — Site web de référence

Site de documentation et guides pour démocratiser l'utilisation de Claude Code. Stack : Next.js 14 (App Router), TypeScript strict, Tailwind CSS, MDX pour le contenu. Déployé via Docker (Nginx Alpine).

- **URL** : https://claude-codex.fr
- **Repo** : https://github.com/tellebma/The-Claude-Codex (privé)
- **Export** : 100% statique (SSG), `output: 'export'` dans `next.config.mjs`

## Commandes

- `npm run dev` : Serveur de dev (port 3000)
- `npm run build` : Build de production (SSG)
- `npm run lint` : ESLint + Prettier check
- `npm run type-check` : Vérification TypeScript
- `docker build -t claude-code-guide .` : Build de l'image Docker
- `docker compose up -d` : Lancement du site en production

## Architecture

Tous les chemins sont relatifs à `src/`.

```
app/                      → Pages et layouts (App Router)
app/(landing)             → Landing page (page d'accueil)
app/getting-started       → Guide d'installation (4 sous-pages)
app/mcp                   → Pages MCP (6 sous-pages)
app/plugins               → Pages Plugins (5 sous-pages)
app/skills                → Pages Skills (4 sous-pages)
app/agents                → Pages Agents (5 sous-pages)
app/prompting             → Guide de prompting (6 sous-pages)
app/content               → Articles éditoriaux (5 articles racine)
app/configurator          → Configurateur interactif
app/future                → Vision et tendances IA
components/ui             → Composants réutilisables (Callout, CodeBlock, Breadcrumb, SearchDialog, TableOfContents, ScrollToTop, SectionHeading)
components/layout         → Header, Footer, Logo, SectionLayout, SectionSidebar, ThemeToggle, ThemeProvider
components/mdx            → Composants MDX (MdxRenderer, MdxComponents, Card, Steps, Tabs)
lib/                      → Utilitaires (mdx.ts, metadata.ts, structured-data.ts, section-navigation.ts, search-index.ts)
content/                  → Fichiers MDX du contenu éditorial
public/                   → Assets statiques (images, icons, fonts)
```

## Système de contenu MDX

### Deux patterns de stockage

1. **Fichiers racine** `/content/*.mdx` → route `/content/[slug]` (articles éditoriaux autonomes)
2. **Sous-dossiers section** `/content/{section}/*.mdx` → route `/{section}/[slug]` (pages de documentation)

### Frontmatter obligatoire

```yaml
---
title: "Titre de la page"        # requis
description: "Description SEO"   # requis
badge: "NEW"                     # optionnel — badge affiché
order: 1                         # optionnel — tri dans la navigation
section: "getting-started"       # optionnel — section parente
datePublished: "2026-03-01"      # optionnel — date de publication
dateModified: "2026-03-10"       # optionnel — date de mise à jour
themes: ["tutorial", "security"] # optionnel — 1 à 3 badges thématiques (RG-31)
---
```

La validation est stricte : `title` et `description` manquants = erreur au build.

### Badges thématiques (`themes`)

Champ optionnel qui affiche 1 à 3 badges sous le titre de l'article. Deux dimensions, validées au build via `src/lib/themes.ts` :

| Dimension | Clés autorisées | Couleur (token) |
|-----------|-----------------|-----------------|
| **Type de contenu** (1 obligatoire si `themes` est présent) | `tutorial`, `guide`, `reference`, `comparison`, `use-case` | `--fg-secondary` (neutre) |
| **Domaine** (0 à 2 optionnels) | `security`, `devsecops`, `architecture`, `performance`, `tooling`, `productivity`, `migration` | `--color-error`, `--theme-devsecops`, `--color-info`, `--color-warning`, `--color-info`, `--color-success`, `--fg-muted` |

Règles :
- Si présent : entre 1 et 3 entrées.
- Au moins une clé de la dimension "Type de contenu".
- Une clé inconnue ou plus de 3 entrées = erreur au build.

Exemples :
```yaml
themes: ["tutorial", "tooling"]              # 1 type + 1 domaine
themes: ["guide", "architecture", "security"] # 1 type + 2 domaines
themes: ["reference"]                         # 1 type seul
```

### Composants MDX disponibles

| Composant | Usage |
|-----------|-------|
| `<Callout type="tip\|warning\|info" title="...">` | Encadrés informatifs |
| `<CodeBlock code="..." language="bash\|ts\|tsx" />` | Blocs de code avec syntax highlighting (prism-react-renderer) |
| `<Steps><Step title="..." stepNumber={1}>...</Step></Steps>` | Guides pas à pas numérotés |
| `<Tabs>` | Contenus à onglets |
| `<Card title="...">` | Cartes conteneurs |

Les balises HTML (`h1`-`h4`, `p`, `ul`, `ol`, `a`, `blockquote`, `table`, `code`, `pre`) sont auto-stylées via `MdxComponents.tsx`.

## Layout & Navigation

### SectionLayout

**Composant standard** pour toutes les sections de documentation (`components/layout/SectionLayout.tsx`). Fournit :
- Sidebar gauche : navigation de section (`SectionSidebar`)
- Zone de contenu principale (flex-1)
- Sidebar droite : table des matières auto-générée (`TableOfContents`, visible sur xl+)
- Breadcrumb en haut de page
- Bouton scroll-to-top

Chaque section l'utilise via son `layout.tsx` : `<SectionLayout>{children}</SectionLayout>`

### Configuration de navigation

**Source unique** : `lib/section-navigation.ts`. Objet `sectionNavigation` avec une entrée par section. **Mettre à jour ce fichier à chaque ajout de page.**

### Recherche

`lib/search-index.ts` : index de recherche manuel (`searchEntries(query)` avec normalisation des accents). Utilisé par `SearchDialog`.

## Design tokens

### Palette (tailwind.config.ts)

- **Brand** (cyan) : brand-50 `#ecfeff` → brand-950 `#083344`. Primaire : brand-500 `#06b6d4`
- **Accent** (ambre) : accent-50 `#fffbeb` → accent-950 `#451a03`. Primaire : accent-500 `#f59e0b`
- Dégradé logo : `from-brand-500 to-accent-500`

### Typographie

- Sans : Plus Jakarta Sans (`--font-jakarta`)
- Mono : JetBrains Mono (`--font-mono`)

### Icônes

- Bibliothèque : `lucide-react` (tree-shakeable)
- Favicon : SVG terminal `>_` sur dégradé brand→accent (`app/icon.svg`)

## SEO & Metadata

### Fonctions (`lib/metadata.ts`)

- `createPageMetadata(options)` : génère title, description, canonical, OpenGraph, Twitter card
- `SITE_PAGES` : liste exhaustive de toutes les pages avec `priority` et `changeFrequency` pour le sitemap
- `SITE_URL = "https://claude-codex.fr"`, `SITE_NAME = "The Claude Codex"`

### Données structurées (`lib/structured-data.ts`)

- `createArticleSchema()` : JSON-LD Article pour les pages de contenu
- `createHowToSchema()` : JSON-LD HowTo pour les guides
- `createBreadcrumbSchema()` : JSON-LD BreadcrumbList
- `createWebSiteSchema()` : JSON-LD WebSite (homepage)
- `serializeJsonLd()` : sérialisation sécurisée pour `<script type="application/ld+json">`

### Fichiers pour crawlers IA (`/llms.txt` et `/llms-full.txt`)

Suivent la spec [llmstxt.org](https://llmstxt.org) pour faciliter la citation du site par ChatGPT, Claude, Perplexity et Gemini.

- `/llms.txt` : index court (H1 titre, blockquote description, sections H2 avec listes de liens), FR et EN, avec les sections principales et les pages essentielles
- `/llms-full.txt` : compilation markdown de tous les fichiers `.mdx` de `content/fr/` et `content/en/`, composants MDX strippés pour rester lisible par une IA

**Génération** : `scripts/generate-llms-txt.ts`, appelé automatiquement via le hook `prebuild` du `package.json` (donc avant chaque `next build`). Peut aussi être lancé à la main avec `npm run build:llms`. Les fichiers sont écrits dans `public/` puis copiés dans `out/` par Next.js.

**Maintenance** : la liste des sections et pages "essentielles" de `llms.txt` est codée en dur dans le script (`SECTION_LANDINGS_FR`, `SECTION_LANDINGS_EN`, `POPULAR_SLUGS_FR`, `POPULAR_SLUGS_EN`). Mettre à jour quand une nouvelle section ou une page cornerstone est ajoutée.

## Style de code

- TypeScript strict, jamais de `any`
- Exports nommés uniquement, pas de default exports (sauf pages Next.js)
- Composants fonctionnels avec hooks, pas de classes React
- Tailwind utility classes uniquement, pas de CSS custom sauf variables globales dans `globals.css`
- Nommage des composants en PascalCase, des fichiers utilitaires en kebab-case
- Un composant par fichier

## Contenu & rédaction

- Ton : accessible, enthousiaste, jamais condescendant. On s'adresse à des débutants comme à des experts
- Utiliser des analogies concrètes pour chaque concept technique
- Chaque page a une intro claire, un corps structuré, et un "Prochaines étapes" en conclusion
- Les blocs de code doivent toujours avoir un langage spécifié pour le syntax highlighting
- **Écriture humaine obligatoire** : le texte doit sonner naturel, comme écrit par un humain francophone. Éviter systématiquement les tics de langage typiques des IA :
  - Pas de tiret cadratin "—" (utiliser ", " ou " : " selon le contexte)
  - Pas de formules creuses type "Il est important de noter que", "Il convient de souligner", "Force est de constater"
  - Pas d'abus de "permet de", "en effet", "ainsi", "notamment" en début de phrase
  - Pas de listes à rallonge quand une phrase suffit
  - Pas de ton excessivement enthousiaste ou promotionnel ("Plongez dans", "Découvrez la puissance de")
  - Privilégier les phrases courtes et directes aux constructions alambiquées
  - Si du texte existant sonne trop "IA", le reformuler pour qu'il paraisse naturel

### Rigueur journalistique — anti-hallucination (zéro-tolérance)

Pour TOUTE rédaction d'article, doc ou comparatif sur ce projet :

- **TOUTE statistique, date, nom propre, version, prix, URL ou fait précis DOIT être vérifié via Playwright MCP ou WebFetch AVANT d'être écrit.** Aucune exception.
- **JAMAIS écrire un fait depuis la mémoire si une vérification web est possible.** En cas d'incertitude → vérification systématique.
- **Workflow par section** : (1) lister les faits précis nécessaires, (2) vérifier chacun via Playwright/WebFetch, (3) noter source + date dans commentaire MDX masqué `{/* source: URL, consulté YYYY-MM-DD */}` (⚠️ syntax MDX, PAS `<!-- ... -->` qui est du HTML invalide dans MDX et casse next-mdx-remote au parsing), (4) rédiger uniquement avec les faits vérifiés.
- **Sources prioritaires** : doc officielle fournisseur > GitHub releases > annonces officielles. Si information non vérifiable → `<Callout type="info">` "Information non vérifiée au YYYY-MM-DD, à confirmer auprès du fournisseur".
- **Sources INTERDITES comme source factuelle** : forums Reddit, posts Twitter/X non officiels, articles de blog tiers non datés, tutoriels YouTube. Acceptables uniquement comme inspiration narrative.
- **Versions de modèles Claude** : toujours re-vérifier sur docs.anthropic.com avant chaque snippet (les modèles évoluent : actuels au 2026-05 = `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`).
- **Tarifs API** : préfixer chaque chiffre avec la date de constatation. Format : "Au YYYY-MM-DD, Replicate facture X$ pour Flux Pro (source : replicate.com/black-forest-labs/...)".
- Si Playwright/WebFetch indisponible → STOP, signaler avant de rédiger. Ne JAMAIS combler par la mémoire.

## Design & UX

- Mobile-first, responsive sur tous les breakpoints
- Dark mode / Light mode via `next-themes`
- Palette : ne pas copier le violet Anthropic — identité visuelle propre (cyan/ambre)
- Animations subtiles au scroll (framer-motion), pas de surcharge
- Score Lighthouse visé : > 90 sur les 4 métriques

## Configuration Next.js (`next.config.mjs`)

```javascript
output: 'export'                    // Export statique HTML
images: { unoptimized: true }       // Pas d'optimisation next/image (statique)
trailingSlash: true                 // URLs avec slash final (requis pour i18n)
experimental.optimizePackageImports: ['lucide-react', 'framer-motion']
```

**Implication** : pas de SSR, pas d'API routes. Toutes les routes dynamiques doivent avoir `generateStaticParams()`.

## Dépendances clés

| Package | Rôle |
|---------|------|
| next@14 | Framework React (App Router) |
| next-mdx-remote | Rendu MDX côté serveur |
| gray-matter | Parsing du frontmatter YAML |
| remark-gfm | GitHub-flavored Markdown (tables, strikethrough) |
| tailwindcss@3 | Styles utilitaires |
| next-themes | Dark/light mode |
| lucide-react | Icônes SVG |
| framer-motion | Animations scroll |
| prism-react-renderer | Syntax highlighting |
| clsx | Classes CSS conditionnelles |

## Analytics

Matomo cookieless est initialisé dans `src/app/[locale]/layout.tsx` (script injecté quand `NEXT_PUBLIC_MATOMO_URL` et `NEXT_PUBLIC_MATOMO_SITE_ID` sont définis). Il gère le pageview et le tracking de liens natif (`enableLinkTracking`).

En plus du pageview, les événements suivants sont envoyés via `window._paq` (module `src/lib/analytics/matomo.ts`) :

| Catégorie | Action | Label | Source |
|-----------|--------|-------|--------|
| `engagement` | `scroll_depth` | `25` / `50` / `75` / `100` | `useScrollDepthTracking` (hook dans `src/hooks/`) actif sur toutes les pages utilisant `SectionLayout`. Débounce 150 ms, chaque seuil tiré une seule fois par page |
| `navigation` | `external_link_click` | URL absolue cible | `useExternalLinkTracking` via un listener délégué `click` capture-phase |
| `configurator` | `configurator_start` | — | `trackConfigurator.start()` au mount de `ConfiguratorWizard` |
| `configurator` | `configurator_step` | `1` .. `4` | à chaque changement d'étape |
| `configurator` | `configurator_complete` | — | premier affichage du preview (preset ou étape 4 validée) |

Ces hooks sont montés via `<AnalyticsTracker />` (composant `"use client"` invisible) inclus dans `SectionLayout`. Pour instrumenter une page hors `SectionLayout`, importer et monter le composant côté client. Tous les helpers sont SSR-safe : garde `typeof window !== 'undefined'` et `Array.isArray(window._paq)`. Aucune donnée personnelle n'est envoyée : uniquement des URLs cibles et des labels contrôlés côté code.

## Docker & déploiement

- Dockerfile multi-stage : étape build (node:20-alpine) → étape serve (nginx:alpine)
- Nginx configuré avec headers de sécurité (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Le `docker-compose.yml` expose le port 8080 par défaut
- L'image finale doit être < 50 MB
- Ne JAMAIS inclure `node_modules` ou `.next/cache` dans l'image finale

## Règles importantes

- JAMAIS de secrets, clés API ou .env dans le repo
- Le site est 100% statique (SSG), pas de SSR ni d'API routes
- Pas de paywall, pas de tracking intrusif, pas de cookies tiers
- Les images doivent être en WebP avec lazy loading
- Chaque page doit avoir des méta-données SEO complètes (title, description, og:image)
- Accessibilité : respecter WCAG 2.1 AA minimum (aria-labels, focus visible, contrastes)

## Workflow de développement

1. Toujours créer une branche par feature (`feat/nom-feature`)
2. Lancer `npm run lint && npm run type-check && npm run test` avant tout commit
3. Pour un changement qui touche la logique métier : `npm run test:coverage` et vérifier que la couverture ne chute pas en dessous de 80 %
4. Tester le build Docker localement avant de considérer une feature comme terminée
5. Committer souvent avec des messages conventionnels (feat:, fix:, docs:, chore:)
6. **Vérifier les deux versions FR et EN** après chaque feature : naviguer sur `/fr/` et `/en/`, vérifier que le contenu est dans la bonne langue, que le LanguageSwitcher fonctionne, et que les liens internes sont préfixés par la locale

## Standards qualité (zéro-tolérance)

Le dashboard SonarQube suivi pour ce projet applique des règles strictes. Toute PR qui viole une des règles zéro-tolérance ci-dessous est refusée :

- **0 bug** ouvert (sévérité Reliability)
- **0 code smell BLOCKER ou CRITICAL** (incluant la règle `S3776` complexité cognitive)
- **Couverture de lignes ≥ 80 %**, branches ≥ 80 % (configuré dans `vitest.config.ts`)
- **Aucun `any`** en TypeScript (strict mode obligatoire)
- **Aucun hotspot de sécurité** ouvert (doit être audité et marqué `Safe` avec une note écrite, ou corrigé)
- **A11y WCAG 2.1 AA** : tout élément interactif répond au clavier (Enter/Espace/Tab), pas de `role="img"` sur `<div>`, contrastes vérifiés

Règles complémentaires appliquées dans ce projet :

- Props React : wrapper `Readonly<>` ou champs `readonly`
- Clés React : jamais l'index seul, toujours un id stable ou une clé composite explicite
- `.push()` consécutifs : les grouper en un seul appel variadique
- `.replace(/x/g, …)` → `.replaceAll(…)` (string ou regex /g)

### Scan local

La config du scanner vit dans `sonar-project.properties` (exclusions documentées en commentaires). Pour lancer un scan local contre une instance SonarQube en Docker :

```bash
# 1. Générer le rapport de coverage LCOV que le scanner va ingérer
npm run test:coverage

# 2. Lancer le scanner dockerisé (variables SONAR_HOST_URL + SONAR_TOKEN requises)
SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=<token> npm run sonar:local
```

Le fichier `sonar-project.properties` exclut légitimement `content/fr/**`, `content/en/**`, et `messages/**` du calcul de duplication : ces fichiers bilingues sont dupliqués par construction (cf. US-09 de l'EPIC qualité).

## i18n (internationalisation)

- **Framework** : next-intl v4 avec `output: 'export'` (SSG)
- **Locales** : `fr` (défaut) et `en`
- **Structure** : `src/app/[locale]/` pour les pages, `content/fr/` et `content/en/` pour le MDX
- **Routing** : `defineRouting()` dans `src/i18n/routing.ts`, `createNavigation()` dans `src/i18n/navigation.ts`
- **Navigation** : utiliser `Link`, `usePathname`, `useRouter` de `@/i18n/navigation` (PAS de `next/link` ni `next/navigation` dans les composants clients)
- **Traductions UI** : `messages/fr.json` et `messages/en.json` avec `useTranslations()` côté client, `getTranslations()` côté serveur
- **Config Next.js** : `trailingSlash: true` obligatoire pour que l'hydration i18n fonctionne
- **Docker** : utilise `http-server` (pas Nginx) pour servir correctement les RSC payloads `.txt`
- **Après chaque modification** : vérifier que `/fr/` ET `/en/` affichent le bon contenu

## Mise a jour des dates sitemap

Quand un fichier de contenu (MDX) ou une page (page.tsx) est modifie, mettre a jour la date `lastModified` correspondante :

1. **Fichier MDX** : mettre a jour le champ `dateModified` dans le frontmatter du fichier modifie
2. **metadata.ts** : mettre a jour le champ `lastModified` de l'entree correspondante dans `SITE_PAGES` (`lib/metadata.ts`)

Les deux doivent etre a la date du jour (format `YYYY-MM-DD`). Cela garantit que le sitemap XML et les donnees structurees JSON-LD refletent la bonne date de derniere modification.

**Concerne** : toute modification de texte visible (contenu, titres, descriptions). Ne pas mettre a jour pour des changements purement techniques (reformatage, imports, commentaires).

## Checklist pour ajouter une nouvelle section

1. Créer les dossiers `content/fr/{section}/` et `content/en/{section}/` avec les fichiers MDX (frontmatter obligatoire)
2. Créer `app/[locale]/{section}/layout.tsx` qui wrap avec `<SectionLayout>`
3. Créer `app/[locale]/{section}/page.tsx` (overview avec translations inline FR/EN) et `app/[locale]/{section}/[slug]/page.tsx` (sous-pages avec `generateStaticParams`)
4. Ajouter la section dans `lib/section-navigation.ts` (avec `labelKey` et `titleKey`)
5. Ajouter les traductions dans `messages/fr.json` et `messages/en.json` (namespace `sectionNav`)
6. Ajouter les pages dans `SITE_PAGES` de `lib/metadata.ts`
7. Mettre à jour `lib/search-index.ts` avec les entrées FR (`searchIndexFr`) et EN (`searchIndexEn`)
8. Ajouter le lien dans le `navigation` array du `Header.tsx` si pertinent (utiliser la clé de traduction)
9. **Vérifier sur `/fr/{section}/` et `/en/{section}/`** que tout s'affiche correctement
