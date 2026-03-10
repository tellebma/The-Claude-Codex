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
---
```

La validation est stricte : `title` et `description` manquants = erreur au build.

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
trailingSlash: false                // URLs sans slash final
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
2. Lancer `npm run lint && npm run type-check` avant tout commit
3. Tester le build Docker localement avant de considérer une feature comme terminée
4. Committer souvent avec des messages conventionnels (feat:, fix:, docs:, chore:)

## Checklist pour ajouter une nouvelle section

1. Créer le dossier `content/{section}/` avec les fichiers MDX (frontmatter obligatoire)
2. Créer `app/{section}/layout.tsx` qui wrap avec `<SectionLayout>`
3. Créer `app/{section}/page.tsx` (overview) et `app/{section}/[slug]/page.tsx` (sous-pages avec `generateStaticParams`)
4. Ajouter la section dans `lib/section-navigation.ts`
5. Ajouter les pages dans `SITE_PAGES` de `lib/metadata.ts`
6. Mettre à jour `lib/search-index.ts` avec les nouvelles entrées
7. Ajouter le lien dans le `navigation` array du `Header.tsx` si pertinent

## Lors du compactage

Quand tu compactes, conserve toujours : la liste complète des fichiers modifiés, l'état d'avancement des pages (terminée/en cours/à faire), et les décisions d'architecture prises.
