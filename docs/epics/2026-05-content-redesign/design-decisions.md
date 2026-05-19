# Décisions design, Sprint 1 EPIC Content page redesign

> Source : agent ux-designer, 2026-05-19, contexte EPIC `docs/BACKLOG/EPIC-content-page-redesign-2026-05.md`.
> Statut : draft, à valider en kickoff par PO.
> Stories cadrées : CTN-2, CTN-3, CTN-4, CTN-5, CTN-14. CTN-1 (maquettes Figma) consomme ce document comme source canonique.

Ce fichier tranche toutes les décisions visuelles et comportementales pour que les devs implémentent sans Figma. Les wireframes ASCII sont des références d'agencement, pas des contraintes de pixel-perfect. Tous les tokens sont consommés via les variables CSS exposées dans `src/app/globals.css`, jamais en hardcoded.

---

## 1. Système de design (rappel des tokens utilisés)

Tous les éléments visuels réutilisent les tokens existants. Aucun hex / aucun spacing en pixels libres.

### Couleurs sémantiques

| Usage | Token | Note |
|-------|-------|------|
| Fond page | `var(--bg-page)` | blanc, slate-950 en dark |
| Fond surface subtile (alternance sections) | `var(--bg-subtle)` | crème/slate-900 dark |
| Fond carte / surface élevée | `var(--bg-elevated)` / `var(--surface-card)` | |
| Texte principal | `var(--fg-primary)` | |
| Texte secondaire (description carte) | `var(--fg-secondary)` | |
| Texte muté (méta, dates) | `var(--fg-muted)` | |
| Bordure défaut (carte au repos) | `var(--border-default)` | |
| Bordure forte (chip actif, hover) | `var(--border-strong)` | |
| Brand primaire (CTA primaire, lien actif) | `var(--brand-primary)` | brand-700 light, brand-500 dark |
| Brand hover | `var(--brand-hover)` | |
| Accent (delta tendance positif) | `var(--color-success)` | |
| Texte sur fond brand | `var(--fg-on-brand)` | blanc light, slate-900 dark |

### Typographie

Reprend l'échelle `cc-*` (RG-04) déjà en place.

| Rôle | Classe |
|------|--------|
| Titre hero `/content/` | `cc-h1` (clamp 2.25rem -> 3.75rem) |
| Sous-titre hero (lead) | `cc-lead` |
| H2 sections (Pinned + Latest, Trending, Most Read, Tous) | `cc-h2` |
| H3 titre carte | inline `text-lg` (grid/row) ou clamp 1.5-1.875rem (hero variant) |
| Description carte | `text-sm` ou `text-base` selon variant |
| Méta (date relative, durée lecture) | `cc-caption` (font-mono pour la date absolue dans `title`) |
| Eyebrow / badge categorie pinned | `cc-eyebrow` |

### Espacement, radius, ombres

| Token | Usage |
|-------|-------|
| `var(--radius-2xl)` | Cartes article (1.25rem) |
| `var(--radius-full)` | Chips themes, badge tendance |
| `var(--radius-lg)` | CTA hero, conteneurs filtre |
| `var(--shadow-card)` | Carte au repos (xs en light, sm) |
| `var(--shadow-md)` | Carte hover light |
| `var(--shadow-lg)` | Carte hover dark + Pinned au repos |
| `var(--shadow-focus)` | Ring focus-visible |
| `var(--duration-base)` (300ms) | Transitions hover carte, chip |
| `var(--duration-fast)` (150ms) | Micro-interactions (color, fond chip) |
| `var(--ease-out)` | Easing standard |

### Gradients

| Token | Usage |
|-------|-------|
| `var(--gradient-hero)` | Fond hero `/content/` (réutilisé) |
| `var(--gradient-hero-radial-1)` + `var(--gradient-hero-radial-2)` | Halos cyan/ambre du hero |
| `var(--gradient-card)` | Fallback image OG manquante (carte) |
| `linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))` | Liseré supérieur 3px de la variant `grid` (héritage RecentArticlesClient) |

---

## 2. Hero (CTN-4)

### Wireframe ASCII

```
┌─────────────────────────────────────────────────────────────────┐
│  (halo cyan top-left, halo ambre right, grid pattern subtil)    │
│                                                                 │
│   [● 16 GUIDES INDEPENDANTS]   <- eyebrow brand                 │
│                                                                 │
│   Contenus éditoriaux                                           │
│   pour comprendre Claude Code.       <- cc-h1                   │
│                                                                 │
│   Sécurité, architecture, DevSecOps, performance, tooling.      │
│   Tous nos guides longue forme, classés et filtrables.          │
│                                          <- cc-lead             │
│                                                                 │
│   [  Filtrer par thème  ]   [ Voir les derniers ↓ ]             │
│      CTA primaire           CTA secondaire (ghost)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Décisions

- **Hauteur** : padding vertical `py-16` mobile, `py-24` sm, `py-28 lg:py-32` lg. Pas de hauteur fixe : laisse le contenu respirer. Le hero n'occupe jamais plus de 70 % du viewport mobile (mesure cible : ~520 px sur 375x812).
- **Padding horizontal** : `px-4 sm:px-6 lg:px-8`, conteneur `mx-auto max-w-7xl`.
- **Fond** : réutilise le pattern `art-hero` adapté (halos + grid mask radial) MAIS via les tokens `--gradient-hero-radial-1` et `--gradient-hero-radial-2` (cyan/ambre), pas le rouge/ambre éditorial de `ArticleHero`. La page `/content/` reste sur l'identité cyan brand.
- **Eyebrow** : `cc-eyebrow` brand-on-light, format `<dot pulse> 16 GUIDES INDEPENDANTS`. Compteur dynamique au build via `countAllArticles()`. Le mot "INDEPENDANTS" est important : signal GEO.
- **Titre** : `cc-h1`, `text-wrap: balance`, 2 lignes max sur desktop. Pas de gradient text par défaut (réservé au mot-clé si highlight). Optionnel : sur 2 mots, gradient brand-500 -> accent-500 via classe `text-gradient` existante.
- **Sous-titre** : `cc-lead`, max-width `60ch`, expose explicitement les thèmes couverts (signal GEO pour LLM). Format type : "Sécurité, architecture, DevSecOps, performance, tooling. 16 guides longue forme classés et filtrables."
- **CTA primaire "Filtrer par thème"** : 
  - Style : `inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-3 text-base font-semibold text-[color:var(--fg-on-brand)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[color:var(--brand-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-md)]`
  - Comportement : `<a href="#all-articles">` + handler `onClick` qui (1) `scrollIntoView({ behavior: prefers-reduced-motion ? 'auto' : 'smooth' })`, (2) `focus()` sur le premier chip de `<ArticleThemeFilter>` après scroll.
  - Icône lucide `Filter` à gauche (`h-4 w-4`, `aria-hidden`).
- **CTA secondaire "Voir les derniers"** : style ghost (`border border-[color:var(--hero-cta-secondary-border)] bg-transparent text-[color:var(--hero-cta-secondary-text)] hover:border-[color:var(--hero-cta-secondary-hover-border)] hover:bg-[color:var(--hero-cta-secondary-hover-bg)]`), ancre vers `#pinned-latest`. Icône `ArrowDown`.
- **JSON-LD** : `BreadcrumbList` (`Accueil > Contenus éditoriaux`) + `CollectionPage` étendu, injectés via `<script type="application/ld+json">` dans la `<head>` page-level.

### États

| État | Comportement |
|------|--------------|
| CTA primaire hover | `translateY(-1px)` + bg `--brand-hover` + shadow `--shadow-md`. Durée `--duration-fast`. |
| CTA focus-visible | Ring 2px `--brand-700` + offset 2px `--bg-page` (déjà global dans `globals.css`). |
| CTA active | `translateY(0)` + bg `--brand-hover`. |
| `prefers-reduced-motion` | Pas de translate, pas de transition de shadow. Color/bg transitionnent quand même (utile pour distinguer hover). |

---

## 3. ArticleCard (CTN-2)

Composant unique avec 3 variants pilotés par prop `size`. Le markup interne change, l'API est uniforme. Le composant est server-renderable (pas de `useState`, pas d'event listener), sauf l'émission Matomo qui passe par un wrapper `<a data-event="...">` traité par le hook global `useExternalLinkTracking` étendu.

### Variant `grid` (default)

Utilisé dans Latest secondaire, Most Read, Trending mobile, All articles.

#### Wireframe ASCII

```
┌────────────────────────────┐
│ ════════════════════ <- liseré 3px gradient brand->accent (top)
│                            │
│   ┌──────────────────┐     │
│   │                  │     │
│   │   OG image       │     │  <- aspect-ratio 16/9 (ou fallback gradient)
│   │   600x315        │     │
│   │                  │     │
│   └──────────────────┘     │
│                            │
│   [tutorial] [security]    │  <- ThemeBadges, max 2 visibles, +N si plus
│                            │
│   Titre de l'article sur   │  <- h3 line-clamp-2
│   deux lignes max          │
│                            │
│   Description tronquée à   │  <- p line-clamp-2, fg-secondary
│   120 caractères max...    │
│                            │
│   il y a 3 jours • 5 min   │  <- caption fg-muted
│                            │
└────────────────────────────┘
```

#### Décisions

- Conteneur : `<Link>` cliquable couvrant toute la carte. Classe : `group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)]`.
- Liseré top : `<div aria-hidden class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-500 to-accent-500" />` (visible au repos sur variants `grid` et `row`, masqué sur `hero`).
- Ratio image : **16/9 fixé via `aspect-ratio`** (CLS = 0). Padding interne : `p-5 sm:p-6`. Gap interne : flex column `gap-3`.
- Image OG : 600x315, `loading="lazy"`, `decoding="async"`. Dimensions explicites en `width` et `height` HTML.
- ThemeBadges : composant existant en mode `compact={false}`. Limiter à 2 visibles + tag `+N` si > 2 (à ajouter dans `ThemeBadges` si besoin, sinon laisser comme aujourd'hui, 3 max c'est tolérable).
- Titre `h3` : `text-lg font-semibold leading-snug text-[color:var(--fg-primary)] line-clamp-2`, attribut `title={article.title}` pour révélation au hover.
- Description : `mt-2 text-sm leading-relaxed text-[color:var(--fg-secondary)] line-clamp-2`. Tronquée côté serveur à 120 caractères (helper `truncate(desc, 120)`).
- Méta : ligne unique `flex items-center gap-2 text-xs text-[color:var(--fg-muted)] mt-auto pt-4 border-t border-[color:var(--border-subtle)]`. Format : `<time dateTime={iso} title={absolute}>il y a 3 jours</time> · 5 min de lecture`. Le séparateur `·` est un caractère middot, pas un pipe.

### Variant `hero` (Pinned)

#### Wireframe ASCII desktop

```
┌──────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────┐  ┌───────────────────────────┐│
│ │                                │  │ [● A LA UNE]              ││
│ │                                │  │                           ││
│ │   OG image 1200x630            │  │ Titre éditorial massif    ││
│ │   (full visual area)           │  │ sur deux lignes max       ││
│ │                                │  │                           ││
│ │   [section badge top-left]     │  │ Description plus longue,  ││
│ │                                │  │ jusqu'à 3 lignes ici car  ││
│ │                                │  │ on a plus de place...     ││
│ │                                │  │                           ││
│ │                                │  │ [tutorial] [security]     ││
│ │                                │  │                           ││
│ │                                │  │ il y a 2 jours • 8 min    ││
│ │                                │  │                           ││
│ │                                │  │ Lire l'article →          ││
│ └────────────────────────────────┘  └───────────────────────────┘│
│        2/3 width                            1/3 width             │
└──────────────────────────────────────────────────────────────────┘
```

#### Décisions

- Grid : `grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-0` (image et contenu visuellement collés, séparés par une bordure subtile à `lg+`).
- Conteneur : carte unique, même radius `rounded-2xl`, ombre `--shadow-lg` au repos (carte mise en avant), hover `--shadow-xl`.
- Image : **`loading="eager"` + `fetchpriority="high"`** (cf. CTN-3 et CTN-10). Dimensions 1200x630. Sur mobile : pleine largeur, aspect-ratio 16/9 conservé. Sur desktop : prend toute la hauteur de la carte (`h-full object-cover`).
- Badge "A la une" : positionné en haut du panneau contenu (pas sur l'image), style eyebrow brand avec dot pulse (réutilise pattern `art-cat-pill`).
- Titre : `clamp(1.5rem, 2.4vw, 1.875rem)`, `font-bold`, line-height 1.2, line-clamp 2.
- Description : `line-clamp-3` (vs 2 sur grid), max 200 caractères côté serveur (plus de place).
- ThemeBadges : full label (pas compact).
- CTA texte "Lire l'article" + `ArrowRight` qui anime `gap` en hover (`group-hover:gap-2`).

#### Wireframe ASCII mobile

```
┌────────────────────────┐
│ [Image 16/9]           │
├────────────────────────┤
│ [● A LA UNE]           │
│ Titre                  │
│ Description 3 lignes   │
│ [chips themes]         │
│ meta                   │
│ Lire l'article →       │
└────────────────────────┘
```

### Variant `row` (Trending)

Utilisé Sprint 2 (CTN-9) mais cadré ici puisque le composant est livré au Sprint 1.

#### Wireframe ASCII desktop (>= md)

```
┌───────────────────────────────────────────────────────────────┐
│ ┌──────┐  [tutorial] [security]                               │
│ │      │  Titre de l'article sur deux lignes maximum          │
│ │ OG   │  Description sur 2 lignes...                         │
│ │ 1/1  │                                                       │
│ └──────┘  il y a 3 jours · 5 min · 🔥 Tendance · +33% ↗      │
└───────────────────────────────────────────────────────────────┘
```

- Image carrée 160x160 à gauche (aspect-ratio 1/1).
- Badge "Tendance" via icône `Flame` lucide `aria-hidden`, couleur `var(--color-warning)`.
- Delta % : `var(--color-success)` (vert) toujours, jamais rouge (filtré côté serveur).

#### Comportement breakpoint < md

Le variant `row` retombe sur `grid` AVEC en plus un badge tendance en overlay coin haut-droit :

```
┌────────────────────────────┐
│ [🔥 +33%]   <- overlay top-right, fond translucide
│ [Image 16/9]               │
├────────────────────────────┤
│ [chips]                    │
│ Titre                      │
│ Description                │
│ meta                       │
└────────────────────────────┘
```

Implémentation : `<ArticleCard size="row">` rend en interne `<div class="hidden md:flex">{rowMarkup}</div><div class="md:hidden">{gridMarkupWithTrendingOverlay}</div>`. Pas de duplication de logique métier, juste de markup.

### États (tous variants)

| État | Style |
|------|-------|
| Repos | shadow `--shadow-card`, border `--border-default`, liseré top visible |
| Hover | `-translate-y-1` (variant hero) ou `-translate-y-px` (grid/row), shadow `--shadow-md` (grid/row) ou `--shadow-xl` (hero), border `rgba(6, 182, 212, 0.3)` light / `rgba(34, 211, 238, 0.4)` dark. Durée `--duration-base`, easing `--ease-out`. Sur l'icône `ArrowRight` du CTA : `group-hover:gap-2` (gap passe de 1 à 2). |
| Focus-visible | Ring 2px `--brand-700` + offset 2px `--bg-page`. Distinct du hover (pas de translate). |
| Image OG manquante | `<div>` aux mêmes dimensions, `background: var(--gradient-card)` + premier mot du titre centré en `cc-display-2` (font-weight 800, color `var(--fg-on-brand)` si fond brand, sinon `var(--brand-primary)`). Contraste vérifié AA 4.5:1 sur fond clair, AAA sur fond brand. |
| `prefers-reduced-motion` | Pas de `translate`, pas de transition de `shadow`. Border et background transitionnent quand même (info nécessaire). |
| Loading (skeleton) | **Pas de skeleton** : page SSG, données résolues au build. Si un jour CTN-13 introduit une URL state avec re-render perçu, on ajoutera un fallback opacity 0.6 sur la liste filtrée pendant un frame. |

### A11y

- `<Link>` couvre toute la carte (pas de "click bait" sur titre + bouton séparé). `aria-label={`${ctaLabel} : ${title}`}` pour le lecteur d'écran.
- Icônes décoratives (`Flame`, `ArrowRight`, dot pulsant) : `aria-hidden="true"`.
- Badge "Tendance" texte visible (pas d'icône seule sans label). Pour le variant `row` mobile overlay : sr-only "Tendance, +33%".
- Contraste AA garanti sur tous les textes : `fg-primary` sur `bg-elevated`, `fg-secondary` sur `bg-elevated`, `fg-muted` sur `bg-elevated` vérifiés > 4.5:1 (4.5 pour normal, 3:1 pour large).
- Event Matomo `article_card_click` émis via `data-matomo-category="engagement"` + `data-matomo-action="article_card_click"` + `data-matomo-name={slug}`, intercepté par le tracker délégué existant.

---

## 4. Pinned + Latest combinés (CTN-3)

### Layout desktop (>= lg)

```
┌────────────────────────────────────────────────────────────────┐
│  ## À la une & derniers articles                  [Voir tout →]│
│                                                                │
│  ┌──────────────────────────┐ ┌─────────────────────────────┐  │
│  │                          │ │                             │  │
│  │   PINNED                 │ │   Latest 1 (grid variant)   │  │
│  │   (hero variant)         │ │                             │  │
│  │   2/3 width              │ │                             │  │
│  │                          │ ├─────────────────────────────┤  │
│  │                          │ │                             │  │
│  │                          │ │   Latest 2 (grid variant)   │  │
│  │                          │ │                             │  │
│  │                          │ │                             │  │
│  └──────────────────────────┘ └─────────────────────────────┘  │
│                                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │ Latest 3   │ │ Latest 4   │ │ Latest 5   │   <- 2e rangée   │
│  └────────────┘ └────────────┘ └────────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

### Layout mobile (< md)

```
┌──────────────────────┐
│ ## À la une          │
│                      │
│ [PINNED full-width]  │
│                      │
│ ## Derniers articles │
│                      │
│ [Latest 1]           │
│ [Latest 2]           │
│ [Latest 3]           │
│ [Latest 4]           │
│ [Latest 5]           │
│                      │
│ [Voir tout →]        │
└──────────────────────┘
```

### Décisions

- Conteneur section : `<section id="pinned-latest" aria-labelledby="pinned-latest-title" class="bg-[color:var(--bg-page)] py-16 sm:py-20 lg:py-24">`
- Grid principal : `grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8`. Identique au pattern `RecentArticlesClient` (cohérence avec la landing).
- Rangée secondaire Latest 3/4/5 : `mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.
- H2 unique pour le bloc : "À la une et derniers articles" si Pinned présent, sinon "Derniers articles" (H2 unique). Pas de double H2 pour ne pas casser le scroll-spy.
- Lien "Voir tout" : ancré sur `#all-articles` avec smooth scroll + focus auto premier chip (réutilise le handler du CTA hero).
- Pinned présent et valide : 1 carte `hero` + 2 cartes `grid` à droite + 3 cartes `grid` en bas = 6 articles affichés.
- **Pinned absent ou invalide** : layout dégrade sur grid 3 colonnes (6 cartes `grid`), pas de slot vide ni de placeholder. Le H2 devient "Derniers articles" (singulier).
- Moins de 6 articles total : afficher ce qu'il y a, pas de slot vide.

### Cascade d'exclusion (rappel)

L'ordre dans lequel les sets sont calculés au build :

1. Pinned (1 slug si défini et valide)
2. Trending (Sprint 2)
3. Most read (Sprint 2)
4. Latest (top 5 ou 6 - taille pinned)
5. All articles (tout le reste, filtrage chips appliqué côté client)

Tracé dans une fonction `computeContentSections({ articles, pinnedSlug, stats })` qui retourne `{ pinned, latest, trending, mostRead, all }` avec exclusions appliquées.

---

## 5. ArticleThemeFilter (CTN-5)

### Wireframe ASCII

```
┌──────────────────────────────────────────────────────────────┐
│ ## Tous les articles                                         │
│                                                              │
│  Type                                                        │
│  ┌─────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │tutorial │ │guide │ │reference │ │comparison│ │use-case│  │
│  └─────────┘ └──────┘ └──────────┘ └──────────┘ └────────┘  │
│                                                              │
│  Domaine                                                     │
│  ┌──────────┐ ┌─────────┐ ┌────────────┐ ┌──────────┐       │
│  │security  │ │devsecops│ │architecture│ │performance│       │
│  └──────────┘ └─────────┘ └────────────┘ └──────────┘       │
│  ┌────────┐ ┌────────────┐ ┌─────────┐                       │
│  │tooling │ │productivity│ │migration│                       │
│  └────────┘ └────────────┘ └─────────┘                       │
│                                                              │
│  ───────────────────────────────────────────────────────     │
│  9 articles      ou    [Réinitialiser les filtres]           │
│                                                              │
└──────────────────────────────────────────────────────────────┘

État vide :

┌──────────────────────────────────────────────────────────────┐
│  Aucun article ne correspond à ces filtres.                  │
│  [Réinitialiser les filtres]                                 │
└──────────────────────────────────────────────────────────────┘
```

### Décisions

- Conteneur : `role="group" aria-label="Filtrer par thème"`. Deux sous-conteneurs `<fieldset>` cachés visuellement (label "Type" et "Domaine" en `cc-eyebrow` au-dessus, pas un vrai `<legend>` pour garder le contrôle CSS).
- Chip dimensions : `h-9 px-3.5` (35px de haut, padding horizontal 14px), `rounded-full`, `text-sm font-medium`.
- Chip inactif : `border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--fg-secondary)]`.
- Chip inactif hover : `border-[color:var(--border-strong)] text-[color:var(--fg-primary)]`. Pas de bg change (réservé à l'état actif).
- Chip actif : `border-brand-500/30 bg-brand-500/10 text-[color:var(--brand-primary)]`. Icône lucide à gauche (`h-3.5 w-3.5`).
- Chip focus-visible : ring 2px `--brand-700` + offset 2px, distinct du hover.
- Espacement entre chips : `gap-2` (8px). Entre lignes Type/Domaine : `mt-4`. Entre label et chips : `mt-2`.
- Comportement responsive : `flex flex-wrap` (multi-lignes naturel sur tous breakpoints). **Pas de scroll horizontal** : 5 chips Type tiennent toujours sur une ligne >= 360px, 7 chips Domaine tiennent sur 2 lignes max <= 375px.
- Compteur "X articles" : `flex items-baseline gap-2 mt-4`, font `text-sm text-[color:var(--fg-muted)]`. Le nombre est en `font-semibold text-[color:var(--fg-primary)]`.
- Bouton "Réinitialiser" : visible uniquement si au moins un filtre actif. Style ghost (link button) `text-sm text-[color:var(--brand-primary)] hover:underline`. Disposition : à droite du compteur (`justify-between` sur le conteneur méta).
- État vide : icône `SearchX` lucide, copy "Aucun article ne correspond à ces filtres.", CTA `[Réinitialiser les filtres]` en bouton primaire (pas ghost).

### États

| État chip | Visuel |
|-----------|--------|
| Inactif | bordure subtle, fond elevated, texte secondary |
| Inactif hover | bordure strong, texte primary |
| Actif | bordure brand-500/30, fond brand-500/10, texte brand-primary, icône brand |
| Actif hover | bg brand-500/15 (un cran plus marqué) |
| Focus-visible | Ring 2px brand-700 + offset (distinct du hover) |
| Disabled (futur) | opacity 0.5 + cursor not-allowed — non utilisé Sprint 1 |

### A11y

- `aria-pressed={active}` sur chaque chip.
- `aria-live="polite"` sur le compteur "X articles", annonce les mises à jour sans interrompre.
- `role="group"` + `aria-label="Filtrer par thème"` sur le conteneur principal.
- Touche `Esc` réinitialise tous les filtres (handler `onKeyDown` sur le conteneur, `e.key === "Escape" && resetAll()`).
- Navigation `Tab` / `Shift+Tab` standard entre chips (ordre DOM = ordre visuel : Type puis Domaine).
- Scroll position préservée : `e.preventDefault()` puis ancre `#all-articles` re-focusée si déjà visible, sinon laissée intacte. Pas de `scrollIntoView` automatique sur toggle (sauf au montage initial si URL state, cf. CTN-13).
- Contraste : chip actif sur fond page = `--brand-primary` (brand-700 light, brand-300 dark) sur bg `brand-500/10` => 4.6:1 min vérifié.

---

## 6. ContentSectionsNav (CTN-14)

### Variant xl (>= 1280px)

TOC latérale flottante, alignée à droite, indépendante du shell de page.

```
┌────────────────────────────────────────────────┐ ┌───────────┐
│                                                │ │ Sur cette │
│  Hero                                          │ │ page      │
│                                                │ │           │
│  ## À la une & derniers                        │ │ ● À la une│
│  [pinned + latest]                             │ │ ○ Tendances│
│                                                │ │ ○ Plus lus│
│  ## Tendances cette semaine                    │ │ ○ Tous    │
│  [trending row variant]                        │ │           │
│                                                │ └───────────┘
│  ## Les plus lus 30 jours                      │     sticky
│  [most read grid]                              │     top: 96
│                                                │
│  ## Tous les articles                          │
│  [filters + all cards]                         │
│                                                │
└────────────────────────────────────────────────┘
```

- Position : `position: sticky; top: 96px;` (sous le header sticky de 64px + marge 32). Largeur `w-48` (192px). À droite avec `lg:grid lg:grid-cols-[1fr_192px] gap-12` sur le conteneur de page principal (uniquement >= xl).
- Style item : `flex items-center gap-3 py-2 text-sm`, état inactif `text-[color:var(--fg-muted)]`, état actif `text-[color:var(--fg-primary)] font-semibold` + indicateur dot rempli `bg-[color:var(--brand-primary)]` à gauche.
- Item hover : `text-[color:var(--fg-primary)]` (sans dot rempli si pas actif, juste un dot vide à bordure brand).
- Item focus-visible : ring 2px brand-700 + offset 2px.

### Variant < xl (mobile + tablette + lg < 1280)

Tab bar horizontale sticky en haut de page, sous le hero.

```
┌──────────────────────────────────────────────────────────────┐
│ Hero                                                         │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐ <- sticky top: 64 (header height)
│ [À la une] [Tendances] [Plus lus] [Tous]                     │
└──────────────────────────────────────────────────────────────┘
```

- Sticky : `position: sticky; top: 64px; z-index: 30` (sous le header z-50, au-dessus du contenu).
- Hauteur : `h-12` (48px). Padding horizontal `px-4 sm:px-6 lg:px-8`. Fond `bg-[color:var(--bg-page)]/95` + `backdrop-blur-sm` + `border-b border-[color:var(--border-default)]`.
- Items : `inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium`. Actif `bg-brand-500/10 text-[color:var(--brand-primary)]`. Inactif `text-[color:var(--fg-secondary)] hover:text-[color:var(--fg-primary)]`. Gap entre items `gap-1`.
- Scroll horizontal autorisé si l'écran est trop petit pour 4 items (cas iPhone SE 320px) : `overflow-x-auto` + `scrollbar-hide`. Snap optionnel.

### IntersectionObserver (scroll-spy)

- Une seule instance partagée pour les 4 sections.
- `rootMargin: "-72px 0px -60% 0px"` (active la section dès qu'elle dépasse le tab bar de 72px, désactive quand elle a quitté 60 % du viewport par le bas).
- `threshold: 0` (entrée/sortie binaire).
- Au mount, l'item actif est calculé une fois sur le `IntersectionObserver` natif, pas de fallback manuel.

### A11y

- `aria-current="location"` sur l'item actif (pas `page`, on n'est pas sur une autre page).
- Smooth scroll au clic + `focus()` sur le H2 de la section après scroll (avec `tabIndex={-1}` sur les H2 pour permettre le focus programmatique). Si `prefers-reduced-motion` : `behavior: 'auto'`.
- Navigation clavier : tab parcourt les 4 items dans l'ordre DOM. Enter / Space activent.
- `aria-label="Navigation des sections"` sur le `<nav>` parent.

---

## 7. Rythme vertical entre sections

Alternance `--bg-page` / `--bg-subtle` désactivée pour cette page : trop fragmenté. À la place, **fond uniforme `--bg-page`** + démarcation par padding vertical généreux et titres H2 avec eyebrow.

| Élément | Padding vertical |
|---------|------------------|
| Hero | `py-16 sm:py-24 lg:py-28` |
| Nav sticky (mobile) | `py-2` (compact) |
| Pinned + Latest | `py-16 sm:py-20 lg:py-24` |
| Trending (Sprint 2) | `py-16 sm:py-20 lg:py-24` |
| Most Read (Sprint 2) | `py-16 sm:py-20 lg:py-24` |
| All articles (filtres + grid) | `py-16 sm:py-20 lg:py-24` |
| Espace entre H2 et grid | `mb-8 sm:mb-10` |

Conteneur central de toutes les sections : `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.

---

## 8. Animations et transitions

- **Durée standard** : `--duration-base` (300ms) pour hover carte. `--duration-fast` (150ms) pour micro-changements (color, bg sur chips et CTAs).
- **Easing** : `--ease-out` standard. `--ease-spring` uniquement sur les apparitions (au scroll initial), pas sur hover.
- **Animations au scroll** : on réutilise `<AnimateOnScroll>` (existant) sur les conteneurs de section. Apparition `slide-up` + `fade-in` une seule fois, threshold 0.1. Pas d'animation sur les cartes individuelles : trop bruyant à 16 articles.
- **`prefers-reduced-motion`** : géré globalement dans `globals.css` (durée 0.01ms forcée). Tout composant nouveau doit utiliser uniquement les classes Tailwind standard ou les tokens `--duration-*` pour bénéficier de ce reset.
- **Pas de framer-motion** sur cette page : CSS suffit pour tout, on garde le bundle léger. `<AnimateOnScroll>` étant déjà framer-motion, on l'utilise au minimum (1 wrapper par section).

---

## 9. Dark mode

Toutes les décisions ci-dessus passent automatiquement en dark via les tokens. Spécificités :

- Hero : `--gradient-hero` reprend les couleurs sombres (`#083344 -> #0f172a -> #1e1b4b`), halos cyan/ambre adoucis.
- Cartes : `--bg-elevated` passe en `rgba(15, 23, 42, 0.9)`, border `rgba(51, 65, 85, 0.5)`. Hover : border `rgba(34, 211, 238, 0.4)` + glow cyan via shadow `--shadow-lg` étendue (déjà câblé dans `.cc-card[data-interactive=true]`).
- Chips actifs : `--brand-primary` passe à `#06b6d4` (brand-500), texte sur fond `brand-500/10` reste lisible (4.5:1+ vérifié).
- Image OG fallback : gradient `--gradient-card` (cyan/ambre opacité 0.1/0.05) sur `--bg-elevated`. Premier mot du titre en `text-[color:var(--brand-on-dark)]` (brand-300, contraste 7.2:1 sur slate-900).
- Pinned image : pas d'overlay sombre additionnel (l'OG est conçue avec ses propres contrastes). En dark, on ajoute un voile très subtil `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4))` pour lisibilité du badge "À la une" en bas si on en met un sur l'image (au choix CTN-10).
- Nav sticky tab bar mobile : `bg-[color:var(--bg-page)]/95 backdrop-blur-sm` reste lisible en dark (slate-950).
- TOC xl : dot actif `bg-[color:var(--brand-primary)]` qui passe à brand-500 (#06b6d4) cyan visible sur fond slate-950.

Aucun composant ne hardcode une couleur : tous passent par les tokens, donc switch automatique via `.dark`.

---

## 10. Récap tokens à ajouter

Aucun nouveau token requis pour le Sprint 1. La palette, les radius, les shadows, les durées et les easings existent déjà tous.

Ajouts éventuels Sprint 2 (à anticiper, pas à livrer maintenant) :

- `--trending-flame-bg` / `--trending-flame-text` si on veut pousser le badge tendance vers une couleur dédiée plus saturée que `--color-warning`. Pour l'instant, on réutilise tel quel.
- Un alias `--card-pinned-shadow` si l'on veut découpler la shadow pinned de la shadow card standard. Pour Sprint 1, `--shadow-lg` suffit.

---

## 11. Décisions ouvertes à trancher en kick-off

Toutes les décisions visuelles sont prises ici. Les rares points qui restent dans la zone PO :

1. **Slug Pinned initial** : quel article met-on à la une au merge du Sprint 1 ? Décision PO, à mettre dans `src/data/pinned-article.ts` avec commentaire `// review monthly`. Suggestion : l'article le plus récent avec `themes: ["tutorial"]` ou `themes: ["use-case"]` pour servir d'exemple visuel riche (image OG attendue).
2. **Wording exact du sous-titre hero** : la liste des thèmes doit être lue par un LLM (signal GEO). Validation PO sur la formulation "Sécurité, architecture, DevSecOps, performance, tooling. 16 guides longue forme classés et filtrables." (FR) et son équivalent EN.
3. **Compteur "X articles" : doit-il être affiché aussi quand aucun filtre n'est actif ?** Recommandation UX : oui, toujours afficher (reste un signal de volume). À valider.
4. **Variant `row` Trending — l'icône `Flame` est-elle confondue avec le rouge sécurité ?** À tester en revue visuelle. Mitigation : `Flame` reste `--color-warning` (ambre), le badge `security` reste `--color-error` (rouge). Les deux ne se croisent jamais sur la même carte (un article tendance n'a pas toujours `security` et inversement). Si confusion, switcher `Flame` vers `TrendingUp` icône (plus neutre).
5. **Inclure l'image OG dans la maquette CTN-1 ou laisser le fallback ?** Recommandation : montrer les deux états (avec OG + fallback dégradé) dans les variants Figma pour valider visuellement le fallback avant code.

---

## Annexe — Mapping des classes Tailwind par composant

Pour copy-paste rapide côté dev. Toutes les classes consomment des tokens, jamais d'hex.

### `<ArticleCard size="grid">`

```
group relative flex h-full flex-col overflow-hidden rounded-2xl
border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)]
shadow-[var(--shadow-card)] transition-all duration-[var(--duration-base)]
ease-[var(--ease-out)]
hover:-translate-y-px hover:border-brand-500/30 hover:shadow-[var(--shadow-md)]
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]
motion-reduce:hover:translate-y-0
```

### `<ArticleCard size="hero">`

```
group relative grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-0 overflow-hidden rounded-2xl
border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)]
shadow-[var(--shadow-lg)] transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]
hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2
motion-reduce:hover:translate-y-0
```

### Chip inactif `<ArticleThemeFilter>`

```
inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium
border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--fg-secondary)]
transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
hover:border-[color:var(--border-strong)] hover:text-[color:var(--fg-primary)]
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]
```

### Chip actif `<ArticleThemeFilter>`

```
inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium
border-brand-500/30 bg-brand-500/10 text-[color:var(--brand-primary)]
transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
hover:bg-brand-500/15
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]
```

### CTA primaire hero "Filtrer par thème"

```
inline-flex items-center gap-2 rounded-lg px-5 py-3 text-base font-semibold
bg-[color:var(--brand-primary)] text-[color:var(--fg-on-brand)] shadow-[var(--shadow-sm)]
transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
hover:bg-[color:var(--brand-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-md)]
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]
motion-reduce:hover:translate-y-0
```

### Nav sticky tab bar mobile, item actif

```
inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium
bg-brand-500/10 text-[color:var(--brand-primary)]
```

### Nav sticky TOC xl, item actif

```
flex items-center gap-3 py-2 text-sm font-semibold text-[color:var(--fg-primary)]
before:block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[color:var(--brand-primary)]
```

---

Fin du document. Pour toute question pendant l'implémentation : ouvrir un commentaire dans la PR de la story concernée, l'agent ux-designer reverra ce document au besoin.
