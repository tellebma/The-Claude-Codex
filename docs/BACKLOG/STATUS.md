# Backlog : tableau de bord

> Derniere mise a jour : 2026-05-11 (ouverture EPIC Stack design Claude Code — skills + MCP externes + Playwright)

---

## Vue d'ensemble

| EPIC | Stories | Fait | En cours | A faire | Progression |
|------|---------|------|----------|---------|-------------|
| [Best Practices Integration](EPIC-best-practices-integration.md) | 17 | 16 | 0 | 1 | 94% |
| [Corrections UX/UI/A11y](EPIC-ux-ui-a11y-audit.md) | 11 | 11 | 0 | 0 | 100% ✅ |
| [Refonte graphique 2026-04](../epics/2026-04-refonte-graphique/EPIC.md) | 32 | 32 | 0 | 0 | 100% ✅ (~70% du SYNTHESIS — voir EPIC suivant) |
| [Refonte premium 2026-05](../epics/2026-05-refonte-premium/EPIC.md) | 19 | 19 | 0 | 0 | 100% ✅ (cloture 2026-05-09) |
| [Bugfix articles href 2026-05](EPIC-bugfix-articles-href-2026-05.md) | 2 | 2 | 0 | 0 | 100% ✅ (cloture 2026-05-10) |
| [Bugfix search Vercel redirect 2026-05](EPIC-bugfix-search-vercel-redirect-2026-05.md) | 2 | 2 | 0 | 0 | 100% ✅ (cloture 2026-05-10) |
| [SEO/GEO mai 2026](EPIC-seo-geo-may-2026.md) | 9 | 4 | 0 | 5 | 44% 🔄 (Sprint 1 + Sprint 2 livres) |
| [Vercel Metrics 2026](EPIC-vercel-metrics-2026.md) | 11 | 0 | 0 | 11 | 0% (backlog post-SEO/GEO) |
| [Stack design Claude Code 2026-05](EPIC-design-stack-skills-mcp-2026-05.md) | 10 | 0 | 0 | 10 | 0% 🆕 (validé agents SEO + Rédacteur, pret Sprint 1) |

**Total projet** : 86/113 stories (76%) · ~197/246 SP livres (80%)

> EPIC **Refonte graphique 2026-04** cloture le 2026-05-07 mais l'audit PO en recette a revele que l'EPIC ne couvrait que la migration vers tokens (22/32 stories invisibles a l'oeil) + 3 nouveaux composants. Les ~70% manquants du SYNTHESIS (article shell 3 colonnes, animations signature, FAQ/Alert/NextSteps, light mode polish) sont consolides dans l'EPIC **Refonte premium 2026-05**.

> EPIC **Corrections UX/UI/A11y** : cloture le 2026-04-22. Seul WorkflowDiagram (C3, 3 SP, nice-to-have) reste dans l'EPIC Best Practices.

> EPIC **Refonte premium 2026-05** : ✅ **cloture le 2026-05-09 a 100%** — 19 stories mergees (RG2-01 a RG2-19). Couvre integralement les 30% manquants du SYNTHESIS de la refonte 2026-04 : article shell 3 colonnes (RG2-01 + ReadingProgressBar/TocProgress/Pager/Tables), composants editoriaux MDX (Faq, ArticleAlert, NextSteps, Steps gradient), landing signature (TrustBar, chips orbitaux, grid fade, articles recents avec filtres, reorder, CtaFinal), polish global (CodeBlock always-dark, light mode polish, stats band canoniques), rollout E2E sur 10 articles representatifs.

> EPIC **SEO/GEO mai 2026** : ouvert le 2026-05-06 suite a l'audit hebdo GSC + Matomo `2026-04-25 -> 2026-05-01` (rapport `claude-code-obsidian-brain/raw/analytics/`). 9 stories pour 27 SP repartis sur 4 sprints. Sprint 1 (SEO-1, SEO-2) ✅ et Sprint 2 (SEO-4, SEO-5) ✅ mergees le 2026-05-10. SEO-3 partiellement absorbee par les dateModified bumps de SEO-1+SEO-2. Reste : Sprint 3 (SEO-6 audit drops, SEO-7 audit maillage) et Sprint 4 (SEO-8 debug Matomo, SEO-9 AnalyticsTracker overview).

> EPIC **Bugfix articles href 2026-05** : ouvert et cloture le 2026-05-09. B-ART-1 (#155) fix `buildEntry` slug nu + tests RG-32. B-ART-2 (#157) garde-fou E2E `e2e/landing-recent-articles.spec.ts` qui a ensuite expose un bug latent corrige dans le Sprint 1 SEO/GEO (`getMostRecentArticles` filtre locale `===` preferredLocale, evite 404 sur slugs divergents FR/EN comme `bonnes-pratiques-securite` vs `security-best-practices`).

> EPIC **Bugfix search Vercel redirect 2026-05** : ouvert et cloture le 2026-05-09. B-SRC-1 (#156) fix regex `vercel.json` `[^.]+` pour exclure les fichiers `public/` (`search-index-fr.json`, `sad-toaster.glb`, `images/*`, etc.). B-SRC-2 (#158) suite E2E `e2e/search-results.spec.ts` qui s'execute en preview Vercel uniquement (skip si `VERCEL_PREVIEW_URL` non defini, pattern aligne sur `e2e/locale-redirects.spec.ts`).

> EPIC **Stack design Claude Code 2026-05** : ouvert le 2026-05-11 suite a 1 mois d'utilisation intensive de Claude Code en mode design (refonte graphique + refonte premium). 10 stories pour 28 SP repartis sur 3 sprints. 4 fiches outils (Impeccable, UI UX Pro Max, Taste Skill, Huashu Design) + cornerstone retour d'experience + workflow Playwright + demo + maillage. URLs cibles : `/skills/{slug}` et `/mcp/workflow-design-playwright`. **Valide en draft par 2 agents** (SEO + Redacteur) le 2026-05-11 ; corrections integrees (`SoftwareApplication` schema, mots-cles EN, sections "ce que ca change" et "cas d'echec", honnetete "1 mois", DSK-9/10 remontees Sprint 1). Pret pour ouverture Sprint 1.

> EPIC **Vercel Metrics 2026** : ouvert le 2026-05-09 suite a une demande PO interne, **revise le meme jour** apres audit MCP Vercel qui a revele que le projet etait deja en production sur Vercel (claude-codex.fr servi par Vercel, pas Docker Nginx contrairement a l'hypothese initiale). Story VM-2 "double hosting" supprimee (3 SP retires). Reste : 11 stories / 22 SP / 3 sprints. Pack : Web Analytics + Speed Insights (Web Vitals RUM qui manque a Matomo) + Observability. Effort reel install SDK ~5 SP au lieu de 18 SP estime initialement. Priorite : backlog post-SEO/GEO.

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

### Sprint 4 : Polish — ✅ Termine

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-11 | Corrections mineures de polish | 2 | ✅ Fait (favicon.ico multi-size + CTA hero hover fonctionnel ; autres items deja en place) |

**Sprint 4** : 1/1 stories · 2/2 SP · 100%

---

## EPIC : Refonte premium 2026-05 — ✅ Termine 2026-05-09

> Source : [docs/epics/2026-05-refonte-premium/EPIC.md](../epics/2026-05-refonte-premium/EPIC.md)
> Couvre les ~30% manquants du SYNTHESIS de la refonte 2026-04 : article shell premium 3 colonnes, animations signature landing, FAQ/Alert/NextSteps, light mode polish.

### Chantier P1 — Article shell premium ✅ 10/10 stories

| ID | Story | SP | Statut |
|----|-------|----|--------|
| RG2-01 | Article shell 3 colonnes (foundation) | 8 | ✅ Fait (#132) |
| RG2-02 | Reading progress bar | 1 | ✅ Fait (#149) |
| RG2-03 | TOC progress bar | 1 | ✅ Fait (#150) |
| RG2-04 | Steps badge gradient 56x56 | 2 | ✅ Fait (#136) |
| RG2-05 | FAQ accordeon | 3 | ✅ Fait (#140) |
| RG2-06 | ArticleAlert variantes | 2 | ✅ Fait (#141) |
| RG2-07 | NextSteps card | 2 | ✅ Fait (#142) |
| RG2-08 | Pager refondu | 1 | ✅ Fait (#146) |
| RG2-09 | Article tables | 1 | ✅ Fait (#143) |
| RG2-10 | Rollout sur articles existants | 5 | ✅ Fait (#152, 10 articles E2E) |

### Chantier P2 — Landing signature ✅ 6/6 stories

| ID | Story | SP | Statut |
|----|-------|----|--------|
| RG2-11 | Chips orbitaux | 3 | ✅ Fait (#133) |
| RG2-12 | Cadrillage hero anime (lp-grid-fade) | 1 | ✅ Fait (#134) |
| RG2-13 | Articles recents : filtres + restyling | 5 | ✅ Fait (#137) |
| RG2-14 | Landing reorder | 1 | ✅ Fait (#147) |
| RG2-15 | TrustBar | 2 | ✅ Fait (#144) |
| RG2-16 | CTA Final pattern dedie | 3 | ✅ Fait (#148) |

### Chantier P3 — Polish global ✅ 3/3 stories

| ID | Story | SP | Statut |
|----|-------|----|--------|
| RG2-17 | CodeBlock always-dark | 1 | ✅ Fait (#135) |
| RG2-18 | Light mode polish | 3 | ✅ Fait (#151) |
| RG2-19 | Stats band classes canoniques | 1 | ✅ Fait (#145) |

**Progression** : ✅ **19/19 stories · 45/45 SP · 100%**

---

## EPIC : SEO/GEO mai 2026

> Source : [docs/BACKLOG/EPIC-seo-geo-may-2026.md](EPIC-seo-geo-may-2026.md)
> Origine : audit hebdo GSC + Matomo `2026-04-25 -> 2026-05-01` (16 alertes critiques, 57 a surveiller).

### Sprint 1 — Quick wins CTR (10 SP) — ✅ Termine 2026-05-10

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-1 | Reecriture title + description `/reference/environment/` | 2 | ✅ Fait (#159) |
| SEO-2 | Reecriture title + description sur 14 pages CRIT | 5 | ✅ Fait (#161) |
| SEO-3 | Refresh `dateModified` top 10 pages | 3 | ✅ Couvert par SEO-1+SEO-2 (5/10 pages refresh) ; reste 5 pages secondaires |

### Sprint 2 — GEO et AI Overviews (8 SP) — ✅ Termine 2026-05-10

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-4 | FAQPage schema sur 6 pages strategiques | 5 | ✅ Fait (#162) — 12 MDX + `src/data/page-faqs.ts` |
| SEO-5 | Section TL;DR sur 10-12 pages | 3 | ✅ Fait (#163) — 18 MDX (9 pages × 2 locales) |

### Sprint 3 — Recovery position drops (5 SP)

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-6 | Audit + republication des 10 pages en chute | 3 | ⬜ A faire |
| SEO-7 | Audit maillage interne post-RG | 2 | ⬜ A faire |

### Sprint 4 — Backend tracking (4 SP)

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-8 | Debug Matomo tracking | 3 | ⬜ A faire |
| SEO-9 | Couvrir overview pages avec AnalyticsTracker | 1 | ⬜ A faire |

**Progression** : 0/9 stories · 0/27 SP · 0%

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
