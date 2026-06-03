# DSK-8 — Faits vérifiés (article démo : refaire une card)

Vérification : 2026-06-03.

## Périmètre

Article démo : refaire un composant existant du Codex avec la stack design + Playwright.
Composant choisi : une card de listing d'article (type `RecentArticleCard` / `ToolCard`),
proche de ce que le site utilise déjà. Le PR et les captures sont à produire plus tard.

## Faits réutilisés (déjà vérifiés en DSK-6/7 ou Sprint 1)

| Fait | Valeur | Source |
|------|--------|--------|
| Impeccable install | `npx skills add pbakaus/impeccable` | github.com/pbakaus/impeccable |
| Impeccable commandes | `/impeccable shape`, `/impeccable craft`, `/polish`, `/audit` | impeccable.style |
| Impeccable licence | Apache 2.0 | API GitHub |
| Playwright MCP | `@playwright/mcp` v0.0.75 | github.com/microsoft/playwright-mcp |
| Outils Playwright cités | `browser_navigate`, `browser_resize`, `browser_take_screenshot`, `browser_evaluate` | github.com/microsoft/playwright-mcp |

## Captures Playwright — TODO (non produites en phase rédaction)

L'article contient des emplacements `<!-- TODO capture Playwright: ... -->`. Aucune capture
réelle n'a été prise. Chaque emplacement décrit ce que la capture montrera. Liste :

1. Avant : card initiale rendue, viewport desktop 1440x900.
2. Avant : même card, viewport mobile 375x800 (montre le débordement / hiérarchie faible).
3. Pendant : sortie après `/impeccable shape` (layout textuel proposé) — capture du terminal Claude Code.
4. Pendant : premier rendu après `/impeccable craft`, desktop.
5. Après : card finale, desktop 1440x900.
6. Après : card finale, mobile 375x800 (responsive correct).
7. (optionnel) Diff visuel avant/après côte à côte.

## Notes éditoriales

- Les chiffres de "verdict" (temps total, nb d'itérations) sont présentés comme un retour
  d'expérience qualitatif, pas comme un benchmark mesuré (cf. EPIC W4 : pas de benchmark).
  Formulation : "3 itérations, ~25 min" présentée comme ordre de grandeur vécu, pas comme métrique.
- Le code diff est illustratif (avant/après Tailwind) ; à remplacer par le vrai diff du PR à la phase suivante.
- Cross-links : /content/stack-design-claude-code (cornerstone), /mcp/workflow-design-playwright (DSK-6),
  /skills/impeccable.

## Points d'attention pour les phases suivantes

- Produire les 7 captures réelles sur le projet et les déposer dans public/.
- Remplacer le code diff illustratif par le diff réel du PR.
- Confirmer le composant exact refait (RecentArticleCard vs ToolCard) au moment des captures.
