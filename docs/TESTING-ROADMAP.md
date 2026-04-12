# Testing Roadmap

Plan d'action pour monter la couverture de tests du projet The Claude Codex.

## Etat actuel (Phase 1 terminee)

| Metrique | Baseline | Phase 1 | Objectif final |
|----------|----------|---------|----------------|
| Lines | 15.2% | **40.4%** | 70% |
| Statements | 15.1% | **39.3%** | 70% |
| Branches | 13.5% | **30.1%** | 70% |
| Functions | 19.9% | **30.0%** | 70% |

### Tests existants

**Unit tests (13 fichiers, ~1200 lignes)**

| Fichier | Cible | Tests |
|---------|-------|-------|
| `section-navigation.test.ts` | `lib/section-navigation.ts` | Structure nav, `getSectionFromPathname` |
| `section-utils.test.ts` | `lib/section-utils.ts` | `extractSimpleSlug`, `getAdjacentPages` |
| `configurator/generator.test.ts` | `lib/configurator/generator.ts` | Toutes les fonctions de generation |
| `configurator/presets.test.ts` | `lib/configurator/presets.ts` | Coherence PROFILES, SUBSCRIPTIONS, FEATURES, PRESETS |
| `mdx.test.ts` | `lib/mdx.ts` | Lecture, parsing, validation frontmatter, fallback locale |
| `structured-data.test.ts` | `lib/structured-data.ts` | Tous les schemas JSON-LD |
| `metadata.test.ts` | `lib/metadata.ts` | Metadata SEO, constantes |
| `search-index.test.ts` | `lib/search-index.ts` | Recherche, scoring, normalisation |
| `Header.test.tsx` | `components/layout/Header` | Navigation, menu mobile, search trigger |
| `Footer.test.tsx` | `components/layout/Footer` | Liens, branding, copyright |
| `CodeBlock.test.tsx` | `components/ui/CodeBlock` | Rendu, copie clipboard |
| `Breadcrumb.test.tsx` | `components/ui/Breadcrumb` | Navigation breadcrumb |
| `ScrollToTop.test.tsx` | `components/ui/ScrollToTop` | Bouton scroll |

**E2E tests (3 fichiers, ~184 lignes)**

| Fichier | Couverture |
|---------|-----------|
| `navigation.spec.ts` | Navigation sections, breadcrumbs |
| `search.spec.ts` | Dialog recherche, Ctrl+K, resultats |
| `theme-toggle.spec.ts` | Toggle dark/light mode |

### Coverage par zone

| Zone | Coverage lines | Commentaire |
|------|---------------|-------------|
| `lib/` | 91% | Quasi complet |
| `lib/configurator/` | 86% | Manque zip.ts et types.ts |
| `components/` | ~12% | Gros potentiel d'amelioration |
| `data/` | 25% | glossary.ts non importe |
| `i18n/` | 0% | Petit mais pas teste |

---

## Phase 2 : Objectif 50% (composants interactifs)

### 2.1 Composants UI a tester

| Composant | LOC | Priorite | Ce qu'on teste |
|-----------|-----|----------|---------------|
| `SearchDialog.tsx` | ~285 | Haute | Integration search-index, ouverture Ctrl+K / bouton, navigation resultats, fermeture Escape, affichage "aucun resultat" |
| `TableOfContents.tsx` | ~130 | Haute | Generation des headings, highlight de la section active, rendu responsive |
| `Callout.tsx` | ~36 | Moyenne | Rendu des 3 variantes (tip/warning/info), icones, classes CSS |
| `LanguageSwitcher.tsx` | ~80 | Haute | Switch FR/EN, construction URL correcte, etat actif |
| `SectionSidebar.tsx` | ~100 | Moyenne | Items de navigation, lien actif, responsive |
| `TcoCalculator.tsx` | ~149 | Haute | Calculs corrects, inputs numeriques, affichage resultats |
| `GlossaryTooltip.tsx` | ~147 | Basse | Affichage tooltip, lookup terme |
| `PricingTable.tsx` | ~158 | Basse | Rendu tableau, liens abonnements |

**Technique** : React Testing Library + mocks next-intl/next-themes (deja dans setup.tsx).

### 2.2 Composants Configurateur

| Composant | LOC | Ce qu'on teste |
|-----------|-----|---------------|
| `ConfiguratorWizard.tsx` | ~350 | Flow step 1-4, navigation avant/arriere, validation |
| `StepProfile.tsx` | ~150 | Selection profil, callback onChange |
| `StepStack.tsx` | ~150 | Toggle stacks, filtrage par profil |
| `StepSubscription.tsx` | ~120 | Selection abonnement, mise en avant recommande |
| `StepFeatures.tsx` | ~120 | Toggle features, gating par subscription |
| `ConfigPreview.tsx` | ~180 | Rendu preview, tabs fichiers generes |
| `PresetCard.tsx` | ~90 | Click preset, affichage infos |

**Technique** : Tester le wizard complet avec un flow end-to-end (profil -> stacks -> sub -> features -> preview). Chaque step aussi en isolation.

### 2.3 Tests E2E supplementaires

| Fichier | Couverture |
|---------|-----------|
| `e2e/i18n.spec.ts` | Switch FR -> EN via LanguageSwitcher, verifier contenu en anglais, URLs prefixees `/en/`, retour FR |
| `e2e/configurator.spec.ts` | Wizard complet : selectionner preset, naviguer les steps, verifier preview, tester le download |
| `e2e/accessibility.spec.ts` | Focus management, aria-labels, keyboard navigation (ajouter `@axe-core/playwright`) |

### 2.4 Lib restant

| Fichier | Ce qu'on teste |
|---------|---------------|
| `lib/configurator/zip.ts` | Mock JSZip, verifier que les bons fichiers sont ajoutes |
| `data/glossary.ts` | Importer et valider la structure des termes |

### 2.5 Estimation d'impact

- Composants UI : +8-10 points de coverage
- Configurateur : +5-7 points
- E2E : pas de coverage directe mais validation fonctionnelle
- Lib restant : +2-3 points

**Total estime : ~50-55% de lines coverage**

### 2.6 Actions CI

Quand le seuil de 50% est atteint :

1. Retirer `continue-on-error: true` du job `test` dans `ci.yml`
2. Monter les seuils CI a 40% (marge de securite)
3. Ajouter un job Playwright E2E dans `ci.yml`

---

## Phase 3 : Objectif 70% (couverture robuste)

### 3.1 Composants restants

Tous les composants `components/ui/` non couverts en phase 2 :

| Composant | Type de test |
|-----------|-------------|
| `AnimateOnScroll.tsx` | Snapshot + mock IntersectionObserver |
| `AnimatedBeam.tsx` | Snapshot |
| `ArticleDates.tsx` | Rendu dates formatees |
| `AudienceCard.tsx` | Props et rendu |
| `BorderBeam.tsx` | Snapshot |
| `DecryptedText.tsx` | Animation mock + rendu final |
| `FeatureCard.tsx` | Props, liens, icones |
| `HeroTerminal.tsx` | Snapshot animation terminale |
| `McpArchitectureDiagram.tsx` | Snapshot SVG |
| `NotFoundAnimation.tsx` | Rendu 404 |
| `PathCard.tsx` | Props et liens |
| `Screenshot.tsx` | Rendu image avec caption |
| `Skeleton.tsx` | Rendu loading states |
| `TerminalScreenshot.tsx` | Snapshot |
| `TestimonialCard.tsx` | Props et rendu |
| `TranslationFallback.tsx` | Fallback quand traduction manquante |
| `TypingTerminal.tsx` | Animation mock |
| `VideoEmbed.tsx` | Rendu iframe |

### 3.2 Composants MDX

| Composant | Ce qu'on teste |
|-----------|---------------|
| `MdxRenderer.tsx` | Rendu MDX complet avec composants custom |
| `MdxComponents.tsx` | Mapping HTML vers composants styles |
| `Card.tsx` | Rendu titre + contenu |
| `Steps.tsx` | Numerotation, rendu steps |
| `Tabs.tsx` | Switch entre onglets, etat actif |

### 3.3 Composants Layout

| Composant | Ce qu'on teste |
|-----------|---------------|
| `SectionLayout.tsx` | Rendu avec sidebars, breadcrumb, TOC |
| `SectionSlugContent.tsx` | Rendu page article complete |
| `ThemeProvider.tsx` | Fourniture du contexte theme |
| `ThemeToggle.tsx` | Toggle et persistance |
| `Logo.tsx` | Rendu SVG + lien accueil |

### 3.4 I18n

| Fichier | Ce qu'on teste |
|---------|---------------|
| `i18n/config.ts` | Export des locales |
| `i18n/routing.ts` | Configuration routing |
| `i18n/navigation.ts` | Helpers de navigation |
| `i18n/request.ts` | Resolution locale |

### 3.5 Hook

| Fichier | Ce qu'on teste |
|---------|---------------|
| `lib/use-reduced-motion.ts` | Mock matchMedia, retour correct |

### 3.6 E2E avances

| Fichier | Couverture |
|---------|-----------|
| `e2e/mobile.spec.ts` | Responsive : menu hamburger, sidebar collapse, breakpoints |
| `e2e/seo.spec.ts` | Balises meta, canonical, og:image, structured data dans le DOM |
| `e2e/content-rendering.spec.ts` | Rendu MDX complet, composants Callout/Steps/Tabs dans le contenu |
| `e2e/a11y.spec.ts` | `@axe-core/playwright` sur toutes les pages principales |

### 3.7 Outillage supplementaire

- **axe-core** : `npm install -D @axe-core/playwright` pour les audits accessibilite automatises
- **Snapshot testing** : Activer les snapshots vitest pour les composants purement presentationnels
- **Visual regression** : Evaluer l'ajout de `@playwright/experimental-ct-react` pour le component testing Playwright

### 3.8 Actions CI finales

Quand le seuil de 70% est atteint :

1. Monter les seuils CI a 60% (marge)
2. Ajouter le job E2E accessibilite dans CI
3. Configurer le reporting coverage dans les PR (commentaire automatique via un GitHub Action)
4. Evaluer la mise en place de visual regression testing en CI

---

## Dependabot : PRs en attente

14 PRs Dependabot ouvertes, certaines avec des bumps majeurs. Traitement recommande :

| PR | Package | Type | Action |
|----|---------|------|--------|
| Patches/minors | Divers | Securite | Merger rapidement |
| tailwindcss v3 -> v4 | tailwindcss | Majeur | Evaluer impact (breaking changes classes) |
| eslint v8 -> v10 | eslint | Majeur | Tester avec config actuelle |
| framer-motion v11 -> v12 | framer-motion | Majeur | Verifier API animations |
| @types/node v20 -> v25 | @types/node | Majeur | Probablement safe |
| eslint-config-next v14 -> v16 | eslint-config-next | Majeur | Aligner avec version Next.js |

Ordre recommande : patches d'abord, puis @types/node, puis eslint, puis les autres majeurs un par un avec validation build + tests.

---

## Metriques de suivi

Pour suivre la progression au fil du temps :

```bash
# Coverage rapide (texte)
npm run test:coverage

# Coverage HTML detaille
npx vitest run --coverage
open coverage/index.html

# E2E
npm run test:e2e

# Lint + type-check + tests (CI local)
npm run lint && npm run type-check && npm run test
```
