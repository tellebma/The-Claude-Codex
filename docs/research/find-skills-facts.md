# FS-1 — Recherche factuelle `find-skills`

> Date de compilation : 2026-05-17
> Source primaire : `github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md` (SHA `114c6637`, 5 446 bytes, consulté 2026-05-17)
> Story : FS-1 de l'EPIC `content/find-skills` — The Claude Codex
> Rédacteur de la page (FS-2) : doit re-vérifier les chiffres install count + stars avant publication (ils bougent vite).

---

## 1. Identité du skill

| Champ | Valeur | Source |
|-------|--------|--------|
| Nom canonique | `find-skills` | SKILL.md `name:` field |
| Repo | `vercel-labs/skills` | github.com/vercel-labs/skills |
| Chemin dans le repo | `skills/find-skills/SKILL.md` | API GitHub contents |
| Auteur | vercel-labs (organisation Vercel) | github.com/vercel-labs |
| Type | Skill compatible standard SKILL.md (Claude Code, Cursor, Gemini CLI, etc.) | SKILL.md frontmatter |
| Taille du SKILL.md | 5 446 bytes (~135 lignes) | API GitHub contents (SHA `114c6637`) |
| License du package `skills` CLI | **MIT** (déclarée dans `package.json` v1.5.7) | github.com/vercel-labs/skills/blob/main/package.json |
| License du skill lui-même | Non déclarée séparément (hérite implicitement du repo) | Pas de LICENSE file à la racine, voir §11 |

Citation source primaire (SKILL.md, consulté 2026-05-17) :

> "This skill helps you discover and install skills from the open agent skills ecosystem."

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md, consulté 2026-05-17 -->
<!-- source: https://github.com/vercel-labs/skills/blob/main/package.json, consulté 2026-05-17 -->

---

## 2. Triggers d'invocation (extraits du SKILL.md)

Le frontmatter `description:` du SKILL.md liste explicitement les patterns d'usage qui doivent activer le skill :

| Trigger anglais | Équivalent français pour la rédaction FR |
|-----------------|-------------------------------------------|
| "how do I do X" | "comment je fais X" / "comment puis-je faire X" |
| "find a skill for X" | "trouve-moi un skill pour X" |
| "is there a skill that can…" | "est-ce qu'il existe un skill qui…" |
| "can you do X" (capacité spécialisée) | "peux-tu faire X" |
| Expression d'intérêt pour étendre les capacités | "j'aimerais que tu saches…" |
| Recherche de tools, templates, workflows | "je cherche un outil/template/workflow pour…" |
| Mention de souhait d'aide sur domaine spécifique | "j'aimerais avoir de l'aide pour le design/test/déploiement" |

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md (section "When to Use This Skill"), consulté 2026-05-17 -->

---

## 3. Méthodologie en 6 étapes enseignée par le skill

Le SKILL.md formalise un workflow structuré que Claude doit suivre quand le skill est invoqué :

| # | Étape | Action concrète |
|---|-------|-----------------|
| 1 | Comprendre le besoin | Identifier (a) le domaine, (b) la tâche spécifique, (c) estimer si un skill existe probablement |
| 2 | Checker le leaderboard skills.sh AVANT la CLI | Les top skills sont battle-tested ; éviter de rechercher si la réponse est sur la home |
| 3 | Lancer `npx skills find <query>` | Mots-clés ciblés, essayer plusieurs termes (ex : "deploy" → "deployment" → "ci-cd") |
| 4 | Vérifier la qualité AVANT de recommander | Install count, réputation source, GitHub stars du repo (voir §4) |
| 5 | Présenter les options au user | Nom + ce que ça fait + install count + commande copy-paste + lien skills.sh |
| 6 | Proposer l'installation | `npx skills add <owner/repo[@skill]> -g -y` (flag `-g` global, `-y` skip confirm) |

Citation source primaire (SKILL.md, consulté 2026-05-17) sur l'étape 4 :

> "Do not recommend a skill based solely on search results. Always verify."

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md (section "How to Help Users Find Skills"), consulté 2026-05-17 -->

---

## 4. Critères de qualité enseignés (seuils précis)

Le SKILL.md donne des seuils explicites pour juger un skill avant installation :

| Critère | Seuil "préférer" | Seuil "méfiance" | Source |
|---------|------------------|------------------|--------|
| Install count | ≥ 1 000 | < 100 | SKILL.md §"Step 4" |
| Réputation source | `vercel-labs`, `anthropics`, `microsoft` (officielles) | Auteurs inconnus | SKILL.md §"Step 4" |
| GitHub stars du repo source | Pas de seuil chiffré explicite, "more is better" | < 100 | SKILL.md §"Step 4" |

Citation source primaire (SKILL.md, consulté 2026-05-17) :

> "Install count — Prefer skills with 1K+ installs. Be cautious with anything under 100."
> "GitHub stars — Check the source repository. A skill from a repo with <100 stars should be treated with skepticism."

Note : ces seuils sont **prescriptifs dans le skill**. La page FR doit les reprendre tels quels, sans tenter de les "lisser" ou de les "nuancer" (la fidélité à la source prime).

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md (section "Step 4: Verify Quality Before Recommending"), consulté 2026-05-17 -->

---

## 5. Les 7 catégories de recherche communes (SKILL.md)

Le SKILL.md liste 7 catégories à considérer pour formuler les requêtes :

| # | Catégorie | Exemples de requêtes donnés dans le SKILL.md |
|---|-----------|---------------------------------------------|
| 1 | Web Development | react, nextjs, typescript, css, tailwind |
| 2 | Testing | testing, jest, playwright, e2e |
| 3 | DevOps | deploy, docker, kubernetes, ci-cd |
| 4 | Documentation | docs, readme, changelog, api-docs |
| 5 | Code Quality | review, lint, refactor, best-practices |
| 6 | Design | ui, ux, design-system, accessibility |
| 7 | Productivity | workflow, automation, git |

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md (section "Common Skill Categories"), consulté 2026-05-17 -->

---

## 6. La Skills CLI (`npx skills`)

Présentée dans le SKILL.md comme "the package manager for the open agent skills ecosystem". Distribuée via le package npm `skills` (vercel-labs).

| Commande | Effet | Notes |
|----------|-------|-------|
| `npx skills find [query]` | Recherche interactive ou par mot-clé | Si query omise = mode interactif |
| `npx skills add <owner/repo[@skill]>` | Installe un skill depuis GitHub | Flag `-g` = global (user-level), `-y` = skip confirm |
| `npx skills check` | Vérifie les mises à jour disponibles | — |
| `npx skills update` | Met à jour tous les skills installés | — |
| `npx skills init <nom>` | Initialise un nouveau skill local | Mentionné en fin de SKILL.md pour le cas "aucun skill trouvé" |

**État du package `skills` au 2026-05-17** :

| Champ | Valeur | Source |
|-------|--------|--------|
| Nom npm | `skills` | package.json |
| Version courante | **1.5.7** | github.com/vercel-labs/skills/releases/latest |
| Date de release courante | 2026-05-14 | API GitHub `/releases/latest` |
| Nombre total de releases | 26 | github.com/vercel-labs/skills/releases (WebFetch 2026-05-17) |
| Default branch | `main` | API GitHub repo metadata |

Le rythme de release (26 versions, dernière il y a 3 jours au moment de la recherche) indique un projet **très actif**, ce qui justifie une note "vérifier la version au moment de lire" dans la page.

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md (section "What is the Skills CLI?"), consulté 2026-05-17 -->
<!-- source: https://github.com/vercel-labs/skills/blob/main/package.json (champ version), consulté 2026-05-17 -->
<!-- source: API GitHub https://api.github.com/repos/vercel-labs/skills/releases/latest, consulté 2026-05-17 -->

---

## 7. Métriques du repo `vercel-labs/skills` (au 2026-05-17)

| Métrique | Valeur | Source |
|----------|--------|--------|
| Étoiles GitHub | **18 923** (~18.9k) | API GitHub repo metadata |
| Forks | 1 529 | API GitHub repo metadata |
| Dernier push | 2026-05-16 | API GitHub repo metadata |
| Description repo | "The open agent skills tool - npx skills" | API GitHub repo metadata |
| Default branch | `main` | API GitHub repo metadata |
| Fichiers racine | `.github`, `.gitignore`, `.husky`, `.prettierrc`, `AGENTS.md`, `README.md`, `ThirdPartyNoticeText.txt`, `bin`, `build.config.mjs`, `package.json`, `pnpm-lock.yaml`, `scripts`, `skills`, `src`, `tests`, `tsconfig.json` | API GitHub contents |
| Skills dans `/skills/` (au top-level) | **Uniquement `find-skills`** | API GitHub contents |

**Note structurelle importante** : le dossier `/skills/` du repo `vercel-labs/skills` ne contient à ce jour qu'un seul skill (`find-skills`). Les autres skills attribués à vercel-labs (`vercel-react-best-practices`, `web-design-guidelines`, etc., voir §8) vivent dans un **autre repo** : `vercel-labs/agent-skills`. La page FR doit clarifier cette distinction sous peine d'égarer le lecteur.

<!-- source: API GitHub https://api.github.com/repos/vercel-labs/skills, consulté 2026-05-17 -->
<!-- source: API GitHub https://api.github.com/repos/vercel-labs/skills/contents/skills, consulté 2026-05-17 -->

---

## 8. skills.sh — l'annuaire et le leaderboard

| Champ | Valeur | Source |
|-------|--------|--------|
| URL | https://skills.sh/ | SKILL.md "Browse skills at" |
| Tagline officielle | "Skills are reusable capabilities for AI agents. Install them with a single command to enhance your agents with access to procedural knowledge." | WebFetch homepage 2026-05-17 |
| Modèle commercial | Open / gratuit (pas de signup mentionné) | WebFetch homepage 2026-05-17 |
| Modes de classement | Trending (24h) / Hot / All-time | WebFetch homepage 2026-05-17 |
| Filtres topics | React, Next.js, Design & UI, Mobile, Agent workflows, Databases, Testing, Marketing | WebFetch homepage 2026-05-17 |

### Top 10 skills par installs (constaté 2026-05-17 sur skills.sh, all-time)

| Rang | Skill | Repo | Installs |
|------|-------|------|----------|
| **1** | **`find-skills`** | **`vercel-labs/skills`** | **1 600 000 (1.6M)** |
| 2 | `frontend-design` | `anthropics/skills` | 422 000 (422K) |
| 3 | `vercel-react-best-practices` | `vercel-labs/agent-skills` | 405 000 (405K) |
| 4 | `web-design-guidelines` | `vercel-labs/agent-skills` | 324 600 (324.6K) |
| 5 | `microsoft-foundry` | `microsoft/azure-skills` | 323 500 (323.5K) |
| 6 | `remotion-best-practices` | `remotion-dev/skills` | 314 200 (314.2K) |
| 7 | `azure-messaging` | `microsoft/azure-skills` | 310 900 (310.9K) |
| 8 | `azure-hosted-copilot-sdk` | `microsoft/azure-skills` | 294 400 (294.4K) |
| 9 | `agent-browser` | `vercel-labs/agent-browser` | 280 000 (280K) |
| 10 | `azure-compute` | `microsoft/azure-skills` | 265 300 (265.3K) |

**Insight éditorial majeur** : `find-skills` est **le skill #1 mondial** sur skills.sh, avec presque **4× plus d'installs que le #2** (1.6M vs 422K). C'est l'angle SEO et éditorial le plus fort de la page : "le skill le plus installé de tout l'écosystème". À cadrer dans l'intro et le H1 si possible.

**Ratio install / star de vercel-labs/skills** : 1.6M installs ÷ 18.9k stars ≈ **85×**. Le skill est massivement plus installé qu'il n'est étoilé, ce qui suggère un usage CLI passif (les utilisateurs ne sourcent pas le repo, ils consomment le skill).

<!-- source: https://skills.sh/ (homepage, leaderboard all-time), consulté 2026-05-17 -->
<!-- source: API GitHub repos vercel-labs/skills, vercel-labs/agent-skills, anthropics/skills, microsoft/azure-skills, consulté 2026-05-17 -->

---

## 9. Le repo concurrent / partenaire `anthropics/skills`

Mentionné explicitement par le SKILL.md de `find-skills` comme source officielle de confiance. À comparer dans la page pour situer l'écosystème.

| Champ | Valeur | Source |
|-------|--------|--------|
| Stars | **136 229** (~136k) | API GitHub repo metadata |
| Description | "Public repository for Agent Skills" | API GitHub repo metadata |
| License | Apache 2.0 selon WebFetch (API GitHub renvoie `null` car pas de fichier LICENSE auto-détecté à la racine) | WebFetch + API GitHub, consulté 2026-05-17 |
| Dernier push | 2026-05-15 | API GitHub repo metadata |
| Structure | `./skills` (par catégorie), `./spec` (Agent Skills specification), `./template` | WebFetch 2026-05-17 |
| Catégories de skills | Creative & Design, Development & Technical, Enterprise & Communication, Document Skills | WebFetch 2026-05-17 |
| Skills documents notables | `docx`, `pdf`, `pptx`, `xlsx` (source-available, pas open source) | WebFetch 2026-05-17 |
| Partner Skills | Notion Skills for Claude | WebFetch 2026-05-17 |

**Insight éditorial** : `anthropics/skills` a **7× plus de stars** que `vercel-labs/skills` (136k vs 18.9k) mais le skill #1 vient de vercel-labs. Cohérent avec le fait que vercel-labs ne publie qu'un seul skill (find-skills) qui est utilitaire (utilisé partout) là où anthropics publie une dizaine de skills spécialisés (chacun a moins d'installs individuels).

**Action pour la page FR** : présenter les deux organisations comme les deux "officielles" de l'écosystème, sans hiérarchie de qualité.

<!-- source: API GitHub https://api.github.com/repos/anthropics/skills, consulté 2026-05-17 -->
<!-- source: WebFetch https://github.com/anthropics/skills, consulté 2026-05-17 -->

---

## 10. Pattern de réponse imposé par le SKILL.md

Le SKILL.md donne un exemple précis du format de réponse attendu quand un skill est trouvé. À reproduire dans la démo de la page (FS-3) :

```text
I found a skill that might help! The "react-best-practices" skill provides
React and Next.js performance optimization guidelines from Vercel Engineering.
(185K installs)

To install it:
npx skills add vercel-labs/agent-skills@react-best-practices

Learn more: https://skills.sh/vercel-labs/agent-skills/react-best-practices
```

Et le pattern attendu quand aucun skill ne matche :

```text
I searched for skills related to "xyz" but didn't find any matches.
I can still help you with this task directly! Would you like me to proceed?

If this is something you do often, you could create your own skill:
npx skills init my-xyz-skill
```

**Action pour la page FR** : utiliser ces deux formats comme bases pour les captures terminales FS-3, en les traduisant proprement (pas calque mot-à-mot).

<!-- source: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md (sections "Step 5: Present Options" et "When No Skills Are Found"), consulté 2026-05-17 -->

---

## 11. Distinctions à NE PAS confondre dans la page

Le sujet est piégeux parce que 4 concepts cohabitent. La page FR doit poser explicitement les distinctions :

| Concept | Définition | À ne pas confondre avec |
|---------|------------|--------------------------|
| **Skill `find-skills`** | Un skill au sens SKILL.md, hébergé dans `vercel-labs/skills/skills/find-skills/SKILL.md`, qui apprend à Claude (ou tout agent compatible) à utiliser intelligemment la Skills CLI | La commande `npx skills find` (qui est un sous-outil de la CLI, pas le skill lui-même) |
| **Skills CLI** (`npx skills …`) | Package npm `skills` (v1.5.7), publié par vercel-labs, qui agit comme package manager pour les skills (find, add, check, update, init) | Le skill `find-skills` (qui n'est qu'un consommateur intelligent de cette CLI) |
| **skills.sh** | Site web public, annuaire + leaderboard des skills de l'écosystème open | Le repo `vercel-labs/skills` (qui héberge le code de la CLI, mais n'a qu'un seul skill `find-skills` à l'intérieur) |
| **Standard SKILL.md** | Format commun (frontmatter YAML `name` + `description` puis corps Markdown) que tous les skills doivent respecter pour être chargeables par Claude Code, Cursor, Gemini CLI, etc. | Une "spec officielle" — il s'agit d'une convention de fait portée par anthropics/skills (`./spec`) et adoptée par l'écosystème, pas d'un standard ratifié |

**Note structurelle critique** : `vercel-labs/skills` (où vit `find-skills`) ≠ `vercel-labs/agent-skills` (où vivent `vercel-react-best-practices`, `web-design-guidelines`, etc.). Le SKILL.md mentionne les deux comme sources trustées, mais ce sont deux repos séparés. À expliciter dans la page.

<!-- source: synthèse des sections précédentes (SKILL.md, skills.sh, API GitHub) -->

---

## 12. Zones d'ombre et points à re-vérifier en FS-2/FS-7

Liste des éléments où la doc est incomplète ou où l'info bouge vite. Le rédacteur de FS-2 doit re-checker au moment de publier :

| Item | Pourquoi à re-vérifier | Action recommandée |
|------|------------------------|---------------------|
| Install count `find-skills` (1.6M) | Chiffre dynamique sur skills.sh, peut bouger de 100k+/mois | Re-fetcher skills.sh à J-1 publication, dater le chiffre |
| Stars `vercel-labs/skills` (18.9k) | Repo en croissance active | Re-fetcher à J-1, formuler "au YYYY-MM-DD" |
| Version Skills CLI (v1.5.7) | 26 releases en quelques mois → cadence très soutenue | Re-vérifier `npm view skills version` à J-1 |
| License du skill `find-skills` | Pas de LICENSE séparé dans `skills/find-skills/` ; hérite implicitement du repo (MIT via `package.json`) | Mentionner "MIT (héritée du package `skills` qui héberge le skill)" sans sur-affirmer |
| Date de création du skill `find-skills` | Non recherchée ici (faible valeur SEO) | À récupérer si besoin via `git log --diff-filter=A` sur le repo (story FS-2 si jugé utile) |
| Pic d'installs (date où il est passé #1 sur skills.sh) | Pas d'info publique trouvée | Peut être contacté vercel-labs ou laisser de côté |
| Catégorie skill.sh pour `find-skills` | Pas vérifié (homepage scan limité) | À chercher si besoin pour cross-link sémantique |
| Compatibilité hors Claude Code (Cursor, Gemini CLI, Codex…) | Affirmée par SKILL.md ("standard SKILL.md") mais pas testée par nous | Soit reformuler en "compatible avec les agents qui supportent le standard SKILL.md", soit tester réellement (hors scope FS-2) |
| Différence concrète entre `npx skills add` et le `/plugin marketplace add` de Claude Code | Pas explicité dans le SKILL.md | Hors scope EPIC, mais à signaler comme "comparatif possible" pour un autre EPIC |

---

## 13. Bibliographie consolidée (toutes sources consultées 2026-05-17)

| # | URL | Type | Rôle |
|---|-----|------|------|
| 1 | https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md | Doc primaire | Source canonique du skill |
| 2 | https://github.com/vercel-labs/skills | Repo | Métriques (stars, forks, releases) |
| 3 | https://github.com/vercel-labs/skills/blob/main/package.json | Fichier source | Version CLI, license MIT, description |
| 4 | https://api.github.com/repos/vercel-labs/skills | API | Métadonnées repo |
| 5 | https://api.github.com/repos/vercel-labs/skills/releases/latest | API | Version courante v1.5.7, date 2026-05-14 |
| 6 | https://api.github.com/repos/vercel-labs/skills/contents/skills | API | Vérification : un seul skill dans le dossier |
| 7 | https://skills.sh/ | Site officiel | Leaderboard, tagline, modèle |
| 8 | https://github.com/anthropics/skills | Repo | Comparatif écosystème (136k stars, Apache 2.0) |
| 9 | https://api.github.com/repos/anthropics/skills | API | Stars, dernier push |

**Sources NON utilisées** (volontairement, pour éviter les biais ou les redites) :

- Aucun post Reddit, Twitter/X, dev.to ou tutoriel YouTube (cf. règle "rigueur journalistique" du CLAUDE.md)
- Aucun blog tiers non daté
- La doc Anthropic sur les skills (docs.anthropic.com) n'a pas été consultée pour ce skill spécifique car le skill vient de vercel-labs, pas d'Anthropic. À ajouter en FS-2 uniquement si on développe une section "comment les skills s'intègrent dans Claude Code natif".

---

## 14. Prochaine étape (FS-2)

Le rédacteur de FS-2 dispose de tous les faits chiffrés et vérifiés ci-dessus. Recommandations spécifiques pour la rédaction :

1. **Hook d'intro** : "Le skill le plus installé au monde sur skills.sh (1.6M installs au YYYY-MM-DD) est… un skill qui sert à trouver d'autres skills."
2. **H2 "C'est quoi exactement ?"** : poser la distinction §11 dès les premières lignes.
3. **H2 "Comment ça marche"** : reprendre §3 (les 6 étapes) avec un `<Steps>` MDX.
4. **H2 "Installer et tester"** : commande unique `npx skills add vercel-labs/skills@find-skills -g -y` (à re-vérifier la syntaxe exacte au moment du test).
5. **H2 "Les critères qualité"** : reprendre §4 sous forme de tableau, fidèlement aux seuils du SKILL.md.
6. **H2 "Démo réelle"** : 2-3 exemples concrets (cf. §10 pour le format de réponse attendu) — à capturer en vrai pour FS-3.
7. **H2 "Limites et faux pas"** : skills < 100 installs, dépendance réseau au moment du `npx skills add`, hallucinations possibles si Claude survalorise un skill faiblement noté.
8. **H2 "Aller plus loin"** : initier son propre skill (`npx skills init`), publier sur skills.sh, lien vers cross-references EPIC Stack design.

**Avertissements à inscrire en dur dans la page** :

- Tous les chiffres (installs, stars, version) doivent être préfixés "au YYYY-MM-DD" pour rester honnêtes dans 6 mois.
- Ne pas affirmer la qualité d'un skill juste parce qu'il est dans le top 10 (corrélation usage ≠ pertinence pour TON cas).
- Le skill `find-skills` ne valide PAS le contenu des skills qu'il recommande — il applique des heuristiques. C'est à l'humain de lire le SKILL.md avant d'installer en global.
