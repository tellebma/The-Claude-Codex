# EPIC : Refonte de la page `/content` (vitrine éditoriale)

> Source : demande PO 2026-05-19 — la page `/content/` est aujourd'hui une liste plate sans hiérarchie, qui ne donne pas envie de lire.
> Date d'ouverture : 2026-05-19
> Effort estimé : **24 SP** (12 stories sur 3 sprints, ~5 semaines)
> Priorité : Backlog (en parallèle de l'EPIC Tuto-pages article-shell, pas de chevauchement de fichiers)
> Branche cible : `feat/content-page-redesign` (puis sous-branches par story `feat/ctn-N-...`)
> Pré-requis : aucun bloquant — Matomo cookieless déjà en place avec scroll-depth (cf. SEO-8 / SEO-9 livrés), `getMostRecentArticles` déjà en place
> Owner : Maxime BELLET
> Statut : draft, en attente de validation reviews UX + SEO

---

## Contexte

### État actuel (audit `/fr/content/` au 2026-05-19)

La page `/content/` (et son miroir `/en/content/`) est implémentée dans `src/app/[locale]/content/page.tsx`. Elle rend :

1. Un hero avec badge + titre + sous-titre
2. Deux paragraphes d'introduction
3. Une **liste plate** des 16 articles éditoriaux (un par fichier `content/{fr,en}/*.mdx`), triée par champ `order` du frontmatter
4. Chaque entrée : badge optionnel + titre + description + flèche

**Limites identifiées par le PO** :

- Pas de hiérarchie visuelle entre les articles — tous ont le même poids
- Aucune mise en avant des articles récents, populaires ou en tendance
- Pas de filtres par thème (alors que le frontmatter porte le champ `themes` validé)
- Pas de vignette ou élément graphique pour donner envie de cliquer
- Pas de signal de fraîcheur ni de durée de lecture
- L'ordre `order` du frontmatter est un signal éditorial figé, pas un signal d'usage

**Volume actuel** : 16 articles racine dans `content/fr/*.mdx` (et miroirs EN). Suffisant pour justifier une mise en scène différenciée.

### Pourquoi un EPIC dédié

Les EPICs existants couvrent :

- `Refonte premium 2026-05` → article shell 3 colonnes pour les pages d'article elles-mêmes
- `Tuto-pages article-shell` → migration des pages tuto vers ce shell
- `Polish heros sections` → polish des hero des sections (`/skills/`, `/mcp/`, etc.)

**Aucun EPIC ne traite la vitrine `/content/` elle-même**. C'est pourtant la porte d'entrée éditoriale (linkée depuis le Header, la landing, et chaque article via les liens internes). Un visiteur SEO arrive directement sur un article, lit, puis remonte sur `/content/` pour en lire un autre — c'est précisément ce moment d'engagement qu'il faut soigner.

---

## Vision

Transformer `/content/` en **vitrine éditoriale moderne** qui donne envie de cliquer. Trois objectifs :

1. **Hiérarchiser** : tous les articles ne sont pas équivalents. Séparer les récents, les populaires, les en tendance, et la longue traîne.
2. **Informer** : pour chaque article, montrer immédiatement la valeur (thème, durée de lecture, fraîcheur).
3. **Faciliter le parcours** : un visiteur doit pouvoir choisir un article en 5 secondes via filtres et hiérarchie visuelle.

**Triple inspiration** :

- The Verge (catalogue éditorial avec sections claires : Latest, Trending, Featured)
- Stripe Press (mise en valeur typographique + cartes illustrées sobres)
- GitHub Trending (signal "ce qui monte" sans cliquer)

**Triple objectif business** :

1. **Engagement** : augmenter le nombre moyen de pages vues par session (Matomo) sur les visiteurs qui atterrissent sur `/content/`.
2. **SEO long-tail** : meilleur maillage interne entre articles éditoriaux, signal de fraîcheur clair.
3. **GEO** : structure de page lisible pour les LLM qui citent le contenu (clusters thématiques explicites).

---

## Contraintes techniques

Le site est **100 % statique** (`output: 'export'` dans `next.config.mjs`). Conséquences directes :

- Pas de SSR, pas d'API routes → toutes les données doivent être **résolues au build**
- Pour "Most read" et "Trending", il faut un **snapshot de stats** committé dans le repo (pas de fetch runtime)
- Source de stats prévue : **Matomo cookieless** (en place depuis SEO-8 / SEO-9, scroll-depth tracking actif sur toutes les pages éditoriales)
- Fallback : **liste curated** par le PO si l'API Matomo n'est pas accessible en CI

**Risque accepté** : un délai de 7-14 jours entre la collecte Matomo et l'affichage est tolérable. Les stats sont rafraîchies une fois par semaine via workflow CI + PR draft.

---

## Priorisation MoSCoW

### MUST HAVE (12 SP, Sprint 1) — Refonte structurelle + Derniers articles

> Le but du Sprint 1 : sortir une vitrine déjà supérieure à l'existante **sans dépendre de données analytics**. Latest seul (calculable depuis le frontmatter) couvre déjà 70 % de la valeur perçue.

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| CTN-1 | Décision design tranchée + maquettes Figma (light + dark, 1440 + 768) | 2 | doc + Figma |
| CTN-2 | Composant `<ArticleCard>` réutilisable (visuel, badges `themes`, date, durée lecture estimée, slug) | 3 | `src/components/ui/ArticleCard.tsx` |
| CTN-3 | Section "Derniers articles" (latest, top 6) en haut de page sous le hero | 2 | `src/app/[locale]/content/page.tsx` |
| CTN-4 | Refonte hero + intro éditoriale (suppression du double paragraphe générique) | 2 | `src/app/[locale]/content/page.tsx` |
| CTN-5 | Section "Tous les articles" filtrable par `themes` (chips cliquables, filtrage côté client) | 3 | `src/app/[locale]/content/page.tsx` + `src/components/ui/ArticleThemeFilter.tsx` |

### SHOULD HAVE (8 SP, Sprint 2) — Sections data-driven (trending + most read)

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| CTN-6 | Script `scripts/refresh-article-stats.ts` qui pull Matomo API → `src/data/article-stats.json` (idempotent, source datée) | 3 | `scripts/`, `src/data/` |
| CTN-7 | Workflow GH Actions hebdo `weekly-article-stats.yml` qui ouvre une PR draft avec MAJ JSON | 2 | `.github/workflows/` |
| CTN-8 | Section "Les plus lus 30 derniers jours" (top 6 par pageviews Matomo) | 2 | `src/app/[locale]/content/page.tsx` |
| CTN-9 | Section "Tendances 7 derniers jours" (top 5 par croissance pageviews vs 7j précédents) | 1 | `src/app/[locale]/content/page.tsx` |

### COULD HAVE (4 SP, Sprint 3) — Polish + variations

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| CTN-10 | Vignettes Open Graph par article : génération automatique via `app/[locale]/content/[slug]/opengraph-image.tsx` reuse | 2 | `src/components/ui/ArticleCard.tsx` |
| CTN-11 | Mise en avant article du moment ("Pinned editorial") : sélection manuelle via `src/data/pinned-article.ts`, affichage hero ratio 2/3 | 1 | `src/app/[locale]/content/page.tsx` |
| CTN-12 | E2E `e2e/content-index.spec.ts` + visual regression (FR + EN, light + dark, mobile + desktop) | 1 | `e2e/`, snapshots |

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Système de notation utilisateur (étoiles, likes) | Impossible sur un site statique sans backend. Ouvrirait un EPIC infra dédié si demande confirmée |
| W2 | Commentaires sur les articles | Idem, et conflit avec la stratégie "no third-party tracking" |
| W3 | Newsletter / abonnement RSS premium | EPIC dédié à ouvrir si confirmé |
| W4 | Carrousel auto-rotatif sur le hero | Pattern UX daté, pénalisant CWV (CLS) |
| W5 | Page de tag par `theme` (`/content/theme/tutorial/`) | Risque de duplication SEO avec `/content/` filtré. À envisager seulement si volume > 50 articles |

---

## Architecture de l'information

### Sections de la nouvelle page (ordre vertical)

```
┌──────────────────────────────────────────────────────┐
│  HERO (CTN-4)                                        │
│  Badge + titre + sous-titre + chiffre articles       │
├──────────────────────────────────────────────────────┤
│  PINNED (CTN-11, optionnel)                          │
│  1 article mis en avant, ratio 2/3, image + extrait  │
├──────────────────────────────────────────────────────┤
│  LATEST (CTN-3)                                      │
│  "Derniers articles" — 6 cartes en grid 3 colonnes   │
├──────────────────────────────────────────────────────┤
│  TRENDING (CTN-9, SHOULD)                            │
│  "Tendances 7 jours" — 5 cartes alignées avec icône  │
│  flamme + delta % vs semaine précédente              │
├──────────────────────────────────────────────────────┤
│  MOST READ (CTN-8, SHOULD)                           │
│  "Les plus lus 30 jours" — 6 cartes en grid          │
├──────────────────────────────────────────────────────┤
│  ALL ARTICLES (CTN-5)                                │
│  Chips de filtre par theme + grid de toutes les      │
│  cartes (sauf celles déjà mises en avant supra)      │
└──────────────────────────────────────────────────────┘
```

### Composant `<ArticleCard>` (CTN-2)

Carte unifiée réutilisée dans les 4 sections (Latest, Trending, Most Read, All). Variants via prop `size` :

- `size="hero"` (CTN-11 pinned) : ratio 2/3, image large à gauche, contenu à droite
- `size="grid"` (default) : carte verticale, image en haut, contenu en bas
- `size="row"` (CTN-9 trending) : ligne horizontale, image carrée à gauche, contenu à droite, badge "Tendance" + delta %

**Champs affichés** :

- Vignette Open Graph (CTN-10) ou fallback dégradé brand→accent
- Badges `themes` (1-3, validés par `src/lib/themes.ts`)
- Titre (h3, max 2 lignes, line-clamp)
- Description (max 2 lignes, line-clamp)
- Métadonnées : `dateModified`, durée de lecture estimée (calculée depuis le `wordCount` au build)
- (Si `size="row"` trending) : delta % en vert/rouge

Props `Readonly`, server-renderable, testable isolement.

### Composant `<ArticleThemeFilter>` (CTN-5)

Chips cliquables (client component avec `useState`) qui filtrent la liste `ALL ARTICLES` côté navigateur. Pas de re-fetch ni de re-render serveur. Chaque chip = une clé `themes` (tutorial, guide, reference, comparison, use-case, security, devsecops, etc.).

État initial : tous les articles visibles, aucun filtre actif. Cliquer un chip toggle son état. Plusieurs filtres actifs = OR logique (article affiché si **au moins un** de ses themes match).

---

## Source de stats (CTN-6 / CTN-7)

### Schéma `src/data/article-stats.json`

```json
{
  "generatedAt": "2026-05-19T00:00:00Z",
  "matomoPeriodDays": 30,
  "articles": [
    {
      "slug": "fuite-cle-api",
      "locale": "fr",
      "pageviewsLast30d": 1234,
      "pageviewsLast7d": 280,
      "pageviewsPrev7d": 210,
      "deltaPct": 33,
      "scrollDepth75Pct": 0.42
    }
  ]
}
```

### Script `scripts/refresh-article-stats.ts`

- Lit `MATOMO_API_URL` + `MATOMO_AUTH_TOKEN` depuis l'env
- Appelle l'endpoint `Actions.getPageUrls` pour `/fr/content/*` et `/en/content/*` sur 30 jours
- Pour chaque article, calcule `pageviewsLast7d`, `pageviewsPrev7d`, `deltaPct`
- Écrit `src/data/article-stats.json` avec la date de génération
- Idempotent : exécutable en local pour debug, ne dépend d'aucun état précédent

### Workflow `.github/workflows/weekly-article-stats.yml`

- Cron `0 8 * * 1` (lundi 8h UTC)
- Run le script avec secrets GH
- Si diff non vide → ouvre une **PR draft** vers `develop` titrée `chore(stats): weekly article stats refresh YYYY-MM-DD`
- Si pas de diff (rare) → log et exit

### Fallback PO

Si Matomo API indisponible ou si le PO veut overrider :

- `src/data/article-stats.override.json` (optionnel, gitkeep)
- Le code de la page priorise `override` sur `auto` quand il existe
- Permet un curated manuel temporaire

---

## Critères d'acceptation par story

### CTN-1 — Décision design tranchée + maquettes (2 SP)

- [ ] 2 maquettes Figma haute-fidélité (light + dark, 1440 + 768)
- [ ] Décision tracée dans `docs/epics/2026-05-content-redesign/decisions.md` (ou dans cet EPIC en annexe)
- [ ] Ordre des sections validé (cf. Architecture de l'information)
- [ ] Choix typographique aligné avec le design system existant (Jakarta + JetBrains Mono)
- [ ] Validation explicite PO

### CTN-2 — Composant `<ArticleCard>` (3 SP)

- [ ] Props `Readonly` : `article`, `size` (`"hero" | "grid" | "row"`), `delta?` (pour trending), `locale`
- [ ] 3 variants visuels rendus côté serveur (pas de client component)
- [ ] Image OG fallback dégradé si absente
- [ ] Durée de lecture calculée au build via `wordCount / 200` (200 mpm)
- [ ] `aria-label` accessible et liens cliquables sur toute la carte
- [ ] Tests unitaires : rendu des 3 variants, fallback image, calcul durée de lecture, propagation locale
- [ ] Couverture ≥ 80 %

### CTN-3 — Section "Derniers articles" (2 SP)

- [ ] Top 6 articles triés par `dateModified` desc puis `datePublished` desc
- [ ] Grid 1/2/3 colonnes (mobile / tablette / desktop)
- [ ] H2 cornerstone "Derniers articles" + lien "Voir tout" qui ancre la section ALL ARTICLES
- [ ] Test E2E : 6 cartes rendues sur `/fr/content/` et `/en/content/`

### CTN-4 — Refonte hero + intro (2 SP)

- [ ] Hero : suppression du double paragraphe générique
- [ ] Affichage du nombre total d'articles (via `countAllArticles()`) + nombre par theme principal
- [ ] CTA secondaire : "Filtrer par thème" qui ancre la section ALL ARTICLES
- [ ] Ton aligné avec CLAUDE.md (pas de tic IA, pas de "Plongez dans")

### CTN-5 — Filtres par theme (3 SP)

- [ ] Chips cliquables alignés sur les 12 themes définis dans `src/lib/themes.ts`
- [ ] Filtrage côté client (`useState` simple, pas de URL state pour le MVP)
- [ ] Compteur dynamique "X articles" qui se met à jour
- [ ] État vide géré si aucun article ne matche les filtres actifs
- [ ] Tests unitaires : toggle d'un chip, OR logique sur plusieurs chips, état vide
- [ ] Accessibilité : `aria-pressed` sur les chips, focus visible

### CTN-6 — Script `refresh-article-stats.ts` (3 SP)

- [ ] Type-safe TypeScript, output JSON validé contre un type `ArticleStatsFile`
- [ ] Gestion d'erreur explicite (env manquant, timeout API, JSON malformé)
- [ ] Logs structurés stdout (parsable par CI)
- [ ] Tests unitaires sur la transformation Matomo → JSON (mocks API)
- [ ] `npm run refresh:article-stats` exposé dans `package.json`

### CTN-7 — Workflow hebdo (2 SP)

- [ ] Cron `0 8 * * 1` (lundi 8h UTC)
- [ ] Secrets : `MATOMO_API_URL`, `MATOMO_AUTH_TOKEN`
- [ ] PR draft auto-créée avec body : période couverte, articles avec delta > 50 % flaggés en haut
- [ ] Labels `chore` + `stats` sur la PR
- [ ] Cas no-diff géré gracieusement (pas d'échec CI)

### CTN-8 — Section "Les plus lus" (2 SP)

- [ ] Top 6 articles par `pageviewsLast30d` dans `article-stats.json`
- [ ] Source affichée discrètement : "Stats Matomo, mises à jour le YYYY-MM-DD"
- [ ] Fallback gracieux si `article-stats.json` absent ou vide : section cachée
- [ ] H2 "Les plus lus ces 30 derniers jours"

### CTN-9 — Section "Tendances 7 derniers jours" (1 SP)

- [ ] Top 5 articles par `deltaPct` desc (seuil minimum : `pageviewsLast7d` > 20 pour éviter le bruit)
- [ ] Variant `<ArticleCard size="row">` avec badge "Tendance" + icône `Flame` lucide + delta % en vert
- [ ] H2 "Tendances cette semaine"
- [ ] Fallback gracieux si moins de 5 articles passent le seuil (section cachée ou réduite)

### CTN-10 — Vignettes Open Graph (2 SP)

- [ ] Image OG affichée dans `<ArticleCard>` quand disponible (résolution via `app/[locale]/content/[slug]/opengraph-image.tsx`)
- [ ] Fallback dégradé brand→accent si absente, avec premier mot du titre en typographie display
- [ ] `loading="lazy"` sur toutes les images, `decoding="async"`
- [ ] CLS = 0 garanti (aspect-ratio CSS)

### CTN-11 — Pinned editorial (1 SP)

- [ ] `src/data/pinned-article.ts` exporte un slug et une locale
- [ ] Article épinglé exclu des autres sections (Latest, Most Read, etc.) pour éviter la double présence
- [ ] Fallback : si pinned slug invalide ou absent, la section disparaît proprement

### CTN-12 — E2E + visual regression (1 SP)

- [ ] `e2e/content-index.spec.ts` : parité FR + EN, rendu des 5 sections, filtres fonctionnels, lien vers premier article
- [ ] Visual regression : ajout de `/fr/content/` et `/en/content/` (light + dark) aux 20 routes existantes (cf. RG-25)
- [ ] Lighthouse ≥ 90 sur les 4 métriques pour `/fr/content/` mobile
- [ ] axe-core 0 violation critical/serious

---

## Métriques de succès (J+60 après merge complet)

| Métrique | Valeur cible | Source |
|----------|--------------|--------|
| Pages/session sur visiteurs entrants par `/content/` | +30 % vs baseline | Matomo |
| Bounce rate `/content/` | -15 % vs baseline | Matomo |
| CTR moyen des cartes (clic sur carte vers article) | ≥ 35 % | Matomo event `article_card_click` |
| Position GSC `/content/` sur "articles claude code" | Top 10 | GSC |
| Impressions GSC `/content/` | +50 % vs baseline | GSC |
| Scroll-depth 75 % sur `/content/` | ≥ 60 % | Matomo (déjà tracké) |

---

## Risques & mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Matomo API indisponible au build | Sections Trending et Most Read cachées | Fallback gracieux : section absente si `article-stats.json` invalide. Page reste fonctionnelle |
| Données Matomo bruyantes (articles à 5 vues qui montent à 10) | Faux signaux de tendance | Seuil minimum `pageviewsLast7d > 20` sur CTN-9 |
| Conflit avec EPIC Tuto-pages article-shell | Aucun (pas de fichier partagé) | Confirmé : `app/[locale]/content/page.tsx` ≠ `app/[locale]/{section}/[slug]/page.tsx` |
| Vignettes OG manquantes sur certains articles anciens | UX dégradée sur ces cartes | Fallback dégradé brand→accent + premier mot titre, ce qui reste visuellement propre |
| Filtre client-side `<ArticleThemeFilter>` pas indexé par Google | Aucun (la page liste déjà tous les articles côté SSR) | Le filtre est progressive enhancement, le contenu reste indexable |
| CWV : 4-5 sections + images peut alourdir le LCP | Score Lighthouse baisse | Lazy loading des images sous le pli + critical CSS pour le hero |

---

## Coordination avec les autres EPICs

| EPIC | Relation |
|------|----------|
| Refonte premium 2026-05 | Fournit les composants éditoriaux (`SectionHeading`, `Callout`, etc.) réutilisables |
| Tuto-pages article-shell | Aucun chevauchement de fichiers, peut tourner en parallèle |
| Polish heros sections | Le hero de `/content/` peut être livré en réutilisant le pattern défini par cet EPIC s'il avance plus vite |
| SEO/GEO mai 2026 | Bénéficie directement : nouvelle structure cluster + signal de fraîcheur explicite |
| Stack design Claude Code | Aucun lien |

---

## Definition of Done globale

- [ ] Toutes les stories MUST + au moins 2 SHOULD mergées sur `develop` puis `main`
- [ ] `npm run lint && type-check && test` au vert
- [ ] `npm run build` génère bien `/fr/content/` et `/en/content/` sans erreur
- [ ] Lighthouse ≥ 90 sur les 4 métriques pour `/fr/content/` mobile + desktop
- [ ] SonarQube Quality Gate OK, 0 bug, 0 BLOCKER/CRITICAL
- [ ] Couverture tests ≥ 80 % maintenue
- [ ] E2E parité FR + EN au vert
- [ ] Visual regression validée sur `/fr/content/` et `/en/content/` (light + dark)
- [ ] axe-core 0 violation critical/serious
- [ ] Validation manuelle FR + EN
- [ ] `dateModified` MAJ dans `SITE_PAGES` (`src/data/site-pages.ts`)
- [ ] PR description liste les sections livrées et un avant/après screenshot

---

## Planning indicatif

| Sprint | Durée | Stories | SP |
|--------|-------|---------|----|
| Sprint 1 | 2 semaines | CTN-1, CTN-2, CTN-3, CTN-4, CTN-5 | 12 |
| Sprint 2 | 2 semaines | CTN-6, CTN-7, CTN-8, CTN-9 | 8 |
| Sprint 3 | 1 semaine | CTN-10, CTN-11, CTN-12 | 4 |
| **Total** | **5 semaines** | **12 stories** | **24 SP** |

---

## Annexe A — Inspirations design

| Source | Élément retenu |
|--------|----------------|
| The Verge | Sections claires Latest / Trending / Featured |
| Stripe Press | Typographie display + cartes sobres + fond off-white |
| GitHub Trending | Indicateur `delta %` discret mais lisible |
| Linear Blog | Cartes verticales avec image + 2 lignes de description |
| Vercel Blog | Filtre par catégorie minimaliste (chips, pas de dropdown) |

---

## Annexe B — Questions ouvertes (à trancher en kick-off)

1. **Durée de lecture** : afficher en minutes (`5 min`) ou en mots (`1200 mots`) ?
2. **Filtres themes** : OR logique (article matche au moins un theme actif) ou AND logique (matche tous) ? **Default : OR** plus pragmatique pour un volume de 16 articles.
3. **URL state pour les filtres** : `?theme=tutorial,security` partageable ou pas ? **Default : non pour le MVP**, à ajouter dans un EPIC suite si la demande remonte.
4. **Pinned editorial CTN-11** : la sélection est-elle PO-only ou peut-elle suivre une logique automatique (l'article au plus haut scroll-depth des 30 derniers jours, par exemple) ?
5. **Couleurs de delta tendance** : rouge négatif visible ou seulement le positif vert pour éviter de pointer du doigt un article qui décroche ?
