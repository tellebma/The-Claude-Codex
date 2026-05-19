# EPIC : Script de découverte et maintenance des repos Claude Code GitHub (2026-05)

> Source : demande PO 2026-05-12. Concrétise W5 (out of scope MVP) de l'EPIC Ecosystem trending repos et la section "À automatiser en chore Sprint 4" qui mentionne déjà `scripts/refresh-ecosystem.ts` + GitHub Action cron mensuel.
> Date d'ouverture : 2026-05-12
> Effort estimé : **18 SP** (8 stories sur 2 sprints)
> Pré-requis : EPIC Ecosystem trending repos Sprint 1 livré (ECO-1 à ECO-5 mergés) pour avoir les pages MDX à maintenir
> Priorité : Backlog moyen terme, post-clôture ECO Sprint 3 (ne pas démarrer avant)

---

## Contexte

### Pourquoi cet EPIC maintenant

L'EPIC Ecosystem (`EPIC-ecosystem-trending-repos-2026-05.md`) a livré 9/12 stories (75%) qui produisent 11 pages d'inventaire `/ecosystem/*` et 4 pages enrichies (mémoire, tokens, templates, observabilité). Ces pages portent **un risque structurel** explicitement noté dans l'EPIC source :

> "Le risque #1 d'une page 'awesome' : devenir obsolète en 3 mois."

Le process manuel proposé en attendant (J+30 mensuel, refresh à la main des compteurs et de la liste) tient pour 1 à 2 cycles, pas pour 12 mois. Le coût humain dépasse vite la valeur SEO de chaque page. Cet EPIC traite la dette à la racine en automatisant :

1. **La découverte** des nouveaux repos Claude Code qui méritent d'entrer dans les listes
2. **La détection de sortie** (repos archivés, abandonnés, qui perdent leur traction)
3. **La mise à jour des compteurs étoiles** approximés dans les MDX
4. **La vérification des liens morts** vers GitHub
5. **La notification** quand un repo viral émerge (croissance forte)

### Ce que cet EPIC n'est pas

- Pas une refonte du contenu éditorial : la curation reste humaine, le script propose, le PO valide
- Pas un crawler généraliste : périmètre strict aux repos liés à Claude Code (mots-clés ciblés)
- Pas un système temps réel : un cycle mensuel suffit pour le besoin SEO
- Pas un remplacement de l'EPIC ECO : c'est sa chore de maintenance, à activer une fois les pages stables

### Stack technique cible

| Composant | Choix | Justification |
|-----------|-------|---------------|
| Langage | TypeScript (Node 20) | Aligne avec la stack du site, partage `tsconfig.json` |
| API GitHub | `@octokit/rest` ou `gh` CLI | À trancher en ECO-DISC-1 selon disponibilité du token CI |
| Authentification | `GITHUB_TOKEN` GitHub Action ou PAT local | Limite API à 5000 req/h authentifié (à confirmer en SR-1) |
| Stockage état | Fichier JSON commité `data/ecosystem-state.json` | Diff lisible en PR, pas de DB externe |
| Output rapport | Markdown `docs/ecosystem/discovery-YYYY-MM.md` | Lisible humain, commitable, traçable |
| Déclencheur | GitHub Action cron mensuel + manual dispatch | Aligné sur le rythme de refresh de l'EPIC ECO |
| Notifications | Optionnel : webhook Discord/Slack | Hors MVP, ECO-DISC-7 en SHOULD HAVE |

### Mots-clés de découverte

Liste validée à partir de l'annexe "repos sources de l'inventaire" de l'EPIC ECO :

```
"claude code", "claude-code", "anthropic claude",
"mcp server", "claude skills", "claude plugins",
"claude hooks", "claude agents", "claude memory"
```

Stratégie : pour chaque mot-clé, query `gh search repos --sort=stars --limit=100`, fusionner, dédupliquer, comparer à `data/ecosystem-state.json`.

---

## Priorisation MoSCoW

### MUST HAVE (10 SP, Sprint 1) — Pipeline de découverte fonctionnel

| ID | Story | SP | Livrable |
|----|-------|----|----------|
| ECO-DISC-1 | Script `scripts/refresh-ecosystem.ts` : query GitHub API sur les 9 mots-clés validés, fusion, dédoublonnage, écriture `data/ecosystem-state.json` (snapshot mensuel). Mode `--dry-run` obligatoire. Gestion des rate limits (pause 60s si 403) | 3 | `scripts/refresh-ecosystem.ts`, `data/ecosystem-state.json` |
| ECO-DISC-2 | Génération du rapport mensuel `docs/ecosystem/discovery-YYYY-MM.md` : nouveaux entrants (stars > seuil), sortants (archivés, perte > 50% stars), top movers (+X% mois sur mois), top stable. Format markdown table-driven, lisible en PR | 3 | Template + générateur dans `scripts/refresh-ecosystem.ts` |
| ECO-DISC-3 | Heuristics de qualité pour filtrer les candidats : stars > 100, dernier commit < 6 mois, README ≥ 200 caractères, blocklist anti-spam (`free-claude-code`, wrappers de bypass auth, repos clonés sans valeur ajoutée). Liste blocklist commitée dans `scripts/lib/ecosystem-blocklist.ts` | 2 | `scripts/lib/ecosystem-filters.ts` + tests Vitest |
| ECO-DISC-4 | GitHub Action `.github/workflows/refresh-ecosystem.yml` : cron mensuel 1er du mois 06:00 UTC + `workflow_dispatch` manuel. Ouvre une PR draft `chore/ecosystem-refresh-YYYY-MM` avec le rapport + état mis à jour. Assigné au PO pour validation | 2 | `.github/workflows/refresh-ecosystem.yml` |

### SHOULD HAVE (6 SP, Sprint 2) — Vérifications de santé et MAJ automatique

| ID | Story | SP | Livrable |
|----|-------|----|----------|
| ECO-DISC-5 | Script `scripts/check-external-links.ts` (déjà nommé dans risques ECO) : parcourt tous les `[text](https://github.com/...)` des MDX `content/{fr,en}/ecosystem/*` + 4 pages ECO-6 à ECO-9, vérifie code HTTP 200 et `archived: false` via API. Sortie : rapport markdown + exit code 1 si liens morts détectés | 2 | `scripts/check-external-links.ts` + intégration au workflow |
| ECO-DISC-6 | MAJ automatique des compteurs étoiles approximés (`~25k★`) dans les MDX `content/{fr,en}/ecosystem/*`. Round à 1 chiffre significatif sous 10k (5.2k → 5k), 2 chiffres au-dessus (124.7k → 125k). Inclus dans la PR mensuelle. `dateModified` du frontmatter + `SITE_PAGES` mis à jour automatiquement | 2 | Extension de `refresh-ecosystem.ts` + tests parité MDX/state |
| ECO-DISC-7 | Webhook Discord (canal `#claude-codex-alerts`, optionnel via secret) : alerte instantanée quand un repo nouvellement détecté dépasse 10k★ ou croît de >10x en 30 jours. Format embed avec lien repo + comparaison stars | 2 | Module `scripts/lib/notify-discord.ts` + secret Github `DISCORD_WEBHOOK_URL` |

### COULD HAVE (2 SP, Sprint 2) — Qualité du code automatisé

| ID | Story | SP | Livrable |
|----|-------|----|----------|
| ECO-DISC-8 | Tests Vitest complets : 80%+ coverage sur `refresh-ecosystem.ts`, `check-external-links.ts`, filtres. Fixtures API GitHub mockées (pas de hit réseau en test). Mode `--dry-run` testé avec snapshot | 2 | `__tests__/scripts/ecosystem/*.test.ts` |

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Auto-merge de la PR mensuelle sans review humaine | La curation éditoriale reste humaine, le script propose, le PO décide |
| W2 | Extension à d'autres écosystèmes (Cursor, Aider, etc.) | Hors scope du projet "The Claude Codex" |
| W3 | Dashboard temps réel des stats GitHub | Out of scope SEO, complexité ROI faible |
| W4 | Réécriture des descriptions MDX par LLM | Risque de drift éditorial, hors scope automation pure |
| W5 | Tracking npm downloads croisé avec stars | Données pas fiables pour cette catégorie de repos |

---

## Architecture du script

### Arborescence cible

```
scripts/
├── refresh-ecosystem.ts            ← ECO-DISC-1 (entrée principale)
├── check-external-links.ts         ← ECO-DISC-5
└── lib/
    ├── ecosystem-filters.ts        ← ECO-DISC-3 (heuristics)
    ├── ecosystem-blocklist.ts      ← ECO-DISC-3 (liste noire)
    ├── ecosystem-state.ts          ← Lecture/écriture data/ecosystem-state.json
    ├── github-client.ts            ← Wrapper @octokit avec rate limit handling
    ├── markdown-report.ts          ← ECO-DISC-2 (génération rapport)
    └── notify-discord.ts           ← ECO-DISC-7 (optionnel)

data/
└── ecosystem-state.json            ← Snapshot mensuel des repos suivis

docs/ecosystem/
├── discovery-2026-05.md            ← Rapport mensuel humain-lisible
├── discovery-2026-06.md
└── ...

.github/workflows/
└── refresh-ecosystem.yml           ← ECO-DISC-4

__tests__/scripts/ecosystem/
├── refresh-ecosystem.test.ts
├── check-external-links.test.ts
└── filters.test.ts
```

### Structure de `data/ecosystem-state.json`

```json
{
  "lastRefresh": "2026-05-12T06:00:00Z",
  "totalRepos": 47,
  "repos": [
    {
      "fullName": "anthropics/claude-plugins-official",
      "url": "https://github.com/anthropics/claude-plugins-official",
      "description": "Official Anthropic plugins marketplace",
      "stars": 19234,
      "language": "TypeScript",
      "lastCommit": "2026-05-08T14:23:00Z",
      "archived": false,
      "category": "plugins",
      "official": true,
      "firstSeen": "2026-05-12T06:00:00Z",
      "history": [
        { "date": "2026-05-12", "stars": 19234 }
      ]
    }
  ]
}
```

### Format du rapport mensuel

```markdown
# Discovery Report : 2026-05

## Résumé exécutif

- **47 repos suivis** (+3 vs avril)
- **3 nouveaux entrants** méritent une revue manuelle
- **1 sortant** : repo archivé par l'owner
- **2 top movers** : +145% et +89% sur 30 jours

## Nouveaux entrants à curer

| Repo | ⭐ | Langue | Dernier commit | Catégorie suggérée |
|------|----|--------|----------------|--------------------|
| ...  | ... | ... | ... | ... |

## Sortants à retirer

| Repo | Raison |
|------|--------|
| owner/repo | Archivé le 2026-04-23 |

## Top movers (>50% croissance stars sur 30 jours)

| Repo | Stars J-30 → J0 | Variation |
|------|-----------------|-----------|
| ...  | ... | ... |

## Liens morts détectés

(aucun) ou liste des liens 404 par fichier MDX

## Actions PO

- [ ] Valider entrée de `repo-a` dans `/ecosystem/awesome-skills`
- [ ] Retirer `repo-b` (archivé) des 4 pages où il est cité
- [ ] Vérifier la légitimité éditoriale de `repo-c` (pic suspect)
```

---

## Critères d'acceptation par story

### ECO-DISC-1 — Script `refresh-ecosystem.ts` (3 SP)

- [ ] Script TypeScript exécutable via `npm run ecosystem:refresh`
- [ ] Query les 9 mots-clés validés via GitHub API
- [ ] Gère le rate limit (pause 60s sur 403, retry 3 fois max)
- [ ] Mode `--dry-run` n'écrit rien sur disque
- [ ] Écrit `data/ecosystem-state.json` avec format documenté ci-dessus
- [ ] Log human-readable (nombre de repos traités, durée, erreurs)
- [ ] Exit code 0 si succès, 1 si erreur réseau, 2 si quota dépassé
- [ ] Tests Vitest sur la fusion/dédoublonnage avec fixtures GitHub mockées

### ECO-DISC-2 — Rapport markdown mensuel (3 SP)

- [ ] Génère `docs/ecosystem/discovery-YYYY-MM.md` (nom auto via date système)
- [ ] Sections obligatoires : résumé exécutif, nouveaux entrants, sortants, top movers, actions PO
- [ ] Si aucun changement : génère quand même le rapport avec section "Aucun mouvement notable"
- [ ] Diff base sur le mois précédent (lit `data/ecosystem-state.json` archivé en git)
- [ ] Top movers calculés sur croissance % stars (pas absolu)

### ECO-DISC-3 — Heuristics qualité (2 SP)

- [ ] Filtre `minStars: 100` configurable
- [ ] Filtre `maxAgeDays: 180` sur le dernier commit
- [ ] Filtre `minReadmeLength: 200`
- [ ] Blocklist statique dans `ecosystem-blocklist.ts` : `free-claude-code`, patterns `bypass-auth`, wrappers de proxy douteux (à compléter en revue PO)
- [ ] Détection clones évidents : description identique à un repo officiel, fork sans commit depuis 30 jours
- [ ] Tests Vitest avec 10+ cas (positifs + négatifs) par filtre

### ECO-DISC-4 — GitHub Action cron mensuel (2 SP)

- [ ] Fichier `.github/workflows/refresh-ecosystem.yml`
- [ ] Trigger `schedule: '0 6 1 * *'` (1er du mois 06:00 UTC) + `workflow_dispatch`
- [ ] Permissions minimales : `contents: write`, `pull-requests: write`
- [ ] Setup Node 20 + cache npm
- [ ] Lance `npm run ecosystem:refresh`
- [ ] Lance `npm run ecosystem:check-links` (chaîné via `&&`)
- [ ] Ouvre une PR draft via `peter-evans/create-pull-request@v7` (ou équivalent maintenu)
- [ ] Branche : `chore/ecosystem-refresh-YYYY-MM`
- [ ] PR assignée au PO (`assignees: tellebma`)
- [ ] Label `ecosystem-chore` ajouté automatiquement
- [ ] Documentation README de la procédure de validation

### ECO-DISC-5 — Vérification liens morts (2 SP)

- [ ] Script `scripts/check-external-links.ts`
- [ ] Parcourt récursivement `content/{fr,en}/ecosystem/**/*.mdx` + `content/{fr,en}/advanced/{memoire-persistante,optimisation-tokens,observabilite-monitoring}.mdx` + `content/{fr,en}/getting-started/templates-starter-kits.mdx`
- [ ] Extrait tous les liens `[text](https://github.com/owner/repo*)`
- [ ] Pour chacun : HEAD request, suit redirects, check 200 OK
- [ ] Pour les GitHub repos : appel API `GET /repos/{owner}/{repo}` pour vérifier `archived: false`
- [ ] Rapport markdown + exit code 1 si ≥ 1 lien mort
- [ ] Mode `--report-only` (exit 0 toujours, pour reporting non bloquant)

### ECO-DISC-6 — MAJ automatique des compteurs étoiles (2 SP)

- [ ] Lit `data/ecosystem-state.json`
- [ ] Pour chaque repo cité dans un MDX `content/{fr,en}/ecosystem/*` : recherche les patterns `~XXkstar`, `~XX.Xk★`, etc. et met à jour avec la valeur arrondie de `state.json`
- [ ] Round selon règle : < 10k → 1 chiffre sig (5.2k → 5k), ≥ 10k → 2 chiffres sig (124.7k → 125k)
- [ ] Met à jour `dateModified` du frontmatter à `today` (format ISO `YYYY-MM-DD`)
- [ ] Met à jour `SITE_PAGES` de `lib/metadata.ts` avec la même date
- [ ] Tests Vitest : input MDX synthétique → output attendu

### ECO-DISC-7 — Webhook Discord viral repo (2 SP)

- [ ] Module `scripts/lib/notify-discord.ts`
- [ ] Trigger : repo nouvellement détecté avec stars ≥ 10k OU croissance ≥ 10x sur 30 jours
- [ ] Format embed Discord : titre, description, ⭐, langue, lien repo
- [ ] Secret GitHub `DISCORD_WEBHOOK_URL` configuré dans le workflow
- [ ] Si secret absent : skip silencieux (pas d'erreur)
- [ ] Test Vitest avec fixture payload + mock fetch

### ECO-DISC-8 — Tests Vitest et coverage (2 SP)

- [ ] Coverage ≥ 80 % sur les 5 fichiers du dossier `scripts/lib/`
- [ ] Coverage ≥ 80 % sur `refresh-ecosystem.ts` et `check-external-links.ts`
- [ ] Mocks GitHub API via fixtures dans `__tests__/fixtures/github/`
- [ ] Snapshot test du rapport markdown généré
- [ ] CI : tests obligatoires sur PR touchant `scripts/` ou `__tests__/scripts/`

---

## Critères d'acceptation EPIC

- [ ] Pipeline mensuel automatique opérationnel : PR draft générée le 1er de chaque mois
- [ ] Rapport `docs/ecosystem/discovery-YYYY-MM.md` lisible et actionnable par le PO
- [ ] 0 lien mort dans les pages `/ecosystem/*` au moment du merge (validation via `check-external-links.ts`)
- [ ] Premier cycle réel (2026-06-01) produit une PR validable en moins de 15 min de revue PO
- [ ] Documentation `docs/ecosystem/MAINTENANCE.md` qui décrit la procédure end-to-end : que faire quand la PR mensuelle arrive
- [ ] Tests Vitest passent à 80%+ coverage
- [ ] `npm run ecosystem:refresh -- --dry-run` exécutable en local sans token (mock mode)
- [ ] SonarQube Quality Gate OK sur les nouveaux fichiers

---

## Métriques de succès (J+90)

| Métrique | Cible 3 mois |
|----------|--------------|
| Cycles mensuels exécutés sans intervention manuelle | 3 / 3 |
| Temps moyen de revue PO de la PR mensuelle | ≤ 15 min |
| Nouveaux repos identifiés et intégrés via le script | ≥ 5 |
| Repos archivés détectés et retirés via le script | ≥ 1 |
| Liens morts détectés en CI mensuelle | 0 au merge |
| Faux positifs dans le rapport (repos non pertinents proposés) | ≤ 20 % |
| Charge humaine de maintenance des pages `/ecosystem/*` | Divisée par 4 vs process manuel |

---

## Risques et mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Rate limit GitHub API dépassé sur le cron | Faible (authentifié = 5000/h) | Moyen | Retry exponentiel + cache 24h sur les hits API |
| GitHub API change le format de réponse | Faible | Moyen | Tests Vitest avec fixtures versionnées, pin de `@octokit/rest` |
| Heuristics laissent passer du spam SEO | Moyen | Moyen | Blocklist évolutive, ECO-DISC-3 itérable post-MVP |
| PR mensuelle ignorée 2 mois de suite | Élevée (PO occupé) | Moyen | Notification Discord (ECO-DISC-7) + label `stale` après 30 jours |
| Faux positifs en MAJ compteur (regex trop large) | Moyen | Faible | Snapshot test sur 5 MDX fixture, dry-run obligatoire avant merge |
| Repo viral légitime mais hors thématique (ex: framework Vue qui contient "claude code" dans son README) | Moyen | Faible | Heuristic complémentaire : présence du mot-clé dans la description (pas seulement README) |
| GITHUB_TOKEN insuffisant pour API search | Faible | Moyen | Vérifier en ECO-DISC-1 que `GITHUB_TOKEN` standard suffit, sinon documenter PAT |

---

## Dépendances et risques

### Dépendances bloquantes

- **EPIC Ecosystem Sprint 1 mergé** : ECO-1 à ECO-5 doivent exister sur `main` avant ECO-DISC-1 (le script lit les MDX existants pour la MAJ des compteurs et la check-links)
- **Aucune dépendance humaine externe** : tout est codable en interne

### Dépendances logicielles

| Package | Usage | Risque |
|---------|-------|--------|
| `@octokit/rest@22` | API GitHub | Faible, maintenu par GitHub |
| `gray-matter` (déjà installé) | Parse MDX frontmatter | Aucun |
| `peter-evans/create-pull-request@v7` | Auto-PR | Maintenance externe, fallback possible avec gh CLI |
| `vitest` (déjà installé) | Tests | Aucun |

---

## Lien avec les autres EPICs

- **EPIC Ecosystem trending repos 2026-05** : EPIC parent direct. Cet EPIC est la chore d'automation Sprint 4 explicitement mentionnée. À démarrer après merge complet de ECO Sprint 3.
- **EPIC Best Practices Integration** : la section "headless-ci" peut référencer ce script comme cas d'usage concret de Claude Code en CI
- **EPIC SEO/GEO mai 2026** (clos) : les compteurs étoiles à jour entretiennent la fraîcheur SEO des pages awesome (signal "Page updated recently" Google)
- **EPIC Content /security-review 2026-05** : la GitHub Action de cet EPIC suit le même pattern (cron + workflow_dispatch + PR draft). Code à factoriser dans un workflow réutilisable si une 3ème automation arrive.
- **EPIC Vercel Metrics 2026** : le rapport hebdo VM-12 doit ajouter une ligne "Pages ecosystem rafraîchies ce mois" une fois ce script en prod

---

## Prochaines étapes après ouverture de l'EPIC

1. **Attendre la clôture de l'EPIC Ecosystem Sprint 3** (ECO-10 à ECO-12 mergés)
2. **Confirmer la disponibilité du token CI** : GITHUB_TOKEN standard du workflow suffit-il pour `search/repositories` à 100 résultats par requête ? Test rapide avant ECO-DISC-1
3. **Recruter une revue UX du rapport markdown** : un PO peut-il vraiment décider en 15 min ? Tester avec un mock du premier rapport
4. **Branche cible** : `feat/ecosystem-discovery-script`, PR vers `develop`
5. **SonarQube** : passer le scan avant merge develop (règle projet)
