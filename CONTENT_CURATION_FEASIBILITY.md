# Etude de faisabilite — Systeme de veille semi-automatique

> Objectif : decouvrir automatiquement les sujets tendance autour de Claude Code, les presenter au redacteur pour decision, et lui laisser la main sur la redaction.

## 1. Sources identifiees

| Source | API/Methode | Cout | Fiabilite | Valeur |
|--------|-------------|------|-----------|--------|
| **Reddit** (r/ClaudeAI, r/LocalLLaMA) | RSS feeds (`.rss` suffix) | Gratuit | Haute | Tres haute |
| **GitHub** (anthropics/claude-code) | REST API + Atom feeds | Gratuit (5K req/h) | Tres haute | Tres haute |
| **Hacker News** | Algolia API | Gratuit, sans auth | Tres haute | Haute |
| **Dev.to** | API publique + RSS | Gratuit | Haute | Moyenne |
| **Medium** | RSS feeds | Gratuit | Moyenne | Moyenne |
| **Hashnode** | GraphQL API publique | Gratuit | Haute | Moyenne |
| **Blog Anthropic** | RSS communautaires | Gratuit | Haute | Tres haute |
| **YouTube** | Data API v3 | Gratuit (10K units/jour) | Haute | Moyenne |
| **X/Twitter** | API payante | 200$/mois min | - | Basse (skip) |
| **Discord Anthropic** | Bot token requis | Gris legalement | - | Skip |

### Detail des sources gratuites

**Reddit RSS** — Chaque subreddit expose un flux RSS sans API key :
```
https://www.reddit.com/r/ClaudeAI/new/.rss
https://www.reddit.com/r/ClaudeAI/search/.rss?q=claude+code&sort=new
```
Retourne les ~25 derniers posts. Combinaison possible : `r/ClaudeAI+LocalLLaMA`.

**GitHub API** — Token personnel gratuit, 5000 req/heure :
- Releases : `GET /repos/anthropics/claude-code/releases`
- Discussions : `GET /repos/anthropics/claude-code/discussions`
- CHANGELOG : lecture directe du fichier
- Atom feed : `https://github.com/anthropics/claude-code/releases.atom`

**Hacker News Algolia** — API libre, sans auth :
```
https://hn.algolia.com/api/v1/search?query="claude code"&tags=story
https://hn.algolia.com/api/v1/search_by_date?query="claude code"&tags=story
```

**Dev.to** — API publique :
```
https://dev.to/api/articles?tag=claude&per_page=10
https://dev.to/feed/tag/claude  (RSS)
```

**Blog Anthropic** — RSS communautaires maintenus :
```
https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml
https://raw.githubusercontent.com/conoro/anthropic-engineering-rss-feed/main/anthropic_engineering_rss.xml
```

**YouTube Data API v3** — 10 000 unites/jour gratuites (1 recherche = 100 unites = ~100 recherches/jour).

---

## 2. Architecture proposee

### Pipeline

```
[DISCOVER]  -->  [DEDUPLICATE]  -->  [SCORE]  -->  [PRESENT]       [VOTE]
  Cron daily      Par hash URL       Keywords       NocoDB          Fider
  GitHub Actions   + similarite       + LLM (opt)   (dashboard)    (public)
```

### Schema detaille

```
+-----------------------------------------------------+
|  GitHub Actions (cron: 08:00 UTC, quotidien)         |
|                                                      |
|  1. FETCH (sources paralleles) :                     |
|     +-- Reddit RSS (r/ClaudeAI, r/LocalLLaMA)       |
|     +-- GitHub API (releases, discussions)           |
|     +-- HN Algolia ("claude code")                   |
|     +-- Dev.to API (tag: claude)                     |
|     +-- Medium RSS (tag: claude-code)                |
|     +-- Hashnode GraphQL                             |
|     +-- Anthropic blog RSS                           |
|     +-- YouTube Data API                             |
|                                                      |
|  2. NORMALIZE -> format commun :                     |
|     { title, url, source, date, snippet, score }     |
|                                                      |
|  3. DEDUPLICATE (check seen-urls.json)               |
|                                                      |
|  4. SCORE (keywords + seuil) :                       |
|     claude code, MCP, skills, CLAUDE.md,             |
|     hooks, prompting, agentic, subagent...           |
|     Option : Claude Haiku pour scoring intelligent   |
|                                                      |
|  5. FILTRER (score > seuil)                          |
|                                                      |
|  6. OUTPUT :                                         |
|     +-- Append data/curation/discoveries.json        |
|     +-- Commit auto dans le repo                     |
|     +-- Push vers NocoDB via API REST                |
+-----------------------------------------------------+

+-----------------------------------------------------+
|  NOCODB (dashboard curation)                         |
|                                                      |
|  - Vue kanban : A traiter / Ecrire / Ignorer / Done  |
|  - Vue grille : filtres par source, score, date      |
|  - Notifications via webhooks                        |
+-----------------------------------------------------+

+-----------------------------------------------------+
|  FIDER (vote public)                                 |
|                                                      |
|  - Le public propose des sujets                      |
|  - Le public vote (upvote) sur les propositions      |
|  - Statuts : Planifie / En cours / Termine / Decline |
|  - Croisement avec les decouvertes NocoDB            |
+-----------------------------------------------------+

+-----------------------------------------------------+
|  CURATION HUMAINE (toi)                              |
|                                                      |
|  1. Review du dashboard NocoDB + votes Fider         |
|  2. Decision : ecrire / ignorer / bookmarker         |
|  3. Redaction MDX dans /content                      |
|  4. Rebuild du site via Docker                       |
|  5. Marquer le sujet Fider comme "Termine"           |
+-----------------------------------------------------+
```

### Structure de fichiers

```
/scripts/curation/
  +-- index.ts            # Orchestrateur principal
  +-- sources/
  |   +-- reddit.ts       # Parser RSS
  |   +-- github.ts       # Client API GitHub
  |   +-- hackernews.ts   # Client Algolia HN
  |   +-- devto.ts        # Client API Dev.to
  |   +-- medium.ts       # Parser RSS Medium
  |   +-- hashnode.ts     # Client GraphQL
  |   +-- anthropic.ts    # Parser RSS blog
  |   +-- youtube.ts      # Client YouTube Data API
  +-- scoring.ts          # Scoring par keywords + LLM optionnel
  +-- dedup.ts            # Deduplication par URL
  +-- output.ts           # Creation Issue GitHub + sortie JSON

/data/curation/
  +-- seen-urls.json      # Registre de dedup
  +-- discoveries.json    # Tous les items decouverts
  +-- config.json         # Keywords, sources, seuils

/.github/workflows/
  +-- content-curation.yml  # Workflow schedule
```

### Workflow GitHub Actions

```yaml
name: Content Curation
on:
  schedule:
    - cron: '0 8 * * *'      # Quotidien a 08:00 UTC
  workflow_dispatch:           # Declenchement manuel

jobs:
  curate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx tsx scripts/curation/index.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
      - uses: peter-evans/create-issue-from-file@v5
        with:
          title: "Veille Claude Code - ${{ github.run_id }}"
          content-filepath: ./data/curation/latest-digest.md
          labels: curation
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update curation data"
          file_pattern: data/curation/*
```

---

## 3. Analyse des couts

### Phase 1 — MVP (0 EUR/mois)

| Composant | Mecanisme | Cout |
|-----------|-----------|------|
| Reddit | RSS feeds | 0 |
| GitHub | API REST (token gratuit) | 0 |
| Hacker News | Algolia API | 0 |
| Dev.to / Medium / Hashnode | API + RSS | 0 |
| Anthropic blog | RSS communautaires | 0 |
| Scheduling | GitHub Actions (gratuit repos publics) | 0 |
| Stockage | JSON dans le repo Git | 0 |
| Notifications | GitHub Issues + email auto | 0 |

**Total Phase 1 : 0 EUR/mois**

### Phase 2 — Scoring intelligent (5-10 EUR/mois)

| Composant | Cout |
|-----------|------|
| Claude Haiku API pour scoring/resume | ~5-10 EUR/mois |
| YouTube Data API | 0 (quota gratuit suffisant) |

Le scoring Haiku traiterait ~50-100 articles/jour. A ~0,25$/M tokens input, le cout est negligeable.

### Phase 3 — Dashboard de curation : NocoDB (0 EUR/mois)

Remplace la Phase 4 originale (page admin custom Next.js) par un outil existant auto-heberge.

| Composant | Cout |
|-----------|------|
| NocoDB (Docker, open source GPLv3) | 0 |
| Stockage SQLite integre | 0 |

NocoDB fournit nativement : vues kanban (ecrire/ignorer/bookmarker), grille avec filtres/tris, API REST complete pour l'integration avec le pipeline, webhooks pour les notifications. Ressources : ~100 MB RAM, une seule image Docker.

```yaml
# Ajout au docker-compose.yml
nocodb:
  image: nocodb/nocodb:latest
  ports:
    - "8081:8080"
  volumes:
    - nocodb_data:/usr/app/data/
```

### Phase 4 — Votes du public : Fider (0 EUR/mois)

Plateforme de vote/feedback open source auto-hebergee, permettant au public de proposer et voter sur les sujets a traiter.

| Composant | Cout |
|-----------|------|
| Fider (Docker, open source) | 0 |
| PostgreSQL 16 (pour Fider) | 0 |

Fonctionnalites : proposition de sujets par le public, systeme de vote (upvote), statuts (Planifie/En cours/Termine/Decline), auth par email magic link, API REST pour automatisation, ~100 MB RAM.

```yaml
# Ajout au docker-compose.yml
fider:
  image: getfider/fider:stable
  ports:
    - "8082:3000"
  environment:
    BASE_URL: https://vote.claude-codex.fr
    DATABASE_URL: postgres://fider:secret@fider_db:5432/fider?sslmode=disable
    JWT_SECRET: ${FIDER_JWT_SECRET}
    EMAIL_NOREPLY: noreply@claude-codex.fr
  depends_on:
    - fider_db

fider_db:
  image: postgres:16-alpine
  volumes:
    - fider_pg:/var/lib/postgresql/data
  environment:
    POSTGRES_USER: fider
    POSTGRES_PASSWORD: ${FIDER_DB_PASSWORD}
    POSTGRES_DB: fider
```

Alternatives considerees :

| Outil | Type | Verdict |
|-------|------|---------|
| **Fider** | Vote/feedback dedie | Recommande — UX native, zero code |
| GitHub Discussions | Polls integres | Gratuit, zero infra, mais audience limitee aux devs |
| Custom Next.js `/vote` | Composant maison | Plus de code a maintenir, NocoDB comme backend |

**Recommandation : Phase 1 + 2 (5-10 EUR/mois) + Phase 3 NocoDB (0 EUR) + Phase 4 Fider (0 EUR).**

---

## 4. Considerations legales

### RSS et APIs publiques
- Les flux RSS sont **publiquement accessibles** et ne necessitent pas d'accord API
- Agreger des **liens + resumes courts** (pas le contenu integral) releve du fair use
- Ne jamais stocker ni republier le contenu complet des articles

### Droit francais
- L'article L.112-3 du Code de la Propriete Intellectuelle protege les bases de donnees contre l'extraction non autorisee
- Agreger des **liens avec resumes brefs** est generalement admis
- La Directive Europeenne sur les bases de donnees autorise l'extraction pour usage personnel/recherche

### RGPD
- La CNIL precise que meme les donnees publiques peuvent contenir des donnees personnelles
- **Pour ce projet** : on agregera uniquement titre, URL, source, date, extrait — pas de donnees personnelles
- Ne JAMAIS stocker : noms d'utilisateurs, emails, donnees de profil
- L'affaire KASPR (amende 200K EUR) concernait le scraping de coordonnees LinkedIn — tres different de l'agregation de liens

### Recommandations
- Stocker uniquement : titre, URL, nom de la source, date, resume auto-genere
- Ne jamais stocker : pseudos, donnees personnelles, contenu integral
- Respecter les `robots.txt` des sites sources

---

## 5. Plan de mise en oeuvre

### Phase 1 — MVP (1-2 jours de dev)

**Objectif** : Pipeline fonctionnel avec les 3 sources a plus haute valeur.

1. Creer `/scripts/curation/` avec les modules Reddit RSS, GitHub API, HN Algolia
2. Implementer la deduplication par hash d'URL
3. Scoring basique par mots-cles (liste configurable)
4. Sortie JSON + creation d'Issue GitHub avec le digest
5. Workflow GitHub Actions avec cron quotidien
6. Test en `workflow_dispatch` (declenchement manuel)

**Livrable** : une Issue GitHub quotidienne listant les decouvertes du jour.

### Phase 2 — Sources complementaires (1 jour)

7. Ajouter Dev.to, Medium, Hashnode, YouTube, blog Anthropic
8. Enrichir le scoring avec des poids par source
9. Format de digest ameliore (categories, badges de source)

### Phase 3 — Scoring intelligent (0.5 jour)

10. Integrer Claude Haiku API pour scorer la pertinence (0-100)
11. Generer un resume d'une ligne par article
12. Filtrer automatiquement le bruit (score < seuil)

### Phase 4 — Dashboard NocoDB (0.5 jour)

13. Deployer NocoDB via docker-compose
14. Creer la table "discoveries" avec les champs : title, url, source, date, score, status
15. Configurer les vues : kanban (par status), grille (filtres)
16. Modifier `output.ts` pour pousser les decouvertes via API REST NocoDB (au lieu des Issues GitHub)
17. Configurer les webhooks pour notifications

### Phase 5 — Votes publics Fider (0.5 jour)

18. Deployer Fider + PostgreSQL via docker-compose
19. Configurer le domaine vote.claude-codex.fr (reverse proxy Nginx)
20. Lien depuis le site principal vers la plateforme de vote
21. Workflow : quand un article est publie, marquer le sujet Fider comme "Termine" via API

---

## 6. Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|-----------|
| Reddit change ses RSS | Moyen | Monitoring + fallback API (PRAW free tier) |
| GitHub Actions en panne | Faible | `workflow_dispatch` manuel en backup |
| Trop de bruit | Moyen | Ajuster seuils de scoring, ajouter Haiku |
| Pas assez de contenu | Faible | Elargir les mots-cles et sources |
| Rate limiting APIs | Faible | Cron 1x/jour largement dans les quotas |
| Changement ToS source | Faible | Sources diversifiees, pas de dependance unique |
| NocoDB indisponible | Faible | Fallback sur JSON + Issues GitHub |
| Fider spam/abus | Moyen | Moderation manuelle, auth email obligatoire |
| Charge serveur (3 conteneurs) | Faible | NocoDB ~100MB RAM, Fider ~100MB RAM, PG ~50MB RAM |

---

## 7. Conclusion

**Faisabilite : HAUTE.**

Le systeme est entierement realisable avec **zero cout recurrent** en Phase 1. L'approche semi-automatique (decouverte automatique + redaction manuelle) est la bonne strategie : elle garantit la qualite editoriale tout en eliminant le travail de veille manuel.

La stack est coherente avec le projet existant (Node.js/TypeScript) et s'integre naturellement via GitHub Actions.

L'ajout de NocoDB (dashboard curation) et Fider (votes publics) remplace avantageusement la page admin custom Next.js prevue initialement : zero code UI a maintenir, UX native (kanban, filtres, votes), et integration API bidirectionnelle avec le pipeline existant. Le surcout infra est minimal (~250 MB RAM supplementaires).

**Prochaine etape recommandee** : implementer la Phase 1 (Reddit RSS + GitHub API + HN Algolia) en 1-2 jours, puis enchainer sur Phase 4 (NocoDB) pour avoir le dashboard operationnel des le debut.
