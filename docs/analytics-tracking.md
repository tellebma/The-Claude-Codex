# Analytics & tracking — funnel Matomo

> Reference de l'instrumentation analytics du site, post-SEO-8.

## Architecture

```
Matomo cookieless                       Hook React (client)
(self-hosted)                           AnalyticsTracker
       ▲                                       │
       │                                       │
       │  POST matomo.php                      │ pousse dans window._paq
       │                                       │
       └───────────  window._paq  ────────────┘
                          ▲
                          │
                  loaded async via
                  matomo.js (head)
```

Trois sources d'evenements alimentent `_paq` :

1. **Snippet `<head>`** dans `src/app/[locale]/layout.tsx` : initialise
   `_paq`, `disableCookies`, `setDoNotTrack`, `enableLinkTracking`. Ne fire
   plus de `trackPageView` au load (delegate au hook React, cf. SEO-8).

2. **`useMatomoPageviewTracking`** (SEO-8) monte dans `AnalyticsTracker` :
   ecoute les changements de `usePathname()` + `useSearchParams()` et
   pousse un nouveau `setCustomUrl` + `setDocumentTitle` + `trackPageView`
   a chaque navigation App Router cote client. Sans ce hook, Next.js
   ne firerait qu'un seul pageview par session.

3. **Hooks d'engagement** dans `src/hooks/` :
   - `useScrollDepthTracking` : evenement `engagement / scroll_depth /
     {25|50|75|100}` une seule fois par page, debouncing 150 ms.
   - `useExternalLinkTracking` : evenement `navigation /
     external_link_click / {url}` via listener delegue `click` capture.

## Couverture par page

| Type de page | Layout | AnalyticsTracker | Notes |
|---|---|---|---|
| Section MDX (mcp, skills, agents, …) | `SectionLayout` | ✅ via SectionLayout | Couvert par defaut |
| Article `/content/{slug}/` | `SectionLayout` | ✅ | |
| Landing `/[locale]/` | `[locale]/layout.tsx` | ✅ via `<AnalyticsTracker />` ajoute en SEO-9 | |
| `/about/` | `[locale]/layout.tsx` | ✅ via `<AnalyticsTracker />` ajoute en SEO-9 | |
| `/design-system/` | `[locale]/layout.tsx` | ✅ via `<AnalyticsTracker />` ajoute en SEO-9 | |
| `/glossary/` | layout custom DefinedTermSet | ✅ via `<AnalyticsTracker />` ajoute en SEO-9 | |
| `/configurator/` | layout custom Breadcrumb | ✅ via `<AnalyticsTracker />` ajoute en SEO-9 | |

## Catalogue d'evenements

| Categorie | Action | Label | Source |
|---|---|---|---|
| (built-in) | pageview | URL courante | `useMatomoPageviewTracking` (SEO-8) |
| `engagement` | `scroll_depth` | `25` / `50` / `75` / `100` | `useScrollDepthTracking` |
| `navigation` | `external_link_click` | URL cible absolue | `useExternalLinkTracking` |
| `configurator` | `configurator_start` | — | `trackConfigurator.start()` au mount de `ConfiguratorWizard` |
| `configurator` | `configurator_step` | `1` .. `4` | A chaque changement d'etape |
| `configurator` | `configurator_complete` | — | Premier affichage du preview |

## Securite

- Cookieless : `_paq.push(['disableCookies'])` + `setDoNotTrack`.
- Aucune donnee personnelle envoyee : seulement des URLs cibles et des
  labels controles cote code (jamais d'input utilisateur).
- `pushMatomoCommand()` est SSR-safe : no-op cote serveur et quand
  `_paq` n'a pas ete initialise (env vars Matomo manquantes en dev).
- L'init du snippet ne se rend que si `NEXT_PUBLIC_MATOMO_URL` ET
  `NEXT_PUBLIC_MATOMO_SITE_ID` sont definies (eviter de polluer le DOM
  en local sans Matomo configure).

## Bug fix SEO-8 (2026-05-10)

**Symptome rapport hebdo 2026-04-25 → 2026-05-01** :
- 78 pages tracees dans Matomo vs 234 pages avec impressions GSC (33%)
- 1 seul scroll 75 % sur 374 pageviews (~0,3 %)
- 4 alertes `tracking_mismatch` (clics GSC sans pageview Matomo)

**Cause root** : Next.js App Router fait des navigations client-side sans
recharger la page. Le snippet Matomo `<head>` execute `trackPageView` une
seule fois au load initial. Toutes les navigations suivantes (`Link`,
`router.push`) etaient donc invisibles pour Matomo.

**Fix** :
1. Suppression du `['trackPageView']` du snippet init dans
   `src/app/[locale]/layout.tsx`.
2. Ajout du hook `useMatomoPageviewTracking` qui ecoute `usePathname` +
   `useSearchParams` et fire un nouveau `setCustomUrl` + `setDocumentTitle`
   + `trackPageView` a chaque changement.
3. Mount via `AnalyticsTracker` (deja partout grace a SEO-9 PR #166).

**Effet attendu** :
- Couverture ~234/234 pages (vs 78/234 avant) sur le prochain rapport hebdo.
- Scroll 75 % attendu autour de 8-15 % des pageviews (dependra du contenu).
- Resolution naturelle des 4 alertes `tracking_mismatch`.

## Comment debugger en local

1. Definir les env vars dans `.env.local` :
   ```
   NEXT_PUBLIC_MATOMO_URL=https://matomo.example.com
   NEXT_PUBLIC_MATOMO_SITE_ID=1
   ```
2. `npm run dev` puis ouvrir DevTools Network -> filtrer "matomo.php".
3. Naviguer entre 2 pages : verifier qu'une nouvelle requete vers
   `matomo.php?action_name=...&url=...` part a chaque navigation.
4. Scroller jusqu'a 75 % : verifier l'event `e_c=engagement&e_a=scroll_depth&e_n=75`.
5. Cliquer un lien externe (ex: anthropic.com) : verifier l'event
   `e_c=navigation&e_a=external_link_click&e_n=https%3A%2F%2F...`.

## Verification post-deploiement

Pour valider le fix SEO-8 sur preview/prod :
1. Ouvrir preview Vercel.
2. Ouvrir DevTools Network, filtrer "matomo.php".
3. Cliquer entre 5 pages differentes : verifier que 5 requetes partent.
4. Pre-fix, on observait 1 requete totale au load initial.
