# EPIC : Refonte graphique uniforme — The Claude Codex

**Epic ID** : EPIC-2026-04-DESIGN
**Date de creation** : 2026-04-26
**Version** : 1.3 — cloture (32/32 stories merged) + suite ouverte 2026-05 (2026-05-07)
**Owner** : (a completer par l'utilisateur)
**Statut** : ✅ **CLOTURE** — toutes les stories du backlog sont mergees sur `develop`
**Branche cible** : `feat/refonte-graphique-foundation` → `develop` → `main`
**Lien design source** : https://api.anthropic.com/v1/design/h/2yEee477ZCPcglTV-5P65g (auth utilisateur requise)

> **Suite directe** : `docs/epics/2026-05-refonte-premium/EPIC.md` couvre les ~30% du SYNTHESIS qui n'avaient pas eu de stories dediees ici (article shell 3 colonnes, chips orbitaux, FAQ/Alert/NextSteps, light mode polish). L'audit PO 2026-05-07 a montre que cet EPIC etait cadre "migration vers tokens" mais ne contenait pas les stories pour livrer le SYNTHESIS dans son integralite.

---

## Changelog

- **1.3 — 2026-05-07** : EPIC officiellement clos. Audit PO en recette a revele que 22/32 stories etaient des migrations invisibles a l'oeil et que 13 composants nouveaux promis dans SYNTHESIS section 6 n'avaient pas de story dediee ici. Suite consolidee dans EPIC `2026-05-refonte-premium`.
- **1.2 — 2026-04-27** : insertion effective des stories décidées en 1.1 — RG-31 (badges thématiques articles) en C3, RG-32 (sections data landing : CodexStatsBand factuelles + RecentArticlesSection) en C4. Backlog porté à **32 stories pour 101 points**.
- **1.1 — 2026-04-27** : décisions utilisateur intégrées (D1 hero split uniquement, D2 tweaks panel hors scope, D3 stats band factuelles via CodexStatsBand, D4 articles 3 derniers par dateModified, D5 cyan uniquement, D6 badges thématiques nouvelle story en C3)
- **1.0 — 2026-04-26** : draft initial

---

## 1. Vision et objectifs business

The Claude Codex a ete construit avec une identite visuelle fonctionnelle, mais heterogene : les tokens sont partiellement centralises, les composants codent encore des valeurs hexadecimales en dur, et le CodeBlock s'affiche toujours en dark quel que soit le theme. Le nouveau rendu produit via Claude Design definit une direction claire, editorial et moderne, qui positionne le site au niveau des references du secteur (Vercel, Linear, Stripe).

Cette refonte a pour objectif de propager cette identite de maniere systematique : chaque couleur, chaque ombre, chaque rayon de bordure doit passer par un token nomme et semantique. L'utilisateur final gagne une experience visuelle coherente du header jusqu'a la page 404, en light comme en dark, en francais comme en anglais. Le site renforce ainsi sa credibilite aupres des developpeurs et non-developpeurs qui le decouvrira.

D'un point de vue strategique, cette refonte pose les fondations techniques pour toutes les evolutions graphiques futures : ajouter un theme, ajuster une couleur de marque ou modifier la typographie ne necessiteront plus de chasse aux valeurs en dur dans 50 fichiers. C'est un investissement en maintenabilite autant qu'en design.

---

## 2. Perimetre

### In scope

- Tous les tokens design (primitives, semantiques, composants) dans `src/app/globals.css` via `@theme` et variables CSS
- Echelle typographique complete (display-1 a caption/overline) et echelle d'animations tokenisees
- 11 composants layout : `Header`, `Footer`, `Logo`, `SectionLayout`, `SectionSidebar`, `ThemeToggle`, `LanguageSwitcher`, `AnalyticsTracker`, `FooterVersion`, `SectionSlugContent`, `Breadcrumb`
- 35+ composants UI dans `src/components/ui/` (Callout, CodeBlock, SearchDialog, TableOfContents, ScrollToTop, SectionHeading, FeatureCard, AudienceCard, PathCard, KeyboardShortcut, GlossaryTooltip, TerminalScreenshot, CopyrightYear, icons, etc.)
- 5 composants MDX : `MdxRenderer`, `MdxComponents`, `Card`, `Steps`, `Tabs`
- 51 pages statiques : landing, about, configurator, glossary, reference, personas, limits, future, 404, toutes les pages de section doc (getting-started, mcp, skills, prompting, agents, advanced, enterprise, use-cases, content)
- Dark mode et light mode sur 100% des composants et pages
- Versions FR et EN verifiees sur chaque chantier
- Accessibilite WCAG 2.1 AA : contrastes, navigation clavier, aria
- Performance : Lighthouse >= 90, CLS < 0.05, FirstLoad < 200 ko gzip
- OG images, favicon, et manifest alignes avec la nouvelle identite
- Regeneration de `llms.txt` et `llms-full.txt` apres modifications

### Out of scope

- Refonte fonctionnelle (nouvelles features, modification de la logique metier ou de navigation)
- Modification du contenu editorial des fichiers MDX (textes, titres, exemples de code dans les guides)
- Changement de stack technique (Next.js, Tailwind, next-intl, prism-react-renderer)
- Refonte de l'architecture des routes ou du systeme d'i18n
- Nouveaux composants fonctionnels (configurateur wizard redesign au-dela du visuel, nouveau moteur de recherche, etc.)
- **Variantes hero xxl et inline** : Claude Design propose trois variantes (split / xxl / inline) ; seule la variante `split` (texte gauche + terminal animé droite) est dans le scope de cette epic. Les variantes xxl et inline sont reportées au backlog futur.
- **Tweaks panel Claude Design** : le panneau bottom-right de prototypage (switcher dark/accent/variants) n'est pas porté. Le `ThemeToggle` existant gère déjà le dark/light. Aucune UI de prototypage en production.
- **Switcher accent ambre via `data-accent`** : le site reste cyan-only pour cette epic. La classe `.cc-text-gradient` (dégradé animé cyan→ambre du wordmark, animation shimmer 4s) est conservée telle quelle et n'est pas concernée par cette décision. Le switcher `data-accent="amber"` n'est pas implémenté.

---

## 3. Metriques de succes

| Metrique | Cible | Methode de mesure |
|---|---|---|
| Lighthouse Performance | >= 90 | CI Lighthouse sur 5 routes cles |
| Lighthouse Accessibility | >= 90 | CI Lighthouse |
| Lighthouse Best Practices | >= 90 | CI Lighthouse |
| Lighthouse SEO | >= 90 | CI Lighthouse |
| axe-core violations AA | 0 | `@axe-core/playwright` sur 10 routes |
| Hex codes hors tokens | 0 | `grep -rE '#[0-9a-fA-F]{3,6}' src/` en CI |
| CLS (Cumulative Layout Shift) | < 0.05 | Playwright + Web Vitals |
| Bundle FirstLoad | < 200 ko gzip | `next build` output |
| FOUC sur theme toggle | 0 | Test E2E toggle rapide |
| Composants dark + light | 100% | Screenshots dans chaque PR |
| Recette FR + EN | OK sur 5 routes cles | Verification manuelle + E2E |
| SonarQube Quality Gate | OK | Scan avant merge |
| Coverage tests | >= 80% lignes + branches | Vitest coverage |

---

## 4. Hypotheses et risques

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| Source design Claude Design non accessible sans auth | Haute (confirmee) | Bloquant C1 | C0 incompressible : l'utilisateur doit exporter et deposer les assets avant tout autre chantier |
| Direction visuelle non validee avant implementation | Moyenne | Refactoring en cascade | Validation explicite par l'utilisateur apres C0, avant C1 |
| `backdrop-blur` / `.glass` : rendu incorrect sur certains navigateurs | Moyenne | Degradation visuelle | Fallback `bg-white/95 dark:bg-slate-900/95` si `@supports not (backdrop-filter: blur())` |
| CodeBlock always-dark : migration vers theme adaptatif casse les highlights | Moyenne | Regression visuelle sur 100+ usages | Choisir un theme prism light + dark compatible, tester sur les 5 langages les plus utilises (bash, ts, tsx, json, yaml) |
| Regressions visuelles sur 196 fichiers MDX | Haute (surface large) | Regressions non detectees en prod | Tests de regression visuelle (Playwright screenshots) avant merge de C3 |
| Contrastes insuffisants sur tokens semantiques proposes | Moyenne | Violation WCAG AA | Script de validation contraste automatise (WCAG contrast ratio) integre en CI des C1 |
| FOUC au theme toggle | Moyenne | Experience degradee | Token de theme injecte en `<script>` bloquant dans `<head>` (pattern next-themes) |
| i18n FR + EN desynchronises apres modifications layout | Moyenne | Contenu manquant ou en mauvaise langue | Verif croisee FR + EN obligatoire dans la DoD de chaque story |
| SonarQube : complexite cognitive ou `any` introduits | Faible | Quality Gate KO | Lint + type-check + sonar dans chaque PR, pas de `any`, wrapper `Readonly<>` sur les props |
| Build Docker > 50 MB apres ajout d'assets | Faible | Violation contrainte infra | Audit bundle apres C4, images en WebP, pas de polices non utilisees |

---

## 5. Roadmap et dependances

```
C0 — Cadrage & extraction Claude Design         [S]  Sprint 1
  |
  v (bloquant)
C1 — Foundation tokens                          [M]  Sprint 1-2
  |
  +--------+--------+
  v        v        v
C2        C3       C4                           [L]  Sprint 2-3
Layout  MDX doc  Editorial/landing
  |        |        |
  +--------+--------+
           v (tous C2+C3+C4 done)
          C5 — Pages speciales                  [M]  Sprint 3-4
           |
           v
          C6 — QA & polish transverse           [M]  Sprint 4
```

| Chantier | Prerequis bloquant | Estimation | Priorite |
|---|---|---|---|
| C0 | Aucun (action utilisateur) | S | P0 |
| C1 | C0 valide | M | P0 |
| C2 | C1 tokens disponibles | L | P0 |
| C3 | C1 tokens disponibles | L | P0 |
| C4 | C1 tokens disponibles | L | P1 |
| C5 | C2 + C3 + C4 | M | P1 |
| C6 | C5 | M | P0 (quality gate) |

---

## 6. Backlog detaille

Les estimations en points suivent la suite de Fibonacci (1, 2, 3, 5, 8, 13).

---

### Chantier C0 — Cadrage et extraction Claude Design

---

#### RG-01 — Acquérir et formaliser la source design Claude

**User story** : En tant que Product Owner, je veux disposer des maquettes exportees depuis Claude Design afin que les agents DEV aient une reference visuelle exploitable avant de toucher un seul token.

**Description** : L'utilisateur se connecte a https://api.anthropic.com/v1/design/h/2yEee477ZCPcglTV-5P65g depuis son navigateur (auth requise), exporte ou capture les vues light et dark de la landing et de l'article, et depose les fichiers dans `docs/epics/2026-04-refonte-graphique/design-source/`. Cette story est la seule dont l'action principale incombe a l'utilisateur (non automatisable par un agent DEV).

**Criteres d'acceptation** :
- [ ] Le dossier `docs/epics/2026-04-refonte-graphique/design-source/` contient au minimum : screenshot landing light, screenshot landing dark, screenshot article light, screenshot article dark
- [ ] Un fichier `design-source/NOTES.md` documente les tokens visuels observes : couleurs de fond, couleurs de texte, style des cartes, style des boutons CTA, typographie display, halos/glows, rayons de bordure
- [ ] La direction visuelle (hypothese A "Editorial cyan luminescent" ou variante) est validee par ecrit par l'utilisateur dans `design-source/NOTES.md`
- [ ] Les maquettes sont au format PNG ou WebP, resolution >= 1440px de large

**Estimation** : S / 2 points
**Priorite** : P0
**Dependances** : aucune
**Fichiers concernes** :
- `docs/epics/2026-04-refonte-graphique/design-source/` (a creer)
**Notes techniques** : Cette story doit etre marquee "Done" par l'utilisateur avant que RG-02 puisse demarrer. Les agents DEV peuvent commencer l'analyse structurelle (inventaire des hex codes en dur) en parallele.

---

#### RG-02 — Inventaire des valeurs en dur et baseline Lighthouse

**User story** : En tant qu'agent DEV, je veux un inventaire exhaustif des hex codes et valeurs de design codees en dur dans le codebase, ainsi qu'une baseline Lighthouse, afin de mesurer precisement l'effort de migration et d'avoir un point de comparaison apres refonte.

**Description** : Executer un grep sur `src/` pour recenser tous les hex codes, rgba() et hsl() qui ne passent pas par un token CSS. Lancer Lighthouse sur 5 routes cles et sauvegarder les rapports. Documenter le resultat dans `docs/epics/2026-04-refonte-graphique/baseline/`.

**Criteres d'acceptation** :
- [ ] Fichier `baseline/hex-audit.txt` liste tous les fichiers + lignes contenant des valeurs de couleur codees en dur (hex `#xxx`, `rgba(`, `hsl(`)
- [ ] Fichier `baseline/lighthouse-report-{route}.json` produit pour 5 routes : `/fr/`, `/fr/getting-started/`, `/fr/mcp/`, `/fr/prompting/`, `/fr/configurator/`
- [ ] Les scores Lighthouse de reference sont documentes dans `baseline/README.md`
- [ ] Un script `scripts/check-hardcoded-colors.sh` est cree et peut etre integre en CI (exit code 1 si resultat non vide)

**Estimation** : S / 2 points
**Priorite** : P0
**Dependances** : aucune (peut demarrer en parallele de RG-01)
**Fichiers concernes** :
- `src/app/globals.css`
- `src/components/` (tous les fichiers)
- `scripts/check-hardcoded-colors.sh` (a creer)
- `docs/epics/2026-04-refonte-graphique/baseline/` (a creer)
**Notes techniques** : Branche `feat/refonte-graphique-C0-baseline`. Le script grep doit exclure `node_modules/`, `.next/`, et les fichiers de commentaires. Commande de reference : `grep -rn --include="*.tsx" --include="*.ts" --include="*.css" -E "(#[0-9a-fA-F]{3,8}|rgba?\(|hsl\()" src/`.

---

### Chantier C1 — Foundation tokens

---

#### RG-03 — Tokens primitifs et semantiques dans globals.css

**User story** : En tant qu'agent DEV, je veux centraliser tous les tokens de couleur, de surface et de texte dans `globals.css` en couches primitives et semantiques, afin que chaque composant n'utilise plus que des noms semantiques et que le changement de theme soit trivial.

**Description** : Definir les trois tiers de tokens dans `globals.css` : (1) primitives dans `@theme` (palettes brand/accent/slate/emerald, deja partiellement presentes, a completer), (2) semantiques dans `:root` et `.dark` (`--surface-1/2/3`, `--text-primary/secondary/muted`, `--border-subtle/default/strong`, `--brand-primary`, `--brand-secondary`, `--status-success/warning/error/info`), (3) tokens composants (`--code-bg`, `--callout-info-bg/border/text`, etc.). Valider les contrastes WCAG AA pour chaque paire texte/fond.

**Criteres d'acceptation** :
- [ ] Section `@theme` couvre les palettes brand (50-950), accent (50-950), et les palettes neutres slate (50-950)
- [ ] Variables semantiques definies dans `:root` et `.dark` : au minimum `--surface-1`, `--surface-2`, `--surface-3`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-subtle`, `--border-default`, `--border-strong`, `--brand-primary`, `--brand-hover`
- [ ] Variables composants definies : `--code-bg`, `--code-text`, `--callout-info-bg`, `--callout-info-border`, `--callout-tip-bg`, `--callout-tip-border`, `--callout-warning-bg`, `--callout-warning-border`
- [ ] Script `scripts/check-contrast.ts` valide le ratio WCAG AA (>= 4.5:1 normal, >= 3:1 large) pour toutes les paires semantiques text/surface, avec rapport en sortie
- [ ] `grep -rE '#[0-9a-fA-F]{3,8}' src/app/globals.css` ne retourne que les valeurs dans `@theme` (primitives autorisees) — zero hex hors `@theme`
- [ ] Build `npm run build` passe sans erreur
- [ ] `npm run type-check` et `npm run lint` passent

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : RG-01 (direction visuelle validee)
**Fichiers concernes** :
- `src/app/globals.css`
- `scripts/check-contrast.ts` (a creer)
**Notes techniques** : Branche `feat/refonte-graphique-RG-03`. Les hex codes des backgrounds light (`#fcfdfd` ou equivalent valide par Claude Design) et dark (`slate-950`) doivent etre integres comme primitives dans `@theme`, pas codes en dur dans les composants. Respecter la nomenclature `--color-*` pour les tokens Tailwind v4 (`@theme`) et `--nom-kebab` pour les variables CSS semantiques. Pas de `any`, pas de tiret cadrant dans les commentaires.

---

#### RG-04 — Echelle typographique et classes utilitaires

**User story** : En tant qu'agent DEV, je veux une echelle typographique tokenisee (display-1 a caption) disponible comme classes Tailwind, afin que tous les composants utilisent des tailles coherentes sans valeurs `text-[64px]` en dur.

**Description** : Ajouter dans `@theme` les tailles de fonte de l'echelle cible (ratio 1.250) : display-1 (64px), display-2 (48px), h1 (36px), h2 (28px), h3 (22px), h4 (18px), body-lg (18px), body (16px), body-sm (14px), code (14px), caption (13px), overline (11px). Ajouter letter-spacing negatif pour les tailles display. Documenter l'echelle dans `docs/epics/2026-04-refonte-graphique/design-tokens.md`.

**Criteres d'acceptation** :
- [ ] Les classes `text-display-1`, `text-display-2`, `text-h1` ... `text-overline` sont disponibles et genereees par Tailwind v4
- [ ] `tracking-display` (-0.02em) est defini comme token
- [ ] Les classes sont utilisees dans au moins un composant de preuve (SectionHeading ou Hero) pour validation visuelle
- [ ] Screenshot du composant de preuve en light et dark fourni dans la PR
- [ ] Aucune valeur `text-[XXpx]` en dur introduite (lint rule ou grep en CI)

**Estimation** : S / 3 points
**Priorite** : P0
**Dependances** : RG-03
**Fichiers concernes** :
- `src/app/globals.css`
- `src/components/ui/SectionHeading.tsx` (composant de preuve)
**Notes techniques** : Branche `feat/refonte-graphique-RG-04`. Dans Tailwind v4, les tailles custom s'ajoutent via `--text-display-1: 4rem` dans `@theme`. Verifier la compatibilite avec la configuration existante (Plus Jakarta Sans via `--font-jakarta`).

---

#### RG-05 — Espacements, rayons de bordure, ombres et animations tokenises

**User story** : En tant qu'agent DEV, je veux que les valeurs d'espacement, de radius, d'ombres et de durations d'animation soient tokenisees, afin d'eliminer les classes arbitraires `rounded-[14px]` ou `shadow-[0_4px_24px_...]` dans les composants.

**Description** : Completer `@theme` avec : une echelle de rayons custom si necessaire (au-dela de ce que Tailwind fournit par defaut), des ombres semantiques (`--shadow-card`, `--shadow-elevated`, `--shadow-focus`), et les durations/easings d'animation (`--duration-instant`, `--duration-fast`, `--duration-base`, `--duration-slow`, `--duration-slower`, easings out/in-out/spring).

**Criteres d'acceptation** :
- [ ] Variables de shadow definies dans `:root` et `.dark` (shadow adapte au theme)
- [ ] Variables de duration d'animation definies : `--duration-instant: 80ms`, `--duration-fast: 150ms`, `--duration-base: 250ms`, `--duration-slow: 400ms`, `--duration-slower: 700ms`
- [ ] Easings definis comme variables CSS : `--ease-out`, `--ease-in-out`, `--ease-spring`
- [ ] Au moins un composant (Card ou Callout) mis a jour pour utiliser `var(--duration-base)` sur sa transition
- [ ] `npm run build` passe

**Estimation** : S / 2 points
**Priorite** : P1
**Dependances** : RG-03
**Fichiers concernes** :
- `src/app/globals.css`
- `src/components/mdx/Card.tsx` (mise a jour de preuve)
**Notes techniques** : Branche `feat/refonte-graphique-RG-05`. Les animations existantes (`border-beam`, `shimmer`, etc.) sont a conserver. Ajouter uniquement les tokens manquants. Ne pas renommer les `@keyframes` existants pour eviter les regressions.

---

### Chantier C2 — Layout et navigation

---

#### RG-06 — Header : glass effect, navigation active, responsive

**User story** : En tant qu'utilisateur, je veux un header au design raffine (fond glass adaptatif, indicateur de page active clair, mobile menu fluide) afin de naviguer confortablement sur tous les appareils.

**Description** : Migrer `Header.tsx` pour utiliser exclusivement les tokens semantiques (plus de `bg-white/90 dark:bg-slate-900/80` en dur). Affiner le style glass avec fallback `@supports not (backdrop-filter)`. Revoir le style de l'item actif dans la navigation primaire et secondaire. Valider le menu mobile (ouverture/fermeture, focus trap, aria).

**Criteres d'acceptation** :
- [ ] Aucun hex code ou valeur arbitraire Tailwind en dur dans `Header.tsx`
- [ ] Fallback sans `backdrop-filter` defini (`@supports not (backdrop-filter: blur())`)
- [ ] Item de navigation actif visuellement distinct (underline ou background token)
- [ ] Menu mobile : focus trap actif, `aria-expanded`, fermeture a `Escape`
- [ ] Screenshots light + dark (desktop + mobile 375px) fournis dans la PR
- [ ] axe-core : 0 violation sur `/fr/` et `/en/`
- [ ] `npm run lint && npm run type-check` passent

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/layout/Header.tsx`
- `src/app/globals.css` (classe `.glass` a mettre a jour)
**Notes techniques** : Branche `feat/refonte-graphique-RG-06`. Verifier les regles SonarQube S3776 (complexite cognitive) sur les handlers keyboard existants. Props en `Readonly<>`. Tester FR + EN apres merge.

---

#### RG-07 — Footer : identite visuelle, liens, copyright

**User story** : En tant qu'utilisateur, je veux un footer coherent avec l'identite graphique du reste du site, avec les liens correctement groupes et le copyright lisible, afin d'avoir une experience complete jusqu'au bas de chaque page.

**Description** : Migrer `Footer.tsx` vers les tokens semantiques. Revoir la hierarchie visuelle des colonnes de liens. Verifier la version affichee par `FooterVersion` et le composant `CopyrightYear`.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur dans `Footer.tsx`, `FooterVersion.tsx`, `CopyrightYear.tsx`
- [ ] Contraste des liens footer >= 4.5:1 sur fond footer (light et dark)
- [ ] Screenshots light + dark fournis
- [ ] Liens externes avec `rel="noopener noreferrer"` et icone externe visible
- [ ] Tests unitaires sur `CopyrightYear` et `FooterVersion` passent

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/layout/Footer.tsx`
- `src/components/layout/FooterVersion.tsx`
- `src/components/ui/CopyrightYear.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-07`. Tester FR + EN.

---

#### RG-08 — Logo et ThemeToggle

**User story** : En tant qu'utilisateur, je veux que le logo et le bouton de bascule de theme soient coherents avec l'identite graphique mise a jour, afin que les elements les plus visibles du site refletent la nouvelle direction.

**Description** : Revoir `Logo.tsx` si le degrade brand→accent doit etre ajuste. Revoir `ThemeToggle.tsx` pour utiliser les tokens d'animation (`--duration-base`, `--ease-out`) et s'assurer que l'icone est correctement labellee.

**Criteres d'acceptation** :
- [ ] Logo : degrade utilise les tokens brand-500 → accent-500 (ou variante validee en C0)
- [ ] ThemeToggle : `aria-label` present et correct en FR et EN, animation via token de duration
- [ ] Aucun hex code en dur dans ces deux composants
- [ ] Screenshots light + dark fournis

**Estimation** : XS / 1 point
**Priorite** : P1
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/layout/Logo.tsx`
- `src/components/layout/ThemeToggle.tsx`
**Notes techniques** : Branche incluse dans `feat/refonte-graphique-RG-06` ou story separee selon volume de diff.

---

#### RG-09 — LanguageSwitcher

**User story** : En tant qu'utilisateur bilingue, je veux que le selecteur de langue soit visiblement coherent avec le reste de la navigation et accessible au clavier, afin de basculer facilement entre FR et EN.

**Description** : Migrer `LanguageSwitcher.tsx` vers les tokens semantiques. Verifier le focus ring, le `aria-current` sur la langue active, et le comportement sur mobile.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur
- [ ] `aria-current="true"` sur la langue active
- [ ] Focus ring visible via token ring (ring-brand-700)
- [ ] Screenshots light + dark fournis
- [ ] Fonctionne sur `/fr/` et sur `/en/`

**Estimation** : XS / 1 point
**Priorite** : P1
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/layout/LanguageSwitcher.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-09`. Tester les routes `/fr/getting-started/` et `/en/getting-started/` apres modification.

---

#### RG-10 — SectionLayout, SectionSidebar et Breadcrumb

**User story** : En tant qu'utilisateur consultant la documentation, je veux une mise en page de section claire et homogene, avec une sidebar et un breadcrumb visuellement alignes avec la nouvelle identite, afin de naviguer dans le contenu sans friction.

**Description** : Migrer `SectionLayout.tsx`, `SectionSidebar.tsx` et `Breadcrumb.tsx` vers les tokens semantiques. Revoir les indicateurs d'item actif dans la sidebar. Verifier que `TableOfContents` et `ScrollToTop` sont coherents.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur dans les 3 composants
- [ ] Item actif dans la sidebar visuellement distinct (fond ou indicateur lateral, token couleur)
- [ ] Breadcrumb : contraste des items >= 4.5:1, separateur aria-hidden
- [ ] TableOfContents : lien actif mis en evidence avec token brand
- [ ] Screenshots light + dark sur une page de section (ex. `/fr/getting-started/installation/`)
- [ ] Tests E2E de navigation sidebar passent (si existants, sinon ajouter)

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/layout/SectionLayout.tsx`
- `src/components/layout/SectionSidebar.tsx`
- `src/components/ui/Breadcrumb.tsx`
- `src/components/ui/TableOfContents.tsx`
- `src/components/ui/ScrollToTop.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-10`. L'`AnalyticsTracker` monte dans `SectionLayout` : verifier qu'il n'introduit pas de style.

---

#### RG-11 — SearchDialog

**User story** : En tant qu'utilisateur, je veux que la modal de recherche soit visuellement integree au nouveau design (fond, bordures, typographie), afin que l'experience de recherche soit coherente avec le reste du site.

**Description** : Migrer `SearchDialog.tsx` vers les tokens semantiques. Verifier le focus trap, la fermeture a `Escape`, et le contraste des resultats.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur
- [ ] Focus trap actif a l'ouverture de la modal
- [ ] Fermeture a `Escape` et au clic outside
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-label` present
- [ ] Contraste du texte des resultats >= 4.5:1
- [ ] Screenshots light + dark de la modal ouverte fournis

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/ui/SearchDialog.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-11`.

---

### Chantier C3 — Composants documentation MDX

---

#### RG-12 — MdxComponents : migration complete vers tokens semantiques

**User story** : En tant qu'agent DEV, je veux que tous les styles inline des balises HTML auto-stylees (`h1`-`h4`, `p`, `ul`, `a`, `blockquote`, `table`, `code`, `pre`) dans `MdxComponents.tsx` utilisent exclusivement les tokens semantiques, afin qu'une mise a jour de theme ne necessite pas de modifier ce fichier.

**Description** : Passer en revue chaque selecteur dans `MdxComponents.tsx` et remplacer toutes les classes `text-slate-*`, `bg-slate-*`, `border-slate-*` codees en dur par des classes tokens ou des variables CSS semantiques.

**Criteres d'acceptation** :
- [ ] Aucune classe Tailwind `*-slate-*`, `*-gray-*`, `*-zinc-*` codee en dur (utiliser les tokens semantiques `text-primary`, `border-subtle`, etc. via `@apply` ou classes custom)
- [ ] Tous les liens `<a>` ont un style focus visible (ring brand)
- [ ] Les `<blockquote>` utilisent un token de border et de fond
- [ ] Les `<table>` ont une alternance de lignes lisible en light et dark
- [ ] Screenshots d'une page MDX riche en light et dark
- [ ] axe-core 0 violation sur une page MDX cible

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/mdx/MdxComponents.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-12`. Ce composant est le registry central — tout changement ici impacte les 196 fichiers MDX. Tests de regression visuelle requis sur au moins 3 pages MDX representant differents types de contenu (guide, reference, article).

---

#### RG-13 — Callout : tokens semantiques et variante "error"

**User story** : En tant qu'auteur de contenu, je veux que les blocs Callout (info, tip, warning) soient visuellement affines avec la nouvelle identite et utilisent des tokens semantiques, afin que leur style soit maintenable et coherent.

**Description** : Migrer `Callout.tsx` vers les tokens composants (`--callout-*-bg`, `--callout-*-border`, `--callout-*-text`) definis en C1. Envisager l'ajout d'une variante `error` si validee par la direction design. Verifier les 83+ usages dans les MDX.

**Criteres d'acceptation** :
- [ ] Les trois variantes (info, tip, warning) utilisent uniquement des tokens semantiques ou composants
- [ ] Aucun `text-slate-600 dark:text-slate-300` en dur dans le composant
- [ ] Icone `aria-hidden="true"` presente (deja le cas, a conserver)
- [ ] `aria-label` sur `<aside>` correct en FR et EN (via `useTranslations`)
- [ ] Screenshots light + dark des 3 variantes dans la PR
- [ ] Test unitaire couvrant les 3 variantes

**Estimation** : S / 2 points
**Priorite** : P0
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/ui/Callout.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-13`. Le composant est `"use client"` a cause de `useTranslations` — pas de changement d'architecture requis.

---

#### RG-14 — CodeBlock : theme adaptatif light/dark

**User story** : En tant qu'utilisateur en mode clair, je veux que les blocs de code affichent un theme de syntaxe lisible sur fond clair (pas toujours dark), afin de ne pas avoir un rectangle sombre qui tranche avec le reste de la page.

**Description** : Remplacer le theme `nightOwl` (always-dark) par une selection dynamique : theme light (ex. `themes.github` ou `themes.vsLight`) en mode light, `themes.nightOwl` en mode dark. Utiliser `useTheme` de `next-themes`. Adapter le conteneur (`bg-slate-950` en dur) pour utiliser le token `--code-bg`.

**Criteres d'acceptation** :
- [ ] En mode light : fond du CodeBlock clair, tokens de syntaxe lisibles (contraste >= 4.5:1)
- [ ] En mode dark : fond sombre conserve, tokens de syntaxe inchanges (nightOwl ou equivalent)
- [ ] Pas de FOUC lors du changement de theme (hydration correcte avec `suppressHydrationWarning` si necessaire)
- [ ] Le fond et la bordure du conteneur utilisent les tokens `--code-bg` et `--border-subtle`
- [ ] Test sur les 5 langages principaux : bash, typescript, tsx, json, yaml
- [ ] Screenshots light + dark dans la PR
- [ ] Test unitaire mis a jour

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : RG-03, RG-05
**Fichiers concernes** :
- `src/components/ui/CodeBlock.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-14`. `useTheme` retourne `undefined` cote serveur : utiliser `mounted` state ou `suppressHydrationWarning` sur le conteneur pour eviter le FOUC. Verifier que `prism-react-renderer` v2 expose bien les themes light.

---

#### RG-15 — Steps et Tabs : badges gradient et animations layout

**User story** : En tant qu'utilisateur consultant un guide, je veux que les composants Steps (numerotation en badge) et Tabs (onglets) aient un style raffine et anime, afin que la lecture des tutoriels soit agreable et moderne.

**Description** : Migrer `Steps.tsx` et `Tabs.tsx` vers les tokens semantiques. Ajouter un badge numerote avec degrade brand pour Steps. Ajouter une animation de transition de contenu (opacity + translateY via tokens de duration) sur Tabs.

**Criteres d'acceptation** :
- [ ] Steps : badge numerote utilise le degrade `--gradient-brand` ou tokens brand, aucun hex en dur
- [ ] Tabs : transition de contenu anime via `--duration-fast` et `--ease-out`
- [ ] Onglet actif visuellement distinct (indicateur bas ou fond), token couleur
- [ ] `role="tablist"`, `role="tab"`, `role="tabpanel"` presents et corrects
- [ ] Navigation clavier Tabs : `ArrowLeft`/`ArrowRight` entre onglets
- [ ] Screenshots light + dark pour Steps et Tabs

**Estimation** : M / 5 points
**Priorite** : P1
**Dependances** : RG-03, RG-05
**Fichiers concernes** :
- `src/components/mdx/Steps.tsx` (et `Step.tsx` si separe)
- `src/components/mdx/Tabs.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-15`. Verifier que les usages MDX existants (`<Steps>`, `<Tabs>`) ne requierent pas de mise a jour de syntaxe.

---

#### RG-16 — Card MDX : variantes et hover

**User story** : En tant qu'auteur de contenu, je veux que les cartes MDX aient un hover subtil et des variantes visuellement distinctes via les tokens, afin d'enrichir la presentation du contenu.

**Description** : Migrer `Card.tsx` (composant MDX) vers les tokens semantiques. Ajouter une transition hover `translate-y-[-1px]` et un ajustement de shadow via `--shadow-card`. Verifier les 30+ usages.

**Criteres d'acceptation** :
- [ ] Variantes `default`, `accent`, `highlight` utilisent uniquement des tokens (plus de `border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800` en dur)
- [ ] Hover : `translate-y-[-1px]` via `--duration-fast`
- [ ] `border-radius` via token ou classe Tailwind standard
- [ ] Screenshots light + dark des 3 variantes

**Estimation** : S / 2 points
**Priorite** : P1
**Dependances** : RG-03, RG-05
**Fichiers concernes** :
- `src/components/mdx/Card.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-16`.

---

#### RG-31 — Badges thématiques d'articles (ThemeBadges)

**User story** : En tant que lecteur arrivant sur un article, je veux voir 1 à 3 badges visuels qui indiquent le type de contenu et le ou les domaines couverts, afin de juger rapidement si l'article correspond à mon besoin.

**Description** : Introduire un système de badges thématiques pour les articles MDX, avec deux dimensions complémentaires :

- **Type de contenu** (1 badge obligatoire) : `tutorial` (Tutoriel), `guide` (Guide), `reference` (Référence), `comparison` (Comparatif), `use-case` (Cas d'usage)
- **Domaine** (0 à 2 badges optionnels) : `security` (Sécurité, rouge), `devsecops` (DevSecOps, violet), `architecture` (Architecture, bleu), `performance` (Performance, ambre), `tooling` (Outils, cyan), `productivity` (Productivité, vert), `migration` (Migration, slate)

Implémentation :
1. Créer `src/lib/themes.ts` avec un registre `THEME_REGISTRY` qui mappe chaque clé thème vers `{ labelFr, labelEn, color, icon }` (icône Lucide React).
2. Étendre le frontmatter MDX avec un champ optionnel `themes: string[]` (validation : au moins 1 entrée si présent, max 3, au moins un type de contenu). Mettre à jour la validation dans `src/lib/mdx.ts`.
3. Créer le composant `src/components/ui/ThemeBadges.tsx` qui affiche les badges en pills 11-12px (couleur + icône + label localisé selon `useLocale`).
4. Intégrer `ThemeBadges` dans le layout d'article (sous le titre `h1`, au-dessus du lead).
5. Migrer progressivement les articles MDX existants : ajouter `themes` à au moins 5 articles cornerstone par section (getting-started, mcp, skills, prompting, agents) — les autres restent sans badges (rétro-compatible).
6. Ajouter le champ `themes` à la documentation contributeur dans `CLAUDE.md`.

**Criteres d'acceptation** :
- [ ] `src/lib/themes.ts` contient les 12 thèmes documentés ci-dessus avec couleur sémantique mappée sur les tokens
- [ ] `ThemeBadges` rend correctement 1, 2, ou 3 badges en light + dark
- [ ] Frontmatter `themes` validé au build : refus de build si `themes` contient une clé inconnue ou plus de 3 entrées
- [ ] Composant traduit FR/EN via `next-intl`, labels stockés dans `messages/fr.json` et `messages/en.json` (namespace `themes`)
- [ ] Au moins 5 articles cornerstone migrés avec `themes` (1 par section principale)
- [ ] Tests unitaires : `ThemeBadges` rend 0 badge si `themes` absent (graceful fallback), valide les contraintes
- [ ] Aucun `any` TypeScript, props `Readonly<>`
- [ ] Screenshots light + dark des badges sur un article migré
- [ ] Section dédiée dans `CLAUDE.md` documentant le système de thèmes pour les futurs auteurs

**Estimation** : M / 5 points
**Priorite** : P1
**Dependances** : RG-03 (tokens), RG-12 (MdxComponents)
**Fichiers concernes** :
- `src/lib/themes.ts` (nouveau)
- `src/components/ui/ThemeBadges.tsx` (nouveau)
- `src/lib/mdx.ts` (validation frontmatter)
- `src/components/layout/SectionSlugContent.tsx` (ou layout équivalent qui rend l'article)
- `messages/fr.json` et `messages/en.json` (namespace `themes`)
- `CLAUDE.md` (documentation auteur)
- 5+ fichiers MDX cornerstone (1 par section principale)
**Notes techniques** : Branche `feat/refonte-graphique-RG-31`. Le composant `ThemeBadges` doit accepter une prop `compact?: boolean` pour usage dans les listings d'articles (cards plus denses). Couleurs des badges : utiliser les variables sémantiques du tier 3 (`--color-error`, `--color-success`, etc.) et non des hex en dur. Cas particulier : `devsecops` n'a pas de token sémantique direct, créer `--theme-devsecops: var(--color-violet-500)` (à ajouter dans `globals.css` lors de cette story). Tester FR + EN sur un article migré.

---

### Chantier C4 — Composants editoriaux et landing

---

#### RG-17 — SectionHeading et FeatureCard

**User story** : En tant qu'utilisateur decouvrant une section, je veux que les titres de section et les cartes de fonctionnalites aient un style display raffine, afin que l'entree dans chaque guide soit visuellement engageante.

**Description** : Migrer `SectionHeading.tsx` et `FeatureCard.tsx` vers les tokens de typographie (display-2, h2), les tokens de couleur semantiques, et la shadow card. Ajouter le hover `-translate-y-1` sur `FeatureCard`.

**Criteres d'acceptation** :
- [ ] `SectionHeading` utilise `text-display-2` ou `text-h1` selon le contexte, via tokens
- [ ] `FeatureCard` : hover translate et shadow via tokens, aucun hex en dur
- [ ] Screenshots light + dark fournis
- [ ] Tests unitaires passes

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : RG-03, RG-04
**Fichiers concernes** :
- `src/components/ui/SectionHeading.tsx`
- `src/components/ui/FeatureCard.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-17`.

---

#### RG-18 — Landing page : Hero split, halos, CTA, grille

**User story** : En tant que visiteur arrivant sur le site, je veux une landing page avec un hero moderne (layout split texte gauche + terminal animé droite, halos cyan/ambre, typographie display) alignée sur la direction visuelle validée en C0, afin d'être convaincu de l'intérêt du site en 5 secondes.

**Description** : Appliquer les tokens et le design validé en C0 sur la landing page (`app/[locale]/(landing)/page.tsx` ou équivalent). Variante hero retenue : **split uniquement** (texte gauche, terminal animé droite, grille `1.05fr 1fr` gap 64, padding `72px 32px`). Halos flous derrière le hero via des divs positionnées avec les tokens couleur, grille de fond subtile, typographie display-1 pour le titre principal. Boutons CTA avec styles tokenisés. Vérifier les animations existantes (`BorderBeam`, `AnimatedBeam`, etc.) avec les nouveaux tokens de duration. Les variantes xxl et inline ne sont pas dans le scope de cette story (reportées au backlog futur).

**Criteres d'acceptation** :
- [ ] Layout hero : grille split `1.05fr 1fr`, texte à gauche, terminal à droite — uniquement cette disposition
- [ ] Titre hero utilise `text-display-1` (clamp 44px → 76px) avec `tracking-display` (`-0.03em`)
- [ ] Halos (pseudo-elements ou divs) utilisent les tokens `--gradient-hero-radial-1` / `--gradient-hero-radial-2`
- [ ] CTA primaire et secondaire : styles via tokens semantiques, hover via `--duration-fast`
- [ ] `HeroTerminal` ou `TerminalScreenshot` : fond et bordure via tokens `--terminal-bg` et `--terminal-border`
- [ ] Lighthouse Performance >= 90 sur la landing apres modification
- [ ] CLS < 0.05 mesure
- [ ] Screenshots light + dark (viewport 1440px et 375px)
- [ ] axe-core 0 violation
- [ ] Aucune référence aux variantes xxl ou inline dans le code livré

**Estimation** : L / 8 points
**Priorite** : P0
**Dependances** : RG-03, RG-04, RG-05
**Fichiers concernes** :
- `src/app/[locale]/(landing)/page.tsx` (ou equivalent)
- `src/components/ui/TerminalScreenshot.tsx`
- Composants animation landing (BorderBeam, AnimatedBeam si presents dans `src/components/ui/`)
- `src/app/globals.css` (tokens hero)
**Notes techniques** : Branche `feat/refonte-graphique-RG-18`. Tester sur `/fr/` ET `/en/`. Mettre a jour `dateModified` dans le frontmatter si applicable et `lastModified` dans `lib/metadata.ts`.

---

#### RG-19 — Cartes editoriales : AudienceCard, PathCard, TestimonialCard

**User story** : En tant que visiteur de la landing page, je veux que les cartes destinees aux differentes audiences et aux parcours d'apprentissage soient visuellement soignees et coherentes, afin de trouver rapidement le contenu adapte a mon profil.

**Description** : Migrer `AudienceCard.tsx`, `PathCard.tsx`, et `TestimonialCard.tsx` (si present) vers les tokens semantiques. Hover unife avec le pattern `-translate-y-1 shadow-card`.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur dans les 3 composants
- [ ] Hover uniforme : `translate-y-[-4px]` ou `translate-y-[-1px]` via token de duration
- [ ] Screenshots light + dark pour chaque carte
- [ ] Tests unitaires passes

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : RG-03, RG-05
**Fichiers concernes** :
- `src/components/ui/AudienceCard.tsx`
- `src/components/ui/PathCard.tsx`
- `src/components/ui/TestimonialCard.tsx` (si present)
**Notes techniques** : Branche `feat/refonte-graphique-RG-19`. Si `TestimonialCard` n'existe pas encore, ne pas le creer dans cette story (hors scope).

---

#### RG-20 — ComparisonTable, PricingTable, ConfiguratorTeaser

**User story** : En tant qu'utilisateur evaluant Claude Code, je veux que les tableaux de comparaison, les tableaux de pricing et le teaser du configurateur aient un design clair et tokenise, afin de prendre une decision informee.

**Description** : Migrer ces composants vers les tokens semantiques. Verifier les contrastes sur les cellules de tableau alternees.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur
- [ ] Alternance de lignes dans les tableaux via token `--surface-2` / `--surface-1`
- [ ] Screenshots light + dark

**Estimation** : S / 3 points
**Priorite** : P2
**Dependances** : RG-03
**Fichiers concernes** :
- `src/components/ui/ComparisonTable.tsx` (si present)
- `src/components/ui/PricingTable.tsx` (si present)
- `src/components/ui/ConfiguratorTeaser.tsx` (si present)
**Notes techniques** : Branche `feat/refonte-graphique-RG-20`. Si certains composants n'existent pas, ignorer. Signaler dans la PR.

---

#### RG-21 — Composants d'animation proprietaires (BorderBeam, AnimatedBeam, etc.)

**User story** : En tant qu'agent DEV, je veux que les composants d'animation proprietaires de la landing utilisent les tokens de duration et de couleur, afin que leur ajustement futur soit centralise.

**Description** : Parcourir tous les composants d'animation dans `src/components/ui/` (BorderBeam, AnimatedBeam, GradientShimmer, etc.) et remplacer les valeurs de duration et de couleur codees en dur par les tokens definis en C1.

**Criteres d'acceptation** :
- [ ] Chaque composant d'animation utilise `var(--duration-*)` pour ses transitions
- [ ] Les couleurs d'animation utilisent des tokens brand ou accent
- [ ] `prefers-reduced-motion` respecte (animation arretee ou simplifiee)
- [ ] Aucun hex code en dur

**Estimation** : S / 3 points
**Priorite** : P2
**Dependances** : RG-03, RG-05
**Fichiers concernes** :
- `src/components/ui/BorderBeam.tsx` (si present)
- `src/components/ui/AnimatedBeam.tsx` (si present)
- Autres composants d'animation dans `src/components/ui/`
**Notes techniques** : Branche `feat/refonte-graphique-RG-21`. Ne pas modifier la logique d'animation, uniquement les valeurs de style.

---

#### RG-32 — Sections "data" landing : Codex en chiffres et Articles récents

**User story** : En tant que visiteur de la landing page, je veux voir des chiffres factuels sur le contenu disponible et les 3 derniers articles publiés, afin de mesurer l'activité du projet sans subir de vanity metrics.

**Description** : Remplacer la stats band générique du design source (qui contenait des KPIs creux type "10K+ devs") par deux sections honnêtes et auto-mises à jour au build :

**1. Composant `CodexStatsBand`** (substitut direct de la stats band visuelle du design)
- Compte automatiquement au build via `src/lib/mdx.ts` :
  - Nombre d'articles publiés (FR + EN dédupliqués sur le slug)
  - Nombre de sections (10 actuellement)
  - Nombre de langues (2 : FR + EN)
  - Date de dernière mise à jour (max des `dateModified` MDX, formaté localement)
- Style visuel : bande sombre `#0f172a` (light) / `#0a0e1a` (dark), grid 4 colonnes, valeurs en `clamp(36px, 4.5vw, 56px)` weight 800 tabular-nums, label mono 13px muted
- Halos cyan/ambre latéraux conformes au design source (`landing.css` `.lp-stats::before`)
- En cas d'erreur de comptage, fallback gracieux (cacher la section plutôt qu'afficher des "0 articles")

**2. Composant `RecentArticlesSection`** (sous la stats band ou au choix de l'IA, à valider visuellement)
- Récupère au build les 3 derniers articles par `dateModified` décroissant, toutes sections confondues
- Affichage : layout "À la une + 2" du design source (`.lp-articles-grid` avec `1.6fr 1fr`)
  - Article hero (1) : grand visuel gradient, catégorie pulsante, titre 28px, lead 16px, auteur + temps de lecture
  - Articles small (2) : empilés à droite, indicateur top 3px gradient, titre 19px
- Filtres par section désactivés dans cette story (la version filtrée du design est reportée au backlog si demande)
- Si moins de 3 articles disponibles (édition initiale), afficher uniquement ceux qui existent ou cacher la section

**Note importante sur le placement** : ces deux sections viennent COMPLÉTER la landing page produite en RG-18 (qui se concentrait sur le hero). RG-32 traite la moitié inférieure de la landing.

**Criteres d'acceptation** :
- [ ] `CodexStatsBand` affiche 4 chiffres factuels calculés au build, jamais codés en dur
- [ ] Test unitaire vérifie que le composant lit correctement `getAllMdxFiles()` et dédoublonne par slug
- [ ] `RecentArticlesSection` affiche les 3 derniers articles MDX par `dateModified`
- [ ] Les liens d'articles mènent à la bonne route locale (`/fr/{section}/{slug}` ou `/en/{section}/{slug}`)
- [ ] Layout responsive : 4 cols → 2 cols mobile pour stats ; "1.6fr 1fr" → 1 col mobile pour articles
- [ ] Aucun hex en dur dans les deux composants ; halos via tokens `--gradient-stats-glow-1` et `--gradient-stats-glow-2`
- [ ] Screenshots light + dark sur 1440px et 375px
- [ ] Lighthouse Performance et CLS inchangés ou meilleurs sur la landing après ajout
- [ ] Tests E2E : la stats band s'affiche, les liens articles cliquent et naviguent
- [ ] axe-core 0 violation
- [ ] Vérification FR + EN : nombre d'articles compté correctement par locale (un article FR + son équivalent EN comptent comme 1)

**Estimation** : M / 5 points
**Priorite** : P1
**Dependances** : RG-03 (tokens), RG-18 (hero landing déjà en place), RG-19 (cartes éditoriales pour réutiliser le pattern), RG-31 (badges affichables sur les articles récents si présents)
**Fichiers concernes** :
- `src/components/ui/CodexStatsBand.tsx` (nouveau)
- `src/components/ui/RecentArticlesSection.tsx` (nouveau)
- `src/lib/mdx.ts` : ajouter helpers `countAllArticles()`, `getMostRecentArticles(n)`, `getLastModifiedDate()` (avec memoization au build)
- `src/app/[locale]/page.tsx` (intégration dans la landing)
- `src/app/globals.css` : ajout tokens `--gradient-stats-glow-1`, `--gradient-stats-glow-2`
- `messages/fr.json` et `messages/en.json` (namespace `landing.stats` et `landing.recent`)
**Notes techniques** : Branche `feat/refonte-graphique-RG-32`. La stats band est explicitement factuelle sur décision utilisateur (D3) : aucun chiffre relatif aux utilisateurs, aux étoiles GitHub, ou au trafic. Si l'utilisateur valide ultérieurement une métrique vanity (ex : Stars GitHub via API au build), une story dédiée sera ouverte hors de cette epic. Le composant doit être SSG-compatible : tous les calculs au build, aucune query runtime.

---

### Chantier C5 — Pages speciales

---

#### RG-22 — Page 404 et NotFoundAnimation

**User story** : En tant qu'utilisateur tombant sur une URL incorrecte, je veux une page 404 coherente avec la nouvelle identite visuelle, afin que meme les erreurs refletent la qualite du site.

**Description** : Migrer la page 404 et le composant `NotFoundAnimation` (3D ou CSS) vers les tokens semantiques. Verifier que l'animation respecte `prefers-reduced-motion`.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur dans la page 404 et ses composants
- [ ] Animation : arretee ou simplifiee si `prefers-reduced-motion`
- [ ] Lien retour vers la home fonctionne en FR et EN
- [ ] Screenshots light + dark
- [ ] axe-core 0 violation

**Estimation** : S / 2 points
**Priorite** : P1
**Dependances** : RG-03
**Fichiers concernes** :
- `src/app/[locale]/not-found.tsx` ou `src/app/not-found.tsx`
- Composant `NotFoundAnimation` (chemin a verifier)
**Notes techniques** : Branche `feat/refonte-graphique-RG-22`. Verifier le lien de retour avec la locale correcte.

---

#### RG-23 — Configurator Wizard

**User story** : En tant qu'utilisateur utilisant le configurateur, je veux une interface de wizard visuellement coherente avec le reste du site, avec des etapes claires et des CTA distincts, afin de generer ma configuration sans friction.

**Description** : Migrer `ConfiguratorWizard.tsx` et ses sous-composants vers les tokens semantiques. Revoir les indicateurs d'etapes, les boutons de navigation, et le bloc de preview.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur dans le wizard et ses sous-composants
- [ ] Indicateurs d'etapes : actif, complete, a venir — trois styles tokenises distincts
- [ ] Boutons "Suivant" / "Precedent" : styles via tokens
- [ ] Preview de configuration : fond et bordure via tokens `--code-bg`
- [ ] Screenshots light + dark des etapes 1 et 4 (premiere et derniere)
- [ ] Tests E2E du flux complet (start → step 4 → complete) passent
- [ ] axe-core 0 violation

**Estimation** : M / 5 points
**Priorite** : P1
**Dependances** : RG-03, RG-14
**Fichiers concernes** :
- `src/components/ui/ConfiguratorWizard.tsx` (ou composants equivalents dans `src/app/[locale]/configurator/`)
**Notes techniques** : Branche `feat/refonte-graphique-RG-23`. Les evenements analytics (`configurator_start`, `configurator_step`, `configurator_complete`) doivent rester fonctionnels. Tester sur `/fr/configurator/` et `/en/configurator/`.

---

#### RG-24 — Pages /future, /about, /glossary, /personas, /limits

**User story** : En tant qu'utilisateur consultant les pages editoriales secondaires, je veux qu'elles soient visuellement coherentes avec la nouvelle identite, afin que l'experience soit uniforme sur tout le site.

**Description** : Verifier et mettre a jour les pages speciales qui ont leur propre mise en page (components ou styles propres) : `/future`, `/about`, `/glossary` (avec `GlossaryTooltip`), `/personas`, `/limits`. Migrer les valeurs codees en dur vers les tokens.

**Criteres d'acceptation** :
- [ ] Aucun hex code en dur dans les composants specifiques a ces pages
- [ ] `GlossaryTooltip` utilise les tokens de surface et de texte
- [ ] `KeyboardShortcut` utilise les tokens `--code-bg` et `--code-text`
- [ ] Screenshots light + dark pour chaque page
- [ ] FR + EN verifies

**Estimation** : M / 5 points
**Priorite** : P2
**Dependances** : RG-03, RG-12
**Fichiers concernes** :
- Pages dans `src/app/[locale]/future/`, `/about/`, `/glossary/`, `/personas/`, `/limits/`
- `src/components/ui/GlossaryTooltip.tsx`
- `src/components/ui/KeyboardShortcut.tsx`
**Notes techniques** : Branche `feat/refonte-graphique-RG-24`.

---

### Chantier C6 — QA et polish transverse

---

#### RG-25 — Tests de regression visuelle Playwright

**User story** : En tant qu'agent QA, je veux des tests de regression visuelle automatises sur les pages et composants cles, afin de detecter toute regression visuelle involontaire avant merge.

**Description** : Configurer Playwright Visual Comparisons (screenshots baseline) sur 10 routes cles, en light et dark. Integrer ces tests dans la CI.

**Criteres d'acceptation** :
- [ ] Screenshots baseline generes pour 10 routes : `/fr/`, `/en/`, `/fr/getting-started/`, `/fr/mcp/`, `/fr/prompting/`, `/fr/configurator/`, `/fr/glossary/`, `/fr/about/`, `/fr/future/`, `/fr/getting-started/installation/` (ou equivalent)
- [ ] Chaque route testee en light et dark (20 screenshots au total)
- [ ] Les tests echouent si un diff > 0.1% est detecte
- [ ] Integration CI (GitHub Actions ou equivalent)
- [ ] Documentation dans `docs/epics/2026-04-refonte-graphique/qa/visual-regression.md`

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : C2 + C3 (composants stables avant baseline)
**Fichiers concernes** :
- `tests/visual/` (a creer)
- `playwright.config.ts` (mise a jour)
**Notes techniques** : Branche `feat/refonte-graphique-RG-25`. Utiliser `@playwright/test` deja probablement present. Les baselines doivent etre commitees dans le repo.

---

#### RG-26 — Audit axe-core et conformite WCAG AA

**User story** : En tant qu'agent QA, je veux un audit axe-core automatise sur 10 routes cles, afin de certifier 0 violation WCAG AA avant la mise en production de la refonte.

**Description** : Integrer `@axe-core/playwright` dans la suite de tests. Lancer l'audit sur les 10 routes cibles en light et dark. Corriger toutes les violations detectees.

**Criteres d'acceptation** :
- [ ] 0 violation axe-core de severite `critical` ou `serious` sur les 10 routes
- [ ] Rapport HTML genere dans `docs/epics/2026-04-refonte-graphique/qa/axe-report.html`
- [ ] Tests integres dans la CI (bloquants)
- [ ] Toutes les corrections effectuees et documentees

**Estimation** : M / 5 points
**Priorite** : P0
**Dependances** : C2 + C3 + C4
**Fichiers concernes** :
- `tests/a11y/` (a creer ou a completer)
- Composants corriges selon rapport
**Notes techniques** : Branche `feat/refonte-graphique-RG-26`. Focus particulier sur : contrastes des tokens semantiques, labels des icones, focus management des modales (SearchDialog, menu mobile).

---

#### RG-27 — Audit Lighthouse et bundle

**User story** : En tant qu'agent QA, je veux verifier que la refonte n'a pas degrade les scores Lighthouse ni augmente le bundle, afin de garantir la performance du site.

**Description** : Lancer Lighthouse sur les 5 routes de la baseline (RG-02) et comparer avec les scores initiaux. Auditer le bundle `next build` (FirstLoad). Optimiser si necessaire.

**Criteres d'acceptation** :
- [ ] Scores Lighthouse >= 90 sur les 4 metriques (Performance, Accessibility, Best Practices, SEO) pour les 5 routes
- [ ] CLS < 0.05 sur toutes les routes
- [ ] Bundle FirstLoad < 200 ko gzip (verifiable dans la sortie de `next build`)
- [ ] Rapport de comparaison baseline vs post-refonte dans `docs/epics/2026-04-refonte-graphique/qa/lighthouse-comparison.md`

**Estimation** : S / 2 points
**Priorite** : P0
**Dependances** : C2 + C3 + C4 + C5
**Fichiers concernes** :
- `docs/epics/2026-04-refonte-graphique/qa/lighthouse-comparison.md` (a creer)
**Notes techniques** : Branche `feat/refonte-graphique-RG-27`. Si le bundle depasse 200 ko, identifier les causes (nouvelle police, nouveau composant lourd) et optimiser avec `dynamic()` ou purge de CSS.

---

#### RG-28 — Mise a jour OG images, favicon, manifest et llms.txt

**User story** : En tant que responsable du site, je veux que les surfaces hors-DOM (og:image, favicon, manifest, llms.txt) soient coherentes avec la nouvelle identite visuelle, afin que le site soit reconnaissable sur les reseaux sociaux, les onglets de navigateur et dans les index IA.

**Description** : Creer de nouvelles OG images (`public/og/og-default.png` et variants par section) alignees avec la nouvelle palette. Mettre a jour le favicon SVG si le degrade a ete ajuste. Verifier le `manifest.json` (theme_color). Regenerer `llms.txt` et `llms-full.txt` via `npm run build:llms`.

**Criteres d'acceptation** :
- [ ] `public/og/og-default.png` : nouvelle image 1200x630px alignee avec la nouvelle identite
- [ ] Favicon SVG (`app/icon.svg`) : degrade brand→accent mis a jour si change
- [ ] `manifest.json` : `theme_color` mis a jour avec la couleur brand principale
- [ ] `npm run build:llms` tourne sans erreur et genere `public/llms.txt` et `public/llms-full.txt` a jour
- [ ] Test d'apercu OG sur au moins une URL (outil de debug OG)

**Estimation** : S / 3 points
**Priorite** : P1
**Dependances** : RG-03 (palette finalisee)
**Fichiers concernes** :
- `public/og/og-default.png`
- `src/app/icon.svg`
- `public/manifest.json` (si present)
- `scripts/generate-llms-txt.ts`
**Notes techniques** : Branche `feat/refonte-graphique-RG-28`. Les OG images peuvent etre generees via un script Node ou creees manuellement. Si un script de generation existe, le mettre a jour avec les nouveaux tokens de couleur.

---

#### RG-29 — Script CI de validation des hex codes hors tokens

**User story** : En tant qu'agent DevOps, je veux un script CI qui echoue si un hex code est detecte hors des tokens definis dans `@theme`, afin d'eviter toute regression post-refonte.

**Description** : Formaliser et integrer le script `check-hardcoded-colors.sh` cree en RG-02 dans la pipeline CI. Le script doit exclure `@theme` (seul endroit autorise pour les primitives) et retourner exit code 1 si des hex codes sont trouves ailleurs.

**Criteres d'acceptation** :
- [ ] Script `scripts/check-hardcoded-colors.sh` (ou `.ts`) integre dans `npm run lint` ou comme etape CI separee
- [ ] Le script exclut correctement le bloc `@theme` dans `globals.css`
- [ ] Le script exclut `node_modules/`, `.next/`, `public/`, `docs/`
- [ ] Exit code 0 si 0 hex hors tokens, exit code 1 sinon
- [ ] Documentation dans `scripts/README.md` (ou section dans le CLAUDE.md projet si pertinent)

**Estimation** : XS / 1 point
**Priorite** : P0
**Dependances** : RG-02, C1 complete
**Fichiers concernes** :
- `scripts/check-hardcoded-colors.sh`
- `.github/workflows/` (CI)
**Notes techniques** : Branche `feat/refonte-graphique-RG-29`. Ce script est la garantie permanente de non-regression post-refonte.

---

#### RG-30 — Recette croisee FR + EN et mise a jour des dates sitemap

**User story** : En tant que Product Owner, je veux une recette manuelle + automatisee sur 5 routes cles en FR et EN, et une mise a jour de toutes les dates `dateModified` / `lastModified`, afin que la refonte soit officiellement validee et que le sitemap soit a jour.

**Description** : Navigation manuelle sur `/fr/` et `/en/` pour chaque chantier fusionne. Verification que le `LanguageSwitcher` bascule correctement. Mise a jour de `dateModified` dans les frontmatters MDX modifies et de `lastModified` dans `lib/metadata.ts` pour toutes les pages impactees.

**Criteres d'acceptation** :
- [ ] Checklist de recette completee et signee dans `docs/epics/2026-04-refonte-graphique/qa/recette-FR-EN.md`
- [ ] 5 routes verifiees en FR + EN : `/`, `/getting-started/`, `/mcp/`, `/configurator/`, `/glossary/`
- [ ] `dateModified` mis a jour dans le frontmatter de chaque fichier MDX visuellement modifie
- [ ] `lastModified` mis a jour dans `SITE_PAGES` de `lib/metadata.ts` pour toutes les pages impactees
- [ ] Sitemap genere sans erreur (`npm run build`)
- [ ] Build Docker final < 50 MB (`docker build -t claude-code-guide . && docker image ls claude-code-guide`)

**Estimation** : S / 2 points
**Priorite** : P0
**Dependances** : tous les chantiers C1-C5 fusionnes dans `develop`
**Fichiers concernes** :
- `lib/metadata.ts`
- Fichiers MDX modifies (leurs frontmatters)
- `docs/epics/2026-04-refonte-graphique/qa/recette-FR-EN.md` (a creer)
**Notes techniques** : Branche `feat/refonte-graphique-RG-30`. Ne mettre a jour `dateModified` que pour les pages dont le contenu visible a change (textes, titres). Pas de mise a jour pour des changements purement techniques (classes CSS, tokens).

---

## 7. Definition of Ready (par story)

Avant qu'une story entre en sprint, elle doit satisfaire :

- [ ] Les criteres d'acceptation sont explicites, mesurables et testables
- [ ] La maquette ou l'hypothese design correspondante est validee (C0 prerequis pour C1+)
- [ ] Les dependances sont toutes au statut "Done" ou "In Progress" avec sortie connue
- [ ] L'estimation en points est renseignee
- [ ] Les fichiers concernes sont identifies avec chemins absolus
- [ ] La branche Git cible est nommee (`feat/refonte-graphique-RG-XX`)

---

## 8. Definition of Done (transverse epic)

Chaque story est "Done" quand :

- [ ] Le code passe `npm run lint && npm run type-check`
- [ ] Les tests unitaires passent (`npm run test`)
- [ ] La couverture de tests ne descend pas sous 80% de lignes et 80% de branches
- [ ] SonarQube Quality Gate OK : 0 bug, 0 code smell BLOCKER/CRITICAL, 0 hotspot de securite ouvert, 0 `any` TypeScript
- [ ] 0 hex code hors tokens (`scripts/check-hardcoded-colors.sh` retourne exit 0)
- [ ] Screenshots dark + light fournis dans la PR (au minimum desktop 1440px)
- [ ] axe-core 0 violation de severite critical/serious sur les routes impactees
- [ ] La PR est creee depuis `feat/refonte-graphique-RG-XX` vers `develop` (jamais vers `main`)
- [ ] Verification manuelle effectuee sur `/fr/` et `/en/` pour les routes impactees
- [ ] `dateModified` et `lastModified` mis a jour si le contenu visible a change
- [ ] Build Docker OK (`docker build` sans erreur, image < 50 MB)
- [ ] `llms.txt` regenere si des fichiers MDX ou pages ont ete modifies (`npm run build:llms`)
- [ ] Aucun tiret cadrant ni tic de langage IA dans les textes eventuellement modifies (regle "ecriture humaine")

L'epic entier est "Done" quand :

- [ ] Tous les chantiers C0-C6 sont fusionnes dans `develop`
- [ ] Le scan SonarQube sur `develop` est au vert
- [ ] Les tests de regression visuelle sont au vert (baselines validees)
- [ ] Lighthouse >= 90 sur les 5 routes cles
- [ ] Recette FR + EN signee (RG-30)
- [ ] La branche `develop` est fusionnee dans `main` via PR etiquetee `chore(release): 1.7.0`
- [ ] Le CHANGELOG est mis a jour

---

## 9. Plan de release

**Feature flag** : non applicable. La refonte est visuelle et sans impact fonctionnel — chaque chantier est mergeable independamment dans `develop` sans risque de breaking change.

**Rollout par chantier** :

1. Chaque story fusionne dans `develop` apres validation (PR individuelle)
2. Une fois C6 valide, `develop` est fusionne dans `main` via PR de release
3. Le tag de version est `1.7.0` (refonte graphique majeure)

**Communication utilisateur** :

- Entree de changelog `1.7.0` dans le fichier `CHANGELOG.md` (ou equivalent) : description de la refonte, liste des chantiers, ameliorations de performance et d'accessibilite
- Pas de notification push ni de banniere in-app (hors scope)

---

## 10. Ressources

- **Design source** : https://api.anthropic.com/v1/design/h/2yEee477ZCPcglTV-5P65g (auth navigateur requise — exporter les assets en C0)
- **CLAUDE.md projet** : `/home/tellebma/DEV/how_to_use_claude/CLAUDE.md`
- **Navigation** : `src/lib/section-navigation.ts`
- **Metadata et sitemap** : `src/lib/metadata.ts`
- **Tokens actuels** : `src/app/globals.css`
- **Inspiration design** : Vercel (vercel.com), Linear (linear.app), Stripe (stripe.com) — a confirmer avec la source Claude Design
- **Conventions de commit** : Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `test:`, `chore:`)
- **SonarQube** : cf. `sonar-project.properties` et procedure dans `docs/memory/reference_sonarqube_scan.md`
- **Workflow Git** : feature branch `feat/refonte-graphique-RG-XX` → PR → `develop` → (apres recette) `main`
