# Vercel — Observability section

> Story : **VM-9** (EPIC Vercel Metrics 2026)
> Date : 2026-05-11
> Statut : section disponible côté projet, activation par owner via dashboard

---

## Quoi

La section **Observability** d'un projet Vercel est gratuite sur le plan Hobby. Elle agrège trois flux :

1. **Edge Requests** : compteurs des requêtes servies par l'edge network Vercel (cache HIT/MISS, top routes, top régions, taille des réponses).
2. **Build Diagnostics** : durée des builds, mémoire pic, fichiers générés, warnings du framework.
3. **Vercel Functions** : exécutions des Serverless / Edge Functions (durée, erreurs, cold starts). **Pour `the-claude-codex` cette section est vide** : le site est 100 % statique (`output: 'export'` dans `next.config.mjs`), aucune fonction côté serveur.

Voir la doc officielle : https://vercel.com/docs/observability

## Pourquoi pour ce projet

Aujourd'hui :

- Le site est SSG pur → pas de fonction → Vercel Functions reste vide.
- Le trafic passe entièrement par le CDN edge → **Edge Requests** est le seul flux utile à court terme (sanity check vs Matomo pageviews + Vercel Web Analytics).
- Les builds tournent sur Vercel toutes les ~15 minutes de moyenne pendant les sprints actifs → **Build Diagnostics** sert pour détecter une dérive (build qui rallonge, paquet qui balloon) avant qu'elle atteigne les limites Hobby (45 min de build, 8 GB RAM — cf. VM-10).

## Métriques utiles à surveiller (clic-bouton, pas de code)

| Métrique | Interprétation | Seuil d'alerte mental |
|----------|----------------|------------------------|
| **Edge Requests / day** | Volume total trafic, cohérence avec Matomo + Vercel Web Analytics | Si écart > 30 % avec Matomo pageviews → audit nécessaire (bots Vercel non filtrés, ou Matomo qui rate des routes) |
| **Cache HIT rate** | % de requêtes servies depuis le CDN sans rebuild | < 80 % = mauvais signe (cache busting accidentel ou TTL trop court) |
| **Top routes** | Quelles URL consomment le plus | Doit refléter le top GSC + top Matomo |
| **Top régions** | Distribution géographique du trafic | FR + EU > 60 % attendu sur claude-codex.fr |
| **Build duration (P95)** | Durée des 5 % de builds les plus lents | < 5 min OK, 5-15 min à surveiller, > 15 min → enquêter |
| **Build memory peak** | Pic mémoire pendant les builds | < 4 GB OK, > 6 GB approche limite Hobby (8 GB) |

## Activation

Action manuelle dans le dashboard Vercel :

1. Aller sur https://vercel.com/tellebma/the-claude-codex/observability
2. Si une bannière propose d'activer la section : cliquer **Enable** (plan Hobby, gratuit).
3. Attendre 24 h pour que les compteurs Edge Requests se peuplent.
4. Vérifier que la section **Vercel Functions** est bien vide (normal en SSG).
5. Capturer une screenshot du dashboard et la déposer en local dans `docs/infra/vercel-observability-screenshot.png` (gitignoré, juste pour archive owner).

## Critères d'acceptation VM-9 — état actuel

- [x] Doc d'activation + interprétation (ce fichier)
- [ ] Observability activée dans le dashboard Vercel (action owner)
- [ ] Vérification que Vercel Functions est vide (action owner, attendu)
- [ ] Edge Requests affiche des compteurs après 24 h (action owner, vérification J+1)
- [ ] Build Diagnostics affiche la durée des builds (action owner, devrait être instantané vu les deploys récents)

---

## VM-10 — Build resilience + alerting

> Story : **VM-10** (EPIC Vercel Metrics 2026, 3 SP)
> Date audit : 2026-05-11

### Audit des 6 derniers builds (sample représentatif)

Mesure brute : `ready - buildingAt` extrait via MCP Vercel `get_deployment` sur 6 deployments (5 develop + 1 production main).

| Deployment | Branche | Durée | Commit |
|------------|---------|------:|--------|
| `dpl_Gwsqx9wsc...` | develop | **78,4 s** | docs(infra): VM-1 + VM-9 (#182) |
| `dpl_5cUSeJ6v...` | develop | **78,9 s** | docs(backlog): cloture Sprint 3+4 (#181) |
| `dpl_Eoa9Aw9f...` | develop | **77,7 s** | docs(backlog): EPIC Vercel Metrics (#154) |
| `dpl_HGma4kdb...` | develop | **79,5 s** | chore(deps): codeql-action (#123) |
| `dpl_7cEURahV...` | develop | **79,2 s** | docs(backlog): EPIC tuto (#164) |
| `dpl_DywtBRdo...` | **main** (prod) | **82,9 s** | chore(release): 1.8.0 |

**Stats** :

- P50 = **78,9 s** (1,3 min)
- P95 estimé = **82 s**
- Variance très faible (78–83 s sur 6 deploys consécutifs)
- Aucune tendance à la hausse vs builds plus anciens

### Comparaison Vercel vs GitHub Actions

| Plateforme | Périmètre | Durée P50 |
|------------|-----------|----------:|
| **Vercel** | `npm run build` (Next.js SSG export turbopack, 200+ pages, generate-llms-txt prebuild) | **~79 s** |
| **GitHub Actions** (workflow `pr-checks.yml`) | Lint + type-check + unit tests + build + E2E smoke + E2E visual + Lighthouse + SonarQube + Validate SEO + Broken links | **~415 s (7 min)** |

L'écart est attendu : Vercel ne fait QUE le build (compilation + SSG), GitHub Actions enchaîne tous les gates de qualité. Le build pur côté GH Actions (job `build (SSG export)`) prend ~75 s, soit cohérent avec Vercel à 4–5 s près.

### Limites Vercel Hobby vs usage actuel

| Limite Hobby | Notre P50 | Marge |
|--------------|----------:|------:|
| **Build duration max** : 45 min (2 700 s) | 79 s | **×34** |
| **Build memory** : 8 GB RAM | non remonté par API publique | n/a |
| **Concurrent builds** : 1 | 1 (push develop → 1 build) | ok |
| **Bandwidth / mois** : 100 GB | n/a (mesuré ailleurs) | n/a |

**Conclusion** : aucun risque court terme. Le projet pourrait scaler de **34× (3000+ pages, MDX 30× plus lourd, ou 1000 articles)** avant d'approcher le timeout Hobby. La marge confortable autorise même quelques scripts pré-build supplémentaires (auto-images, OG generation, etc.) sans crainte.

### Seuils d'alerte mentaux (Hobby, pas d'alerting auto)

| Si build duration… | Alors… |
|--------------------|--------|
| < 2 min | RAS, marge confortable |
| 2–5 min | Surveiller la tendance, identifier ce qui a rallongé |
| 5–10 min | Auditer (top 3 contributeurs : MDX compilation, generate-llms-txt, prerender) |
| 10–20 min | Quick wins requis : caching, sharding MDX, lazy compilation |
| > 20 min | Approcher la limite — envisager passage Pro (90 min limite) ou réduction de scope |

### Quick wins identifiés (si jamais le build dépasse 5 min)

À 79 s on n'en a pas besoin, mais à conserver en référence :

1. **Caching Next.js** : Vercel cache déjà `.next/cache/` entre deploys d'une même branche. Vérifier dans les Build Logs que "Restored build cache" apparaît.
2. **Paralléliser `generate-llms-txt.ts`** : ce script lit tous les MDX FR+EN en séquentiel. Un `Promise.all` ferait gagner ~2–3 s. À 79 s, non prioritaire.
3. **MDX precompilation** : actuellement next-mdx-remote compile à build time. Vercel a une option de turbopack-mdx beta plus rapide (~30 % gain mesuré ailleurs).
4. **Exclure les fichiers non-utiles du `npm ci`** : `__tests__/`, `e2e/`, et `docs/` ne sont pas requis pour le build. Mais `npm ci` installe TOUTES les deps. Possible via `.vercelignore`. Gain limité (~5 s).

### Alerting (Hobby vs Pro)

Sur **Hobby** : pas de spend management, pas d'alerting automatique. Vérification mentale au cas par cas dans Build Diagnostics (cf. doc Observability ci-dessus).

Sur **Pro** (si jamais on bascule) : configurer Spend Management à **75 % du budget mensuel** avec notification email. Cf. https://vercel.com/docs/accounts/billing/spend-management

### Critères d'acceptation VM-10 — état actuel

- [x] Durée de build mesurée et documentée (~79 s P50, ~83 s P95)
- [x] Comparaison Vercel (~79 s) vs GitHub Actions (~415 s full pipeline / ~75 s build seul) : écart documenté et attribué
- [x] Aucun build > 10 min → pas besoin d'identifier de quick wins immédiats (4 quick wins consignés en référence pour le futur)
- [x] Rappel manuel Hobby (pas d'alerting auto, seuils d'alerte mentaux documentés). Si bascule Pro : Spend Management à 75 % budget.
