# EPIC : Peaufinage UI/UX — Page `/content/` + harmonisation des entêtes de section

> Source : retours utilisateur 2026-05-11 sur `/fr/content/` (section "Guides disponibles") + entêtes des pages section
> Date : 2026-05-11
> Effort estimé : 26 story points (12 stories sur 3 sprints)
> Pré-requis : aucun (orthogonal aux EPICs SEO-GEO, Best Practices et Ecosystem)
> Owner : Maxime BELLET

---

## Contexte

### État actuel (audit visuel et code, 2026-05-11)

#### Page `/content/` (`src/app/[locale]/content/page.tsx`)

- **Hero** : simple et propre (`bg-slate-950` + badge `BookOpen` + titre split `Tous nos articles` avec un mot en `text-gradient` + sous-titre de 1 phrase). Pas d'atmosphère travaillée (1 seul `radial-gradient`), pas de pill pulsante.
- **Bloc Introduction** : 2 paragraphes longs, statique, sans hiérarchie visuelle.
- **Section "Guides disponibles"** : utilise `<SectionHeading>` puis une **liste verticale full-width** de `<Link>` (titre + description + flèche). Aucune iconographie, aucun badge thématique, aucune date `dateModified`, pas de grille, pas d'animation au scroll, peu différenciant des contenus.

#### Pages section landing (`getting-started`, `mcp`, `skills`, `prompting`, `use-cases`, `enterprise`)

Pattern partagé mais avec **duplication massive de code** (chaque page recopie le hero + les cartes sub-pages) :

- **Hero** : `bg-slate-950` ou `bg-slate-50` + radial gradients + titre 4xl→6xl/7xl + sous-titre + badge.
- **Inconsistance** : sur `/mcp/`, le titre est éclaté en 4 strings (`heroTitle1` à `heroTitle4`) avec un `<br/>` au milieu pour split la ligne — fragile et difficile à traduire.
- **Pas de pill pulsante**, **pas de meta** (dates), **pas de theme badges** — alors que les pages article `/content/[slug]/` ont un hero éditorial très polished via `<ArticleHero>` (pill catégorie animée, titre clamp 36-60px / 800 / -0.03em, lead 21px, meta dates).
- **Cards sub-pages** : grille `<Link>` avec icône colorée + step numéroté (01, 02…) + titre + description + CTA flèche. Sur `/mcp/`, `/getting-started/` : exactement le même JSX dupliqué, juste les données changent.

#### Page article `/content/[slug]/` (référence visuelle)

Utilise `<ArticleHero>` (`components/layout/ArticleHero.tsx`) qui est le **gold standard éditorial** du site :

- **Pill catégorie pulsante** : `art-cat-pill` avec dot animé (`art-cat-pill-dot`)
- **Titre éditorial** : `clamp(36px, …, 60px)`, font-weight 800, letter-spacing -0.03em, support `titleHighlight` en gradient avec saut de ligne propre
- **Lead** : 21px, couleur secondaire, max-width 60ch
- **Theme badges** : 1 à 3 badges thématiques (type + domaine)
- **Meta dates** : `Publié le X` + `Mis à jour le Y` avec icônes `Calendar` et `RefreshCw`
- **Atmosphère CSS** : `::before` halos rouges/ambres + linear soft, `::after` grid pattern subtil avec mask radial (toutes les variables exposées via `--art-hero-bg-*` dans `globals.css`)

### Constat principal

> Les pages article ont une vraie identité éditoriale ; les pages landing de section sont fonctionnelles mais visuellement génériques et codées en doublons. La page `/content/` (index) est entre les deux et sous-exploitée.

### Lien avec les autres EPICs

- **EPIC RG (refonte graphique 2026-04)** : a livré `<ArticleHero>`, `<ArticleShell>`, `<ArticleSubNav>`, `<ArticlePager>`, `<ReadingProgressBar>`, le système de design tokens, et les classes `.art-*` dans `globals.css`. Cet EPIC s'appuie dessus.
- **EPIC SEO-GEO mai 2026** : améliore les titles + meta + JSON-LD ; pas de conflit, les composants extraits restent rétrocompatibles.
- **EPIC Ecosystem trending repos** : les nouvelles pages `/ecosystem/*` consommeront directement `<SectionHero>` + `<SectionCardGrid>` livrés par cet EPIC.

---

## Vision

Élever toutes les pages landing au même niveau de soin éditorial que les pages article, sans toucher au contenu (texte, boutons, structure des données déjà bien). Le travail est **purement composant + style** :

1. **Page `/content/`** : transformer la liste plate "Guides disponibles" en grille polished avec iconographie thématique, badges, dates et animations cohérentes avec le reste du site.
2. **Pages section landing** : remplacer le hero ad-hoc dupliqué par un composant `<SectionHero>` réutilisable, calqué sur l'identité de `<ArticleHero>` (pill pulsante, titre clamp, lead 21px, atmosphère CSS).
3. **Cards sub-pages** : extraire le pattern récurrent en `<SectionCardGrid>` réutilisable pour éliminer 6+ copies de JSX.

Aucune nouvelle page, aucun nouveau contenu, aucune nouvelle fonctionnalité. **Pure cohérence visuelle et refacto.**

---

## Priorisation MoSCoW

### MUST HAVE (10 SP, Sprint 1) — Composants partagés + page `/content/`

| ID | Story | SP | Livrable |
|----|-------|----|----------|
| POL-1 | Composant `<SectionHero>` : pill pulsante, titre + `titleHighlight` (gradient), lead, atmosphère CSS calquée sur `<ArticleHero>`, optionnel `meta` (count + dateModified), couleurs slate-50/slate-950 dark | 4 | `components/layout/SectionHero.tsx` + classes `.sec-hero-*` dans `globals.css` |
| POL-2 | Composant `<SectionCardGrid>` : grille responsive 1/2/3 colonnes, accepte un tableau de cards (icon, step, title, description, href, color: brand\|accent), CTA "Lire le guide" customisable, animation `AnimateOnScroll fade-up` intégrée | 3 | `components/layout/SectionCardGrid.tsx` + tests Vitest |
| POL-3 | Refonte `/content/` : remplacer le hero par `<SectionHero>`, remplacer la liste "Guides disponibles" par `<SectionCardGrid>` avec iconographie thématique (icône Lucide par sujet : Shield pour sécurité, DollarSign pour coûts, etc.), afficher `dateModified` et `themes` du frontmatter | 3 | `src/app/[locale]/content/page.tsx` + assignation icônes dans `lib/content-icons.ts` |

### SHOULD HAVE (12 SP, Sprint 2) — Migration des 6 pages section landing

Chaque story remplace le hero ad-hoc par `<SectionHero>` et les cards par `<SectionCardGrid>`, **sans toucher au reste de la page** (intro, callouts, tutoriels, sections bonnes pratiques, next steps).

| ID | Story | SP | Page cible |
|----|-------|----|------------|
| POL-4 | Refonte hero + sub-pages cards de `/getting-started/` | 2 | `src/app/[locale]/getting-started/page.tsx` |
| POL-5 | Refonte hero + sub-pages cards de `/mcp/` (nettoyage du titre split en 4 strings → 1 titre + 1 `titleHighlight`) | 3 | `src/app/[locale]/mcp/page.tsx` |
| POL-6 | Refonte hero + sub-pages cards de `/skills/` | 2 | `src/app/[locale]/skills/page.tsx` |
| POL-7 | Refonte hero + sub-pages cards de `/prompting/` | 2 | `src/app/[locale]/prompting/page.tsx` |
| POL-8 | Refonte hero + sub-pages cards de `/use-cases/` | 1 | `src/app/[locale]/use-cases/page.tsx` |
| POL-9 | Refonte hero + sub-pages cards de `/enterprise/` | 2 | `src/app/[locale]/enterprise/page.tsx` |

### COULD HAVE (4 SP, Sprint 3) — Cohérence sur les autres landings

| ID | Story | SP | Pages cibles |
|----|-------|----|--------------|
| POL-10 | Étendre la migration aux 4 autres landings de section (`/agents/`, `/plugins/`, `/advanced/`, `/personas/`) | 3 | 4 fichiers `page.tsx` |
| POL-11 | Visual regression Playwright RG-25 : ajouter snapshots pour les 6+4 pages migrées | 1 | `e2e/visual-regression.spec.ts` |

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Refonte des pages racine `/limits/`, `/reference/`, `/future/`, `/configurator/` | Périmètre à valider séparément (`configurator` a un layout custom, `future` a déjà sa visualisation) |
| W2 | Refonte de la landing page `/` (homepage) | Hors scope, landing déjà refondue par RG (refonte graphique 2026-04) |
| W3 | Modification du contenu textuel (titres, descriptions, intros) | Le user a explicitement dit "le contenu et les boutons sont très bien" |
| W4 | Refonte des cards sub-pages sur les pages MDX `[slug]` | Elles utilisent déjà `SectionLayout` + `ArticleHero` (gold standard) |
| W5 | Migration des éventuelles autres pages utilisant `<SectionHeading>` (interne aux pages) | Composant à conserver pour les sections internes, périmètre différent |

---

## Spécifications composants

### `<SectionHero>` (POL-1)

#### Props

```typescript
interface SectionHeroProps {
  /** Pill catégorie en haut (badge texte court avec dot pulsant). */
  readonly category: string;
  /** Icône Lucide à afficher dans la pill (optionnel — défaut Sparkles). */
  readonly categoryIcon?: LucideIcon;
  /** Titre principal (sans le morceau highlight). */
  readonly title: string;
  /** Suffixe du titre rendu en gradient (sur une nouvelle ligne ou inline selon `highlightInline`). */
  readonly titleHighlight?: string;
  /** Si true, le highlight reste sur la même ligne ; sinon saut de ligne (défaut false). */
  readonly highlightInline?: boolean;
  /** Sous-titre long (lead, 21px secondaire). */
  readonly lead: string;
  /** Variante de fond : "dark" (slate-950, défaut sur pages section actuelles) ou "soft" (slate-50). */
  readonly tone?: "dark" | "soft";
  /** Compteur optionnel à afficher en meta sous le lead (ex: "6 guides"). */
  readonly count?: string;
}
```

#### Style attendu (classes CSS)

Nouvelles classes dans `globals.css` (préfixe `sec-hero-*`, sœur de `art-hero-*`) :

- `.sec-hero` : conteneur, `position: relative`, `overflow: hidden`, padding clamp
- `.sec-hero[data-tone="dark"]` : `background: var(--gradient-hero)` + `bg-slate-950`
- `.sec-hero[data-tone="soft"]` : `bg-slate-50 dark:bg-slate-950`
- `.sec-hero::before` : halos radial-gradient brand + accent (réutilise variables `--sec-hero-halo-*`)
- `.sec-hero::after` : grid pattern subtil avec mask radial (idem `art-hero::after`)
- `.sec-hero-inner` : `max-width: 4xl`, `text-align: center`, `padding: clamp(...)`
- `.sec-cat-pill` : copie de `art-cat-pill` (border + bg-brand-500/10 + text-brand-300 + dot pulsant)
- `.sec-title` : `clamp(2.5rem, 6vw, 4.5rem)`, `font-weight: 800`, `letter-spacing: -0.03em`, `line-height: 1.05`
- `.sec-title-hl` : gradient `--gradient-text-primary` (déjà existant)
- `.sec-lead` : `font-size: 1.25rem`, `max-width: 42rem`, `color: var(--fg-secondary)`
- `.sec-count` : pill secondaire sous le lead, `text-xs uppercase tracking-wider`

#### Accessibilité

- Pill avec dot animé : `aria-hidden="true"` sur le dot, pill cliquable seulement si ajoutée comme prop `href` (pas en MUST)
- Hiérarchie : `<header>` > `<h1>`
- Contraste WCAG AA garanti sur tone "dark" comme "soft"

### `<SectionCardGrid>` (POL-2)

#### Props

```typescript
interface SectionCardItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly step?: string;          // ex: "01", "02"
  readonly title: string;
  readonly description: string;
  readonly color: "brand" | "accent" | "emerald";
  readonly badge?: string;          // ex: "NEW" — affiché en haut à droite
}

interface SectionCardGridProps {
  readonly items: ReadonlyArray<SectionCardItem>;
  readonly columns?: 2 | 3;        // défaut 3 pour ≥ 4 cards, 2 sinon
  readonly cta: string;             // texte du CTA ("Lire le guide" / "Read the guide")
  /** Si true, anime chaque card en fade-up (défaut true). */
  readonly animate?: boolean;
}
```

#### Comportement

- Grille responsive : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`
- Chaque card : `<Link>` (next-intl, locale auto), `group`, hover state (translate-y, shadow, border color)
- Step en haut à droite si fourni, sinon laissé vide
- Badge `NEW` en pill brand si fourni
- Icône dans rounded-xl bg-color/10, h-12 w-12
- Animation via `<AnimateOnScroll preset="fade-up">` si `animate=true`

### Refacto `/content/` (POL-3)

#### Iconographie thématique

Mapping slug → icône (extensible via `lib/content-icons.ts`) :

| Slug pattern | Icône Lucide | Couleur |
|--------------|--------------|---------|
| `leaked-api-key-*`, `fuite-cle-*`, `ne-pas-donner-*`, `securite-*` | Shield | brand |
| `couts-reels-*`, `real-costs-*` | DollarSign | accent |
| `mythes-*`, `myths-*` | AlertCircle | accent |
| `claude-design-vs-figma` | Palette | brand |
| `ci-cd-cyber-*` | GitBranch | emerald |
| `future-vision`, `trends-*` | Sparkles | brand |
| `getting-started-intro`, `mcp-guide`, `prompting-guide`, `skills-guide` | BookOpen | brand |
| défaut | FileText | accent |

#### Composition

```tsx
<SectionHero
  category={t.heroBadge}
  categoryIcon={BookOpen}
  title={t.heroTitle}
  titleHighlight={t.heroTitleHighlight}
  lead={t.heroSubtitle}
  tone="dark"
  count={`${allFiles.length} ${locale === "fr" ? "articles" : "articles"}`}
/>

{/* Bloc intro 2 paragraphes conservé tel quel */}

<section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
  <SectionHeading badge={t.sectionBadge} title={t.sectionTitle} description={t.sectionDescription} />
  <SectionCardGrid
    items={allFiles.map((f) => ({
      href: `/content/${f.slug}`,
      icon: resolveContentIcon(f.slug),
      title: f.frontmatter.title,
      description: f.frontmatter.description,
      color: resolveContentColor(f.slug),
      badge: f.frontmatter.badge,
    }))}
    columns={3}
    cta={t.readArticle}
  />
</section>
```

---

## Cross-cutting

### Internationalisation

- **Pas de nouveau texte UI à traduire** : les composants reçoivent toutes leurs strings via props depuis les pages, qui ont déjà leurs translations dans le fichier.
- Vérifier que les pages FR ET EN passent après chaque story.

### Accessibilité (WCAG 2.1 AA)

- Pill pulsante : animation respecte `prefers-reduced-motion` (déjà géré sur `art-cat-pill-dot`, à copier)
- Cards : focus visible, `aria-label` sur chaque `<Link>` si titre + description ne suffit pas
- Contraste : tester en light et dark sur les 8 pages refondues
- Tests `axe-core` automatiques sur les routes migrées (CI)

### Tests

| Type | Story couverte | Cible |
|------|----------------|-------|
| **Vitest** unit | POL-1, POL-2 | Couverture ≥ 80 % sur `SectionHero.tsx` et `SectionCardGrid.tsx`. Tests : rendu props, variantes tone, animation off, gestion `count` absent, gestion `titleHighlight` absent. |
| **Vitest** snapshot | POL-3 → POL-9 | Snapshot DOM minimal pour vérifier qu'on n'a rien cassé sur les pages migrées |
| **Playwright** E2E | POL-3 → POL-9 | Smoke test : route répond 200, h1 présent, badge présent, au moins 1 card cliquable |
| **Playwright visual** | POL-11 | Snapshots /content/, /mcp/, /getting-started/, /skills/, /prompting/, /use-cases/, /enterprise/ en FR + EN, light + dark (seuil RG-25 = 2 %) |
| **Lighthouse** | POL-3 → POL-9 | Score ≥ 90 sur les 4 métriques pour chaque page migrée |

### SonarQube — Quality Gate

À vérifier avant merge sur develop (cf. memory `feedback_sonar_before_merge.md`) :

- 0 bug (Reliability)
- 0 code smell BLOCKER ou CRITICAL
- Pas d'introduction de complexité cognitive > seuil S3776
- Couverture de lignes ≥ 80 % maintenue
- Pas de nouveau `any` ou `as` non typé

### Performance

- Pas de nouveau JS lourd : pure refacto de composants existants
- `AnimateOnScroll` déjà utilisé, pas de nouvelle dépendance
- Surveiller le bundle size après extraction (ne doit pas augmenter de +5 % puisque c'est plutôt une factorisation)

### SEO

- Aucun changement de structure HTML majeur : un `<h1>` par page, breadcrumb conservé, JSON-LD conservé
- Surveiller les `metadata.lastModified` dans `SITE_PAGES` : à bumper après chaque migration (cf. règle CLAUDE.md "Mise à jour des dates sitemap")
- Pas de risque de cannibalisation, pas de canonical à changer

---

## Stratégie d'exécution

### Branche

`feat/polish-section-heroes` (par convention `feat/` du repo, cf. workflow CLAUDE.md)

### Ordre d'exécution (recommandation)

1. **Sprint 1** : POL-1 → POL-2 → POL-3 (composants d'abord, puis première page consommatrice). Permet de valider l'API des composants avant la diffusion.
2. **Sprint 2** : POL-4 → POL-9 en parallèle ou en série, chaque story en commit isolé. Possibilité de PR groupée si SonarQube OK sur l'ensemble.
3. **Sprint 3** : POL-10 (autres landings) + POL-11 (visual regression). À considérer comme "cleanup" optionnel.

### Convention de commit (cf. workflow CLAUDE.md)

```
feat(ui): POL-1 component SectionHero
feat(ui): POL-2 component SectionCardGrid
refactor(content): POL-3 migrer /content vers SectionHero + SectionCardGrid
refactor(mcp): POL-5 migrer /mcp vers SectionHero + nettoyage titre split
[...]
```

### Validation manuelle après chaque story

1. `npm run lint && npm run type-check && npm run test`
2. `npm run dev` puis vérifier la route migrée en `/fr/` ET `/en/`, light ET dark mode
3. Vérifier la responsive mobile (375px), tablette (768px), desktop (1280px)
4. `npm run build` pour confirmer le SSG

### Sonar + merge

Avant merge `feat/polish-section-heroes` → `develop` :

1. `npm run test:coverage`
2. `SONAR_HOST_URL=... SONAR_TOKEN=... npm run sonar:local`
3. Quality Gate OK → merge
4. Push develop, attendre CI vert, puis merge develop → main

---

## Critères d'acceptation par story

### POL-1 — `<SectionHero>` (4 SP)

- [ ] Fichier `components/layout/SectionHero.tsx` créé
- [ ] Props strictement typées avec `Readonly<>`
- [ ] Classes `.sec-hero-*`, `.sec-cat-pill`, `.sec-title`, `.sec-title-hl`, `.sec-lead`, `.sec-count` ajoutées dans `globals.css`
- [ ] Variantes `tone="dark"` et `tone="soft"` rendues correctement
- [ ] `categoryIcon` optionnel, `Sparkles` par défaut
- [ ] `titleHighlight` optionnel, gestion du saut de ligne / inline
- [ ] Animation pill respecte `prefers-reduced-motion`
- [ ] Tests Vitest : ≥ 6 cas (props minimales, avec count, avec titleHighlight inline/break, tone dark/soft, sans icon)
- [ ] Couverture composant ≥ 80 %
- [ ] Storybook : non requis (pas de Storybook dans le projet à ce jour)

### POL-2 — `<SectionCardGrid>` (3 SP)

- [ ] Fichier `components/layout/SectionCardGrid.tsx` créé
- [ ] Props strictement typées
- [ ] Mapping couleur `brand`/`accent`/`emerald` via objet `colorStyles` extractible
- [ ] Animation `AnimateOnScroll` activable / désactivable via prop
- [ ] Responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N`
- [ ] Tests Vitest : ≥ 5 cas (rendu list, columns 2/3, badge présent/absent, step présent/absent, animation off)
- [ ] Couverture ≥ 80 %

### POL-3 — `/content/` (3 SP)

- [ ] `src/app/[locale]/content/page.tsx` consomme `<SectionHero>` + `<SectionCardGrid>`
- [ ] Fichier `lib/content-icons.ts` créé avec fonction `resolveContentIcon(slug)` + `resolveContentColor(slug)`
- [ ] Toutes les icônes Lucide importées (Shield, DollarSign, AlertCircle, Palette, GitBranch, Sparkles, BookOpen, FileText)
- [ ] `dateModified` du frontmatter visible sur chaque card si présent
- [ ] `themes` du frontmatter affichés sous le titre de chaque card si présents (réutiliser `<ThemeBadges>`)
- [ ] Smoke E2E Playwright : page `/fr/content/` répond 200, au moins 5 cards cliquables
- [ ] Lighthouse ≥ 90 sur 4 métriques (FR + EN)
- [ ] `SITE_PAGES.lastModified` bumpé pour `/content`

### POL-4 → POL-9 — Migration 6 pages section (varies SP)

Pour chacune :

- [ ] Hero ad-hoc remplacé par `<SectionHero>` avec tone approprié (dark pour pages actuellement dark, soft pour les autres)
- [ ] Grille sub-pages cards remplacée par `<SectionCardGrid>`
- [ ] **Aucune modification du contenu textuel** (titres, descriptions, intros)
- [ ] **Aucune modification des sections sous le hero** (concept, install, tutorial, best practices, next steps — conservées telles quelles)
- [ ] Smoke E2E Playwright validé en FR + EN
- [ ] Lighthouse ≥ 90 (FR + EN, light + dark)
- [ ] `SITE_PAGES.lastModified` bumpé pour la page

#### Spécifique POL-5 (`/mcp/`)

- [ ] Le titre actuellement split en 4 strings (`heroTitle1`-`heroTitle4`) est simplifié en 2 props : `title` + `titleHighlight`
- [ ] Le `<br/>` artificiel disparaît (le composant gère le saut de ligne via `highlightInline=false`)

### POL-10 — Autres landings (3 SP)

- [ ] `/agents/`, `/plugins/`, `/advanced/`, `/personas/` migrés
- [ ] Mêmes critères d'acceptation que POL-4 → POL-9

### POL-11 — Visual regression (1 SP)

- [ ] Nouveaux snapshots Playwright pour les 10 pages migrées (FR + EN + light + dark = 40 snapshots)
- [ ] Seuil `maxDiffPixelRatio: 0.02` (cf. memory `project_visual_regression_threshold.md`)
- [ ] Tests passent en local et en CI

---

## Definition of Done globale

L'EPIC est livré quand :

- [ ] Toutes les stories MUST + SHOULD sont mergées sur `develop` puis `main`
- [ ] Les composants `<SectionHero>` et `<SectionCardGrid>` sont documentés dans `CLAUDE.md` (section "Composants MDX disponibles" ou nouvelle section "Composants de layout")
- [ ] `npm run lint && npm run type-check && npm run test` passe
- [ ] `npm run test:coverage` ≥ 80 % global, ≥ 80 % sur les 2 nouveaux composants
- [ ] `npm run build` génère bien les pages refondues
- [ ] SonarQube Quality Gate OK (cf. `reference_sonarqube_scan.md`)
- [ ] Lighthouse ≥ 90 sur les 4 métriques pour les 7+ pages migrées (FR + EN)
- [ ] Tests E2E Playwright passent (smoke + visual regression)
- [ ] Validation manuelle FR + EN sur les 7 pages, light + dark, responsive 3 breakpoints
- [ ] `SITE_PAGES.lastModified` à jour pour chaque page migrée
- [ ] Commit AND push après EPIC (cf. memory `feedback_commit_push_each_epic.md`)

---

## Métriques de succès (J+30 après merge complet)

| Métrique | Valeur cible | Source |
|----------|--------------|--------|
| Cohérence visuelle inter-pages | 100 % des 7 pages landing partagent le même hero pattern | Inspection visuelle |
| Réduction du code dupliqué | -300 à -500 LoC nets (extraction des composants - ajout boilerplate) | `git diff --stat` |
| Lighthouse score moyen pages section | ≥ 92 (vs 88 actuel) | Lighthouse CI |
| Couverture tests nouveaux composants | ≥ 85 % | `npm run test:coverage` |
| Scroll-depth 75 % sur `/content/` | ≥ 30 % des pageviews (vs ~baseline actuel) | Matomo après J+30 |
| Bounce rate pages section landing | -5 pp | Matomo après J+30 |
| CTR moyen vers les sub-pages | +10 % | GSC événements + Matomo `external_link_click` |

---

## Risques & mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Régression visuelle sur une page migrée | UX dégradée en prod | Visual regression Playwright RG-25 systématique avant merge |
| Drift entre `<ArticleHero>` (existant) et `<SectionHero>` (nouveau) — deux composants similaires à maintenir | Dette technique | À court terme accepté ; à moyen terme, considérer leur fusion en `<Hero variant="article"|"section">` (chore future, hors EPIC) |
| Pages migrées rapidement perdent du caractère (uniformisation = banalisation) | Identité de marque diluée | `<SectionHero>` accepte `categoryIcon`, `tone`, `count` : chaque page peut varier la pill, l'icône, l'atmosphère. Garder la spécificité des next-steps et sections internes (conservées tel quel). |
| SonarQube remonte de la complexité cognitive sur les nouvelles fonctions de mapping (`resolveContentIcon`) | Quality Gate KO | Garder les fonctions pures avec un `switch` simple, ≤ 8 branches |
| L'extraction casse une intégration tierce (Matomo events, JSON-LD scripts) | Tracking ou SEO KO | Les `<script type="application/ld+json">` restent dans `page.tsx`, hors composant. Le tracking Matomo est dans `<AnalyticsTracker>` via `SectionLayout` — pas concerné par cette refacto (les pages landing n'utilisent pas `SectionLayout`). |
| `dateModified` absent sur certains MDX rend la card incomplète | Inconsistance visuelle | Faire le composant `<SectionCardGrid>` tolérant : si `dateModified` absent, n'affiche rien (déjà prévu en design) |

---

## Planning indicatif

| Sprint | Durée | Stories | SP |
|--------|-------|---------|----|
| Sprint 1 | 1 semaine | POL-1 → POL-3 (composants + page `/content/`) | 10 |
| Sprint 2 | 1.5 semaine | POL-4 → POL-9 (6 pages section) | 12 |
| Sprint 3 | 0.5 semaine | POL-10 + POL-11 (cleanup + tests visuels) | 4 |
| **Total** | **3 semaines** | **12 stories** | **26 SP** |

---

## Annexe : références design

- **Composant gold standard éditorial** : `src/components/layout/ArticleHero.tsx`
- **Atmosphère CSS source** : classes `.art-hero`, `.art-cat-pill`, `.art-title`, `.art-lead` dans `src/app/globals.css` (cherchée par `grep "art-hero" src/app/globals.css`)
- **Refonte graphique d'origine** : `docs/epics/2026-04-refonte-graphique/EPIC.md` (stories RG2-01 à RG2-08 sur les composants article)
- **Page de référence visuelle** : `https://claude-codex.fr/fr/content/leaked-api-key-recovery/` (utilise `<ArticleHero>` + `<ThemeBadges>` + meta dates)
- **Page cible améliorée n°1** : `https://claude-codex.fr/fr/content/`
- **Pages cibles améliorées n°2** : `https://claude-codex.fr/fr/{getting-started,mcp,skills,prompting,use-cases,enterprise}/`
