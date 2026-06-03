# TUTO-6 Batch 4 — Migration `agents` vers ArticleShell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer la section `agents` (18 routes : 9 slugs × 2 locales) de `SectionSlugContent` vers `TutoArticleContent` / `ArticleShell`, en suivant exactement le pattern des batches 1-3 (skills / prompting / mcp).

**Architecture:** Modifier uniquement `src/app/[locale]/agents/[slug]/page.tsx` — swap de 3 lignes (import + JSX). `TutoArticleContent` se charge lui-même du câblage `ArticleShell` + `SectionPeers` + `ArticleHero` + `ReadingProgressBar` + `ArticlePager`. Aucun changement au layout, aux MDX ni aux composants partagés.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Playwright + axe-core (tests a11y), MDX/gray-matter

---

## Fichiers impactés

| Action | Fichier | Description |
|--------|---------|-------------|
| Modify | `src/app/[locale]/agents/[slug]/page.tsx` | Swap `SectionSlugContent` → `TutoArticleContent`, supprime import `Bot` |
| Modify | `e2e/a11y.spec.ts` | Ajoute 6 routes agents (5 FR + 1 EN) = 12 nouveaux tests (× 2 thèmes) |
| Modify | `docs/BACKLOG/STATUS.md` | Marque batch 4 agents livré |
| Modify | `docs/BACKLOG/EPIC-tuto-pages-article-shell-2026-05.md` | Met à jour la progression TUTO-6 |

**Fichiers NON touchés :** layouts, MDX, page overview `/agents/`, composants partagés, `section-navigation.ts`, `metadata.ts`, `search-index.ts` (migration shell only).

---

## Task 1 : Git setup

**Files:**
- (aucun fichier modifié — opérations git)

- [ ] **Step 1 : Vérifier l'état git**

```bash
git status --short --branch
git log --oneline -3
```

Expected : branche `feat/tuto-6-mcp-article-shell`, clean, dernier commit `d04d00f`.

- [ ] **Step 2 : Créer la branche backup**

```bash
SHORTSHA=$(git rev-parse --short HEAD)
git branch "backup/tuto6-agents-before-${SHORTSHA}"
echo "Backup créée : backup/tuto6-agents-before-${SHORTSHA}"
```

Expected : branche créée sans erreur.

- [ ] **Step 3 : Créer et checkout la branche de travail**

```bash
git checkout -b feat/tuto-6-agents-article-shell
```

Expected : `Switched to a new branch 'feat/tuto-6-agents-article-shell'`

---

## Task 2 : Migrer `agents/[slug]/page.tsx`

**Files:**
- Modify: `src/app/[locale]/agents/[slug]/page.tsx`

La modification est minimale : 3 changements.

**Avant (lignes 3-8) :**
```typescript
import { Bot } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import { createFAQPageSchema } from "@/lib/structured-data";
import { getPageFaqs } from "@/data/page-faqs";
import SectionSlugContent from "@/components/layout/SectionSlugContent";
```

**Après :**
```typescript
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import { createFAQPageSchema } from "@/lib/structured-data";
import { getPageFaqs } from "@/data/page-faqs";
import { TutoArticleContent } from "@/components/layout/TutoArticleContent";
```

**Avant (lignes 43-58, fonction AgentsSlugPage) :**
```typescript
export default async function AgentsSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const faqs = getPageFaqs(`/${SECTION}/${slug}`, locale);
  const extraJsonLd = faqs ? [createFAQPageSchema(faqs)] : undefined;

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={Bot}
      extraJsonLd={extraJsonLd}
    />
  );
}
```

**Après :**
```typescript
export default async function AgentsSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // TUTO-6 (batch 4) — section agents entierement migree vers le shell article.
  const faqs = getPageFaqs(`/${SECTION}/${slug}`, locale);
  const extraJsonLd = faqs ? [createFAQPageSchema(faqs)] : undefined;

  return (
    <TutoArticleContent
      section={SECTION}
      slug={slug}
      locale={locale}
      extraJsonLd={extraJsonLd}
    />
  );
}
```

- [ ] **Step 1 : Appliquer la modification**

Éditer `src/app/[locale]/agents/[slug]/page.tsx` :
1. Remplacer `import { Bot } from "lucide-react";` + la ligne suivante par rien (supprimer `Bot`)
2. Remplacer `import SectionSlugContent from "@/components/layout/SectionSlugContent";` par `import { TutoArticleContent } from "@/components/layout/TutoArticleContent";`
3. Remplacer le return JSX : `<SectionSlugContent ... icon={Bot} ... />` → `<TutoArticleContent ... />` (sans `icon`)
4. Ajouter le commentaire TUTO-6 batch 4 au-dessus de `const faqs`

Résultat attendu — fichier complet :
```typescript
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import { createFAQPageSchema } from "@/lib/structured-data";
import { getPageFaqs } from "@/data/page-faqs";
import { TutoArticleContent } from "@/components/layout/TutoArticleContent";

const SECTION = "agents";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}): Array<{ slug: string }> {
  return [...getSectionMdxSlugs(SECTION, params.locale)].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getSectionMdxSlugs(SECTION, locale).includes(slug)) {
    return {};
  }
  const { frontmatter } = getSectionMdxBySlug(SECTION, slug, locale);

  return createPageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/${locale}/${SECTION}/${slug}`,
    locale,
    publishedTime: frontmatter.datePublished,
    modifiedTime: frontmatter.dateModified,
  });
}

export default async function AgentsSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // TUTO-6 (batch 4) — section agents entierement migree vers le shell article.
  const faqs = getPageFaqs(`/${SECTION}/${slug}`, locale);
  const extraJsonLd = faqs ? [createFAQPageSchema(faqs)] : undefined;

  return (
    <TutoArticleContent
      section={SECTION}
      slug={slug}
      locale={locale}
      extraJsonLd={extraJsonLd}
    />
  );
}
```

- [ ] **Step 2 : Vérifier type-check local sur ce fichier**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected : 0 erreur TypeScript.

---

## Task 3 : Ajouter les tests a11y agents

**Files:**
- Modify: `e2e/a11y.spec.ts`

Même pattern que batches 1-3 : 5 slugs FR diversifiés + 1 slug EN représentatif = 6 routes × 2 thèmes = 12 tests.

Slugs choisis (diversité typologique) :
- `what-are-agents` : introductif, court
- `create-subagent` : hands-on avec code
- `agent-teams` : long, dense
- `orchestration` : avancé, dense avec diagrammes
- `agent-sdk` : technique, TypeScript/Python

EN : `what-are-agents` (représentatif)

- [ ] **Step 1 : Ajouter les entrées dans le tableau `ROUTES` de `e2e/a11y.spec.ts`**

Insérer le bloc suivant immédiatement après le bloc `// TUTO-6 (batch 3)` (après la ligne `path: "/en/mcp/what-are-mcps/"`) et avant le bloc `// TUTO-5` :

```typescript
  // TUTO-6 (batch 4) — rollout complet de la section agents vers ArticleShell.
  // Echantillon : 5 slugs FR diversifies (introductif, hands-on, long/dense, avance,
  // technique SDK) + 1 slug EN representatif. color-contrast : dette brand-500
  // (pill categorie) identique aux autres articles. SCROLLABLE_OVERFLOW_OK : blocs
  // code TypeScript/Python/bash frequents dans les articles agents.
  {
    path: "/fr/agents/what-are-agents/",
    name: "FR agents what-are-agents (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/create-subagent/",
    name: "FR agents create-subagent (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/agent-teams/",
    name: "FR agents agent-teams (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/orchestration/",
    name: "FR agents orchestration (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/agent-sdk/",
    name: "FR agents agent-sdk (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/agents/what-are-agents/",
    name: "EN agents what-are-agents (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
```

---

## Task 4 : Quality gates

**Files:**
- (aucun — vérifications)

- [ ] **Step 1 : Type-check**

```bash
npm run type-check
```

Expected : `Found 0 errors.` (ou similaire sans erreur)

- [ ] **Step 2 : Lint**

```bash
npm run lint
```

Expected : 0 warning et 0 erreur

- [ ] **Step 3 : Build SSG**

```bash
npm run build 2>&1 | tail -20
```

Expected : build terminé sans erreur, 18 routes agents dans la sortie SSG (ex: `○ /fr/agents/what-are-agents` etc.)

- [ ] **Step 4 : audit:links (documentation du résultat)**

```bash
npm run audit:links 2>&1 | tail -10
```

Expected : les éventuelles erreurs sont pré-existantes (44 liens connus). Si le nombre est identique ou inférieur → OK, ne bloque pas. Si des nouvelles erreurs agents apparaissent → investiguer avant commit.

---

## Task 5 : Mettre à jour les docs backlog

**Files:**
- Modify: `docs/BACKLOG/STATUS.md`
- Modify: `docs/BACKLOG/EPIC-tuto-pages-article-shell-2026-05.md`

- [ ] **Step 1 : Mettre à jour STATUS.md**

Dans `docs/BACKLOG/STATUS.md`, ligne 3 (en-tête `Derniere mise a jour`), remplacer la ligne existante par :

```
> Derniere mise a jour : 2026-05-29 (Tuto-pages TUTO-6 batch 4 `agents` livre : 18 routes migrees vers ArticleShell, 12 tests a11y batch 4 (6 routes x light+dark), build OK ; batch 3 `mcp` 20 routes + batch 2 `prompting` 24 routes + batch 1 `skills` 12 routes livres precedemment ; Content page redesign clos 100% #240/#243 + release prod 1.10.0 ; Vercel Metrics clos 9/11 VM-8/VM-12 descopes)
```

Dans le tableau Vue d'ensemble, ligne EPIC `Tuto-pages article-shell 2026-05`, mettre à jour :
- `Fait` : 3 → **4** (ou selon comptage stories réel)
- `En cours` : 1 → **0**
- `A faire` : 6 → **5**
- `Progression` : `38% 🔄` → `48% 🔄`
- Légende inline : ajouter mention batch 4 agents après batch 3

Exemple de la cellule Progression mise à jour :
```
| [Tuto-pages article-shell 2026-05](EPIC-tuto-pages-article-shell-2026-05.md) | 10 | 4 | 0 | 6 | 48% 🔄 (TUTO-2 SectionPeers #215, TUTO-3 pilote #248, TUTO-5 getting-started complet #249 — composant TutoArticleContent factorise (TUTO-4) livre avec #248 ; TUTO-6 EN COURS : batch 1 `skills` livre (12 routes, 16 tests a11y verts), batch 2 `prompting` livre (24 routes, 12 tests a11y batch 2), batch 3 `mcp` livre (20 routes, 12 tests a11y batch 3), batch 4 `agents` livre (18 routes, 12 tests a11y batch 4, baselines visuelles reportees pour env stable) ; reste advanced) |
```

Note : la note longue dans `>` à la fin du fichier qui décrit l'EPIC tuto doit également être mise à jour pour mentionner le batch 4. Trouver le paragraphe qui commence par `> EPIC **Tuto-pages article-shell 2026-05**` et ajouter à la fin : `**TUTO-6 batch 4 `agents` livre le 2026-05-29** : bascule des 9 pages agents (what-are-agents, create-subagent, agent-teams, best-agents, orchestration, agent-sdk, performance-limits, background-agents, orchestration-patterns) vers `TutoArticleContent`. FAQ dynamique via `getPageFaqs` + `createFAQPageSchema` conservee. 12 tests a11y batch 4 ajoutes (5 slugs FR + what-are-agents EN, light+dark). Baselines visuelles reportees (env WSL2/Ubuntu non fiable). dateModified non bumpe (migration shell only). Reste batch advanced (TUTO-7).`

- [ ] **Step 2 : Mettre à jour EPIC-tuto-pages-article-shell-2026-05.md**

Trouver la section qui liste les batches TUTO-6 (chercher `batch 3 mcp`) et ajouter après :

```markdown
**TUTO-6 batch 4 `agents` livre le 2026-05-29** : 18 routes (9 slugs × 2 locales). Meme pattern que batches 1-3 : swap SectionSlugContent → TutoArticleContent, conserve getPageFaqs/createFAQPageSchema. Branche : `feat/tuto-6-agents-article-shell`. 12 tests a11y (5 FR + 1 EN, light+dark). Baselines visuelles reportees.
```

---

## Task 6 : Commit et push

**Files:**
- (git)

- [ ] **Step 1 : Vérifier les fichiers modifiés**

```bash
git diff --stat
```

Expected : 4 fichiers modifiés (`agents/[slug]/page.tsx`, `e2e/a11y.spec.ts`, `docs/BACKLOG/STATUS.md`, `docs/BACKLOG/EPIC-tuto-pages-article-shell-2026-05.md`)

- [ ] **Step 2 : Stager les fichiers**

```bash
git add src/app/\[locale\]/agents/\[slug\]/page.tsx
git add e2e/a11y.spec.ts
git add docs/BACKLOG/STATUS.md
git add "docs/BACKLOG/EPIC-tuto-pages-article-shell-2026-05.md"
```

- [ ] **Step 3 : Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(layout)+test(a11y)+docs(backlog): TUTO-6 batch 4 rollout agents vers ArticleShell

- Migre agents/[slug]/page.tsx : SectionSlugContent -> TutoArticleContent
- Supprime import Bot (inutile post-migration)
- Conserve getPageFaqs / createFAQPageSchema (FAQ JSON-LD)
- Ajoute 12 tests a11y batch 4 (5 slugs FR + what-are-agents EN, light+dark)
- Met a jour STATUS.md + EPIC backlog : batch 4 agents livre
- Baselines visuelles reportees (env instable, a regenerer en Linux stable)
- dateModified non bumpe (migration shell only)
EOF
)"
```

- [ ] **Step 4 : Push**

```bash
git push -u origin feat/tuto-6-agents-article-shell
```

Si le push échoue par auth/token : noter le statut exact, laisser le commit local intact et documenter dans le rapport final.

---

## Risques & restes post-livraison

| Item | Risque | Action |
|------|--------|--------|
| GSC J+7 | Impressions ±15%, CTR stable attendu | Monitorer GSC 7j après merge en prod |
| Baselines visuelles | Non régénérées (env WSL2/Ubuntu instable, pattern batch 1-3) | Régénérer via `npm run update-snapshots` en env Linux stable avant TUTO-7 |
| INP p75 | < 200 ms WebPageTest Moto G4 | Vérifier sur 3 pages agents réelles post-déploiement |
| `audit:links` | 44 liens pré-existants connus | Vérifier que batch 4 n'en ajoute pas de nouveaux |
| `background-agents.mdx` order | `order: 6` en collision avec `agent-sdk.mdx` (ordre frontmatter) | Hors scope migration shell — à corriger dans une story dédiée si la navigation est affectée |
