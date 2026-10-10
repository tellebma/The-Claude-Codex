# Newsletter capture (THE-4)

Capture des emails visiteurs pour fédérer la communauté autour de l'IA générative.

## Architecture

Le site est exporté en **statique** (`next.config.mjs` → `output: 'export'`).
Il n'y a donc **pas de runtime serveur Next** : ni server action, ni route
handler. La persistance se fait **côté client** vers l'API REST PostgREST de
Supabase.

```
NewsletterForm (client)
  └─ subscribeEmail()            src/lib/newsletter/subscribe.ts
       ├─ isValidEmail()         src/lib/newsletter/validation.ts
       ├─ remainingCooldownMs()  src/lib/newsletter/rate-limit.ts  (anti-flood)
       └─ fetch POST /rest/v1/newsletter_subscribers
            (apikey + Bearer = clé anon ; protégé par RLS insert-only)
```

### Pourquoi pas le SDK `@supabase/supabase-js` ?

Pour **rester lean** (page-speed first-class). Un simple `fetch` PostgREST
suffit pour un insert et évite d'alourdir le bundle d'un site statique.

## Sécurité

- Seule la **clé anon publique** est embarquée (conforme au périmètre THE-4 ;
  toute clé sensible au-delà → escalade CEO).
- La sécurité réelle repose sur **Row Level Security** : le rôle `anon` ne
  peut qu'`INSERT`. Aucune policy `select/update/delete` → impossible de lire
  ou modifier les emails avec la clé publique.
- Contrainte d'unicité `lower(email)` → un email = une inscription.
- **Honeypot** (champ caché `company`) + **cooldown** client (30 s) pour
  décourager les bots/flood.
- Structure **double-opt-in ready** : `status` démarre à `pending`. La
  confirmation par email (passage à `confirmed`) sera câblée ultérieurement
  via une edge function (hors scope THE-4).

## Mise en service

1. Créer un projet Supabase (ou réutiliser celui de la société).
2. Appliquer la migration `supabase/migrations/0001_newsletter_subscribers.sql`
   (Supabase Studio → SQL editor, ou `supabase db push`, ou MCP
   `apply_migration`).
3. Renseigner les variables d'environnement (Vercel + `.env.local`) :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon publique>
   ```
4. Redéployer. Tant que ces variables sont absentes, le formulaire s'affiche
   mais renvoie un message « momentanément indisponible » sans casser la page.

## Vérifier

- Soumettre un email valide sur `/#newsletter` ou dans le footer → état de
  succès affiché.
- Vérifier la ligne dans Supabase (`status = 'pending'`).
- Re-soumettre le même email → traité comme « déjà inscrit » (idempotent).
