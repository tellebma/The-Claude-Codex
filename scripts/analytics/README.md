# Weekly analytics pipeline

Cron hebdo qui croise **Google Search Console** et **Matomo** pour produire un rapport
d'alertes actionnables, le pousse dans le vault Obsidian personnel et notifie Discord.

Ticket backlog : **MT21** (voir `docs/gsc-analysis/2026-04-20/ANALYSIS.md`).

## Architecture

```
.github/workflows/weekly-analytics.yml
  |
  v
scripts/analytics/run.ts              -> orchestrateur
  +-- config.ts                       -> chargement env vars + plages de dates
  +-- fetch-gsc.ts                    -> Search Analytics API (JWT RS256)
  +-- fetch-matomo.ts                 -> Matomo Reporting API (POST)
  +-- detect-alerts.ts                -> logique pure de detection (testee)
  +-- render-report.ts                -> markdown + resume Discord (teste)
  +-- notify-discord.ts               -> POST webhook
  +-- types.ts                        -> types partages

docs/analytics/<YYYY-MM-DD>/          -> sortie temporaire dans le runner CI
  +-- gsc-queries.csv
  +-- gsc-pages.csv
  +-- matomo-pages.csv
  +-- matomo-events.csv
  +-- alerts.json
  +-- REPORT.md
          |
          v
tellebma/claude-code-obsidian-brain   -> repo vault (push final)
  raw/analytics/<YYYY-MM-DD>/         -> fichiers copies ici, immuables
```

Le workflow ne touche plus au repo `claude-codex` : aucune PR, aucune branche `auto/`.
Les artefacts du run restent disponibles 30 jours via **Actions -> run -> Artifacts**
pour debug.

## Declencheurs

- `schedule: "0 6 * * 1"` : chaque lundi a 06:00 UTC
- `workflow_dispatch` : trigger manuel depuis l'onglet Actions, avec override
  `period_days` (par defaut 7)

## Secrets / variables a configurer dans GitHub

Repo -> Settings -> Secrets and variables -> Actions

### Secrets

| Secret | Source | Scope minimum |
|--------|--------|---------------|
| `GSC_SERVICE_ACCOUNT_JSON` | GCP Console -> IAM -> Service Accounts | Lecture GSC propriete `sc-domain:claude-codex.fr` |
| `MATOMO_SITE_ID` | Matomo UI (idSite en haut a gauche) | - |
| `MATOMO_TOKEN_AUTH` | Matomo UI -> Personal -> Security -> Auth tokens | Read sur le site Claude Codex |
| `DISCORD_WEBHOOK_URL` | Discord -> canal -> Integrations -> Webhooks | Send only |
| `BRAIN_REPO_TOKEN` | GitHub -> Settings -> Developer settings -> Personal access tokens (fine-grained) | `Contents: Read and write` sur le repo vault uniquement |

### Variables (non sensibles, overridables)

| Variable | Default |
|----------|---------|
| `GSC_SITE_URL` | `sc-domain:claude-codex.fr` |
| `MATOMO_BASE_URL` | `https://matomo.tellebma.fr` |
| `BRAIN_REPO` | `tellebma/claude-code-obsidian-brain` |
| `BRAIN_BRANCH` | `main` |
| `BRAIN_RAW_DIR` | `raw/analytics` |

## Setup detaillle

### 1. Creer le service account GCP

1. console.cloud.google.com -> creer/selectionner un projet
2. APIs & Services -> Library -> activer `Google Search Console API`
3. IAM & Admin -> Service Accounts -> Create service account
   - name : `claude-codex-analytics`
   - roles : aucun requis au niveau GCP (la permission est donnee dans Search Console)
4. Onglet Keys -> Add key -> JSON -> telecharger
5. Search Console -> propriete `claude-codex.fr` -> Settings -> Users and permissions
6. Add user -> coller l'email du SA -> role **Restricted**
7. Coller le contenu JSON entier dans le secret GitHub `GSC_SERVICE_ACCOUNT_JSON`

### 2. Regenerer le token Matomo

1. Se connecter a `https://matomo.tellebma.fr`
2. Avatar en haut a droite -> Personal -> Security -> Auth tokens
3. Create new token, description : `github-actions-weekly-analytics`
4. Copier le token, le coller dans `MATOMO_TOKEN_AUTH`
5. Noter l'idSite (visible dans l'UI Matomo en haut a gauche du tableau de bord), le coller dans `MATOMO_SITE_ID`

### 3. Creer le webhook Discord

1. Canal dedie (suggere : `#seo-alerts`)
2. Parametres du canal -> Integrations -> Webhooks -> Nouveau
3. Nom : `Claude Codex Analytics`, icone au choix
4. Copier l'URL -> `DISCORD_WEBHOOK_URL`

## Premier lancement

Une fois les 5 secrets en place :

1. Repo -> Actions -> **Weekly analytics**
2. Run workflow -> bouton vert, optionnel `period_days=30` pour le 1er run (donnees
   plus riches)
3. Attendre ~1 min, verifier :
   - le job est vert
   - le message Discord est arrive
   - dans le repo vault : commit `chore(analytics): weekly report <date>` sur `main`
   - dans Obsidian apres pull : `raw/analytics/<date>/REPORT.md` est visible
   - (optionnel debug) l'artefact `analytics-<date>` du run Actions contient la meme chose

## Alertes (niveau 3)

Seuils dans `detect-alerts.ts`, constantes `THRESHOLDS`.

| Kind | Quand ca se declenche | Severite |
|------|------------------------|----------|
| `ctr_urgent` | page avec >= 100 impressions et 0 clic sur la periode | critical |
| `position_drop` | page qui perd >= 2 rangs par rapport a la periode precedente | warning |
| `query_opportunity` | query avec >= 50 imp, 0 clic, position 5-15 | warning |
| `ctr_anomaly` | page en position < 5 avec CTR < 2 % | warning |
| `engagement_low` | scroll 75 % global < 20 % sur >= 50 pageviews | info |
| `tracking_mismatch` | clics GSC > 0, position top 10, pageviews Matomo = 0 | info |
| `funnel_drop` | etape configurator avec conversion < 50 % (min 10 sessions) | warning |

## Dev local

Pre-requis : Node 22 pour le support natif TypeScript (`node scripts/analytics/run.ts`).

```bash
# Variables d'env locales (ne pas committer)
export GSC_SERVICE_ACCOUNT_JSON="$(cat ~/.config/claude-codex/gsc-sa.json)"
export MATOMO_SITE_ID=1
export MATOMO_TOKEN_AUTH=xxxxxxxxxxxx
export DISCORD_WEBHOOK_URL=  # laisse vide pour skip la notif
export ANALYTICS_OUTPUT_DIR=/tmp/analytics-dry-run

node scripts/analytics/run.ts
```

Tests :

```bash
npx vitest run __tests__/analytics/
```

## Limites connues

- Pagination GSC non implementee : au-dela de 25 000 lignes de queries, on en perd.
  Pas un probleme au volume actuel (~350 queries/sem).
- `scroll_depth` agrege : la table pages ne croise pas encore scroll 75 % par URL.
  Version 2 : utiliser `Events.getNameFromActionId` pour descendre a la page.
- L'alerte `position_drop` reutilise le meme endpoint GSC pour la periode N-1, donc
  consomme 2x les quotas (largement suffisant : 25 000 requetes/jour gratuit).
- Le push dans le vault cible `main` directement (pas de PR) : c'est un fichier de
  donnees, pas du code. Respecte la regle "Ne jamais modifier `raw/`" : chaque run
  ajoute un nouveau dossier horodate, aucun fichier existant n'est touche.
