# EPIC : Page contenu — commande `/security-review` de Claude Code (2026-05)

> Source : demande PO 2026-05-12. Anthropic propose depuis le 2025-08-06 une commande native de revue de sécurité dans Claude Code (`/security-review`) couplée à une GitHub Action officielle (`anthropics/claude-code-security-review`). Le Codex ne couvre pas encore cette feature alors qu'elle est centrale pour l'angle DevSecOps du site.
> Date d'ouverture : 2026-05-12
> Effort estimé : **19 SP** (8 stories sur 3 sprints)
> Pré-requis : EPIC Refonte premium ✅ (article shell 3 colonnes stable), EPIC Bugfix search Vercel ✅ (index FR+EN propre)
> Priorité : Backlog haut (cornerstone DevSecOps, vide concurrentiel FR sur cette commande précise)

---

## Contexte

### Ce que fait `/security-review`

Commande slash native de Claude Code, annoncée le **2025-08-06** et documentée officiellement par Anthropic dans le centre d'aide (source canonique FR : [support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code](https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code), dernière MAJ 2026-03-12, consultée 2026-05-12 ; annonce produit : [claude.com/blog/automate-security-reviews-with-claude-code](https://claude.com/blog/automate-security-reviews-with-claude-code)). Elle déclenche une revue de sécurité dirigée par un prompt spécialisé Anthropic sur les changements en cours ou sur le repo entier, et peut ensuite appliquer un fix.

**Couverture vulnérabilités selon la doc officielle Anthropic** (5 familles, source : support.claude.com FR) :

| Famille officielle | Périmètre |
|--------------------|-----------|
| Risques d'injection SQL | Détection des points d'entrée non assainis vers la base |
| Script intersite (XSS) | Reflected, stored, DOM-based |
| Failles d'authentification et d'autorisation | Auth cassée, escalade de privilèges, IDOR |
| Gestion et validation de données non sécurisées | Validation absente, sanitization fragile, mauvaise gestion des erreurs |
| Vulnérabilités de dépendances tierces | Packages obsolètes, CVEs connues |

**Périmètre étendu côté GitHub Action** (source : [github.com/anthropics/claude-code-security-review](https://github.com/anthropics/claude-code-security-review), MIT, 4.6k stars, consulté 2026-05-12) qui détaille les sous-familles concrètement détectées : command injection, LDAP, XPath, NoSQL, XXE, hardcoded secrets, weak crypto, race conditions, TOCTOU, RCE via désérialisation, insecure defaults, typosquatting. La page Codex doit présenter les 5 familles officielles comme structure principale et les sous-types comme exemples concrets.

### Deux mécanismes de livraison

1. **Slash command terminal** : `/security-review` dans Claude Code, à la demande, sur la diff courante. Claude peut ensuite proposer et appliquer un patch.
2. **GitHub Action** : `anthropics/claude-code-security-review@main`, déclenchée automatiquement à chaque PR. Commente inline les findings avec recommandations de fix. **Licence MIT, 4.6k stars** (constaté 2026-05-12).

### Éligibilité (à mettre en avant dans la page)

Selon la doc officielle Anthropic (support.claude.com FR, consultée 2026-05-12), `/security-review` et la GitHub Action sont disponibles pour :

- Plans payants Claude Code individuels : **Pro** et **Max**
- Comptes **API Console** en facturation pay-as-you-go

Hors scope : plan gratuit. Cette info est critique pour le persona DevSecOps qui pose souvent la question du modèle commercial avant d'intégrer un outil en CI.

### Pourquoi cet EPIC maintenant

| Indicateur | Donnée |
|------------|--------|
| Pages FR sécurité existantes | 5 (bonnes-pratiques-securite, ci-cd-cyber-securite, fuite-cle-api, mcp/mcp-securite, plugins/best-security) |
| Page dédiée à `/security-review` | **0** (manque flagrant) |
| Volume recherche estimé "claude code security review" | Émergent (feature 9 mois) |
| Concurrence FR sur la requête | Quasi-nulle |
| Concurrence EN sur la requête | Modérée (thenewstack, stackhawk, helpnetsecurity) |
| Angle Codex disponible | Walkthrough complet FR + démo workflow GHA + cross-link DevSecOps |

### Distinction à faire dans le contenu

Anthropic a lancé en parallèle un **produit "Claude Code Security"** plus large (scan de codebase complet, suggestion de patches, beta Enterprise depuis février-avril 2026). La page Codex doit clairement séparer :

- **`/security-review` (slash command + GHA)** : focus de cet EPIC, disponible à tous les plans Claude Code
- **Claude Code Security (produit web)** : mention rapide dans une section "Aller plus loin", lien vers la doc Anthropic, hors scope rédactionnel principal

Sans cette séparation, le lecteur confondra les deux et la page perdra en clarté.

---

## Stratégie éditoriale

### Persona cible

Développeur senior ou tech lead avec sensibilité DevSecOps qui :

1. A déjà lu `bonnes-pratiques-securite.mdx` (cornerstone) et veut une action concrète à mettre en place ce soir
2. Cherche à automatiser la revue de sécurité sans installer un Snyk/Semgrep payant
3. Veut comprendre les limites de la commande avant de la déployer en CI sur du code prod

### Structure de page (proposée, à valider en Sprint 1)

| Section | Objectif | Composants MDX |
|---------|----------|----------------|
| En bref | Réponse 3 phrases : c'est quoi, à qui ça sert, comment l'activer | `<Callout type="info">` |
| Éligibilité plans | Pro / Max / API Console, exclusion plan gratuit | Tableau MD |
| Pourquoi `/security-review` change la donne | Cas concret avant/après, valeur vs scanners statiques classiques | Texte + comparaison |
| Utiliser la commande en local | Walkthrough terminal : invocation, sortie type, application du fix | `<Steps>` + `<CodeBlock>` |
| Automatiser via GitHub Action | YAML complet copiable, permissions minimales, gestion `CLAUDE_API_KEY` | `<CodeBlock language="yaml">` |
| Les 5 familles officielles détectées | Tableau des 5 catégories doc Anthropic + sous-types concrets de la GHA | Tableau MD |
| Limites et faux positifs | Honnêteté : prompt injection (signalé par Anthropic), code propriétaire envoyé à l'API, coût tokens | `<Callout type="warning">` |
| Comment l'intégrer à un workflow DevSecOps | Combiner avec gitleaks, dependabot, CODEOWNERS, branch protection | Cross-link vers ci-cd-cyber-securite |
| Aller plus loin | Mention Claude Code Security (produit web), liens officiels support.claude.com | Liste |

### Frontmatter cible

```yaml
title: "Commande /security-review : audit de sécurité dans Claude Code"
description: "Détecter et corriger les failles SQL, XSS, secrets en clair et 7 autres familles directement depuis Claude Code, en local ou en CI via GitHub Action."
badge: "Sécurité"
section: "advanced"
order: 16
datePublished: "2026-05-XX"
dateModified: "2026-05-XX"
themes: ["tutorial", "security", "devsecops"]
```

---

## Périmètre

### In scope

- 1 page MDX FR `content/fr/advanced/security-review.mdx` (~1 800 mots, ton walkthrough)
- 1 page MDX EN `content/en/advanced/security-review.mdx` (traduction et localisation)
- Workflow YAML copiable testé sur un repo jetable
- 1 capture d'écran de la sortie terminal `/security-review` (mode clair + sombre)
- Intégration complète : navigation, sitemap, search-index, llms.txt, JSON-LD
- Cross-link bidirectionnel avec les 5 pages sécurité existantes
- Audit Rédacteur (anti-IA, ton naturel) + audit SEO (cible "audit sécurité claude code", "claude code security review")

### Out of scope

- Refonte des 5 pages sécurité existantes (audit cross-pages = autre EPIC potentiel)
- Documentation du produit "Claude Code Security" (web, Enterprise) au-delà d'une mention de 4 lignes
- Démo vidéo (la capture screen suffit pour le MVP)
- Traduction ES (sera repris dans EPIC i18n espagnol via story ES-9 batch)
- Page dédiée pour la GitHub Action (sous-section de la page principale, pas un MDX séparé)

---

## Stories détaillées

### Sprint 1 — Recherche, draft FR, démo (8 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| SR-1 | Recherche et vérification factuelle. **Source primaire obligatoire** : `support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code` (centre d'aide Anthropic FR, dernière MAJ 2026-03-12). Sources secondaires : blog claude.com, repo `anthropics/claude-code-security-review`. Lister chaque fait précis (5 familles officielles, plans éligibles Pro/Max/API Console, signature commande, format YAML GHA, licence MIT, stars 4.6k) avec source + date de consultation. Sortie : `docs/research/security-review-facts.md` | 2 | `docs/research/security-review-facts.md` |
| SR-2 | Rédaction MDX FR complète selon la structure validée (1 800 mots, frontmatter avec `themes: ["tutorial", "security", "devsecops"]`, Steps walkthrough, Callout limites, tableau familles vuln, cross-link vers 5 pages sécurité existantes). Respect du style anti-IA (pas de tiret cadratin, pas de "permet de" creux, phrases courtes) | 5 | `content/fr/advanced/security-review.mdx` |
| SR-3 | Capture demo : exécuter `/security-review` sur un repo jetable avec faille intentionnelle (SQL injection toy + secret hardcodé), capture mode clair + mode sombre, optimisation WebP < 200 KB | 1 | `public/images/security-review/{demo-light,demo-dark}.webp` |

### Sprint 2 — Traduction EN, intégration site (7 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| SR-4 | Traduction EN avec localisation (terminologie sécurité native, exemples adaptés, pas de calque FR→EN). Validation parité de structure (mêmes sections, mêmes Steps, mêmes Callouts) | 3 | `content/en/advanced/security-review.mdx` |
| SR-5 | Intégration site : ajout dans `lib/section-navigation.ts` (section `advanced`, après `permissions-sandbox`), `SITE_PAGES` de `lib/metadata.ts` (priority 0.7, changeFrequency monthly), `searchIndexFr` + `searchIndexEn` de `lib/search-index.ts`, `SECTION_LANDINGS_FR/EN` + `POPULAR_SLUGS_FR/EN` du `scripts/generate-llms-txt.ts`. Régénérer `public/llms.txt` et `public/llms-full.txt` | 2 | 5 fichiers modifiés + 2 fichiers regen |
| SR-6 | Cross-link bidirectionnel : ajouter un encart "Voir aussi" dans `bonnes-pratiques-securite.mdx`, `ci-cd-cyber-securite.mdx`, `mcp/mcp-securite.mdx`, `plugins/best-security.mdx`, `fuite-cle-api.mdx` (FR + EN, soit 10 fichiers) pointant vers `/advanced/security-review`. La nouvelle page link en retour vers les 5 cornerstones | 2 | 10 MDX modifiés |

### Sprint 3 — Qualité, audit, validation (4 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| SR-7 | Audit Rédacteur (skill `content-writer` ou agent dédié) sur ton, fluidité, anti-tics IA. Audit SEO en parallèle : title ≤ 60 car, description 140-160 car, présence des kw "audit sécurité claude code", "claude code security review", "github action sécurité IA". Intégration corrections en 1 passe | 2 | 2 rapports + corrections appliquées au MDX FR/EN |
| SR-8 | Tests E2E : parité FR/EN sur `/fr/advanced/security-review/` + `/en/advanced/security-review/` (rendu, navigation, breadcrumb, table des matières, cross-links). Lighthouse ≥ 90 sur les 4 métriques. Vérification visuelle dark mode + light mode. Validation accessibilité (focus visible, contrastes WCAG 2.1 AA) | 2 | `e2e/advanced-security-review.spec.ts` + rapport Lighthouse archivé |

---

## Critères d'acceptation EPIC

- [ ] `/fr/advanced/security-review/` et `/en/advanced/security-review/` répondent 200, contenu localisé correct
- [ ] Frontmatter `themes` valide (1 type + 2 domaines : tutorial + security + devsecops)
- [ ] Tous les faits précis ont une source vérifiée datée dans `docs/research/security-review-facts.md`, avec **support.claude.com FR comme source primaire** pour la description du produit
- [ ] Les 5 familles de vulnérabilités citées dans la page correspondent à la liste officielle Anthropic (pas de sur-promesse, sous-types issus de la GHA présentés comme "exemples concrets")
- [ ] Section "Éligibilité plans" présente et exacte (Pro / Max / API Console pay-as-you-go, exclusion plan gratuit)
- [ ] Workflow YAML GHA testé sur un repo jetable, commente bien la PR
- [ ] 5 pages sécurité existantes (FR + EN, 10 fichiers) linkent vers la nouvelle page
- [ ] Recherche site interne (Cmd+K) trouve la page sur "security-review", "audit sécurité", "github action sécurité"
- [ ] `public/llms.txt` mentionne la page dans la section appropriée
- [ ] `npm run build` propre, `npm run lint`, `npm run type-check` OK
- [ ] Lighthouse FR ≥ 90 sur les 4 métriques (Performance, Accessibilité, Best Practices, SEO)
- [ ] E2E parité passe sur CI
- [ ] Audit Rédacteur validé (note ≥ 8/10 sur ton naturel)
- [ ] Audit SEO validé (cible kw présente sans bourrage, score interne ≥ 8/10)
- [ ] Cohérence avec la règle "rigueur journalistique" du CLAUDE.md : aucune affirmation factuelle sans source datée

---

## Métriques cibles (3 mois post-publication)

| Métrique | Cible 3 mois |
|----------|--------------|
| Position GSC requête "claude code security review" (FR) | ≤ 5 |
| Position GSC requête "audit sécurité claude code" | ≤ 8 |
| Impressions GSC page | ≥ 1 500 / mois |
| CTR moyen page | ≥ 4 % |
| Scroll depth médian Matomo | ≥ 50 % |
| Clics sortants vers `bonnes-pratiques-securite` ou `ci-cd-cyber-securite` | ≥ 80 / mois (signal pertinence cross-link) |

---

## Dépendances et risques

### Dépendances bloquantes

- Aucune côté code (article shell, MDX, navigation déjà stables)
- Aucune côté humain (rédaction interne possible avec sources publiques)

### Risques résiduels

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Anthropic renomme la commande ou change la signature | Faible | Moyen | Vérification au moment de publier (SR-1 retrigge en pré-merge si décalage > 1 mois) |
| Confusion lecteur entre `/security-review` (CLI) et "Claude Code Security" (produit web) | Élevée | Moyen | Section dédiée "Distinction des deux offres", bandeau Callout |
| Prompt injection signalé par Anthropic sur la GHA non hardenée | Certain (déjà documenté) | Moyen | Section "Limites" explicite + recommandation "approve required for external contributors" |
| Capture d'écran obsolète après update UI Claude Code | Moyen | Faible | Re-shoot trimestriel via la story `dateModified` mise à jour |
| Faux positifs élevés sur certains stacks (Rust, Go) | Moyen | Faible | Mention honnête + lien vers issues GitHub du repo officiel |
| Mention "Claude Code Security" devient obsolète quand GA | Élevée | Faible | Phrase datée "au YYYY-MM-DD, en beta Enterprise" |

---

## Prochaines étapes après merge de cet EPIC

1. **Lancer SR-1** dès ouverture : la recherche factuelle conditionne tout le reste, ne pas commencer la rédaction avant que le fichier `security-review-facts.md` soit complet
2. **Cadrer la branche** : `feat/content-security-review` depuis `develop`, PR ciblée vers `develop`
3. **Scan SonarQube** obligatoire avant merge develop (cf. feedback_sonar_before_merge.md)
4. **Mettre à jour STATUS.md** du backlog à l'ouverture du Sprint 1
5. **Mettre à jour le sitemap dates** quand la page est mergée (cf. règle "Mise à jour des dates sitemap" du CLAUDE.md)

---

## Lien avec les autres EPICs

- **EPIC SEO/GEO mai 2026** (clos) : pattern title/description par locale à réutiliser pour cette page
- **EPIC i18n espagnol 2026-05** : la nouvelle page sera batch-traduite par story ES-9 (Sprint 4) une fois mergée en FR + EN
- **EPIC Stack design Claude Code 2026-05** (ouvert) : la fiche "Skill / commande" produit ici sert de référence pour le pattern walkthrough commande slash (à dupliquer pour les futurs `/cost`, `/compact`, etc.)
- **EPIC Vercel Metrics 2026** : suivre dans le rapport hebdo VM-12 la performance SEO de cette nouvelle page (impressions, position, CTR) à partir de J+30 post-publication
- **EPIC Ecosystem trending repos 2026-05** : si `anthropics/claude-code-security-review` (4.6k stars) entre dans le top repos GitHub liés à Claude Code, ECO-10/11 doit cross-linker vers cette page
