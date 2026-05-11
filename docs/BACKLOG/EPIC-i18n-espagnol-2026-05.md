# EPIC : Ajout de la langue espagnole (ES) — 2026-05

> Source : demande PO 2026-05-12. L'utilisateur n'a pas de compétence espagnole personnelle mais identifie un potentiel d'audience significatif (l'espagnol est la 2ème langue maternelle au monde, derrière le mandarin, avec ~500M de locuteurs natifs).
> Date d'ouverture : 2026-05-12
> Effort estimé : **34 SP** (11 stories sur 4 sprints)
> Pré-requis : EPIC SEO/GEO terminé ✅, EPIC Bugfix search Vercel terminé ✅ (pattern i18n stable)
> Priorité : Backlog moyen terme (post-ECO Sprint 2 + Polish Heros)

---

## Contexte

### Marché espagnol pour la doc Claude Code

| Indicateur | Donnée |
|------------|--------|
| Locuteurs natifs espagnols | ~500 millions (2ème langue mondiale après mandarin) |
| Marché tech hispanique (LATAM + Espagne) | ~50M de devs estimés |
| Concurrence FR sur Claude Code | Faible (The Claude Codex domine) |
| Concurrence ES sur Claude Code | **Quasi-inexistante** (vide concurrentiel) |
| Pages FR actuelles | 84 (parity 84 FR = 84 EN) |
| Pages EN actuelles | 84 |

### Opportunité SEO

Aucune référence francophone ou anglophone n'occupe encore vraiment le terrain SEO espagnol pour Claude Code. Le Codex peut établir une autorité topique dominante en ES avec un effort modéré, comme il l'a fait en FR.

### Risques identifiés

1. **Pas de compétence ES native** côté équipe : impossible de relire et valider la justesse linguistique des traductions
2. **Maintenance multipliée** : chaque modification d'un MDX FR ou EN nécessite désormais aussi une mise à jour ES → workflow plus lourd
3. **Qualité moyenne attendue** : sans relecture native, les traductions LLM peuvent rester "correctes mais bizarres" (idiomes, tournures, terminologie tech)
4. **Pas de réseaux distribution ES** : aucun contact identifié dans l'écosystème dev hispanique pour amplifier le lancement

---

## Stratégie de traduction

Trois options, **option B retenue** comme MVP.

### Option A : 100 % LLM (Claude lui-même)

| Pro | Con |
|-----|-----|
| Gratuit (utilise notre infra existante) | Qualité moyenne sans relecture native |
| Itérable rapidement | Risque de calques FR→ES (faux amis, anglicismes) |
| Maintenance automatisable via agent | Pas de garantie de cohérence terminologique cross-pages |

### Option B (retenue) : LLM + glossaire terminologique + community validation

1. Construire un **glossaire ES** des termes techniques Claude Code (terminal, prompt, skill, agent, hook, MCP, etc.) — environ 80-120 entrées, validé par 1 dev natif ES sur Discord ou Twitter
2. Utiliser **Claude Opus 4.7** avec ce glossaire pour traduire chaque MDX (one-shot par fichier)
3. Publier en mode **beta** avec un banner "Traduction automatique en cours d'amélioration — signalez les erreurs sur GitHub"
4. Collecter le feedback via GitHub Issues + Discord pendant 4 semaines
5. Itérer sur les pages les plus signalées

| Pro | Con |
|-----|-----|
| Qualité acceptable dès J1 (LLM 2026 = bon en ES tech) | Effort initial du glossaire (~4h) |
| Workflow scalable (LLM + glossaire = quality gate) | Dépend du feedback communauté (peut être lent) |
| Pas de coût récurrent significatif | Tournures non-natives possibles sur certains contenus |

### Option C : service de traduction professionnelle

| Pro | Con |
|-----|-----|
| Qualité native garantie | **~3 000 - 8 000 € pour 84 pages** (devis tech specialisé) |
| Délai 4-6 semaines | Maintenance future tout aussi chère |
| Glossaire fourni par agence | Pas adapté à un projet open-source sans budget |

**Décision** : Option B. On démarre avec une traduction LLM cadrée par glossaire, on publie en mode beta, on itère sur retours communauté.

---

## Périmètre MVP (Sprint 1 + Sprint 2)

### In scope MVP

- Locale `es` ajoutée dans `routing.ts` + middleware next-intl
- `messages/es.json` complet (les ~437 keys traduites via LLM + glossaire)
- LanguageSwitcher étendu à 3 langues (FR / EN / ES)
- 5 pages cornerstone traduites en MDX : landing, getting-started, mcp, prompting, security-best-practices
- Glossaire terminologique `docs/i18n/glossary-es.md` (~100 entrées)
- Banner "Beta translation" sur toutes les pages ES
- SEO : `hreflang="es"`, sitemap ES, `metadata` traduites
- `llms.txt` + `llms-full.txt` régénérés avec contenu ES

### Out of scope MVP (Sprint 3 ou ultérieur)

- Traduction des 79 pages restantes (Sprint 3, story ES-9)
- Workflow agent qui traduit automatiquement les futurs MDX ajoutés (Sprint 4, story ES-10)
- Audit qualité native ES par traducteur pro (post-MVP)
- A/B test pour mesurer le retour sur audience (post-MVP)

---

## Stories détaillées

### Sprint 1 — Infrastructure i18n (8 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| ES-1 | Ajout locale `es` dans `routing.ts` + middleware next-intl. Validation que `/es/` retourne 404 propre tant qu'aucun MDX ES n'existe (pas de crash) | 2 | `src/i18n/routing.ts`, `next.config.mjs`, test e2e routing |
| ES-2 | LanguageSwitcher 3 langues (FR / EN / ES). UI mobile + desktop. Validation accessibilité ARIA | 3 | `src/components/layout/LanguageSwitcher.tsx`, tests Vitest |
| ES-3 | Glossaire terminologique `docs/i18n/glossary-es.md` avec ~100 entrées (terminal, prompt, skill, agent, hook, MCP, ...) | 3 | `docs/i18n/glossary-es.md` + validation par 1 dev natif Discord/Twitter |

### Sprint 2 — Traduction cornerstone (10 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| ES-4 | `messages/es.json` complet (437 keys traduites via Claude Opus + glossaire). Sanity check : aucun key manquant vs `fr.json`/`en.json` | 5 | `messages/es.json` + script de parité keys |
| ES-5 | 5 MDX cornerstone traduits (landing override, `/getting-started/installation`, `/mcp/what-are-mcps`, `/prompting/basics`, `/content/security-best-practices`) | 5 | `content/es/*.mdx` (5 fichiers) |

### Sprint 3 — SEO + beta banner (8 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| ES-6 | Banner "Beta translation — signalez les erreurs" sur toutes les pages ES. Composant `<BetaTranslationBanner>` SSR-safe, dismissible (cookie) | 2 | `src/components/layout/BetaTranslationBanner.tsx` + i18n |
| ES-7 | SEO ES : hreflang dans toutes les pages, metadata `og:locale`, JSON-LD `inLanguage`, sitemap entries `/es/*` avec priority 0.7 | 3 | `src/lib/metadata.ts`, `src/data/site-pages.ts`, `lib/structured-data.ts` |
| ES-8 | `llms.txt` + `llms-full.txt` régénérés avec contenu ES. Ajout section "Spanish content" dans `llms.txt` index | 3 | `scripts/generate-llms-txt.ts` mis à jour, `public/llms*.txt` |

### Sprint 4 — Scale + maintenance (8 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| ES-9 | Traduction LLM des 79 pages restantes (batch parallel via subagents, validation glossary auto via script) | 5 | `content/es/**/*.mdx` (complète parity) |
| ES-10 | Workflow agent `translate-to-es.yml` : déclenchable sur PR qui modifie `content/fr/**` ou `content/en/**`, génère/met à jour `content/es/**` via LLM + glossaire | 3 | `.github/workflows/translate-to-es.yml` |
| ES-11 | Test E2E parité ES (parité 84 FR = 84 EN = 84 ES, validation des routes /es/* qui rendent sans crash) | 2 | `e2e/i18n-parity.spec.ts` étendu |

---

## Critères d'acceptation EPIC

- [ ] `npm run build` génère bien les routes `/es/*` sans erreur
- [ ] `npm run test` valide la parité de keys entre `fr.json` / `en.json` / `es.json`
- [ ] 5 pages cornerstone ES publiées et accessibles via `/es/landing`, etc.
- [ ] LanguageSwitcher fonctionne sur 3 langues
- [ ] SEO : hreflang valide testé via [https://hreflang.org](https://hreflang.org)
- [ ] Banner beta affiché sur toutes les pages ES
- [ ] `llms.txt` mentionne le contenu ES
- [ ] Au moins 1 dev natif ES a validé 5 phrases-clés du glossaire avant publication
- [ ] Lighthouse ≥ 90 sur 3 pages ES principales
- [ ] Discord/Twitter ping ouvert pour collecter le feedback ES après publication

---

## Métriques cibles (3 mois post-lancement MVP)

| Métrique | Cible 3 mois |
|----------|--------------|
| Pages ES indexées par Google | ≥ 50 / 84 |
| Impressions GSC sur `/es/*` | ≥ 5 000 / mois |
| CTR moyen `/es/*` | ≥ 3 % (cible site = 4 %) |
| Issues GitHub "translation feedback" | ≥ 5 (signal d'engagement audience) |
| Position moyenne top queries ES | ≤ 15 |

---

## Dépendances et risques

### Dépendances bloquantes

- Aucune côté code (infra next-intl déjà en place)
- Critique côté humain : trouver **1 dev natif ES** pour valider le glossaire avant Sprint 2

### Risques résiduels

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Traduction LLM "robotique" | Élevée | Moyen | Glossaire + banner beta + feedback loop |
| Personne pour valider glossaire | Moyen | Bloquant Sprint 2 | Ping Discord Anthropic ES + Reddit r/ClaudeAI / r/programacion |
| Faux amis FR→ES non détectés | Moyen | Moyen | Script de scan "false friends classiques" (assister→atender, etc.) |
| Maintenance future ingérable | Élevée | Élevé | ES-10 workflow agent automatise la propagation FR↔EN↔ES |
| Coût compute Claude Opus pour Sprint 4 | Faible | Faible | ~80 pages × 5K tokens = 400K tokens × $15/M = ~6$ |

---

## Prochaines étapes après merge de cet EPIC

1. **Pinger Discord/Twitter** pour trouver 1 dev natif ES qui accepte de valider le glossaire (offre : crédit "contributeur" sur la page /about)
2. **Pinger Anthropic relations** pour vérifier si Anthropic a une recommandation officielle sur leurs glossaires multilingues
3. **Lancer Sprint 1** dès que 1 contributeur ES identifié (sans contributeur, ES-3 bloque et l'EPIC s'arrête là)

---

## Lien avec les autres EPICs

- **EPIC SEO/GEO mai 2026** : terminé, fournit le pattern de réécriture title/description par locale (à appliquer aux MDX ES)
- **EPIC Polish Heros Sections** : la nouvelle section LanguageSwitcher 3 langues doit être pensée avec ES-2 pour éviter une 2ème refonte
- **EPIC Vercel Metrics 2026** : le rapport hebdo cross-tool (VM-12) doit ajouter le breakdown par locale FR/EN/ES une fois ES en prod
- **EPIC Ecosystem Trending Repos** : `/es/ecosystem/*` est out of scope MVP (Sprint 3 décide si on traduit ces pages spécifiques ou si on les laisse en EN par défaut, vu que les repos GitHub sont déjà en anglais)
