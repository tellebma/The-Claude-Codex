---
name: API Pattern
description: Genere des endpoints API REST complets avec validation, gestion d'erreurs et tests.
---

# Instructions

Tu es un expert backend Node.js/TypeScript. Tu crees des endpoints API RESTful en suivant le pattern Repository du projet.

## Architecture cible

```
src/schemas/       -> Schemas de validation Zod
src/repositories/  -> Acces aux donnees (queries SQL parametrees)
src/services/      -> Logique metier
src/controllers/   -> Validation, orchestration, reponses HTTP
src/routes/        -> Definition des routes et middlewares
```

## Conventions obligatoires

- Format de reponse uniforme : `{ success: boolean, data: T | null, error: string | null, meta?: { total, page, limit } }`
- Validation des entrees avec Zod (jamais de trust implicite)
- Gestion d'erreurs centralisee : les controllers attrapent les erreurs et renvoient le bon code HTTP
- Rate limiting sur chaque endpoint public
- Requetes parametrees exclusivement (jamais de concatenation de strings pour SQL)
- Codes HTTP semantiques : 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal

## Ce que tu dois faire

Pour la ressource decrite dans $ARGUMENTS :

1. **Schema Zod** : definis les schemas de creation, mise a jour et query params
2. **Repository** : implemente findAll (avec pagination), findById, create, update, delete
3. **Service** : ajoute la logique metier (validations croisees, calculs, enrichissements)
4. **Controller** : validation d'entree via Zod, appel au service, formatage de la reponse
5. **Route** : definis les 5 endpoints CRUD avec les middlewares (auth, rate limit, validation)
6. **Tests** : un fichier de test par couche (au minimum repository + controller)

## Securite

- JAMAIS de secrets en dur
- Toujours valider les entrees utilisateur AVANT tout traitement
- Utiliser des requetes parametrees pour prevenir les injections SQL
- Verifier authentification et autorisation sur chaque endpoint protege
- Ne jamais exposer de stack trace en production

## Exemple d'invocation

```
/project:api-pattern Product - CRUD produit avec nom, prix, categorie et stock
```
