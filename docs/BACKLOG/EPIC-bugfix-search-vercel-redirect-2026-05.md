# EPIC : Bugfix recherche — index `search-index-{fr,en}.json` 404 sur Vercel

> Source : recette utilisateur sur preview Vercel `the-claude-codex-env-dev-tellebma.vercel.app`, 2026-05-09 — "search KO, dialog s'ouvre mais 0 resultat partout"
> Date d'ouverture : 2026-05-09
> Effort estime : **2 SP** (2 stories, ~30 min de dev + verif)
> Priorite : **P0** (recherche globale du site totalement non-fonctionnelle en production Vercel)
> Branche cible : `fix/vercel-redirect-public-assets`

---

## Symptome

En production (preview Vercel ou `claude-codex.fr`) :

1. Cliquer sur le bouton "Rechercher" (header) ou taper `Cmd/Ctrl + K`.
2. Le dialog s'ouvre normalement, l'input est focus.
3. Taper n'importe quelle requete (`mcp`, `installation`, `skills`...).
4. **Aucun resultat n'apparait, quel que soit le terme.** L'etat "Aucun resultat" s'affiche.

En local (`npm run dev`), la recherche fonctionne. **Bug specifique a Vercel.**

---

## Root cause

Fichier : `vercel.json`, regle de redirection catch-all (avant fix) :

```json
{
  "source": "/:path((?!fr/|en/|_next/|api/|icon|apple-touch|robots|sitemap|llms|og/|manifest|404|500|favicon).+)",
  "destination": "/fr/:path",
  "permanent": false
}
```

Cette regle a ete introduite dans le commit `fa5b4a6 fix(i18n): generate locale-prefixed hrefs on content and reference pages` (2026-04-22). Elle redirige tout chemin non prefixe par une locale vers `/fr/...`.

**La liste d'exceptions ne couvre pas les fichiers du dossier `public/`** :

| Fichier `public/` | URL demandee | Comportement (avant fix) |
|-------------------|--------------|--------------------------|
| `search-index-fr.json` | `/search-index-fr.json` | Redirige vers `/fr/search-index-fr.json` -> 404 |
| `search-index-en.json` | `/search-index-en.json` | Redirige vers `/fr/search-index-en.json` -> 404 |
| `sad-toaster.glb` | `/sad-toaster.glb` | Redirige vers `/fr/sad-toaster.glb` -> 404 |
| `images/*` | `/images/screenshot.png` | Redirige vers `/fr/images/...` -> 404 |
| `skills/*` | `/skills/api-pattern.md` | Redirige vers `/fr/skills/api-pattern.md` -> 404 |

Le `SearchDialog` charge l'index via :

```ts
// src/lib/search-live.ts
const res = await fetch(`/search-index-${key}.json`, { credentials: "same-origin" });
```

Le fetch recevait un 404 -> `setIndexError(true)` -> dialog affichait "Aucun resultat" ou message d'erreur silencieux.

**Pourquoi le bug a echappe a la review** : `npm run dev` ne passe pas par `vercel.json` (le serveur Next.js sert `public/` directement). La regle ne s'active qu'en production sur Vercel. Pas de test integration qui valide la regex catch-all.

---

## Stories

### B-SRC-1 : fix regex catch-all `vercel.json` + test de regression (1 SP)

**Acceptance** :

- La regex catch-all `/:path(...)` exclut tout chemin contenant un point (= toute extension de fichier static), tout en continuant a rediriger les URLs de pages sans prefixe locale.
- Test unitaire `__tests__/config/vercel-redirects.test.ts` qui :
  - confirme que `/content/foo`, `/getting-started/installation`, `/mcp/what-are-mcps` matchent toujours (-> redirige vers `/fr/...`)
  - confirme que `/fr/...`, `/en/...`, `/_next/...`, `/api/...` ne matchent pas
  - confirme que `/search-index-fr.json`, `/sad-toaster.glb`, `/images/*.png`, `/skills/*.md` ne matchent pas (-> servis statiquement comme attendu)
  - confirme que les exceptions explicites (`llms`, `robots`, `sitemap`, `og/`, `manifest`, `favicon`, etc.) restent exclues
- L'integralite de la suite (`npx vitest run`) passe (1102 tests + 5 nouveaux = 1107).

**Implementation** :

```diff
- "source": "/:path((?!fr/|en/|_next/|api/|icon|apple-touch|robots|sitemap|llms|og/|manifest|404|500|favicon).+)",
+ "source": "/:path((?!fr/|en/|_next/|api/|icon|apple-touch|robots|sitemap|llms|og/|manifest|404|500|favicon)[^.]+)",
```

Le `[^.]+` (un ou plusieurs caracteres non-point) elimine automatiquement tout chemin avec extension de fichier (.json, .glb, .png, .md, .txt, .xml, .ico, etc.) sans avoir a maintenir une whitelist exhaustive.

Status : **fait sur `fix/vercel-redirect-public-assets`** (commit a venir).

### B-SRC-2 : verification E2E recherche en preview Vercel + check assets (1 SP)

**Acceptance** :

- Apres deploiement de la PR sur preview Vercel :
  - `curl -sI https://<preview>.vercel.app/search-index-fr.json` -> 200 OK
  - `curl -sI https://<preview>.vercel.app/sad-toaster.glb` -> 200 OK
  - Ouvrir le dialog de recherche, taper `mcp`, voir au moins 1 resultat
  - Cliquer sur un resultat, atterrir sur la page article (pas de 404)
- Test E2E ajoute dans `e2e/search-results.spec.ts` qui valide ces 4 points (le test peut tourner en CI contre l'URL preview ou contre prod, comme `e2e/i18n-redirect.spec.ts`).
- Validation visuelle puis merge develop -> main.

Status : a faire.

---

## Plan de deploiement

1. PR `fix/vercel-redirect-public-assets` -> `develop`.
2. Vercel deploie la preview, on verifie que `search-index-fr.json` est servi (200) et que la recherche fonctionne.
3. Merge `develop` -> `main` (auto-deploy `claude-codex.fr`).
4. Smoke test sur le domaine prod : recherche `mcp`, click resultat, observer que ca marche.

---

## Lien Backlog

- A ajouter dans `docs/BACKLOG/STATUS.md`, ligne dediee "Bugfixes 2026-05".
- Pas de dependance avec les autres EPICs en cours.
- Recommendation : ajouter une entree dans `e2e/` qui smoke-teste les assets `public/` apres chaque deploy preview, pour eviter les regressions silencieuses du meme genre.

---

## Annexes

### Verification regex (avant/apres)

```bash
node <<'EOF'
const oldRe = /^\/(?!fr\/|en\/|_next\/|api\/|icon|apple-touch|robots|sitemap|llms|og\/|manifest|404|500|favicon).+$/;
const newRe = /^\/(?!fr\/|en\/|_next\/|api\/|icon|apple-touch|robots|sitemap|llms|og\/|manifest|404|500|favicon)[^.]+$/;
const tests = [
  '/search-index-fr.json',
  '/sad-toaster.glb',
  '/images/screenshot.png',
  '/skills/api-pattern.md',
  '/content/foo',
  '/getting-started/installation',
];
for (const t of tests) console.log(t, '| old:', oldRe.test(t), '| new:', newRe.test(t));
EOF
```

Resultat attendu :

```
/search-index-fr.json       | old: true  | new: false
/sad-toaster.glb            | old: true  | new: false
/images/screenshot.png      | old: true  | new: false
/skills/api-pattern.md      | old: true  | new: false
/content/foo                | old: true  | new: true
/getting-started/installation | old: true  | new: true
```
