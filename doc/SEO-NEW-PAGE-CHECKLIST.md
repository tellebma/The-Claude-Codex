# SEO Checklist — Ajouter une nouvelle page

Guide opérationnel des bonnes pratiques SEO à appliquer **à chaque fois** que l'on ajoute une page (MDX ou React) à `claude-codex.fr`. Basé sur l'audit GSC du 2026-04-11 et les patterns du site.

## 1. Frontmatter MDX — les 4 champs critiques

Toute page MDX (`content/{fr,en}/.../page.mdx`) doit commencer par :

```yaml
---
title: "Titre optimisé (40-55 chars) : mots-clés en premier"
description: "Description persuasive (140-155 chars) avec mots-clés principaux et promesse concrète pour le lecteur."
section: "reference"                # ou "mcp", "skills", "limits", "content"...
order: 4                            # position dans la section (utilisée par les listings)
datePublished: "YYYY-MM-DD"         # date de publication initiale
dateModified: "YYYY-MM-DD"          # à mettre à jour à chaque edit significative
badge: "Env"                        # facultatif — label visuel
---
```

### Règles title

- **40-55 caractères** (Google affiche ~60, avec suffixe `| The Claude Codex` tronqué à ~77 total)
- Le mot-clé principal **en premier** (pas après une marque)
- Pas de bourrage : un seul mot-clé dominant + un différenciateur ("Complete", "2026", "5-Min Guide")
- Pas d'émojis, pas de ponctuation excessive
- Ne JAMAIS dupliquer avec d'autres pages (Google déclasse les doublons)

**Bon** : `Claude Code Environment Variables Reference`
**Mauvais** : `Reference` / `Environment variables (full)` / `The ultimate guide to all Claude Code environment variables and settings`

### Règles description

- **140-155 caractères** (au-delà, Google tronque)
- Inclure **2-3 mots-clés secondaires** (variantes de la query cible)
- Formuler un **bénéfice concret** ("avec exemples bash et CI/CD", "checklist copiable")
- Éviter le doublon avec le title — le title vend le "quoi", la description vend le "comment" / "pourquoi"
- Jamais de placeholder type "Lorem", "TODO", "WIP"

## 2. Dates — obligatoire pour la fraîcheur

- `datePublished` figé à la 1re publication
- `dateModified` **mis à jour** à chaque modification significative du contenu (pas un typo)
- Ces dates alimentent le schema.org `Article` + remontent dans GSC comme signal de fraîcheur

## 3. URL / slug

- **Kebab-case** uniquement (`what-are-mcps`, pas `whatAreMcps` ni `what_are_mcps`)
- **Court** : 3-5 mots max, sans stop-words inutiles (`the`, `a`, `and`)
- **Stable** : une URL ne change jamais après publication (sinon 301 + mise à jour du sitemap)
- **Toujours avec trailing slash** (`next.config.mjs` impose `trailingSlash: true` — ne pas créer de liens sans `/`)
- **Toujours préfixée par la locale** dans les liens internes : `/en/reference/environment`, jamais `/reference/environment`

## 4. Traduction FR + EN — symétrie obligatoire

Pour **chaque** page ajoutée :

1. Créer `content/fr/<section>/<slug>.mdx`
2. Créer `content/en/<section>/<slug>.mdx` avec le **même slug**
3. Même `section`, même `order`, même `datePublished`
4. Title et description **traduits et ré-optimisés** par langue (pas une traduction littérale mot-à-mot)

Sans la paire FR+EN, les `hreflang` alternates pointent vers un 404 et Google déclasse la version existante.

## 5. Structure du contenu H1/H2/H3

- **Un seul H1** par page — géré automatiquement par `SectionSlugContent` depuis `frontmatter.title`. **Ne jamais** écrire `# Titre` manuellement en haut du MDX.
- Commencer le MDX directement par un paragraphe d'intro (50-100 mots) avec le mot-clé principal
- Puis `## Section` (H2) pour chaque grande partie
- `### Sous-section` (H3) pour les détails
- Maximum 3 niveaux. Au-delà, refactorer en sous-pages
- Chaque H2 doit contenir 150-400 mots (pas de sections fantômes)

## 6. Liens internes — règles non négociables

- **Au moins 3 liens sortants** vers d'autres pages du site dans chaque nouvelle page
- **Au moins 1 lien entrant** depuis une page existante (sinon la page est orpheline pour Google)
- Utiliser `/${locale}/section/slug` dans les liens Markdown pour éviter les incohérences hreflang
- Ancres descriptives (`[MCP guide](/en/mcp/what-are-mcps)` plutôt que `[here](...)`)

## 7. Balises et composants SEO-friendly

- Images : toujours avec `alt` descriptif (pas "image", "photo")
- Code blocks : spécifier le langage (` ```bash ` pas ` ``` `) pour le rich snippet
- Tables : utiliser du Markdown standard (les tables MDX sont parsées par Google)
- Callouts (`<Callout>`) : n'injectent pas de poids SEO, privilégier du contenu en texte brut

## 8. Structured data (JSON-LD)

Automatique via `SectionSlugContent` pour les pages en `content/{locale}/<section>/<slug>.mdx` :
- `Article` schema (titre, description, datePublished, dateModified)
- `BreadcrumbList` schema

**Attention** : ne **pas** émettre un second `BreadcrumbList` depuis un composant client — cela crée une duplication et Google dégrade les rich results. Un bug de ce type a été corrigé le 2026-04-11 (`src/components/ui/Breadcrumb.tsx`).

Pour ajouter une FAQ ou un HowTo, passer via la prop `extraJsonLd` de `SectionSlugContent`.

## 9. Métadonnées techniques — ce qui est géré automatiquement

- `canonical` : généré par `createPageMetadata()` depuis le path
- `hreflang fr/en/x-default` : généré depuis la locale
- `openGraph` + `twitter:card` : générés depuis title/description
- Sitemap : la page est incluse automatiquement si elle est dans `content/` ET listée dans `src/data/site-pages.ts` (à maintenir)

**Checker après le build** : `grep "slug" out/sitemap.xml` pour vérifier que la nouvelle page y est bien.

## 10. Contrôles avant merge

Checklist à cocher dans la PR :

- [ ] Title 40-55 chars, mot-clé principal en premier
- [ ] Description 140-155 chars, 2-3 keywords secondaires
- [ ] Slug kebab-case court
- [ ] Version FR ET EN créées avec même slug
- [ ] `datePublished` + `dateModified` remplis
- [ ] `section` et `order` cohérents avec les pages voisines
- [ ] Contenu avec intro + H2/H3 hiérarchisés (pas de H1 manuel)
- [ ] Minimum 3 liens sortants + 1 lien entrant
- [ ] Images avec `alt`, code blocks avec langue
- [ ] `npm run build` passe sans warning
- [ ] Page visible dans `out/sitemap.xml` après build
- [ ] Crawl local : `curl -s http://localhost:3000/en/path/ | grep canonical` renvoie la bonne URL

## 11. Après le déploiement

1. **Google Search Console** → Inspect URL → "Request indexing" sur la nouvelle URL (FR et EN)
2. Soumettre à nouveau `sitemap.xml` si la liste des pages a changé
3. Attendre 48-72 h puis vérifier dans GSC :
   - La page est "Submitted and indexed"
   - `googleCanonical` == `userCanonical`
   - Rich results détectés (Breadcrumbs, Article, FAQ si applicable)
4. J+14 : vérifier les impressions dans "Performance" pour la nouvelle URL

## 12. Erreurs fréquentes à éviter

| Erreur | Pourquoi c'est un problème | Fix |
|---|---|---|
| Title identique à une autre page | Google dédoublonne et déclasse | Title unique par page |
| Description vide ou auto-générée | Google génère une description aléatoire depuis le contenu | Toujours remplir la frontmatter |
| Pas de version FR ou EN | Hreflang 404, déclassement | Créer la paire dès le départ |
| Lien interne sans locale prefix | Crée un BreadcrumbList cassé, URLs en 301 | Toujours `/${locale}/...` |
| H1 écrit dans le MDX | Deux H1 sur la page, Google ignore l'un | Laisser `SectionSlugContent` le gérer |
| Page orpheline (aucun lien entrant) | Pas de découverte par crawl, pas de PageRank | Ajouter un lien depuis la page index de la section |
| Slug long ou avec stop-words | CTR plus faible en SERP | Kebab-case 3-5 mots |
| Trailing slash incohérent | Duplication dans GSC | `trailingSlash: true` impose `/` final |
| `dateModified` jamais mis à jour | Google considère la page stale | Incrémenter à chaque edit substantielle |
| Mots-clés dupliqués dans title ET description | Sur-optimisation, pénalité soft | Title = quoi, Description = comment |

---

**Source de vérité** : ce fichier est la checklist canonique. Toute nouvelle page doit passer les 12 points avant merge. En cas de désaccord avec un audit futur, c'est l'audit qui gagne — mettre à jour ce document.
