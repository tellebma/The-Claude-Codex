# Recette croisee FR + EN — Refonte graphique (RG)

EPIC : `2026-04-refonte-graphique`
Story de validation : RG-30
Date de recette : 2026-04-30

## Objectif

Verifier que les chantiers C1 → C5 fusionnes dans `develop` rendent un
visuel coherent, accessible et fonctionnel sur les deux locales (`fr`,
`en`) et sur les routes cles du site.

## Stories incluses dans la recette

Cette recette couvre toutes les stories RG mergees a la date du 2026-04-30 :

| Chantier | Stories | PRs | Statut |
|----------|---------|-----|--------|
| C1 Tokens | RG-03/04/05 | #96 | Done |
| C2 Layout | RG-06, RG-07, RG-08, RG-09, RG-10, RG-11 | #97, #102, #104, #105, #106, #107 | Done |
| C3 MDX | RG-12, RG-13, RG-14, RG-15, RG-16 | #98, #103, #108, #110, #111 | Done |
| C3 Themes | RG-31 | #112 | Done |
| C4 Editorial | RG-17, RG-19, RG-20, RG-21 | #113, #115, #117, #116 | Done |
| C4 Landing | RG-18 | #118 | Done |
| C4 Landing data | RG-32 | #119 | **A confirmer** (Sonar bloque) |
| C5 404 | RG-22 | #109 | Done |
| C5 Tooltips | RG-24 | #120 | Done (partiel) |
| C6 CI | RG-29 | #114 | Done |

## 5 routes cles a verifier

Pour chaque route, navigue manuellement en `/fr/` ET `/en/` puis valide les
items ci-dessous.

### 1. Landing : `/fr/` et `/en/`

- [ ] Hero split layout sur `lg+` (texte gauche, terminal droite, gap 64).
- [ ] Hero stack vertical centred sur mobile.
- [ ] Titre h1 en `text-display-1` (clamp 44px → 76px) avec `tracking-display`.
- [ ] CTA primaire (gradient brand) et secondaire (border + bg-elevated).
- [ ] CodexStatsBand affiche les 4 chiffres factuels (articles, sections,
      langues, derniere maj). Bande always-dark, halos cyan/ambre.
- [ ] RecentArticlesSection : 1 hero card + 2 small cards en lg+, stack en mobile.
- [ ] Section CTA finale : background subtil + halo radial brand.
- [ ] LanguageSwitcher fonctionne : clic sur EN bascule sur `/en/`, idem FR.
- [ ] Aucun `dark:slate-*` ni hex en dur visible.

### 2. Section Getting Started : `/fr/getting-started/` et `/en/getting-started/`

- [ ] Header avec glass effect, navigation active surlignee (brand-500).
- [ ] Sidebar gauche avec barre de progression (1/N), item actif en
      `bg-brand-500/10` + indicateur lateral `border-l-2 border-brand-500`.
- [ ] TableOfContents (xl+) avec lien actif en `text-[var(--brand-primary)]`.
- [ ] Breadcrumb avec separateurs `aria-hidden`, item courant en `fg-primary`.
- [ ] Articles cornerstone (ex. /getting-started/installation) affichent
      les badges thematiques (`tutorial`, `tooling`).
- [ ] Composants MDX coherents : Callout (4 variantes), CodeBlock (theme
      adaptatif), Steps (gradient brand), Tabs (animation), Card (hover).
- [ ] ScrollToTop apparait au scroll, tokens semantiques.

### 3. Section MCP : `/fr/mcp/` et `/en/mcp/`

- [ ] Page index MCP : meme experience que Getting Started.
- [ ] Articles avec themes (ex. `/mcp/what-are-mcps` : guide + architecture).
- [ ] Diagrammes Mermaid s'affichent (themeVariables internes Mermaid).
- [ ] McpArchitectureDiagram avec animations beam (couleurs brand/accent).

### 4. Configurator : `/fr/configurator/` et `/en/configurator/`

- [ ] Wizard avec etapes 1 a 4 (RG-23 non encore migree mais wizard
      fonctionnel sur develop).
- [ ] Boutons "Suivant" / "Precedent" cliquables.
- [ ] Preview de configuration (ConfigPreview) lisible.
- [ ] Evenements Matomo `configurator_start`, `configurator_step`,
      `configurator_complete` declenches (verifier via `_paq` en console).

### 5. Glossaire : `/fr/glossary/` et `/en/glossary/`

- [ ] Page glossaire avec liste de termes.
- [ ] `GlossaryTooltip` (au survol/focus d'un terme) : trigger en
      `text-brand-700` (light) / `text-brand-300` (dark), panneau toujours
      sombre (decision design).
- [ ] Fermeture du tooltip avec `Escape` fonctionne.
- [ ] Touch target minimum 44px sur le trigger.
- [ ] `KeyboardShortcut` rendu dans les pages de raccourcis : kbd avec
      tokens `--bg-subtle`, `--border-default`, `--fg-secondary`.

## Verifications transversales

- [ ] Light/dark mode : ThemeToggle bascule correctement, transitions
      fluides via `--duration-base` + `--ease-out`.
- [ ] Aucun FOUC sur le CodeBlock (theme adaptatif RG-14, `mounted`
      state actif).
- [ ] Aucun hex code en dur hors `globals.css` et whitelist RG-29
      (`./scripts/check-hardcoded-colors.sh` -> exit 0).
- [ ] Tests E2E Playwright : `npx playwright test` -> pass complet.
- [ ] Tests unitaires : `npx vitest run` -> 100% pass.
- [ ] Build : `npm run build` -> ok, pas d'erreur de validation
      frontmatter (themes RG-31).
- [ ] Sitemap : `out/sitemap.xml` genere, `lastModified` de la landing
      a jour (2026-04-30 apres RG-18 + RG-32).

## Build Docker final

- [ ] `docker build -t claude-code-guide .` reussit.
- [ ] Taille image : `docker image ls claude-code-guide` -> < 50 MB
      (objectif CLAUDE.md).

## Stories non incluses dans cette recette

- **RG-23 Configurator Wizard** : story M / 5 pts, sera migree
  ulterieurement. Wizard fonctionnel mais styles non-tokenises.
- **RG-24 pages dediees** (`/future`, `/about`, `/personas`, `/limits`,
  page glossaire complete) : seuls les composants partages
  (`KeyboardShortcut`, `GlossaryTooltip`) sont migres dans #120. Les
  pages individuelles utilisent encore quelques `slate-*` non-bloquants.
- **RG-25** Tests regression visuelle Playwright : story dediee.
- **RG-26** Audit axe-core / WCAG complet : couverture partielle via
  les tests E2E `a11y.spec.ts` qui valident la landing.
- **RG-27** Audit Lighthouse + bundle.

## Signatures

- [ ] Recette validee par : `<nom>` le `<date>`
- [ ] Approbation pour merge `develop -> main` : `<nom>` le `<date>`

---

## Annexe : commandes de verification rapide

\`\`\`bash
# Tests unitaires
npx vitest run

# Tests E2E (chromium uniquement par defaut)
npx playwright test --project=chromium

# Verification hex hors tokens
./scripts/check-hardcoded-colors.sh

# Build SSG
npm run build

# Build Docker
docker build -t claude-code-guide . && docker image ls claude-code-guide
\`\`\`
