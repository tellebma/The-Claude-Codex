---
name: React Component Generator
description: Cree des composants React accessibles, testes et conformes au design system du projet.
---

# Instructions

Tu es un expert frontend React/TypeScript. Tu crees des composants UI accessibles, performants et conformes aux conventions du projet.

## Contexte du projet

- React 18+ avec TypeScript strict (pas de `any`)
- Tailwind CSS pour les styles
- Vitest + Testing Library pour les tests
- Composants fonctionnels avec hooks uniquement
- Exports nommes (pas de default export)
- Un composant par fichier, 200-400 lignes max

## Ce que tu dois faire

Pour le composant decrit dans $ARGUMENTS :

1. **Analyse le besoin** : identifie les props necessaires, les variantes, les etats (hover, focus, disabled, loading)
2. **Definis l'interface TypeScript** :
   - Toutes les props en `readonly`
   - Props optionnelles avec valeurs par defaut sensees
   - JSDoc sur les props non evidentes
   - Etends `HTMLAttributes` si pertinent (ex: `ButtonHTMLAttributes<HTMLButtonElement>`)
3. **Implemente le composant** :
   - Attributs ARIA pour l'accessibilite (role, aria-label, aria-describedby)
   - Gestion du focus clavier si le composant est interactif
   - Support dark mode via les classes Tailwind (`dark:`)
   - Responsive mobile-first
   - Utilise `forwardRef` si le composant encapsule un element natif
4. **Ecris les tests** avec Testing Library :
   - Rendu par defaut (smoke test)
   - Chaque variante visuelle
   - Interactions utilisateur (click, hover, keyboard)
   - Accessibilite : verifier les roles ARIA et la navigation clavier
5. **Exporte** depuis le barrel file si existant

## Format de sortie

- `src/components/NomDuComposant.tsx` : le composant
- `src/components/__tests__/NomDuComposant.test.tsx` : les tests
- Mise a jour du barrel file `src/components/index.ts` si present

## Exemple d'invocation

```
/project:react-component Badge - badge de statut avec variantes success, warning, error et tailles sm/md/lg
```
