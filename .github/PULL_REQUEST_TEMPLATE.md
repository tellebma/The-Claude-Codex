<!--
Le titre de cette PR doit suivre Conventional Commits :
  https://www.conventionalcommits.org

Exemples valides :
  feat: ajouter la page context-rot
  fix(footer): corriger l'affichage de la version
  chore(deps): bump next-mdx-remote vers 5.0
  docs: clarifier la section sur les hooks

Le titre devient le message du commit squash après merge, et il pilote
semantic-release. Un titre non conforme = pas de release auto + check CI
"PR Title Lint" en échec.

Types qui déclenchent une release :
  feat  -> minor (1.x.0)
  fix   -> patch (1.0.x)
  perf  -> patch
  + footer "BREAKING CHANGE:" -> major (x.0.0)

Types qui ne déclenchent PAS de release :
  docs, style, refactor, test, chore, ci, build, revert
-->

## Résumé

<!-- Décrire en 2-3 lignes ce que cette PR change et pourquoi. -->

## Test plan

<!-- Cocher au fur et à mesure : -->

- [ ] `npm run lint && npm run type-check` passent
- [ ] `npm run build` passe (si fichiers MDX ou config Next modifiés)
- [ ] Vérifié sur `/fr/` ET `/en/` si modifications de contenu
- [ ] Pas de secret ou clé API committé
- [ ] SonarQube Quality Gate OK (sera vérifié en CI)
