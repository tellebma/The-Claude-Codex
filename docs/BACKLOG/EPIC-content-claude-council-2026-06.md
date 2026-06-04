# EPIC : Page contenu — Claude Council (pattern LLM Council appliqué à Claude) (2026-06)

> Source : demande PO 2026-06-01 (inspiration : article apsodia.com sur un skill "LLM Council", **blog tiers traité comme inspiration narrative uniquement, jamais comme source factuelle**). Le pattern réel vient d'Andrej Karpathy (repo `karpathy/llm-council`). Le Codex documente déjà plusieurs skills individuels (Impeccable, find-skills) et la notion d'agents, mais aucune page n'explique le pattern "conseil de modèles" : faire délibérer plusieurs LLM (ou plusieurs personas d'un même Claude) puis synthétiser. C'est un pattern d'orchestration à fort intérêt pédagogique et GEO.
> Date d'ouverture : 2026-06-01
> Effort estimé : **21 SP** (8 stories sur 2 sprints)
> Pré-requis : aucun bloquant côté code — l'article-shell des sections tuto (`TutoArticleContent`) est stable, le pattern composant interactif est éprouvé (`/configurator`). Compatible parallèle avec les autres EPICs contenu (ne se touchent pas).
> Priorité : Backlog haut (cornerstone "orchestration multi-perspectives", angle GEO sur l'intent "faire délibérer plusieurs LLM / conseil de modèles")

---

## Contexte

### Le pattern LLM Council (source primaire : Karpathy)

Le LLM Council est un pattern popularisé par **Andrej Karpathy** via le repo **`karpathy/llm-council`** (source canonique : [github.com/karpathy/llm-council](https://github.com/karpathy/llm-council), métadonnées vérifiées via l'API GitHub le 2026-06-01).

**Faits vérifiés sur source primaire (README + `backend/config.py`, branche `master`, 2026-06-01)** :

| Fait | Valeur vérifiée |
|------|-----------------|
| Auteur | Andrej Karpathy (@karpathy) |
| Date de création du repo | 2025-11-22 (un samedi — cohérent avec « Saturday hack ») |
| Popularité | 19 832 ⭐ / 3 752 forks (au 2026-06-01, **chiffres volatils, re-vérifier à la rédaction**) |
| Licence | **Aucune** (`license: null`) — fourni « as is », « 99% vibe coded as a fun Saturday hack », non maintenu. Pas un projet open source réutilisable au sens licence. |
| Statut | Non supporté, non maintenu volontairement (« I'm not going to support it in any way ») |
| Stack | FastAPI (Python 3.10+) + httpx + OpenRouter ; React + Vite + react-markdown ; stockage JSON |

**Le workflow en 3 stages (noms exacts du README)** :

1. **Stage 1 — First opinions** : la requête utilisateur est envoyée à chaque LLM individuellement, les réponses sont collectées et affichées en "tab view".
2. **Stage 2 — Review** : chaque LLM reçoit les réponses des autres, **identités anonymisées** (pour éviter le favoritisme), et les classe sur l'axe accuracy + insight.
3. **Stage 3 — Final response** : un **Chairman** désigné compile toutes les réponses en une synthèse finale unique.

**Modèles council par défaut (verbatim `backend/config.py`)** :

```python
COUNCIL_MODELS = [
    "openai/gpt-5.1",
    "google/gemini-3-pro-preview",
    "anthropic/claude-sonnet-4.5",
    "x-ai/grok-4",
]
CHAIRMAN_MODEL = "google/gemini-3-pro-preview"
```

> **Nuance clé pour un site « Claude »** : dans la version originale de Karpathy, **Claude n'est qu'un conseiller parmi quatre, et c'est Gemini 3 Pro qui préside** (`CHAIRMAN_MODEL`). C'est précisément ce qui justifie l'angle « comment construire un *Claude* Council » : faire de Claude le président (ou l'unique modèle jouant tous les rôles via des personas distincts).

### Multi-modèles vs multi-personas — la distinction centrale de la page

Le « Council » recouvre deux implémentations très différentes, et la page doit les distinguer clairement :

| Approche | Principe | Forces | Limites |
|----------|----------|--------|---------|
| **Multi-modèles** (façon Karpathy / OpenRouter) | N modèles hétérogènes (GPT, Gemini, Claude, Grok) délibèrent | Vraie diversité d'angles, biais de modèle décorrélés | Coût + latence (N providers), clé OpenRouter, pas de garantie de qualité par modèle |
| **Multi-personas d'un seul Claude** (façon skill) | Un seul Claude joue plusieurs rôles/personas qui se challengent | Simple (un seul provider/clé), reproductible, intégrable en skill | Biais corrélés (même modèle sous-jacent), risque d'écho plutôt que de vraie contradiction |

Sans cette distinction, le lecteur croira que « Council = un skill magique » alors que c'est avant tout un **pattern d'orchestration** déclinable.

### Le volet « skill » (inspiration tierce, NON factuel)

Un article de blog tiers (apsodia.com) décrit une adaptation du pattern en skill Claude (personas type Contrarian / First Principles / Expansionist / Outsider / Executor + Chairman, ~5 étapes, ~11 appels LLM, rapport en artifact HTML). **Ces éléments sont de l'inspiration narrative, pas des faits** : ils proviennent d'une source interdite comme source factuelle par le CLAUDE.md. La page peut illustrer « un exemple de personas possibles » SANS attribuer de chiffres précis ni présenter cette implémentation comme une référence. À re-sourcer ou écarter en story CC-1.

### Pourquoi cet EPIC maintenant

| Indicateur | Donnée |
|------------|--------|
| Pages FR sur l'orchestration multi-perspectives | 0 (manque) |
| Pages décrivant des skills individuels | Impeccable, find-skills (+ EPIC Stack design) |
| Concurrence FR sur "llm council" / "conseil de llm" / "faire délibérer plusieurs ia" | Quasi-nulle |
| Concurrence EN | Modérée (repo Karpathy viral, posts dev) |
| Angle Codex disponible | Pattern expliqué + distinction multi-modèles/multi-personas + générateur de prompt/skill + cas d'échec |
| Intent GEO | Fort : un utilisateur qui demande à un LLM "comment faire délibérer plusieurs modèles" doit tomber sur cette page |
| Force éditoriale | Le repo Karpathy est viral (≈20k★ en quelques jours) et **sans doc pédagogique FR** — vide à occuper |

### Concepts à distinguer dans le contenu

| Terme | Définition courte |
|-------|------------------|
| **LLM Council** | Pattern : faire répondre plusieurs LLM, leur faire évaluer mutuellement les réponses (anonymisé), puis synthétiser via un Chairman |
| **Chairman** | Le LLM (ou persona) désigné pour produire la synthèse finale |
| **Multi-modèles** | Council composé de modèles de providers différents (Karpathy : GPT/Gemini/Claude/Grok via OpenRouter) |
| **Multi-personas** | Council où un seul modèle (Claude) joue plusieurs rôles contradictoires |
| **`karpathy/llm-council`** | L'implémentation de référence (web app locale FastAPI + React), non maintenue |

---

## Stratégie éditoriale

### Persona cible

Utilisateur de Claude (Code ou web) qui :

1. A vu passer le repo de Karpathy ou l'idée de « conseil de LLM » et veut comprendre le pattern sans lire du code FastAPI
2. Veut savoir quand ça vaut le coût (≈ N appels par question) et quand c'est du gâchis
3. Cherche à reproduire l'idée concrètement avec Claude — soit en prompt, soit en skill — sans monter une stack OpenRouter

### Structure de page (proposée, à valider en Sprint 1)

1. **C'est quoi un Council ?** — l'idée (un seul avis vs un panel qui se challenge), origine Karpathy, le « Saturday hack », les 3 stages (First opinions → Review anonymisée → Chairman)
2. **Multi-modèles vs multi-personas** — le tableau de trade-offs, et pourquoi sur Claude on fait souvent du multi-personas
3. **Anatomie d'un council** — les rôles/personas (exemples illustratifs, sans survendre), la review croisée anonymisée, la synthèse du Chairman
4. **Démo : le générateur** — `<CouncilBuilder />` : l'utilisateur choisit nb de conseillers, personas, mode (multi-modèles / mono-Claude) → la page génère un **prompt copiable** + un **squelette `SKILL.md`** copiable. Aucun appel LLM (100% statique).
5. **Quand l'utiliser / quand c'est du gâchis** — garde-fou « enjeu réel ? », coût en tokens (≈ N+1 appels par question), latence ; à éviter pour les questions factuelles
6. **Prochaines étapes** — cross-links vers `/skills/what-are-skills`, `/skills/find-skills`, `/agents/*` (orchestration)

### Frontmatter cible

```yaml
title: "Claude Council : faire délibérer plusieurs IA pour vos décisions difficiles"
description: "Le pattern LLM Council de Karpathy expliqué et adapté à Claude : plusieurs avis qui se challengent, review croisée anonymisée, synthèse d'un Chairman. Avec un générateur de prompt et de skill prêt à copier."
badge: "Pattern"
section: "skills"
order: 6
datePublished: "2026-06-XX"
dateModified: "2026-06-XX"
themes: ["guide", "architecture", "productivity"]
```

> Slug retenu : **`claude-council`** identique FR + EN (évite le bug 404 cross-locale sur slugs divergents, cf. EPIC Bugfix articles href). Le contenu EN ciblera quand même les kw « llm council » et « claude council » dans title/description/body.

---

## Périmètre

### In scope

- 1 page MDX FR `content/fr/skills/claude-council.mdx` (~1 400 mots, ton pédagogique)
- 1 page MDX EN `content/en/skills/claude-council.mdx` (traduction + localisation, kw "llm council")
- Composant interactif `<CouncilBuilder />` (générateur de prompt + squelette `SKILL.md`), client-side, 100% SSG-safe, intégré au registre MDX
- Intégration complète : navigation, sitemap, search-index, llms.txt, JSON-LD
- Cross-link bidirectionnel avec `/skills/what-are-skills`, `/skills/find-skills`, et au moins une page `/agents/*` pertinente (orchestration)
- Audit Rédacteur (anti-IA, ton naturel) + audit SEO (cibles "llm council", "claude council", "conseil de llm", "faire délibérer plusieurs ia")

### Out of scope

- Reproduire/héberger l'app FastAPI de Karpathy (le site est 100% statique, aucun backend)
- Tout appel LLM réel depuis le générateur (impossible en SSG ; le générateur produit du texte à copier, point)
- Documenter le skill Apsodia comme référence (source tierce non citable ; mention illustrative seulement)
- Fiche détaillée par modèle cité (GPT-5.1, Gemini 3 Pro, Grok 4 — hors scope)
- Comparatif OpenRouter vs API directes (autre EPIC potentiel)
- Traduction ES (sera reprise dans l'EPIC i18n espagnol via story batch)

---

## Stories détaillées

### Sprint 1 — Recherche, draft FR, démo (11 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| CC-1 | Recherche et vérification factuelle. **Source primaire obligatoire** : `github.com/karpathy/llm-council` (README + `backend/config.py`, API GitHub pour stars/forks/licence/date). Lister chaque fait précis (3 stages et leurs noms exacts, modèles par défaut verbatim, Chairman par défaut, stack, statut "non maintenu / pas de licence") avec source + date. **Traiter explicitement le blog Apsodia comme NON citable** : ce qui en vient est marqué inspiration, pas fait. Sortie : `docs/research/claude-council-facts.md` | 3 | `docs/research/claude-council-facts.md` |
| CC-2 | Rédaction MDX FR complète selon la structure validée (~1 400 mots, frontmatter `themes: ["guide", "architecture", "productivity"]`, Callout sur licence/statut "as is", tableau multi-modèles vs multi-personas, Steps pour les 3 stages, Callout limites/coût). Style anti-IA strict (pas de tiret cadratin, pas de "permet de" creux, phrases courtes). Cross-links sortants posés | 3 | `content/fr/skills/claude-council.mdx` |
| CC-3 | Composant `<CouncilBuilder />` : configurateur client (nb conseillers, personas presets éditables, mode multi-modèles/mono-Claude, choix du Chairman) → génère en live un **prompt** + un **squelette `SKILL.md`**, avec boutons "copier". Aucune dépendance réseau, SSR-safe (si `useSearchParams` pour partager une config → wrap `<Suspense>` côté consommateur). Enregistrement dans le registre `MdxComponents`. Tests unitaires sur la génération (snapshot prompt + SKILL.md selon config). Coverage ≥ 80% sur le module | 5 | `components/mdx/CouncilBuilder.tsx` + registre MDX + `__tests__/.../council-builder.test.tsx` |

### Sprint 2 — Traduction EN, intégration, qualité (10 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| CC-4 | Traduction EN avec localisation (terminologie native "LLM council / Claude council", pas de calque FR→EN). Parité structurelle (mêmes sections, mêmes Steps/Callouts, même `<CouncilBuilder />`). Labels du composant i18n-isés (FR/EN) | 2 | `content/en/skills/claude-council.mdx` + clés i18n composant |
| CC-5 | Intégration site : `lib/section-navigation.ts` (section `skills`, `order: 6`), `SITE_PAGES` de `lib/metadata.ts` (priority 0.7, changeFrequency monthly, dates du jour), `searchIndexFr` + `searchIndexEn`, `POPULAR_SLUGS_FR/EN` du `scripts/generate-llms-txt.ts`. Régénérer `public/llms.txt` + `public/llms-full.txt`. JSON-LD HowTo (les 3 stages) + Article | 2 | 4 fichiers modifiés + 2 regen |
| CC-6 | Cross-link bidirectionnel : encart "Voir aussi" dans `skills/what-are-skills.mdx`, `skills/find-skills.mdx` et 1 page `/agents/*` (FR + EN) pointant vers `/skills/claude-council` ; la nouvelle page link en retour | 1 | ~6 MDX modifiés |
| CC-7 | Audit Rédacteur (agent `content-writer`) sur ton/fluidité/anti-tics IA + audit SEO (title ≤ 60 car, description 140-160 car, kw "llm council", "claude council", "conseil de llm" présents sans bourrage) | 2 | 2 rapports + corrections |
| CC-8 | Tests E2E parité FR/EN sur `/fr/skills/claude-council/` + `/en/skills/claude-council/` (rendu, breadcrumb, ToC, cross-links, **interaction `<CouncilBuilder />`** : changer la config met à jour le prompt, le bouton copier fonctionne). Lighthouse ≥ 90 sur les 4 métriques. Dark + light mode. A11y WCAG 2.1 AA (générateur 100% clavier) | 3 | `e2e/skills-claude-council.spec.ts` + corrections |

---

## Critères d'acceptation EPIC

- [ ] `/fr/skills/claude-council/` et `/en/skills/claude-council/` répondent 200, contenu localisé correct
- [ ] Frontmatter `themes` valide (1 type + 2 domaines : guide + architecture + productivity)
- [ ] Tous les faits précis ont une source vérifiée datée dans `docs/research/claude-council-facts.md`, avec **`github.com/karpathy/llm-council` comme source primaire**
- [ ] Les 3 stages et les modèles par défaut cités correspondent exactement au repo (pas de drift) ; le fait « Chairman par défaut = Gemini » est mentionné
- [ ] Le statut « non maintenu / pas de licence » est signalé (pas de survente "outil officiel")
- [ ] Distinction claire **multi-modèles vs multi-personas** — pas de confusion "Council = skill magique"
- [ ] Aucune affirmation factuelle issue du blog Apsodia ; ce qui en vient est présenté comme inspiration illustrative
- [ ] `<CouncilBuilder />` fonctionne 100% côté client, sans appel réseau, génère prompt + `SKILL.md` copiables, accessible au clavier
- [ ] Recherche site interne (Cmd+K) trouve la page sur "council", "llm council", "délibérer"
- [ ] `public/llms.txt` mentionne la page dans la section skills
- [ ] `npm run build` propre, `npm run lint`, `npm run type-check`, `npm run test` OK ; coverage ≥ 80% sur le module `CouncilBuilder`
- [ ] Lighthouse FR ≥ 90 sur les 4 métriques
- [ ] E2E parité + interaction générateur passent sur CI
- [ ] Audit Rédacteur ≥ 8/10 (ton naturel) et audit SEO ≥ 8/10
- [ ] SonarQube Quality Gate OK avant merge (cf. feedback_sonar_before_merge)

---

## Métriques cibles (3 mois post-publication)

| Métrique | Cible 3 mois |
|----------|--------------|
| Position GSC requête "llm council" (FR + EN) | ≤ 8 |
| Position GSC requête "claude council" | ≤ 5 |
| Position GSC requête "conseil de llm" / "faire délibérer plusieurs ia" | ≤ 10 |
| Impressions GSC page | ≥ 800 / mois |
| CTR moyen page | ≥ 4 % |
| Scroll depth médian Matomo | ≥ 55 % |
| Interactions `<CouncilBuilder />` (event Matomo dédié) | ≥ 80 / mois |
| Citations LLM (GEO, mesure trimestrielle) | ≥ 2 LLM majeurs sur 4 (ChatGPT, Claude, Perplexity, Gemini) sur l'intent "faire délibérer plusieurs llm" |

---

## Dépendances et risques

### Dépendances bloquantes

- Aucune côté code (article-shell tuto `TutoArticleContent` stable, MDX, navigation, pattern composant interactif `/configurator` éprouvé)
- Aucune côté humain (rédaction possible avec sources publiques vérifiées)

### Risques résiduels

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Stars/forks cités obsolètes (bougent vite) | Élevée | Faible | Préfixer chaque chiffre de sa date, mention "au YYYY-MM-DD, vérifier sur GitHub" |
| Modèles par défaut du repo changent (Karpathy ou un fork) | Moyen | Moyen | CC-1 re-trigge en pré-merge si décalage ; citer la config verbatim avec date |
| Lecteur croit que "Council = skill officiel maintenu" | Moyen | Moyen | Callout explicite "Saturday hack, non maintenu, sans licence" |
| Confusion multi-modèles / multi-personas | Élevée | Moyen | Tableau de distinction dès le début + Callouts |
| Tentation d'utiliser le blog Apsodia comme source | Moyen | Élevé | Règle inscrite dans CC-1 et dans les critères d'acceptation : non citable |
| `<CouncilBuilder />` casse le build SSG (hook client) | Moyen | Moyen | SSR-safe by design, `<Suspense>` si `useSearchParams`, test build dans CC-8 |
| Survente du pattern (laisser croire qu'il garantit de meilleures décisions) | Moyen | Moyen | Section "Quand c'est du gâchis" + garde-fou coût/tokens |

---

## Prochaines étapes après merge de cet EPIC

1. **Lancer CC-1** dès ouverture : la recherche factuelle conditionne tout le reste ; ne pas rédiger avant que `claude-council-facts.md` soit complet
2. **Cadrer la branche** : `feat/content-claude-council` depuis la branche d'intégration courante, PR ciblée
3. **Scan SonarQube** obligatoire avant merge (cf. feedback_sonar_before_merge)
4. **Mettre à jour STATUS.md** à l'ouverture du Sprint 1
5. **Mettre à jour les dates sitemap** (`dateModified` MDX + `lastModified` SITE_PAGES) quand la page est mergée
6. **Re-vérification trimestrielle** : valider que les modèles par défaut et les chiffres de popularité cités sont toujours exacts

---

## Lien avec les autres EPICs

- **EPIC Content find-skills 2026-05** : `find-skills` aide à découvrir des skills ; Claude Council est un exemple de pattern qu'on peut empaqueter en skill. Cross-link bidirectionnel (CC-6).
- **EPIC Stack design Claude Code 2026-05** : même pattern de page "skill / pattern unique", structure walkthrough à réutiliser.
- **EPIC SEO/GEO mai 2026** (clos ✅) : pattern title/description par locale à réutiliser ; viser l'intent GEO "faire délibérer plusieurs llm".
- **EPIC i18n espagnol 2026-05** : la page sera batch-traduite en ES une fois mergée FR + EN.
- **EPIC Tuto-pages article-shell 2026-05** : la page hérite de `TutoArticleContent` (section `skills` migrée) ; vérifier le rendu du `<CouncilBuilder />` dans le rail de contenu 3 colonnes.
