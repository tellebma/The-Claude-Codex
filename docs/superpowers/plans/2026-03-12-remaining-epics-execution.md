# Plan d'execution des Epics restantes — The Claude Codex

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Executer les 11 epics TODO restantes (16-18, 25-32) avec un processus de validation integre incluant code review, audit SEO et audit UX/UI toutes les 2 epics.

**Architecture:** Execution par batches de 2 epics, chaque batch suivi d'un checkpoint de validation (code review + build) et d'un audit croise par un agent SEO expert et un agent UX/UI expert. Les batches sont ordonnees par priorite (P1 d'abord) et dependances resolues.

**Tech Stack:** Next.js 14 (App Router), TypeScript strict, Tailwind CSS, MDX (next-mdx-remote), Docker (Nginx Alpine), Matomo (batch finale)

---

## Vue d'ensemble des 11 Epics TODO

| # | Epic | Priorite | Taille | Dependances restantes |
|---|------|----------|--------|----------------------|
| 18 | Tests, CI/CD et assurance qualite | P1 | M | Aucune (deps resolues) |
| 17 | Page 404 et finitions UX | P3 | XS | Aucune |
| 25 | Creation MCP custom (tutoriel) | P1 | M | Aucune (Epic 19 done) |
| 27 | Section Enterprise complete | P1 | L | Aucune |
| 26 | Parcours differencies par persona | P1 | M | Aucune (Epics 21, 22 done) |
| 29 | Limites, comparaisons et couts reels | P2 | M | Aucune |
| 28 | Contenu non-developpeur | P2 | M | Aucune (Epic 22 done) |
| 30 | Enrichissement Skills tous niveaux | P2 | S | Epic 28 |
| 31 | Enrichissement Agents profils avances | P2 | M | Aucune (Epics 13, 24 done) |
| 16 | Section Vision & Futur (3 pages) | P3 | S | Aucune |
| 32 | Suivi d'usage et analytics (Matomo) | P2 | S | Aucune |

---

## Processus de validation (applique a chaque epic)

### A. Pendant l'epic (par l'agent executant)

- [ ] 1. Lint + type-check avant chaque commit : `npm run lint && npm run type-check`
- [ ] 2. Build de verification : `npm run build`
- [ ] 3. Verification visuelle en dev : `npm run dev` (port 3000)

### B. Apres chaque epic (code review)

- [ ] 1. **Agent code-reviewer** : revue du code modifie/cree
   - Criteres : qualite, securite, typage, patterns du projet
   - Corrections CRITICAL et HIGH obligatoires avant de passer a l'epic suivante
- [ ] 2. **Build Docker** : `docker build -t claude-code-guide .` (verification image < 50 MB)
- [ ] 3. **Commit & Push** : commit conventionnel (`feat:`, `fix:`, `docs:`, `test:`) + `git push` vers le remote. Pas d'attribution Claude (pas de `Co-Authored-By`).

### C. Toutes les 2 epics (audit croise SEO + UX/UI)

- [ ] 1. **Agent Expert SEO** (subagent_type: general-purpose) :
   - Audit des meta-donnees (title, description, og:tags) des pages ajoutees/modifiees
   - Verification du maillage interne (liens entre les nouvelles pages et les existantes)
   - Verification des donnees structurees JSON-LD
   - Verification sitemap et search-index.ts mis a jour
   - Verification des canonical URLs
   - Score : checklist de 10 points SEO, objectif 10/10

- [ ] 2. **Agent Expert UX/UI Design** (subagent_type: ux-designer) :
   - Audit responsive (mobile, tablet, desktop) des nouvelles pages
   - Verification de l'accessibilite WCAG 2.1 AA
   - Coherence avec le design system (couleurs, typographie, composants)
   - Score Lighthouse > 90 sur les 4 metriques
   - Verification dark mode / light mode
   - Navigation et parcours utilisateur fluides

---

## Batches d'execution

---

## Chunk 1: Batch 1 — Fondation qualite (Epic 18 + Epic 17)

**Objectif :** Mettre en place le filet de securite (tests + CI) et les finitions UX de base.
**Justification :** L'Epic 18 cree l'infrastructure de qualite qui validera toutes les epics suivantes. L'Epic 17 est un quick win XS qui se combine bien.

---

### Task 1: Epic 18 — Tests, CI/CD et assurance qualite

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `__tests__/components/ui/CodeBlock.test.tsx`
- Create: `__tests__/components/ui/Breadcrumb.test.tsx`
- Create: `__tests__/components/ui/SearchDialog.test.tsx`
- Create: `__tests__/components/ui/ScrollToTop.test.tsx`
- Create: `__tests__/components/ui/TableOfContents.test.tsx`
- Create: `__tests__/components/layout/Header.test.tsx`
- Create: `__tests__/components/layout/Footer.test.tsx`
- Create: `__tests__/lib/mdx.test.ts`
- Create: `__tests__/lib/search-index.test.ts`
- Create: `__tests__/lib/metadata.test.ts`
- Create: `__tests__/lib/structured-data.test.ts`
- Create: `e2e/navigation.spec.ts`
- Create: `e2e/search.spec.ts`
- Create: `e2e/theme-toggle.spec.ts`
- Create: `.github/workflows/ci.yml`
- Modify: `package.json` (ajout deps de test + scripts)
- Modify: `tsconfig.json` (paths pour tests si necessaire)

**Sous-taches :**

- [ ] **Step 1: Installer les dependencies de test**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Creer vitest.config.ts**

Configurer vitest avec jsdom, paths aliases, setup files, coverage thresholds (80%).

- [ ] **Step 3: Ecrire les tests unitaires des utilitaires**

Commencer par `lib/search-index.ts`, `lib/metadata.ts`, `lib/structured-data.ts` — fonctions pures, faciles a tester.
RED: ecrire les tests, verifier qu'ils echouent.
GREEN: verifier qu'ils passent (code existant).

- [ ] **Step 4: Run tests — verifier que les utilitaires passent**

```bash
npx vitest run __tests__/lib/
```

- [ ] **Step 5: Ecrire les tests des composants UI**

Tester CodeBlock (copie), Breadcrumb (rendu), SearchDialog (recherche), ScrollToTop (visibilite).
Utiliser @testing-library/react.

- [ ] **Step 6: Run tests — verifier que les composants passent**

```bash
npx vitest run __tests__/components/
```

- [ ] **Step 7: Configurer Playwright et ecrire les tests e2e**

3 specs e2e : navigation entre sections, recherche globale, theme toggle.

- [ ] **Step 8: Run e2e — verifier que les tests passent**

```bash
npx playwright test
```

- [ ] **Step 9: Creer le pipeline CI GitHub Actions**

Workflow `.github/workflows/ci.yml` avec : lint, type-check, vitest, build Next.js, build Docker.

- [ ] **Step 10: Verifier le build complet**

```bash
npm run lint && npm run type-check && npx vitest run && npm run build
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add test infrastructure with vitest, playwright and CI pipeline (Epic 18)
EOF
)"
git push
```

---

### Task 2: Epic 17 — Page 404 et finitions UX

**Files:**
- Create: `src/app/not-found.tsx`
- Modify: `src/components/layout/Footer.tsx` (lien GitHub, annee dynamique)

**Sous-taches :**

- [ ] **Step 1: Ecrire le test pour la page 404**

Test de rendu de la page not-found : titre, lien retour, design system.

- [ ] **Step 2: Creer src/app/not-found.tsx**

Page 404 avec design system du site (gradient, typographie), message amical, liens de navigation vers les sections principales.

- [ ] **Step 3: Corriger le Footer**

- Lien GitHub pointe vers `https://github.com/tellebma/The-Claude-Codex`
- Annee dynamique via composant client `'use client'` avec `new Date().getFullYear()`
- Mention transparence sur les temoignages si fictifs

- [ ] **Step 4: Verifier le build et les tests**

```bash
npm run lint && npm run type-check && npx vitest run && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx src/components/layout/Footer.tsx __tests__/
git commit -m "$(cat <<'EOF'
feat: add custom 404 page and fix footer (Epic 17)
EOF
)"
git push
```

---

### Checkpoint Batch 1 — Validation

- [ ] **Code Review** : Lancer l'agent `code-reviewer` sur les fichiers modifies/crees
- [ ] **Build Docker** : `docker build -t claude-code-guide .`
- [ ] **Corriger** les issues CRITICAL/HIGH remontees

### Audit Batch 1 — SEO + UX/UI (Agents experts)

- [ ] **Agent SEO Expert** : Audit complet des pages ajoutees (404) + verification que le sitemap/search-index incluent la page 404 + verification meta-donnees
- [ ] **Agent UX/UI Expert** : Audit responsive 404, coherence design system, verification Lighthouse, verification dark/light mode

---

## Chunk 2: Batch 2 — Contenu expert high-impact (Epic 25 + Epic 27)

**Objectif :** Combler les deux lacunes les plus critiques : MCP custom pour experts/connaisseurs et section Enterprise pour decideurs.
**Justification :** Epic 25 est la demande #1 des experts (score 4.5/10). Epic 27 cible le persona le plus mal servi (Enterprise 3/10).

---

### Task 3: Epic 25 — Creation MCP custom (tutoriel complet)

**Files:**
- Create: `content/mcp/create-mcp-typescript.mdx`
- Create: `content/mcp/create-mcp-python.mdx`
- Create: `content/mcp/advanced-protocol.mdx`
- Modify: `content/mcp/best-productivity.mdx` (ajout limites/gotchas)
- Modify: `content/mcp/best-development.mdx` (ajout limites/gotchas)
- Modify: `content/mcp/best-design.mdx` (ajout limites/gotchas)
- Modify: `src/lib/section-navigation.ts` (ajout 3 pages dans section MCP)
- Modify: `src/lib/metadata.ts` (ajout dans SITE_PAGES)
- Modify: `src/lib/search-index.ts` (ajout entrees)

**Sous-taches :**

- [ ] **Step 1: Creer content/mcp/create-mcp-typescript.mdx**

Tutoriel complet : prerequis, scaffolding, Tools/Resources/Prompts, test local, integration Claude Code, exemple MCP "meteo".
Frontmatter : title, description, order, section: "mcp", datePublished.

- [ ] **Step 2: Creer content/mcp/create-mcp-python.mdx**

Tutoriel Python : prerequis, SDK `mcp`, Tools/Resources/Prompts, test avec `uvx`, exemple MCP "base de donnees interne".

- [ ] **Step 3: Creer content/mcp/advanced-protocol.mdx**

Specification JSON-RPC 2.0, capabilities negotiation, transports (stdio, SSE, Streamable HTTP), sampling, performance, securite, debugging.

- [ ] **Step 4: Enrichir les pages MCP existantes**

Ajouter limites/gotchas de chaque MCP documente, lien registre MCP communautaire, criteres de selection MCP tiers.

- [ ] **Step 5: Mettre a jour la navigation et les metadonnees**

- `section-navigation.ts` : ajouter les 3 nouvelles pages MCP
- `metadata.ts` : ajouter dans SITE_PAGES
- `search-index.ts` : ajouter les entrees de recherche

- [ ] **Step 6: Verifier le build**

```bash
npm run lint && npm run type-check && npm run build
```

- [ ] **Step 7: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add MCP custom creation tutorials and advanced protocol docs (Epic 25)
EOF
)"
git push
```

---

### Task 4: Epic 27 — Section Enterprise complete

**Files:**
- Create: `content/enterprise/index.mdx`
- Create: `content/enterprise/security-compliance.mdx`
- Create: `content/enterprise/team-adoption.mdx`
- Create: `content/enterprise/tco-calculator.mdx`
- Create: `content/enterprise/faq.mdx`
- Create: `content/enterprise/governance.mdx`
- Create: `src/app/enterprise/page.tsx`
- Create: `src/app/enterprise/[slug]/page.tsx`
- Create: `src/app/enterprise/layout.tsx`
- Create: `src/components/ui/TcoCalculator.tsx` (composant interactif)
- Modify: `src/components/layout/Header.tsx` (ajout lien "Entreprise")
- Modify: `src/lib/section-navigation.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`
- Modify: `src/app/page.tsx` (ajout parcours Enterprise dans les PathCards)

**Sous-taches :**

- [ ] **Step 1: Creer la structure de routing Enterprise**

`layout.tsx` avec SectionLayout, `page.tsx` (index), `[slug]/page.tsx` avec generateStaticParams.

- [ ] **Step 2: Creer les 6 pages MDX Enterprise**

- `index.mdx` : hero, 4 piliers, CTA
- `security-compliance.mdx` : donnees, RGPD, AI Act, Anthropic Trust Center
- `team-adoption.mdx` : 4 phases (preparation, pilote, deploiement, optimisation)
- `tco-calculator.mdx` : tableau TCO + composant interactif
- `faq.mdx` : 15+ Q/R enterprise
- `governance.mdx` : roles, permissions, audit, secrets

- [ ] **Step 3: Creer le composant TcoCalculator**

Composant React client-side : inputs (nb devs, plan), outputs (cout mensuel/annuel, comparaison Copilot/Cursor).

- [ ] **Step 4: Mettre a jour Header, navigation et metadonnees**

- Header : ajouter "Entreprise" dans la navigation
- section-navigation.ts : nouvelle section enterprise
- metadata.ts : 6 nouvelles pages dans SITE_PAGES
- search-index.ts : 6 nouvelles entrees

- [ ] **Step 5: Verifier le build**

```bash
npm run lint && npm run type-check && npm run build
```

- [ ] **Step 6: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add complete enterprise section with 6 pages and TCO calculator (Epic 27)
EOF
)"
git push
```

---

### Checkpoint Batch 2 — Validation

- [ ] **Code Review** : Agent `code-reviewer` sur les fichiers des Epics 25 et 27
- [ ] **Build Docker** : `docker build -t claude-code-guide .`
- [ ] **Corriger** les issues CRITICAL/HIGH

### Audit Batch 2 — SEO + UX/UI (Agents experts)

- [ ] **Agent SEO Expert** : Audit des 9 nouvelles pages (3 MCP + 6 Enterprise), maillage interne, JSON-LD, sitemap, meta-donnees, canonical URLs
- [ ] **Agent UX/UI Expert** : Audit responsive nouvelles sections, TcoCalculator interactif, accessibilite, navigation Enterprise dans Header, coherence design system, Lighthouse

---

## Chunk 3: Batch 3 — Navigation personnalisee + Credibilite (Epic 26 + Epic 29)

**Objectif :** Differencier l'experience par persona et renforcer la credibilite avec du contenu honnete sur les limites.

---

### Task 5: Epic 26 — Parcours differencies et navigation par persona

**Files:**
- Create: `src/components/ui/LevelBadge.tsx`
- Create: `src/components/ui/PathGuide.tsx`
- Create: `src/components/ui/ProgressBar.tsx`
- Create: `content/getting-started/fast-track.mdx`
- Modify: tous les fichiers MDX (ajout frontmatter `level`)
- Modify: `src/app/page.tsx` (refonte section parcours, 4 parcours, CTA secondaire)
- Modify: `src/components/layout/SectionSidebar.tsx` (affichage badges)
- Modify: `src/lib/section-navigation.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`

**Sous-taches :**

- [ ] **Step 1: Creer le composant LevelBadge**

Badge colore (vert debutant, jaune intermediaire, rouge avance) avec prop `level`.

- [ ] **Step 2: Creer le composant PathGuide**

Affiche les etapes d'un parcours avec progression (localStorage).

- [ ] **Step 3: Creer le composant ProgressBar**

Barre de progression en haut de page, basee sur les pages visitees (localStorage).

- [ ] **Step 4: Creer la page Fast Track**

`content/getting-started/fast-track.mdx` : installation en 60 secondes, slash commands essentielles, liens directs vers les sections avancees.

- [ ] **Step 5: Ajouter le frontmatter `level` a tous les MDX**

Parcourir les ~54 fichiers MDX et ajouter `level: debutant | intermediaire | avance` selon le contenu.

- [ ] **Step 6: Integrer les badges dans SectionSidebar**

Afficher le LevelBadge a cote du titre de chaque page dans la sidebar.

- [ ] **Step 7: Refonte des parcours sur la landing page**

4 parcours : Debutant → Zero technique, Intermediaire → Standard, Avance → Fast Track, Entreprise → Section Enterprise.
CTA secondaire : "Fast Track pour devs" ou "Voir un exemple en 2 min".

- [ ] **Step 8: Verifier le build + commit**

```bash
npm run lint && npm run type-check && npm run build
git commit -m "$(cat <<'EOF'
feat: add persona-based navigation with level badges and path guides (Epic 26)
EOF
)"
git push
```

---

### Task 6: Epic 29 — Limites, comparaisons objectives et couts reels

**Files:**
- Create: `content/reference/limitations.mdx`
- Create: `content/reference/comparison.mdx`
- Create: `content/reference/costs.mdx`
- Modify: `src/lib/section-navigation.ts` (ajout 3 pages Reference)
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`

**Sous-taches :**

- [ ] **Step 1: Creer content/reference/limitations.mdx**

8+ limites documentees avec workarounds : hallucinations, contexte, grands projets, langages, actions destructives, drift, rate limiting.

- [ ] **Step 2: Creer content/reference/comparison.mdx**

Comparaison honnete : Claude Code vs Copilot vs Cursor vs Aider vs Windsurf. Tableau de decision, complementarite.

- [ ] **Step 3: Creer content/reference/costs.mdx**

Benchmarks reels par type de tache, comparaison API/Max/Pro, strategies d'optimisation, lecture de `/cost`.

- [ ] **Step 4: Mettre a jour navigation et metadonnees**

- [ ] **Step 5: Verifier le build + commit**

```bash
npm run lint && npm run type-check && npm run build
git commit -m "$(cat <<'EOF'
feat: add limitations, comparison and real costs reference pages (Epic 29)
EOF
)"
git push
```

---

### Checkpoint Batch 3 — Validation

- [ ] **Code Review** : Agent `code-reviewer` sur Epics 26 et 29
- [ ] **Build Docker** : `docker build -t claude-code-guide .`
- [ ] **Corriger** les issues CRITICAL/HIGH

### Audit Batch 3 — SEO + UX/UI (Agents experts)

- [ ] **Agent SEO Expert** : Audit Fast Track + 3 pages Reference, maillage interne, coherence des parcours, meta-donnees, impact sur le sitemap
- [ ] **Agent UX/UI Expert** : Audit LevelBadge/PathGuide/ProgressBar, responsive, accessibilite des nouveaux composants, coherence visuelle, parcours utilisateur fluide, Lighthouse

---

## Chunk 4: Batch 4 — Contenu inclusif (Epic 28 + Epic 30)

**Objectif :** Tenir la promesse de la landing page envers les non-developpeurs et enrichir la section Skills.
**Note :** Epic 30 depend d'Epic 28, donc elles doivent etre dans cet ordre.

---

### Task 7: Epic 28 — Contenu non-developpeur et cas d'usage universels

**Files:**
- Create: `content/use-cases/business.mdx`
- Create: `content/use-cases/success-stories.mdx`
- Create: `content/use-cases/no-code.mdx`
- Create: `src/app/use-cases/page.tsx`
- Create: `src/app/use-cases/[slug]/page.tsx`
- Create: `src/app/use-cases/layout.tsx`
- Modify: `content/skills/best-skills.mdx` (ajout Skills non-techniques)
- Modify: `content/mcp/what-are-mcps.mdx` (callout debutant)
- Modify: `content/skills/what-are-skills.mdx` (callout debutant)
- Modify: `content/plugins/what-are-plugins.mdx` (callout debutant)
- Modify: `src/lib/section-navigation.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`

**Sous-taches :**

- [ ] **Step 1: Creer la structure de routing use-cases**

layout.tsx, page.tsx (index), [slug]/page.tsx avec generateStaticParams.

- [ ] **Step 2: Creer les 3 pages MDX use-cases**

- `business.mdx` : 6+ cas d'usage business avec prompts exacts
- `success-stories.mdx` : 3-4 histoires detaillees de non-devs
- `no-code.mdx` : tutoriels pas a pas avec captures

- [ ] **Step 3: Enrichir best-skills.mdx avec Skills non-techniques**

5+ Skills : email pro, resume document, planning, presentation, post LinkedIn.

- [ ] **Step 4: Ajouter les callouts debutant dans MCP, Skills, Plugins**

Callout en haut des pages avancees : "Si vous debutez, commencez par..."

- [ ] **Step 5: Mettre a jour navigation et metadonnees + build + commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add non-developer content with use cases and success stories (Epic 28)
EOF
)"
git push
```

---

### Task 8: Epic 30 — Enrichissement section Skills tous niveaux

**Files:**
- Modify: `content/skills/best-skills.mdx` (liens telechargement)
- Modify: `content/skills/create-custom.mdx` (patterns avances)
- Create: `public/skills/` (repertoire de Skills telechargeables)
- Modify: `src/lib/section-navigation.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`

**Sous-taches :**

- [ ] **Step 1: Creer le repertoire public/skills/ avec 10+ Skills telechargeables**

Fichiers Markdown telechargeables : React Component, API Pattern, Deploy Checklist, TDD Guide, Code Reviewer, Email Pro, Resume, etc.

- [ ] **Step 2: Enrichir create-custom.mdx avec patterns avances**

Skills conditionnels, multi-etapes, orchestration, validation de sortie, versionning.

- [ ] **Step 3: Ajouter les liens de telechargement dans best-skills.mdx**

Boutons/liens de telechargement pour chaque Skill reference.

- [ ] **Step 4: Documenter les variables de templating**

`$ARGUMENTS`, variables d'environnement, estimation tokens.

- [ ] **Step 5: Build + commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add downloadable skills and advanced patterns documentation (Epic 30)
EOF
)"
git push
```

---

### Checkpoint Batch 4 — Validation

- [ ] **Code Review** : Agent `code-reviewer` sur Epics 28 et 30
- [ ] **Build Docker** : `docker build -t claude-code-guide .`
- [ ] **Corriger** les issues CRITICAL/HIGH

### Audit Batch 4 — SEO + UX/UI (Agents experts)

- [ ] **Agent SEO Expert** : Audit section use-cases (3 pages), maillage interne vers/depuis landing et sections existantes, meta-donnees, JSON-LD
- [ ] **Agent UX/UI Expert** : Audit responsive use-cases, accessibilite, coherence des callouts debutant, experience de telechargement Skills, Lighthouse

---

## Chunk 5: Batch 5 — Completude contenu (Epic 31 + Epic 16)

**Objectif :** Finaliser le contenu avance Agents et la section Vision/Futur.

---

### Task 9: Epic 31 — Enrichissement section Agents profils avances

**Files:**
- Create: `content/agents/agent-sdk.mdx`
- Create: `content/agents/performance-limits.mdx`
- Modify: `content/agents/what-are-agents.mdx` (enrichissement)
- Modify: `content/agents/create-subagent.mdx` (enrichissement)
- Modify: `content/agents/orchestration.mdx` (enrichissement)
- Modify: `src/lib/section-navigation.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`

**Sous-taches :**

- [ ] **Step 1: Creer content/agents/agent-sdk.mdx**

Qu'est-ce que le Claude Agent SDK, construction d'agents programmatiques, integration outils externes, exemples (monitoring, deploy, triage).

- [ ] **Step 2: Creer content/agents/performance-limits.mdx**

Cout tokens, profondeur recursion, gestion erreurs, timeouts, retry, bonnes pratiques production.

- [ ] **Step 3: Enrichir les pages Agents existantes**

Ajouter : config `~/.claude/agents/`, AGENTS.md, Task tool, patterns fan-out/fan-in, comparaison Devin/Aider/CrewAI.

- [ ] **Step 4: Mettre a jour navigation et metadonnees + build + commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add Agent SDK docs and advanced agent patterns (Epic 31)
EOF
)"
git push
```

---

### Task 10: Epic 16 — Section Vision & Futur (3 pages)

**Files:**
- Create: `content/future/why-ai-matters.mdx`
- Create: `content/future/trends-2026.mdx`
- Create: `content/future/roadmap.mdx`
- Modify: `src/app/future/[slug]/page.tsx` (si non existant, verifier generateStaticParams)
- Modify: `src/lib/section-navigation.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/search-index.ts`

**Sous-taches :**

- [ ] **Step 1: Creer les 3 pages MDX Future**

- `why-ai-matters.mdx` : impact IA sur les metiers, opportunites, exemples concrets
- `trends-2026.mdx` : tendances IA 2026, MCP, agents, multimodalite
- `roadmap.mdx` : roadmap du projet Claude Codex, epics realisees, vision

- [ ] **Step 2: Mettre a jour navigation et metadonnees + build + commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add Vision & Future section with 3 pages (Epic 16)
EOF
)"
git push
```

---

### Checkpoint Batch 5 — Validation

- [ ] **Code Review** : Agent `code-reviewer` sur Epics 31 et 16
- [ ] **Build Docker** : `docker build -t claude-code-guide .`
- [ ] **Corriger** les issues CRITICAL/HIGH

### Audit Batch 5 — SEO + UX/UI (Agents experts)

- [ ] **Agent SEO Expert** : Audit 5 nouvelles pages (2 Agents + 3 Future), maillage interne, JSON-LD, meta-donnees, coherence sitemap complet
- [ ] **Agent UX/UI Expert** : Audit responsive, accessibilite, coherence globale du site avec les nouvelles sections, Lighthouse global

---

## Chunk 6: Batch 6 — Infrastructure analytics + Revue globale (Epic 32)

**Objectif :** Mettre en place le suivi d'usage et effectuer un audit global final.

---

### Task 11: Epic 32 — Suivi d'usage et analytics (Matomo)

**Files:**
- Modify: `docker-compose.yml` (ajout services matomo + matomo-db)
- Modify: `nginx/nginx.conf` (reverse proxy Matomo)
- Modify: `src/app/layout.tsx` (script tracking cookieless)
- Create: `.env.example` (variables Matomo)

**Sous-taches :**

- [ ] **Step 1: Ajouter Matomo au docker-compose.yml**

Service `matomo` (image `matomo:fpm-alpine`), service `matomo-db` (MariaDB), volumes persistants, reseau interne.

- [ ] **Step 2: Configurer Nginx**

Reverse proxy vers Matomo, headers de securite.

- [ ] **Step 3: Integrer le script de tracking cookieless**

Dans `layout.tsx` : script async, `disableCookies`, respect Do Not Track.

- [ ] **Step 4: Creer .env.example**

Variables : MATOMO_URL, MATOMO_SITE_ID.

- [ ] **Step 5: Verifier le build Docker complet + commit**

```bash
docker compose build
git commit -m "$(cat <<'EOF'
feat: add Matomo analytics with cookieless tracking (Epic 32)
EOF
)"
git push
```

---

### Checkpoint Final — Validation globale

- [ ] **Code Review** : Agent `code-reviewer` — revue globale des changements cumules
- [ ] **Build Docker** : `docker compose up -d` — verification complete

### Audit Final — SEO + UX/UI (Agents experts) — Revue globale du site

- [ ] **Agent SEO Expert** — Audit global du site complet :
   - Toutes les pages ont title, description, og:tags, canonical
   - Sitemap complet et a jour
   - JSON-LD sur toutes les pages de contenu
   - Maillage interne coherent entre toutes les sections
   - search-index.ts exhaustif
   - Score SEO Lighthouse > 90

- [ ] **Agent UX/UI Expert** — Audit global du site complet :
   - Responsive toutes pages (mobile, tablet, desktop)
   - Dark/light mode coherent partout
   - WCAG 2.1 AA sur toutes les pages
   - Lighthouse > 90 sur les 4 metriques (Performance, Accessibilite, Best Practices, SEO)
   - Parcours utilisateur par persona (novice, debutant, experimente, connaisseur, expert, entreprise)
   - Design system coherent
   - Animations et transitions fluides

---

## Resume de l'ordonnancement

```
Batch 1: Epic 18 (Tests/CI) + Epic 17 (404)
    → Code Review → SEO Audit #1 → UX Audit #1

Batch 2: Epic 25 (MCP custom) + Epic 27 (Enterprise)
    → Code Review → SEO Audit #2 → UX Audit #2

Batch 3: Epic 26 (Parcours personas) + Epic 29 (Limites)
    → Code Review → SEO Audit #3 → UX Audit #3

Batch 4: Epic 28 (Non-dev content) + Epic 30 (Skills)
    → Code Review → SEO Audit #4 → UX Audit #4

Batch 5: Epic 31 (Agents avances) + Epic 16 (Vision/Futur)
    → Code Review → SEO Audit #5 → UX Audit #5

Batch 6: Epic 32 (Matomo)
    → Code Review → SEO Audit Final → UX Audit Final (global)
```

## Agents a invoquer

| Role | Agent Type | Quand |
|------|-----------|-------|
| Code Review | `code-reviewer` (subagent) | Apres chaque epic |
| SEO Expert | `general-purpose` avec prompt SEO | Toutes les 2 epics |
| UX/UI Expert | `ux-designer` (subagent) | Toutes les 2 epics |
| TDD Guide | `tdd-guide` (subagent) | Pendant Epic 18 seulement |
| Build Resolver | `build-error-resolver` (subagent) | Si le build casse |

## Criteres de succes global

- [ ] 11/11 epics implementees
- [ ] Build Next.js sans erreur
- [ ] Build Docker < 50 MB
- [ ] Lighthouse > 90 sur les 4 metriques
- [ ] 0 issue CRITICAL/HIGH non resolue
- [ ] Toutes les nouvelles pages ont meta SEO completes
- [ ] Score persona Enterprise > 7/10 (vs 3/10 actuel)
- [ ] Score persona Expert > 6/10 (vs 4.5/10 actuel)
