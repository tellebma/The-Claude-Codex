# SR-1 — Recherche factuelle /security-review

> Date de compilation : 2026-05-12
> Source primaire : support.claude.com FR (article 11932705, dernière MAJ 12 mars 2026)
> Story : SR-1 de l'EPIC `content/security-review` — The Claude Codex

---

## 1. Définition officielle de /security-review

Citation source primaire (support.claude.com FR, consulté 2026-05-12) :

> « La commande `/security-review` vous permet d'exécuter une analyse de sécurité directement depuis votre terminal avant de valider le code. »

Citation du blog Anthropic (claude.com/blog, consulté 2026-05-12) :

> « The new `/security-review` command lets you run ad-hoc security analyses from your terminal before committing code. »

La commande est conçue comme un garde-fou local exécuté avant un `git commit` / l'ouverture d'une PR. Elle complète la GitHub Action `claude-code-security-review` qui, elle, s'exécute côté CI sur chaque pull request.

<!-- source: https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code, consulté 2026-05-12 -->
<!-- source: https://claude.com/blog/automate-security-reviews-with-claude-code, consulté 2026-05-12 -->

---

## 2. Les 5 familles de vulnérabilités officielles (doc Anthropic FR)

D'après la source primaire (support.claude.com FR, article 11932705, consulté 2026-05-12), la commande `/security-review` détecte cinq familles de vulnérabilités :

| # | Famille (doc Anthropic FR) | Description (paraphrase) | Sous-types concrets listés dans le README de la GitHub Action |
|---|----------------------------|--------------------------|---------------------------------------------------------------|
| 1 | Risques d'injection SQL | Code qui concatène des entrées utilisateur dans des requêtes SQL sans paramétrage | Injection SQL, command injection, LDAP, XPath, NoSQL, XXE |
| 2 | Cross-site scripting (XSS) | Rendu d'entrées non échappées dans du HTML / DOM | XSS réfléchi, stocké, DOM-based |
| 3 | Failles d'authentification et d'autorisation | Logique d'auth cassée, élévation de privilèges, contrôles d'accès manquants | Broken auth, privilege escalation, IDOR, bypass logic, session flaws |
| 4 | Manipulation non sécurisée des données | Secrets en clair, fuite d'information, traitement non sécurisé de PII | Hardcoded secrets, sensitive data logging, information disclosure, PII violations |
| 5 | Vulnérabilités de dépendances | Packages tiers vulnérables, supply chain | Vulnerable dependencies, typosquatting risks |

**Note d'interprétation** : la doc FR formalise 5 familles « marketing ». Le README de la GHA (anthropics/claude-code-security-review) regroupe ces familles en 10 catégories techniques plus granulaires (injection attacks, auth & authz, data exposure, cryptographic issues, input validation, business logic flaws, configuration security, supply chain, code execution, XSS). Les deux listes ne se contredisent pas, la seconde est plus fine.

<!-- source: https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code, consulté 2026-05-12 -->
<!-- source: https://github.com/anthropics/claude-code-security-review (README), consulté 2026-05-12 -->

---

## 3. Plans éligibles

D'après la source primaire (support.claude.com FR, article 11932705, consulté 2026-05-12) :

| Plan | Éligible à `/security-review` ? | Source |
|------|--------------------------------|--------|
| Pro (individuel) | Oui | support.claude.com FR |
| Max (individuel) | Oui | support.claude.com FR |
| API Console (pay-as-you-go) | Oui | support.claude.com FR |
| Plan gratuit (Free) | Non mentionné comme éligible | Absence dans la liste = exclusion implicite |
| Team / Enterprise | Non mentionné explicitement dans la source FR | À vérifier, voir §8 |

La GitHub Action, elle, nécessite simplement une `CLAUDE_API_KEY` valide (configurée en secret du repo), ce qui implique soit un crédit API Console pay-as-you-go, soit un plan compatible.

<!-- source: https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code, consulté 2026-05-12 -->

---

## 4. Format d'invocation (slash command)

Syntaxe exacte (source primaire) :

```
/security-review
```

La commande s'exécute dans une session Claude Code active (terminal), sans argument obligatoire. Aucune option ou flag n'est documentée publiquement dans la source primaire FR au 2026-05-12.

Comportement attendu : Claude scanne le diff local non commité (ou le code du dossier de travail) et produit une liste de findings classés par sévérité, avec, pour chaque finding, une description et une suggestion de remédiation.

<!-- source: https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code, consulté 2026-05-12 -->
<!-- source: https://claude.com/blog/automate-security-reviews-with-claude-code, consulté 2026-05-12 -->

---

## 5. GitHub Action — métadonnées

| Attribut | Valeur | Source |
|----------|--------|--------|
| Nom complet du repo | `anthropics/claude-code-security-review` | GitHub API |
| URL repo | https://github.com/anthropics/claude-code-security-review | GitHub |
| License | MIT | GitHub API (`license.spdx_id = "MIT"`) |
| Stars (au 2026-05-12) | 4 573 | GitHub API |
| Forks (au 2026-05-12) | 432 | GitHub API |
| Open issues (au 2026-05-12) | 69 | GitHub API |
| Langage principal | Python | GitHub API |
| Created at | 2025-08-04T16:07:27Z | GitHub API |
| Dernier push (`pushed_at`) | 2026-02-11T18:01:23Z | GitHub API |
| Default branch | `main` | GitHub API |
| Description officielle | « An AI-powered security review GitHub Action using Claude to analyze code changes for security vulnerabilities. » | GitHub API |

### Exemple de workflow YAML (extrait du README)

```yaml
name: Security Review

permissions:
  pull-requests: write  # Needed for leaving PR comments
  contents: read

on:
  pull_request:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha || github.sha }}
          fetch-depth: 2

      - uses: anthropics/claude-code-security-review@main
        with:
          comment-pr: true
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
```

### Principales options de configuration (README)

| Option | Défaut | Rôle |
|--------|--------|------|
| `claude-api-key` (requis) | — | Clé API avec accès Claude API et Claude Code |
| `comment-pr` | `true` | Poster les findings comme commentaires PR |
| `claude-model` | `claude-opus-4-1-20250805` | Modèle utilisé pour l'analyse |
| `claudecode-timeout` | 20 minutes | Timeout d'analyse |
| `exclude-directories` | — | Dossiers à exclure du scan |

**Note modèle** : le défaut `claude-opus-4-1-20250805` est celui documenté dans le README au 2026-05-12. Ce modèle est antérieur à Opus 4.7 (modèle courant au 2026-05). À re-vérifier avant rédaction si un upgrade côté Action a eu lieu.

### Caractéristiques annoncées (README)

- Analyse sémantique profonde via le raisonnement Claude (vs scanners statiques basés sur des règles)
- Diff-aware : sur une PR, seuls les fichiers modifiés sont analysés
- Commentaires PR automatiques
- Indépendant du langage
- Filtrage avancé des faux positifs

<!-- source: GitHub API repos/anthropics/claude-code-security-review, consulté 2026-05-12 -->
<!-- source: https://github.com/anthropics/claude-code-security-review (README), consulté 2026-05-12 -->

---

## 6. Distinction `/security-review` vs produit "Claude Code Security"

Au 2026-05-12, deux briques distinctes mais complémentaires existent :

| Brique | Nature | Où ça tourne | Déclencheur |
|--------|--------|--------------|-------------|
| `/security-review` | Slash command dans le CLI Claude Code | Terminal du développeur, local | Manuel, avant commit |
| `anthropics/claude-code-security-review` | GitHub Action open-source (MIT) | Runner GitHub Actions, CI | Automatique, à chaque PR |

La doc générale `code.claude.com/docs/en/security` (consultée 2026-05-12) ne mentionne **ni** `/security-review`, **ni** la GitHub Action : elle couvre uniquement les mécanismes de sécurité du runtime Claude Code (sandboxing, permissions, prompt injection). Il n'existe donc pas, à cette date, de produit unifié nommé « Claude Code Security » : ce sont deux features livrées le 2025-08-06 dans l'annonce « Automate security reviews with Claude Code ».

L'article support FR mentionne « Claude Security » comme une page sœur, mais ne décrit pas un produit séparé.

<!-- source: https://code.claude.com/docs/en/security, consulté 2026-05-12 -->
<!-- source: https://claude.com/blog/automate-security-reviews-with-claude-code, consulté 2026-05-12 -->
<!-- source: https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code, consulté 2026-05-12 -->

---

## 7. Limites documentées

### 7.1 Avertissement officiel de la source primaire FR

> « Bien que les examens de sécurité automatisés aident à identifier de nombreuses vulnérabilités courantes, ils doivent compléter, et non remplacer, vos pratiques de sécurité existantes. »

### 7.2 Prompt injection (README GHA — limite explicite)

Le README de la GitHub Action prévient (consulté 2026-05-12) :

> « This action is not hardened against prompt injection attacks and should only be used to review trusted PRs. »

Recommandation associée du README : configurer le repo pour exiger l'approbation manuelle d'un mainteneur avant l'exécution de workflows pour les contributeurs externes (« Require approval for all external contributors »).

### 7.3 Catégories systématiquement filtrées comme faux positifs (README GHA)

Pour réduire le bruit, la GHA exclut par défaut :

- Vulnérabilités de Denial of Service (DoS)
- Problèmes de rate limiting
- Exhaustion mémoire / CPU
- Input validation générique sans impact prouvé
- Open redirect

Ce filtrage est ajustable via instructions personnalisées.

### 7.4 Limites implicites (à signaler dans l'article)

- Pas de SLA, pas de garantie de couverture exhaustive (c'est une analyse LLM)
- Dépend du modèle utilisé et du contexte fourni dans le diff
- Coût : facturé en tokens API (à chaque PR sur la GHA, à chaque appel `/security-review` côté CLI)

<!-- source: https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code, consulté 2026-05-12 -->
<!-- source: https://github.com/anthropics/claude-code-security-review (README), consulté 2026-05-12 -->

---

## 8. Faits non vérifiables au 2026-05-12

- **SHA exact du dernier commit du repo GHA** : non extrait (l'API `repos` ne renvoie pas le SHA HEAD ; un `git ls-remote` ou `gh api repos/.../commits/main` serait nécessaire).
- **Liste exhaustive des sous-options CLI de `/security-review`** : la source primaire FR ne documente aucun flag. À tester en live dans Claude Code pour confirmer (ou consulter `/help` une fois la commande chargée).
- **Éligibilité Team / Enterprise** : la doc FR liste « Pro », « Max » et « API Console pay-as-you-go ». Elle ne mentionne ni explicitement ni implicitement Team ou Enterprise. À vérifier via support Anthropic.
- **Statistiques de performance / bench / précision** : aucun chiffre n'est publié par Anthropic dans le blog ou la doc. Pas de taux de faux positifs / faux négatifs annoncé.
- **Modèle réellement utilisé par `/security-review` côté CLI** : non documenté publiquement. Côté GHA, le défaut est `claude-opus-4-1-20250805`, mais côté CLI le modèle dépend probablement de la session Claude Code en cours (Sonnet / Opus selon le plan).
- **Tarification spécifique au feature** : non documentée séparément. Présumée incluse dans la consommation API standard (Pro/Max forfait, API Console à l'usage).
- **Auteur du blog post du 2025-08-06** : page chargée sans auteur visible.

<!-- vérification recommandée avant rédaction de l'article : tester `/security-review --help` en CLI et noter la sortie -->

---

## Sources consultées (récapitulatif)

| URL | Type | Date consultation |
|-----|------|-------------------|
| https://support.claude.com/fr/articles/11932705-examens-de-securite-automatises-dans-claude-code | Source primaire FR (MAJ 2026-03-12) | 2026-05-12 |
| https://claude.com/blog/automate-security-reviews-with-claude-code | Annonce produit (2025-08-06) | 2026-05-12 |
| https://github.com/anthropics/claude-code-security-review | Repo GHA (README + LICENSE) | 2026-05-12 |
| GitHub API `/repos/anthropics/claude-code-security-review` | Métadonnées repo | 2026-05-12 |
| https://code.claude.com/docs/en/security | Doc Claude Code (security) — redirection depuis docs.anthropic.com | 2026-05-12 |
