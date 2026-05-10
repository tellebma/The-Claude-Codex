# EPIC : SEO et GEO (Generative Engine Optimization) — Mai 2026

> Source : rapport analytics hebdo 2026-05-01 (Google Search Console + Matomo) — `claude-code-obsidian-brain/raw/analytics/2026-05-01/REPORT.md`
> Date : 2026-05-06
> Effort estime : 27 story points (10 stories sur 4 sprints)
> Pre-requis : aucun (orthogonal a la refonte graphique RG-XX en cours, sauf US-9 qui peut etre couplee a la fin de RG)

---

## Contexte

L'audit hebdo GSC + Matomo de la semaine `2026-04-25 -> 2026-05-01` revele 16 alertes critiques et 57 a surveiller. Les chiffres bruts :

| Metrique | Valeur |
|----------|--------|
| Queries GSC distinctes | 1 409 |
| Pages avec impressions | 234 |
| Pages avec pageview Matomo | 78 |
| Evenements engagement Matomo (semaine) | 13 |
| Pages avec scroll 75 % | 0,3 % des pageviews (1 sur 374) |

### Constat principal : le contenu est solide, le CTR est cassé

Les pages les plus impactees ont un **contenu complet et pertinent** (ex. `/en/reference/environment/` = 705 lignes, exhaustive, bien structuree). Le probleme n'est donc pas editorial, il est dans :

1. **Title et meta description** trop generiques face a la concurrence (anthropic.com, github.com)
2. **Aucun balisage FAQPage** ni DefinedTerm sur les pages de reference (perdu pour les AI Overviews et Featured Snippets)
3. **Signaux de fraicheur stagnants** : `dateModified` souvent en 2026-03 ou 2026-04 alors qu'on est en 2026-05
4. **Tracking Matomo casse** : 78 pages Matomo vs 234 pages GSC, et 1 seul scroll 75 % sur 374 pageviews → soit le hook `useScrollDepthTracking` ne se monte pas, soit les filtres bots Matomo masquent le trafic reel
5. **Aucun ciblage GEO** sur les queries longue traine "official docs" qui dominent les impressions

### Refonte graphique : impact

La refonte (RG-XX) modifie les composants UI et les tokens de design. Elle ne touche pas au frontmatter MDX, au contenu textuel, aux schemas JSON-LD ni a `metadata.ts`. **Toutes les stories de cet EPIC peuvent etre lancees en parallele de la refonte**, sauf US-9 (compteurs de section dans `SectionLayout`) qui depend de la sortie de RG-26.

---

## Top 5 des opportunites identifiees

### #1 — `/en/reference/environment/` : 22 450 impressions, 8 clics (CTR 0,04 %)

**La fuite de trafic la plus grosse du site.** Title actuel : `Claude Code environment variables: complete reference (API key, proxy, limits)`. Bonne page (705 lignes), mais la page apparait en position 6,8 sur des queries hyper specifiques :

| Query | Impressions | CTR | Position |
|-------|------------:|----:|---------:|
| claude code environment variables anthropic_base_url anthropic_auth_token official docs | 653 | 0 % | 6,7 |
| anthropic claude code anthropic_api_key environment variable docs | 326 | 0 % | 5,7 |
| claude code environment variables anthropic_base_url anthropic_auth_token | 320 | 0 % | 8,0 |

**Diagnostic** : l'utilisateur veut la *doc officielle*. Notre titre dit "complete reference" sans contenir "official docs", "documentation" ou les noms exacts de variables. Google AI Overview ou anthropic.com captent le clic.

**Action** : reecrire title + description pour matcher l'intention "doc officielle / reference complete", ajouter un FAQ schema avec les Q/R correspondant exactement aux query opportunities, ajouter un TL;DR en debut de page lisible par les AI Overviews.

### #2 — `/en/content/leaked-api-key-recovery/` : pos 4,7 mais CTR 0,8 %

Titre correct (`Leaked Anthropic API key? Step-by-step recovery (2026)`). Position elevee (4,7), CTR anormalement bas. Suggere un snippet pas attractif. Action : auditer le rendu de la SERP (description trop longue, manque de chiffres ou d'urgence).

### #3 — 35 pages avec position drop > 2 rangs

Mouvement massif sur la semaine. Les chutes les plus inquietantes :

| Page | Avant | Apres | Delta |
|------|------:|------:|------:|
| `/en/personas/team-lead/` | 10,0 | 35,0 | +25 |
| `/fr/content/` | 5,4 | 24,8 | +19,4 |
| `/fr/agents/` | 4,0 | 12,0 | +8 |
| `/en/agents/what-are-agents/` | 5,6 | 11,2 | +5,6 |

Cause probable : dilution du signal de fraicheur (pages pas mises a jour) ou refonte graphique qui touche des composants avec ancres internes / liens.

**Action** : audit fraicheur (`dateModified`), audit maillage interne (qui linke vers ces pages ?), republication ciblee avec mise a jour `dateModified` + ajout d'une section "Updated 2026-05".

### #4 — Queries GEO orphelines

Personne ne clique sur `why is claude ai trending 2026` (303 + 77 impressions, 0 clic, position 10,5). C'est une intention de recherche **conversationnelle / generative** — le user attend une reponse synthetique, pas un blog post. Notre page `trends-2026` n'est pas formattee pour les AI Overviews.

**Action** : ajouter une section "TL;DR / Why is Claude AI trending in 2026" sous forme de Q/R en haut de la page + FAQPage schema.

### #5 — Tracking Matomo casse

- 78 pages Matomo / 234 pages GSC → un tiers des pages tracees seulement
- 1 scroll 75 % sur 374 pageviews → hook scroll depth probablement KO
- 4 alertes `tracking_mismatch` (clics GSC sans pageview Matomo)

Le hook `useScrollDepthTracking` est mente dans `SectionLayout`. Soit le composant n'est pas monte sur ces pages (pages racine de section, /content/* ?), soit la consent / cookieless config Matomo filtre. A confirmer en debug local.

---

## Priorisation MoSCoW

### MUST HAVE (10 SP, Sprint 1) — quick wins CTR

| ID | Story | SP | Pages cibles |
|----|-------|----|--------------|
| SEO-1 | Reecriture title + meta description sur `/reference/environment/` (FR + EN) avec angle "official docs / complete reference" et noms exacts des variables | 2 | `/{locale}/reference/environment` |
| SEO-2 | Reecriture title + description sur les 14 pages avec CTR critique (impressions > 100, CTR < 0,5 %) | 5 | 14 pages CRIT du rapport |
| SEO-3 | Refresh `dateModified` + signal "Updated 2026-05" sur les 10 pages les plus rentables (top GSC impressions) | 3 | top GSC du rapport |

### SHOULD HAVE (8 SP, Sprint 2) — GEO et AI Overviews

| ID | Story | SP | Pages cibles |
|----|-------|----|--------------|
| SEO-4 | Ajouter FAQPage schema sur les 6 pages a forte intention conversationnelle (`/reference/environment/`, `/content/leaked-api-key-recovery/`, `/future/trends-2026/`, `/content/security-best-practices/`, `/mcp/mcp-security/`, `/agents/what-are-agents/`) | 5 | 6 pages |
| SEO-5 | Ajouter une section TL;DR / Quick answer en haut de chaque page reference et tutoriel longue traine, format Q/R 3-5 lignes max | 3 | 10 pages reference |

### COULD HAVE (5 SP, Sprint 3) — recovery position drops

| ID | Story | SP | Pages cibles |
|----|-------|----|--------------|
| SEO-6 | Audit + republication des 10 pages avec position drop > 3 rangs (refresh contenu, dateModified, internal linking) | 3 | top 10 drops du rapport |
| SEO-7 | Audit du maillage interne : grep des liens vers les 10 pages en chute, verification qu'aucune ancre ou path n'est casse par la refonte (RG) | 2 | scripts/audit + corrections |

### WON'T HAVE (4 SP, Sprint 4) — backend tracking

| ID | Story | SP | Description |
|----|-------|----|-------------|
| SEO-8 | Debug du tracking Matomo : verifier `useScrollDepthTracking` sur toutes les routes, ajouter des logs en dev, valider avec Matomo dev tools | 3 | hooks + analytics |
| SEO-9 | Coupler `AnalyticsTracker` aux pages racine de section (overview pages) qui n'ont pas `SectionLayout` | 1 | `/{locale}/{section}/page.tsx` |

---

## User Stories detaillees

### SEO-1 : Reecriture title + description `/reference/environment/` (2 SP)

> En tant que **dev qui cherche la doc officielle des variables d'environnement Claude Code**, je veux que la page de reference du Codex apparaisse en haut des resultats avec un titre qui repond exactement a ma query, afin de cliquer dessus au lieu de scroller jusqu'a anthropic.com.

**Avant** :
- title : `Claude Code environment variables: complete reference (API key, proxy, limits)`
- description : `Every Claude Code environment variable documented: ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, BASH_MAX_OUTPUT_LENGTH, MAX_THINKING_TOKENS, NO_PROXY, claudeCode.environmentVariables.`

**Apres (proposition)** :
- title : `Claude Code environment variables: official reference (ANTHROPIC_API_KEY, BASE_URL, AUTH_TOKEN, MODEL)` (sous 70 chars sinon Google tronque)
- description : `The complete reference for Claude Code environment variables: ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL, proxy and MCP settings. With copy-paste examples for shell, Docker and CI/CD.`

**Criteres d'acceptation** :
- [ ] Title contient `ANTHROPIC_API_KEY`, `BASE_URL`, `AUTH_TOKEN` ou `MODEL` (au moins 2)
- [ ] Title sous 70 caracteres (verif Google SERP truncation)
- [ ] Description sous 160 caracteres (apparaitre integralement) ou 320 si on accepte le truncate mobile
- [ ] Description liste 3 cas d'usage concrets (shell, Docker, CI/CD)
- [ ] Idem en FR avec keyword `documentation officielle`
- [ ] Verifier en preview SERP avec un tool type [SERPSim](https://serpsim.com)

**Fichiers concernes** :
- `content/en/reference/environment.mdx` (frontmatter)
- `content/fr/reference/environment.mdx` (frontmatter)
- `src/lib/metadata.ts` (mettre a jour `lastModified` correspondant a la date du jour)

---

### SEO-2 : Reecriture title + description des 14 pages CRIT (5 SP)

> En tant que **visiteur qui voit la page Codex apparaitre en SERP**, je veux un titre et un snippet attractifs qui me donnent envie de cliquer plutot que de scroller, afin que le site convertisse les impressions en clics.

**Pages concernees** (CTR urgent du rapport) :
- `/en/agents/agent-sdk/` (144 imp, pos 7,3)
- `/en/agents/what-are-agents/` (487 imp, pos 11,2)
- `/en/content/security-best-practices` (103 imp, pos 6,0)
- `/en/enterprise/faq/` (130 imp, pos 8,2)
- `/en/future/trends-2026` (752 imp, pos 8,5)
- `/en/mcp/mcp-security/` (400 imp, pos 7,1)
- `/en/mcp/what-are-mcps/` (162 imp, pos 6,9)
- `/en/plugins/best-design/` (162 imp, pos 7,3)
- `/en/plugins/setup/` (222 imp, pos 6,1)
- `/en/prompting/` (307 imp, pos 7,5)
- `/en/skills/best-skills/` (203 imp, pos 7,6)
- `/en/skills/comparison/` (179 imp, pos 6,7)
- `/fr/content/bonnes-pratiques-securite/` (135 imp, pos 7,5)
- `/fr/content/fuite-cle-api/` (158 imp, pos 6,4)
- `/fr/content/skills-guide/` (102 imp, pos 9,0)

**Criteres d'acceptation** (par page) :
- [ ] Title commence par un mot d'action ou un chiffre ("How to", "5 patterns", "Complete guide", etc.)
- [ ] Title contient le keyword principal au debut
- [ ] Description termine par un benefice clair ou un CTA implicite
- [ ] FR et EN traites en miroir avec le meme angle
- [ ] `dateModified` mise a jour a la date du jour
- [ ] `lastModified` correspondante dans `SITE_PAGES` (`metadata.ts`)

**Estimation effort** : ~20 min par page x 14 pages = ~5h.

**Fichiers concernes** : 14 fichiers MDX FR + 14 EN + `metadata.ts`.

---

### SEO-3 : Refresh dateModified + bandeau "Updated" (3 SP)

> En tant que **moteur de recherche evaluant la fraicheur**, je veux voir un signal `dateModified` recent et un indicateur visuel "Updated 2026-05" sur les pages a fort trafic, afin de continuer a les classer en haut.

**Pages cibles** (top 10 GSC impressions) :
- `/en/reference/environment/`
- `/en/content/claude-design-vs-figma/`
- `/en/content/leaked-api-key-recovery/`
- `/en/future/trends-2026/`
- `/en/limits/vs-copilot/`
- `/en/content/security-best-practices/`
- `/en/mcp/`
- `/en/mcp/best-development/`
- `/en/plugins/best-security/`
- `/en/agents/what-are-agents/`

**Criteres d'acceptation** :
- [ ] Frontmatter `dateModified` = date du jour
- [ ] Entree `lastModified` correspondante dans `SITE_PAGES` (metadata.ts)
- [ ] Optionnel : bandeau "Mis a jour : Mai 2026" / "Updated: May 2026" en debut de page
- [ ] Sitemap regenere : `npm run build` puis verif `/sitemap.xml`

**Note** : pas de modification de contenu requise pour cette US — c'est un refresh signal pur. Pour un refresh contenu reel, voir SEO-6.

**Fichiers concernes** : 10 fichiers MDX FR + 10 EN + `metadata.ts`.

---

### SEO-4 : FAQPage schema sur 6 pages strategiques (5 SP)

> En tant que **utilisateur d'un AI Overview Google ou ChatGPT**, je veux que la page Codex soit citee comme source d'une reponse, afin que mes donnees (questions/reponses bien structurees) atterrissent dans la generation de l'IA.

Le helper `createFAQPageSchema` existe deja dans `src/lib/structured-data.ts` (utilise sur 1 seule page : `getting-started/[slug]` pour `faq-beginner`). Il faut l'etendre.

**Pages cibles** :

1. `/reference/environment/` — extraire 8 Q/R des plus grosses query opportunities ("Where does Claude Code read environment variables?", "What is ANTHROPIC_BASE_URL?", "How to set ANTHROPIC_AUTH_TOKEN behind a corporate proxy?", etc.)
2. `/content/leaked-api-key-recovery/` — la page contient deja une section FAQ, il suffit de la mapper en schema
3. `/future/trends-2026/` — repondre a `why is claude ai trending 2026` (Q/R), `what are the AI coding trends in 2026?`
4. `/content/security-best-practices/` — Q/R de securite
5. `/mcp/mcp-security/` — Q/R MCP security
6. `/agents/what-are-agents/` — `What is a Claude Code agent?`, `How to create an agent?`, etc.

**Criteres d'acceptation** :
- [ ] Chaque page a 5 a 10 Q/R en FAQPage schema (JSON-LD)
- [ ] Les Q/R sont **visibles dans le DOM** (Google exige une correspondance entre schema et contenu visible)
- [ ] Validation via [Rich Results Test](https://search.google.com/test/rich-results) sur l'URL deployee
- [ ] FR et EN traites
- [ ] Refactor : creer un composant `<FAQ items={[...]}>` qui rend a la fois le HTML visible et injecte le schema (eviter la duplication)

**Fichiers concernes** :
- `src/components/mdx/Faq.tsx` (nouveau composant a creer)
- `src/components/mdx/MdxComponents.tsx` (ajout du composant)
- 6 pages MDX FR + 6 EN
- `src/app/[locale]/{section}/[slug]/page.tsx` (injection du schema cote serveur si le composant n'a pas acces au render server-side)

---

### SEO-5 : TL;DR Q/R en haut de page (3 SP)

> En tant que **lecteur arrivant depuis un AI Overview ou en lecture rapide**, je veux la reponse claire a ma question dans les 3 premieres lignes de la page, afin de la valider et eventuellement la copier dans mon code immediatement.

**Pages cibles** : 10 pages reference + tutoriel longue traine (recouvre SEO-3 + 1-2 pages enterprise).

**Criteres d'acceptation** :
- [ ] Section `## Quick answer` (EN) / `## En bref` (FR) en debut de page, juste apres le hero
- [ ] Format : 1 phrase de reponse + 1 bloc de code copiable (max 5 lignes) + lien vers la section detaillee
- [ ] Repondre directement a la query dominante de la page (cf. rapport pour identifier la query)
- [ ] Chaque page testee : "puis-je copier-coller le code de la TL;DR sans rien lire d'autre et resoudre mon probleme ?" → si oui, OK

**Exemple concret pour `/reference/environment/`** :

```mdx
## Quick answer

Set `ANTHROPIC_API_KEY` in your shell rc file or `.env`, and Claude Code reads it on launch:

\`\`\`bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
\`\`\`

Need a corporate proxy or a different model? See [Authentication variables](#authentication-variables) and [the precedence table](#precedence-order).
```

**Fichiers concernes** : 10 a 12 pages MDX FR + 10 a 12 EN.

---

### SEO-6 : Audit + republication des 10 pages en chute (3 SP)

> En tant que **proprietaire du site**, je veux comprendre pourquoi 35 pages perdent des positions cette semaine et corriger la cause racine sur les 10 plus impactees, afin de stabiliser le trafic organique.

**Pages prioritaires** (drops > 3 rangs) :
- `/en/personas/team-lead/` (+25 rangs, alerte rouge)
- `/fr/content/` (+19,4)
- `/fr/agents/` (+8)
- `/fr/agents/best-agents/` (+6,7)
- `/en/agents/what-are-agents/` (+5,6)
- `/fr/plugins/setup/` (+5,7)
- `/fr/getting-started/installation` (+3,2)
- `/fr/getting-started/environment-setup/` (+7)
- `/fr/future/trends-2026/` (+5,1)
- `/en/getting-started/first-project/` (+4,3)

**Criteres d'acceptation par page** :
- [ ] Verifier que la page existe toujours (pas d'erreur 404 cachee)
- [ ] Verifier que les ancres internes sont preservees (refonte graphique a-t-elle modifie un IDgenerator ?)
- [ ] Verifier le maillage interne entrant (au moins 3 pages internes pointent vers elle)
- [ ] Refresh contenu : ajouter ou affiner 100-200 mots, idealement avec 2-3 nouveaux exemples
- [ ] `dateModified` mise a jour
- [ ] Ajouter 1-2 liens internes contextuels vers d'autres pages thematiques
- [ ] Surveiller le rebond une semaine plus tard sur le rapport hebdo suivant

**Fichiers concernes** : 10 fichiers MDX (mix FR / EN).

---

### SEO-7 : Audit maillage interne post-refonte graphique (2 SP)

> En tant que **dev**, je veux verifier que la migration vers les tokens C1 (RG-XX) n'a casse aucun lien interne, ancre ou identifiant utilise par d'autres pages, afin que les positions chutees ne soient pas dues a 404 / fragments casses.

**Criteres d'acceptation** :
- [ ] Script qui crawle l'output `out/` apres `npm run build` et detecte les liens internes 404
- [ ] Script qui verifie que toutes les ancres `#section-id` referencees dans des liens internes existent dans la page cible
- [ ] Rapport : `reports/internal-links-audit-{date}.md` avec liste des problemes trouves
- [ ] Corrections appliquees aux liens casses
- [ ] Optionnel : integrer le script en CI (`.github/workflows/ci.yml`) en mode "warn" puis "fail"

**Fichiers concernes** :
- `scripts/audit-internal-links.ts` (nouveau)
- `package.json` (ajout `npm run audit:links`)
- `.github/workflows/ci.yml` (optionnel)

---

### SEO-8 : Debug tracking Matomo (3 SP)

> En tant que **proprietaire du site**, je veux que Matomo trace de facon fiable les pageviews et events de scroll sur toutes les pages, afin de mesurer reellement l'engagement et detecter les pages a probleme.

**Symptomes** :
- 78 pages Matomo vs 234 pages GSC : 67 % des pages avec impressions ne tracent rien
- 1 scroll 75 % sur 374 pageviews : hook scroll quasi mort
- 4 alertes `tracking_mismatch` : clics GSC sans pageview Matomo

**Causes possibles** :
- `useScrollDepthTracking` monte uniquement dans `SectionLayout`, donc absent des landing / 404 / overview pages
- Configuration Matomo filtre les bots de facon agressive
- CSP ou consent block le script
- En SSG, le pageview initial n'est pas tire (next-themes ou hydration delay)

**Criteres d'acceptation** :
- [ ] Reproduire en local avec `NEXT_PUBLIC_MATOMO_URL` configure → tester scroll + verifier dans Matomo dev console que les events partent
- [ ] Lister les routes ou `AnalyticsTracker` n'est pas monte → corriger via SEO-9
- [ ] Verifier que `_paq.push(['trackPageView'])` est appele apres chaque navigation (App Router transitions)
- [ ] Documenter le funnel de tracking dans `docs/analytics-tracking.md`
- [ ] Resoudre les 4 alertes `tracking_mismatch`

**Fichiers concernes** :
- `src/hooks/useScrollDepthTracking.ts`
- `src/components/analytics/AnalyticsTracker.tsx`
- `src/lib/analytics/matomo.ts`
- `src/app/[locale]/layout.tsx`

---

### SEO-9 : Couvrir les pages racine de section (1 SP)

> En tant que **dev**, je veux que les pages d'overview (`/{locale}/{section}/page.tsx`) tracent aussi le scroll et les liens externes, afin d'avoir une vision complete de l'engagement.

Pages concernees (n'utilisent pas `SectionLayout`) : toutes les overview pages (`/getting-started/`, `/mcp/`, `/skills/`, `/plugins/`, `/agents/`, `/prompting/`, `/advanced/`, `/enterprise/`, `/future/`, `/limits/`, `/personas/`, `/use-cases/`, `/content/`, `/configurator/`, `/about/`).

**Criteres d'acceptation** :
- [ ] `<AnalyticsTracker />` monte sur chaque overview page (composant client invisible)
- [ ] Verification Matomo : scroll depth events arrivent sur ces pages
- [ ] Pas de regression sur les pages utilisant deja `SectionLayout`

**Fichiers concernes** : 15 fichiers `page.tsx` racine.

---

## Sprint Planning

### Sprint 1 (Mai 2026, S1) — Quick wins CTR — 10 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-1 | Title + description `/reference/environment/` | 2 | ⬜ |
| SEO-2 | Title + description sur 14 pages CRIT | 5 | ⬜ |
| SEO-3 | Refresh `dateModified` top 10 pages | 3 | ⬜ |

**Effort** : ~2 jours.
**Impact attendu** : +5 a +15 % de CTR sur les 14 pages, +200 a +500 clics par semaine si la position se maintient.

### Sprint 2 (Mai 2026, S2) — GEO et AI Overviews — 8 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-4 | FAQPage schema sur 6 pages strategiques | 5 | ⬜ |
| SEO-5 | Section TL;DR sur 10-12 pages | 3 | ⬜ |

**Effort** : ~2 jours.
**Impact attendu** : apparition dans Google AI Overviews et People Also Ask, citations dans Perplexity / ChatGPT search.

### Sprint 3 (Mai 2026, S3) — Recovery position drops — 5 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-6 | Audit + republication des 10 pages en chute | 3 | ⬜ |
| SEO-7 | Audit maillage interne post-RG | 2 | ⬜ |

**Effort** : ~1,5 jour.
**Impact attendu** : recuperation des positions 4-6 perdues sur les 10 pages.

### Sprint 4 (Mai 2026, S4) — Backend tracking — 4 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-8 | Debug Matomo tracking | 3 | ⬜ |
| SEO-9 | Couvrir overview pages avec AnalyticsTracker | 1 | ⬜ |

**Effort** : ~1 jour.
**Impact attendu** : visibilite reelle de l'engagement → pilotage des sprints SEO suivants.

---

## Definition of Done (DoD)

Chaque story est "Done" quand :

- [ ] Modifications appliquees aux fichiers MDX FR et EN
- [ ] `metadata.ts` synchronise (dates, descriptions)
- [ ] `npm run lint && npm run type-check && npm run build` passent
- [ ] Validation FAQPage / HowTo schema avec Rich Results Test
- [ ] Verification SERP simulator si reecriture title / description
- [ ] PR cree sur develop, review humaine
- [ ] Suivi du resultat sur le rapport analytics suivant (1 a 2 semaines plus tard)

---

## KPIs de succes

| KPI | Avant (2026-05-01) | Cible (2026-06-01) |
|-----|-------------------:|-------------------:|
| Clics totaux GSC / semaine | ~70 | 200+ |
| Pages avec CTR > 2 % | ~5 | 30+ |
| Pages avec FAQPage schema | 1 | 7+ |
| Pages avec scroll 75 % > 5 % pageviews | 0 | 10+ |
| Position moyenne top 20 pages | ~7 | < 5 |
| Pages tracees Matomo / pages GSC | 33 % | 80 %+ |

---

## Risques et mitigations

| Risque | Prob. | Impact | Mitigation |
|--------|-------|--------|------------|
| Reecriture title perd des positions au lieu de gagner du CTR | Moyenne | Fort | Tester par lot de 3-4 pages, attendre 1 semaine de mesure avant le lot suivant |
| FAQPage schema flag par Google si Q/R != contenu visible | Moyenne | Moyen | S'assurer que toutes les Q/R sont rendues en HTML visible, pas seulement en JSON-LD |
| Refonte graphique introduit des regressions pendant le sprint SEO | Moyenne | Moyen | Travailler sur des branches dediees `feat/seo-*`, merger sur develop apres chaque PR refonte |
| Refresh `dateModified` sans changement de contenu detecte par Google comme manipulation | Faible | Moyen | Coupler tout refresh `dateModified` a un ajout reel de contenu (TL;DR, exemple, lien) |
| Tracking Matomo en panne masque l'effet des optimisations | Haute | Fort | Prioriser SEO-8 + SEO-9 en debut de cycle, ou utiliser GSC seul comme source de verite |

---

## Notes pour le Sprint Review

- A chaque rapport hebdo (`raw/analytics/{date}/REPORT.md`), comparer les KPIs aux cibles
- Si une page reecrite (SEO-1 / SEO-2) ne bouge pas en 14 jours, tester une seconde reformulation
- Documenter les apprentissages dans `docs/seo-learnings.md` pour les itinerations futures
- Le rapport hebdo est genere automatiquement chaque semaine — le wiki-brain peut servir d'historique pour analyse de tendance
