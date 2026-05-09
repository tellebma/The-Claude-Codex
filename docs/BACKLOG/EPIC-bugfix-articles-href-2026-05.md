# EPIC : Bugfix landing — articles non ouvrables (URL avec section dupliquee)

> Source : recette utilisateur sur preview Vercel `the-claude-codex-env-dev-tellebma.vercel.app`, 2026-05-09
> Date d'ouverture : 2026-05-09
> Effort estime : **2 SP** (2 stories, ~30 min de dev + verif)
> Priorite : **P0** (bug visible en production preview, casse la navigation depuis la landing)
> Branche cible : `fix/landing-recent-articles-href`

---

## Symptome

Sur la landing (`/fr/`, `/en/`), la section "Articles recents" affiche 8 cards. Cliquer sur n'importe quelle card mene sur **"Page introuvable" (404)**.

URL produite (incorrecte) :

```
/fr/getting-started/getting-started/installation/
/fr/mcp/mcp/what-are-mcps/
/fr/skills/skills/what-are-skills/
```

URL attendue :

```
/fr/getting-started/installation/
/fr/mcp/what-are-mcps/
/fr/skills/what-are-skills/
```

Le segment de section est duplique. Reproduit en local sur `localhost:3001` apres `npm run dev` sur la branche `develop`.

---

## Root cause

Fichier : `src/lib/mdx.ts`, fonction `buildEntry` (lignes 302-318).

Pour les articles racine (`/content/foo.mdx`), `MdxFile.slug` = `"foo"` (slug nu).
Pour les articles de section (`/getting-started/installation.mdx`), `MdxFile.slug` = `"getting-started/installation"` (slug prefixe par la section, cf. `getSectionMdxBySlug` ligne 185).

`buildEntry` stockait `slug: file.slug` directement. Cote consommateur dans `RecentArticlesClient.articleHref` :

```ts
return article.section
  ? `/${article.section}/${article.slug}`        // -> /getting-started/getting-started/installation
  : `/content/${article.slug}`;
```

La section etait donc preposee deux fois pour les articles de section (une fois dans `article.section`, une fois deja contenue dans `article.slug`).

**Pourquoi le bug a echappe a la review** : les tests unitaires de `getMostRecentArticles` (`__tests__/lib/mdx.test.ts` RG-32) ne couvraient que des articles **racine** (`section: null`). Aucun test n'exercait un article de section, et c'est exactement le cas qui revele le bug.

**Quand le bug a ete introduit** : commit `8ae1e65 feat(refonte-graphique): RG-32 CodexStatsBand + RecentArticlesSection landing (#119)` (2026-04-22). Pas detecte en recette parce que la cards section n'avaient pas encore ete reskinees ; RG2-13 (2026-05-09) a renforce la section et amene l'utilisateur a effectivement cliquer dessus pour la premiere fois.

---

## Stories

### B-ART-1 : fix `buildEntry` + test de regression (1 SP)

**Acceptance** :

- `getMostRecentArticles(N, "fr")` retourne `slug` "nu" (filename seul) pour les articles de section, et la section dans `section`.
- Test unitaire `__tests__/lib/mdx.test.ts` "articles de section > retourne section + slug nu" passe.
- L'integralite de la suite (`npx vitest run`) passe (1102 tests).

**Implementation** :

```ts
function buildEntry(file, section, locale, ts) {
  const bareSlug =
    section && file.slug.startsWith(`${section}/`)
      ? file.slug.slice(section.length + 1)
      : file.slug;
  return { ..., slug: bareSlug, ... };
}
```

Status : **fait sur `fix/landing-recent-articles-href`** (commit a venir).

### B-ART-2 : verification E2E + visuelle (1 SP)

**Acceptance** :

- Sur `/fr/` et `/en/`, cliquer sur chacune des 8 cards de la section "Articles recents" mene sur la page article correspondante (page existe, pas de 404).
- Test E2E ajoute dans `e2e/landing-recent-articles.spec.ts` (ou similaire) qui :
  1. ouvre `/fr/`
  2. liste tous les liens dans la region `[role="region"][aria-label="Articles recents"]`
  3. pour chaque href, fait `page.goto(href)` et assert `response.ok()` + `page.title()` non vide.
- Validation visuelle sur preview Vercel apres deploiement.

Status : a faire.

---

## Plan de deploiement

1. PR `fix/landing-recent-articles-href` -> `develop`.
2. Verification preview Vercel.
3. Merge `develop` -> `main` (auto-deploy `claude-codex.fr`).

---

## Lien Backlog

- A ajouter dans `docs/BACKLOG/STATUS.md` ligne dediee "Bugfixes 2026-05" ou EPIC dedie.
- Pas de dependance avec les autres EPICs en cours.

---

## Annexes

### Reproduction (avant fix)

```bash
# Sur la branche develop, sans le fix :
npm run dev  # port 3001
# Naviguer http://localhost:3001/fr/
# Cliquer sur "Prerequis et installation" dans "Articles recents"
# -> URL: /fr/getting-started/getting-started/installation/
# -> Page introuvable (404)
```

### Verification (apres fix)

```bash
npx vitest run __tests__/lib/mdx.test.ts -t "articles de section"
# -> 1 passed
```
