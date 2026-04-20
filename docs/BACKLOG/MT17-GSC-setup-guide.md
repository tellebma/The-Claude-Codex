# MT17 — Brancher Google Search Console (guide setup)

> Priorité P0 selon la review PO (2026-04-20).
> 64% du trafic vient de Google mais les mots-clés sont masqués dans Matomo. Sans GSC, toute décision d'optimisation SEO est un pari à l'aveugle.

---

## Pourquoi maintenant

- Matomo montre 18 visites Google ce mois avec le label "Mot clef indéfini" : GSC est la seule source pour voir les vraies requêtes
- Sprint 1 MT3 (enrichir `/en/plugins/best-security/`) dépend de ce branchement pour savoir quelle intention utilisateur cibler
- Les renommages MT1 doivent être suivis via GSC pour détecter d'éventuelles chutes d'impressions/clics

---

## Prérequis

- [ ] Être propriétaire vérifié de `claude-codex.fr` dans Google Search Console
- [ ] Accès admin à Matomo (profil `maxime`, déjà OK)
- [ ] Plugin Matomo "Search Engine Keywords Performance" (anciennement Search Console API) installé

---

## Étapes

### 1. Vérifier la propriété du site dans GSC

1. Aller sur https://search.google.com/search-console
2. Ajouter la propriété `claude-codex.fr` (type "Domaine" recommandé, via DNS TXT)
3. Vérifier via un enregistrement DNS TXT sur le provider du domaine
4. Attendre que Google commence à collecter les données (quelques heures)

Si déjà fait : passer à l'étape 2.

### 2. Installer le plugin Matomo GSC

Dans Matomo :
1. Administration → **Marketplace**
2. Chercher "Search Engine Keywords Performance"
3. Installer la version gratuite (OAuth2 Google natif inclus)
4. Redémarrer Matomo (ou attendre que le plugin soit actif)

Alternative CLI (si accès SSH au serveur Matomo) :
```bash
./console plugin:install SearchEngineKeywordsPerformance
./console cache:clear
```

### 3. Configurer le connecteur OAuth Google

1. Matomo → Administration → **Marketing** → **Search Engine Keywords Performance**
2. Cliquer sur "Configure access to Google Search Console"
3. S'authentifier avec le compte Google propriétaire de la GSC de `claude-codex.fr`
4. Accepter les scopes OAuth demandés (lecture seule)
5. Associer le site Matomo `idSite=3` (Claude Codex) à la propriété GSC `claude-codex.fr`

### 4. Premier import de données

- Les données GSC remontent avec un délai de 2-3 jours (limite Google)
- Matomo rapatrie les 90 derniers jours à la première synchro
- Vérifier l'import dans **Acquisition → Search Engine Keywords** (nouveau rapport, remplace les "mot-clés indéfinis")

### 5. Configurer l'export automatique

Si Matomo le permet :
- Scheduled report hebdomadaire : top 50 requêtes + évolution positions
- Mail automatique vers `pdmtc.bellet@gmail.com` chaque lundi

---

## Utilisation des données pour la suite du plan

Une fois GSC connecté, les stories suivantes se débloquent :

### MT3 — Enrichir `/en/plugins/best-security/`

Requête : sur quelle keyword Google cette page ranke-t-elle actuellement ?
- Si "best claude code security plugins" → garder le titre, enrichir le contenu
- Si "claude code sécurité" → incohérence → corriger le titre EN et vérifier le robots
- Si "mcp security best practices" → la page doit mieux relier vers MCP

### MT14 — Choix des articles trending

Regarder les "Queries" avec impressions élevées mais clics faibles (CTR < 2%) :
- Ce sont des opportunités de contenu
- Écrire un article qui répond précisément à cette query

### MT19 — Audit des pages 100% rebond

Croiser les pages d'entrée Matomo 100% rebond avec les queries GSC :
- Si une page reçoit du trafic sur une query qui ne matche pas son titre → réécrire le titre/contenu
- Si pas de query associée → probablement un backlink externe spammy → vérifier les referers Nginx

---

## Tracking du ROI du branchement

**Avant (baseline 2026-04)** :
- 18 visites Google / mois avec label "mot-clé indéfini"
- 0% de données keyword exploitables

**Cible 2026-05** :
- 100% des visites Google avec keyword associé
- Top 20 queries identifiées et priorisées
- 3 pages optimisées sur la base de données GSC réelles

---

## Checklist de validation (à cocher par Maxime)

- [ ] Étape 1 : propriété GSC vérifiée
- [ ] Étape 2 : plugin installé et actif
- [ ] Étape 3 : OAuth configuré, site associé
- [ ] Étape 4 : premier rapport keywords visible dans Matomo
- [ ] Étape 5 : rapport hebdo configuré

---

## Plan B si le plugin Matomo ne fonctionne pas

Export manuel depuis GSC vers CSV, puis analyse :
1. GSC → **Performance** → période "Derniers 28 jours" → **Exporter**
2. Importer le CSV dans une Notion/Airtable/Sheet
3. Lier avec les pages Matomo manuellement (pivot sur l'URL)

Fastidieux mais exploitable pour un premier cycle.

---

## Temps estimé

- Étapes 1-3 : 30 min (si la propriété GSC existe déjà)
- Étapes 4-5 : attendre 48-72h pour les premières données

**Total actif** : ~30 min. **Lead time total** : 3 jours.
