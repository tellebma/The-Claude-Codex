# Backlog : tableau de bord

> Derniere mise a jour : 2026-04-22

---

## Vue d'ensemble

| EPIC | Stories | Fait | En cours | A faire | Progression |
|------|---------|------|----------|---------|-------------|
| [Best Practices Integration](EPIC-best-practices-integration.md) | 17 | 16 | 0 | 1 | 94% |
| [Corrections UX/UI/A11y](EPIC-ux-ui-a11y-audit.md) | 11 | 10 | 0 | 1 | 91% |

**Total projet** : 26/28 stories (93%) · 97/102 SP livres (95%)

> Note : le composant WorkflowDiagram (C4, 3 SP) reste en backlog, nice-to-have.

---

## EPIC : Best Practices Integration

### Sprint 0 : Outillage & Fondations — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| M1 | Git Worktrees & parallelisme | 3 | ✅ Fait |
| M2.1 | Hooks : types manquants (SessionStart, PermissionRequest) | 3 | ✅ Fait |
| M3 | Tips prompting avance | 3 | ✅ Fait |
| M4 | CLI flags avances | 3 | ✅ Fait |
| M5 | Permissions & Sandbox | 3 | ✅ Fait |
| M6 | Settings.json avance | 2 | ✅ Fait |
| — | Composant KeyboardShortcut | 2 | ✅ Fait |

**Sprint 0** : 7/7 stories · 19/19 SP · 100%

### Sprint 1 : Concepts avances — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| M2.2 | Hooks : patterns avances (routing, nudge, logging) | 2 | ✅ Fait (couvert dans M2.1) |
| S1 | Workflows avances (Research->Plan->Execute->Review->Ship) | 5 | ✅ Fait |
| S2 | Memoire & CLAUDE.md avance | 5 | ✅ Fait |
| S3 | Pattern orchestration (Command vs Agent vs Skill) | 2 | ✅ Fait |
| S4 | Enrichir Skills (9 categories) | 2 | ✅ Fait |
| S5 | Enrichir Agents (16 champs frontmatter) | 2 | ✅ Fait |
| — | Composant ComparisonTable | 3 | ✅ Fait |

**Sprint 1** : 7/7 stories · 21/21 SP · 100%

### Sprint 2 : Contenu avance & Polish — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| C1 | Browser automation | 5 | ✅ Fait |
| C2 | Enrichir Prompting (voice, ASCII, styles) | 3 | ✅ Fait |
| C3 | Composant WorkflowDiagram | 3 | ⬜ Backlog (nice-to-have) |

**Sprint 2** : 2/3 stories · 8/11 SP · 73%

### Sprint 3 : Stabilisation — ✅ Termine

- [x] Revue transversale SEO (metadata.ts + search-index.ts complets)
- [x] Tests i18n FR/EN : parite 84 FR = 84 EN
- [x] Build OK (206 pages, 0 erreur)
- [x] Lint + type-check : 0 erreur
- [x] Mise a jour search index exhaustive (10 nouvelles entrees)

**Sprint 3** : 5/5 taches

---

## EPIC : Corrections UX/UI/A11y

> Source : audit multi-agents (3 agents : UX/Nielsen, UI/Design, A11y/WCAG)
> Lighthouse automatise = 100/100 — tous les problemes sont manuels

### Sprint 1 : Critiques visuels et contrastes — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-1 | Hierarchie visuelle sections/cartes landing | 3 | ✅ Fait (deja en place : surface-card CSS vars, sections alternees, icones opaques) |
| US-2 | Contrastes textuels WCAG AA | 3 | ✅ Fait (MDX blockquote + Footer + TcoCalculator + skills label + content prev/next) |
| US-3 | Coherence styles interactifs cartes | 2 | ✅ Fait (deja en place : FeatureCard hover conditionnel, AudienceCard sans hover) |

**Sprint 1** : 3/3 stories · 8/8 SP · 100%

### Sprint 2 : Navigation, recherche et i18n — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-4 | Navigation header et ARIA dropdown | 5 | ✅ Fait (deja en place : dropdown ARIA menu, nav clavier, menu mobile full-height, focus in/out) |
| US-5 | Focus trap et accessibilite recherche | 3 | ✅ Fait (deja en place : focus trap, aria-live, no-results suggestions, scrollbar compensation) |
| US-6 | Pages hors i18n et traductions | 5 | ✅ Fait (/about et 404 deja i18n, "Démarrer" accent, videoEmbed translations ajoutees, test parite namespaces) |

**Sprint 2** : 3/3 stories · 13/13 SP · 100%

### Sprint 3 : Coherence visuelle et ergonomie — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-7 | Coherence dark/light pages section | 3 | ✅ Fait (getting-started et /about deja adaptatifs ; hero MDX sombre = pattern design intentionnel) |
| US-8 | Indicateur de progression parcours | 3 | ✅ Fait (deja en place : SectionSidebar "Page X/Y" + progressbar ARIA + sr-only %) |
| US-9 | Espacement vertical et responsive | 2 | ✅ Fait (MdxRenderer max-w-3xl ajoute ; padding landing + Footer grid deja OK) |
| US-10 | Liens externes et semantique ARIA | 3 | ✅ Fait (deja en place : Callout aside, PathCard aria-label, liens externes sr-only, pas de h3 orphelin) |

**Sprint 3** : 4/4 stories · 11/11 SP · 100%

### Sprint 4 : Polish — ⬜ A faire

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-11 | Corrections mineures de polish | 2 | ⬜ A faire |

**Sprint 4** : 0/1 stories · 0/2 SP · 0%

---

## EPIC : Best Practices Integration — Resultats finaux

| Metrique | Valeur |
|----------|--------|
| Fichiers modifies | 37 |
| Lignes ajoutees | +5 799 |
| Nouvelles pages | 5 (x2 langues = 10 fichiers) |
| Pages enrichies | 9 (x2 langues = 18 fichiers) |
| Composants UI | 2 (KeyboardShortcut, ComparisonTable) |
| Pages statiques | 206 |
| Parite i18n | 84 FR = 84 EN |

### Nouvelles pages

| Page | Section |
|------|---------|
| `/advanced/worktrees` | Git worktrees, parallelisme, /batch |
| `/advanced/permissions-sandbox` | Permissions wildcards, sandbox, profils |
| `/advanced/workflows` | Research, Plan, Execute, Review, Ship |
| `/advanced/browser-automation` | Playwright vs Chrome DevTools vs Claude in Chrome |
| `/prompting/power-tips` | ultrathink, Esc Esc, /rewind, /compact, "grill me" |

### Pages enrichies

| Page | Ajout |
|------|-------|
| `reference/cli` | 5 flags avances |
| `reference/settings` | 5 niveaux hierarchie, config enterprise |
| `advanced/hooks` | SessionStart, PermissionRequest, 5 patterns |
| `prompting/claude-md` | Ancestor/descendant, agent memory, .claude/rules/ |
| `agents/orchestration` | Command vs Agent vs Skill, arbre de decision |
| `skills/best-skills` | 9 categories Thariq, progressive disclosure |
| `agents/create-subagent` | 16 champs frontmatter, exemples complets |
| `prompting/directives` | Dictee vocale, diagrammes ASCII |
| `prompting/advanced` | Output styles, prototypage rapide |

---

## Legende

| Marqueur | Signification |
|----------|---------------|
| ✅ Fait | Implemente, build OK, i18n FR + EN verifie |
| 🔄 En cours | Implementation demarree |
| ⬜ A faire | Pas encore commence |
| ❌ Bloque | Bloque, voir note |
