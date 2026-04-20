# MT22 + MT23 — Redirections NPM (canonical slash + locale)

> Source : analyse GSC 2026-04-20 (`docs/REPORTS/gsc-2026-04-20/ANALYSIS.md`)
> Cible : éliminer le duplicate-content signalé par Google pour `claude-codex.fr`.

---

## Problèmes détectés

### MT22 — URLs sans trailing slash indexées en double

| URL sans slash | URL avec slash | Impressions cumul |
|----------------|-----------------|-----|
| `/en/reference/environment` (904 imp) | `/en/reference/environment/` (1 129 imp) | **2 033** |
| `/en/limits/vs-copilot` (311 imp) | `/en/limits/vs-copilot/` (1 253 imp) | **1 564** |
| `/en/skills/best-skills` (80 imp) | `/en/skills/best-skills/` | |
| `/mcp/what-are-mcps` (82 imp) | | |

Le projet a `trailingSlash: true` (canonique = version avec slash) mais Google a crawlé les deux. Solution : 301 explicite côté NPM.

### MT23 — URLs indexées sans préfixe locale

- `/mcp/what-are-mcps` (82 imp, 0 clic, pos 6,4) est indexé **sans** `/fr/` ni `/en/`. Reste de l'époque pré-i18n (avant migration next-intl). Le contenu statique n'existe plus à cette URL → Google envoie des visiteurs sur 404.

---

## Snippet NPM à ajouter

Dans NPM → édite la proxy-host `claude-codex.fr` → onglet **Advanced** → **Custom Nginx Configuration** → colle à la suite des redirects MT1 :

```nginx
# MT22 — Canonical trailing slash pour les pages FR/EN
# Redirige /fr/reference/environment vers /fr/reference/environment/
# (exclut les fichiers avec extension .xml .txt .json .ico .png .svg etc.)
location ~ ^(/(?:fr|en)/[^.]+[^/])$ {
    return 301 $1/$is_args$args;
}

# MT23 — Locale-less legacy URLs → FR (default locale)
# Capture les anciennes URLs pré-i18n encore indexées par Google
# Redirige /mcp/what-are-mcps/ → /fr/mcp/what-are-mcps/
location ~ ^/(getting-started|mcp|skills|agents|plugins|prompting|content|advanced|future|personas|enterprise|limits|reference|use-cases|configurator|glossary|about)(/.*)?$ {
    return 301 /fr/$1$2$is_args$args;
}
```

---

## Ordre d'insertion dans NPM

L'ordre compte. Les règles plus spécifiques d'abord :

```
1. Redirects MT1 (slugs spécifiques EN)           ← déjà en place
2. MT22 canonical slash                            ← à ajouter
3. MT23 locale-less legacy                         ← à ajouter
4. location /  (proxy_pass)                        ← déjà en place
5. error_page + maintenance.html                   ← déjà en place
```

NPM traite les `location =` (exact match) avant les `location ~` (regex), donc les règles MT1 ne seront pas court-circuitées.

---

## Tests après application

### Test 1 — Canonical slash (MT22)

```bash
# Avant : 404
# Après : 301 vers /en/reference/environment/
curl -I https://claude-codex.fr/en/reference/environment

# Résultat attendu
HTTP/2 301
location: https://claude-codex.fr/en/reference/environment/
```

### Test 2 — Locale-less URL (MT23)

```bash
# Avant : 404 (http-server natif)
# Après : 301 vers /fr/mcp/what-are-mcps/
curl -I https://claude-codex.fr/mcp/what-are-mcps

# Résultat attendu
HTTP/2 301
location: /fr/mcp/what-are-mcps/
```

### Test 3 — Les URLs correctes ne doivent PAS être redirigées

```bash
# Doit retourner 200 (pas 301)
curl -I https://claude-codex.fr/fr/mcp/what-are-mcps/
curl -I https://claude-codex.fr/en/reference/environment/

# Fichiers spéciaux
curl -I https://claude-codex.fr/sitemap.xml
curl -I https://claude-codex.fr/robots.txt
```

### Test 4 — Query strings préservés

```bash
# Doit propager ?utm_source=test
curl -I 'https://claude-codex.fr/en/reference/environment?utm_source=test'
# → location: /en/reference/environment/?utm_source=test
```

---

## Risques et mitigation

| Risque | Probabilité | Mitigation |
|--------|-------------|-----------|
| Regex trop large → redirige une ressource statique | Moyenne | Le pattern `[^.]` exclut les extensions. Tester `/favicon.ico`, `/_next/static/*.js`. |
| NPM applique mal l'ordre | Faible | NPM utilise nginx standard, ordre `=` puis `~` respecté. |
| Google met du temps à reprendre en compte | Haute | Soumettre le sitemap après application. Attendre 2-4 semaines pour voir la consolidation des impressions sur l'URL canonique. |
| Loop de redirection | Faible | Les règles ciblent uniquement URLs sans slash → vers avec slash. Pas de réciproque. |

---

## Plan de validation GSC post-déploiement

1. Appliquer le snippet dans NPM → Save
2. Tester les 4 cas curl ci-dessus
3. GSC → **Indexation → Pages** → vérifier que les pages en double sont marquées "Dupliquée, Google a choisi une autre URL que l'utilisateur comme canonique" → elles devraient migrer vers "Autre page avec balise canonique appropriée" dans 2-4 semaines
4. Soumettre le sitemap : `https://claude-codex.fr/sitemap.xml` dans GSC
5. Pour accélérer : dans GSC → **URL Inspection** → inspecter chaque URL fantôme → "Demander une indexation"

---

## Impact SEO attendu

| KPI | Baseline (2026-04-20) | Cible (2026-05-20) |
|-----|-----------------------|---------------------|
| Impressions sur URL canonique `/en/reference/environment/` | 1 129 | 2 000+ (consolidation) |
| Impressions sur URL non-canonique `/en/reference/environment` | 904 | < 50 (désindexation progressive) |
| Position moyenne `/en/reference/environment/` | 7,7 | 5-6 (meilleure concentration PageRank) |
| URLs fantômes dans GSC | 3+ | 0 |

---

## Rollback plan

Si un problème de boucle ou de ressource statique cassée :

1. NPM → édite la proxy-host → onglet Advanced
2. Commenter les 2 blocs ajoutés (préfixer chaque ligne avec `#`)
3. Save → reload NPM auto
4. Revenir à la config précédente en < 1 min

Aucun code applicatif modifié, rollback trivial.
