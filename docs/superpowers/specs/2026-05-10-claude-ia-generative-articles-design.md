# Design — Série d'articles "Claude Code + IA générative" (V1)

**Date** : 2026-05-10
**Auteur** : Maxime Bellet (via Claude Opus 4.7)
**Statut** : Validé sections 1-3, en attente review user du spec
**Branche cible** : nouvelle branche `feat/articles-ia-generative-v1` depuis `develop`

---

## 1. Contexte et décision stratégique

### Origine

L'utilisateur a envisagé d'ajouter au Codex une série d'articles sur la génération d'image et de vidéo via IA (Midjourney, ComfyUI, Stable Diffusion, Sora, Flux). La discussion a écarté cette piste directe pour deux raisons :

- **Dilution de la topical authority** : le Codex est positionné sur Claude Code (CLI Anthropic). Ajouter un cluster sémantique non-relié casse la cohérence vue par Google (Helpful Content Updates, AI Overviews) et tire la qualité du domaine vers le bas.
- **Trafic non qualifié** : un visiteur qui cherche "Stable Diffusion local RTX 4070" ne convertit pas vers MCP/agents Claude Code. Bounce rate élevé = signal négatif au niveau domaine.

### Décision retenue : la "3ème voie"

Traiter l'IA générative **uniquement sous l'angle Claude Code** : MCP, agents, skills, workflows qui pilotent des outils de génération visuelle. On capture la requête sémantique "IA générative" sans diluer l'ADN éditorial.

### Architecture choisie : Approche B (distribuée)

Pas de nouvelle section. Les 6 articles V1 s'insèrent dans les sections existantes (`use-cases/`, `mcp/`, `agents/`) qu'ils renforcent. Aucun refactor structurel (pas de nouveau layout, pas de modification du Header, pas de changement i18n).

Approches écartées :
- **Approche A** (nouvelle section `/ai-image`) : effort structurel important, signal éditorial "le Codex parle aussi d'IA générative" — exactement ce qu'on voulait éviter.
- **Approche C** (sous-cluster `use-cases/ia-generative/`) : pattern de sous-dossiers à 2 niveaux inexistant dans le projet, casserait `lib/mdx.ts`.

---

## 2. Périmètre V1

### Cadrage validé

| Dimension | Choix |
|---|---|
| Nombre d'articles | 3 cornerstone + 3 satellites = 6 articles × 2 langues = 12 MDX |
| Scope technique | Image (local + cloud). Vidéo reportée à V2 si traction. |
| Profondeur | Vulgarisation des concepts ("comment ça marche") + tuto reproductible |
| Public cible | Dev fullstack curieux, pas chercheur ML |
| Langues | FR + EN obligatoires (CLAUDE.md) |
| Multi-agents | Oui, dispatch experts par domaine |

### Stratégie test-and-learn

Le V1 est un sondage de marché. Si les analytics Matomo + GSC montrent une niche (impressions/clics significatifs sur les requêtes ciblées d'ici 8-12 semaines), on déclenche le V2 étendu (2 satellites supplémentaires + 1 article vidéo). Sinon, on n'investit pas davantage.

---

## 3. Liste détaillée des 6 articles

| # | Type | Section | Slug FR / EN | Titre FR | Cible SEO principale | Themes |
|---|---|---|---|---|---|---|
| **C1** | Cornerstone | `use-cases/` | `ia-generative-creative` | Claude Code + IA générative : panorama d'un workflow créatif moderne | "claude code génération image", "agent ia création visuelle" | `["guide", "tooling", "productivity"]` |
| **C2** | Cornerstone | `mcp/` | `comfyui-mcp-local` | Brancher ComfyUI à Claude Code via MCP : générer des images en local sur ton GPU | "mcp comfyui", "claude code stable diffusion local" | `["tutorial", "tooling", "architecture"]` |
| **C3** | Cornerstone | `agents/` | `agent-generation-assets` | Construire un agent Claude qui génère et publie tes assets visuels | "agent claude génération image", "claude code flux api" | `["tutorial", "architecture", "tooling"]` |
| **S1** | Satellite | `mcp/` | `comfyui-workflow-piloting` | Piloter un workflow ComfyUI JSON depuis Claude Code | "comfyui workflow json mcp" | `["reference", "tooling"]` |
| **S2** | Satellite | `use-cases/` | `assets-blog-automatique` | Automatiser la génération des visuels d'un blog Next.js avec Claude | "génération assets blog ia", "next.js images automatique ia" | `["use-case", "productivity"]` |
| **S3** | Satellite | `use-cases/` | `image-ia-local-vs-cloud` | IA générative d'image en 2026 : local (ComfyUI/Flux) vs cloud (Midjourney/Replicate), comparatif coût et qualité | "stable diffusion local vs cloud", "coût flux api comparatif" | `["comparison", "tooling"]` |

### Stratégie de liens internes

- **C1** est le hub : lie vers C2, C3, S2.
- **C2** lie vers S1 (workflow JSON) et S3 (comparatif).
- **C3** lie vers S2 (use case blog) et S3 (comparatif).
- Chaque satellite lie vers son cornerstone parent + 1 cornerstone connexe.

---

## 4. Plan détaillé de chaque article

### C1 — Panorama Claude Code + IA générative (~2000 mots)

**Angle** : pose le problème (devs qui veulent générer des assets sans quitter leur flow) et présente le paysage 2026 : 4 ways de brancher Claude Code à de l'IA visuelle.

**Structure** :
1. Le problème : générer 50 images pour un blog/produit sans switcher 10 outils
2. Les 4 patterns d'intégration (avec schéma) : (a) MCP local ComfyUI, (b) MCP cloud Replicate/OpenAI, (c) Agent SDK + API directe, (d) Skill + script local
3. Tableau comparatif des 4 patterns (latence, coût, contrôle, courbe d'apprentissage)
4. Quel pattern pour quel cas d'usage (matrice décisionnelle)
5. Prochaines étapes → liens vers C2 (local) et C3 (cloud)

### C2 — MCP ComfyUI local sur GPU (~3000 mots, le plus long)

**Angle** : vulgarisation diffusion + tuto reproductible bout-en-bout.

**Structure** :
1. Comment marche un modèle de diffusion (analogie : sculpter dans le bruit). Concepts : latent space, U-Net, sampler, VAE, ControlNet — 1 paragraphe par concept avec analogie
2. Pourquoi ComfyUI (graphe de nœuds vs Automatic1111 monolithique)
3. Pré-requis matériel (VRAM 6/8/12/24 Go → modèles compatibles : SDXL, Flux Schnell/Dev, SD 1.5)
4. Installation ComfyUI + 1 modèle Flux Schnell (étapes numérotées via `<Steps>`)
5. Brancher un MCP ComfyUI à Claude Code (`.mcp.json`, schéma conceptuel)
6. Premier prompt depuis Claude Code → image générée
7. Troubleshooting (CUDA, OOM, modèle absent)
8. → liens vers S1 (workflow JSON) et S3 (comparatif)

### C3 — Agent Claude génération assets via API cloud (~2500 mots)

**Angle** : pas de GPU, scale en prod. Construction d'un agent SDK qui génère + optimise + publie.

**Structure** :
1. Quand préférer le cloud (CI/CD, scale, pas de GPU, qualité Flux Pro/MJ)
2. Architecture de l'agent (schéma) : Claude → outil "generate_image" (Replicate/Flux API) → outil "optimize_webp" → outil "upload_storage"
3. Implémentation step-by-step : Agent SDK Python ou TypeScript (snippets), définition des tools, prompt système
4. Gestion des erreurs (rate limits, NSFW filter, retry)
5. Coût d'exécution réel (1 article blog = X images = Y centimes)
6. → liens vers S2 (use case blog Next.js) et S3 (comparatif)

### S1 — Piloter un workflow ComfyUI JSON (~1200 mots)

**Angle** : tutoriel ciblé pour la requête "comfyui workflow json mcp". Passer un workflow ComfyUI exporté en JSON à Claude pour qu'il le modifie/exécute dynamiquement.

**Structure** :
1. Anatomie d'un workflow ComfyUI JSON (nodes, edges, exemples)
2. Exposer le workflow via un outil MCP custom
3. Prompt pour faire éditer le workflow par Claude
4. Cas d'usage : changer le sampler, ajouter un ControlNet, modifier le prompt en boucle
5. → lien vers C2 (cornerstone parent) + S3

### S2 — Assets blog Next.js automatique (~1500 mots)

**Angle** : use-case concret. Script + agent qui scanne tes `.mdx`, détecte les titres sans image OG, génère + sauvegarde + met à jour le frontmatter.

**Structure** :
1. Le besoin : 50+ articles, image OG manquante, manuel = enfer
2. Architecture du script (orchestration agent Claude + outils)
3. Implémentation : scanner MDX, prompt design pour image OG cohérente, génération via API, optimisation WebP, écriture frontmatter
4. Code reproductible complet (snippet TS)
5. Limites et coût total
6. → lien vers C3 (cornerstone parent) + C1

### S3 — Local vs cloud, comparatif chiffré (~1800 mots)

**Angle** : tableau de bord coût/qualité/vitesse pour 4-5 solutions (ComfyUI+Flux Schnell local, Flux Pro Replicate, DALL-E 3, Midjourney via proxy, SDXL local). Benchmark sur 3 cas d'usage : portrait, illustration tech, photo produit.

**Structure** :
1. Méthodologie du comparatif (machine de test, prompts, critères)
2. Résultats : 5 solutions × 3 cas d'usage = matrice 15 cellules
3. Coût TCO (machine + électricité local vs API cloud) sur 1000 images
4. Latence (cold start, génération, post-process)
5. Matrice décisionnelle (pas de classement universel)
6. → liens vers C2 et C3

---

## 5. Composants MDX utilisés

| Composant | Usage dans la série |
|---|---|
| `<Callout type="warning">` | Warnings VRAM, sécurité API key, NSFW filter |
| `<Callout type="tip">` | Astuces de prompt, gain de perf |
| `<Callout type="info">` | Définitions de concepts ML |
| `<Steps><Step>` | Tutos installation (C2), implémentation agent (C3, S2) |
| `<CodeBlock>` | Snippets shell, Python, TypeScript, JSON workflow |
| `<Tabs>` | Python vs TypeScript dans C3, comparaisons inline dans S3 |
| `<Card>` | Comparatifs visuels dans C1 et S3 |

---

## 6. Mapping agents experts par article

| Article | Agent principal (rédaction) | Agent revue technique | Agent revue qualité |
|---|---|---|---|
| C1 | `content-writer` | `claude-expert` (panorama MCP/agents) | `code-reviewer` |
| C2 | `content-writer` | `claude-expert` (MCP/ComfyUI) + `devsecops-architect` (setup local/Docker GPU) | `code-reviewer` (snippets shell) |
| C3 | `content-writer` | `claude-expert` (Agent SDK) | `code-reviewer` (snippets TS/Python) |
| S1 | `content-writer` | `claude-expert` | `code-reviewer` |
| S2 | `content-writer` | `claude-expert` (Next.js + agent) | `code-reviewer` |
| S3 | `content-writer` | `claude-expert` (validation chiffres marché) | — |

---

## 7. Ordre d'écriture

Séquence à respecter pour cohérence des liens internes :

1. **C2** d'abord (le plus dense techniquement, fondation pour S1/S3)
2. **C3** ensuite (utilise les concepts d'agents établis)
3. **C1** après (peut référencer C2/C3 dans le panorama)
4. **S1, S2, S3** en parallèle (3 agents `content-writer` dispatchés via `superpowers:dispatching-parallel-agents`)

Chaque article = FR + EN écrits dans la même passe pour cohérence (CLAUDE.md exige les deux).

### Workflow rédaction → revue par article

Pour chaque article, séquence interne stricte :

1. Agent principal (`content-writer`) rédige FR + EN
2. Agent revue technique (`claude-expert` ± `devsecops-architect`) relit, propose corrections, content-writer applique
3. Agent revue qualité (`code-reviewer`) vérifie snippets et conformité (sauf S3 qui n'a pas de code)
4. Article validé → passage au suivant (ou article suivant en parallèle pour S1/S2/S3)

Les articles cornerstone (C1/C2/C3) sont strictement séquentiels. Les satellites (S1/S2/S3) peuvent être lancés en parallèle car ils n'ont pas de dépendance entre eux (uniquement sur leur cornerstone parent déjà terminé).

---

## 8. Intégrations techniques (post-rédaction)

Fichiers à modifier au-delà des 12 MDX :

| Fichier | Modification |
|---|---|
| `src/lib/metadata.ts` | Ajouter 6 entrées dans `SITE_PAGES` × 2 langues = 12 routes (avec `priority`, `changeFrequency`, `lastModified`) |
| `src/lib/search-index.ts` | Ajouter 6 entrées dans `searchIndexFr` + 6 dans `searchIndexEn` |
| `scripts/generate-llms-txt.ts` | Ajouter slugs C1/C2/C3 dans `POPULAR_SLUGS_FR` et `POPULAR_SLUGS_EN` (cornerstones uniquement) |
| `messages/fr.json` + `messages/en.json` | Aucune modification (sections existantes) |

Aucune modification de `Header.tsx`, `section-navigation.ts`, `app/[locale]/{section}/layout.tsx` ou `next.config.mjs`.

---

## 9. Vérifications obligatoires (CLAUDE.md)

### Build et qualité

- `npm run lint && npm run type-check && npm run build` → vert
- `npm run test:coverage` → coverage ≥ 80% (les nouveaux MDX n'ajoutent pas de logique métier testable, le ratio ne devrait pas bouger ; vérifier qu'aucune modif technique de `lib/` n'introduit du code non couvert)
- `SONAR_HOST_URL=... SONAR_TOKEN=... npm run sonar:local` → Quality Gate OK avant merge

### Conformité contenu

- `dateModified` du frontmatter MDX = `2026-05-10`
- `lastModified` correspondant dans `SITE_PAGES` = `2026-05-10`
- `themes` valides selon `src/lib/themes.ts` (1 type + 0 à 2 domaines)
- Pas d'em-dash (`—`), ton humain, pas de tics IA listés dans CLAUDE.md
- Snippets de code avec langage spécifié
- Au moins 1 internal link sortant par article
- "Prochaines étapes" en conclusion

### Conformité i18n

- `/fr/{section}/{slug}/` et `/en/{section}/{slug}/` accessibles pour les 6 slugs
- Contenu dans la bonne langue (pas de fuite FR dans EN ou inverse)
- LanguageSwitcher fonctionne sur chaque page
- Tous les liens internes préfixés par locale

### Accessibilité (WCAG 2.1 AA)

- Pas de `role="img"` sur `<div>`
- Contraste vérifié sur badges thématiques
- Tab/Enter/Espace fonctionnels sur composants interactifs

---

## 10. Risques et mitigation

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Aucune traction SEO en 8 semaines | Moyenne | Faible | V1 minimal volontairement (6 articles) avant d'investir plus |
| ComfyUI / Flux changent d'API en cours d'écriture | Faible | Moyen | Documenter la version utilisée dans chaque tuto, régénérer les snippets si breaking change |
| Confusion lecteur sur le positionnement (pourquoi ce site parle d'image gen ?) | Moyenne | Moyen | C1 ouvre explicitement par "comment piloter ces outils depuis Claude Code". Pas de promesse "comparatif IA générative". |
| Coût SonarQube : nouvelles règles violées | Faible | Faible | Self-review code-reviewer avant chaque merge |
| Articles vieillissent vite (modèles obsolètes) | Élevée | Moyen | Ajouter date de validation explicite en intro de chaque tuto + politique de revue annuelle |

---

## 11. Perspectives d'évolution (V2 / V3)

### V2 (déclenché si traction validée par analytics)

Conditions de déclenchement (à 8-12 semaines post-V1) :
- Au moins 1 cornerstone dans le top 10 GSC pour sa requête principale
- Trafic Matomo > 5% du total sur les pages V1
- Au moins 3 backlinks organiques

Contenu V2 :
- 2 satellites supplémentaires : "LoRA persona Claude depuis Claude Code", "Pipeline Sketch-to-Image pour mockups UI"
- 1 cornerstone vidéo : "Générer une vidéo courte avec Claude + Sora/Veo via API" (à condition que les API soient stables et accessibles publiquement)

### V3 (long terme, si V2 valide la niche)

Pistes à étudier :
- Section dédiée `/visual-ai/` (passage Approche B → A) si le cluster devient un pilier du site
- Mini-SaaS / template open-source : "Claude Image Studio" (agent Claude packagé pour génération assets)
- Webinar / talk sur le sujet pour booster l'autorité
- Partenariat avec ComfyUI / Replicate pour visibilité croisée

### Garde-fous

- Si V1 ne convertit pas : ne PAS produire V2 par "sunk cost". Archiver les articles V1 (ne pas supprimer, ils continuent de servir le SEO long-tail) et réinvestir l'effort dans le cœur Claude Code.
- Si V2 dilue trop l'autorité : revenir à V1 minimal et figer.

---

## 12. Documentation Wiki-Brain

Une page dédiée `[[Articles IA générative — décision stratégique]]` sera créée dans le vault Obsidian (`/mnt/c/Documents and Settings/pdmtc/Documents/Maxime/DEV/claude-brain/wiki/`) avec :

- Synthèse de la décision (pourquoi 3ème voie, pourquoi Approche B)
- Lien vers ce spec
- Conditions de déclenchement V2
- Garde-fous
- Liens croisés vers `[[The Claude Codex]]` et `[[Stratégie SEO]]` si ces pages existent

Une entrée sera ajoutée à `log.md` à la fin de la session.

---

## 13. Acceptance criteria

Le V1 est considéré livré quand :

1. La branche `feat/articles-ia-generative-v1` existe à partir de `develop`
2. Les 12 fichiers MDX existent et passent le build
3. SonarQube Quality Gate est OK (pas de bug, pas de code smell BLOCKER/CRITICAL, coverage ≥ 80%)
4. Les 6 routes FR + 6 routes EN sont accessibles en dev local et build statique
5. `SITE_PAGES`, `searchIndex`, `llms.txt` sont à jour
6. Sitemap XML inclut les 12 nouvelles URLs avec `lastModified` au 2026-05-10
7. Une PR sur `develop` est ouverte (et mergée après review)
8. La page Wiki-Brain `[[Articles IA générative — décision stratégique]]` et l'entrée log.md sont créées
