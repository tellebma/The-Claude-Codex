# Backlog : tableau de bord

> Derniere mise a jour : 2026-07-10 (demande PO : ajout EPIC **Revue + article workflow IAG complet** (exemple projet Pivot) ; **remontee de la langue espagnole en priorite #1** — passe devant Polish Heros, Ecosystem discovery et les EPICs contenu)

> Derniere mise a jour anterieure : 2026-07-01 (reprise apres pause d'un mois. PR #275 article Sonnet 5/Fable 5 + 11 pages mises a jour mergee develop puis main (release #276) ; **decouverte** : `main` etait reste bloque sur la release 2026-05-28 tout ce temps, TUTO-6/7/8 + tout le contenu merge sur develop depuis le 2026-06-04 vient seulement d'atteindre la prod ; TUTO-10 (trackers Matomo) livre, TUTO-9 (monitoring GSC) replanifie avec J0 = 2026-07-01 ; EPIC Polish hero sections lance en parallele sur worktree dedie)

> Derniere mise a jour anterieure : 2026-06-04 (5 PRs mergees sur develop : #257 TUTO-6/7/8 + SR-3 + tokens, #261 EPIC Stack design complet, #262 Claude Council 8/8, #265 reprise articles IA generative (4 articles), #264 article agent-team-orchestration ; develop = 125 articles FR ; CI E2E en container Playwright ; nettoyage 16 branches mortes + 6 PRs redondantes)

---

## Vue d'ensemble

| EPIC | Stories | Fait | En cours | A faire | Progression |
|------|---------|------|----------|---------|-------------|
| [Best Practices Integration](EPIC-best-practices-integration.md) | 17 | 17 | 0 | 0 | 100% ✅ (C3 WorkflowDiagram #173) |
| [Corrections UX/UI/A11y](EPIC-ux-ui-a11y-audit.md) | 11 | 11 | 0 | 0 | 100% ✅ |
| [Refonte graphique 2026-04](../epics/2026-04-refonte-graphique/EPIC.md) | 32 | 32 | 0 | 0 | 100% ✅ (~70% du SYNTHESIS — voir EPIC suivant) |
| [Refonte premium 2026-05](../epics/2026-05-refonte-premium/EPIC.md) | 19 | 19 | 0 | 0 | 100% ✅ (cloture 2026-05-09) |
| [Bugfix articles href 2026-05](EPIC-bugfix-articles-href-2026-05.md) | 2 | 2 | 0 | 0 | 100% ✅ (cloture 2026-05-10) |
| [Bugfix search Vercel redirect 2026-05](EPIC-bugfix-search-vercel-redirect-2026-05.md) | 2 | 2 | 0 | 0 | 100% ✅ (cloture 2026-05-10) |
| [SEO/GEO mai 2026](EPIC-seo-geo-may-2026.md) | 9 | 9 | 0 | 0 | 100% ✅ (cloture 2026-05-11) |
| [Vercel Metrics 2026](EPIC-vercel-metrics-2026.md) | 11 | 9 | 0 | 0 | 100% ✅ (cloture 2026-05-27 : 9 livres, VM-8 + VM-12 descopes — Vercel PoC, Matomo source de verite) |
| [Stack design Claude Code 2026-05](EPIC-design-stack-skills-mcp-2026-05.md) | 10 | 10 | 0 | 0 | 100% ✅ (merge develop #261 le 2026-06-04 ; pipeline 4 agents pour DSK-6/7/8, relicence MIT Huashu reconciliee ; reliquat hors stories : captures Playwright manuelles DSK-6/8) |
| [Ecosystem trending repos 2026-05](EPIC-ecosystem-trending-repos-2026-05.md) | 12 | 12 | 0 | 0 | 100% ✅ (cloture 2026-05-12) |
| [Polish heros sections 2026-05](EPIC-polish-section-heroes-content-grid-2026-05.md) | 12 | 0 | 0 | 12 | 0% 🆕 (en attente skill Impeccable) |
| [Langue espagnole 2026-05](EPIC-i18n-espagnol-2026-05.md) | 11 | 0 | 0 | 11 | 0% 🆕 **⭐ PRIORITE #1** (remontee PO 2026-07-10 ; ~500M locuteurs natifs, vide concurrentiel ES ; bloquant humain : 1 contributeur natif ES pour valider le glossaire ES-3) |
| [Workflow IAG complet 2026-07](EPIC-content-workflow-iag-complet-2026-07.md) | 5 | 0 | 0 | 5 | 0% 🆕 (revue complete + article cornerstone bout-en-bout, exemple projet Pivot ; brief Pivot PO bloquant WIAG-3) |
| [Content /security-review 2026-05](EPIC-content-security-review-2026-05.md) | 8 | 8 | 0 | 0 | 100% ✅ (cloture 2026-05-31 : SR-3 screenshots + comparaison plugin everything-claude-code livre, EPIC complet) |
| [Ecosystem discovery script 2026-05](EPIC-ecosystem-discovery-script-2026-05.md) | 8 | 0 | 0 | 8 | 0% 🆕 (automation chore W5 EPIC ECO, cron mensuel + PR draft) |
| [Content find-skills 2026-05](EPIC-content-find-skills-2026-05.md) | 7 | 6 | 0 | 1 | 87% 🔄 (FS-1/FS-2/FS-4/FS-5/FS-6/FS-7 livres, 13/15 SP ; reste FS-3 capture demo manuelle) |
| [Content Claude Council 2026-06](EPIC-content-claude-council-2026-06.md) | 8 | 8 | 0 | 0 | 100% ✅ (merge develop #262 le 2026-06-04 ; page /skills/claude-council FR+EN + CouncilBuilder, coverage 95%/100%, 15 E2E ; HowTo migre dans le registre page-schemas au merge) |
| [Content page redesign 2026-05](EPIC-content-page-redesign-2026-05.md) | 12 | 12 | 0 | 0 | 100% ✅ (cloture : Sprints 1-3 livres #240/#243, release prod 1.10.0) |
| Articles IA generative V1 (plan 2026-05-11, reprise 2026-06-04) | 6 | 4 | 0 | 2 | 67% 🔄 (4 articles FR+EN merges #265 via pipeline 4 agents : comfyui-mcp-local, comfyui-workflow-piloting, agent-generation-assets, ia-generative-creative ; restent S2 assets-blog-automatique + S3 image-ia-local-vs-cloud, arbitrage PO) |
| Article agent-team-orchestration 2026-06 | 1 | 1 | 0 | 0 | 100% ✅ (merge #264 le 2026-06-04 : panorama Paperclip / claude-office / CrewAI / LangGraph / agent teams natif, ItemList JSON-LD, fact-check zero correction) |
| [Tuto-pages article-shell 2026-05](EPIC-tuto-pages-article-shell-2026-05.md) | 10 | 8 | 1 | 1 | 85% 🔄 (TUTO-2 SectionPeers #215, TUTO-3 pilote #248, TUTO-5 getting-started complet #249 — composant TutoArticleContent factorise (TUTO-4) livre avec #248 ; TUTO-6 livre : batch 1 `skills` (12 routes), batch 2 `prompting` (24 routes), batch 3 `mcp` (20 routes), batch 4 `agents` (18 routes) ; **TUTO-7 `advanced` livre 2026-05-30** : 32 routes (16 FR + 16 EN), 12 tests a11y batch 5, build/audit liens OK ; **TUTO-6/7/8 merges develop via #257 le 2026-06-04 — mais jamais deployes en prod avant le 2026-07-01** (`main` bloque sur la release 2026-05-28 jusqu'a PR #276) ; **TUTO-10 trackers Matomo livres 2026-07-01** (branche `feat/tuto-9-10-monitoring`, `useTutoComponentTracking` + categories `tuto_pager`/`tuto_section_peers`) ; **TUTO-9 replanifie** : analyse retrospective GSC saine (clics 135→267 sur 5 sem.) mais ne mesure pas le rollout (jamais en prod) — vrai J0 = 2026-07-01 ; restent segment Matomo dashboard (manuel) + rapports J+7/14/28/30 + controles manuels Lighthouse/WebPageTest) |

**Total projet** : 170/211 stories (81%) · ~347/475 SP livres (73%) — (VM-8 + VM-12 descopes retires du denominateur ; articles IA generative et agent-team-orchestration comptes en stories, hors decompte SP)

> EPIC **Refonte graphique 2026-04** cloture le 2026-05-07 mais l'audit PO en recette a revele que l'EPIC ne couvrait que la migration vers tokens (22/32 stories invisibles a l'oeil) + 3 nouveaux composants. Les ~70% manquants du SYNTHESIS (article shell 3 colonnes, animations signature, FAQ/Alert/NextSteps, light mode polish) sont consolides dans l'EPIC **Refonte premium 2026-05**.

> EPIC **Corrections UX/UI/A11y** : cloture le 2026-04-22. Seul WorkflowDiagram (C3, 3 SP, nice-to-have) reste dans l'EPIC Best Practices.

> EPIC **Refonte premium 2026-05** : ✅ **cloture le 2026-05-09 a 100%** — 19 stories mergees (RG2-01 a RG2-19). Couvre integralement les 30% manquants du SYNTHESIS de la refonte 2026-04 : article shell 3 colonnes (RG2-01 + ReadingProgressBar/TocProgress/Pager/Tables), composants editoriaux MDX (Faq, ArticleAlert, NextSteps, Steps gradient), landing signature (TrustBar, chips orbitaux, grid fade, articles recents avec filtres, reorder, CtaFinal), polish global (CodeBlock always-dark, light mode polish, stats band canoniques), rollout E2E sur 10 articles representatifs.

> EPIC **SEO/GEO mai 2026** : ✅ **cloture le 2026-05-11 a 100%**. Ouvert le 2026-05-06 suite a l'audit hebdo GSC + Matomo `2026-04-25 -> 2026-05-01`. 9 stories pour 27 SP livrees sur 4 sprints. Sprint 1 (SEO-1 #159, SEO-2 #161, SEO-3 couvert) ; Sprint 2 (SEO-4 #162, SEO-5 #163) ; Sprint 3 (SEO-6 #170, SEO-7 #167) ; Sprint 4 (SEO-8 #168, SEO-9 #166).

> EPIC **Bugfix articles href 2026-05** : ouvert et cloture le 2026-05-09. B-ART-1 (#155) fix `buildEntry` slug nu + tests RG-32. B-ART-2 (#157) garde-fou E2E `e2e/landing-recent-articles.spec.ts` qui a ensuite expose un bug latent corrige dans le Sprint 1 SEO/GEO (`getMostRecentArticles` filtre locale `===` preferredLocale, evite 404 sur slugs divergents FR/EN comme `bonnes-pratiques-securite` vs `security-best-practices`).

> EPIC **Bugfix search Vercel redirect 2026-05** : ouvert et cloture le 2026-05-09. B-SRC-1 (#156) fix regex `vercel.json` `[^.]+` pour exclure les fichiers `public/` (`search-index-fr.json`, `sad-toaster.glb`, `images/*`, etc.). B-SRC-2 (#158) suite E2E `e2e/search-results.spec.ts` qui s'execute en preview Vercel uniquement (skip si `VERCEL_PREVIEW_URL` non defini, pattern aligne sur `e2e/locale-redirects.spec.ts`).

> EPIC **Stack design Claude Code 2026-05** : ouvert le 2026-05-11 suite a 1 mois d'utilisation intensive de Claude Code en mode design (refonte graphique + refonte premium). 10 stories pour 28 SP repartis sur 3 sprints. 4 fiches outils (Impeccable, UI UX Pro Max, Taste Skill, Huashu Design) + cornerstone retour d'experience + workflow Playwright + demo + maillage. URLs cibles : `/skills/{slug}` et `/mcp/workflow-design-playwright`. **Valide en draft par 2 agents** (SEO + Redacteur) le 2026-05-11 ; corrections integrees (`SoftwareApplication` schema, mots-cles EN, sections "ce que ca change" et "cas d'echec", honnetete "1 mois", DSK-9/10 remontees Sprint 1). **Sprint 1 ouvert le 2026-05-18** : DSK-2 livree (fiche Impeccable FR + EN, page MDX ~250 lignes par locale avec structure DSK-2 prescrite, cablage section-nav + i18n + SITE_PAGES + search-index FR/EN, 12 tests E2E parite dans `e2e/skills-impeccable.spec.ts`). Faits Impeccable verifies via WebFetch 2026-05-18 : 28.6k★, Apache 2.0, v3.1.1 (14 mai 2026), 23 commandes, 27 anti-pattern rules. **Sprint 1 poursuivi le 2026-06-02** (branche `feat/dsk-content-2026-06`) : DSK-1 (cornerstone `/content/stack-design-claude-code` FR+EN, slug identique aux 2 locales pour garantir le LanguageSwitcher, Article JSON-LD injecte sur toutes les pages `/content/[slug]`), DSK-5 (ComparisonTable des 4 skills integree dans DSK-1), DSK-3 (`/skills/ui-ux-pro-max`), DSK-4 (`/skills/taste-skill`), DSK-9 (maillage in-content + sidebar nav + search-index), DSK-10 (section "Skills design" dans best-skills). Faits re-verifies via WebFetch 2026-06-02 : UI UX Pro Max 86.5k★ MIT (drift +10k vs mai → encart honnetete), Taste Skill 31.7k★ MIT (drift +15k vs mai). **Sprint 2/3 livre le 2026-06-03** (pipeline 4 agents redacteur/UI-UX/SEO/fact-check orchestre depuis la session principale) : DSK-6 (`/mcp/workflow-design-playwright` FR+EN, HowTo JSON-LD ; le `<Tabs>` initial avec JSX inline + `import` ESM cassait le build SSG → refactore en deux sous-sections `<Steps>` natives), DSK-7 (`/skills/huashu-design` FR+EN, SoftwareApplication JSON-LD), DSK-8 (`/content/refaire-une-card-avec-impeccable-et-playwright` FR + `/content/redo-a-card-with-impeccable-and-playwright` EN, slugs divergents + alias bidirectionnel dans `slug-aliases.ts`, HowTo JSON-LD). **Decouverte fact-check** : Huashu Design relicencie **MIT le 2026-05-14** (l'ancienne licence commerciale 1800-3500 USD citee dans l'EPIC est obsolete) → reconciliation des mentions dans cornerstone DSK-1 + fiches impeccable/taste-skill/ui-ux-pro-max + best-skills (FR+EN), etoiles 16k. Playwright MCP v0.0.75 verifie. Qualite locale : type-check + lint + 1377 tests + build SSG OK. Reste : captures Playwright reelles DSK-6 (≥6) et DSK-8 (14 emplacements TODO) non fabricables sans refactor live, a produire manuellement. DSK-2 deja sur develop : EPIC effectivement complet hors captures.

> EPIC **Vercel Metrics 2026** : ouvert le 2026-05-09 suite a une demande PO interne, **revise le meme jour** apres audit MCP Vercel qui a revele que le projet etait deja en production sur Vercel (claude-codex.fr servi par Vercel, pas Docker Nginx contrairement a l'hypothese initiale). Story VM-2 "double hosting" supprimee (3 SP retires). Reste : 11 stories / 22 SP / 3 sprints. Pack : Web Analytics + Speed Insights (Web Vitals RUM qui manque a Matomo) + Observability. Effort reel install SDK ~5 SP au lieu de 18 SP estime initialement. Priorite : backlog post-SEO/GEO. **Clos le 2026-05-27** : 9 stories livrees (SDK Analytics + Speed Insights + custom events + beforeSend RGPD + observability + doc). VM-8 (cross-check Lab vs RUM) et VM-12 (rapport hebdo cross-tool) **descopes** : Vercel etait un PoC, Matomo reste la source de verite engagement, et il n'existe pas d'API Hobby pour lire les stats agregees (lecture programmatique = Drains Pro+ ou `vercel metrics` CLI Observability Plus payant). Pas de valeur a maintenir un export CSV manuel hebdo sur un outil non perenne.

> EPIC **Content /security-review 2026-05** : ouvert le 2026-05-12 suite a demande PO. Couvre la feature Anthropic native de revue de securite (commande slash `/security-review` + GitHub Action `anthropics/claude-code-security-review`). **Source primaire** : centre d'aide officiel FR `support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code` (derniere MAJ 2026-03-12, consultee 2026-05-12). Sources secondaires : blog claude.com (annonce 2025-08-06), repo GitHub (MIT, 4.6k stars). 8 stories / 19 SP / 3 sprints. Cible : `content/{fr,en}/advanced/security-review.mdx`, themes `tutorial + security + devsecops`. Specificites : 5 familles de vulnerabilites officielles (SQL, XSS, auth, validation, dependances) ; eligibilite plans Pro/Max/API Console pay-as-you-go (hors plan gratuit) ; distinction stricte entre la commande slash (focus EPIC) et le produit web "Claude Code Security" (mention rapide, hors scope).

> EPIC **Content find-skills 2026-05** : ouvert le 2026-05-17 suite a demande PO. Couvre le meta-skill `find-skills` de vercel-labs (https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md) qui apprend a Claude Code a decouvrir et installer d'autres skills via la Skills CLI (`npx skills`). 7 stories / 15 SP / 2 sprints. Cible : `content/{fr,en}/skills/find-skills.mdx`, themes `guide + tooling + productivity`. **PR #207** ouverte le 2026-05-17 avec 13/15 SP livres : FS-1 (recherche factuelle 14 sections datees), FS-2 (page MDX FR 1 300 mots), FS-4 (traduction EN parite), FS-5 (cablage section-nav + i18n + SITE_PAGES + search-index FR/EN), FS-6 (8 cross-links bidirectionnels vers les 4 cornerstones skills), FS-7 (audit Redacteur clean + audit SEO avec raccourcissement titre/description FR-EN dans les fourchettes 60/160 char + 12 tests E2E parite FR/EN dans `e2e/skills-find-skills.spec.ts`). **Insight surfacie par FS-1** : find-skills est le skill #1 mondial sur skills.sh (~1.6M installs au 2026-05-17, ~4x le #2 frontend-design d'anthropics a 422K), angle exploite dans le H1 et le maillage. Specificite : distinction explicite entre les 4 concepts (skill `find-skills` / Skills CLI v1.5.7 / skills.sh / standard SKILL.md) et entre les 2 repos vercel-labs (`skills` vs `agent-skills`). Reste : FS-3 (capture demo terminale, bloque hors env interactif) + FS-7 (audit Redacteur/SEO + E2E parite).

> EPIC **Content page redesign 2026-05** : ouvert le 2026-05-19 suite a un audit PO de `/fr/content/` (liste plate de 16 articles editoriaux, sans hierarchie, sans signal de fraicheur ni de popularite). **12 stories / 25 SP / 3 sprints / 5 semaines**. Vision : transformer la vitrine en site editorial moderne avec sections Latest+Pinned combinees (calculables depuis frontmatter), Trending et Most read (alimentees par snapshot Matomo hebdo via workflow GH Actions + PR draft), filtres par `themes` groupes Type/Domaine, nav sticky inter-sections, vignettes OG et carte unifiee `<ArticleCard>` reutilisable. **Pre-requis : aucun bloquant** — Matomo cookieless + scroll-depth deja en place (SEO-8/9 livres), `getMostRecentArticles` deja code. Inspirations : The Verge, Stripe Press, GitHub Trending, Linear Blog, Vercel Blog. **Valide par 2 agents (UX + SEO/technique) le 2026-05-19** ; ~25 corrections integrees (Annexe C de l'EPIC) : fusion CTN-3+CTN-11, ajout CTN-13 URL state + CTN-14 nav sticky, cascade exclusion doublons, JSON-LD BreadcrumbList + ItemList + CollectionPage etendu, CWV INP/CLS explicites, variant `row` mobile fallback, event Matomo `article_card_click`, baseline documentee au merge. Annexe B tranchee (minutes, OR, URL state OUI Sprint 2, Pinned PO-only, vert positif uniquement). **Clos a 100%** : Sprints 1-3 livres (PR #240 vignettes OG + #241 cartes landing cliquables + #243 E2E/visual/a11y + stats Matomo), fix auth Matomo POST valide, release prod 1.10.0.

> EPIC **Tuto-pages article-shell 2026-05** : ouvert le 2026-05-09 suite a la cloture de l'EPIC Refonte Premium 2026-05. Etend le shell `ArticleShell` (3 colonnes premium) aux pages tuto des sections `/getting-started`, `/prompting`, `/skills`, `/agents`, `/mcp`, `/advanced`. **10 stories / 27 SP / 9 semaines**. Decisions tranchees par reviews UX + SEO 2026-05-09 (cf. UX-review et SEO-review dedies dans `docs/BACKLOG/`) : option C **obligatoire** (full ArticleShell + composant dedie `SectionPeers` dans le rail droit pour preserver ~636 liens internes contextuels) ; uniformite pour `/advanced/*` (pas de traitement special). Pre-requis bloquants leves le 2026-05-10 (SEO-1/2/3 livres). **Sprint 1 ouvert le 2026-05-19** : TUTO-2 SectionPeers (composant testable isolement avec accordeon < xl + sticky aside >= xl + aria-current) en cours, 14 tests unitaires verts. TUTO-3 (migration pilote 3 pages) attend les 14 jours de mesure GSC stable post-SEO-2 (~2026-05-24). **TUTO-6 batch 1 `skills` livre le 2026-05-29** : bascule des 6 pages skills (best-skills, comparison, create-custom, find-skills, impeccable + what-are-skills deja pilote) vers `TutoArticleContent`, cablage FAQ generique via `getPageFaqs` (parite avec le pattern mcp), suppression du gating `ARTICLE_SHELL_SLUGS`. 16 tests a11y verts (5 slugs FR + impeccable EN, light+dark). Baselines visuelles skills reportees (regeneration via update-snapshots en env Linux stable). dateModified non bumpe (migration shell only). **TUTO-6 batch 2 `prompting` livre le 2026-05-29** : bascule des 12 pages prompting (advanced, basics, chaining-and-agents, claude-md, context-management, context-rot, directives, mistakes, non-dev-prompting, power-tips, templates, thinking-and-planning) vers `TutoArticleContent`. Gate `ARTICLE_SHELL_SLUGS` supprime (basics etait le seul slug pilote TUTO-3), FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` integre. 12 tests a11y batch 2 ajoutes (5 slugs FR + advanced EN, light+dark). Baselines visuelles prompting reportees (env WSL2/Ubuntu non fiable, regeneration via update-snapshots en env Linux stable). dateModified non bumpe (migration shell only). Reste le batch agents puis TUTO-7 advanced. **TUTO-6 batch 3 `mcp` livre le 2026-05-29** : bascule des 10 pages mcp vers `TutoArticleContent`. 12 tests a11y batch 3 ajoutes (5 slugs FR + what-are-mcps EN, light+dark). Baselines visuelles reportees (env WSL2/Ubuntu non fiable). dateModified non bumpe (migration shell only). **TUTO-6 batch 4 `agents` livre le 2026-05-29** : bascule des 9 pages agents (what-are-agents, create-subagent, agent-teams, best-agents, orchestration, agent-sdk, performance-limits, background-agents, orchestration-patterns) vers `TutoArticleContent`. FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` conservee. 12 tests a11y batch 4 ajoutes (5 slugs FR + what-are-agents EN, light+dark). Baselines visuelles reportees (env instable, a regenerer en Linux stable). dateModified non bumpe (migration shell only). **TUTO-7 `advanced` livre le 2026-05-30** : bascule des 16 pages advanced (browser-automation, cross-model-workflow, headless-ci, hooks, memoire-persistante, mcp-profiles, methodologies-ecosystem, multi-provider, observabilite-monitoring, optimisation-tokens, permissions-sandbox, rpi-workflow, security-review, ultraplan, workflows, worktrees) vers `TutoArticleContent`. Note : 16 slugs par locale vs 12 mentionnes initialement dans le scope EPIC. FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` integre. 12 tests a11y batch 5 ajoutes (6 routes x light+dark). Baselines visuelles reportees (env non fiable, regenerer via `update-snapshots` en env Linux stable). dateModified non bumpe (migration shell only). Reste TUTO-8 (regression + cleanup), TUTO-9 (monitoring GSC), TUTO-10 (monitoring Matomo).

> EPIC **Langue espagnole 2026-05** : **remonte en priorite #1 le 2026-07-10** (demande PO). Passe devant Polish Heros, Ecosystem discovery et les EPICs contenu. Contenu de l'EPIC inchange (11 stories / 34 SP). Rappel du bloquant : l'EPIC ne peut pas depasser ES-2 sans **1 contributeur natif ES** pour valider le glossaire (ES-3) ; premiere action = pinger Discord/Twitter/Reddit pour trouver ce contributeur.

> EPIC **Workflow IAG complet 2026-07** : ouvert le 2026-07-10 suite a demande PO. Deux livrables : (1) une **revue complete** du workflow IA generative de bout en bout (intention → prompt → generation → post-traitement → QA → integration, avec ce que Claude Code orchestre a chaque etape) ; (2) un **article cornerstone** qui restitue cette revue avec le **projet parallele Pivot** du PO en fil rouge. 5 stories / 13 SP / 2 sprints. Capitalise sur les 4 articles IA generative deja en prod (#265) : c'est la "page parcours" qui les federe. **Bloquant** : les details du projet Pivot (externe a ce repo) doivent etre fournis par le PO (brief WIAG-2) avant la redaction WIAG-3 — ne rien inventer sur Pivot (regle anti-hallucination), fallback exemple generique documente comme tel si le brief tarde.

> EPIC **Ecosystem discovery script 2026-05** : ouvert le 2026-05-12 suite a demande PO. Concretise W5 (out of scope MVP) et la note "automatiser en chore Sprint 4" de l'EPIC Ecosystem trending repos. Script Node TypeScript `scripts/refresh-ecosystem.ts` + GitHub Action cron mensuel qui ouvre une PR draft avec rapport markdown `docs/ecosystem/discovery-YYYY-MM.md` (nouveaux entrants, sortants, top movers, liens morts). MUST (4 stories / 10 SP) couvre pipeline de decouverte + heuristics qualite + workflow CI. SHOULD (3 stories / 6 SP) ajoute check-links + MAJ auto compteurs etoiles + webhook Discord viral repo. COULD (1 story / 2 SP) finit le coverage tests. **Pre-requis bloquant** : EPIC Ecosystem Sprint 3 doit etre merge (ECO-10/11/12) car le script lit les MDX existants. Cible : reduire la charge de maintenance manuelle des pages `/ecosystem/*` par 4 et detecter automatiquement les repos viraux Claude Code.

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
| C3 | Composant WorkflowDiagram | 3 | ✅ Fait (#173) |

**Sprint 2** : 3/3 stories · 11/11 SP · 100%

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

### Sprint 3 — Recovery position drops (5 SP) — ✅ Termine 2026-05-11

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-6 | Audit + republication des 10 pages en chute | 3 | ✅ Fait (#170) — 5 pages en chute republiees |
| SEO-7 | Audit maillage interne post-RG | 2 | ✅ Fait (#167) — script audit maillage post-build |

### Sprint 4 — Backend tracking (4 SP) — ✅ Termine 2026-05-11

| ID | Story | SP | Statut |
|----|-------|----|--------|
| SEO-8 | Debug Matomo tracking | 3 | ✅ Fait (#168) — fix Matomo App Router + doc funnel |
| SEO-9 | Couvrir overview pages avec AnalyticsTracker | 1 | ✅ Fait (#166) — monter AnalyticsTracker hors SectionLayout |

**Progression** : ✅ **9/9 stories · 27/27 SP · 100%**

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
