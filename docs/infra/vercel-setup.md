# Vercel — Setup du projet `the-claude-codex`

> Story : **VM-1** (EPIC Vercel Metrics 2026)
> Date : 2026-05-11
> Statut : production active, beacons Vercel Analytics confirmés en live

---

## Identité du projet

| Champ | Valeur |
|-------|--------|
| Project name | `the-claude-codex` |
| Project ID | `prj_owfJ8wzwLBLSDbuGUsZK9kHvh42Q` |
| Team | `tellebma's projects` (`team_X92DOqyhOKEDlF3j6XDkAHPk`) |
| Framework détecté | Next.js |
| Node version | 24.x |
| Bundler | turbopack |
| Branche production | `main` |
| Branche preview auto-deploy | `develop` |
| Domaine production | `claude-codex.fr` (et `www.claude-codex.fr`) |
| Dashboard | https://vercel.com/tellebma/the-claude-codex |

Le projet est connecté au repo GitHub `tellebma/The-Claude-Codex` via l'intégration GitHub native de Vercel. Chaque push `develop` produit un preview deployment ; chaque push `main` (via la release `semantic-release`) produit un deploy production aliasé sur `claude-codex.fr`.

## SDKs côté code

Les SDK `@vercel/analytics` et `@vercel/speed-insights` sont déjà installés et montés dans `src/app/[locale]/layout.tsx` via le wrapper client `src/components/layout/VercelMetrics.tsx` :

- `<Analytics mode="production" beforeSend={...} />` envoie un beacon sur `/_vercel/insights/view` à chaque pageview, avec rédaction des query strings sensibles (`token`, `key`, `secret`, `api_key`, `password`, `pwd`, `auth`, `code`) via `beforeSend`.
- `<SpeedInsights sampleRate={NEXT_PUBLIC_VERCEL_SI_SAMPLE_RATE ?? 1} />` envoie les Web Vitals (LCP, INP, CLS, FCP, TTFB) en RUM. Le sample rate est ajustable via env var (1 = 100 %).
- Custom events Vercel via `trackVercelEvent()` (`src/lib/analytics/trackVercel.ts`) : `configurator_start`, `configurator_step`, `configurator_complete`, `search_dialog_open`.

Voir [docs/analytics-tracking.md](../analytics-tracking.md) pour la table de mapping Matomo / Vercel.

## Vérification que les beacons partent (2026-05-11)

Test Playwright depuis `https://claude-codex.fr/fr/` :

| Beacon | Endpoint | Statut |
|--------|----------|--------|
| Web Analytics (pageview) | `POST /_vercel/insights/view` | ✅ `200` |
| Speed Insights (vitals) | `POST /_vercel/speed-insights/vitals` | ✅ déclenché sur interaction utilisateur |
| Matomo (pageview) | `POST https://matomo.tellebma.fr/matomo.php` | ✅ `200` (cookieless) |

Le `200` sur l'endpoint `_vercel/insights/view` indique que Web Analytics est bien activée dans le dashboard Vercel — sinon Vercel renverrait `403` ou `404`.

## Toggles dashboard à vérifier (action owner manuelle)

L'API Vercel publique n'expose pas l'état des toggles Analytics / Speed Insights / Observability. Vérification manuelle via le dashboard à effectuer une fois :

- [ ] **Settings > Analytics** : toggle ON, plan **Hobby** (gratuit, < 50k events/mois). Lien : [vercel.com/tellebma/the-claude-codex/settings/analytics](https://vercel.com/tellebma/the-claude-codex/settings/analytics)
- [ ] **Settings > Speed Insights** : toggle ON, plan **Hobby** (gratuit, ~10k data points/mois). Lien : [vercel.com/tellebma/the-claude-codex/settings/speed-insights](https://vercel.com/tellebma/the-claude-codex/settings/speed-insights)
- [ ] **Observability** : section confirmée présente dans le projet (cf. [vercel-observability.md](./vercel-observability.md)).

## Variables d'environnement Matomo

À vérifier en `Settings > Environment Variables` que **production + preview + development** ont les valeurs Matomo :

| Variable | Valeur attendue |
|----------|-----------------|
| `NEXT_PUBLIC_MATOMO_URL` | `https://matomo.tellebma.fr` |
| `NEXT_PUBLIC_MATOMO_SITE_ID` | `1` |

Toutes deux portées publiques (`NEXT_PUBLIC_*`), pas de secret. Le code dans `src/lib/analytics/matomo.ts` est SSR-safe et no-op si l'une des deux est absente.

## Critères d'acceptation VM-1 — état actuel

- [x] SDK `@vercel/analytics` intégré (`#171` VM-3)
- [x] SDK `@vercel/speed-insights` intégré (`#171` VM-5)
- [x] Custom events `configurator_*` + `search_dialog_open` (`#172` VM-4)
- [x] Sample rate Speed Insights configurable (`#172` VM-6)
- [x] `beforeSend` rédaction RGPD (`#172` VM-7)
- [x] Beacons confirmés en live (200 OK sur `_vercel/insights/view`)
- [x] Doc projet (ce fichier)
- [ ] Toggles dashboard vérifiés visuellement (action owner)
- [ ] Variables d'environnement Matomo vérifiées sur les 3 envs (action owner)
