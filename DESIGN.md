# DESIGN.md — The Claude Codex

> Système de design consommé par Impeccable, UI UX Pro Max, Taste Skill et tout autre skill qui supporte le format Stitch/DESIGN.md.
> Source de vérité technique : `src/app/globals.css` (Tailwind v4 `@theme`) + `CLAUDE.md`.
> Dernière mise à jour : 2026-05-11.

---

## 1. Identité visuelle

| Trait | Valeur |
|-------|--------|
| **Style général** | Tech éditorial moderne — proche d'un site de doc premium type Linear/Vercel/Stripe, pas un blog perso |
| **Palette** | Cyan + ambre (volontairement à l'opposé du violet Anthropic, pour identité propre) |
| **Densité** | 4-5/10 (lecture confortable, pas un cockpit ; cf. `VISUAL_DENSITY` du Taste Skill) |
| **Motion** | 4-5/10 (animations subtiles, jamais ostentatoires ; cf. `MOTION_INTENSITY`) |
| **Variance layout** | 5-6/10 (structure cohérente entre pages, variations contrôlées sur landing/hero) |
| **Modes** | Dark + light, switch via `next-themes` (classe `.dark` sur `html`) |
| **Mobile-first** | Strictement. Toutes les pages testées sur breakpoints `sm` / `md` / `lg` / `xl`. |

## 2. Couleurs

### 2.1 Palette brand (cyan)

Source : `globals.css` `@theme` `--color-brand-*`. Token primaire : `--brand-primary: #0e7490` (brand-700, contraste AA garanti sur blanc à 4.95:1).

| Token | Hex | Usage typique |
|-------|-----|---------------|
| `brand-50` | `#ecfeff` | Fonds très clairs, badges hero |
| `brand-100` | `#cffafe` | Backgrounds callout info |
| `brand-200` | `#a5f3fc` | États hover light |
| `brand-300` | `#67e8f9` | Texte sur fond sombre (`--brand-on-dark`) |
| `brand-400` | `#22d3ee` | Accents secondaires |
| **`brand-500`** | **`#06b6d4`** | **Primaire principal (logo, CTA, gradients)** |
| `brand-600` | `#0891b2` | Hover de brand-500 |
| **`brand-700`** | **`#0e7490`** | **`--brand-primary` (texte sur light, AA garanti)** |
| `brand-800` | `#155e75` | `--brand-hover` |
| `brand-900` | `#164e63` | Fonds sombres |
| `brand-950` | `#083344` | Surfaces nuit profondes |

### 2.2 Palette accent (ambre)

Token primaire : `--color-accent-500: #f59e0b`. Utilisé en complément du cyan dans les gradients (logo, hero, CTA), jamais seul comme couleur primaire d'un composant interactif.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-50` | `#fffbeb` | Backgrounds très subtils |
| `accent-100` | `#fef3c7` | Callout warning bg |
| `accent-300` | `#fcd34d` | Highlights doux |
| **`accent-500`** | **`#f59e0b`** | **Accent principal (gradients, highlights)** |
| `accent-700` | `#b45309` | Texte sur callout warning (`--callout-warning-text`) |
| `accent-950` | `#451a03` | Backgrounds nuit |

### 2.3 Palette neutre (slate)

Toute la grille de gris/neutres passe par `slate-*`. Pas de `gray-*` ni `zinc-*`.

| Token | Hex | Usage |
|-------|-----|-------|
| `slate-50` | `#f8fafc` | `--bg-subtle` (alt sections) |
| `slate-100` | `#f1f5f9` | Surfaces alt |
| `slate-200` | `#e2e8f0` | `--border-default` |
| `slate-300` | `#cbd5e1` | `--border-strong`, `--code-fg-secondary` |
| `slate-400` | `#94a3b8` | Texte tertiaire |
| `slate-500` | `#64748b` | `--fg-muted`, `--code-comment` |
| `slate-600` | `#475569` | `--fg-secondary` |
| `slate-700` | `#334155` | Texte sur dark |
| `slate-800` | `#1e293b` | Surfaces dark |
| `slate-900` | `#0f172a` | `--fg-primary`, surfaces nuit |
| `slate-950` | `#020617` | Backgrounds nuit profonds |

### 2.4 Tokens sémantiques (à privilégier dans les composants)

```css
/* Backgrounds */
--bg-page: #ffffff;
--bg-subtle: #f8fafc;          /* alterner sections landing */
--bg-elevated: #ffffff;

/* Foregrounds */
--fg-primary: #0f172a;          /* texte principal */
--fg-secondary: #475569;        /* sous-titres, descriptions */
--fg-muted: #64748b;            /* meta, captions */
--fg-on-brand: #ffffff;         /* texte sur fond brand */

/* Borders */
--border-subtle: rgba(226, 232, 240, 0.6);
--border-default: #e2e8f0;
--border-strong: #cbd5e1;

/* Brand */
--brand-primary: #0e7490;       /* AA garanti sur blanc */
--brand-hover: #155e75;
--brand-on-light: #0e7490;
--brand-on-dark: #67e8f9;       /* à utiliser en dark mode */

/* Status */
--color-success: #22c55e;       /* vert green-500 */
--color-warning: #f59e0b;       /* ambre, aligné accent-500 */
--color-error: #ef4444;         /* rouge red-500 */
--color-info: #06b6d4;          /* cyan, aligné brand-500 */

/* Themes éditoriaux articles (RG-31) */
--theme-devsecops: #7c3aed;     /* violet (seul cas d'usage du violet sur le site) */
```

**Règle** : un nouveau composant doit consommer ces tokens sémantiques, pas les valeurs primitives directes. Cela garantit qu'il s'adapte automatiquement au dark mode (qui surcharge ces variables dans `:root.dark`).

## 3. Typographie

### 3.1 Familles

| Famille | Variable CSS | Usage |
|---------|--------------|-------|
| **Plus Jakarta Sans** | `--font-jakarta` → `--font-sans` | Tout le texte (UI + contenu éditorial) |
| **JetBrains Mono** | `--font-mono` | Inline code, blocs de code, numéros séquentiels |

Pas d'autre famille. Pas d'Inter (volontairement, anti-cliché AI). Pas de serif éditoriale (le site veut rester "developer-first").

### 3.2 Échelle (RG-04, tokenisée)

L'échelle utilise `clamp()` pour une fluidité parfaite mobile→desktop.

| Token Tailwind | Valeur | Usage |
|----------------|--------|-------|
| `text-display-1` | `clamp(2.75rem, 5.4vw, 4.75rem)` | Titre landing principal |
| `text-display-2` | `clamp(2.5rem, 5vw, 4rem)` | Hero secondaire |
| `text-h1` | `clamp(2.25rem, 5vw, 3.75rem)` | H1 page section |
| `text-h1-doc` | `2.75rem` | H1 article doc (taille fixe) |
| `text-h2` | `clamp(1.875rem, 4vw, 2.625rem)` | H2 section |
| `text-h2-article` | `2rem` | H2 dans article éditorial |
| `text-h2-doc` | `1.625rem` | H2 dans page doc |
| `text-h3` | `1.375rem` | H3 universel |
| `text-h4` | `1.125rem` | H4 universel |
| `text-lead` | `1.1875rem` | Paragraphe d'introduction |
| `text-body` | `1rem` | Corps de texte standard |
| `text-body-sm` | `0.9375rem` | Corps secondaire |
| `text-caption` | `0.8125rem` | Captions, meta |
| `text-eyebrow` | `0.75rem` | Eyebrow uppercase au-dessus des titres |
| `text-mono-inline` | `0.9em` | Code inline relatif au texte |

### 3.3 Tracking (letter-spacing)

| Token | Valeur | Usage |
|-------|--------|-------|
| `tracking-display` | `-0.03em` | Titres display + h1 (resserré) |
| `tracking-tight-2` | `-0.02em` | Titres h2-h3 |
| `tracking-eyebrow` | `0.08em` | Eyebrow uppercase (étiré) |

### 3.4 Hiérarchie de référence (ArticleHero, le gold standard éditorial)

- Pill catégorie pulsante : `text-eyebrow` + `tracking-eyebrow` + uppercase + dot animé
- Titre : `clamp(36px, ..., 60px)`, `font-weight: 800`, `letter-spacing: -0.03em`, support `titleHighlight` en gradient avec saut de ligne
- Lead : `21px`, couleur `--fg-secondary`, `max-width: 60ch`
- Theme badges (1 à 3) : type de contenu + domaine
- Meta dates : `text-caption` avec icônes Calendar + RefreshCw

## 4. Spacing et layout

| Système | Valeur |
|---------|--------|
| **Container max-width** | `max-w-7xl` (1280px) pour la plupart des pages, `max-w-3xl` pour les articles MDX |
| **Padding horizontal page** | `px-4 sm:px-6 lg:px-8` |
| **Gutters grilles** | `gap-6` ou `gap-8` (24px / 32px) |
| **Section padding vertical** | `py-16 sm:py-24 lg:py-32` |
| **Espacement texte** | Hiérarchie strictes : H2 → `mt-16 mb-6`, H3 → `mt-10 mb-4`, paragraphe → `mb-4` |

**Règle anti-flexbox math** (héritée de Taste Skill) : utiliser CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) plutôt que `w-[calc(33%-1rem)]`.

**Règle viewport stability** : jamais de `h-screen` pour les hero, toujours `min-h-[100dvh]` (évite le saut iOS Safari).

## 5. Shadows (RG-05)

```css
--shadow-xs:  0 1px 2px 0 rgba(15, 23, 42, 0.04);
--shadow-sm:  0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.05);
--shadow-md:  0 6px 14px -4px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.05);
--shadow-lg:  0 12px 28px -10px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06);
--shadow-xl:  0 24px 48px -16px rgba(15, 23, 42, 0.18);
--shadow-2xl: 0 35px 60px -15px rgba(15, 23, 42, 0.3);

--shadow-card:     var(--shadow-sm);   /* alias usage carte */
--shadow-elevated: var(--shadow-lg);   /* alias usage modal/popover */
--shadow-focus:    0 0 0 3px rgba(6, 182, 212, 0.35);  /* ring focus brand */
--glow-brand:      0 0 60px -12px rgba(6, 182, 212, 0.25);
--glow-amber:      0 0 60px -12px rgba(245, 158, 11, 0.2);
```

**Règle** : pas de `shadow-2xl` dans le contenu éditorial (réservé au modal). Cards standard utilisent `shadow-card` (= `shadow-sm`), élévation au hover via `shadow-md`.

## 6. Gradients signature

```css
--gradient-brand:        linear-gradient(135deg, #06b6d4, #0891b2, #f59e0b);
--gradient-brand-text:   linear-gradient(135deg, #06b6d4, #22d3ee, #f59e0b, #06b6d4);
--gradient-hero:         linear-gradient(180deg, #fbfdff 0%, #ffffff 70%);
--gradient-hero-radial-1: rgba(6, 182, 212, 0.20);   /* halo cyan */
--gradient-hero-radial-2: rgba(245, 158, 11, 0.14);  /* halo ambre */
--gradient-card:         linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(245, 158, 11, 0.05));
```

**Article hero** (rouge/ambre, distinct du landing) :

```css
--art-hero-bg:
  radial-gradient(ellipse 50% 60% at 100% 0%, rgba(239, 68, 68, 0.12), transparent 60%),
  radial-gradient(ellipse 40% 50% at 0% 50%, rgba(245, 158, 11, 0.10), transparent 60%),
  linear-gradient(180deg, #ffffff 0%, #fffbf5 100%);
--art-cat-pill-bg:     rgba(239, 68, 68, 0.1);
--art-cat-pill-border: rgba(239, 68, 68, 0.25);
--art-cat-pill-text:   #b91c1c;
--art-cat-pill-dot:    #ef4444;
--art-title-hl-grad:   linear-gradient(135deg, #ef4444, #f59e0b);
```

**Règle** : le gradient brand (cyan→ambre) signe la marque. Le gradient article (rouge→ambre) signe le contenu éditorial. Ne pas les mélanger.

## 7. Animations (10 keyframes canoniques)

```css
--animate-fade-in:           fadeIn 0.5s ease-out;
--animate-slide-up:          slideUp 0.6s ease-out;
--animate-pulse-slow:        pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
--animate-float:             float 6s ease-in-out infinite;
--animate-gradient-shimmer:  gradient-shimmer 4s ease-in-out infinite;
--animate-border-beam:       border-beam 4s linear infinite;
--animate-grid-fade:         grid-fade 6s ease-in-out infinite;
--animate-lp-grid-fade:      lp-grid-fade 9s ease-in-out infinite;  /* signature landing */
--animate-beam-flow:         beam-flow 2s ease-in-out infinite;
--animate-shimmer:           shimmer 2s linear infinite;
```

**Bibliothèque animation** : `framer-motion` (déjà dans `optimizePackageImports`). Pas d'autre lib (pas de GSAP, pas de Lottie sauf cas exceptionnel).

**Règle** : animation au scroll = OK (cf. `slideUp`, `fadeIn`). Animation continue boucle = à réserver aux éléments décoratifs (grid hero, glow brand). Pas d'animation sur le texte courant (lecture).

## 8. Composants signature (déjà disponibles, réutiliser, ne pas réinventer)

### 8.1 MDX (dans `components/mdx/`)

| Composant | Usage | Props clés |
|-----------|-------|------------|
| `<Callout type="tip\|warning\|info\|error" title="...">` | Encadrés informatifs | type, title |
| `<CodeBlock code="..." language="bash\|ts\|tsx" />` | Bloc code avec prism-react-renderer, fond toujours sombre (RG2-17) | code, language |
| `<Steps><Step title="..." stepNumber={1}>` | Guides pas à pas numérotés | stepNumber |
| `<Tabs>` | Contenu à onglets | - |
| `<Card title="...">` | Cartes conteneurs | title |
| `<Faq>` | FAQ avec JSON-LD auto | - |
| `<NextSteps>` | Bloc fin d'article "Pour aller plus loin" | - |
| `<ArticleAlert>` | Alerte mise en avant article | - |

### 8.2 Layout (dans `components/layout/`)

| Composant | Usage |
|-----------|-------|
| `<SectionLayout>` | Wrapper standard pages section (sidebar gauche + contenu + TOC droite) |
| `<ArticleHero>` | Hero éditorial gold standard (pill pulsante, titre clamp, lead, badges, dates) |
| `<ArticleShell>` | Shell article 3 colonnes (TOC + contenu + meta) |
| `<ArticleSubNav>` | Sous-navigation article |
| `<ArticlePager>` | Précédent / suivant en bas d'article |
| `<ReadingProgressBar>` | Barre de progression lecture |
| `<TocProgress>` | TOC avec progression |
| `<Header>` / `<Footer>` | Layout global |
| `<LanguageSwitcher>` | Toggle FR/EN |
| `<ThemeToggle>` | Toggle dark/light |

### 8.3 UI (dans `components/ui/`)

| Composant | Usage |
|-----------|-------|
| `<Breadcrumb>` | Fil d'Ariane |
| `<SearchDialog>` | Recherche live Spotlight-style |
| `<TableOfContents>` | TOC auto-générée à partir des headings |
| `<ScrollToTop>` | Bouton retour en haut |
| `<SectionHeading>` | Titre de section formaté |
| `<KeyboardShortcut>` | Raccourci clavier visualisé |
| `<ComparisonTable>` | Tableau comparatif (livré EPIC Best Practices) |
| `<RecentArticleCard>` | Card article landing |
| `<TrustBar>`, `<FeatureCard>`, `<AudienceCard>` | Landing |
| `<PathCard>` | Card "parcours" avec icône colorée + step numéroté |

**Règle d'or** : avant de créer un nouveau composant, vérifier s'il existe déjà. Préférer enrichir un composant existant à dupliquer.

## 9. Iconographie

- **Bibliothèque** : `lucide-react` (tree-shakeable, déjà dans `optimizePackageImports`)
- **Règle** : pas d'emoji dans le code/contenu (sauf demande explicite utilisateur). Remplacer par icône Lucide.
- **Stroke width** : `1.5` ou `2` (cohérence à maintenir par feature)
- **Taille** : `w-4 h-4` (inline texte), `w-5 h-5` (boutons), `w-6 h-6` (cards), `w-8 h-8` (icones décoratives)
- **Favicon** : SVG terminal `>_` sur dégradé brand→accent (`app/icon.svg`)

## 10. Code (CodeBlock toujours sombre, RG2-17)

Décision design : le `<CodeBlock>` garde son fond sombre **même en light mode**. Cohérence éditoriale (lecture confortable, contraste max).

```css
--code-bg:        #0a0e1a;       /* fond principal */
--code-bg-deep:   #04060d;       /* fond sub (header) */
--code-text:      #e2e8f0;       /* texte par défaut */
--code-fg-primary:   #f8fafc;
--code-fg-secondary: #cbd5e1;
--code-fg-muted:     #94a3b8;
--code-border:    rgba(34, 211, 238, 0.15);   /* border cyan léger */

/* Syntax highlighting (prism-react-renderer) */
--code-comment:  #64748b;        /* slate-500 */
--code-keyword:  #c4b5fd;        /* violet-300 */
--code-string:   #fbbf24;        /* accent-400 (ambre) */
--code-variable: #67e8f9;        /* brand-300 (cyan) */
--code-function: #5eead4;        /* teal-300 */
```

## 11. Callouts (4 variants tokenisées)

```css
/* Info (cyan) */
--callout-info-bg:     rgba(6, 182, 212, 0.05);
--callout-info-border: rgba(6, 182, 212, 0.6);
--callout-info-text:   #0e7490;

/* Tip (vert) */
--callout-tip-bg:     rgba(34, 197, 94, 0.05);
--callout-tip-border: rgba(34, 197, 94, 0.6);
--callout-tip-text:   #15803d;

/* Warning (ambre) */
--callout-warning-bg:     rgba(245, 158, 11, 0.05);
--callout-warning-border: rgba(245, 158, 11, 0.6);
--callout-warning-text:   #b45309;

/* Error (rouge) */
--callout-error-bg:     rgba(239, 68, 68, 0.05);
--callout-error-border: rgba(239, 68, 68, 0.6);
--callout-error-text:   #b91c1c;
```

**Règle** : un Callout doit toujours avoir un `title` explicite. Pas de Callout sans titre (sinon c'est juste une div).

## 12. Themes éditoriaux articles (RG-31)

Champ `themes` du frontmatter MDX, validé strict via `lib/themes.ts`.

**Type de contenu** (1 obligatoire) : `tutorial`, `guide`, `reference`, `comparison`, `use-case`
**Domaine** (0-2 optionnels) : `security`, `devsecops`, `architecture`, `performance`, `tooling`, `productivity`, `migration`

Couleurs des badges :

| Domaine | Token couleur |
|---------|---------------|
| `security` | `--color-error` (rouge) |
| `devsecops` | `--theme-devsecops` (`#7c3aed` violet, seul cas d'usage du violet) |
| `architecture` | `--color-info` (cyan) |
| `performance` | `--color-warning` (ambre) |
| `tooling` | `--color-info` (cyan) |
| `productivity` | `--color-success` (vert) |
| `migration` | `--fg-muted` (gris) |
| (type de contenu) | `--fg-secondary` (neutre) |

## 13. Anti-patterns (à proscrire absolument)

| Anti-pattern | Pourquoi |
|--------------|----------|
| `text-violet-*` ou `text-purple-*` partout | Réservé EXCLUSIVEMENT au theme `devsecops`. Sinon ressemble au violet Anthropic = anti-référence #1. |
| `font-family: Inter` | Cliché AI, on a Plus Jakarta Sans. |
| `h-screen` pour hero | Saut iOS Safari, utiliser `min-h-[100dvh]`. |
| `w-[calc(...)]` | Préférer CSS Grid. |
| `style={{...}}` inline | Tout par utility classes Tailwind, sauf variables CSS calculées dynamiquement. |
| Couleurs hex en dur dans les composants | Consommer les tokens sémantiques (`var(--brand-primary)`, etc.). |
| Composant créé en doublon d'un existant | Vérifier `components/` avant de créer. |
| `any` TypeScript | Strict mode obligatoire. |
| Index comme key React | Toujours un id stable ou clé composite. |
| `.replace(/x/g, ...)` | Utiliser `.replaceAll(...)`. |
| `<div role="img">` | Utiliser `<img alt="...">` ou `<svg aria-label="...">`. |

## 14. Accessibilité (zéro-tolérance, alignée WCAG 2.1 AA)

- Tous les éléments interactifs répondent au clavier (Enter / Espace / Tab)
- Focus visible obligatoire (`--shadow-focus` ring cyan 35%)
- Contrastes vérifiés : `--brand-primary` sur blanc = 4.95:1 (AA OK)
- Aria-labels explicites sur les liens externes (`aria-label="GitHub repo X (s'ouvre dans un nouvel onglet)"`)
- Tous les `<img>` ont un `alt` descriptif (jamais "screenshot" seul)
- Pas de `role="img"` sur des `<div>`
- Hiérarchie de headings respectée (pas de h3 orphelin sans h2 parent)

## 15. Performance

| Métrique | Cible | Validé via |
|----------|-------|-----------|
| Lighthouse Performance | ≥ 90 | CI Lighthouse auto |
| Lighthouse Accessibility | ≥ 95 | CI + axe-core E2E |
| Lighthouse Best Practices | ≥ 90 | CI |
| Lighthouse SEO | ≥ 95 | CI + Validate SEO/IA workflow |
| Core Web Vitals (LCP/FID/CLS) | dans les seuils Google | `@vercel/speed-insights` (RUM) |

**Règles techniques** :
- Images en WebP avec lazy loading
- `next-mdx-remote` côté serveur (pas de runtime client lourd)
- Pas de SSR (export statique strict, `output: 'export'`)
- Tree-shaking sur `lucide-react` et `framer-motion` via `experimental.optimizePackageImports`

## 16. Tokens de référence rapide (cheatsheet)

```
PRIMARY        → var(--brand-primary)        #0e7490
ACCENT         → var(--color-accent-500)      #f59e0b
TEXT           → var(--fg-primary)            #0f172a
TEXT MUTED     → var(--fg-muted)              #64748b
BG             → var(--bg-page)               #ffffff
BG SUBTLE      → var(--bg-subtle)             #f8fafc
BORDER         → var(--border-default)        #e2e8f0
SUCCESS        → var(--color-success)         #22c55e
WARNING        → var(--color-warning)         #f59e0b
ERROR          → var(--color-error)           #ef4444
INFO           → var(--color-info)            #06b6d4

SHADOW CARD    → var(--shadow-sm)
SHADOW HOVER   → var(--shadow-md)
SHADOW MODAL   → var(--shadow-xl)
RING FOCUS     → var(--shadow-focus)

GRADIENT BRAND → linear-gradient(135deg, #06b6d4, #0891b2, #f59e0b)

FONT SANS      → Plus Jakarta Sans
FONT MONO      → JetBrains Mono
```

## 17. Comment un skill design doit utiliser ce DESIGN.md

1. **Lire ce fichier en entier au démarrage** (Impeccable le fait via `load-context.mjs` ; Taste Skill le lit en contexte ; UI UX Pro Max via `uipro init` qui scaffolde une config dérivée).
2. **Ne JAMAIS inventer une couleur** : consommer un token sémantique. Si un nouveau token est nécessaire, l'ajouter dans `globals.css` `@layer base :root` avant de l'utiliser.
3. **Ne JAMAIS inventer une typo** : Plus Jakarta Sans + JetBrains Mono, point.
4. **Ne JAMAIS dupliquer un composant** : check `components/{ui,mdx,layout}/` d'abord.
5. **Ne JAMAIS utiliser `text-violet-*` hors theme devsecops** : c'est l'unique exception au territoire violet/purple.
6. **Ne JAMAIS oublier dark mode** : tester sur `:root.dark`, vérifier que les tokens sémantiques s'inversent correctement.
7. **Ne JAMAIS oublier mobile** : breakpoints `sm 640` / `md 768` / `lg 1024` / `xl 1280` à respecter.
