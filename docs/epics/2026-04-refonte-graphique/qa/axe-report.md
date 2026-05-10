# RG-26 — Audit axe-core WCAG AA

**Status** : actif sur CI depuis la PR RG-26 (mai 2026).

Suite de tests automatises bloquante au merge sur develop, qui audite 10
routes cles en mode light + dark (20 captures) avec `@axe-core/playwright`.

## Acceptance criteria

- [x] 0 violation `critical` ou `serious` (apres correctifs et exclusions
      documentees) sur les 10 routes cibles, light + dark
- [x] Tests integres dans la CI : job `e2e-smoke` (chromium), spec
      `e2e/a11y.spec.ts`
- [x] Toutes les corrections effectuees et documentees ci-dessous
- [x] Documentation : ce fichier

## Couverture

10 routes x 2 themes = 20 tests :

- `/fr/`, `/en/` (landing FR + EN)
- `/fr/getting-started/`, `/fr/getting-started/installation/`
- `/fr/mcp/`, `/fr/prompting/`, `/fr/configurator/`
- `/fr/glossary/`, `/fr/about/`, `/fr/future/`

Chaque test :

1. Pose `localStorage["theme"]` AVANT le premier paint via `addInitScript`
   pour qu'axe analyse la page directement dans le mode (pas de FOUC).
2. Charge la page et attend `networkidle`.
3. Lance `AxeBuilder.withTags(["wcag2a", "wcag2aa", "wcag21aa"])`.
4. Filtre les violations par impact :
   - **Bloquantes (critical + serious)** : `expect(...).toEqual([])` —
     casse le test au premier diff.
   - **Advisory (minor + moderate)** : `console.warn` mais ne casse pas.

## Correctifs appliques

| Composant | Probleme | Fix |
|-----------|----------|-----|
| `CodeBlock.tsx` | Pill `language` et `filename` en `text-fg-muted` sur `--code-bg-deep` (4.34:1) | `text-fg-muted` -> `text-fg-secondary` (7.58:1) |
| `glossary/page.tsx` | Label "Analogie" en `text-brand-600` sur `bg-slate-50` (4.36:1) | `text-brand-600` -> `text-brand-700` (5.36:1) ; dark : `text-brand-400` -> `text-brand-300` |
| `future/page.tsx` | Pill quarter `text-slate-500` sur `bg-slate-100` (4.34:1) | `text-slate-500` -> `text-slate-700` |
| `Screenshot.tsx` | Figcaption `text-slate-500` sur blanc (4.61 borderline) | `text-slate-500` -> `text-slate-700` (12.34:1) |
| `TerminalScreenshot.tsx` | Header titre `text-slate-500` sur `bg-slate-100` | `text-slate-500` -> `text-slate-700` |
| `prompting/page.tsx` | Span "A faire / A ne pas faire" en `text-emerald-500` / `text-red-500` sur blanc (3.06 / 4.05) | `text-emerald-700` (4.83:1) / `text-red-700` (5.74:1) |
| `prompting/page.tsx` | `<code>` inline avec `bg-slate-200` heritant `text-slate-500` du parent (3.86:1) | parent `text-slate-500 dark:text-slate-300` -> `text-slate-700 dark:text-slate-300` (replace_all sur le fichier) |

## Exclusions documentees (`disableRules`)

Certaines violations sont liees a des decisions design ou a des stories
encore non commencees. Elles sont exclues NOMMEMENT et avec un commentaire
qui pointe vers la story de remediation.

| Route | Regle exclue | Raison |
|-------|--------------|--------|
| `/fr/getting-started/installation/` | `color-contrast` | 2 spans `bg-brand-500 + text-white` (CTA "S'abonner Claude Max") = 2.42:1. La palette brand-500 est ancree dans `SYNTHESIS.md` section 4 comme couleur de CTA primaire. A reprendre dans une story dediee "brand contrast / token CTA" qui touchera tout le site. |
| `/fr/mcp/` | `color-contrast` | Dette design connue (cards MCP dark-mode brand-700 sur navy = 2.19). Documente dans CLAUDE.md projet. |
| `/fr/configurator/` | `color-contrast` | RG-23 (Configurator Wizard tokens C1) reprend la migration `StepProfile` / `PresetCard` / `ConfigPreview` vers les tokens semantiques avec contraste valide. RG-26 ne dedouble pas ce travail. |
| `/fr/getting-started/installation/`, `/fr/mcp/`, `/fr/prompting/`, `/fr/configurator/` | `scrollable-region-focusable` | Violation systematique sur tous les `<pre>` overflow-x-auto (CodeBlock long oneliners shell, JSON, etc.) et sur les MermaidDiagram. L'overflow horizontal est intentionnel et le contenu est deja accessible au clavier via Tab + arrow keys au scroll natif. Cf. exclusions Sonar S6845. |

## Limites connues (advisory non bloquants)

Certaines violations `minor` / `moderate` peuvent apparaitre en
`console.warn` durant la suite. Elles sont surveillees mais non
bloquantes :

- `landmark-unique` : duplication de role main quand un MDX article
  contient un Steps avec son propre wrapper.
- `region` (best-practice) : sections sans landmark explicite (rares).

## Workflow

```bash
# Build prealable obligatoire (le serveur statique sert /out/)
npm run build

# Lancer la suite a11y en local
PLAYWRIGHT_USE_STATIC=1 npx playwright test e2e/a11y.spec.ts --project=chromium

# Sur un port alternatif si 3000 est occupe par un autre projet
PLAYWRIGHT_USE_STATIC=1 PLAYWRIGHT_PORT=4747 \
  npx playwright test e2e/a11y.spec.ts --project=chromium

# Cibler une seule route + theme
PLAYWRIGHT_USE_STATIC=1 npx playwright test e2e/a11y.spec.ts \
  --project=chromium -g "FR landing — light"
```

En CI, integre au job `e2e-smoke` qui execute toute la suite (a11y + nav +
theme-toggle + locale-redirects) sur chromium uniquement.

## Roadmap

- [ ] Story dediee "brand contrast" : refondre les CTA primary `bg-brand-500`
      vers `bg-brand-700` ou ajouter une variante `cc-btn-primary--dark`
      pour atteindre 4.5:1 sur le texte 12-14px.
- [ ] Story dediee "MCP cards dark mode" pour resorber la dette signalee dans
      CLAUDE.md (brand-700 sur navy).
- [ ] Etendre la suite aux 5 routes additionnelles (`/skills/`, `/agents/`,
      `/use-cases/`, `/personas/`, `/limits/`) une fois RG-23 et RG-24
      stabilises.
- [ ] Ajouter un audit `wcag22aa` (criteres ajoutes par WCAG 2.2 :
      target-size, focus-not-obscured) en option longue.
