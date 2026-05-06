# RG-25 — Tests de regression visuelle Playwright

**Status** : actif sur CI depuis la PR RG-25 (mai 2026).

Ce document decrit la strategie, l'usage et la maintenance des tests de
regression visuelle automatises sur le site The Claude Codex.

## Objectif

Detecter toute regression visuelle involontaire (changement de couleur, de
typographie, de layout, de spacing, etc.) avant le merge sur `develop`. Le
test echoue si plus de 2% des pixels d'une route ont change par rapport a
sa baseline committee.

> **Note** : l'acceptance initiale RG-25 etait 0.1% mais a ete revisee a 2%
> apres les premiers runs CI. Les baselines sont generees localement (WSL2)
> et comparees contre Ubuntu CI : la rasterization sub-pixel des polices
> entre les deux environnements produit ~1% de bruit sur les pages
> text-heavy (glossary, prompting) sans qu'il y ait de regression reelle.
> 2% capte largement les regressions structurelles (layout, couleurs,
> typo) tout en absorbant ce bruit cross-environnement. Pour reduire ce
> seuil a 0.1% il faudrait soit lancer le scanner depuis un container
> Ubuntu strictement identique a la CI, soit n'accepter que des baselines
> generees par la CI elle-meme via un workflow_dispatch dedie.

## Couverture

20 captures = **10 routes x 2 themes** (light + dark). Chaque route est rendue
en viewport `1440x900` (desktop standard), full-page, animations gelees.

| Route | Baseline FR ou EN | Couverture |
|-------|--------------------|------------|
| `/fr/` | landing FR (split hero) | hero + sections data RG-32 |
| `/en/` | landing EN (split hero) | i18n hero |
| `/fr/getting-started/` | section overview | layout doc shell |
| `/fr/getting-started/installation/` | article doc | reading flow + Steps |
| `/fr/mcp/` | section overview | cards + tabs |
| `/fr/prompting/` | section overview | grille de cards |
| `/fr/configurator/` | wizard etape 1 | inputs + boutons primary |
| `/fr/glossary/` | termes A-Z | typographie + tooltips |
| `/fr/about/` | page editoriale | hero court + paragraphes |
| `/fr/future/` | page editoriale | densite texte + listes |

## Configuration

### Playwright

Spec : `e2e/visual.spec.ts`. Projet dedie `visual` declare dans
`playwright.config.ts` :

- `testMatch: /visual\.spec\.ts/` — isoles du smoke `chromium`.
- `viewport: 1440x900`, `deviceScaleFactor: 1` — deterministe.
- Global `expect.toHaveScreenshot.maxDiffPixelRatio: 0.001` (0.1%).
- `caret: 'hide'`, `animations: 'disabled'`.

### Theme switching deterministe

Le theme est fixe AVANT le premier paint via `addInitScript` qui pose
`localStorage["theme"]`. Pas de flash, pas de double render.

```typescript
await context.addInitScript((t) => {
  window.localStorage.setItem("theme", t);
}, theme); // "light" | "dark"
```

### Animation freeze

Une feuille de style est injectee juste avant la capture pour neutraliser
les animations qui survivent a `prefers-reduced-motion: reduce` (pulse hero,
shimmer gradient texte, blink curseur terminal, etc.) :

```css
*, *::before, *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
  caret-color: transparent !important;
}
```

## Commandes

```bash
# Lancer les visual tests en local (necessite npm run build prealable
# ou le dev server demarre automatiquement par playwright.config.ts)
npm run test:visual

# Re-baseliner apres une refonte intentionnelle
npm run test:visual:update

# Mode debug (trace + ui)
npx playwright test --project=visual --ui
```

En CI (job `e2e-visual` dans `.github/workflows/pr-checks.yml`) :

```bash
PLAYWRIGHT_USE_STATIC=1 npx playwright test --project=visual
```

`PLAYWRIGHT_USE_STATIC=1` fait servir le build via `http-server` (matche la
prod Docker) plutot que le dev server.

## Workflow de maintenance

### Cas 1 : un test echoue de maniere INATTENDUE

1. Telecharger l'artifact `playwright-report-visual` du run CI failed.
2. Ouvrir `playwright-report/index.html` dans un navigateur.
3. Comparer les images `expected` (baseline) vs `actual` (nouveau rendu) vs
   `diff` (zones rouges).
4. Diagnostiquer la regression et la corriger sur la PR.

### Cas 2 : un test echoue suite a un CHANGEMENT INTENTIONNEL

Une story modifie un composant et ses screenshots changent volontairement.

1. Sur la branche feature, lancer `npm run test:visual:update`.
2. Verifier les diffs avec `git diff e2e/visual.spec.ts-snapshots/`.
3. Re-lancer `npm run test:visual` pour confirmer le pass.
4. Committer les nouvelles baselines dans la meme PR que le code modifie :
   `git add e2e/visual.spec.ts-snapshots/ && git commit`.
5. Mentionner la mise a jour des baselines dans le message de commit.

### Cas 3 : ajouter une nouvelle route a la couverture

Editer `e2e/visual.spec.ts`, etendre `ROUTES`, lancer
`npm run test:visual:update` pour generer les nouvelles baselines en
light + dark, et committer.

### Cas 4 : le test est flaky sur une portion specifique

Si une zone de la page reste flaky meme avec le freeze CSS (ex : svg avec
random colors, shadergradient, terrain Three.js), masquer la zone par
selecteur dans l'appel `toHaveScreenshot` :

```typescript
await expect(page).toHaveScreenshot("page-light.png", {
  fullPage: true,
  mask: [page.locator("[data-test-mask]")],
});
```

Ajouter `data-test-mask` sur l'element flaky dans le composant.

## Limites connues

- **OS-specific** : les baselines sont prefixees par `-linux.png` (suffix de
  `process.platform`). Elles sont generees sur Ubuntu (CI) et donc commitees
  pour Linux uniquement. Tester en local sur macOS ou Windows produira des
  diffs cosmetiques (anti-aliasing) — c'est attendu, ne PAS regenerer les
  baselines depuis un autre OS.
- **Texte legerement different selon polices systeme** : si une police
  custom n'est pas dispo (ex : self-hosted JetBrains Mono), la fallback
  monospace produit un diff. Veiller a ce que `next/font` charge bien les
  polices au build.
- **Animations en boucle non-CSS** (ex : framer-motion en JS) : le freeze
  CSS n'attrape pas tout. Si une regression visuelle vient d'un composant
  framer-motion, soit ajouter `prefers-reduced-motion` dans le composant,
  soit masquer la zone via `mask: [locator]`.

## Roadmap

- [ ] Etendre a 5 routes additionnelles (`/skills/`, `/agents/`, `/use-cases/`,
      `/personas/`, `/limits/`) une fois RG-23/RG-24 stabilises.
- [ ] Ajouter une variante mobile (viewport 375x812) pour les pages les plus
      critiques.
- [ ] Integrer un job manuel "blesser les baselines" via workflow_dispatch
      pour eviter les commits manuels apres une refonte massive.
