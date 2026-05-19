# EPIC : Refonte de la page `/content` (vitrine éditoriale)

> Source : demande PO 2026-05-19 — la page `/content/` est aujourd'hui une liste plate sans hiérarchie, qui ne donne pas envie de lire.
> Date d'ouverture : 2026-05-19
> Effort estimé : **25 SP** (12 stories sur 3 sprints, ~5 semaines) — post-revue UX + SEO
> Priorité : Backlog (en parallèle de l'EPIC Tuto-pages article-shell, pas de chevauchement de fichiers)
> Branche cible : `feat/content-page-redesign` (puis sous-branches par story `feat/ctn-N-...`)
> Pré-requis : aucun bloquant — Matomo cookieless déjà en place avec scroll-depth (cf. SEO-8 / SEO-9 livrés), `getMostRecentArticles` déjà en place
> Owner : Maxime BELLET
> Statut : **validé par 2 agents (UX + SEO/technique) le 2026-05-19, prêt pour Sprint 1.** Cf. Annexe C pour les décisions de revue intégrées.

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

> **Décision de revue (cf. Annexe C)** : CTN-3 et CTN-11 **fusionnées** en une seule story de Sprint 1 (Latest + Pinned indissociables, mêmes critères d'exclusion). CTN-14 (nav sticky inter-sections) **remontée en Sprint 1**. CTN-13 (URL state des filtres) **ajoutée en Sprint 2**, reclassée de WON'T à SHOULD après revue UX.

### MUST HAVE (13 SP, Sprint 1) — Refonte structurelle + Latest+Pinned + Nav sticky

> Le but du Sprint 1 : sortir une vitrine déjà supérieure à l'existante **sans dépendre de données analytics**. Latest seul (calculable depuis le frontmatter) couvre déjà 70 % de la valeur perçue. Pinned mutualisé pour éviter la duplication visuelle.

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| CTN-1 | Décision design tranchée + maquettes Figma (light + dark, 1440 + 768 + **375 mobile**) | 2 | doc + Figma |
| CTN-2 | Composant `<ArticleCard>` réutilisable (3 variants, event Matomo, aspect-ratio CSS) | 3 | `src/components/ui/ArticleCard.tsx` |
| CTN-3 | Section combinée "Pinned + Latest" au-dessus du pli (Pinned `hero` à gauche + 2-3 Latest `grid` à droite). Le reste de Latest sous le pli. Cascade d'exclusion explicite. | 3 | `src/app/[locale]/content/page.tsx` |
| CTN-4 | Refonte hero + intro + `BreadcrumbList` + `CollectionPage` JSON-LD étendu | 2 | `src/app/[locale]/content/page.tsx` |
| CTN-5 | Section "Tous les articles" filtrable par `themes` (chips groupés Type / Domaine, useMemo, aria-live) | 3 | `src/app/[locale]/content/page.tsx` + `src/components/ui/ArticleThemeFilter.tsx` |
| CTN-14 | Nav sticky inter-sections (TOC latérale xl + tab bar mobile entre Latest/Trending/Most read/Tous) | 1 | `src/components/layout/ContentSectionsNav.tsx` |

### SHOULD HAVE (9 SP, Sprint 2) — Sections data-driven (trending + most read) + URL state

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| CTN-6 | Script `scripts/refresh-article-stats.ts` qui pull Matomo API → `src/data/article-stats.json` (idempotent, source datée) | 3 | `scripts/`, `src/data/` |
| CTN-7 | Workflow GH Actions hebdo `weekly-article-stats.yml` qui ouvre une PR draft avec MAJ JSON | 2 | `.github/workflows/` |
| CTN-8 | Section "Les plus lus 30 derniers jours" (top 6 + `ItemList` JSON-LD + date collecte visible) | 2 | `src/app/[locale]/content/page.tsx` |
| CTN-9 | Section "Tendances 7 derniers jours" (delta > 0 uniquement, mobile = grid + badge overlay, `ItemList`) | 1 | `src/app/[locale]/content/page.tsx` |
| CTN-13 | URL state filtres `?theme=tutorial,security` (partage Discord/Twitter) | 1 | `src/components/ui/ArticleThemeFilter.tsx` |

### COULD HAVE (3 SP, Sprint 3) — Polish + variations

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| CTN-10 | Vignettes Open Graph par article (loading eager + fetchpriority sur Pinned uniquement) | 2 | `src/components/ui/ArticleCard.tsx` |
| CTN-12 | E2E `e2e/content-index.spec.ts` + visual regression + tests JSON-LD + axe-core + keyboard-only | 1 | `e2e/`, snapshots |

> Note : CTN-11 (Pinned isolée) **supprimée** — fusionnée dans CTN-3 (cf. Annexe C, retour UX).

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Système de notation utilisateur (étoiles, likes) | Impossible sur un site statique sans backend. Ouvrirait un EPIC infra dédié si demande confirmée |
| W2 | Commentaires sur les articles | Idem, et conflit avec la stratégie "no third-party tracking" |
| W3 | Newsletter / abonnement RSS premium | EPIC dédié à ouvrir si confirmé |
| W4 | Carrousel auto-rotatif sur le hero | Pattern UX daté, pénalisant CWV (CLS) |
| W5 | Page de tag par `theme` (`/content/theme/tutorial/`) | Risque de duplication SEO avec `/content/` filtré. **Trigger de réouverture : > 50 articles totaux ET ≥ 8 articles par theme principal** (en dessous, page mince pénalisée) |

---

## Architecture de l'information

### Sections de la nouvelle page (ordre vertical, post-revue UX)

```
┌──────────────────────────────────────────────────────┐
│  HERO (CTN-4)                                        │
│  Badge + titre + sous-titre + chiffre articles +     │
│  CTA "Filtrer par thème" (smooth scroll vers All)    │
├──────────────────────────────────────────────────────┤
│  NAV STICKY (CTN-14)                                 │
│  Tab bar mobile / TOC latérale xl : ancres vers      │
│  Latest | Trending | Most read | Tous                │
├──────────────────────────────────────────────────────┤
│  PINNED + LATEST COMBINÉS (CTN-3)                    │
│  Pinned `hero` à gauche (2/3) + 2-3 Latest `grid` à  │
│  droite (1/3). Sur mobile, Pinned full-width au-     │
│  dessus, Latest dessous. Reste de Latest dans grid 3 │
│  colonnes sous cette rangée.                         │
├──────────────────────────────────────────────────────┤
│  TRENDING (CTN-9, SHOULD)                            │
│  "Tendances 7 jours" — 5 cartes alignées avec icône  │
│  flamme + delta % positif uniquement. Sur mobile,    │
│  variant `row` retombe sur `grid` avec badge overlay │
├──────────────────────────────────────────────────────┤
│  MOST READ (CTN-8, SHOULD)                           │
│  "Les plus lus 30 jours" — 6 cartes en grid          │
├──────────────────────────────────────────────────────┤
│  ALL ARTICLES (CTN-5)                                │
│  Chips groupés Type + Domaine + grid de toutes les   │
│  cartes (cascade d'exclusion appliquée)              │
└──────────────────────────────────────────────────────┘
```

### Cascade d'exclusion des doublons

Sur 16 articles, un même article pourrait apparaître 4 fois (Pinned + Latest + Trending + Most read + All). Pour éviter le bruit visuel, **règle de cascade obligatoire** : un article qui figure dans une section supérieure est exclu des suivantes.

Ordre de priorité (du plus haut au plus bas) : **Pinned > Trending > Most read > Latest > All**.

Implémentation : la page calcule au build un `Set<slug>` initial vide, puis itère sur chaque section dans l'ordre ci-dessus. Pour chaque section, on prend les top N candidats qui ne sont pas déjà dans le `Set`, on les ajoute au `Set` après les avoir rendus. La section "All articles" filtre les articles déjà dans le `Set`.

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

- [ ] **3 maquettes** Figma haute-fidélité (light + dark, **375 mobile + 768 tablette + 1440 desktop**)
- [ ] Décision tracée dans `docs/epics/2026-05-content-redesign/decisions.md`
- [ ] Ordre des sections validé (cf. Architecture de l'information, avec layout combiné Pinned+Latest au-dessus du pli)
- [ ] Choix typographique aligné avec le design system existant (Jakarta + JetBrains Mono)
- [ ] Rythme vertical entre sections documenté (alternance `bg-page` / `bg-surface`, padding 80-96px)
- [ ] **États interactifs documentés** (hover, focus-visible, active, filtré, vide)
- [ ] **Baseline Matomo + GSC capturée et consignée** dans `docs/epics/2026-05-content-redesign/baseline.md` (pages/session, bounce, scroll-depth, impressions GSC `/content/`)
- [ ] Validation explicite PO

### CTN-2 — Composant `<ArticleCard>` (3 SP)

- [ ] Props `Readonly` : `article`, `size` (`"hero" | "grid" | "row"`), `delta?` (pour trending), `locale`
- [ ] 3 variants visuels rendus côté serveur (pas de client component)
- [ ] **Variant `row` sur breakpoint < md : retombe sur `grid` avec badge Trending en overlay coin haut-droit**
- [ ] Image OG fallback dégradé brand→accent + premier mot du titre en typo display si OG absente
- [ ] **`aspect-ratio` CSS fixé** (16/9 ou 4/3) pour CLS = 0 garanti
- [ ] `loading="lazy"` + `decoding="async"` sur images sous le pli ; `loading="eager"` + `fetchpriority="high"` sur image Pinned uniquement (CTN-3)
- [ ] **Durée de lecture en minutes** ("5 min de lecture"), calculée via `wordCount / 200` (200 mpm) ; **les blocs de code comptent demi-vitesse** pour ne pas sous-estimer les guides techniques
- [ ] **`dateModified` au format relatif < 14 j** ("il y a 3 jours") + absolu en `title` tooltip
- [ ] **Description tronquée à max 120 caractères** sur la carte (différente du meta-description complet de l'article)
- [ ] Titre tronqué via `line-clamp-2` avec `title` HTML pour révélation au hover
- [ ] **Event Matomo `article_card_click`** émis au clic, label = slug de l'article (pour métrique CTR ≥ 35 %)
- [ ] `aria-label` accessible, liens cliquables sur toute la carte, focus-visible distinct du hover
- [ ] Flamme `Flame` lucide (variant `row`) marquée `aria-hidden="true"`
- [ ] Respect de `prefers-reduced-motion` sur les transitions hover
- [ ] Tests unitaires : rendu des 3 variants, fallback image, calcul durée de lecture, propagation locale, format date relative
- [ ] Couverture ≥ 80 %

### CTN-3 — Section combinée "Pinned + Latest" (3 SP) — fusion CTN-3 + CTN-11

- [ ] Layout combiné au-dessus du pli : **Pinned `hero` variant à gauche (2/3 width) + 2-3 Latest `grid` variant à droite (1/3 width)** sur desktop
- [ ] Sur mobile : Pinned full-width au-dessus, Latest en grid 1 colonne dessous
- [ ] Reste de Latest (top 6 total, donc 3 cartes restantes après les 2-3 affichées en haut) dans grid 3 colonnes sous la première rangée
- [ ] Latest tri : `dateModified` desc puis `datePublished` desc
- [ ] Pinned : slug + locale lus depuis `src/data/pinned-article.ts` (PO-only, **rappel mensuel** en commentaire `// review monthly`)
- [ ] **Cascade d'exclusion appliquée** : Pinned exclu de Latest/Trending/Most read/All. Si pinned slug invalide → Pinned masqué, Latest prend 6 cartes au lieu de 4-5
- [ ] **Image Pinned servie avec `loading="eager"` + `fetchpriority="high"`** pour optimiser LCP
- [ ] H2 "À la une" pour le bloc combiné (ou pas de H2 si Pinned absent, juste H2 "Derniers articles")
- [ ] Lien "Voir tout" qui ancre vers section ALL ARTICLES (smooth scroll + focus auto sur premier chip filtre)
- [ ] Fallback gracieux : si moins de 6 articles disponibles, afficher ce qu'il y a (pas de placeholder)
- [ ] Test E2E : 6 cartes Latest rendues sur `/fr/content/` et `/en/content/`, Pinned correctement exclu si défini

### CTN-4 — Refonte hero + intro + structured data (2 SP)

- [ ] Hero : suppression du double paragraphe générique
- [ ] Affichage du nombre total d'articles (via `countAllArticles()`) + **liste des thèmes couverts en sous-titre** (ex: "Sécurité, architecture, DevSecOps, performance — 16 guides indépendants") — signal GEO pour les LLM
- [ ] CTA secondaire : "Filtrer par thème" qui ancre la section ALL ARTICLES (smooth scroll + focus auto sur premier chip)
- [ ] **`BreadcrumbList` JSON-LD ajouté** via `createBreadcrumbSchema()` (Accueil > Contenus éditoriaux)
- [ ] **`CollectionPage` JSON-LD étendu** avec `dateModified` (max des articles) et `hasPart` (liste des URLs des articles affichés)
- [ ] Ton aligné avec CLAUDE.md (pas de tic IA, pas de "Plongez dans")

### CTN-5 — Filtres par theme (3 SP)

- [ ] Chips cliquables alignés sur les 12 themes définis dans `src/lib/themes.ts`, **groupés en 2 lignes** : ligne 1 "Type" (5 chips : tutorial, guide, reference, comparison, use-case), ligne 2 "Domaine" (7 chips : security, devsecops, architecture, performance, tooling, productivity, migration)
- [ ] Filtrage côté client (`useState` simple, pas de URL state pour le MVP — voir CTN-13 Sprint 2)
- [ ] **OR logique entre filtres actifs** (article visible si au moins un theme match) — décision tracée
- [ ] **`useMemo` sur la liste filtrée** pour éviter un re-render O(n) à chaque toggle chip
- [ ] **État initial = état serveur identique** : pas de `useEffect` qui masque puis révèle (éviter mismatch SSR/client)
- [ ] Compteur dynamique "X articles" qui se met à jour, annoncé via `aria-live="polite"`
- [ ] **Copy de l'état vide** explicite : "Aucun article ne correspond." + CTA `[Réinitialiser les filtres]`
- [ ] Tests unitaires : toggle d'un chip, OR logique sur plusieurs chips, état vide, useMemo invalidation
- [ ] Accessibilité : `aria-pressed` sur chips, `role="group"` + `aria-label="Filtrer par thème"` sur conteneur, focus-visible distinct du hover, **`Esc` réinitialise tous les filtres**, navigation `Tab` / `Shift+Tab` entre chips
- [ ] **Scroll position préservée** relative à l'ancre `#all-articles` lors d'un toggle (pas de scroll-to-top intempestif)

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
- [ ] **Cascade d'exclusion appliquée** : articles déjà dans Pinned ou Trending exclus
- [ ] Source affichée discrètement : "Stats Matomo, mises à jour le YYYY-MM-DD"
- [ ] **`ItemList` JSON-LD** avec les 6 articles (`position` + `url` + `name`) via nouvelle fonction `createItemListSchema()` dans `lib/structured-data.ts`
- [ ] Fallback gracieux si `article-stats.json` absent ou vide : **section absente du DOM** (pas juste cachée visuellement)
- [ ] H2 "Les plus lus ces 30 derniers jours"

### CTN-9 — Section "Tendances 7 derniers jours" (1 SP)

- [ ] Top 5 articles par `deltaPct` desc, **filtre `deltaPct > 0` uniquement** (pas de rouge négatif en vitrine publique)
- [ ] Seuil minimum : `pageviewsLast7d` > 20 pour éviter le bruit
- [ ] **Cascade d'exclusion appliquée** : articles déjà dans Pinned exclus
- [ ] Variant `<ArticleCard size="row">` avec badge "Tendance" + icône `Flame` lucide (`aria-hidden`) + delta % en vert
- [ ] **Sur breakpoint < md, variant `row` se rend identiquement à `grid`** avec badge Trending en overlay coin haut-droit
- [ ] **`ItemList` JSON-LD** (cf. CTN-8)
- [ ] **Source affichée discrètement** : "Stats Matomo, mises à jour le YYYY-MM-DD" (alignement avec CTN-8)
- [ ] H2 "Tendances cette semaine"
- [ ] Fallback gracieux si moins de 5 articles passent le seuil : section masquée (absente du DOM) ou réduite à ce qu'il y a

### CTN-10 — Vignettes Open Graph (2 SP)

- [ ] Image OG affichée dans `<ArticleCard>` quand disponible (résolution via `app/[locale]/content/[slug]/opengraph-image.tsx`)
- [ ] Fallback dégradé brand→accent si absente, avec premier mot du titre en typographie display ; **contraste WCAG AA 4.5:1 minimum vérifié sur le texte du fallback**
- [ ] Dimensions servies : 1200×630 pour `size="hero"` (Pinned), **600×315 pour `size="grid"` et `size="row"`** (éviter de servir un OG 1200 dans une carte 300px)
- [ ] `loading="lazy"` sur toutes les images, `decoding="async"` ; **exception image Pinned `loading="eager"` + `fetchpriority="high"`** (cf. CTN-3)
- [ ] CLS = 0 garanti (aspect-ratio CSS)

### CTN-13 — URL state des filtres (1 SP) — Sprint 2 SHOULD

> Reclassée de WON'T à SHOULD après revue UX. Permet le partage de lien filtré sur Discord/Twitter sans coût SEO (le filtrage reste client-side, l'URL n'expose pas de nouvelles routes statiques).

- [ ] Parsing du paramètre `?theme=tutorial,security` au montage de `<ArticleThemeFilter>`
- [ ] Mise à jour de l'URL via `useSearchParams` + `replaceState` (pas de scroll-to-top)
- [ ] **Aucun appel à `generateStaticParams` pour pré-générer les combinaisons** (incompatible avec `output: 'export'`, risque d'explosion combinatoire)
- [ ] URL vide = état initial (aucun filtre)
- [ ] Compatibilité : `?theme=` (vide) = équivalent à URL sans paramètre
- [ ] Tests : URL parsée correctement, état appliqué côté client après hydratation, mise à jour bidirectionnelle (clic chip → URL mise à jour, navigation arrière → état restauré)
- [ ] **Note SEO** : la page reste indexable telle quelle (état initial = tous les articles visibles) ; les URL avec paramètres ne sont pas dans le sitemap

### CTN-14 — Nav sticky inter-sections (1 SP) — Sprint 1 MUST

> Améliore drastiquement le scroll-path sur une page longue (5-6 sections).

- [ ] **Sur xl** : TOC latérale flottante (rail droit) avec ancres vers Latest / Trending / Most read / Tous, item actif marqué via IntersectionObserver
- [ ] **Sur mobile/tablette** : tab bar horizontale sticky en haut de page (sous le hero), 4 boutons d'ancre
- [ ] Smooth scroll au clic, focus visible (clavier), `aria-current="location"` sur l'item actif
- [ ] Composant `src/components/layout/ContentSectionsNav.tsx`, props `Readonly { sections: string[] }`
- [ ] Tests unitaires : rendu des 4 sections, current item changing on scroll (mock IntersectionObserver)
- [ ] Test E2E : clic sur "Trending" scrolle bien jusqu'à la section, retour via clic sur "Latest" idem

### CTN-12 — E2E + visual regression + tests SEO (1 SP)

- [ ] `e2e/content-index.spec.ts` : parité FR + EN, rendu des sections, filtres fonctionnels (toggle, OR logique, état vide), lien vers premier article, navigation sticky inter-sections
- [ ] **Test JSON-LD** : présence et validité de `CollectionPage` + `BreadcrumbList` + `ItemList` (Trending, Most read) dans `script[type="application/ld+json"]`
- [ ] **Test OG tags** : `og:image`, `og:title`, `og:description` présents sur `/fr/content/` et `/en/content/`
- [ ] **Test fallback sections** : simuler `article-stats.json` absent → sections Trending et Most read absentes du DOM (pas juste cachées)
- [ ] **Test `aria-pressed`** sur chips après clic (E2E, pas seulement unitaire)
- [ ] **Test keyboard-only complet** : tab depuis hero jusqu'à premier article via filtre, Esc reset les filtres, navigation sticky accessible
- [ ] Test mobile portrait + landscape sur Trending (variant fallback vers `grid`)
- [ ] Visual regression : ajout de `/fr/content/` et `/en/content/` (light + dark) aux 20 routes existantes (cf. RG-25)
- [ ] Lighthouse ≥ 90 sur les 4 métriques pour `/fr/content/` mobile + desktop
- [ ] **INP p75 < 200 ms** sur clic chip (mesuré Playwright Lab Mode)
- [ ] **CLS < 0.05** sur Lighthouse mobile
- [ ] axe-core 0 violation critical/serious

---

## Métriques de succès (J+60 après merge complet)

**Baseline obligatoire** : valeurs capturées au jour du merge CTN-1 et consignées dans `docs/epics/2026-05-content-redesign/baseline.md`. Sans baseline datée, les métriques ne sont pas falsifiables.

| Métrique | Valeur cible | Source |
|----------|--------------|--------|
| Pages/session sur visiteurs entrants par `/content/` | +30 % vs baseline documentée | Matomo |
| Bounce rate `/content/` | -15 % vs baseline documentée | Matomo |
| CTR moyen des cartes (clic sur carte vers article) | ≥ 35 % | Matomo event `article_card_click` (label = slug) |
| Position GSC sur **≥ 3 requêtes longue traîne** liées aux thèmes principaux | Top 10 | GSC |
| Impressions GSC `/content/` | +50 % vs baseline documentée | GSC |
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
| **SSR/client mismatch sur `<ArticleThemeFilter>`** | Flash + dégrade indexation | État initial hydraté = état serveur (aucun filtre actif), pas de `useEffect` qui masque puis révèle |
| **Duplication de signal entre sections** | Article apparaît 4 fois → bruit visuel | Cascade d'exclusion obligatoire Pinned > Trending > Most read > Latest > All |
| **Article viral sur Matomo mais déindexé GSC** | "Trending" affiche un faux signal | Script CTN-6 logue une alerte si `pageviewsLast7d > 50` mais article non modifié depuis > 90 j |
| CWV : 4-5 sections + images peut alourdir le LCP | Score Lighthouse baisse | Lazy loading des images sous le pli + `loading="eager"` + `fetchpriority="high"` sur image Pinned uniquement + critical CSS pour le hero |

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

## Planning indicatif (post-revue)

> CTN-11 supprimée (fusion dans CTN-3), CTN-13 ajoutée Sprint 2, CTN-14 ajoutée Sprint 1. Total stories : 12 → **12** (1 supprimée, 2 ajoutées = +1 net). Total SP : 24 → **25**.

| Sprint | Durée | Stories | SP |
|--------|-------|---------|----|
| Sprint 1 | 2 semaines | CTN-1, CTN-2, CTN-3 (fusionnée avec CTN-11), CTN-4, CTN-5, CTN-14 | 13 |
| Sprint 2 | 2 semaines | CTN-6, CTN-7, CTN-8, CTN-9, CTN-13 | 9 |
| Sprint 3 | 1 semaine | CTN-10, CTN-12 | 3 |
| **Total** | **5 semaines** | **12 stories** | **25 SP** |

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

## Annexe B — Questions ouvertes (TRANCHÉES après revue UX + SEO 2026-05-19)

1. **Durée de lecture** : ✅ **Minutes** (`5 min de lecture`). Convention Medium/Substack/Vercel Blog. Format affiché sur la carte, `wordCount` en `title` tooltip. Blocs de code comptent demi-vitesse.
2. **Filtres themes** : ✅ **OR logique** (article visible si ≥ 1 theme match). Avec 16 articles, AND tue trop souvent le résultat. Repasser sur AND quand volume > 50 ET avec UX "resserrer" explicite.
3. **URL state pour les filtres** : ✅ **OUI, Sprint 2 (CTN-13)**. Reclassée de WON'T à SHOULD après revue UX (gain partage Discord/Twitter, coût marginal). Pas d'impact SEO car pas de `generateStaticParams` sur les combinaisons.
4. **Pinned editorial** : ✅ **PO-only** via `src/data/pinned-article.ts` avec rappel mensuel (`// review monthly`). Auto (scroll-depth max) écarté : effet boule de neige + perte de la dimension éditoriale.
5. **Couleurs delta tendance** : ✅ **Vert positif uniquement** (filtre `deltaPct > 0`). Gris pour 0, badge masqué pour négatif. Pas de rouge en vitrine publique (auto-stigmatisation d'article).

---

## Annexe C — Décisions de revue (intégrées au corps de l'EPIC)

> EPIC revu le 2026-05-19 par 2 agents en parallèle :
>
> - **Agent UX** (`ux-designer`) : architecture de l'information, composants, hiérarchie visuelle, mobile, accessibilité.
> - **Agent SEO + technique** (`code-reviewer`) : structured data, maillage, CWV, indexation, GEO, métriques.
>
> Les corrections structurelles ont été directement intégrées dans le corps de l'EPIC (Priorisation MoSCoW, Architecture de l'information, Critères d'acceptation, Annexe B, Métriques, Risques). Cette annexe trace les retours pour faciliter la relecture.

### C.1 — Retours UX appliqués

| Décision | Origine | Section impactée |
|----------|---------|------------------|
| **Fusion CTN-3 + CTN-11** : Latest et Pinned indissociables (exclusion mutuelle + layout combiné au-dessus du pli) | Agent UX | Priorisation MoSCoW + CTN-3 |
| **CTN-14 ajoutée** : nav sticky inter-sections (TOC xl + tab bar mobile) | Agent UX | Priorisation MoSCoW + critère CTN-14 |
| **Cascade d'exclusion explicite** Pinned > Trending > Most read > Latest > All | Agent UX | Architecture de l'information |
| **Variant `row` Trending fallback `grid` sur mobile** avec badge overlay | Agent UX | CTN-2 + CTN-9 |
| **Chips themes groupés** Type (5) + Domaine (7) au lieu de 12 d'un coup | Agent UX | CTN-5 |
| **État vide explicite** : "Aucun article ne correspond. [Réinitialiser]" | Agent UX | CTN-5 |
| **`dateModified` format relatif < 14 j** + absolu en `title` tooltip | Agent UX | CTN-2 |
| **`wordCount` pondéré** pour blocs de code (demi-vitesse) | Agent UX | CTN-2 |
| **Maquette 375 mobile** ajoutée à CTN-1 (pas seulement 768) | Agent UX | CTN-1 |
| **`Esc` réinitialise filtres** + `aria-live` polite + `role="group"` | Agent UX | CTN-5 |
| **Scroll position préservée** après toggle filtre (ancre `#all-articles`) | Agent UX | CTN-5 |
| **CTA hero "Filtrer par thème"** : smooth scroll + focus auto sur premier chip | Agent UX | CTN-4 |
| **Rappel mensuel Pinned** : commentaire `// review monthly` dans `pinned-article.ts` | Agent UX | CTN-3 |
| **Stories WON'T : trigger réouverture W5** > 50 articles ET ≥ 8 par theme | Agent UX | WON'T HAVE |

### C.2 — Retours SEO + technique appliqués

| Décision | Origine | Section impactée |
|----------|---------|------------------|
| **`BreadcrumbList` JSON-LD ajouté** via `createBreadcrumbSchema()` | Agent SEO | CTN-4 |
| **`CollectionPage` JSON-LD étendu** avec `dateModified` + `hasPart` (URLs articles) | Agent SEO | CTN-4 |
| **`ItemList` JSON-LD** sur Trending et Most read (nouvelle fonction `createItemListSchema()`) | Agent SEO | CTN-8 + CTN-9 |
| **Description carte tronquée à 120 char** (différenciation meta-description) | Agent SEO | CTN-2 |
| **Event Matomo `article_card_click`** label = slug | Agent SEO | CTN-2 (métrique CTR) |
| **CWV explicites** : INP p75 < 200 ms, CLS < 0.05 | Agent SEO | CTN-12 |
| **`useMemo` sur liste filtrée** pour éviter re-render O(n) | Agent SEO | CTN-5 |
| **Image Pinned `loading="eager"` + `fetchpriority="high"`** pour LCP | Agent SEO | CTN-3 + CTN-10 |
| **Dimensions OG distinctes** : 1200×630 hero, 600×315 grid/row | Agent SEO | CTN-10 |
| **SSR/client mismatch évité** sur `<ArticleThemeFilter>` (état initial = serveur) | Agent SEO | CTN-5 + Risques |
| **Source date affichée** alignée CTN-8 ↔ CTN-9 | Agent SEO | CTN-9 |
| **Liste thèmes en sous-titre hero** (signal GEO pour LLM) | Agent SEO | CTN-4 |
| **Section absente du DOM (pas cachée)** si `article-stats.json` manquant | Agent SEO | CTN-8 + CTN-9 |
| **Test E2E JSON-LD + OG + fallback sections + aria-pressed + keyboard-only** | Agent SEO | CTN-12 |
| **Baseline Matomo + GSC documentée** au merge CTN-1 dans `baseline.md` | Agent SEO | CTN-1 + Métriques |
| **Métrique GSC reformulée** : ≥ 3 requêtes longue traîne au lieu de "articles claude code" | Agent SEO | Métriques |
| **Alerte article viral mais déindexé** : log si `pageviewsLast7d > 50` + non modifié > 90 j | Agent SEO | Risques (CTN-6) |
| **W5 trigger réouverture explicite** : 50 articles + 8 par theme | Agent SEO | WON'T (aligné UX) |

### C.3 — Divergence sur Q3 (URL state) — tranchée

L'agent UX recommandait URL state **dès MVP** (gain partage Discord/Twitter). L'agent SEO recommandait **non pour MVP** mais en justifiait par un warning sur `generateStaticParams` qui ne pouvait pas pré-générer les combinaisons.

**Décision finale** : OUI URL state, **Sprint 2 (CTN-13)**. L'argument SEO contre ne tient pas réellement (URL state pur client-side, aucune route statique générée, aucun impact SEO). Reclassée de WON'T à SHOULD. Note explicite ajoutée dans CTN-13 : ne pas pré-générer via `generateStaticParams`.

### C.4 — Stories ajoutées

| ID | Story | SP | Sprint | Source |
|----|-------|----|--------|--------|
| **CTN-13** | URL state filtres `?theme=...` | 1 | 2 SHOULD | Revue UX |
| **CTN-14** | Nav sticky inter-sections | 1 | 1 MUST | Revue UX |

### C.5 — Stories supprimées / fusionnées

| ID | Action | Raison |
|----|--------|--------|
| **CTN-11** | Fusionnée dans CTN-3 | Latest + Pinned indissociables (exclusion mutuelle + layout combiné) |

### C.6 — Statut post-revue

L'EPIC est désormais **prêt pour Sprint 1** sous réserve d'ouverture par le PO. Les ~25 corrections structurelles (C.1 + C.2) sont intégrées au corps. Les 5 questions ouvertes (Annexe B) sont tranchées avec décision tracée. Le scope final passe de 24 SP / 12 stories à **25 SP / 12 stories** (1 supprimée, 2 ajoutées).
