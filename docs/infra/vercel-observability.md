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
