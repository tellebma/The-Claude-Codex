# EPIC : Page contenu — skill `find-skills` de vercel-labs (2026-05)

> Source : demande PO 2026-05-17. `find-skills` (vercel-labs/skills) est un meta-skill qui apprend à Claude Code à découvrir et installer d'autres skills via la Skills CLI (`npx skills`). Le Codex documente déjà plusieurs skills individuels (Impeccable, UI UX Pro Max, Taste Skill, Huashu Design dans l'EPIC stack design) mais aucune page n'explique comment **trouver** un skill adapté à un besoin précis. C'est le chaînon manquant entre "j'ai un problème" et "j'installe le bon skill".
> Date d'ouverture : 2026-05-17
> Effort estimé : **15 SP** (7 stories sur 2 sprints)
> Pré-requis : EPIC Refonte premium ✅ (article shell 3 colonnes stable), EPIC Bugfix search Vercel ✅ (index FR+EN propre). Compatible parallèle avec EPIC Stack design Claude Code (10 stories, 0% — ne se touchent pas)
> Priorité : Backlog haut (cornerstone "découverte écosystème skills", angle GEO sur intent "quel skill installer pour…")

---

## Contexte

### Ce que fait `find-skills`

`find-skills` est un skill Claude Code publié par **vercel-labs** dans le repo monorepo `vercel-labs/skills` (source canonique : [github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md), consultée 2026-05-17). Sa promesse : transformer toute question floue de l'utilisateur ("comment je fais X", "il y a un skill pour Y ?") en une recherche structurée dans l'écosystème skills, suivie d'une recommandation argumentée et d'une installation guidée.

**Triggers documentés dans le SKILL.md** :

- "how do I do X" / "comment je fais X"
- "find a skill for X" / "trouve-moi un skill pour X"
- "is there a skill for X" / "y a-t-il un skill qui…"
- "can you do X" (où X est une capacité spécialisée)
- Toute mention d'extension de capacités de l'agent

### Le Skills CLI sous-jacent (`npx skills`)

`find-skills` s'appuie sur la **Skills CLI**, présentée comme "le package manager de l'écosystème open agent skills". Commandes principales (source : SKILL.md vercel-labs, 2026-05-17) :

| Commande | Rôle |
|----------|------|
| `npx skills find [query]` | Recherche interactive ou par mot-clé |
| `npx skills add <owner/repo[@skill]>` | Installation depuis GitHub (flag `-g` global, `-y` skip confirmation) |
| `npx skills check` | Vérifie les mises à jour disponibles |
| `npx skills update` | Met à jour tous les skills installés |
| `npx skills init <nom>` | Initialise un nouveau skill local |

**Annuaire web** : [skills.sh](https://skills.sh/) — leaderboard classé par installs. Top sources mentionnées dans le SKILL.md : `vercel-labs/agent-skills` (100K+ installs sur plusieurs skills), `anthropics/skills` (100K+).

### Méthodologie de qualité enseignée par le skill

Le SKILL.md impose un workflow de vérification en 6 étapes avant de recommander un skill — c'est le cœur de sa valeur pédagogique et ce qui le distingue d'un simple `npm search` :

1. **Comprendre le besoin** : domaine + tâche spécifique + estimation pertinence existence skill
2. **Checker le leaderboard skills.sh** avant CLI search (les top skills sont battle-tested)
3. **Lancer `npx skills find <query>`** avec mots-clés ciblés
4. **Vérifier la qualité** avant de recommander : install count (≥ 1K idéalement, méfiance < 100), réputation source (officielles : `vercel-labs`, `anthropics`, `microsoft`), stars du repo source
5. **Présenter les options** avec install count + commande copy-paste + lien skills.sh
6. **Proposer l'installation** (`npx skills add ... -g -y`)

Catégories de recherche communes citées : Web Dev (react, nextjs, tailwind), Testing (jest, playwright), DevOps (docker, kubernetes, ci-cd), Documentation, Code Quality, Design (ui, ux, accessibility), Productivity.

### Pourquoi cet EPIC maintenant

| Indicateur | Donnée |
|------------|--------|
| Pages FR sur l'écosystème skills | 4 (skills/overview, skills/comparison, skills/best-skills, skills/architecture-skills) |
| Page dédiée à la découverte (méta-skill) | **0** (manque flagrant) |
| Pages décrivant des skills individuels | EPIC Stack design (4 fiches à venir : Impeccable, UIUX Pro Max, Taste, Huashu) |
| Concurrence FR sur "comment trouver un skill claude code" | Quasi-nulle |
| Concurrence EN | Modérée (article vercel.com officiel, quelques posts dev.to) |
| Angle Codex disponible | Walkthrough complet FR + démo CLI + critères qualité explicites + cas d'échec |
| Intent GEO | Très fort : un dev qui demande à un LLM "quel skill installer pour…" doit tomber sur cette page |
| **Force éditoriale n°1** (découverte FS-1) | **`find-skills` est le skill #1 mondial sur skills.sh avec ~1.6M installs (au 2026-05-17), soit ~4× le #2 (`frontend-design` d'anthropics à 422K).** Cet écart massif justifie un H1 qui leveragent la popularité ("le skill le plus installé au monde") et un angle SEO/GEO autour de "skill claude code le plus populaire" en plus de la recherche transactionnelle initiale. |

### Distinction à faire dans le contenu

Plusieurs concepts se chevauchent dans l'écosystème — la page doit clarifier :

| Terme | Définition courte |
|-------|------------------|
| **Skill** | Package modulaire (`SKILL.md` + assets) qui étend les capacités d'un agent |
| **Skills CLI** (`npx skills`) | Package manager pour découvrir, installer, mettre à jour des skills |
| **`find-skills`** | Skill spécifique qui apprend à l'agent à utiliser la Skills CLI intelligemment |
| **skills.sh** | Annuaire web + leaderboard de l'écosystème |
| **Standard SKILL.md** | Format YAML + Markdown commun aux skills (cf. taste-skill, anthropics/skills, vercel-labs/skills) |

Sans cette distinction, le lecteur va confondre "le skill `find-skills`" avec "la commande CLI `find`" ou avec "l'annuaire skills.sh".

---

## Stratégie éditoriale

### Persona cible

Développeur ou tech lead qui utilise déjà Claude Code et :

1. A entendu parler des skills mais ne sait pas comment en découvrir au-delà de ceux qu'on lui recommande
2. Veut une méthode reproductible pour évaluer la qualité d'un skill avant de l'installer (ne veut pas pourrir son env avec des skills douteux)
3. Cherche à déléguer la découverte à Claude Code lui-même (méta-usage : "trouve-moi le bon outil")

### Structure de page (proposée, à valider en Sprint 1)

| Section | Objectif | Composants MDX |
|---------|----------|----------------|
| En bref | 3 phrases : c'est quoi, à qui ça sert, comment l'activer | `<Callout type="info">` |
| Le problème : trop de skills, peu de méthode | Pourquoi la découverte manuelle est inefficace (30+ repos awesome-*, doublons, qualité hétérogène) | Texte + chiffres |
| Comment fonctionne `find-skills` | Schéma du flux : question utilisateur → recherche → vérification qualité → recommandation → install | `<Steps>` + diagramme texte |
| Installer le skill | Commande unique `npx skills add vercel-labs/skills@find-skills -g -y` + vérification | `<CodeBlock language="bash">` |
| Première utilisation : 3 exemples concrets | "Comment optimiser un Next.js ?" / "Trouve un skill pour reviewer mes PR" / "J'ai besoin d'un outil de typo" → sortie attendue de Claude | `<Tabs>` ou 3 blocs `<CodeBlock>` |
| Les critères de qualité enseignés | Install count, source officielle, stars repo — tableau avec seuils recommandés | Tableau MD |
| Catégories de skills à connaître | Web Dev / Testing / DevOps / Docs / Quality / Design / Productivity — exemples par catégorie | Tableau MD |
| Combiner avec d'autres skills du Codex | Cross-link vers `/skills/best-skills`, `/skills/architecture-skills`, EPIC Stack design (Impeccable, UIUX Pro Max…) | Liens internes |
| Limites et précautions | Skills propriétaires non listés sur skills.sh, hallucinations possibles sur skills <100 installs, dépendances réseau lors de l'install | `<Callout type="warning">` |
| Aller plus loin | Initier son propre skill (`npx skills init`), publier sur skills.sh, liens officiels vercel-labs et anthropics | Liste |

### Frontmatter cible

```yaml
title: "find-skills : laisser Claude Code trouver le bon skill pour vous"
description: "Le meta-skill de vercel-labs qui transforme \"je cherche un outil pour X\" en recommandation argumentée et installation guidée via npx skills, avec critères qualité (installs, source, stars)."
badge: "Skill"
section: "skills"
order: 5
datePublished: "2026-05-XX"
dateModified: "2026-05-XX"
themes: ["guide", "tooling", "productivity"]
```

---

## Périmètre

### In scope

- 1 page MDX FR `content/fr/skills/find-skills.mdx` (~1 500 mots, ton walkthrough pragmatique)
- 1 page MDX EN `content/en/skills/find-skills.mdx` (traduction et localisation)
- Capture d'écran terminal de `find-skills` en action sur une vraie demande utilisateur (mode clair + sombre)
- Intégration complète : navigation, sitemap, search-index, llms.txt, JSON-LD
- Cross-link bidirectionnel avec `/skills/overview`, `/skills/best-skills`, `/skills/architecture-skills`, `/skills/comparison`
- Audit Rédacteur (anti-IA, ton naturel) + audit SEO (cible "find-skills", "trouver un skill claude code", "découvrir skills claude code")

### Out of scope

- Refonte des 4 pages skills existantes (potentiel EPIC séparé)
- Fiches détaillées des skills cités en exemple (Impeccable, UIUX Pro Max… → couverts par EPIC Stack design)
- Tutoriel "créer son propre skill" en profondeur (mention rapide vers `npx skills init`, page dédiée hors scope)
- Comparatif Skills CLI vs Plugin marketplace Claude Code (autre EPIC potentiel)
- Démo vidéo (capture screen suffit pour le MVP)
- Traduction ES (sera repris dans EPIC i18n espagnol via story batch)

---

## Stories détaillées

### Sprint 1 — Recherche, draft FR, démo (9 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| FS-1 | Recherche et vérification factuelle. **Source primaire obligatoire** : `github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md` (consultée 2026-05-17). Sources secondaires : skills.sh (leaderboard, install counts), repo `anthropics/skills`, doc Claude Code sur les skills. Lister chaque fait précis (commandes exactes Skills CLI, format `npx skills add owner/repo@skill`, seuils install count cités par le skill, liste des 7 catégories, licence du skill, organisations officielles citées) avec source + date de consultation. Sortie : `docs/research/find-skills-facts.md` | 2 | `docs/research/find-skills-facts.md` |
| FS-2 | Rédaction MDX FR complète selon la structure validée (1 500 mots, frontmatter avec `themes: ["guide", "tooling", "productivity"]`, Steps walkthrough, Tabs ou triple CodeBlock pour les 3 exemples, Callout limites, tableaux qualité + catégories, cross-link vers les 4 pages skills existantes). Respect du style anti-IA (pas de tiret cadratin, pas de "permet de" creux, phrases courtes, ton naturel) | 5 | `content/fr/skills/find-skills.mdx` |
| FS-3 | Capture demo : exécuter `find-skills` dans Claude Code sur une demande réaliste ("je cherche un skill pour reviewer mes PR React"), capturer la sortie complète (recommandation + critères qualité + commande install), mode clair + mode sombre, optimisation WebP < 200 KB | 2 | `public/images/find-skills/{demo-light,demo-dark}.webp` |

### Sprint 2 — Traduction EN, intégration, qualité (6 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| FS-4 | Traduction EN avec localisation (terminologie native, exemples adaptés au public anglophone, pas de calque FR→EN). Validation parité structurelle (mêmes sections, mêmes Steps, mêmes Callouts) | 2 | `content/en/skills/find-skills.mdx` |
| FS-5 | Intégration site : ajout dans `lib/section-navigation.ts` (section `skills`, position selon `order: 5`), `SITE_PAGES` de `lib/metadata.ts` (priority 0.7, changeFrequency monthly), `searchIndexFr` + `searchIndexEn` de `lib/search-index.ts`, `POPULAR_SLUGS_FR/EN` du `scripts/generate-llms-txt.ts`. Régénérer `public/llms.txt` et `public/llms-full.txt` | 1 | 4 fichiers modifiés + 2 fichiers regen |
| FS-6 | Cross-link bidirectionnel : ajouter un encart "Voir aussi" dans `skills/overview.mdx`, `skills/best-skills.mdx`, `skills/architecture-skills.mdx`, `skills/comparison.mdx` (FR + EN, soit 8 fichiers) pointant vers `/skills/find-skills`. La nouvelle page link en retour vers ces 4 cornerstones | 1 | 8 MDX modifiés |
| FS-7 | Audit Rédacteur (skill `content-writer` ou agent dédié) sur ton, fluidité, anti-tics IA. Audit SEO en parallèle : title ≤ 60 car, description 140-160 car, présence des kw "find-skills", "trouver skill claude code", "découvrir skills", "npx skills". Tests E2E parité FR/EN sur `/fr/skills/find-skills/` + `/en/skills/find-skills/` (rendu, navigation, breadcrumb, table des matières, cross-links). Lighthouse ≥ 90 sur les 4 métriques. Vérification dark mode + light mode. A11y WCAG 2.1 AA | 2 | 2 rapports + corrections + `e2e/skills-find-skills.spec.ts` |

---

## Critères d'acceptation EPIC

- [ ] `/fr/skills/find-skills/` et `/en/skills/find-skills/` répondent 200, contenu localisé correct
- [ ] Frontmatter `themes` valide (1 type + 2 domaines : guide + tooling + productivity)
- [ ] Tous les faits précis ont une source vérifiée datée dans `docs/research/find-skills-facts.md`, avec **github.com/vercel-labs/skills comme source primaire**
- [ ] Les commandes Skills CLI citées dans la page correspondent exactement au SKILL.md officiel (pas de drift)
- [ ] Distinction claire entre "skill `find-skills`", "Skills CLI", "skills.sh" et "standard SKILL.md" — pas de confusion possible à la lecture
- [ ] Capture de démo réelle (pas un mockup) sur une demande utilisateur réaliste
- [ ] 4 pages skills existantes (FR + EN, 8 fichiers) linkent vers la nouvelle page
- [ ] Recherche site interne (Cmd+K) trouve la page sur "find-skills", "découvrir skill", "npx skills"
- [ ] `public/llms.txt` mentionne la page dans la section skills
- [ ] `npm run build` propre, `npm run lint`, `npm run type-check` OK
- [ ] Lighthouse FR ≥ 90 sur les 4 métriques (Performance, Accessibilité, Best Practices, SEO)
- [ ] E2E parité passe sur CI
- [ ] Audit Rédacteur validé (note ≥ 8/10 sur ton naturel)
- [ ] Audit SEO validé (cible kw présente sans bourrage, score interne ≥ 8/10)
- [ ] Cohérence avec la règle "rigueur journalistique" du CLAUDE.md : aucune affirmation factuelle sans source datée (install counts notamment, qui bougent vite)

---

## Métriques cibles (3 mois post-publication)

| Métrique | Cible 3 mois |
|----------|--------------|
| Position GSC requête "find-skills" (FR + EN) | ≤ 5 |
| Position GSC requête "trouver skill claude code" | ≤ 8 |
| Position GSC requête "npx skills" | ≤ 10 |
| Impressions GSC page | ≥ 1 200 / mois |
| CTR moyen page | ≥ 4 % |
| Scroll depth médian Matomo | ≥ 55 % (page didactique, lecture attendue) |
| Clics sortants vers `/skills/best-skills` ou `/skills/architecture-skills` | ≥ 60 / mois (signal pertinence cross-link) |
| Citations LLM (GEO, mesure trimestrielle manuelle) | ≥ 2 LLM majeurs sur 4 (ChatGPT, Claude, Perplexity, Gemini) qui citent la page sur l'intent "comment trouver un skill claude code" |

---

## Dépendances et risques

### Dépendances bloquantes

- Aucune côté code (article shell, MDX, navigation déjà stables)
- Aucune côté humain (rédaction interne possible avec sources publiques)

### Risques résiduels

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| vercel-labs renomme le repo ou bouge le SKILL.md | Faible | Moyen | Vérification au moment de publier (FS-1 re-trigge en pré-merge si décalage > 1 mois) |
| Install counts cités deviennent obsolètes (chiffres bougent vite) | Élevée | Faible | Préfixer chaque chiffre avec date de constatation, mention "données au YYYY-MM-DD, vérifier sur skills.sh" |
| Confusion lecteur entre `find-skills` (skill) et `npx skills find` (commande CLI) | Élevée | Moyen | Tableau de distinction des 4 concepts dès l'intro + encadrés `<Callout>` aux endroits clés |
| Skills CLI évolue (nouvelles commandes ou breaking changes) | Moyen | Moyen | `dateModified` à jour, re-vérification trimestrielle (à inscrire dans le STATUS.md) |
| Capture d'écran obsolète après update UI Claude Code | Moyen | Faible | Re-shoot trimestriel via la story `dateModified` mise à jour |
| Survente du skill (laisser entendre qu'il garantit la qualité) | Moyen | Moyen | Section "Limites" explicite + Callout warning sur skills < 100 installs |
| skills.sh down ou changeant de modèle commercial | Faible | Élevé | Mention de la doc fallback (consulter directement GitHub), pas de dépendance editoriale forte au site |

---

## Prochaines étapes après merge de cet EPIC

1. **Lancer FS-1** dès ouverture : la recherche factuelle conditionne tout le reste, ne pas commencer la rédaction avant que le fichier `find-skills-facts.md` soit complet
2. **Cadrer la branche** : `feat/content-find-skills` depuis `develop`, PR ciblée vers `develop`
3. **Scan SonarQube** obligatoire avant merge develop (cf. feedback_sonar_before_merge.md)
4. **Mettre à jour STATUS.md** du backlog à l'ouverture du Sprint 1
5. **Mettre à jour le sitemap dates** quand la page est mergée (cf. règle "Mise à jour des dates sitemap" du CLAUDE.md)
6. **Re-vérification trimestrielle** : programmer un rappel à T+3 mois pour valider que les commandes Skills CLI et les install counts cités sont toujours exacts

---

## Lien avec les autres EPICs

- **EPIC Stack design Claude Code 2026-05** (en attente Sprint 1) : `find-skills` est l'outil méta qui aide à découvrir les 4 skills décrits dans cet EPIC parallèle (Impeccable, UIUX Pro Max, Taste, Huashu). Cross-link bidirectionnel à prévoir une fois les deux EPICs livrés.
- **EPIC Ecosystem trending repos 2026-05** (clos ✅) : `vercel-labs/skills` figure probablement dans les top repos liés à Claude Code. Vérifier qu'ECO référence bien le repo et linke vers cette page.
- **EPIC SEO/GEO mai 2026** (clos ✅) : pattern title/description par locale à réutiliser. Cibler l'intent GEO "quel skill installer pour…" qui matche directement la promesse de `find-skills`.
- **EPIC i18n espagnol 2026-05** : la nouvelle page sera batch-traduite par story ES-9 (Sprint 4) une fois mergée en FR + EN.
- **EPIC Vercel Metrics 2026** : suivre dans le rapport hebdo VM-12 la performance SEO de cette nouvelle page (impressions, position, CTR) à partir de J+30 post-publication, avec attention particulière à l'intent GEO.
- **EPIC Content /security-review 2026-05** (clos ✅) : pattern de page "skill / commande unique" déjà éprouvé, structure walkthrough à dupliquer ici.
