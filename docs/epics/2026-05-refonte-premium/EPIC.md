# EPIC 2026-05 — Refonte premium : article shell + landing signature + light mode

**Version** : 1.0 — initial scoping (2026-05-07)
**Source** : audit PO de la refonte 2026-04 + retours utilisateur en recette
**Predecesseur** : `docs/epics/2026-04-refonte-graphique/EPIC.md` (32/32 stories merged)
**Source design canonique** : `docs/epics/2026-04-refonte-graphique/design-source/extracted/redisgn-claude-codex/project/`

## Changelog

- **1.0 — 2026-05-07** : ouverture de l'epic suite a la recette utilisateur sur l'app Docker locale. La refonte 2026-04 a livre 32 stories (migration tokens + 3 nouveaux composants), mais ne couvrait que ~70% du SYNTHESIS.md initial. Le scope manquant (article shell premium 3 colonnes, animations signature landing, FAQ/Alert/NextSteps/Pager, light mode polish) est consolide ici en 19 stories pour ~33 points.

---

## 1. Vision et objectifs business

**Probleme identifie** : la refonte 2026-04 a ete cadree "migration vers tokens" avec 22/32 stories de refacto invisibles a l'oeil. Le SYNTHESIS.md du handoff Claude Design prevoyait en realite un projet plus ambitieux (article editorial premium type Vercel x Linear x Stripe + landing avec animations signature). Plusieurs composants nommes dans le SYNTHESIS section 6 (TrustBar, CtaFinal, ReadingProgressBar, ShareRail, TocProgress, ArticleAlert, NextSteps, Pager refondu, FaqItem, ArticleTable, SubNav, ArticleStep gradient, chips orbitaux) n'ont jamais eu de story dediee dans le backlog 2026-04.

**Objectif** : livrer **les 70% manquants** du SYNTHESIS pour que la refonte soit fidele a la vision design originale. Focus particulier sur l'experience article (le coeur editorial du Codex) et la signature animee de la landing.

**Demandes utilisateur explicites lors de la recette 2026-05-07** :
1. Light mode "fonctionne un peu mieux" (atmosphere + contrastes)
2. Reprendre le cadrillage anime + chips orbitaux flottants autour du terminal hero
3. Reordonner les sections de la landing
4. Filtres articles recents + restyling (section "vide" actuellement)
5. **Gros travail sur les articles** (refonte complete via le template `Article - Fuite cle API.html`)

## 2. Perimetre

### In scope

- **Chantier P1 — Article shell premium** (8 stories) : refonte complete des pages articles vers le layout 3 colonnes + composants editoriaux nouveaux (FAQ, Alert variantes, NextSteps, Pager, Tables, Steps gradient).
- **Chantier P2 — Landing signature** (6 stories) : animations chips orbitaux + grid fade, articles recents avec filtres restylise, reorder sections, TrustBar, CTA Final pattern.
- **Chantier P3 — Polish global** (5 stories) : CodeBlock always-dark (fix decision violee), light mode polish, stats band classes canoniques.
- **Rollout** : application du nouveau article shell sur les ~150 articles MDX existants (FR + EN, tous chantiers).

### Out of scope (a reporter)

- Variantes hero `xxl` et `inline` (reportees deja en 2026-04 D1).
- Tweaks panel switcher dark/accent (D2 reportee).
- Variante `data-accent="amber"` (D5 reportee).
- Marketplace skills + content curation (autre EPIC).
- Optimisation bundle First Load < 200 KB (recommendation RG-27, story dediee future).

---

## 3. Metriques de succes

- **0 ecart visuel** entre le rendu de `Article - Fuite cle API.html` (source design) et une page article aleatoire de l'app sur 1440x900 desktop, en light + dark.
- **5/5 keyframes signature** implementees avec leur nom canonique : `lp-float`, `lp-pulse`, `lp-blink`, `lp-grid-fade`, `cc-gradient-shimmer`.
- **13/13 composants nouveaux** SYNTHESIS section 6 livres (1/13 actuellement = CodexStatsBand).
- **Light mode** : audit visuel sur 5 routes cles signe par utilisateur OK (atmosphere coherente avec source design).
- **Tests** : 20/20 visual regression light + dark, 20/20 axe-core a11y, couverture > 80%.

---

## 4. Hypotheses et risques

| Risque | Mitigation |
|---|---|
| Le rollout sur 150 articles MDX risque de casser des layouts existants | RG2-10 prevoit un script de migration progressif + tests E2E sur 5 articles cles avant rollout massif |
| `prefers-reduced-motion` mal gere sur les nouvelles animations (lp-float, chips) | Wrapper `@media (prefers-reduced-motion: reduce)` global a verifier dans `globals.css`, ajouter test E2E |
| Light mode = retravailler tous les tokens semantiques | RG2-18 fait un audit-baseline d'abord, puis fix cible (pas big-bang) |
| Article shell 3 col : breakpoint mobile (< 1100px) doit cacher share + TOC sans casser layout | Specifie dans SYNTHESIS section 3 ligne 297 |

---

## 5. Roadmap et dependances

```
P1 Article premium (8 stories, ~16 pts)
├── RG2-01 Article shell 3 colonnes (foundation)
│   └── RG2-02 Reading progress bar
│   └── RG2-03 TOC progress bar
│   └── RG2-10 Rollout sur 150 articles
├── RG2-04 Steps badge gradient 56x56 (composant MDX, indep)
├── RG2-05 FAQ accordeon (composant MDX, indep)
├── RG2-06 Article alert variantes (composant MDX, indep)
├── RG2-07 NextSteps card (composant MDX, indep)
├── RG2-08 Pager refondu (depend RG2-01)
├── RG2-09 Tables refondues (composant MDX, indep)

P2 Landing signature (6 stories, ~15 pts)
├── RG2-11 Chips orbitaux (independent)
├── RG2-12 Cadrillage hero anime (lp-grid-fade)
├── RG2-13 Articles recents — filtres + restyling
├── RG2-14 Landing reorder
├── RG2-15 TrustBar
├── RG2-16 CTA Final pattern dedie

P3 Polish global (5 stories, ~5 pts)
├── RG2-17 CodeBlock always-dark
├── RG2-18 Light mode polish
├── RG2-19 Stats band classes canoniques
```

**Ordre recommande de livraison** :
1. **Sprint 1** : RG2-01 + RG2-02 + RG2-03 (foundation article shell)
2. **Sprint 2** : RG2-04 a RG2-09 (composants editoriaux MDX en parallele)
3. **Sprint 3** : RG2-10 (rollout articles)
4. **Sprint 4** : RG2-11 a RG2-16 (landing signature en parallele)
5. **Sprint 5** : RG2-17 a RG2-19 (polish global)

---

## 6. Backlog detaille

### Chantier P1 — Article shell premium

---

#### RG2-01 — Article shell 3 colonnes

**User story** : En tant que lecteur d'article, je veux un layout type Vercel/Linear avec share rail a gauche, body central 720px et TOC sticky a droite, afin que la lecture soit confortable et les outils d'engagement (share + navigation) accessibles sans scroll.

**Description** : Implementer le composant `ArticleShell` (ou refondre `SectionSlugContent.tsx`) avec layout `art-shell` du source design. Inclut sub-nav article (breadcrumb + lang switcher pill).

**Criteres d'acceptation** :
- [ ] Layout 3 colonnes : share rail 80px / body 720px max / TOC 240px sur viewport >= 1100px
- [ ] Mobile (< 1100px) : 1 colonne, share et TOC caches
- [ ] Sticky offsets : body `top: 96px`, share et TOC `top: 96px`
- [ ] Sub-nav avec breadcrumb (lien Accueil / Section / Current) + lang switcher pill blanc/dark
- [ ] Hero article : pill categorie pulsante + title + lead + meta (auteur + date + dateModified)
- [ ] Aucun hex en dur, classes `art-*` du source design transposees en utilities Tailwind ou layer composants
- [ ] axe-core 0 violation critical/serious sur 1 article test
- [ ] Screenshots light + dark fournis dans la PR

**Estimation** : L / 8 points
**Priorite** : P0
**Dependances** : aucune (foundation)
**Fichiers concernes** :
- `src/components/layout/ArticleShell.tsx` (a creer)
- `src/components/layout/ArticleSubNav.tsx` (a creer)
- `src/components/layout/SectionSlugContent.tsx` (a refondre)
**Notes techniques** : Branche `feat/refonte-premium-RG2-01`. Source : `design-source/.../project/article/Article.jsx` + `article.css` `.art-shell`, `.art-subnav`, `.art-hero`. Le composant doit etre RSC-compatible (pas de `"use client"` au niveau shell).

---

#### RG2-02 — Reading progress bar

**User story** : En tant que lecteur d'article long, je veux une barre de progression fine en haut de page qui m'indique ou j'en suis, afin d'avoir un feedback visuel sur ma progression.

**Criteres d'acceptation** :
- [ ] Position fixed top-0 left-0 right-0, hauteur 3px, z-100
- [ ] Fill : `linear-gradient(90deg, #06b6d4, #f59e0b, #ef4444)` (cyan -> amber -> rouge)
- [ ] Transition `width 80ms linear` pour suivi smooth
- [ ] Calcule % en fonction du scroll vertical sur le body article
- [ ] Cache sur `prefers-reduced-motion` (sinon transition disable)
- [ ] Aucune regression sur les tests E2E navigation

**Estimation** : XS / 1 point
**Priorite** : P0
**Dependances** : RG2-01
**Fichiers concernes** :
- `src/components/ui/ReadingProgressBar.tsx` (a creer)
**Notes techniques** : Branche `feat/refonte-premium-RG2-02`. Source : `article.css` `.art-progress`. Composant client (`"use client"`), `useEffect` avec listener scroll passive.

---

#### RG2-03 — TOC progress bar

**User story** : En tant que lecteur, je veux que la TOC indique visuellement la section active avec une barre de progression locale, afin de savoir ou je suis dans le plan.

**Criteres d'acceptation** :
- [ ] TOC sticky avec border-left 2px default, items 13px / padding 6px 12px
- [ ] Active : border-left 2px brand-500 + text brand-700 + weight 600
- [ ] Bloc progress en bas : padding 14, radius 12, bg `rgba(6,182,212,0.05)` border `rgba(6,182,212,0.15)`
- [ ] Barre `linear-gradient(90deg, brand-500, accent-500)`, num mono 11px (ex: "3 / 12")
- [ ] Met a jour automatiquement selon section visible (IntersectionObserver)

**Estimation** : XS / 1 point
**Priorite** : P0
**Dependances** : RG2-01
**Fichiers concernes** :
- `src/components/ui/TableOfContents.tsx` (a etendre)
**Notes techniques** : Branche `feat/refonte-premium-RG2-03`. Source : `article.css` `.art-toc-progress`.

---

#### RG2-04 — Steps badge gradient 56x56

**User story** : En tant que lecteur de tutoriel, je veux que les Steps aient des badges visuellement distinctifs (carre 56x56 gradient cyan->amber, mono 22px / 800), afin que la progression du tuto soit immediatement lisible.

**Criteres d'acceptation** :
- [ ] Grid `56px 1fr` gap 20, margin `32px 0`
- [ ] Badge num 56x56 radius 14 (pas cercle), gradient `linear-gradient(135deg, brand-500, accent-500)` ou `linear-gradient(135deg, #ef4444, #f59e0b)` pour articles securite
- [ ] Color white, font mono 22px / 800
- [ ] Shadow `0 8px 20px -8px rgba(brand,0.5)`
- [ ] Tests TU + visual regression baseline mises a jour

**Estimation** : S / 2 points
**Priorite** : P0
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/mdx/Steps.tsx`, `src/components/mdx/Step.tsx`
**Notes techniques** : Branche `feat/refonte-premium-RG2-04`. Source : `article.css` `.art-step-num`. Variante securite via prop `variant="security"` sur `<Step>` (gradient rouge->amber).

---

#### RG2-05 — FAQ accordeon

**User story** : En tant que redacteur d'article, je veux un composant `<Faq>` MDX qui rend une liste de questions/reponses en accordeon stylise, afin de structurer les FAQs des articles editoriaux.

**Criteres d'acceptation** :
- [ ] Composant `<Faq>` avec children `<FaqItem question="..." />`
- [ ] Item radius 14, border default, transition 300ms ease-out
- [ ] Question button : padding `18px 22px`, font 16px / 600 primary, chevron 28x28 radius 8 bg-subtle muted, rotate 180 si open
- [ ] Etat open : border `rgba(6,182,212,0.4)` + shadow `0 8px 24px -12px rgba(6,182,212,0.25)` + chevron bg brand-500 white
- [ ] Answer : padding `0 22px 20px`, 15px / 1.65 secondary, liens brand-700 border-bottom subtle
- [ ] Keyboard nav : Enter/Space toggle, Tab navigation
- [ ] axe-core 0 violation (aria-expanded, aria-controls)

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/mdx/Faq.tsx`, `src/components/mdx/FaqItem.tsx` (a creer)
- `src/components/mdx/MdxComponents.tsx` (registration)
**Notes techniques** : Branche `feat/refonte-premium-RG2-05`. Source : `article.css` `.art-faq`, `.art-faq-item`, `.art-faq-q`, `.art-faq-a`.

---

#### RG2-06 — Article alert variantes urgent / info / warning

**User story** : En tant que redacteur, je veux une variante avancee du Callout (`<ArticleAlert>`) avec variantes `urgent`, `info`, `warning` et icones colorees + titre, afin de mettre en valeur des warnings forts (ex : article securite).

**Criteres d'acceptation** :
- [ ] Composant `<ArticleAlert variant="urgent|info|warning" title="..." />`
- [ ] Padding `22px 24px`, radius 16, gap 16
- [ ] `is-urgent` : gradient rouge+amber + glow rouge subtil
- [ ] `is-info` : cyan
- [ ] `is-warning` : amber
- [ ] Icon 44x44 radius 12 coloree par variant
- [ ] Title 16px / 700 primary, text 15px / 1.6 primary

**Estimation** : S / 2 points
**Priorite** : P1
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/mdx/ArticleAlert.tsx` (a creer)
**Notes techniques** : Branche `feat/refonte-premium-RG2-06`. Source : `article.css` `.art-alert`, `.art-alert.is-urgent`. Le `<Callout>` existant garde son role pour les notes legeres ; `<ArticleAlert>` est destine aux articles editoriaux longs.

---

#### RG2-07 — NextSteps card fin d'article

**User story** : En tant que lecteur ayant fini un article, je veux une card "Prochaines etapes" avec eyebrow brand + items lies, afin d'etre guide vers le contenu suivant.

**Criteres d'acceptation** :
- [ ] Composant `<NextSteps title items />` MDX
- [ ] Margin-top 40, padding 28, radius 16
- [ ] Bg `linear-gradient(135deg, rgba(6,182,212,0.06), rgba(245,158,11,0.04))`, border `rgba(6,182,212,0.2)`
- [ ] H eyebrow 13px / 600 brand-700 0.05em uppercase
- [ ] Title 22px / 700 / -0.015em
- [ ] Items : flex padding 10/14 radius 10, hover bg-white border default, font 15px / 500 + desc 13px muted

**Estimation** : S / 2 points
**Priorite** : P1
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/mdx/NextSteps.tsx` (a creer)
**Notes techniques** : Branche `feat/refonte-premium-RG2-07`. Source : `article.css` `.art-next`.

---

#### RG2-08 — Pager refondu

**User story** : En tant que lecteur, je veux que le pager prev/next bas d'article suive le pattern `art-pager` du design source, afin d'avoir une navigation visuelle consistente.

**Criteres d'acceptation** :
- [ ] Grid 1fr 1fr gap 16 mt-64
- [ ] Each : padding 20/22, border default radius 14, bg white (dark: surface-elevated)
- [ ] Hover : border brand-400, translate-y -2 + shadow-md
- [ ] Label 12px / 600 / 0.05em uppercase muted
- [ ] Title 16px / 600 / 1.35
- [ ] Fleches gauche/droite alignees label

**Estimation** : XS / 1 point
**Priorite** : P2
**Dependances** : RG2-01 (integre dans le shell)
**Fichiers concernes** :
- `src/components/layout/SectionSlugContent.tsx` (refacto pager)
**Notes techniques** : Branche `feat/refonte-premium-RG2-08`. Source : `article.css` `.art-pager`.

---

#### RG2-09 — Article tables refondues

**User story** : En tant que lecteur, je veux des tables MDX avec un wrapper rounded + header bg-subtle uppercase + hover row, afin que les tableaux soient lisibles et premium.

**Criteres d'acceptation** :
- [ ] `MdxComponents.table` rendu en wrapper `art-table-wrap` radius 14 border default overflow-hidden
- [ ] TH : padding `14px 18px` / 600 / 13px uppercase 0.03em muted bg-subtle
- [ ] TD : padding `14px 18px` border-bottom default, `tr:last-child` no border, `tr:hover td` bg `rgba(6,182,212,0.04)`

**Estimation** : XS / 1 point
**Priorite** : P2
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/mdx/MdxComponents.tsx`
**Notes techniques** : Branche `feat/refonte-premium-RG2-09`. Source : `article.css` `.art-table`.

---

#### RG2-10 — Rollout article shell sur les articles existants

**User story** : En tant que Product Owner, je veux que tous les articles existants beneficient automatiquement du nouveau shell sans repasser sur chaque MDX, afin que la refonte soit appliquee partout en une seule iteration.

**Description** : Le shell etant un wrapper layout, l'integration ne demande pas d'edit individuel par MDX. Cette story valide le rollout : recette manuelle sur 10 articles representatifs (longueur, type, section) en FR + EN, plus tests visuels.

**Criteres d'acceptation** :
- [ ] 10 articles tests inspectes manuellement (5 FR + 5 EN, varies en longueur et section)
- [ ] Visual regression baselines mises a jour pour ces 10 routes (light + dark = 20 captures)
- [ ] axe-core 0 violation sur les 10 routes
- [ ] Aucun MDX casse (build OK)
- [ ] Sitemap dateModified non modifie (changement structurel pur, pas de contenu)

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : RG2-01 + RG2-02 + RG2-03 + RG2-08
**Fichiers concernes** :
- `e2e/visual.spec.ts` (etendre ROUTES avec 5 articles)
- `e2e/a11y.spec.ts` (etendre ROUTES avec 5 articles)
**Notes techniques** : Branche `feat/refonte-premium-RG2-10`. Decoupler du backlog si rollout trop risque (revertable via env flag ou route opt-in).

---

### Chantier P2 — Landing signature

---

#### RG2-11 — Chips orbitaux flottants autour du terminal hero

**User story** : En tant que visiteur de la landing, je veux 3 chips floating autour du terminal hero (animation lp-float 7s ease-in-out), afin que la landing ait sa signature visuelle vivante promise dans le SYNTHESIS.

**Criteres d'acceptation** :
- [ ] 3 chips `<HeroChip>` positionnes : `top:-18 left:-28`, `top:36% right:-40`, `bottom:-22 left:14%`
- [ ] Animation `lp-float` 7s ease-in-out infinite, delays 0s / 1.3s / 2.6s
- [ ] Chip : bg white, border default, shadow-md, padding 8px 14px 8px 10px, radius full, font 13px/500
- [ ] Icone 24x24 radius 8 coloree (cyan / amber / vert)
- [ ] Cache sur `prefers-reduced-motion: reduce`
- [ ] Compatible mobile (< 768px caches)

**Estimation** : S / 3 points
**Priorite** : P0
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/ui/HeroChips.tsx` (a creer)
- `src/components/ui/HeroTerminal.tsx` (integrer wrapper)
- `src/app/globals.css` (keyframe lp-float)
**Notes techniques** : Branche `feat/refonte-premium-RG2-11`. Source : `landing.css` `.lp-chip-orbit`, `.lp-chip-a/b/c`, `@keyframes lp-float`.

---

#### RG2-12 — Cadrillage hero anime (lp-grid-fade)

**User story** : En tant que visiteur, je veux que la grille de fond du hero ait une animation subtle "respire" (opacity 0.4 -> 1.0 -> 0.4), afin que l'atmosphere ait du mouvement.

**Criteres d'acceptation** :
- [ ] Keyframe `lp-grid-fade` 9s ease-in-out infinite dans `globals.css`
- [ ] Applique sur `.lp-hero-grid` (ou equivalent dans le hero)
- [ ] Cache sur `prefers-reduced-motion`

**Estimation** : XS / 1 point
**Priorite** : P0
**Dependances** : aucune
**Fichiers concernes** :
- `src/app/globals.css`
- `src/components/ui/HeroSplit.tsx` (ou equivalent)
**Notes techniques** : Branche `feat/refonte-premium-RG2-12`. Source : `landing.css` `@keyframes lp-grid-fade`.

---

#### RG2-13 — Articles recents : filtres + restyling

**User story** : En tant que visiteur de la landing, je veux des filtres par categorie au-dessus de la section "Articles recents" et un visuel premium type Vercel pour chaque card, afin que la section soit attractive et navigable.

**Description** : La section actuelle est jugee "vide et pas tres belle" par l'utilisateur. Refonte complete avec :
- Filtres pill horizontaux (toutes / mcp / skills / agents / prompting / securite)
- Card "a la une" grande (lp-article-hero) avec visual gradient + glyph SVG bottom-right, cat pill blur(10px), avatar auteur
- 2 cards small (lp-article-sm) avec indicator top 3px gradient
- Layout 1.6fr 1fr avec hero card a gauche + 2 small empilees a droite

**Criteres d'acceptation** :
- [ ] Filtres pill : `lp-articles-filter` border default radius full padding `8px 14px`, active `bg rgba(6,182,212,0.08) border rgba(6,182,212,0.3) text brand-700`
- [ ] Filtres fonctionnels : clic filtre la grille (article via attribut `data-category`)
- [ ] `lp-article-hero` : visual 260px height avec radial gradients cyan/amber + grid pattern + glyph SVG
- [ ] Cat pill absolute top-22 left-22 : bg `rgba(15,23,42,0.5)` blur(10px) border white-15
- [ ] Body : padding 28/32, meta mono muted, title 28px / 700 / -0.02em, desc 16px / 1.6 secondary
- [ ] Foot : auteur avatar 30x30 + nom 13/600 + role 12 muted, "Lire ->" brand-700 13/600 hover gap+4
- [ ] `lp-article-sm` : padding 24, indicator top 3px gradient, hover translate-y -3 + shadow-md + border brand
- [ ] axe-core 0 violation, contraste pills OK

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : aucune (mais coordonne avec RG2-14 reorder)
**Fichiers concernes** :
- `src/components/ui/RecentArticlesSection.tsx` (refonte)
- `src/components/ui/ArticleHeroCard.tsx`, `ArticleSmallCard.tsx` (a extraire)
- `src/components/ui/ArticleFilters.tsx` (a creer)
**Notes techniques** : Branche `feat/refonte-premium-RG2-13`. Source : `landing.css` `.lp-articles`, `.lp-article-hero`, `.lp-article-sm`, `.lp-articles-filter`. Le filtre est cote client (etat local React), pas de fetch.

---

#### RG2-14 — Landing reorder

**User story** : En tant que Product Owner, je veux que les sections de la landing apparaissent dans l'ordre prescrit par le source design, afin que l'experience corresponde a l'intention editoriale.

**Description** : L'utilisateur a explicitement demande de reordonner. Verifier l'ordre actuel vs `Landing Page.html` source et ajuster.

**Criteres d'acceptation** :
- [ ] Ordre verifie contre `Landing Page.html` source
- [ ] Sections reorganisees dans `src/app/[locale]/page.tsx` selon le source design
- [ ] Tests visual regression mis a jour
- [ ] FR + EN en cohérence (memes sections, meme ordre)

**Estimation** : XS / 1 point
**Priorite** : P0
**Dependances** : RG2-13 (la section articles recents finalisee)
**Fichiers concernes** :
- `src/app/[locale]/page.tsx`
**Notes techniques** : Branche `feat/refonte-premium-RG2-14`. Source : `Landing Page.html` (lire l'ordre des sections).

---

#### RG2-15 — TrustBar landing

**User story** : En tant que visiteur, je veux une barre de "trust" sous le hero qui liste les caracteristiques cles (open-source, FR+EN, MCP officiel, etc.) en mono, afin de me rassurer immediatement.

**Criteres d'acceptation** :
- [ ] Padding `28px 32px`, border-top + border-bottom default
- [ ] Bg `linear-gradient(180deg, #ffffff 0%, #fafcfe 100%)` light / `linear-gradient(180deg, #060912 0%, #080d18 100%)` dark
- [ ] Label 11px / 600 / 0.12em uppercase muted (a gauche)
- [ ] Items mono 13px secondary, icon muted (au centre/droite)
- [ ] 4 items configurables via props ou CMS-like

**Estimation** : S / 2 points
**Priorite** : P1
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/ui/TrustBar.tsx` (a creer)
- `src/app/[locale]/page.tsx` (integrer apres hero)
**Notes techniques** : Branche `feat/refonte-premium-RG2-15`. Source : `landing.css` `.lp-trust`, `.lp-trust-inner`, `.lp-trust-items`.

---

#### RG2-16 — CTA Final pattern dedie (lp-cta-final)

**User story** : En tant que visiteur ayant scrolle toute la landing, je veux un CTA final imposant avec atmosphere brand (radial gradient + grid pattern masque), afin d'etre incite a passer a l'action.

**Criteres d'acceptation** :
- [ ] Section dediee `<CtaFinal>` remplace le CTA generique actuel `page.tsx:393-431`
- [ ] Padding `120px 32px` overflow hidden isolation isolate
- [ ] `::before` radial brand 60% center + linear `#f8fafc -> #ecfeff`
- [ ] `::after` grid pattern brand-500 8% avec mask radial 60% center
- [ ] Title `clamp(40px, 5vw, 64px)` / 800 / -0.03em / 1.05
- [ ] Sub 19px / 1.6 secondary max-width 580
- [ ] Badge pill `rgba(6,182,212,0.1)` border `rgba(6,182,212,0.25)` text brand-700 13px / 600

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/ui/CtaFinal.tsx` (a creer)
- `src/app/[locale]/page.tsx` (remplacer section CTA actuelle)
**Notes techniques** : Branche `feat/refonte-premium-RG2-16`. Source : `landing.css` `.lp-cta-final`.

---

### Chantier P3 — Polish global

---

#### RG2-17 — CodeBlock always-dark (fix decision violee)

**User story** : En tant que designer, je veux que le CodeBlock reste toujours sombre (meme en light mode), conformement a la decision design SYNTHESIS section 7.1, afin de respecter l'intention editoriale.

**Description** : RG-14 a implemente un theme Prism qui bascule `nightOwl` <-> `nightOwlLight`. Le SYNTHESIS dit explicitement : "CodeBlock toujours sombre, pas d'inversion en light mode (choix design delibere)". Reverser cette implementation.

**Criteres d'acceptation** :
- [ ] `useCodeTheme` hook supprime ou simplifie a `themes.nightOwl` constant
- [ ] Le CodeBlock garde son background `--code-bg` qui ne bascule plus en light mode
- [ ] Tokens prism (com / kw / str / var / fn) toujours sur fond sombre
- [ ] Visual regression baselines a mettre a jour (les screenshots sur pages doc avec CodeBlock changent)
- [ ] axe-core OK (contraste tokens prism sur fond sombre deja >= 4.5)

**Estimation** : XS / 1 point
**Priorite** : P0
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/ui/CodeBlock.tsx` (revert useCodeTheme)
- `src/app/globals.css` (--code-bg defini sombre dans `:root` ET `.dark`)
**Notes techniques** : Branche `feat/refonte-premium-RG2-17`. Cf. SYNTHESIS section 7 "Decisions implicites" item 1.

---

#### RG2-18 — Light mode polish

**User story** : En tant que visiteur en light mode, je veux que l'ambiance soit aussi soignee qu'en dark mode (atmosphere coherente, contrastes, spacings, halos hero), afin que les deux modes aient la meme qualite premium.

**Description** : L'utilisateur signale en recette : "j'aurais aime que le light mode fonctionne un peu mieux". Audit + fixes cibles :
- Verifier les halos hero light vs source design `Landing Page.html`
- Verifier les ombres / shadows token light vs dark
- Verifier les surfaces card en light (plat blanc OK ou trop terne ?)
- Verifier le wordmark gradient en light (visible et lisible ?)
- Audit visuel sur 5 routes cles + retour utilisateur

**Criteres d'acceptation** :
- [ ] Audit baseline : screenshots actuels light + comparaison cote-a-cote avec source
- [ ] Liste de 5-10 ecarts identifies et chiffres (delta couleur / opacity / shadow)
- [ ] Fixes appliques en prioritisant l'atmosphere hero + cards
- [ ] Visual regression baselines mises a jour
- [ ] Recette utilisateur OK (validation explicite)

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : RG2-11, RG2-12 (l'atmosphere hero light depend des animations)
**Fichiers concernes** :
- `src/app/globals.css` (variables `:root`)
- `src/components/ui/HeroSplit.tsx`, autres composants identifies
**Notes techniques** : Branche `feat/refonte-premium-RG2-18`. Audit en debut de story, fixes ensuite. Pas de big-bang : iterer.

---

#### RG2-19 — Stats band classes canoniques (lp-stats)

**User story** : En tant que developpeur QA, je veux que la stats band utilise les classes `lp-stats` canoniques avec halos `::before` cyan/amber, afin que le composant matche pixel-pres le source design.

**Description** : RG-32 a livre `CodexStatsBand` mais sans les classes nominales `lp-stats` ni les pseudo-elements `::before` lateraux. Renforcer pour rapprocher du source.

**Criteres d'acceptation** :
- [ ] Classe wrapper `.lp-stats` ou utility equivalente Tailwind
- [ ] `::before` radial cyan a gauche, amber a droite (deja partiellement la, verifier conformite)
- [ ] Border-left subtle entre stats (cf. `landing.css` `.lp-stats-item:not(:last)`)
- [ ] Tabular-nums sur les valeurs (deja la)
- [ ] Visual regression OK

**Estimation** : XS / 1 point
**Priorite** : P2
**Dependances** : aucune
**Fichiers concernes** :
- `src/components/ui/CodexStatsBand.tsx`
- `src/app/globals.css` (eventuellement classes layer composant)
**Notes techniques** : Branche `feat/refonte-premium-RG2-19`. Source : `landing.css` `.lp-stats`, `.lp-stats-item`.

---

## 7. Definition of Ready (par story)

Avant qu'une story entre en sprint, elle doit satisfaire :

- [ ] Les criteres d'acceptation sont explicites, mesurables et testables
- [ ] La maquette ou la classe CSS source est identifiee (fichier + ligne)
- [ ] Les dependances sont au statut "Done" ou "In Progress"
- [ ] L'estimation en points est renseignee
- [ ] Les fichiers concernes sont identifies
- [ ] La branche Git cible est nommee (`feat/refonte-premium-RG2-XX`)

---

## 8. Definition of Done (transverse epic)

Chaque story est "Done" quand :

- [ ] Le code passe `npm run lint && npm run type-check`
- [ ] Les tests unitaires passent (`npm run test`)
- [ ] Couverture >= 80% lignes / 80% branches
- [ ] SonarQube Quality Gate OK : 0 bug, 0 code smell BLOCKER/CRITICAL, 0 hotspot, 0 `any`
- [ ] 0 hex code hors tokens (`scripts/check-hardcoded-colors.sh` retourne exit 0)
- [ ] Visual regression : 20/20 routes light + dark (ou baselines mises a jour si changement intentionnel)
- [ ] axe-core 0 violation critical/serious
- [ ] Screenshots dark + light fournis dans la PR (au minimum desktop 1440px)
- [ ] PR creee depuis `feat/refonte-premium-RG2-XX` vers `develop`
- [ ] Verification manuelle effectuee sur `/fr/` et `/en/` pour les routes impactees

---

## 9. Plan de release

- **Sprint 1** (semaine 19) : RG2-01 + RG2-02 + RG2-03 (foundation article shell)
- **Sprint 2** (semaine 20) : RG2-04 a RG2-09 (composants editoriaux MDX) en parallele
- **Sprint 3** (semaine 21) : RG2-10 (rollout articles) + RG2-17 (codeblock)
- **Sprint 4** (semaine 22) : RG2-11 a RG2-16 (landing signature) en parallele
- **Sprint 5** (semaine 23) : RG2-18 + RG2-19 (polish)

Release cible : `v1.7.0` apres Sprint 3 (article shell premium) en preview, `v1.8.0` apres Sprint 5 (landing signature complete).

---

## 10. Ressources

- Source design canonique : `docs/epics/2026-04-refonte-graphique/design-source/extracted/redisgn-claude-codex/project/`
  - `Article - Fuite cle API.html` (template article cible)
  - `Landing Page.html` + `Landing Page Dark.html` (template landing)
  - `article.css` (toutes les classes `.art-*`)
  - `landing.css` + `landing-dark.css` (toutes les classes `.lp-*`)
  - `colors_and_type.css` (tokens primitifs)
- Synthesis design : `docs/epics/2026-04-refonte-graphique/SYNTHESIS.md`
- Audit PO ayant motive cet EPIC : conversation 2026-05-07 (resume dans le commit ouvrant l'EPIC)
- Liens d'apercu Anthropic (acces interne) :
  - Light landing : https://api.anthropic.com/v1/design/h/bzw6C2wf1jfBdD5fEo3hyg
  - Dark landing : https://api.anthropic.com/v1/design/h/J8poOMAcUwpWoKFaIPjDfg
  - Article template : https://api.anthropic.com/v1/design/h/6rsfZ-CxP6yikZBif5xqCA
