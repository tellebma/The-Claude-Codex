# Articles IA générative V1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer 6 articles (3 cornerstone + 3 satellites) sur le thème "Claude Code + IA générative", distribués dans les sections existantes `use-cases/`, `mcp/`, `agents/`, en FR et EN, avec intégrations SEO complètes.

**Architecture:** Approche B distribuée (cf. spec). Aucun refactor structurel. 12 fichiers MDX nouveaux + 3 fichiers techniques modifiés (`SITE_PAGES`, `searchIndex`, `generate-llms-txt`). Ordre : C2 → C3 → C1 → satellites en parallèle. Spec source : `docs/superpowers/specs/2026-05-10-claude-ia-generative-articles-design.md`.

**Tech Stack:** Next.js 14 App Router (SSG), MDX (next-mdx-remote), TypeScript strict, Tailwind, next-intl (FR/EN), composants MDX custom (`<Callout>`, `<Steps>`, `<CodeBlock>`, `<Tabs>`, `<Card>`).

---

## Fichiers concernés

### Fichiers à créer (12 MDX)

| # | Fichier | Article | Lang |
|---|---|---|---|
| 1 | `content/fr/mcp/comfyui-mcp-local.mdx` | C2 | FR |
| 2 | `content/en/mcp/comfyui-mcp-local.mdx` | C2 | EN |
| 3 | `content/fr/agents/agent-generation-assets.mdx` | C3 | FR |
| 4 | `content/en/agents/agent-generation-assets.mdx` | C3 | EN |
| 5 | `content/fr/use-cases/ia-generative-creative.mdx` | C1 | FR |
| 6 | `content/en/use-cases/ia-generative-creative.mdx` | C1 | EN |
| 7 | `content/fr/mcp/comfyui-workflow-piloting.mdx` | S1 | FR |
| 8 | `content/en/mcp/comfyui-workflow-piloting.mdx` | S1 | EN |
| 9 | `content/fr/use-cases/assets-blog-automatique.mdx` | S2 | FR |
| 10 | `content/en/use-cases/assets-blog-automatique.mdx` | S2 | EN |
| 11 | `content/fr/use-cases/image-ia-local-vs-cloud.mdx` | S3 | FR |
| 12 | `content/en/use-cases/image-ia-local-vs-cloud.mdx` | S3 | EN |

### Fichiers à modifier (3 techniques)

| Fichier | Modification |
|---|---|
| `src/lib/metadata.ts` | Ajouter 12 entrées dans `SITE_PAGES` |
| `src/lib/search-index.ts` | Ajouter 6 entrées FR + 6 entrées EN |
| `scripts/generate-llms-txt.ts` | Ajouter 3 slugs cornerstones dans `POPULAR_SLUGS_FR` + `POPULAR_SLUGS_EN` |

### Fichiers à NE PAS modifier (vérification)

`Header.tsx`, `section-navigation.ts`, `app/[locale]/{section}/layout.tsx`, `next.config.mjs`, `messages/*.json`. Si une de ces modifs s'avère nécessaire, c'est un signal de sortie de scope.

---

## Task 0 — Setup branche et worktree

**Files:**
- Modify: working directory (git branch + worktree)

### Step 0.1 — Vérifier l'état git de départ

- [ ] Lancer :

```bash
git status && git branch --show-current
```

Expected : working tree clean, branche `develop`.

### Step 0.2 — Créer un worktree isolé

- [ ] Créer le worktree depuis develop :

```bash
git worktree add .worktrees/feat-articles-ia-generative-v1 -b feat/articles-ia-generative-v1 develop
cd .worktrees/feat-articles-ia-generative-v1
```

Expected : worktree créé, branche `feat/articles-ia-generative-v1` checkout.

### Step 0.3 — Installer les dépendances dans le worktree

- [ ] Lancer :

```bash
npm ci
```

Expected : `node_modules/` peuplé sans erreur.

### Step 0.4 — Vérifier que le build de base passe

- [ ] Lancer :

```bash
npm run lint && npm run type-check
```

Expected : tous verts. Si échec → fixer avant de continuer (régression existante).

### Step 0.5 — Commit initial worktree

- [ ] Pas de commit nécessaire (rien à committer). Juste vérifier :

```bash
git log -1 --oneline
```

Expected : dernier commit develop.

---

## Task 1 — C2 : MCP ComfyUI local sur GPU (FR + EN)

**Expert principal :** `content-writer`
**Reviewers :** `claude-expert` (MCP/ComfyUI), `devsecops-architect` (setup local/Docker GPU), `code-reviewer` (snippets shell)

**Files:**
- Create: `content/fr/mcp/comfyui-mcp-local.mdx`
- Create: `content/en/mcp/comfyui-mcp-local.mdx`

**Référence spec :** section 4 (C2), ~3000 mots, 8 sous-sections.

### Step 1.1 — Frontmatter FR

- [ ] Créer `content/fr/mcp/comfyui-mcp-local.mdx` avec frontmatter :

```yaml
---
title: "MCP ComfyUI local : générer des images sur ton GPU depuis Claude Code"
description: "Tutoriel complet pour brancher ComfyUI à Claude Code via MCP, générer des images en local sur ton GPU, comprendre la diffusion, installer Flux Schnell et débugger les erreurs CUDA/OOM."
badge: "NEW"
order: 6
section: "mcp"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["tutorial", "tooling", "architecture"]
---
```

### Step 1.2 — Rédiger le corps FR

- [ ] Suivre la structure spec section 4 C2 :

  1. **Intro** (200 mots) : pose le problème (générer 50 images sans switcher d'outil), promesse de l'article
  2. **Comment marche un modèle de diffusion** (~500 mots) : analogie sculpter dans le bruit. Concepts en 1 paragraphe chacun avec analogie : latent space (carte compressée), U-Net (artiste qui débruite), sampler (rythme de débruitage), VAE (traducteur image↔latent), ControlNet (gabarit imposé). Utiliser `<Callout type="info">` pour chaque définition clé.
  3. **Pourquoi ComfyUI** (~250 mots) : graphe de nœuds vs Automatic1111 monolithique. Tableau comparatif rapide.
  4. **Pré-requis matériel** (~300 mots) : tableau VRAM 6/8/12/24 Go → modèles compatibles (SDXL, Flux Schnell/Dev, SD 1.5). `<Callout type="warning">` sur RAM système.
  5. **Installation ComfyUI + Flux Schnell** (~700 mots) : `<Steps>` numérotés. Inclure :
     - `git clone https://github.com/comfyanonymous/ComfyUI.git`
     - `python -m venv venv && source venv/bin/activate`
     - `pip install -r requirements.txt`
     - Téléchargement du modèle Flux Schnell (HuggingFace, lien exact + commande wget)
     - Test de lancement `python main.py`
  6. **Brancher un MCP ComfyUI à Claude Code** (~500 mots) : config `.mcp.json` exact, schéma conceptuel via `<Callout type="info">`. Référencer un MCP existant (ex: `comfyui-mcp` sur npm/GitHub si validé par claude-expert, sinon décrire la création d'un wrapper minimal).
  7. **Premier prompt depuis Claude Code** (~250 mots) : exemple concret, screenshot conceptuel via description textuelle, vérification du résultat dans `output/`.
  8. **Troubleshooting** (~300 mots) : `<Callout type="warning">` × 4 :
     - CUDA out of memory → réduire batch ou modèle plus léger
     - "torch not compiled with CUDA" → install PyTorch CUDA spécifique
     - Modèle absent → check chemin `models/checkpoints/`
     - Lenteur extrême → vérifier que GPU est bien utilisé (`nvidia-smi`)
  9. **Prochaines étapes** : 2 liens MDX vers `[S1 — Piloter un workflow JSON](/fr/mcp/comfyui-workflow-piloting/)` et `[S3 — Local vs cloud comparatif](/fr/use-cases/image-ia-local-vs-cloud/)`

**Style :** ton humain, pas d'em-dash, pas de tics IA listés dans CLAUDE.md, snippets avec langage spécifié.

### Step 1.3 — Build local pour vérifier le rendu FR

- [ ] Lancer :

```bash
npm run dev
```

- [ ] Ouvrir `http://localhost:3000/fr/mcp/comfyui-mcp-local/` et vérifier :
  - Frontmatter parsé sans erreur
  - Tous les composants MDX rendus (Callout, Steps, CodeBlock)
  - Liens internes pointent vers les bons slugs (même si 404 pour le moment)
  - Table des matières (TOC) à droite reflète les H2

### Step 1.4 — Frontmatter EN (miroir)

- [ ] Créer `content/en/mcp/comfyui-mcp-local.mdx` avec :

```yaml
---
title: "Local ComfyUI MCP: generate images on your GPU from Claude Code"
description: "Complete tutorial to connect ComfyUI to Claude Code via MCP, generate images locally on your GPU, understand diffusion models, install Flux Schnell and troubleshoot CUDA/OOM errors."
badge: "NEW"
order: 6
section: "mcp"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["tutorial", "tooling", "architecture"]
---
```

### Step 1.5 — Rédiger le corps EN

- [ ] Traduction adaptée (pas littérale) du contenu FR. Mêmes 9 sous-sections, mêmes snippets de code (les commandes restent en EN naturellement). Ton anglais natif, pas une traduction Google.

### Step 1.6 — Build local pour vérifier le rendu EN

- [ ] Ouvrir `http://localhost:3000/en/mcp/comfyui-mcp-local/` et vérifier idem FR.

### Step 1.7 — Lint + type-check

- [ ] Lancer :

```bash
npm run lint && npm run type-check
```

Expected : verts.

### Step 1.8 — Commit C2

- [ ] Lancer :

```bash
git add content/fr/mcp/comfyui-mcp-local.mdx content/en/mcp/comfyui-mcp-local.mdx
git commit -m "feat(content): C2 article MCP ComfyUI local sur GPU (FR + EN)

Cornerstone de la serie IA generative V1. Vulgarisation diffusion + tuto reproductible
ComfyUI/Flux Schnell + branchement MCP Claude Code + troubleshooting CUDA/OOM."
```

---

## Task 2 — C3 : Agent Claude génération assets via API cloud (FR + EN)

**Expert principal :** `content-writer`
**Reviewers :** `claude-expert` (Agent SDK), `code-reviewer` (snippets TS/Python)

**Files:**
- Create: `content/fr/agents/agent-generation-assets.mdx`
- Create: `content/en/agents/agent-generation-assets.mdx`

**Référence spec :** section 4 (C3), ~2500 mots, 6 sous-sections.

### Step 2.1 — Frontmatter FR

- [ ] Créer `content/fr/agents/agent-generation-assets.mdx` avec :

```yaml
---
title: "Construire un agent Claude qui génère et publie tes assets visuels"
description: "Tutoriel pour bâtir un agent Claude SDK qui génère des images via Flux/Replicate API, optimise en WebP et upload sur ton storage. Architecture, code TypeScript et Python, gestion d'erreurs et coût réel."
badge: "NEW"
order: 10
section: "agents"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["tutorial", "architecture", "tooling"]
---
```

### Step 2.2 — Rédiger le corps FR

- [ ] Suivre structure spec section 4 C3 :

  1. **Intro + quand préférer le cloud** (~400 mots) : CI/CD, scale, pas de GPU, qualité Flux Pro/MJ. Tableau "local vs cloud" rapide (renvoi vers S3 pour le détail).
  2. **Architecture de l'agent** (~400 mots) : schéma textuel + `<Callout type="info">` :
     ```
     Claude Agent
       ├── tool: generate_image (Replicate/Flux API)
       ├── tool: optimize_webp (sharp/Pillow)
       └── tool: upload_storage (S3/R2/Vercel Blob)
     ```
  3. **Implémentation step-by-step** (~1000 mots) : `<Tabs>` Python vs TypeScript. Pour chaque tab :
     - `<Steps>` :
       - Init Agent SDK (`anthropic` package)
       - Définition des 3 tools (JSON schema)
       - Prompt système (rôle, contraintes)
       - Boucle d'exécution avec `tool_use`/`tool_result`
     - Snippets TS et Python complets et runnables (~50 lignes chacun)
  4. **Gestion des erreurs** (~300 mots) : retry exponential backoff sur rate limits (429), filter NSFW (response code Replicate), fallback cloud→cloud secondaire si timeout
  5. **Coût d'exécution réel** (~250 mots) : tableau "1 article blog = 3 images Flux Pro = 0,12$" (basé sur tarifs Replicate actuels). `<Callout type="tip">` sur batching pour réduire.
  6. **Prochaines étapes** : 2 liens MDX vers `[S2 — Assets blog Next.js automatique](/fr/use-cases/assets-blog-automatique/)` et `[S3 — Local vs cloud comparatif](/fr/use-cases/image-ia-local-vs-cloud/)`

**Important :** valider via `claude-expert` que les snippets Anthropic SDK sont corrects (versions actuelles `claude-sonnet-4-6` ou `claude-opus-4-7`, formats tool_use 2026).

### Step 2.3 — Build local FR

- [ ] `http://localhost:3000/fr/agents/agent-generation-assets/` doit rendre sans erreur, snippets coloriés.

### Step 2.4 — Frontmatter EN

- [ ] Créer `content/en/agents/agent-generation-assets.mdx` avec :

```yaml
---
title: "Build a Claude agent that generates and publishes your visual assets"
description: "Tutorial to build a Claude SDK agent that generates images via Flux/Replicate API, optimizes to WebP and uploads to your storage. Architecture, TypeScript and Python code, error handling and real cost."
badge: "NEW"
order: 10
section: "agents"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["tutorial", "architecture", "tooling"]
---
```

### Step 2.5 — Rédiger le corps EN

- [ ] Mêmes 6 sous-sections, mêmes snippets, prose anglaise native.

### Step 2.6 — Build local EN

- [ ] `http://localhost:3000/en/agents/agent-generation-assets/` doit rendre sans erreur.

### Step 2.7 — Lint + type-check

- [ ] Lancer `npm run lint && npm run type-check`. Verts attendus.

### Step 2.8 — Commit C3

- [ ] Lancer :

```bash
git add content/fr/agents/agent-generation-assets.mdx content/en/agents/agent-generation-assets.mdx
git commit -m "feat(content): C3 article agent Claude generation assets cloud (FR + EN)

Cornerstone serie IA generative V1. Tuto agent SDK + tools generate_image/optimize_webp/
upload_storage. Snippets TS et Python via Tabs. Gestion erreurs + cout reel Flux Pro."
```

---

## Task 3 — C1 : Panorama Claude Code + IA générative (FR + EN)

**Expert principal :** `content-writer`
**Reviewers :** `claude-expert` (panorama MCP/agents), `code-reviewer`

**Files:**
- Create: `content/fr/use-cases/ia-generative-creative.mdx`
- Create: `content/en/use-cases/ia-generative-creative.mdx`

**Référence spec :** section 4 (C1), ~2000 mots, 5 sous-sections.

### Step 3.1 — Frontmatter FR

- [ ] Créer `content/fr/use-cases/ia-generative-creative.mdx` avec :

```yaml
---
title: "Claude Code + IA générative : panorama d'un workflow créatif moderne"
description: "Comment intégrer la génération d'images IA dans ton flow Claude Code. 4 patterns d'intégration (MCP local, MCP cloud, Agent SDK, Skill) comparés sur latence, coût, contrôle et matrice décisionnelle."
badge: "NEW"
order: 4
section: "use-cases"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["guide", "tooling", "productivity"]
---
```

### Step 3.2 — Rédiger le corps FR

- [ ] Suivre structure spec section 4 C1 :

  1. **Le problème** (~300 mots) : générer 50 images blog/produit sans switcher 10 outils. Anecdote concrète d'un dev fullstack.
  2. **Les 4 patterns d'intégration** (~800 mots) : 1 sous-section H3 par pattern avec :
     - **(a) MCP local ComfyUI** : description, latence, coût (0$ après HW), contrôle (max), lien vers C2
     - **(b) MCP cloud Replicate/OpenAI** : description, latence (1-5s), coût ($0.003-0.04/img), contrôle (moyen)
     - **(c) Agent SDK + API directe** : description, latence variable, coût (API), contrôle (max via code), lien vers C3
     - **(d) Skill + script local** : description, simplicité, limites, exemple de skill
  3. **Tableau comparatif des 4 patterns** (~200 mots + `<Card>` ou table MDX) : colonnes Pattern / Latence / Coût / Contrôle / Courbe d'apprentissage / Cas d'usage idéal
  4. **Quel pattern pour quel cas d'usage** (~500 mots) : matrice décisionnelle :
     - "Tu génères 1000+ images/mois et tu as un GPU" → C2
     - "Tu veux scale en CI/CD" → C3
     - "Tu veux tester rapidement" → MCP cloud
     - "Tu fais 5 images par mois" → Skill simple
  5. **Prochaines étapes** : `[Tuto MCP local C2](/fr/mcp/comfyui-mcp-local/)`, `[Tuto agent cloud C3](/fr/agents/agent-generation-assets/)`, `[Use case blog S2](/fr/use-cases/assets-blog-automatique/)`

### Step 3.3 — Build local FR + EN

- [ ] Créer EN avec frontmatter miroir + traduction adaptée :

```yaml
---
title: "Claude Code + generative AI: a modern creative workflow overview"
description: "How to integrate AI image generation into your Claude Code flow. 4 integration patterns (local MCP, cloud MCP, Agent SDK, Skill) compared on latency, cost, control and decision matrix."
badge: "NEW"
order: 4
section: "use-cases"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["guide", "tooling", "productivity"]
---
```

- [ ] Vérifier `http://localhost:3000/fr/use-cases/ia-generative-creative/` et `http://localhost:3000/en/use-cases/ia-generative-creative/`.

### Step 3.4 — Lint + type-check

- [ ] Lancer `npm run lint && npm run type-check`. Verts attendus.

### Step 3.5 — Commit C1

- [ ] Lancer :

```bash
git add content/fr/use-cases/ia-generative-creative.mdx content/en/use-cases/ia-generative-creative.mdx
git commit -m "feat(content): C1 article panorama Claude Code + IA generative (FR + EN)

Cornerstone hub de la serie. 4 patterns d'integration compares + matrice decisionnelle.
Renvois vers C2/C3/S2."
```

---

## Tasks 4-5-6 (parallélisables) — Satellites S1, S2, S3

> Ces 3 tasks sont indépendantes entre elles. Si exécution via subagent-driven-development, dispatcher 3 agents `content-writer` en parallèle (1 par satellite).

---

## Task 4 — S1 : Piloter un workflow ComfyUI JSON (FR + EN)

**Expert principal :** `content-writer`
**Reviewers :** `claude-expert`, `code-reviewer`

**Files:**
- Create: `content/fr/mcp/comfyui-workflow-piloting.mdx`
- Create: `content/en/mcp/comfyui-workflow-piloting.mdx`

**Référence spec :** section 4 (S1), ~1200 mots, 5 sous-sections.

### Step 4.1 — Frontmatter FR

- [ ] Créer `content/fr/mcp/comfyui-workflow-piloting.mdx` avec :

```yaml
---
title: "Piloter un workflow ComfyUI JSON depuis Claude Code"
description: "Tutoriel pour exposer un workflow ComfyUI exporté en JSON via un outil MCP custom et le faire éditer dynamiquement par Claude Code (sampler, ControlNet, prompt en boucle)."
order: 7
section: "mcp"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["reference", "tooling"]
---
```

### Step 4.2 — Rédiger corps FR

- [ ] Suivre structure spec S1 :
  1. **Anatomie d'un workflow ComfyUI JSON** (~300 mots) : nodes, edges, types. Snippet JSON minimal (15 lignes) avec un node KSampler, CheckpointLoader, CLIPTextEncode.
  2. **Exposer le workflow via un outil MCP custom** (~300 mots) : code TypeScript wrapper minimal (40 lignes) qui POST sur `http://127.0.0.1:8188/prompt` avec le JSON.
  3. **Prompt pour faire éditer le workflow par Claude** (~250 mots) : exemple de prompt système + user message demandant à Claude de modifier sampler de "euler" à "dpmpp_2m_karras" sur un node spécifique.
  4. **Cas d'usage** (~250 mots) : 3 scénarios concrets : changer sampler, ajouter ControlNet à la volée, modifier prompt en boucle pour A/B test.
  5. **Prochaines étapes** : `[Cornerstone C2](/fr/mcp/comfyui-mcp-local/)`, `[Comparatif S3](/fr/use-cases/image-ia-local-vs-cloud/)`

### Step 4.3 — Frontmatter + corps EN

- [ ] Créer `content/en/mcp/comfyui-workflow-piloting.mdx`. Frontmatter EN miroir :

```yaml
---
title: "Pilot a ComfyUI JSON workflow from Claude Code"
description: "Tutorial to expose an exported ComfyUI workflow JSON via a custom MCP tool and have Claude Code edit it dynamically (sampler, ControlNet, prompt loop)."
order: 7
section: "mcp"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["reference", "tooling"]
---
```

### Step 4.4 — Build local + lint

- [ ] Vérifier les 2 routes `/fr/mcp/comfyui-workflow-piloting/` et `/en/mcp/comfyui-workflow-piloting/`.
- [ ] `npm run lint && npm run type-check` verts.

### Step 4.5 — Commit S1

- [ ] Lancer :

```bash
git add content/fr/mcp/comfyui-workflow-piloting.mdx content/en/mcp/comfyui-workflow-piloting.mdx
git commit -m "feat(content): S1 article pilote workflow ComfyUI JSON via MCP (FR + EN)

Satellite cornerstone C2. Tuto wrapper MCP TypeScript + edition dynamique par Claude
(sampler, ControlNet, A/B prompts)."
```

---

## Task 5 — S2 : Assets blog Next.js automatique (FR + EN)

**Expert principal :** `content-writer`
**Reviewers :** `claude-expert` (Next.js + agent), `code-reviewer`

**Files:**
- Create: `content/fr/use-cases/assets-blog-automatique.mdx`
- Create: `content/en/use-cases/assets-blog-automatique.mdx`

**Référence spec :** section 4 (S2), ~1500 mots, 6 sous-sections.

### Step 5.1 — Frontmatter FR

- [ ] Créer `content/fr/use-cases/assets-blog-automatique.mdx` avec :

```yaml
---
title: "Automatiser la génération des visuels d'un blog Next.js avec Claude"
description: "Script + agent Claude qui scanne tes fichiers MDX, détecte les articles sans image OG, génère un visuel cohérent via Flux API, optimise en WebP et met à jour le frontmatter automatiquement."
order: 5
section: "use-cases"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["use-case", "productivity"]
---
```

### Step 5.2 — Rédiger corps FR

- [ ] Suivre structure spec S2 :
  1. **Le besoin** (~200 mots) : 50+ articles, image OG manquante, manuel = enfer
  2. **Architecture du script** (~250 mots) : `<Callout type="info">` schéma textuel orchestration agent + outils
  3. **Implémentation** (~700 mots) : 4 étapes via `<Steps>` :
     - Scanner les `.mdx` avec `gray-matter`
     - Designer un prompt cohérent par article (utiliser title + themes)
     - Générer via Flux API + sauvegarde locale
     - Optimisation WebP (sharp) + écriture frontmatter (`gray-matter`)
  4. **Code reproductible complet** (~250 mots) : snippet TypeScript de 80 lignes runnable, à mettre dans `scripts/generate-og-images.ts`
  5. **Limites et coût total** (~150 mots) : 50 articles × 0,04$ Flux Pro = 2$. NSFW filter, dépendances API.
  6. **Prochaines étapes** : `[Cornerstone C3](/fr/agents/agent-generation-assets/)`, `[Cornerstone C1](/fr/use-cases/ia-generative-creative/)`

### Step 5.3 — Frontmatter + corps EN

- [ ] Créer `content/en/use-cases/assets-blog-automatique.mdx`. Frontmatter EN miroir :

```yaml
---
title: "Automate Next.js blog visual asset generation with Claude"
description: "Script + Claude agent that scans your MDX files, detects articles without OG images, generates a consistent visual via Flux API, optimizes to WebP and updates frontmatter automatically."
order: 5
section: "use-cases"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["use-case", "productivity"]
---
```

### Step 5.4 — Build local + lint

- [ ] Vérifier les 2 routes `/fr/use-cases/assets-blog-automatique/` et `/en/use-cases/assets-blog-automatique/`.
- [ ] `npm run lint && npm run type-check` verts.

### Step 5.5 — Commit S2

- [ ] Lancer :

```bash
git add content/fr/use-cases/assets-blog-automatique.mdx content/en/use-cases/assets-blog-automatique.mdx
git commit -m "feat(content): S2 article assets blog Next.js automatique (FR + EN)

Satellite cornerstone C3. Script TS reproductible scan MDX + generation Flux + optimisation
WebP + ecriture frontmatter."
```

---

## Task 6 — S3 : Local vs cloud comparatif (FR + EN)

**Expert principal :** `content-writer`
**Reviewers :** `claude-expert` (validation chiffres marché)

**Files:**
- Create: `content/fr/use-cases/image-ia-local-vs-cloud.mdx`
- Create: `content/en/use-cases/image-ia-local-vs-cloud.mdx`

**Référence spec :** section 4 (S3), ~1800 mots, 5 sous-sections.

### Step 6.1 — Frontmatter FR

- [ ] Créer `content/fr/use-cases/image-ia-local-vs-cloud.mdx` avec :

```yaml
---
title: "IA générative d'image en 2026 : local vs cloud, comparatif coût et qualité"
description: "Benchmark de 5 solutions (ComfyUI+Flux Schnell local, Flux Pro Replicate, DALL-E 3, Midjourney via proxy, SDXL local) sur 3 cas d'usage. TCO sur 1000 images, latence, matrice décisionnelle."
order: 6
section: "use-cases"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["comparison", "tooling"]
---
```

### Step 6.2 — Rédiger corps FR

- [ ] Suivre structure spec S3 :
  1. **Méthodologie du comparatif** (~300 mots) : machine de test (RTX 4070 12 Go, Ryzen 7), 3 prompts standards (portrait, illustration tech, photo produit), critères qualité (cohérence, détails, prompt adherence)
  2. **Résultats : matrice 5×3** (~600 mots) : table MDX complète. Pour chaque cellule : note /10 + 1 ligne d'observation
  3. **Coût TCO sur 1000 images** (~350 mots) : table "Solution / Coût initial / Coût marginal / Coût total 1000 img" :
     - ComfyUI+Flux Schnell local : 0$ marginal (RTX 4070 amortie sur 5 ans + élec ~3$)
     - Flux Pro Replicate : 40$
     - DALL-E 3 : 80$
     - Midjourney via proxy : 30$ (compte Pro)
     - SDXL local : 0$ marginal
  4. **Latence** (~300 mots) : table cold start / génération / post-process pour chaque solution
  5. **Matrice décisionnelle** (~250 mots) : 4 profils : indie dev (volume faible), startup (scale), studio créatif (qualité max), enterprise (souveraineté). Recommandation par profil.
  6. **Prochaines étapes** : `[Cornerstone C2 local](/fr/mcp/comfyui-mcp-local/)`, `[Cornerstone C3 cloud](/fr/agents/agent-generation-assets/)`

**Important :** chiffres à valider avec `claude-expert` (tarifs Replicate/Midjourney/DALL-E 2026). Si chiffres incertains, ajouter `<Callout type="info">` "Tarifs constatés 2026-05, vérifier auprès des providers".

### Step 6.3 — Frontmatter + corps EN

- [ ] Créer `content/en/use-cases/image-ia-local-vs-cloud.mdx`. Frontmatter EN :

```yaml
---
title: "Generative AI image in 2026: local vs cloud, cost and quality comparison"
description: "Benchmark of 5 solutions (ComfyUI+Flux Schnell local, Flux Pro Replicate, DALL-E 3, Midjourney via proxy, SDXL local) on 3 use cases. TCO over 1000 images, latency, decision matrix."
order: 6
section: "use-cases"
datePublished: "2026-05-11"
dateModified: "2026-05-11"
themes: ["comparison", "tooling"]
---
```

### Step 6.4 — Build local + lint

- [ ] Vérifier les 2 routes `/fr/use-cases/image-ia-local-vs-cloud/` et `/en/use-cases/image-ia-local-vs-cloud/`.
- [ ] `npm run lint && npm run type-check` verts.

### Step 6.5 — Commit S3

- [ ] Lancer :

```bash
git add content/fr/use-cases/image-ia-local-vs-cloud.mdx content/en/use-cases/image-ia-local-vs-cloud.mdx
git commit -m "feat(content): S3 article comparatif local vs cloud IA generative (FR + EN)

Satellite cornerstones C2/C3. Benchmark 5 solutions x 3 cas usage. TCO 1000 images.
Matrice decisionnelle par profil utilisateur."
```

---

## Task 7 — Intégrations techniques

**Expert principal :** `code-reviewer` (validation TypeScript)

**Files:**
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`
- Modify: `scripts/generate-llms-txt.ts`

### Step 7.1 — Lire la structure actuelle de `SITE_PAGES`

- [ ] Lire `src/lib/metadata.ts`, identifier la structure exacte (priority, changeFrequency, lastModified, locales) en cherchant un exemple existant dans `mcp/` ou `use-cases/`.

### Step 7.2 — Ajouter 12 entrées dans `SITE_PAGES`

- [ ] Pour chaque article, ajouter 1 entrée FR et 1 EN. Exemple format type (à adapter à la structure exacte du fichier) :

```typescript
{
  url: "/fr/mcp/comfyui-mcp-local/",
  priority: 0.7,
  changeFrequency: "monthly",
  lastModified: "2026-05-11",
},
{
  url: "/en/mcp/comfyui-mcp-local/",
  priority: 0.7,
  changeFrequency: "monthly",
  lastModified: "2026-05-11",
},
```

Cornerstones (C1/C2/C3) : `priority: 0.8`. Satellites (S1/S2/S3) : `priority: 0.6`.

### Step 7.3 — Lire la structure actuelle de `searchIndex`

- [ ] Lire `src/lib/search-index.ts`, identifier `searchIndexFr` et `searchIndexEn`. Format type d'une entrée :

```typescript
{
  title: "...",
  description: "...",
  url: "/fr/mcp/...",
  section: "MCP",
  keywords: [...]
}
```

### Step 7.4 — Ajouter 12 entrées dans `searchIndex`

- [ ] Ajouter 6 entrées dans `searchIndexFr` et 6 dans `searchIndexEn`. Keywords pertinents par article (extraire des cibles SEO du spec section 3).

### Step 7.5 — Lire `scripts/generate-llms-txt.ts`

- [ ] Identifier `POPULAR_SLUGS_FR` et `POPULAR_SLUGS_EN`.

### Step 7.6 — Ajouter les 3 cornerstones

- [ ] Ajouter dans `POPULAR_SLUGS_FR` :
  - `use-cases/ia-generative-creative`
  - `mcp/comfyui-mcp-local`
  - `agents/agent-generation-assets`

- [ ] Ajouter dans `POPULAR_SLUGS_EN` :
  - `use-cases/ia-generative-creative`
  - `mcp/comfyui-mcp-local`
  - `agents/agent-generation-assets`

(Slugs identiques FR/EN car les fichiers MDX ont les mêmes noms.)

### Step 7.7 — Régénérer llms.txt

- [ ] Lancer :

```bash
npm run build:llms
```

Expected : `public/llms.txt` et `public/llms-full.txt` régénérés sans erreur, contenant les nouveaux articles.

### Step 7.8 — Lint + type-check

- [ ] Lancer `npm run lint && npm run type-check`. Verts attendus.

### Step 7.9 — Commit intégrations

- [ ] Lancer :

```bash
git add src/lib/metadata.ts src/lib/search-index.ts scripts/generate-llms-txt.ts public/llms.txt public/llms-full.txt
git commit -m "feat(seo): integrer les 6 articles IA generative dans SITE_PAGES, search et llms.txt

12 entrees SITE_PAGES (6 FR + 6 EN), 12 entrees search index, 3 cornerstones dans
POPULAR_SLUGS pour llms.txt. Sitemap et llms.txt regeneres."
```

---

## Task 8 — Vérifications build + tests + Sonar

**Expert principal :** `code-reviewer`

**Files:** aucun nouveau, validations seulement.

### Step 8.1 — Build production complet

- [ ] Lancer :

```bash
npm run build
```

Expected : build vert. Sortie HTML générée dans `out/`. Pas d'erreur de pré-rendu sur les 12 nouvelles routes.

### Step 8.2 — Vérifier que les 12 routes sont dans le build

- [ ] Lancer :

```bash
ls out/fr/mcp/comfyui-mcp-local out/en/mcp/comfyui-mcp-local out/fr/agents/agent-generation-assets out/en/agents/agent-generation-assets out/fr/use-cases/ia-generative-creative out/en/use-cases/ia-generative-creative out/fr/mcp/comfyui-workflow-piloting out/en/mcp/comfyui-workflow-piloting out/fr/use-cases/assets-blog-automatique out/en/use-cases/assets-blog-automatique out/fr/use-cases/image-ia-local-vs-cloud out/en/use-cases/image-ia-local-vs-cloud
```

Expected : 12 dossiers existent, chacun contient `index.html`.

### Step 8.3 — Vérifier sitemap.xml

- [ ] Lancer :

```bash
grep -c "ia-generative-creative\|comfyui-mcp-local\|agent-generation-assets\|comfyui-workflow-piloting\|assets-blog-automatique\|image-ia-local-vs-cloud" out/sitemap.xml
```

Expected : ≥ 12 (6 articles × 2 langues).

### Step 8.4 — Vérifier llms.txt

- [ ] Lancer :

```bash
grep -c "ia-generative-creative\|comfyui-mcp-local\|agent-generation-assets" out/llms.txt
```

Expected : ≥ 6 (3 cornerstones × 2 langues).

### Step 8.5 — Tests unitaires + coverage

- [ ] Lancer :

```bash
npm run test:coverage
```

Expected : tests verts, coverage ≥ 80% (les nouveaux MDX n'ajoutent pas de logique testable, ratio inchangé).

### Step 8.6 — Sonar local

- [ ] Lancer (si SonarQube local up) :

```bash
SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=$SONAR_TOKEN npm run sonar:local
```

- [ ] Ouvrir le dashboard SonarQube et vérifier :
  - Quality Gate : Passed
  - 0 bug
  - 0 code smell BLOCKER/CRITICAL
  - Coverage ≥ 80%
  - 0 security hotspot ouvert

Si Quality Gate fail → fixer avant PR.

### Step 8.7 — Smoke test manuel des 12 pages

- [ ] Lancer `npm run dev` et naviguer manuellement sur chaque route :
  - Les 6 routes FR
  - Les 6 routes EN
- [ ] Pour chaque page, vérifier :
  - Frontmatter rendu (title, description, themes badges)
  - Composants MDX rendus (Callout, Steps, CodeBlock, Tabs)
  - Liens internes fonctionnels (cliquer sur les "Prochaines étapes")
  - LanguageSwitcher fonctionne (passe FR ↔ EN sur le même slug)
  - Table des matières (TOC) à droite
  - Mobile : responsive sans débordement

### Step 8.8 — Aucun commit nécessaire

Si étapes 8.1-8.7 OK, passer à Task 9. Sinon, fixer et re-commit.

---

## Task 9 — Pull Request develop

**Expert principal :** `devsecops-architect` (rédaction PR description) + relecture humaine.

### Step 9.1 — Push de la branche

- [ ] Lancer :

```bash
git push -u origin feat/articles-ia-generative-v1
```

### Step 9.2 — Créer la PR

- [ ] Lancer (depuis le worktree) :

```bash
gh pr create --base develop --title "feat(content): articles IA generative V1 - 6 articles (3 cornerstone + 3 satellites) FR+EN" --body "$(cat <<'EOF'
## Summary

- 3 cornerstones distribuees : C1 panorama (use-cases), C2 MCP ComfyUI local (mcp), C3 agent SDK cloud (agents)
- 3 satellites : S1 workflow JSON ComfyUI, S2 assets blog Next.js auto, S3 comparatif local vs cloud
- 12 fichiers MDX (FR + EN) + integrations SITE_PAGES, searchIndex, llms.txt
- Approche B distribuee (cf. spec docs/superpowers/specs/2026-05-10-claude-ia-generative-articles-design.md)
- Strategie test-and-learn V1 minimal, V2 conditionne a la traction analytics 8-12 semaines

## Test plan

- [ ] Build production passe sur les 12 routes
- [ ] Sitemap.xml contient les 12 nouvelles URLs
- [ ] llms.txt contient les 3 cornerstones
- [ ] Smoke test manuel FR + EN sur les 6 articles
- [ ] LanguageSwitcher fonctionne sur chaque page
- [ ] Composants MDX (Callout, Steps, CodeBlock, Tabs) rendus correctement
- [ ] Snippets de code colorises et copiables
- [ ] Liens internes (Prochaines etapes) fonctionnels
- [ ] SonarQube Quality Gate : Passed (0 bug, 0 code smell BLOCKER/CRITICAL, coverage >=80%)
- [ ] Lighthouse > 90 sur cornerstone C2 (article le plus lourd)
EOF
)"
```

### Step 9.3 — Vérifier le statut CI

- [ ] Lancer :

```bash
gh pr checks --watch
```

Expected : tous les checks verts (lint, type-check, build, tests, SonarQube).

### Step 9.4 — Si CI rouge

- [ ] Lire les logs : `gh run view <run-id> --log-failed`
- [ ] Fixer en local, re-push, re-watch.

### Step 9.5 — Mise à jour du Wiki-Brain (post-merge)

- [ ] Une fois la PR mergée, mettre à jour la page wiki :

```bash
# Editer la page wiki
# /mnt/c/Documents and Settings/pdmtc/Documents/Maxime/DEV/claude-brain/wiki/Articles IA generative - decision strategique.md
# Ajouter section "Statut V1 : LIVRÉ" avec date merge + numéro PR + lien
```

- [ ] Ajouter une entrée dans `log.md` :

```
## [YYYY-MM-DD HH:MM] session | V1 articles IA generative livre
Touchees : [[Articles IA generative - decision strategique]]
PR #XXX mergee sur develop. 6 articles (3 cornerstone + 3 satellites) FR+EN livres.
Surveillance analytics declenchee, point a S+8 pour decision V2.
```

### Step 9.6 — Cleanup worktree (post-merge)

- [ ] Une fois la PR mergée :

```bash
cd /home/tellebma/DEV/how_to_use_claude
git worktree remove .worktrees/feat-articles-ia-generative-v1
git branch -d feat/articles-ia-generative-v1  # local
git fetch -p  # nettoyer ref distante
```

---

## Récapitulatif estimation

| Task | Article | Effort estimé |
|---|---|---|
| 0 | Setup | 10 min |
| 1 | C2 (3000 mots × 2) | 4-5 h |
| 2 | C3 (2500 mots × 2) | 3-4 h |
| 3 | C1 (2000 mots × 2) | 2-3 h |
| 4 | S1 (1200 mots × 2) | 1.5-2 h |
| 5 | S2 (1500 mots × 2) | 2-2.5 h |
| 6 | S3 (1800 mots × 2) | 2-3 h |
| 7 | Intégrations | 30 min |
| 8 | Vérifications | 1 h |
| 9 | PR + cleanup | 30 min |
| **Total** | | **17-22 h** |

Si dispatch satellites en parallèle (3 agents simultanés) : économie ~3-4h sur tasks 4-5-6.

---

## Garde-fous d'exécution

- **Ne JAMAIS** créer une nouvelle section, modifier `Header.tsx`, `section-navigation.ts`, ou `app/[locale]/{section}/layout.tsx`. Si nécessaire → STOP, c'est un signal de sortie de scope du spec.
- **Ne JAMAIS** push sur `main` directement (cf. memory feedback `feedback_git_workflow.md`). Toujours via PR sur `develop`.
- **Ne JAMAIS** sauter le SonarQube avant merge (cf. memory feedback `feedback_sonar_before_merge.md`).
- **Toujours** vérifier FR ET EN après chaque article (CLAUDE.md i18n).
- **Toujours** mettre à jour `dateModified` ET `lastModified` à la même date.
- Si un article dépasse trop son budget de mots, ne pas couper artificiellement : revoir la structure ou splitter en 2 articles (rare).
