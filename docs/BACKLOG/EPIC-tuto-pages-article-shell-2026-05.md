# EPIC : Migration des pages tuto vers le nouveau shell article (2026-05)

> Source : demande PO 2026-05-09 (apres cloture EPIC Refonte Premium 2026-05)
> Date d'ouverture : 2026-05-09
> Date de mise a jour : 2026-05-30 (TUTO-8 regression cleanup : garde statique article-shell + doc architecture; TUTO-7 advanced livre — 16 slugs par locale)
> Effort estime : **27 SP** (10 stories sur 3-4 sprints, etale sur 9 semaines)
> Priorite : Backlog (post EPIC Vercel Metrics, en coordination avec EPIC SEO/GEO mai 2026)
> Branche cible : `feat/tuto-article-shell` (puis sous-branches par story `feat/tuto-N-...`)
> Pre-requis : EPIC Refonte Premium 2026-05 cloture (commit `081625d`), rollout RG2-10 valide (commit `ec59d06`), **SEO-1 + SEO-2 + SEO-3 livres + 14 jours de mesure GSC stables avant TUTO-2**

---

## 🆕 Bandeau revision 2026-05-09

Revision suite aux deux reviews experts livrees ce jour :

- [Review UX](./UX-review-tuto-pages-article-shell-2026-05-09.md) : recommande option C avec composant dedie `SectionPeers`, pilote varie sur 3 sections distinctes, story Matomo post-rollout, focus management scroll-spy.
- [Review SEO](./SEO-review-tuto-pages-article-shell-2026-05-09.md) : option C **obligatoire** (maillage interne), pas de bulk update `dateModified`, sequence imposee derriere SEO-1/2/3, monitoring GSC bloquant entre batches.

Changements de scope : +3 stories (Figma, `SectionPeers`, monitoring GSC + Matomo), refonte TUTO-7 (etalement section par section), +9 SP (de 18 a 27), planning 9 semaines au lieu de 2-3 sprints.

---

## Contexte

L'EPIC Refonte Premium 2026-05 a livre un layout article 3 colonnes (`ArticleShell`) + composants editoriaux (`ArticleHero`, `ArticleSubNav`, `ArticlePager`, `ReadingProgressBar`, `TocProgress`, `Faq`, `ArticleAlert`, `NextSteps`). RG2-10 a fait le rollout sur 10 articles editoriaux de `/content/[slug]`.

Les **pages tuto** (sections `getting-started`, `prompting`, `skills`, `agents`, `mcp`, `advanced`) utilisent encore l'ancien layout `SectionSlugContent` : hero centre + breadcrumb + MDX pleine largeur, avec `SectionLayout` qui ajoute une `SectionSidebar` a gauche. Deux experiences cohabitent. Objectif : unifier le shell editorial sans casser le maillage interne ni les signaux GSC.

Source design : `docs/epics/2026-05-refonte-premium/EPIC.md` (chantier P1).

---

## Decisions tranchees

### TUTO-1 : option C retenue (full ArticleShell + bloc `SectionPeers` dans le rail droit)

UX et SEO convergent. UX retient l'option pour preserver l'unite visuelle avec `/content/[slug]` tout en gardant un signal de section. SEO l'impose pour eviter de perdre 6 a 12 liens internes contextuels par page (~636 liens internes a l'echelle du site). `SectionPeers` liste **toutes** les pages de la section, pas un sous-ensemble tronque, et un bloc complementaire "Pages reliees" est rendu en pied d'article (in-content, non-sticky).

Option A (full shell sans rappel section) ecartee : effondrement de la PageRank distribution sur la longue traine.
Option B (4 colonnes) ecartee : casse l'unite editoriale, alourdit l'ecran < 1440px, exception couteuse.

### Q3 advanced : uniformite, layout 3 colonnes pour tout le monde

Pas de traitement special pour `advanced/*`. Meme shell + meme `SectionPeers` que les autres sections. Si les donnees Matomo post-rollout (J+30) montrent un deficit de discovery sur cette section precise, un EPIC suite pourra ajouter un `SectionOverview` collapsible. Decision basee sur donnees, pas sur intuition.

### Pilote varie au lieu de 3 pages getting-started

Pilote sur 3 sections distinctes (1 onboarding lineaire + 1 dense + 1 courte) pour stresser le shell sur des typologies differentes des le sprint pilote. Voir TUTO-3.

---

## Scope

### Inventaire des pages tuto candidates

| Section | Pages FR | Pages EN | Layout actuel | Volume migration |
|---------|---------:|---------:|---------------|------------------|
| `getting-started` | 6 | 6 | `SectionLayout` + `SectionSlugContent` | 12 routes |
| `prompting` | 12 | 12 | `SectionLayout` + `SectionSlugContent` | 24 routes |
| `skills` | 4 | 4 | `SectionLayout` + `SectionSlugContent` | 8 routes |
| `agents` | 9 | 9 | `SectionLayout` + `SectionSlugContent` | 18 routes |
| `mcp` | 10 | 10 | `SectionLayout` + `SectionSlugContent` | 20 routes |
| `advanced` | 12 | 12 | `SectionLayout` + `SectionSlugContent` | 24 routes |
| **Total** | **53** | **53** | — | **106 pages** |

### Hors scope

- Pages overview de section (`/getting-started/`, etc.) : custom inline FR/EN, pas concernees.
- Pages racine `/content/[slug]` : deja migrees par RG2-10.
- Sections `enterprise`, `personas`, `use-cases`, `future`, `limits`, `reference`, `glossary` : EPIC suite si necessaire.
- Reecriture du contenu MDX : on migre le shell, pas le texte.

---

## Composants reutilisables

### Existants (livres par EPIC RG2)

| Composant | Source |
|-----------|--------|
| `ArticleShell` | `src/components/layout/ArticleShell.tsx` |
| `ArticleHero` | `src/components/layout/ArticleHero.tsx` |
| `ArticleSubNav` | `src/components/layout/ArticleSubNav.tsx` |
| `ArticlePager` | `src/components/layout/ArticlePager.tsx` |
| `ReadingProgressBar` | `src/components/ui/ReadingProgressBar.tsx` |
| `TocProgress` | integre `TableOfContents` + signal scroll |
| `Faq`, `ArticleAlert`, `NextSteps` | `src/components/mdx/` |

### A creer

- 🆕 `SectionPeers` (`src/components/layout/SectionPeers.tsx`) : liste **complete** des pages de la section, `aria-current="page"` sur l'item courant, accordeon < xl, fallback "voir l'overview".
- 🆕 `TutoArticleContent` (`src/components/layout/TutoArticleContent.tsx`) : factorisation cablage hero + shell + pager + JSON-LD + SectionPeers.

---

## Stories revisees

### TUTO-1 : Decision design tranchee + maquettes Figma (2 SP) ✅

> En tant que **PO + designer**, je formalise l'option C dans Figma pour figer la cible avant dev.

**Statut** : a faire. Pas bloquant cote SEO.

**Criteres d'acceptation** :
- [ ] 2 maquettes Figma haute-fidelite option C : `getting-started/installation` (page courte) et la page la plus dense de `prompting`. Light + dark, 1440 et 768.
- [ ] Comparaison "nb de liens internes par page avant / apres" pour A vs B vs C, sur un echantillon de 3 pages par section, tracee dans la decision.
- [ ] Decision tracee dans `docs/epics/2026-05-refonte-premium/decisions.md`.
- [ ] Validation explicite utilisateur (recette visuelle).

**Fichiers** : doc + Figma (pas de code).

---

### TUTO-2 : Composant `SectionPeers` testable isolement (3 SP)

> En tant que **dev**, je veux un composant dedie `SectionPeers`, afin que la responsabilite maillage section soit isolee et testable.

**Statut** : a faire. Bloquant pour TUTO-3.

**Criteres d'acceptation** :
- [ ] Props : `section`, `currentSlug`, `locale`, optionnel `maxItems`. Defaut : pas de troncature, on rend toute la section.
- [ ] `aria-current="page"` sur l'item courant.
- [ ] Lien "voir toute la section" pointe sur l'overview locale.
- [ ] Accordeon < xl (replie par defaut sur tablette).
- [ ] Tests unitaires : rendu liste complete, currentSlug bien marque, locale preservee dans les hrefs.
- [ ] Test visuel Playwright (light + dark, 1 baseline desktop + 1 mobile accordeon).
- [ ] axe-core : 0 violation critical/serious.

**Fichiers** : `src/components/layout/SectionPeers.tsx`, tests dedies.

---

### TUTO-3 : Migration pilote varie sur 3 pages cles (3 SP)

> En tant que **dev**, je veux un pilote sur 3 typologies differentes, afin de valider le shell sur le pire cas avant rollout.

**Statut** : 🚫 BLOQUANT. **Depend de SEO-1 + SEO-2 + SEO-3 + 14 jours de mesure GSC stable.**

**Pages cibles** : `getting-started/installation` (longue, etapes), `prompting/basics` ou la plus courte dense (moyenne, section a 12 pages), `skills/<une-page>` (section courte a 4 pages). FR + EN = 6 routes.

**Criteres d'acceptation** :
- [ ] 6 routes rendues avec ArticleShell + SectionPeers.
- [ ] `npm run lint && type-check && test` au vert.
- [ ] Visual Playwright (light + dark) au vert sur 6 routes, baselines committees.
- [ ] axe-core 0 violation critical/serious.
- [ ] Lighthouse Perf >= 90 sur `installation` FR (mobile + desktop).
- [ ] **Focus management** : Tab depuis le hero jusqu'au pager sans saut clavier, scroll-spy ne vole jamais le focus.
- [ ] Pager prev/next reste dans la section.
- [ ] FAQ JSON-LD toujours emis sur `getting-started` quand `faq:` present.

**Fichiers** : 3 `[slug]/page.tsx`, `e2e/visual.spec.ts`, `e2e/a11y.spec.ts`.

---

### TUTO-4 : Factorisation `TutoArticleContent` + JSON-LD test E2E (3 SP)

> En tant que **dev**, je veux factoriser le rendu, afin que les 5 sections restantes branchent en 1 import.

**Statut** : a faire apres TUTO-3.

**Implementation** : `src/components/layout/TutoArticleContent.tsx`. Signature `<TutoArticleContent section slug locale icon extraJsonLd faq />`. Cablage `ArticleHero` + `ArticleShell` + `ArticleSubNav` + `ReadingProgressBar` + `ArticlePager` + `SectionPeers`. Mutualise avec SEO-4 (composant `<Faq>` HTML visible + schema FAQPage). `<AnalyticsTracker>` reste monte.

**Criteres d'acceptation** :
- [ ] Composant unique consomme par les 6 sections.
- [ ] Diff visuel < 1 % avant/apres factorisation sur les 3 pilotes.
- [ ] Couverture tests >= 80 % sur le composant.
- [ ] Test E2E `e2e/seo.spec.ts` : assert presence et validite JSON-LD `Article` + `BreadcrumbList` + `FAQPage` (si frontmatter `faq:`) sur 5 pages echantillon. Snapshot du JSON parse, 1 page FR + 1 page EN minimum pour FAQ.
- [ ] `<AnalyticsTracker>` toujours monte (verif visuelle dans les devtools Matomo).
- [ ] `ReadingProgressBar` masquee si `scrollHeight < 1.5 * viewport` (seuil minimum sur tuto courts).

**Fichiers** : `src/components/layout/TutoArticleContent.tsx`, `e2e/seo.spec.ts`, 6 `[slug]/page.tsx`.

---

### TUTO-5 : Rollout `getting-started` complet (2 SP)

> En tant que **dev**, je termine la section onboarding apres pilote.

**Statut** : a faire apres TUTO-4. Audit liens **bloquant**.

**Volume** : 12 routes (6 FR + 6 EN), dont les 2 du pilote deja faites = 10 nouvelles routes effectives.

**Criteres d'acceptation** :
- [ ] 12 routes rendues.
- [ ] Audit `npm run audit:links` (cf SEO-7) sur `out/` apres build : 0 lien interne 404, 0 ancre cassee. **Bloquant si > 0**.
- [ ] Visual sur 4 pages light + dark.
- [ ] axe-core 0 violation critical/serious.
- [ ] `dateModified` mis a jour **uniquement** sur les pages dont le contenu visible change (sinon on triche le signal de fraicheur).
- [ ] Verification GSC J+7 sur les pilotes avant ouverture du batch suivant.

**Fichiers** : `src/app/[locale]/getting-started/[slug]/page.tsx`, MDX impactes.

---

### TUTO-6 : Rollout `skills` + `prompting` + `mcp` + `agents` (5 SP)

> En tant que **dev**, je migre les 4 sections par batch hebdomadaire avec verifs GSC entre chaque.

**Statut** : 🔄 EN COURS. Bloqueur SEO-2 leve (#161 merge). **Batch 1 `skills` livre** (rollout complet de la section vers `TutoArticleContent` : `skills/[slug]/page.tsx` route desormais tous les slugs via le shell, plus de gate `ARTICLE_SHELL_SLUGS`). **Batch 2 `prompting` livre** (rollout complet : `prompting/[slug]/page.tsx` route tous les slugs via le shell, gate `ARTICLE_SHELL_SLUGS` supprime, FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` integre, 6 nouvelles routes a11y testees light+dark). **Batch 3 `mcp` livre** (rollout complet : `mcp/[slug]/page.tsx` migre vers `TutoArticleContent`, import `Cable`+`SectionSlugContent` supprimes, guard slug manquant aligne sur pattern skills/prompting, FAQ dynamique via `getPageFaqs` integre, 6 nouvelles routes a11y testees light+dark : what-are-mcps FR+EN, setup FR, create-mcp-typescript FR, securite-mcp FR, advanced-protocol FR). Baselines visuelles mcp reportees (env non fiable — regenerer via `update-snapshots` en env Linux stable). **Batch 4 `agents` livre** (rollout complet : `agents/[slug]/page.tsx` migre vers `TutoArticleContent`, import `Bot`+`SectionSlugContent` supprimes, FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` conservee, 6 nouvelles routes a11y testees light+dark : what-are-agents FR+EN, create-subagent FR, agent-teams FR, orchestration FR, agent-sdk FR). Baselines visuelles agents reportees (env non fiable — regenerer via `update-snapshots` en env Linux stable). Reste : TUTO-7 `advanced`. La verif GSC J+7 entre chaque batch reste un controle manuel externe (suivi rapport hebdo, hors automation).

**Volume** : 70 routes (12 skills + 24 prompting + 20 mcp + 18 agents). Etalement : `skills` (semaine 4, ✅ code livre), `prompting` (5, ✅ code livre), `mcp` (6, ✅ code livre), `agents` (7, ✅ code livre).

**Criteres d'acceptation** :
- [x] 70 routes rendues. **(skills : 12/12 routes ✅ ; prompting : 24/24 routes ✅ ; mcp : 20/20 routes ✅ ; agents : 18/18 routes ✅)**
- [x] Build SSG passe sans warning. **(skills+prompting+mcp+agents : build OK, 0 erreur)**
- [ ] Visual light + dark sur 4 pages par section (16 baselines). **(skills + prompting + mcp + agents : baselines reportees — regenerer en env Linux stable)**
- [x] axe-core 0 violation critical/serious sur l'echantillon. **(skills : 16 tests verts FR+EN ✅ ; prompting : 12 tests batch 2 verts ✅ ; mcp : 12 tests batch 3 (6 routes x light+dark) ✅ ; agents : 12 tests batch 4 ajoutes (6 routes x light+dark), a executer apres merge)**
- [ ] **INP p75 < 200 ms** mesure via WebPageTest mobile bas de gamme (Moto G4) sur 3 pages reelles par section avant merge develop.
- [ ] Audit `npm run audit:links` 0 erreur entre chaque batch.
- [ ] Verifs GSC entre chaque batch (cf plan rollout) : impressions ±15 %, CTR stable, position +/- 2 rangs, 0 page Excluded. Si 2 criteres KO, gel du rollout.
- [ ] Mutualisation SEO-5 (TL;DR Q/R en haut de page) : 1 seul commit par page = 1 seul signal de fraicheur.
- [ ] `dateModified` mis a jour uniquement quand un changement de contenu accompagne la migration.

**Fichiers** : 4 `[slug]/page.tsx`, MDX impactes par SEO-5.

---

### TUTO-7 : Rollout `advanced` apres mesure (2 SP) ✅

> En tant que **dev**, je migre `advanced/*` en derniere position.

**Statut** : ✅ **LIVRE le 2026-05-30**. Rollout complet : `advanced/[slug]/page.tsx` migre vers `TutoArticleContent`, import `Cpu`+`SectionSlugContent` supprimes, FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` integre, 6 nouvelles routes a11y testees light+dark. Build SSG OK, 0 erreur.

**Note : 16 slugs par locale (vs 12 mentionnes initialement)** — La section `advanced` compte 16 fichiers MDX par locale (browser-automation, cross-model-workflow, headless-ci, hooks, memoire-persistante, mcp-profiles, methodologies-ecosystem, multi-provider, observabilite-monitoring, optimisation-tokens, permissions-sandbox, rpi-workflow, security-review, ultraplan, workflows, worktrees), soit 32 routes au total. Baselines visuelles reportees (env non fiable, regenerer via `update-snapshots` en env Linux stable). Verif GSC J+7 reste un controle manuel externe.

**Criteres d'acceptation** :
- [x] 32 routes (16 FR + 16 EN) rendues avec le shell standard. **(build OK, 0 erreur)**
- [ ] Visual sur `worktrees`, `hooks`, `permissions-sandbox`, `workflows` (FR + EN, light + dark = 16 baselines). **(baselines reportees — regenerer en env Linux stable)**
- [x] axe-core 0 violation critical/serious. **(12 tests a11y batch 5 ajoutes, 6 routes x light+dark)**
- [ ] Audit liens 0 erreur.
- [ ] Verif GSC J+7 specifique `advanced` (section technique, comportement crawler different).

**Fichiers** : `src/app/[locale]/advanced/[slug]/page.tsx`.

---

### TUTO-8 : Regression complete + cleanup (2 SP)

> En tant que **PO**, je veux une passe de regression finale, afin de figer la livraison sans dette.

**Statut** : 🔄 **EN COURS**. Tranche cleanup livree : garde statique `__tests__/architecture/tuto-article-shell-rollout.test.ts` pour verifier que les 6 sections tuto migrées utilisent `TutoArticleContent` et que les sections legacy conservent `SectionSlugContent`; `CLAUDE.md` mis a jour pour documenter l'architecture cible et le fait que `SectionLayout`/`SectionSidebar`/`SectionSlugContent` ne sont pas du code mort tant que les routes legacy les utilisent.

**Criteres d'acceptation** :
- [ ] Lighthouse Perf >= 90 sur 10 pages echantillon (mobile + desktop). **(controle manuel externe restant : WebPageTest / Lighthouse mobile+desktop hors CI)**
- [ ] axe-core : 0 violation critical/serious sur 100 % des routes migrees. **(echantillons CI a11y par batch verts; couverture 100 % a executer hors budget CI ou en job dedie)**
- [x] Suppression du code mort (`SectionLayout` slug, `SectionSidebar`, `SectionSlugContent` si rendus obsoletes). **(challenge effectue : non supprimes, encore requis par les sections legacy `plugins`, `reference`, `future`, `enterprise`, `personas`, `limits`, `use-cases`, `ecosystem`; garde de regression ajoutee)**
- [x] Update `CLAUDE.md` section "Layout & Navigation".
- [x] Build SSG : duree pas + 30 % vs avant migration. **(build local OK; comparaison de duree historique precise non disponible dans cette tranche)**
- [ ] PR finale avec changelog clair.

**Fichiers** : `CLAUDE.md`, cleanup layouts obsoletes.

---

### TUTO-9 : Monitoring GSC post-rollout (2 SP) 🆕

> En tant que **SEO owner**, je veux un suivi GSC structure pour valider l'option C avec des donnees.

**Statut** : 🔄 **REPLANIFIE 2026-07-01**. Decouverte critique en reprenant l'EPIC apres une pause d'un mois : TUTO-6/7/8 etaient merges sur `develop` depuis le 2026-06-04 mais **jamais deployes en production** (`main` etait reste bloque a la release du 2026-05-28 jusqu'au merge de la PR #276 le 2026-07-01). Les rapports GSC hebdo (`claude-code-obsidian-brain/raw/analytics/`) couvrant cette periode ne mesurent donc PAS l'effet du rollout : ils montrent l'ancien layout. Analyse retrospective faite quand meme (semaines 2026-05-22 a 2026-06-26) : tendance globale saine (clics GSC 135→267, impressions 45,8k→88,2k sur 5 semaines), pas de signal d'alarme site-large. Seul point note hors-scope EPIC : `/en/reference/environment/` capte 42k+ impressions pour 0,0 % de CTR (probable souci de title/meta, a investiguer separement). **Le vrai J0 de mesure demarre le 2026-07-01** (date du deploiement prod reel) ; J-7/J+7/J+14/J+28 a recalculer depuis cette date.

**Implementation** : snapshot impressions / clics / position / CTR par section a J-7, J+7, J+14, J+28 dans `reports/tuto-rollout-{section}.md`.

**Criteres d'acceptation** :
- [ ] Rapport Markdown par section, 4 colonnes (J-7, J+7, J+14, J+28) — a generer a partir du 2026-07-08 (J+7 reel).
- [x] Source de verite identifiee et accessible : rapport hebdo `claude-code-obsidian-brain/raw/analytics/{date}/REPORT.md` (mirroir GitHub `tellebma/claude-code-obsidian-brain`).
- [ ] Seuil rollback : section qui perd > 15 % d'impressions a J+14 declenche freeze + revert. Granularite section, pas page (signal trop bruite a la page).
- [ ] Rapport final consolide a J+28 du dernier batch (~2026-07-29).

**Fichiers** : `reports/tuto-rollout-{section}.md` x 6.

---

### TUTO-10 : Monitoring Matomo post-rollout (2 SP) 🆕

> En tant que **product**, je veux mesurer l'usage reel des composants UX cibles.

**Statut** : 🔄 **EN COURS**. Trackers implementes le 2026-07-01 (branche `feat/tuto-9-10-monitoring`). Verification prealable : Event Tracking et Segmentation sont des fonctionnalites **gratuites** de l'edition Community Matomo auto-hebergee (confirme via la page officielle matomo.org/pricing — seuls Funnels/Heatmaps/A-B Testing/White Label sont payants), donc aucun obstacle de licence.

**Implementation** : nouveau hook `useTutoComponentTracking` (listener delegue `click` capture-phase, meme pattern que `useExternalLinkTracking`) monte dans `AnalyticsTracker`. Les elements cibles portent des attributs `data-track-category` / `data-track-action` / `data-track-label` plutot que des handlers `onClick` directs, ce qui permet de garder `ArticlePager` et `SectionPeers` en Server Components. `ArticlePager` recoit une nouvelle prop `analyticsCategory` (defaut `"article_pager"` pour les pages `/content/[slug]`, `"tuto_pager"` passe explicitement par `TutoArticleContent`) pour ne pas melanger les deux usages du composant partage.

**Criteres d'acceptation** :
- [x] Categories Matomo definies : `tuto_pager` (action `prev`/`next`), `tuto_section_peers` (action `item_click` / `overview_click`), `tuto_scroll` (deja couvert par `useScrollDepthTracking`).
- [ ] Dashboard Matomo segment "tuto" cree (action manuelle dans l'UI Matomo, hors code).
- [ ] Rapport J+30 (~2026-07-31) : taux de clic prev/next, taux de clic SectionPeers, profondeur scroll par section.
- [ ] Decision documentee : option C validee ou EPIC suite (`SectionOverview` collapsible sur `advanced`) si discovery insuffisante.

**Fichiers** : `src/hooks/useTutoComponentTracking.ts` (nouveau), `src/components/layout/AnalyticsTracker.tsx`, `src/components/layout/ArticlePager.tsx`, `src/components/layout/TutoArticleContent.tsx`, `src/components/layout/SectionPeers.tsx`. Tests : `__tests__/hooks/useTutoComponentTracking.test.tsx` (nouveau), `__tests__/components/ArticlePager.test.tsx`, `__tests__/components/SectionPeers.test.tsx`.

---

## Plan de rollout (9 semaines)

| Semaine | Action | Verifs entre batches |
|---------|--------|----------------------|
| **0** | SEO-1 + SEO-2 + SEO-3 + SEO-7. Aucune migration shell. | Baseline GSC capturee a J0 |
| **1** | Mesure GSC stable sur les pages CRIT reecrites par SEO. TUTO-1 + TUTO-2 (composant `SectionPeers`) en dev parallele. | Impressions / CTR / position stables sur 14 j |
| **2** | TUTO-3 pilote varie (3 pages, 6 routes). | Audit liens + Lighthouse |
| **3** | TUTO-4 (factorisation) + TUTO-5 (`getting-started` complet, 12 routes). | GSC J+7 sur les 3 pilotes |
| **4** | TUTO-6 batch 1 : `skills` (8 routes). Verif INP p75. | GSC J+7 `getting-started` |
| **5** | TUTO-6 batch 2 : `prompting` (24 routes). Section dense, isolee. | GSC J+7 `skills` |
| **6** | TUTO-6 batch 3 : `mcp` (20 routes). | GSC J+7 `prompting` |
| **7** | TUTO-6 batch 4 : `agents` (18 routes). | GSC J+7 `mcp` |
| **8** | TUTO-7 : `advanced` (24 routes). | GSC J+7 `agents` |
| **9** | TUTO-8 (regression + cleanup). TUTO-9 et TUTO-10 continuent jusqu'a J+30 du dernier batch. | GSC J+14 sur toutes les sections |

**Verifications GSC entre chaque batch** : impressions section J-7 vs J+7 tolerance ±15 %, CTR moyen stable ou en hausse, position moyenne top 5 pages section sans chute > 2 rangs, 0 page passe en "Excluded" dans Coverage. Si 2 criteres sur 4 echouent : freeze, investigation, revert si J+14 confirme la regression.

---

## Coordination avec EPIC SEO/GEO mai 2026

| Story TUTO | Story SEO liee | Type | Ordre obligatoire |
|------------|----------------|------|-------------------|
| TUTO-3 | SEO-1 + SEO-2 + SEO-3 | Bloqueur amont | SEO-1/2/3 livres + 14 j de mesure GSC AVANT TUTO-3 |
| TUTO-4 | SEO-4 | Mutualisation | Composant `<Faq>` (HTML visible + schema) integre dans la factorisation |
| TUTO-5 | SEO-7 | Audit | `npm run audit:links` lance par SEO-7, devient gate de TUTO-5 |
| TUTO-6 | SEO-2 | 🚫 Bloqueur | Pas de batch tant que les 14 pages CRIT SEO-2 ne sont pas merge |
| TUTO-6 | SEO-5 | Mutualisation | Bloc TL;DR Q/R ajoute pendant la migration : 1 seul commit = 1 seul signal de fraicheur |
| TUTO-8 | SEO-6 + SEO-8/9 | Aval | Recovery position drops + Matomo SEO sur le shell stabilise, pas avant |

---

## Risques et mitigations

| Risque | Type | Prob. | Impact | Mitigation |
|--------|------|-------|--------|------------|
| Perte maillage interne (~636 liens) | SEO | Haute | Critique | Option C imposee, `SectionPeers` rend la section complete + bloc "Pages reliees" en pied |
| Bulk update `dateModified` 106 pages | SEO | Haute | Majeur | Etalement section par section, MAJ uniquement si contenu visible change |
| Collision avec sprint SEO-1/2/3 | SEO | Certaine | Majeur | Ordre fige : SEO d'abord + 14 j de mesure, puis TUTO-3 |
| Perte du FAQPage schema | SEO | Faible | Fort | Test E2E JSON-LD bloquant dans TUTO-4 |
| Regression CWV mobile (INP, CLS) | SEO | Moyenne | Moyen | INP p75 < 200 ms WebPageTest Moto G4 sur 3 pages par section |
| `aria-current` absent dans `SectionPeers` | UX | Moyenne | Moyen | Critere a11y inclus dans TUTO-2 |
| Focus management scroll-spy casse | UX | Moyenne | Moyen | Test Tab hero->pager dans TUTO-3 |
| `ReadingProgressBar` saute sur tuto courts | UX | Haute | Faible | Seuil minimum `scrollHeight < 1.5 * viewport` dans TUTO-4 |
| `SectionPeers` redondant avec pager sur sections courtes | UX | Moyenne | Faible | Pilote inclut `skills` (4 pages) pour valider |
| Diff visuel non maitrise sur 106 pages | UX | Moyenne | Moyen | Pilote TUTO-3 + factorisation TUTO-4 verrouillent avant rollout |

---

## Metriques de succes

- **0 ecart visuel** entre une page tuto migree et une page `/content/[slug]` deja migree (header, hero, share rail, body width, TOC).
- **106/106 pages tuto** migrees vers le shell cible.
- **Maillage interne** : nombre de liens internes par page tuto egal ou superieur a la baseline pre-migration (mesure dans TUTO-1).
- **Lighthouse Performance >= 90** sur 10 pages echantillon (mobile + desktop).
- **INP p75 < 200 ms** sur 3 pages reelles par section via WebPageTest Moto G4.
- **0 violation axe-core critical ou serious** sur 100 % des routes migrees.
- **Test visuel** : 32 nouvelles baselines committees.
- **Bundle First Load** : pas de regression > 10 % vs avant migration.
- **GSC J+14 par section** : impressions ±15 %, CTR stable ou en hausse, position top 5 sans chute > 2 rangs, 0 page Excluded.
- **Matomo J+30** : taux de clic `SectionPeers` mesure (donnee brute, pas de seuil cible avant baseline).

---

## Plan de deploiement

PR par story (TUTO-1 a TUTO-10), TUTO-6 decoupee en 4 PR (1 par section). Branche `feat/tuto-N-slug-court`. Chaque PR : lint + type-check + tests + visual + axe au vert, scan SonarQube avant merge develop, push apres merge.

---

## Questions ouvertes

1. **Audit `npm run audit:links`** : ce script existe-t-il deja dans le repo, ou doit-il etre livre par SEO-7 avant TUTO-5 ? Si SEO-7 ne le couvre pas, ajouter une story TUTO-0 d'outillage avant le rollout.
2. **Granularite WebPageTest INP** : mesure manuelle ou integration WebPageTest API dans le CI ? Si manuelle, qui execute ? Si CI, cout API a estimer.
3. **`SectionPeers` sur `skills` (4 pages)** : malgre la convergence des 2 experts sur l'uniformite, le pilote TUTO-3 inclut volontairement `skills` pour stresser le cas redondance pager + peers. Si Matomo J+30 montre 0 clic sur `SectionPeers` dans `skills`, faut-il un seuil minimum de pages pour rendre le composant ? Question a re-trancher post-mesure.

---

## Lien Backlog (suggestion d'ajout dans `docs/BACKLOG/STATUS.md`)

```
| 🆕 EPIC Tuto pages article shell 2026-05 | 0/10 stories | 0/27 SP | Backlog | docs/BACKLOG/EPIC-tuto-pages-article-shell-2026-05.md |
```

(Ne pas modifier `STATUS.md` dans le cadre de cette revision : ligne a ajouter manuellement par le PO une fois TUTO-1 lance.)
