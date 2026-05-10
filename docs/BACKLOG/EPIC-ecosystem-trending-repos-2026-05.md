# EPIC : Écosystème & Top GitHub Repos — Capture du trafic "awesome/top/best Claude Code"

> Source : recherche GitHub mai 2026 — 30+ repos trending autour de Claude Code, skills, MCP, plugins, hooks, agents
> Date : 2026-05-11
> Effort estimé : 36 story points (12 stories sur 3 sprints)
> Pré-requis : aucun (orthogonal aux EPICs SEO-GEO et Best Practices Integration en cours)
> Owner : Maxime BELLET

---

## Contexte

L'écosystème Claude Code explose en 2026. Les recherches GitHub mai 2026 révèlent une masse critique de repos community avec des compteurs étoiles très élevés (souvent gonflés mais signal SEO réel) :

| Catégorie | Repos notables | ⭐ cumulées |
|-----------|----------------|------------:|
| Harness & skills | everything-claude-code, agent-skills, awesome-claude-skills, andrej-karpathy-skills | 400k+ |
| Awesome lists | awesome-mcp-servers, awesome-claude-code, awesome-claude-plugins, antigravity-awesome-skills | 250k+ |
| Plugins & marketplaces | claude-plugins-official (Anthropic), claude-plugins, awesome-claude-plugins | 22k+ |
| Mémoire & contexte | claude-mem, Continuous-Claude-v3, graphify | 124k+ |
| Optimisation tokens | caveman, rtk, claude-code-router | 137k+ |
| Templates & frameworks | gstack (Garry Tan), claude-code-templates, SuperClaude_Framework, get-shit-done | 205k+ |
| Multi-agents & swarms | ruflo, wshobson/agents, oh-my-claudecode | 117k+ |
| Hooks & observabilité | claude-hud, claude-code-hooks-mastery, claude-code-hooks-multi-agent-observability | 27k+ |
| System prompts leaks | system-prompts-and-models-of-ai-tools, system_prompts_leaks | 177k+ |

### Constat principal : aucune référence FR ne consolide cet écosystème

- Côté anglais : `hesreallyhim/awesome-claude-code` (43k★), `ComposioHQ/awesome-claude-skills` (59k★), `punkpeye/awesome-mcp-servers` (87k★) trustent la SERP.
- Côté français : **vide concurrentiel quasi total**. Aucune page éditoriale française ne curate l'écosystème Claude Code.
- The Claude Codex couvre déjà MCP, plugins, skills, agents, hooks individuellement, mais **n'a aucune page hub "awesome / écosystème / inventaire"** qui capte les requêtes transverses.

### Opportunités SEO chiffrées (intentions de recherche identifiées)

| Intention | Pages cibles concurrence | Volume FR estimé |
|-----------|--------------------------|------------------|
| "awesome claude code" / "claude code github" | hesreallyhim, ComposioHQ | Moyen-Élevé |
| "best mcp servers" / "meilleurs serveurs MCP" | punkpeye | Élevé |
| "claude code plugins" / "plugins officiels Anthropic" | anthropics/claude-plugins-official | Élevé (en croissance) |
| "claude code starter / templates" | gstack, davila7 | Moyen |
| "claude code memory / context persistence" | claude-mem | Moyen (technique) |
| "réduire tokens / coût Claude Code" | caveman, rtk | Élevé (cost-conscious) |
| "garry tan claude code" / "karpathy claude.md" | viral repos | Pic ponctuel fort |

### Lien avec les autres EPICs

- **EPIC SEO-GEO mai 2026** : améliore le CTR de pages existantes. Cet EPIC en complément crée de **nouvelles pages cornerstone** qui captent du trafic neuf.
- **EPIC Best Practices Integration** : enrichit les sections existantes (advanced, prompting, etc.). Cet EPIC ajoute un *layer* écosystème par-dessus.
- **Spec Articles IA générative** : peut alimenter cet EPIC en générant les fiches descriptives des repos.

---

## Vision

Faire de The Claude Codex la **référence francophone d'inventaire de l'écosystème Claude Code**. Quand un dev FR cherche "top claude code repos", "meilleurs MCP", "plugins claude officiels", "réduire les coûts Claude Code", il atterrit sur claude-codex.fr.

**Triple objectif** :

1. **SEO direct** : ranker sur les requêtes "awesome/top/best/meilleurs" en FR (et EN).
2. **GEO (Generative Engine Optimization)** : être cité par ChatGPT, Claude, Perplexity, Gemini quand ils répondent à "quels sont les meilleurs outils Claude Code ?".
3. **Linkbait & backlinks** : les pages "awesome" génèrent naturellement des liens entrants depuis Reddit, Hacker News, X, Dev.to.

---

## Priorisation MoSCoW

### MUST HAVE (17 SP, Sprint 1) — Hub Écosystème + 4 pages awesome

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| ECO-1 | Nouvelle section `/ecosystem/` (FR + EN) : layout, nav sidebar, landing page hub | 3 | `app/[locale]/ecosystem/{layout,page}.tsx` + `lib/section-navigation.ts` |
| ECO-2 | Page **Top GitHub Repos** : 30+ repos curés par catégorie, mise à jour mensuelle | 5 | `/ecosystem/top-repos-github` |
| ECO-3 | Page **Awesome Skills** : compilation des meilleurs skills publics (everything-claude-code, awesome-claude-skills, agent-skills, antigravity-awesome-skills) | 3 | `/ecosystem/awesome-skills` |
| ECO-4 | Page **Awesome Plugins** : marketplace officielle Anthropic + écosystème community | 3 | `/ecosystem/awesome-plugins` |
| ECO-5 | Page **Awesome MCP Servers** : curation MCP par catégorie (data, design, dev, security) | 3 | `/ecosystem/awesome-mcp-servers` |

### SHOULD HAVE (11 SP, Sprint 2) — Pages thématiques tirant un concept trending

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| ECO-6 | Page **Mémoire persistante cross-session** : patterns `claude-mem`, `Continuous-Claude-v3`, `graphify` | 3 | `/advanced/memoire-persistante` |
| ECO-7 | Page **Optimisation tokens & coûts** : patterns `caveman`, `rtk`, cache prompt, claude-code-router | 3 | `/advanced/optimisation-tokens` |
| ECO-8 | Page **Templates & Starter Kits** : tour des stacks opinionated (gstack, claude-code-templates, SuperClaude_Framework, get-shit-done) | 3 | `/getting-started/templates-starter-kits` |
| ECO-9 | Page **Observabilité & Monitoring** : claude-hud, claude-code-hooks-multi-agent-observability, Claude-Code-Agent-Monitor | 2 | `/advanced/observabilite-monitoring` |

### COULD HAVE (8 SP, Sprint 3) — Articles éditoriaux racine (linkbait)

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| ECO-10 | Article **Comprendre les internals de Claude Code** : analyse des system prompts leaks, comment Claude Code raisonne en interne | 3 | `/content/comprendre-claude-code-internals` |
| ECO-11 | Article **Le stack de Garry Tan (gstack) appliqué en FR** : review critique, applicabilité, alternatives | 3 | `/content/garry-tan-stack-claude-code` |
| ECO-12 | Article **CLAUDE.md "à la Karpathy" décortiqué** : analyse du repo 124k★, principes transférables, version FR adaptée | 2 | `/content/karpathy-claude-md-analyse` |

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Une page dédiée par repo individuel | Dilution SEO, mieux vaut des hubs curés |
| W2 | Page sur les wrappers/proxies (`claude-code-router`, `ccproxy`, `CLIProxyAPI`) | Niche technique, mention dans `optimisation-tokens` suffit |
| W3 | Page sur les clients desktop (`cc-switch`, `AionUi`, `cherry-studio`) | Pas spécifique Claude Code, mention dans `top-repos-github` suffit |
| W4 | Article éditorial sur chaque viral repo | À considérer en EPIC suivant si trafic confirmé |
| W5 | Système de mise à jour automatique (scraping GitHub API) | À traiter en chore séparée (cron job + script) si l'EPIC marche |

---

## Architecture de l'information

### Nouvelle section `/ecosystem/`

```
app/[locale]/ecosystem/
├── layout.tsx              ← <SectionLayout> avec sidebar dédiée
├── page.tsx                ← Landing : pitch + 4 cards vers awesome-*
├── top-repos-github/
│   └── page.tsx            ← ECO-2 (cornerstone)
├── awesome-skills/
│   └── page.tsx            ← ECO-3
├── awesome-plugins/
│   └── page.tsx            ← ECO-4
└── awesome-mcp-servers/
    └── page.tsx            ← ECO-5
```

Contenu MDX correspondant :

```
content/fr/ecosystem/
├── index.mdx               ← Landing FR
├── top-repos-github.mdx
├── awesome-skills.mdx
├── awesome-plugins.mdx
└── awesome-mcp-servers.mdx

content/en/ecosystem/
├── index.mdx
├── top-repos-github.mdx
├── awesome-skills.mdx
├── awesome-plugins.mdx
└── awesome-mcp-servers.mdx
```

### Enrichissements / nouvelles pages dans sections existantes (Sprint 2)

```
content/{fr,en}/advanced/memoire-persistante.mdx        ← ECO-6
content/{fr,en}/advanced/optimisation-tokens.mdx        ← ECO-7
content/{fr,en}/getting-started/templates-starter-kits.mdx ← ECO-8
content/{fr,en}/advanced/observabilite-monitoring.mdx   ← ECO-9
```

### Articles éditoriaux racine (Sprint 3)

```
content/fr/comprendre-claude-code-internals.mdx        ← ECO-10
content/en/understanding-claude-code-internals.mdx
content/fr/garry-tan-stack-claude-code.mdx             ← ECO-11
content/en/garry-tan-stack-claude-code.mdx
content/fr/karpathy-claude-md-analyse.mdx              ← ECO-12
content/en/karpathy-claude-md-analysis.mdx
```

### Mise à jour navigation

1. `lib/section-navigation.ts` : ajouter entrée `ecosystem` avec `labelKey: 'ecosystem'` et items pour les 4 sous-pages
2. `messages/{fr,en}.json` : namespace `sectionNav.ecosystem`
3. `Header.tsx` : ajouter lien "Écosystème" / "Ecosystem" dans le menu principal
4. `lib/search-index.ts` : ajouter les 5 entrées dans `searchIndexFr` et `searchIndexEn`
5. `lib/metadata.ts` : ajouter les pages dans `SITE_PAGES` avec `priority: 0.8`, `changeFrequency: 'monthly'`
6. `scripts/generate-llms-txt.ts` : ajouter `/ecosystem` dans `SECTION_LANDINGS_FR` et `_EN`, ajouter `top-repos-github` dans `POPULAR_SLUGS_*`

---

## Composants UI à créer

### `<RepoCard />` (nouveau composant `components/ui/RepoCard.tsx`)

Card unifiée pour afficher un repo GitHub avec :

- Propriétaire / nom (lien externe)
- Description courte (1-2 lignes max)
- Badge langage principal (Python, TS, Rust, etc.)
- Compteur étoiles (avec timestamp de dernier refresh manuel)
- Badge "Officiel Anthropic" si applicable
- Badge "Communautaire" sinon
- Tags catégorie (skill, plugin, mcp, hook, agent, harness…)

Props `Readonly<>` strict, accessible (alt, aria-label).

### `<CategoryGrid />` (nouveau composant `components/ui/CategoryGrid.tsx`)

Grille responsive 1-2-3 colonnes qui contient des `<RepoCard>` regroupées par catégorie avec un H3 par catégorie. Utilisable dans toutes les pages `/ecosystem/*`.

### Optionnel `<RepoStats />` (badge inline pour les MDX articles)

Inline badge `[123k★ · TS · MIT]` à utiliser dans les paragraphes des articles éditoriaux racine (ECO-10/11/12).

---

## Frontmatter type par story

### Landing `/ecosystem/`

```yaml
---
title: "Écosystème Claude Code : tous les outils de la communauté"
description: "L'inventaire complet et à jour des meilleurs repos GitHub, skills, plugins, serveurs MCP et hooks pour Claude Code. Sélection éditoriale, mise à jour mensuelle."
order: 1
themes: ["reference", "tooling"]
datePublished: "2026-05-XX"
dateModified: "2026-05-XX"
---
```

### Page `top-repos-github`

```yaml
---
title: "Top 30 des repos GitHub Claude Code à connaître en 2026"
description: "Notre sélection des repos GitHub trending autour de Claude Code : harness, skills, plugins, MCP, hooks, agents. Mise à jour mensuelle, classés par catégorie et popularité."
order: 1
themes: ["reference", "tooling"]
badge: "NEW"
datePublished: "2026-05-XX"
dateModified: "2026-05-XX"
---
```

### Pages `awesome-*`

```yaml
---
title: "Awesome [Skills|Plugins|MCP Servers] : la liste curée pour Claude Code"
description: "[…]"
order: 2-4
themes: ["reference", "tooling"]
datePublished: "2026-05-XX"
dateModified: "2026-05-XX"
---
```

### Articles éditoriaux racine

```yaml
themes: ["guide", "tooling"]              # ECO-10
themes: ["use-case", "productivity"]      # ECO-11
themes: ["guide", "productivity"]         # ECO-12
```

---

## SEO & GEO — Patterns à appliquer systématiquement

Chaque page `/ecosystem/*` doit inclure :

1. **TL;DR en haut** (3-5 puces) — lisible par AI Overviews
2. **JSON-LD `ItemList`** (Schema.org) listant les repos comme `ListItem` avec `url`, `name`, `description`
3. **JSON-LD `FAQPage`** sur les questions transverses ("Quel est le meilleur skill pour X ?", "Comment installer Y ?")
4. **JSON-LD `BreadcrumbList`** (déjà standard via `createBreadcrumbSchema`)
5. **Liens sortants `rel="noopener nofollow"`** vers GitHub (sauf repo officiel Anthropic = `dofollow`)
6. **Section "Pour aller plus loin"** en bas avec liens internes vers `/mcp`, `/plugins`, `/skills` (maillage)
7. **Cluster de liens internes** : chaque page `/ecosystem/*` linke vers les 3 autres
8. **Image OG dédiée** (générée via `app/[locale]/ecosystem/*/opengraph-image.tsx`)

---

## Cross-cutting : i18n, qualité, accessibilité

- **Traductions** : chaque page FR a sa version EN miroir (slug EN différent pour certains : `comprendre-claude-code-internals` → `understanding-claude-code-internals`)
- **Accessibilité** : tous les badges étoiles ont un `aria-label` ("Repo X étoiles GitHub"), tous les liens externes ont `aria-label` explicite
- **Tests Vitest** : tester `RepoCard` (rendu, lien, aria-label) et `CategoryGrid` (rendu liste, gestion liste vide)
- **Test E2E Playwright** : journey "visiter `/ecosystem/` → cliquer sur une card → arriver sur `/ecosystem/top-repos-github`"
- **Lighthouse** : score ≥ 90 sur les 4 métriques (perf, a11y, best practices, SEO)
- **Visual regression** : ajouter `/ecosystem/` au harness RG-25 (seuil 2 %)
- **SonarQube** : 0 bug, 0 BLOCKER/CRITICAL, complexité cognitive S3776 OK
- **Coverage** : ≥ 80 % sur les nouveaux composants (`RepoCard`, `CategoryGrid`)

---

## Stratégie de mise à jour du contenu

Le risque #1 d'une page "awesome" : **devenir obsolète en 3 mois**.

### Process de fraîcheur (chore mensuelle, J+30)

1. Le 1er de chaque mois : relancer la recherche GitHub via `gh search repos "claude code" --sort=stars --limit=30`
2. Comparer avec la liste actuelle, identifier les nouveaux entrants et les sortants
3. Mettre à jour les compteurs étoiles approximatifs ("~25k★" plutôt que "25 312★" pour éviter la dérive)
4. Mettre à jour `dateModified` dans le frontmatter + entrée `SITE_PAGES`
5. Republier (commit + PR + merge)

À automatiser en chore Sprint 4 si l'EPIC marche : script Node `scripts/refresh-ecosystem.ts` + GitHub Action cron mensuel.

---

## Critères d'acceptation par story

### ECO-1 — Section `/ecosystem/` (3 SP)

- [ ] Dossiers `content/fr/ecosystem/` et `content/en/ecosystem/` créés avec `index.mdx`
- [ ] `app/[locale]/ecosystem/layout.tsx` créé wrappé dans `<SectionLayout>`
- [ ] `app/[locale]/ecosystem/page.tsx` créé avec rendu MDX du landing
- [ ] Entrée `ecosystem` ajoutée dans `lib/section-navigation.ts`
- [ ] Clé `sectionNav.ecosystem` ajoutée dans `messages/fr.json` ET `messages/en.json`
- [ ] Lien "Écosystème" / "Ecosystem" ajouté dans `Header.tsx` (clé i18n)
- [ ] Pages ajoutées dans `SITE_PAGES` de `lib/metadata.ts`
- [ ] Routes `/fr/ecosystem/` et `/en/ecosystem/` fonctionnent en local
- [ ] Build statique passe (`npm run build`)
- [ ] Lint + type-check OK

### ECO-2 — `/ecosystem/top-repos-github` (5 SP)

- [ ] MDX FR + EN rédigés, frontmatter valide
- [ ] Au minimum 25 repos curés, regroupés en 6+ catégories
- [ ] Composant `<RepoCard>` créé, testé (couverture ≥ 80 %)
- [ ] Composant `<CategoryGrid>` créé, testé
- [ ] JSON-LD `ItemList` injecté via une fonction dans `lib/structured-data.ts`
- [ ] FAQPage JSON-LD inclus (3-5 Q/R)
- [ ] TL;DR en haut de page (5 puces max)
- [ ] Image OG générée (`opengraph-image.tsx`)
- [ ] Liens externes en `rel="noopener nofollow"` (sauf anthropics/*)
- [ ] Test E2E Playwright (route + clic une card)
- [ ] Lighthouse ≥ 90 / a11y axe = 0 violation

### ECO-3 / ECO-4 / ECO-5 — Awesome Skills/Plugins/MCP (3 SP chacun)

Pour chacune :

- [ ] MDX FR + EN, frontmatter valide
- [ ] Min. 15 entrées curées dans la liste
- [ ] Sections thématiques (par usage : design, dev, productivity, security, etc.)
- [ ] Réutilise `<RepoCard>` et `<CategoryGrid>`
- [ ] JSON-LD `ItemList` + `FAQPage`
- [ ] TL;DR + section "Pour aller plus loin"
- [ ] OG image dédiée
- [ ] Page ajoutée dans `lib/search-index.ts` (FR + EN)

### ECO-6 — `/advanced/memoire-persistante` (3 SP)

- [ ] MDX FR + EN, frontmatter valide
- [ ] Couvre : pattern `claude-mem`, `Continuous-Claude-v3`, `graphify`, hooks `SessionStart`
- [ ] Inclut un exemple de code (skill ou hook) qui implémente le pattern
- [ ] Liens vers `/advanced/hooks` et `/prompting/context-management` (maillage)
- [ ] Frontmatter `themes: ["guide", "productivity"]`

### ECO-7 — `/advanced/optimisation-tokens` (3 SP)

- [ ] MDX FR + EN
- [ ] Couvre : prompt caching, `caveman` skill, `rtk` proxy, `claude-code-router`, `/compact`
- [ ] Tableau comparatif (composant existant `<ComparisonTable>` si livré par EPIC C3)
- [ ] Liens vers `couts-reels-claude-code.mdx` (maillage interne)
- [ ] Frontmatter `themes: ["guide", "performance"]`

### ECO-8 — `/getting-started/templates-starter-kits` (3 SP)

- [ ] MDX FR + EN
- [ ] Min. 8 templates curés (gstack, davila7, SuperClaude, get-shit-done, etc.)
- [ ] Tableau de comparaison par cas d'usage (solo dev, équipe, no-code, etc.)
- [ ] Liens vers `/getting-started/first-project` et `/personas/*` (maillage)
- [ ] Frontmatter `themes: ["tutorial", "tooling"]`

### ECO-9 — `/advanced/observabilite-monitoring` (2 SP)

- [ ] MDX FR + EN
- [ ] Couvre : `claude-hud`, observability via hooks, Matomo events custom, OpenTelemetry
- [ ] Lien vers section Matomo de `CLAUDE.md` pour cohérence
- [ ] Frontmatter `themes: ["guide", "tooling"]`

### ECO-10 / 11 / 12 — Articles éditoriaux (2-3 SP chacun)

- [ ] MDX FR + EN (slugs EN miroir possiblement différents)
- [ ] ≥ 800 mots utiles, structure : TL;DR + Contexte + Analyse + Cas pratique + Verdict
- [ ] JSON-LD `Article` (via `createArticleSchema()`)
- [ ] Image OG dédiée
- [ ] Liens vers pages `/ecosystem/*` du Sprint 1 (maillage descendant)
- [ ] Frontmatter `datePublished` et `dateModified` à jour

---

## Métriques de succès (J+90 après merge complet)

| Métrique | Valeur cible | Source |
|----------|--------------|--------|
| Nouvelles pages indexées par Google | 11+ pages | Google Search Console |
| Impressions générées sur les nouvelles pages | ≥ 3 000 / semaine | GSC, top 10 pages |
| Position moyenne sur "awesome claude code" (FR) | Top 5 | GSC |
| Position moyenne sur "meilleurs serveurs MCP" (FR) | Top 5 | GSC |
| Backlinks acquis vers `/ecosystem/*` | ≥ 5 (Reddit, HN, Dev.to, blogs FR) | Ahrefs ou backlinks manuels |
| Scroll-depth 75 % sur les pages awesome | ≥ 20 % (vs 0.3 % actuel global) | Matomo |
| Citations dans les AI Overviews (Claude, ChatGPT, Perplexity, Gemini) | ≥ 3 occurrences trackées | Tests manuels mensuels |

---

## Risques & mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Compteurs étoiles GitHub gonflés (certains repos à 178k★ en 6 mois sont suspects) | Crédibilité éditoriale entamée | Ajouter une note en haut des pages awesome : "Compteurs star à titre indicatif, sélection sur qualité éditoriale". Croiser stars + activité commits + downloads npm. |
| Obsolescence rapide (3 mois) | Trafic perdu, Google déclasse | Process mensuel de refresh (cf. ci-dessus). Indiquer `Mis à jour le YYYY-MM` en haut de chaque page. |
| Liens externes morts | UX dégradée, SEO négatif | Script `scripts/check-external-links.ts` lancé en CI mensuel |
| Cannibalisation SEO entre pages awesome | Dilution du jus de liens | Maillage interne strict : `top-repos-github` est le hub canonical, les `awesome-*` linkent vers lui en priorité |
| Repo cité contient du contenu problématique (system prompts leaks, free-claude-code wrapper, etc.) | Risque légal / réputationnel | Sélection éditoriale stricte : ne pas mettre en avant les wrappers de bypass d'auth (`free-claude-code`, IP-guards de contournement). Mentionner les leaks comme références éducatives sans encourager. |
| Trafic dilué entre les 11 nouvelles pages | ROI faible par page | Concentrer les efforts SEO (titles + descriptions + maillage) sur les 3 pages cornerstone : `top-repos-github`, `awesome-mcp-servers`, `awesome-plugins`. |

---

## Definition of Done globale (DoD)

L'EPIC est considéré comme livré quand :

- [ ] Toutes les stories MUST sont mergées sur `develop` puis `main`
- [ ] Au moins 50 % des SHOULD sont mergées
- [ ] `npm run lint && npm run type-check && npm run test` passe sur main
- [ ] `npm run build` génère bien les 11 routes attendues (`out/fr/ecosystem/*.html`, idem EN)
- [ ] Sitemap XML contient les nouvelles pages avec `priority: 0.8`
- [ ] `llms.txt` et `llms-full.txt` régénérés et contiennent les nouvelles entrées
- [ ] Lighthouse ≥ 90 sur 4 métriques pour les 3 cornerstone pages
- [ ] SonarQube : Quality Gate OK, 0 bug, 0 BLOCKER/CRITICAL
- [ ] Couverture tests ≥ 80 % maintenue
- [ ] Tests E2E Playwright passent (RG-25 visual regression incluse)
- [ ] Validation manuelle FR + EN sur `/fr/ecosystem/` et `/en/ecosystem/`
- [ ] `dateModified` à jour dans frontmatter ET `lib/metadata.ts`
- [ ] PR description liste les 11 pages et leurs URLs canoniques

---

## Planning indicatif

| Sprint | Durée | Stories | SP |
|--------|-------|---------|----|
| Sprint 1 | 2 semaines | ECO-1 → ECO-5 | 17 |
| Sprint 2 | 2 semaines | ECO-6 → ECO-9 | 11 |
| Sprint 3 | 1 semaine | ECO-10 → ECO-12 | 8 |
| **Total** | **5 semaines** | **12 stories** | **36 SP** |

---

## Annexe : repos sources de l'inventaire (mai 2026)

Liste exhaustive utilisée pour bâtir cet EPIC, classée par catégorie ECO-2.

### Harness, frameworks, méta-systèmes

- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) — 178k★
- [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — 60k★
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — 52k★
- [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) — 23k★

### Skills (ECO-3)

- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — 59k★
- [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) — 124k★
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — 38k★
- [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) — 37k★
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 76k★
- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — 57k★
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — 28k★

### Plugins (ECO-4)

- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — 19k★ (officiel Anthropic)
- [ComposioHQ/awesome-claude-plugins](https://github.com/ComposioHQ/awesome-claude-plugins) — 1.6k★
- [Kamalnrf/claude-plugins](https://github.com/Kamalnrf/claude-plugins) — 510★
- [timescale/pg-aiguide](https://github.com/timescale/pg-aiguide) — 1.7k★

### MCP servers (ECO-5)

- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — 87k★ (référence)
- [appcypher/awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers) — 5.5k★
- [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) — 4k★
- [punkpeye/awesome-mcp-clients](https://github.com/punkpeye/awesome-mcp-clients) — 6.4k★
- [rohitg00/awesome-devops-mcp-servers](https://github.com/rohitg00/awesome-devops-mcp-servers) — 981★
- [Puliczek/awesome-mcp-security](https://github.com/Puliczek/awesome-mcp-security) — 692★
- [chatmcp/mcpso](https://github.com/chatmcp/mcpso) — 2k★

### Mémoire & contexte (ECO-6)

- [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) — 74k★
- [parcadei/Continuous-Claude-v3](https://github.com/parcadei/Continuous-Claude-v3) — 3.8k★
- [safishamsi/graphify](https://github.com/safishamsi/graphify) — 46k★

### Optimisation tokens (ECO-7)

- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — 57k★
- [rtk-ai/rtk](https://github.com/rtk-ai/rtk) — 46k★
- [musistudio/claude-code-router](https://github.com/musistudio/claude-code-router) — 34k★
- [router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) — 32k★
- [starbaser/ccproxy](https://github.com/starbaser/ccproxy) — 400★

### Templates & starter kits (ECO-8)

- [garrytan/gstack](https://github.com/garrytan/gstack) — 93k★
- [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) — 27k★
- [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) — 23k★
- [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) — 61k★

### Multi-agents & swarms

- [ruvnet/ruflo](https://github.com/ruvnet/ruflo) — 48k★
- [wshobson/agents](https://github.com/wshobson/agents) — 35k★
- [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) — 33k★
- [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) — 57k★

### Hooks & observabilité (ECO-9)

- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — 22k★
- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) — 3.6k★
- [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) — 1.4k★
- [karanb192/claude-code-hooks](https://github.com/karanb192/claude-code-hooks) — 379★
- [hoangsonww/Claude-Code-Agent-Monitor](https://github.com/hoangsonww/Claude-Code-Agent-Monitor) — 347★

### Internals / system prompts (ECO-10)

- [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) — 137k★
- [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) — 40k★

### Awesome (transverse)

- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) — 43k★
- [luongnv89/claude-howto](https://github.com/luongnv89/claude-howto) — 32k★

### Clients & UIs (référence dans ECO-2 seulement)

- [farion1231/cc-switch](https://github.com/farion1231/cc-switch) — 66k★
- [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio) — 45k★
- [iOfficeAI/AionUi](https://github.com/iOfficeAI/AionUi) — 24k★

### Outils ressources humaines / business (mention dans use-cases existante)

- [santifer/career-ops](https://github.com/santifer/career-ops) — 44k★
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — 28k★
