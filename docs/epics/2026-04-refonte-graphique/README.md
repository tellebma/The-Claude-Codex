# Epic : Refonte graphique uniforme — The Claude Codex

**Statut** : prêt pour démarrage C1 (tokens)
**Cree le** : 2026-04-26
**Version** : 1.2 — backlog complet 32 stories / 101 points (2026-04-27)

## Objectif

Propager l'identite visuelle issue du nouveau design Claude (landing page + article) a l'ensemble du site, de maniere coherente et sans regression fonctionnelle, d'accessibilite, ou de performance. La refonte couvre 51 pages statiques, 35+ composants UI/layout/MDX, les tokens design, le dark mode, et la version EN en parallele du FR.

## Documents

- [EPIC.md](./EPIC.md) — backlog détaillé (32 user stories, 7 chantiers, 101 points)
- [SYNTHESIS.md](./SYNTHESIS.md) — synthèse design exploitable par les agents DEV (tokens, composants, mapping fichiers)
- [design-source/extracted/](./design-source/extracted/) — handoff Claude Design (CSS, HTML, JSX)

## Décisions verrouillées (2026-04-27)

- **D1 Hero** : variante `split` uniquement. Variantes `xxl` et `inline` reportées au backlog futur.
- **D2 Tweaks panel** : hors scope. Le `ThemeToggle` existant gère le dark/light.
- **D3 Stats band** : factuelles uniquement (composant `CodexStatsBand` calculé au build : nb articles, sections, langues, dernière mise à jour). Aucune vanity metric.
- **D4 Articles récents** : 3 derniers articles par `dateModified` décroissant (composant `RecentArticlesSection`).
- **D5 Accent** : cyan uniquement. Le switcher `data-accent="amber"` n'est pas implémenté. La classe `.cc-text-gradient` (shimmer animé cyan→ambre du wordmark) est conservée.
- **D6 Badges thématiques articles** : 1 type de contenu obligatoire (tutorial / guide / reference / comparison / use-case) + 0 à 2 domaines optionnels (security / devsecops / architecture / performance / tooling / productivity / migration). 1 à 3 badges max par article.

## Prochaines actions

1. **Démarrer C1 (foundation tokens)** : créer la branche `feat/refonte-graphique-RG-03-foundation-tokens` depuis `develop`, appliquer la spec section 2 du SYNTHESIS.md dans `src/app/globals.css`, créer la page interne `/design-system`. Aucun composant touché dans cette PR.
2. **Démarrer C2 et C3 en parallèle** une fois C1 mergé : C2 (layout/nav, RG-06 → RG-11) et C3 (MDX doc, RG-12 → RG-16 + RG-31 badges) sont indépendants.
3. **C4 (landing + éditorial) après C1** : RG-17 → RG-21 + RG-32 (sections data landing).
4. **C5 (pages spéciales) après C2+C3+C4** : RG-22 → RG-24.
5. **C6 (QA transverse) en clôture** : RG-25 → RG-30 (visual regression, axe-core, Lighthouse, OG images, llms.txt).

## Récapitulatif des 32 stories

| Chantier | Stories | Points |
|---|---|---|
| C0 Cadrage | RG-01, RG-02 | 4 |
| C1 Tokens | RG-03, RG-04, RG-05 | 10 |
| C2 Layout/Nav | RG-06 → RG-11 | 18 |
| C3 MDX doc | RG-12 → RG-16 + RG-31 | 24 |
| C4 Editorial/Landing | RG-17 → RG-21 + RG-32 | 25 |
| C5 Pages spéciales | RG-22 → RG-24 | 12 |
| C6 QA | RG-25 → RG-30 | 18 |
| **Total** | **32 stories** | **101 points** |
