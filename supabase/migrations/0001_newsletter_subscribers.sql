-- THE-4 — Table de capture newsletter + RLS « insert-only » pour la cle anon.
--
-- Contexte : le site est exporte en statique (Next.js `output: 'export'`),
-- il n'y a pas de runtime serveur. L'insertion se fait donc depuis le
-- navigateur avec la cle anon publique. La securite repose entierement sur
-- Row Level Security : le role `anon` ne peut QU'inserer, jamais lire ni
-- modifier. Aucune adresse n'est exposee cote client.
--
-- Structure « double-opt-in ready » : la colonne `status` demarre a
-- 'pending'. La confirmation (envoi d'un email + passage a 'confirmed') sera
-- cablee plus tard cote serveur/edge function — hors scope THE-4.
--
-- A appliquer via : Supabase Studio (SQL editor), la CLI
-- (`supabase db push`), ou l'outil MCP `apply_migration`.

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'unsubscribed')),
  source        text,
  confirmed_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- Unicite insensible a la casse : un email = une inscription.
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

-- Active RLS : sans policy, tout est refuse par defaut.
alter table public.newsletter_subscribers enable row level security;

-- Policy unique : le role anon (cle publique) peut UNIQUEMENT inserer.
-- Pas de policy select/update/delete -> lecture et modification impossibles
-- avec la cle anon. La gestion (export, confirmation) passe par la cle
-- service_role cote serveur.
drop policy if exists "anon can insert subscribers"
  on public.newsletter_subscribers;

create policy "anon can insert subscribers"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (
    -- Garde-fou cote base : email non vide et format minimal.
    char_length(email) between 3 and 254
    and position('@' in email) > 1
    -- Empeche l'auto-attribution d'un statut privilegie a l'insertion.
    and status = 'pending'
    and confirmed_at is null
  );
