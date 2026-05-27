# Décisions SEO + architecture technique — Sprint 1 EPIC Content page redesign

> Source : agent expert SEO/technique, 2026-05-19, contexte EPIC `docs/BACKLOG/EPIC-content-page-redesign-2026-05.md`.
> Statut : draft, à valider en kickoff par PO.
> Couvre Sprint 1 (CTN-2/3/4/5/14) + impact Sprint 2 (CTN-6/7/8/9/13).

Conventions :

- URL canoniques avec trailing slash (cf. `next.config.mjs`, `ensureTrailingSlash()` est source de vérité).
- JSON-LD sérialisé via `serializeJsonLd()` (échappe `</`).
- Fonctions exportées : retour `Record<string, unknown>`, jamais `any`.

---

## 1. Structured data (JSON-LD)

### 1.1 CollectionPage étendu (CTN-4)

`createCollectionPageSchema()` actuel (lignes 122-141 `src/lib/structured-data.ts`) est minimal. On l'étend pour porter fraîcheur (`dateModified`), maillage (`hasPart`) et `publisher`. Spec Schema.org : `CollectionPage` hérite de `WebPage`, `dateModified` et `hasPart` valides (https://schema.org/CollectionPage). Google requiert `@context`, `@type`, `name`, `url` (https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

```ts
interface CollectionPagePart {
  readonly url: string;            // absolu ou relatif (normalisé)
  readonly name: string;
  readonly dateModified?: string;
  readonly inLanguage?: string;    // BCP 47 (hérite du parent par défaut)
}

interface CollectionPageSchemaOptions {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly locale?: string;
  readonly dateModified?: string;
  readonly hasPart?: ReadonlyArray<CollectionPagePart>;
}

export function createCollectionPageSchema(
  options: CollectionPageSchemaOptions,
): Record<string, unknown> {
  const lang = localeToLanguageTag(options.locale ?? "fr");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: ensureTrailingSlash(options.url),
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(options.dateModified ? { dateModified: options.dateModified } : {}),
    ...(options.hasPart && options.hasPart.length > 0
      ? {
          hasPart: options.hasPart.map((part) => ({
            "@type": "Article",
            name: part.name,
            url: ensureTrailingSlash(
              part.url.startsWith("http") ? part.url : `${SITE_URL}${part.url}`,
            ),
            inLanguage: part.inLanguage ?? lang,
            ...(part.dateModified ? { dateModified: part.dateModified } : {}),
          })),
        }
      : {}),
  };
}
```

`dateModified` parent = max des `dateModified` (fallback `datePublished`) des articles dans `hasPart`. Omettre si liste vide. Volume `hasPart` = 16 articles (Pinned + Latest + Trending + Most read + All post-cascade). Pas de pagination tant que < 50 articles (WON'T W5).

### 1.2 BreadcrumbList (CTN-4)

Réutiliser `createBreadcrumbSchema()` inchangé. Google accepte que le dernier item soit la page elle-même (https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

```ts
const breadcrumb = createBreadcrumbSchema([
  { name: locale === "en" ? "Home" : "Accueil", href: `/${locale}/` },
  { name: locale === "en" ? "Editorial content" : "Contenus éditoriaux", href: `/${locale}/content/` },
]);
```

### 1.3 ItemList (CTN-8 + CTN-9)

Nouvelle fonction. Spec : `ItemList` requiert `itemListElement`, chaque `ListItem` requiert `position` (1-indexed) (https://schema.org/ItemList).

```ts
interface ItemListEntry {
  readonly position: number;
  readonly url: string;
  readonly name: string;
}

interface ItemListSchemaOptions {
  readonly name: string;
  readonly description: string;
  readonly items: ReadonlyArray<ItemListEntry>;
  readonly locale?: string;
}

export function createItemListSchema(
  options: ItemListSchemaOptions,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    description: options.description,
    inLanguage: localeToLanguageTag(options.locale ?? "fr"),
    numberOfItems: options.items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: options.items.map((entry) => ({
      "@type": "ListItem",
      position: entry.position,
      url: ensureTrailingSlash(
        entry.url.startsWith("http") ? entry.url : `${SITE_URL}${entry.url}`,
      ),
      name: entry.name,
    })),
  };
}
```

Décisions : `itemListOrder = Descending` (tri par signal d'usage). `numberOfItems` toujours émis pour validateurs tiers. Pas de `@id` (la position dans le DOM suffit).

Appel CTN-8 (Most read) : `name` = "Articles les plus lus ces 30 derniers jours" / "Most read articles in the last 30 days", top 6 du `pageviewsLast30d`. Appel CTN-9 (Trending) : `name` = "Tendances cette semaine" / "Trending this week", top 5 du delta filtré `> 0`.

### 1.4 Ordre d'injection des JSON-LD

Un `<script type="application/ld+json">` par schéma (recommandation Google https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript : meilleur que `@graph` pour le debug). Ordre : (1) CollectionPage (2) BreadcrumbList (3) ItemList Trending si présent (4) ItemList Most Read si présent.

```tsx
{schemas.map((schema, i) => (
  <script
    key={`ld-${(schema['@type'] as string) ?? i}`}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
  />
))}
```

Clé composite `ld-<type>` (pas l'index seul, règle Sonar).

---

## 2. Métadonnées et metadata route

### 2.1 generateMetadata()

`createPageMetadata()` (`src/lib/metadata.ts`) couvre title, description, canonical, OG, Twitter, alternates. La page actuelle l'utilise correctement. Aucune modification de signature.

OG image dédiée 1200×630 (Next.js convention `app/[locale]/content/opengraph-image.tsx`) : **reportée à CTN-10**. Sprint 1 garde le fallback OG global. `alternates.canonical` reste `/{locale}/content/`. `alternates.languages` automatique (`x-default`, `fr-FR`, `en-US`).

### 2.2 SITE_PAGES (sitemap)

Entrée `/content` actuelle (ligne 371 `src/data/site-pages.ts`) à mettre à jour :

- `priority` : `0.6` → **`0.8`** (devient hub éditorial, équivalent à `/skills` ou `/plugins`).
- `changeFrequency` : conserver `weekly` (rafraîchissement hebdo via workflow CTN-7).
- `lastModified` : date du merge CTN-4, puis MAJ à chaque PR qui touche `src/app/[locale]/content/page.tsx` ou ses dépendances directes (`<ArticleCard>`, `<ArticleThemeFilter>`).

### 2.3 search-index FR + EN

Entrée actuelle (FR ligne 1560, EN miroir) à enrichir : description plus précise + keywords étendus.

```ts
// search-index-fr.ts
{
  title: "Contenus éditoriaux",
  description: "Vitrine de tous les articles : derniers publiés, tendances, plus lus. Filtres par thème (sécurité, architecture, performance).",
  href: "/content",
  section: "Contenus",
  keywords: [
    "contenu", "article", "mdx", "editorial", "guide", "tutoriel",
    "vitrine", "tendance", "populaire", "filtre", "theme", "derniers",
  ],
}
```

Équivalent EN avec keywords `"trending"`, `"most read"`, `"filter"`, etc.

---

## 3. Tracking Matomo

### 3.1 Event `article_card_click`

Spec `_paq.push(['trackEvent', category, action, name?, value?])` (https://matomo.org/guide/tracking-api/reference/#trackevent).

| Champ | Valeur |
|-------|--------|
| `category` | `"content_index"` |
| `action` | `"article_card_click"` |
| `name` | slug de l'article (sans préfixe locale) |
| `value` | `undefined` |

`name = slug` agrège FR + EN dans le même rapport. Les slugs distincts (`fuite-cle-api` vs `leaked-api-key-recovery`) identifient l'article sans ambiguïté.

Nouveau module `src/lib/analytics/trackContentIndex.ts` aligné sur `trackConfigurator.ts` :

```ts
import { trackEvent } from "./matomo";

const CATEGORY = "content_index";

export const trackContentIndex = {
  cardClick(slug: string): void {
    trackEvent(CATEGORY, "article_card_click", slug);
  },
  themeFilterToggle(themeKey: string, isActive: boolean): void {
    trackEvent(CATEGORY, "article_theme_filter_toggle", themeKey, isActive ? 1 : 0);
  },
} as const;
```

Attachement : `<ArticleCard>` reste server-renderable, wrappé par un client `<TrackableArticleLink>` qui rend un `<Link>` + intercepte `onClick`. Pas de logique tracking dans `<ArticleCard>` (séparation des responsabilités).

```tsx
// src/components/ui/TrackableArticleLink.tsx
"use client";
import { Link } from "@/i18n/navigation";
import { trackContentIndex } from "@/lib/analytics/trackContentIndex";

export function TrackableArticleLink({
  slug, href, children, className,
}: Readonly<{
  slug: string; href: string; children: React.ReactNode; className?: string;
}>) {
  return (
    <Link href={href} className={className} onClick={() => trackContentIndex.cardClick(slug)}>
      {children}
    </Link>
  );
}
```

### 3.2 Event `article_theme_filter_toggle`

Recommandé. Mesure l'engagement filtres, valide CTN-5, conditionne le trigger WON'T W5 (pages dédiées par theme).

| Champ | Valeur |
|-------|--------|
| `category` | `"content_index"` |
| `action` | `"article_theme_filter_toggle"` |
| `name` | clé du thème (`"tutorial"`, `"security"`, etc.) |
| `value` | `1` (activation), `0` (désactivation) |

Émis dans `<ArticleThemeFilter>` au `onClick` de chaque chip. Pas de debounce (clic = intention claire).

### 3.3 Events existants à conserver

- `engagement / scroll_depth` (`useScrollDepthTracking`) : actif via `SectionLayout`. La page `/content/` doit rester sous `SectionLayout` ou inclure `<AnalyticsTracker />` explicitement. Vérifier au mount.
- `navigation / external_link_click` : actif globalement via listener délégué, aucun ajustement.
- Pas de duplication avec `article_card_click` (liens internes, l'event `external_link_click` ne se déclenche pas dessus).

---

## 4. Snapshot Matomo (CTN-6/7)

### 4.1 Schéma `article-stats.json` final

```ts
// src/data/article-stats.ts (types) + src/data/article-stats.json (données)
export interface ArticleStatsEntry {
  readonly slug: string;
  readonly locale: "fr" | "en";
  readonly pageviewsLast30d: number;
  readonly pageviewsLast7d: number;
  readonly pageviewsPrev7d: number;
  readonly deltaPct: number;            // arrondi 1 décimale
  readonly scrollDepth75Pct: number;    // ratio 0..1
}

export interface ArticleStatsFile {
  readonly generatedAt: string;          // ISO 8601 UTC
  readonly matomoPeriodDays: 30;         // littéral
  readonly source: "matomo" | "override";
  readonly articles: ReadonlyArray<ArticleStatsEntry>;
}
```

Décisions clés vs schéma initial EPIC : `source` ajouté pour distinguer auto et override PO ; tous les champs `readonly`, pas de `null` ; `deltaPct` arrondi (bruit visuel sinon) ; `scrollDepth75Pct` en ratio (affiché en % côté UI).

### 4.2 Endpoints Matomo

Reporting API (https://developer.matomo.org/api-reference/reporting-api), auth via `token_auth` ou header Bearer.

```
GET {MATOMO_URL}/?module=API&method=Actions.getPageUrls
  &idSite={SITE_ID}&period=range&date=last30&format=json
  &token_auth={TOKEN}&flat=1&filter_limit=500
```

Trois appels distincts : `date=last7`, `date=previous7` (8-14j avant aujourd'hui), `date=last30`. Pas de dépendance au calcul interne `evolution`. Headers : `Accept: application/json`, `User-Agent: claude-codex-stats-bot/1.0`.

Gestion erreurs :

- Timeout 15s par appel.
- HTTP 4xx → log + abort (token/idSite invalide).
- HTTP 5xx → 1 retry après 5s, puis abort.
- JSON malformé → abort sans écrire (préserve l'existant).
- Abort = conserve l'ancien JSON, exit code 1 pour échec CI explicite.

Filtrage côté script : ne garder que `/fr/content/` ou `/en/content/`, exclure les pages index, mapper `label` → `slug` via regex `/(fr|en)\/content\/([^/]+)\/?/`.

### 4.3 Workflow GH Actions hebdo

```yaml
# .github/workflows/weekly-article-stats.yml
name: weekly-article-stats
on:
  schedule:
    - cron: "0 8 * * 1"  # lundi 8h UTC
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    permissions: { contents: write, pull-requests: write }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - name: Refresh stats
        env:
          MATOMO_API_URL: ${{ secrets.MATOMO_API_URL }}
          MATOMO_AUTH_TOKEN: ${{ secrets.MATOMO_AUTH_TOKEN }}
          MATOMO_SITE_ID: ${{ secrets.MATOMO_SITE_ID }}
        run: npm run refresh:article-stats
      - id: diff
        run: |
          if git diff --quiet src/data/article-stats.json; then
            echo "changed=false" >> "$GITHUB_OUTPUT"
          else
            echo "changed=true" >> "$GITHUB_OUTPUT"
          fi
      - if: steps.diff.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v6
        with:
          branch: chore/weekly-article-stats
          base: develop
          draft: true
          title: "chore(stats): weekly article stats refresh"
          commit-message: "chore(stats): refresh article-stats.json"
          labels: chore,stats
          body: |
            Auto-refresh hebdo `src/data/article-stats.json`.
            Période : 30 derniers jours.
            Articles delta > 50% listés en commentaire.
```

Secrets requis : `MATOMO_API_URL`, `MATOMO_AUTH_TOKEN`, `MATOMO_SITE_ID`. Conditions PR draft : diff non vide ET au moins 1 article avec `pageviewsLast30d > 0` (sinon Matomo n'a pas répondu, on n'écrase pas). Toujours `draft: true`.

### 4.4 Stratégie de fallback

| Cas | Comportement |
|-----|--------------|
| Matomo API down | Workflow exit 1, fichier existant préservé, pas de PR |
| `article-stats.json` absent | Sections Trending et Most read **absentes du DOM**, pas d'`ItemList` émis |
| JSON malformé | `try/catch` autour de l'import → identique à "absent", warning loggué |
| JSON vide (`articles: []`) | Sections absentes du DOM |
| Tous deltas ≤ 0 | Trending absent, Most read conservé si pageviews > 0 |
| `article-stats.override.json` présent | Source = `"override"`, court-circuite l'auto, log `[content-index] Using override file` |

Implémentation page :

```ts
import type { ArticleStatsFile } from "@/data/article-stats";

function loadArticleStats(): ArticleStatsFile | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const override = require("@/data/article-stats.override.json") as ArticleStatsFile;
    if (Array.isArray(override?.articles) && override.articles.length > 0) return override;
  } catch { /* pas d'override */ }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const auto = require("@/data/article-stats.json") as ArticleStatsFile;
    if (Array.isArray(auto?.articles) && auto.articles.length > 0) return auto;
    return null;
  } catch {
    return null;
  }
}
```

`require` autorisé localement avec eslint-disable ciblé (charge JSON statique au build, `await import` interdit dans Server Component synchrone).

---

## 5. Cascade d'exclusion des doublons

Ordre obligatoire : **Pinned > Trending > Most read > Latest > All**.

```ts
interface ArticleSummary {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly themes: ReadonlyArray<string>;
  readonly dateModified?: string;
  readonly datePublished?: string;
  readonly wordCount?: number;
}

function applyCascade(
  pinned: ArticleSummary | null,
  trendingCandidates: ReadonlyArray<ArticleSummary>,
  mostReadCandidates: ReadonlyArray<ArticleSummary>,
  latestCandidates: ReadonlyArray<ArticleSummary>,
  allArticles: ReadonlyArray<ArticleSummary>,
  caps: Readonly<{ trending: number; mostRead: number; latest: number }>,
): Readonly<{
  pinned: ArticleSummary | null;
  trending: ReadonlyArray<ArticleSummary>;
  mostRead: ReadonlyArray<ArticleSummary>;
  latest: ReadonlyArray<ArticleSummary>;
  all: ReadonlyArray<ArticleSummary>;
}> {
  const used = new Set<string>();
  if (pinned) used.add(pinned.slug);

  const trending = trendingCandidates.filter((a) => !used.has(a.slug)).slice(0, caps.trending);
  trending.forEach((a) => used.add(a.slug));

  const mostRead = mostReadCandidates.filter((a) => !used.has(a.slug)).slice(0, caps.mostRead);
  mostRead.forEach((a) => used.add(a.slug));

  const latest = latestCandidates.filter((a) => !used.has(a.slug)).slice(0, caps.latest);
  latest.forEach((a) => used.add(a.slug));

  const all = allArticles.filter((a) => !used.has(a.slug));
  return { pinned, trending, mostRead, latest, all };
}
```

Caps Sprint 1 : `trending: 5`, `mostRead: 6`, `latest: 6` (3 dans rangée haute + 3 sous), `all: illimité`. Sprint 1 sans `article-stats.json` → trending et mostRead vides, cascade rend Pinned + Latest + All (cohérent MUST HAVE).

---

## 6. Core Web Vitals

Cibles 2026 (https://web.dev/articles/vitals) :

| Métrique | Cible | Levier |
|----------|-------|--------|
| LCP | < 2.5s | Image Pinned `loading="eager"` + `fetchpriority="high"` |
| CLS | < 0.05 (interne) | `aspect-ratio` CSS sur toutes les images |
| INP | < 200ms p75 | `useMemo` sur filtre + `useTransition` si besoin |

### 6.1 LCP

LCP de `/content/` = image Pinned (hero variant, above-the-fold). Sur `<img>` Pinned : `loading="eager"` + `fetchpriority="high"` (https://web.dev/articles/fetch-priority). Autres images : `loading="lazy"` + `decoding="async"`. Servir Pinned en `1200×630` (déjà OG size, pas de génération supplémentaire).

### 6.2 CLS

`aspect-ratio` CSS par variant : `hero` → `1200/630`, `grid` → `600/315`, `row` → `1/1`. Pas de `min-height` arbitraire. Bandeau chips filtre : `min-height: 5rem` (pas de grow/shrink au toggle).

### 6.3 INP

`useMemo` sur la liste filtrée (CTN-5) : `useMemo(() => allArticles.filter(matchesFilters), [allArticles, activeFilters])`. Si Lighthouse signale INP > 200ms (peu probable, 16 articles), wrapper `setActiveFilters` dans `useTransition`. Pas de debounce sur chips (clic = intention claire). Pas de `useEffect` lourd dans `<ArticleCard>`.

### 6.4 Mesure CI

Ajouter assertions Lighthouse CI spécifiques `/content/` : `cumulative-layout-shift < 0.05`, `largest-contentful-paint < 2500`, `total-blocking-time < 200` (proxy INP lab mode). INP réel mesuré Playwright via `page.evaluate` + Performance Observer (cf. CTN-12 "INP p75 < 200 ms").

---

## 7. llms.txt et GEO

### 7.1 Modifications `scripts/generate-llms-txt.ts`

Ajouter explicitement dans `SECTION_LANDINGS_FR` et `SECTION_LANDINGS_EN` :

```ts
{ slug: "content", title: "Articles éditoriaux", desc: "Vitrine éditoriale : derniers articles, tendances, plus lus, filtres par thème (sécurité, architecture, performance)." },
{ slug: "content", title: "Editorial articles", desc: "Editorial showcase: latest articles, trending, most read, filters by theme (security, architecture, performance)." },
```

`POPULAR_SLUGS_FR/EN` listent les articles individuels — **ne pas y ajouter `content`** (c'est une section, pas un article).

### 7.2 Structure GEO friendly

Sous-titre hero (CTN-4) : phrase explicite listant les thèmes, en `<p>` directement après le `<h1>`, format invariable :

> "16 guides indépendants couvrant : sécurité, architecture, DevSecOps, performance, outillage, productivité, migration."

Les LLM extraient les thèmes via parsing markdown standard. La liste `hasPart` du `CollectionPage` porte le même signal pour les agents qui consomment JSON-LD.

Pas de `BlogPosting` au lieu de `Article` : `Article` est plus générique, accepté par tous les LLM, et ne risque pas de surclasser un guide technique en post personnel.

---

## 8. Tests E2E SEO à ajouter

### 8.1 JSON-LD validation (dans `e2e/content-index.spec.ts`)

```ts
test("emits valid JSON-LD on /fr/content/", async ({ page }) => {
  await page.goto("/fr/content/");
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  expect(scripts.length).toBeGreaterThanOrEqual(2); // CollectionPage + BreadcrumbList

  const schemas = await Promise.all(
    scripts.map(async (s) => JSON.parse((await s.textContent()) ?? "{}")),
  );
  const types = schemas.map((s) => s["@type"]);
  expect(types).toContain("CollectionPage");
  expect(types).toContain("BreadcrumbList");

  const collection = schemas.find((s) => s["@type"] === "CollectionPage");
  expect(collection.url).toBe("https://claude-codex.fr/fr/content/");
  expect(collection.inLanguage).toBe("fr-FR");

  if (process.env.HAS_ARTICLE_STATS === "true") {
    expect(types).toContain("ItemList");
  }
});
```

### 8.2 OG tags

```ts
test("OG and Twitter tags present", async ({ page }) => {
  await page.goto("/fr/content/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Contenus éditoriaux/);
  await expect(page.locator('meta[property="og:description"]')).toBeAttached();
  await expect(page.locator('meta[property="og:image"]')).toBeAttached();
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
});
```

### 8.3 Fallback sections data-driven

Job CI dédié qui supprime `article-stats.json` avant `next build`. Pré-requis : attribut `data-section="..."` sur chaque `<section>`.

```ts
test("trending/most-read absent from DOM when stats missing", async ({ page }) => {
  await page.goto("/fr/content/");
  await expect(page.locator('section[data-section="trending"]')).toHaveCount(0);
  await expect(page.locator('section[data-section="most-read"]')).toHaveCount(0);
  await expect(page.locator('section[data-section="latest"]')).toBeVisible();
});
```

### 8.4 Sitemap

```ts
test("sitemap lists /content/ in both locales", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("<loc>https://claude-codex.fr/fr/content/</loc>");
  expect(xml).toContain("<loc>https://claude-codex.fr/en/content/</loc>");
  expect(xml).toMatch(/\/fr\/content\/[\s\S]*?<changefreq>weekly<\/changefreq>/);
});
```

---

## 9. Risques techniques résiduels

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| `dateModified` CollectionPage désynchro vs `lastModified` sitemap | Moyen | Bas | Test CI : si un article a un `dateModified` postérieur au `lastModified` de `/content`, fail build |
| `ItemList` non reconnu par certains validateurs si `numberOfItems` manque | Faible | Faible | `numberOfItems` toujours émis (cf. §1.3) |
| Matomo `getPageUrls` mélange FR/EN si idSite mal configuré | Moyen | Élevé | Filtrage strict via préfixe URL `/fr/` vs `/en/`, documenté dans `refresh-article-stats.ts` |
| `article-stats.override.json` oublié dans le repo après debug | Faible | Élevé | Script écrit `// REMOVE BEFORE MERGE` en tête. Test CI fail si override committé |
| `<TrackableArticleLink>` casse prefetch Next.js | Faible | Faible | `<Link>` interne conserve `href` + prefetch natif, `onClick` ne préventDefault pas |
| INP > 200ms avec 50+ articles (futur) | Faible | Moyen | `useMemo` + `useTransition` déjà prévus, volume actuel 16 |
| Pinned `loading="eager"` charge sur slow 3G | Moyen | Moyen | Compromis accepté : Pinned = LCP. WebP via `<img srcset>` si dispo |
| Conflit cascade vs URL state CTN-13 | Moyen | Faible | URL state n'impacte que la section All articles, cascade calculée au build, indépendante des filtres client |

---

## 10. Baseline et métriques

### 10.1 Baseline obligatoire (au merge CTN-1)

Fichier `docs/epics/2026-05-content-redesign/baseline.md` à créer. Capture pré-refonte.

| Métrique | Source | Période |
|----------|--------|---------|
| Pages/session entry `/content/` | Matomo (segment Entry Page) | 30 derniers jours |
| Bounce rate `/content/` | Matomo | 30 derniers jours |
| Scroll-depth 75 % | Matomo event `engagement / scroll_depth / 75` | 30 derniers jours |
| Temps moyen sur page | Matomo | 30 derniers jours |
| Impressions GSC `/content/` (FR + EN agrégées) | GSC | 28 derniers jours |
| Clics GSC | GSC | 28 derniers jours |
| Position moyenne | GSC | 28 derniers jours |
| Top 10 requêtes longue traîne menant à `/content/` | GSC | 28 derniers jours |

Format `baseline.md` : titre + date + 2 blocs Matomo / GSC + section `## Notes` (anomalies, saisonnalité). Format complet documenté dans la PR CTN-1.

### 10.2 Mesure J+60

Relevé hebdomadaire à partir de J+30 (4 mesures, J+30 → J+60). Sources : Matomo (engagement) + GSC (acquisition). Stockage : ajout d'une section `## Mesures J+X` dans `baseline.md`. Décision Go/Reopen si < 50% objectifs : ouvrir une revue dédiée (pas un refus auto).

---

## 11. URL state CTN-13 (Sprint 2)

### 11.1 Format

- Clé : `theme` (singulier, valeurs multiples séparées par virgule).
- Valeurs : clés `ThemeKey` du registre (`tutorial`, `security`, etc.).
- Exemple : `/fr/content/?theme=tutorial,security`.
- Query param et pas hash : utilisable côté serveur si besoin futur, et le hash interfère avec les ancres de section (`#all-articles`).

### 11.2 Parsing

```ts
import { isThemeKey } from "@/lib/themes";

function parseThemeQueryParam(raw: string | null): ReadonlySet<string> {
  if (!raw) return new Set();
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return new Set(parts.filter(isThemeKey));
}
```

Validation stricte : valeurs inconnues rejetées silencieusement (pas de redirection 301, pas d'erreur UI). Set pour O(1) lookup.

### 11.3 Lecture / écriture client

```ts
"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
// useSearchParams n'est pas réexporté par @/i18n/navigation, on garde next/navigation

const searchParams = useSearchParams();
const pathname = usePathname();
const router = useRouter();

const initialFilters = useMemo(
  () => parseThemeQueryParam(searchParams.get("theme")),
  [], // lit l'URL au mount, jamais après
);
const [activeFilters, setActiveFilters] = useState<ReadonlySet<string>>(initialFilters);

useEffect(() => {
  const params = new URLSearchParams(searchParams.toString());
  if (activeFilters.size === 0) params.delete("theme");
  else params.set("theme", Array.from(activeFilters).join(","));
  const qs = params.toString();
  router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
}, [activeFilters, pathname, router, searchParams]);
```

`next/navigation` ici car `@/i18n/navigation` ne réexporte pas `useSearchParams`. `router.replace` + `scroll: false` préserve la position (cf. EPIC CTN-5).

### 11.4 Back/forward

`router.replace` n'ajoute pas d'entrée d'historique → ne pollue pas le back. Au mount suivant (back depuis un article), relit `searchParams.get("theme")` et restaure l'état. Pas de logique supplémentaire.

### 11.5 Impact SEO confirmé nul

- Aucune route statique générée par filtre (`generateStaticParams` non appelé sur le query param).
- Aucune URL avec `?theme=` dans le sitemap.
- `robots.txt` n'a pas besoin de bloquer `?theme=` (Google traite les query params comme facettes par défaut).
- `<link rel="canonical">` du `<head>` pointe toujours vers `/fr/content/` (sans query). `createPageMetadata` ne modifie pas le canonical côté client : vérifier en CTN-13 que rien ne le change.

---

> Fin du document. Toute évolution post-Sprint 1 doit être tracée par PR (`docs(epic): update SEO/technical decisions for content redesign`).
