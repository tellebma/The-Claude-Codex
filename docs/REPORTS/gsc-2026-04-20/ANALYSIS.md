# Rapport GSC — 2026-04-20

> Période analysée : **2026-03-11 → 2026-04-18** (38 jours)
> Source : Google Search Console, propriété `sc-domain:claude-codex.fr`
> Données brutes : `gsc-queries-2026-03-11_2026-04-18.csv` + `gsc-pages-2026-03-11_2026-04-18.csv`

---

## Vue d'ensemble

| Métrique | Valeur |
|----------|--------|
| Clics totaux (tableau) | 47 |
| Clics totaux (dashboard) | 89 (la différence = queries anonymisées par Google) |
| Impressions totales | 1 648 (queries connues) |
| Requêtes distinctes | 348 |
| Pages avec impressions | 94 |
| CTR global (queries connues) | 2,85 % |
| Position moyenne | 7,5 |

**Lecture** : le site est indexé correctement, Google nous montre en moyenne à la 7e-8e position sur nos queries. Volume faible mais qualifié. Le CTR global est modeste (2,85 % vs 3-5 % de médiane pour position 7).

---

## Analyse par typologie de requêtes

### 1. Brand queries (nom du site)

| Query | Clics | Impressions | CTR | Position |
|-------|-------|-------------|-----|----------|
| claude codex | 21 | 382 | 5,5 % | 3,4 |
| codex claude | 12 | 143 | 8,4 % | 3,0 |
| claud codex | 1 | 4 | 25 % | 1,2 |

**Verdict** : 34/47 clics (72 %) viennent de queries brand. Le site est trouvé par des gens qui connaissent déjà son nom. Bon signal de notoriété, mais peu de découverte organique pure.

### 2. Queries comparatives "X vs Y"

Très fréquentes sur le trio **Claude Code / Codex / GitHub Copilot**. Exemples :

| Query | Imp | Clics | Position |
|-------|-----|-------|----------|
| codex vs claude code vs github copilot | 38 | 1 | 5,9 |
| github copilot vs claude code vs codex | 37 | 1 | 5,6 |
| claude code vs codex vs github copilot | 27 | 1 | 7,8 |
| copilot vs claude code vs codex | 7 | 1 | 6,1 |

**Verdict** : forte demande SEO sur le thème "comparatif IDE IA". Nos pages `/en/limits/vs-copilot/` et `/en/limits/vs-cursor/` répondent mais la page vs-copilot a un CTR de seulement 1 % sur 1 253 imp → titre ou meta-description pas assez percutants.

### 3. Queries techniques env variables

Sujet sur lequel on reçoit beaucoup d'impressions avec CTR faible :

| Query | Imp | Pos |
|-------|-----|-----|
| "claudecode.environmentvariables": [ | 4 | 3,8 |
| "claudecode.environmentvariables" | 17 | 7,8 |
| claude code anthropic_base_url environment variable | 12 | 9,2 |
| claude code max_thinking_tokens environment variable | 7 | 8,1 |
| claude code no_proxy | 7 | 9,0 |
| claude code environment variables | 7 | 7,0 |
| claude environment variables | 7 | 7,4 |
| bash_max_output_length | 10 | 7,7 |

Ces queries atterrissent toutes sur `/en/reference/environment/` qui totalise **2 033 impressions cumulées** (avec et sans trailing slash) mais seulement **10 clics** (CTR 0,5 %).

### 4. Queries à fort potentiel sous-exploité

| Query | Imp | Clics | Position |
|-------|-----|-------|----------|
| anthropic_api_key=sk-ant leaked environment | 96 | 0 | 6,9 |
| what is the primary difference between plan mode and thinking mode in claude code? | 38 | 0 | 10,0 |
| codex claude code | 33 | 0 | 6,9 |
| github copilot vs codex vs claude code | 27 | 0 | 6,4 |
| claude code security best practices | 11 | 0 | 8,3 |

**"anthropic_api_key=sk-ant leaked environment"** est la 3e query en impressions et 0 clic : signal d'un besoin urgent (quelqu'un a leaké sa clé, il cherche comment réagir). Une page dédiée = gros potentiel.

---

## Analyse par page (top impressions)

| URL | Imp | Clics | CTR | Position |
|-----|-----|-------|-----|----------|
| `/en/limits/vs-copilot/` | 1 253 | 12 | 1,0 % | 7,6 |
| `/en/reference/environment/` | 1 129 | 8 | 0,7 % | 7,7 |
| `/en/reference/environment` (sans slash) | 904 | 2 | 0,2 % | 9,3 |
| `/` (racine) | 715 | 41 | 5,7 % | 4,4 |
| `/en/limits/vs-copilot` (sans slash) | 311 | 1 | 0,3 % | 6,3 |
| `/fr/content/bonnes-pratiques-securite/` | 267 | 2 | 0,7 % | 7,3 |
| `/en/content/bonnes-pratiques-securite/` | 231 | 0 | 0 % | 7,0 |
| `/fr/` | 156 | 8 | 5,1 % | 3,2 |
| `/en/prompting/thinking-and-planning/` | 120 | 0 | 0 % | 9,3 |
| `/en/` | 89 | 1 | 1,1 % | 5,7 |
| `/mcp/what-are-mcps` (sans locale !) | 82 | 0 | 0 % | 6,4 |
| `/en/skills/best-skills` (sans slash) | 80 | 0 | 0 % | 7,3 |
| `/en/agents/what-are-agents/` | 58 | 0 | 0 % | 13,4 |

---

## 🚨 Problèmes critiques détectés

### P0 — Bug de canonicalisation (trailing slash)

Les URLs apparaissent **deux fois** dans l'index Google (avec et sans slash) :
- `/en/reference/environment/` = 1 129 imp + `/en/reference/environment` = 904 imp
- `/en/limits/vs-copilot/` = 1 253 imp + `/en/limits/vs-copilot` = 311 imp
- `/en/skills/best-skills` (sans slash) = 80 imp sans aucun clic
- `/mcp/what-are-mcps` (SANS locale et sans slash) = 82 imp — **fuite grave**

**Impact** : Google pense qu'il y a des contenus dupliqués et répartit le jus PageRank entre les deux URLs → perte de position de 1-3 rangs sur chaque page.

**Action** : le projet a `trailingSlash: true` dans `next.config.mjs`, donc le canonical est la version AVEC slash. Il faut :
1. Vérifier les balises `<link rel="canonical">` sur chaque page (devrait pointer vers la version avec slash)
2. Ajouter des redirections 301 dans NPM : `/en/reference/environment` → `/en/reference/environment/`
3. Vérifier le cas `/mcp/what-are-mcps` (sans `/fr/` ni `/en/`) : comment Google a-t-il indexé cette URL sans locale ?

### P0 — Pages 0 clics sur gros volume d'impressions

Ces pages sont visibles dans Google mais PERSONNE ne clique :
- `/en/content/bonnes-pratiques-securite/` : 231 imp, 0 clics
- `/en/prompting/thinking-and-planning/` : 120 imp, 0 clics
- `/en/skills/best-skills` : 80 imp, 0 clics
- `/en/reference/cheatsheet/` : 67 imp, 0 clics
- `/en/agents/what-are-agents/` : 58 imp, 0 clics

**Hypothèses** :
- Titres SEO pas assez accrocheurs pour leurs queries
- Meta descriptions absentes ou génériques
- URLs françaises sur contenu EN (`bonnes-pratiques-securite` déjà fixé par MT1 ✅)

**Action** : audit titre + description de chaque page, optimiser pour les queries qu'elles reçoivent.

### P0 — Query anthropic_api_key leaked (96 imp, 0 clic)

Requête brûlante (quelqu'un panique) à laquelle notre site est indexé sans avoir de contenu dédié clair. Position 6,9 = on est dans le top 10 mais invisible.

**Action** : créer ou enrichir une page `/en/security/leaked-api-key/` avec :
- Plan d'action immédiat (révoquer, rotation, audit logs)
- Bonnes pratiques préventives (.env, gitignore, secrets manager)
- Lien vers la page sécurité générale

---

## Actions prioritaires post-MT1

### Sprint 1 — Immédiat (cette semaine)

1. **Dédoublonnage trailing slash** (nouveau ticket **MT22**, 2 SP)
   - Ajouter 301 NPM pour toutes les URLs sans slash vers version avec slash
   - Regex NPM : `location ~ ^(/[^/]+(/[^/]+)*?)$ { return 301 $1/; }` (exclure root et fichiers .xml/.txt)
   - Vérifier que les balises canonical dans `src/lib/metadata.ts` pointent vers la version avec slash
2. **Résoudre l'URL sans locale** `/mcp/what-are-mcps` (82 imp fuite) — nouveau ticket **MT23**, 1 SP
   - Identifier l'ancienne URL pre-i18n encore indexée
   - Ajouter redirect NPM `/mcp/* → /fr/mcp/*`
3. **Enrichir `/en/limits/vs-copilot/`** (1 253 imp, CTR 1 %) — MT3 revisité (3 SP)
   - Titre SEO : "Claude Code vs GitHub Copilot : comparatif 2026 (features, prix, performance)"
   - Meta description orientée bénéfice
   - Contenu : tableau comparatif précis, cas d'usage
4. **Enrichir `/en/reference/environment/`** (2 033 imp cumul, CTR 0,5 %) — nouveau ticket **MT24**, 3 SP
   - Lister toutes les variables (`ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `CLAUDE_CODE_MAX_OUTPUT_TOKENS`, `NO_PROXY`, `HTTP_PROXY`, `HTTPS_PROXY`, `MAX_THINKING_TOKENS`, `BASH_MAX_OUTPUT_LENGTH`, etc.)
   - Exemples VS Code et shell
   - Section "Troubleshooting env variables"

### Sprint 2 — Contenu à créer

5. **Nouveau post `/en/content/leaked-api-key/`** (96 imp query sk-ant) — **MT14 refocus** (3 SP)
6. **Nouveau post `/en/content/plan-vs-thinking-mode/`** (38 imp query literale) — **MT14b** (3 SP)
7. **Post comparatif bundle "Claude Code / Codex / Copilot"** (138 imp cumulées sur variantes) — **MT14c** (3 SP)

### Ongoing

- Surveiller l'impact de **MT1** (renommage slugs EN) sur les positions des pages `/en/content/*` dans 2-4 semaines
- Re-extract hebdo les données GSC (voir **MT21** : automatiser via GitHub Action quand le volume justifie)

---

## KPIs à suivre dans 30 jours

| KPI | Baseline 2026-04-20 | Cible 2026-05-20 |
|-----|---------------------|-------------------|
| Clics GSC / mois | ~89 | 150+ |
| CTR moyen | 1,4 % | 2,5 % |
| Position moyenne | 7,5 | 6,5 |
| Pages avec 0 clic et >50 imp | 6 | 2 |
| Queries brand vs non-brand | 72/28 | 60/40 |

---

## Annexe — Méthode de collecte

1. Navigation playwright sur https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aclaude-codex.fr
2. Authentification manuelle utilisateur (compte propriétaire GSC)
3. Extraction du tableau Queries (348 lignes) puis switch onglet Pages (94 lignes)
4. Export CSV dans `docs/REPORTS/gsc-2026-04-20/`
5. Analyse Python (agrégation, tri, détection opportunités)

Pour reproduire automatiquement : voir **MT21** (GitHub Action hebdo via API GSC + service account).
