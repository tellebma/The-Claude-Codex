# SEO review — EPIC tuto pages article shell

> Date : 2026-05-09
> Source : avis SEO expert agent (Sonnet) sur `EPIC-tuto-pages-article-shell-2026-05.md` croise avec `EPIC-seo-geo-may-2026.md`
> Statut : input PO, a integrer dans l'EPIC avant kickoff (et a coordonner avec EPIC SEO/GEO en cours)

---

## 1. Verdict global : ORANGE

Migration souhaitable pour la coherence UX et l'unification des composants editoriaux, mais l'EPIC sous-estime trois zones SEO sensibles :

1. **Maillage interne** — suppression de la SectionSidebar = -6 a -12 liens internes contextuels par page tuto, soit ~636 liens internes perdus a l'echelle du site.
2. **Fraicheur sitemap** — 106 `dateModified` pousses le meme jour = signal de bulk update suspect cote Google.
3. **Collision de scope** avec SEO-1, SEO-2 et SEO-3 qui touchent simultanement `getting-started/*` et 14 pages CRIT.

Faisable, mais conditionne aux mitigations ci-dessous.

## 2. Top 5 risques SEO

### 1. Perte de maillage interne — CRITIQUE

`SectionSidebar` injecte 6 a 12 ancres contextuelles par page tuto. Sa suppression seche (option A) effondre la PageRank distribution interne sur la longue traine (`prompting/*`, `mcp/*`). En option C, "Autres pages de cette section" en bas du rail droit ne porte ni le meme poids (in-content vs sidebar) ni la meme visibilite crawler.

**Mitigation** : option C **obligatoire** avec la liste **complete** de la section + ajout d'un bloc "Pages reliees" en pied d'article (non-sticky, in-content).

### 2. Spam de fraicheur sitemap — MAJEUR

TUTO-7 prevoit de pousser 106 `dateModified` a la meme date. Google detecte les bulk timestamps et declasse temporairement (cf SEO-3 meme probleme a 10 pages pres).

**Mitigation** : etaler la mise a jour `dateModified` sur 4-8 semaines par rollout de section. Pas de modification "cosmetique" du `dateModified` sans changement de contenu visible.

### 3. Collision avec SEO-1, SEO-2, SEO-3 — MAJEUR

Le rollout TUTO-4 touche `prompting/*`, `mcp/*`, `agents/*` qui contiennent 6 des 14 pages CRIT du sprint 1 SEO. Refondre la structure pendant la mesure CTR du sprint SEO empeche d'attribuer les variations a la cause (refonte UI ou reecriture title/description).

**Mitigation** : faire SEO-1+SEO-2+SEO-3 **d'abord**, attendre 14 jours de mesure GSC, puis lancer TUTO-2.

### 4. Perte du FAQPage schema sur `faq-beginner` — MOYEN

`buildFaqSchema()` est aujourd'hui injecte dans `getting-started/[slug]/page.tsx`. Le pattern `extraJsonLd` doit survivre dans le nouveau `TutoArticleContent`.

**Mitigation** : test E2E qui assert la presence des `<script type="application/ld+json">` (Article + Breadcrumb + FAQ quand applicable) sur `faq-beginner` FR et EN. Critere bloquant pour TUTO-3.

### 5. Regression CWV mobile — MOYEN

`ReadingProgressBar` + `TocProgress` ajoutent du JS client + listeners scroll sur 106 pages, dont des pages tutoriel courtes (< 800 mots) ou le cout CLS/INP n'est pas amorti par la valeur lecture. Lighthouse 90 sur **un seul** echantillon par section dans TUTO-2/4/6 est trop laxiste.

**Mitigation** : INP p75 < 200 ms mesure sur 3 pages reelles par section via WebPageTest mobile bas de gamme (Moto G4) avant merge develop.

## 3. Recommandations pour l'EPIC

- **TUTO-1 nouveau critere** : decision tracee doit inclure une comparaison "nb de liens internes par page avant / apres" pour les 3 options, calculee sur un echantillon de 3 pages par section.
- **TUTO-3 nouveau critere** : test E2E `e2e/seo.spec.ts` qui assert pour 5 pages echantillon la presence et la validite du JSON-LD Article + BreadcrumbList + FAQPage si frontmatter `faq:` (Rich Results Test API ou snapshot du JSON parse).
- **TUTO-4 critere ajoute** : audit `npm run audit:links` (cf SEO-7) qui crawle `out/` apres build et confirme zero lien interne 404, zero ancre cassee. Bloquant si > 0.
- **TUTO-7 refonte complete** : remplacer "MAJ des 106 dateModified" par un planning d'etalement section par section. Sans ca, on triche le signal de fraicheur.
- **Nouvelle story TUTO-9 (2 SP)** : monitoring GSC post-rollout. Snapshot impressions/clics/position/CTR par section J-7, J+7, J+14, J+28 dans `reports/tuto-rollout-{section}.md`. Rollback si une section perd > 15 % d'impressions a J+14.
- **Critere transversal** : `<AnalyticsTracker>` doit rester monte sur les pages tuto migrees. A verifier dans TUTO-3.

## 4. Coordination avec l'EPIC SEO/GEO mai 2026

- **Avant TUTO-2** : SEO-1, SEO-2, SEO-3, SEO-7. Les reecritures title/description doivent etre en place et stabilisees (mesure GSC a 14 jours) avant que la refonte vienne perturber les signaux.
- **Pendant TUTO-3** : SEO-4 (composant `<Faq>` qui rend HTML visible + injecte schema) a mutualiser. Si TUTO-3 cree `TutoArticleContent`, autant brancher `<Faq>` des la factorisation.
- **Pendant TUTO-4/5** : SEO-5 (TL;DR Q/R en haut de page). Occasion d'ajouter le bloc "Quick answer" pendant la migration. Un seul commit par page = un seul signal de fraicheur.
- **Apres TUTO-6** : SEO-6 (recovery position drops) et SEO-8/9 (Matomo). Inutile de debugger Matomo sur l'ancien shell qui va disparaitre.
- **Bloqueur** : ne pas lancer TUTO-4 tant que SEO-2 n'a pas livre ses 14 pages reecrites.

## 5. Plan de rollout SEO-safe

| Semaine | Action |
|---|---|
| **0** | SEO-1 + SEO-2 + SEO-3 (pas de migration shell). Mesure baseline GSC a J+14. |
| **2** | TUTO-2 pilote (3 pages `getting-started`). Batch volontairement petit. |
| **3** | TUTO-3 factorisation + completion `getting-started` (6 + 6 routes). Verif GSC J+7 sur les 3 pilotes. |
| **4** | `skills` (4 + 4). Plus petit volume, validation rapide. |
| **5** | `prompting` (12 + 12). Section la plus dense, a isoler. |
| **6** | `mcp` (10 + 10). |
| **7** | `agents` (9 + 9). |
| **8** | Decision TUTO-1 sur `advanced` puis migration (12 + 12) ou conservation. |
| **9** | TUTO-6 regression + cleanup. |

**Verifications GSC entre chaque batch** :

- Impressions section J-7 vs J+7 : tolerance ±15 %.
- CTR moyen section : doit rester stable ou monter.
- Position moyenne top 5 pages section : pas de chute > 2 rangs.
- 0 page passe en "Excluded" dans Coverage GSC.
- Source de verite : rapport hebdo `claude-code-obsidian-brain/raw/analytics/{date}/REPORT.md`.

Si une section echoue 2 criteres sur 4, geler le rollout, investiguer, puis reprendre. Pas de "on continue parce qu'on est en retard sur le sprint".
