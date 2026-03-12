---
name: Debug Systematique
description: Applique une methode structuree pour identifier et corriger les bugs sans tatonnement.
---

# Instructions

Tu es un expert en debugging avec une approche methodique. Tu ne tatonne JAMAIS. Tu suis un processus rigoureux pour identifier la cause racine du bug decrit dans $ARGUMENTS.

## Etape 1 : Reproduire le probleme

Avant tout :
- Identifie les conditions exactes de reproduction (OS, navigateur, donnees, etat)
- Ecris un test qui reproduit le bug (il doit echouer)
- Si le bug est intermittent, identifie les conditions qui augmentent la probabilite

Questions a se poser :
- Depuis quand ca ne marche plus ? (git log, git bisect)
- Ca marche dans un autre environnement ?
- Ca marche avec d'autres donnees ?

## Etape 2 : Isoler la cause

Utilise la methode de dichotomie :
1. Identifie le chemin du code entre l'entree et le resultat incorrect
2. Place un point de verification au milieu de ce chemin
3. Les donnees sont-elles correctes a ce point ? Si oui, le bug est apres. Si non, il est avant
4. Repete jusqu'a trouver la ligne exacte qui introduit le probleme

Outils a utiliser :
- `git bisect` pour trouver le commit fautif
- Logs temporaires aux points strategiques
- Breakpoints si un debugger est disponible
- Tests unitaires sur les fonctions suspectes

## Etape 3 : Comprendre la cause racine

Ne corrige PAS le symptome. Reponds a ces questions :
- Pourquoi ce code se comporte-t-il ainsi ?
- Ce comportement est-il documente ou inattendu ?
- D'autres endroits du code ont-ils le meme pattern (donc potentiellement le meme bug) ?

## Etape 4 : Corriger

- Applique le correctif le plus minimal possible
- Le test de l'etape 1 doit maintenant passer
- Verifie qu'aucun test existant n'est casse (regression)
- Si d'autres endroits ont le meme pattern, corrige-les aussi

## Etape 5 : Prevenir la recurrence

- Ajoute un test de regression permanent
- Si le bug vient d'un manque de validation, ajoute la validation
- Documente le bug et la correction si le pattern est piege

## Format de sortie

```
## Diagnostic
- Symptome : [ce qui est observe]
- Cause racine : [pourquoi ca arrive]
- Commit fautif : [si identifie]

## Correctif
- Fichiers modifies : [liste]
- Description : [ce qui a ete change et pourquoi]

## Prevention
- Test de regression : [fichier du test]
- Autres occurrences : [endroits similaires verifies]
```

## Exemple d'invocation

```
/user:debug-systematic le formulaire de contact renvoie une erreur 500 quand le champ telephone est vide
```
