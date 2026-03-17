# Audit UX/Contenu — Persona "Connaisseur"

**Date** : 2026-03-10
**Auditeur** : Agent UX spécialisé (méthodologie HashiCorp Learn / Datadog Guides / GitHub Docs)
**Site audité** : The Claude Codex (claude-codex.fr)
**Persona** : Connaisseur — utilise Claude Code depuis quelques mois, maîtrise les bases (MCP, Skills, prompting), explore l'écosystème, cherche à approfondir et optimiser. Familier avec Copilot, Cursor, ChatGPT.

---

## Score global : 5.5 / 10

Le site remplit bien sa mission pour un public débutant à intermédiaire, mais déçoit significativement le connaisseur. Le contenu reste en surface sur la quasi-totalité des sujets avancés. Un utilisateur qui connaît déjà les bases trouvera peu de matière pour progresser au-delà de ce qu'il sait déjà. La promesse du parcours "Avancé / Expert & Architecte" sur la landing page (orchestration multi-agents, workflows complexes, création de MCP servers) n'est pas tenue par le contenu réel du site.

**Référentiel de comparaison** : HashiCorp Learn (tutoriels progressifs avec niveaux explicites, labs interactifs, cas réels en production), Datadog Guides (monitoring en contexte réel, métriques, troubleshooting avancé), GitHub Docs (API reference exhaustive, guides avancés sur Actions, webhooks, Apps).

---

## 1. Landing Page

### Score : 6 / 10

### Points forts
- Le parcours en 3 niveaux (Débutant / Intermédiaire / Avancé) est une excellente idée de navigation par persona.
- Le configurateur teaser est un concept pertinent pour le connaisseur qui veut optimiser sa config rapidement.
- Les témoignages donnent du concret (3h gagnées/jour avec MCP GitHub + PostgreSQL).

### Points faibles
- **Le parcours "Avancé" est un leurre.** Il promet "Orchestration multi-agents", "Créer vos propres MCP servers", "CI/CD et déploiement automatisé" — aucun de ces contenus n'existe réellement sur le site. Le lien pointe vers `/prompting` qui ne couvre pas ces sujets en profondeur.
- Le hero "en partant de zéro" repousse le connaisseur : le positionnement est trop débutant pour quelqu'un qui utilise déjà l'outil.
- Le configurateur est une page vide ("Bientôt disponible").
- Les témoignages ne sont pas vérifiables (pas de lien LinkedIn, pas de screenshots de projet).

### Éléments manquants
- Pas de section "What's new" ou changelog pour les utilisateurs existants.
- Pas de lien vers du contenu avancé accessible directement depuis le hero (un connaisseur ne veut pas "commencer le guide").
- Pas de métriques réelles d'usage (tokens consommés, temps gagné, benchmarks).

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| CRITIQUE | Créer le contenu promis par le parcours "Avancé" (multi-agents, MCP custom, CI/CD) ou retirer ces promesses. |
| IMPORTANT | Ajouter un CTA alternatif pour les utilisateurs existants ("Allez plus loin" ou "Quoi de neuf"). |
| NICE-TO-HAVE | Rendre les témoignages vérifiables (lien projet, screenshot, profil). |

---

## 2. Getting Started (4 pages)

### Score : 4 / 10

### Points forts
- Le tableau comparatif Claude Code vs Copilot vs Cursor est pertinent — un connaisseur comparera.
- Le troubleshooting d'installation est bien détaillé (EACCES, nvm, PATH).
- L'explication du CLAUDE.md hiérarchique est un vrai apport.
- La distinction API key vs abonnement avec analyse de coûts est utile.

### Points faibles
- **100% du contenu est basique.** Installation de Node.js, `npm install -g`, "ouvrez votre terminal" — un connaisseur sait tout cela.
- Le premier projet est un site HTML statique. Un connaisseur utilise déjà Claude Code pour des projets complexes. Ce tutoriel n'a aucune valeur pour lui.
- Le tableau comparatif est simpliste. Il ne mentionne pas : la gestion du contexte window, les limites de tokens, les performances comparées sur du refactoring multi-fichiers, les coûts réels comparés, le support des monorepos.
- Pas de contenu sur les modes avancés : `--headless`, `--print`, `--dangerously-skip-permissions`, `--model`, le flag `--continue`, les worktrees.
- Pas d'explication du système de permissions granulaire au-delà des bases.

### Éléments manquants
- **Configuration avancée** : variables d'environnement avancées (MAX_THINKING_TOKENS, DISABLE_AUTOUPDATER, etc.), configuration de proxy, CI/CD headless mode.
- **Gestion du contexte** : comment /compact fonctionne en interne, stratégies pour les gros projets, quand et comment segmenter les sessions.
- **Modes d'exécution** : mode pipe, mode headless pour CI, mode SDK, mode print.
- **Benchmarks** : comparaison de coûts réels API vs Max vs Pro sur des tâches typiques (refactoring 500 fichiers, génération de tests, etc.).
- **Limites connues** : quand Claude Code échoue, les types de projets mal supportés, les langages moins bien gérés.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| CRITIQUE | Ajouter une page "Configuration avancée" couvrant les flags CLI, les variables d'environnement, le mode headless, la gestion du contexte. |
| CRITIQUE | Ajouter une page "Limites et workarounds" — un connaisseur veut savoir où l'outil casse, pas juste où il brille. |
| IMPORTANT | Enrichir le tableau comparatif avec des métriques réelles, des cas d'usage différenciants, et une analyse nuancée (quand Cursor > Claude Code et vice versa). |
| IMPORTANT | Ajouter un tutoriel avancé "Premier projet" orienté connaisseur : migration d'un codebase existant, intégration dans un monorepo, ou refactoring guidé. |
| NICE-TO-HAVE | Ajouter une section sur l'intégration avec les IDE (VS Code terminal, Neovim, tmux). |

---

## 3. MCP (6 pages)

### Score : 6.5 / 10

### Points forts
- L'architecture JSON-RPC stdin/stdout est bien expliquée — un connaisseur apprécie cette transparence technique.
- Les 3 méthodes d'installation (CLI, JSON, Docker) couvrent les cas réels.
- Le workflow combiné Context7 + GitHub + Playwright est un bon exemple de composition.
- Le troubleshooting MCP est actionnable (logs, validation JSON, test manuel).
- La section sécurité (tokens, moindre privilège) est correctement traitée.

### Points faibles
- **Aucun contenu sur la création de MCP custom.** C'est le sujet #1 que recherche un connaisseur. La FAQ dans la comparaison Skills/MCP/Plugins mentionne le SDK MCP en une phrase, mais aucun tutoriel, aucun exemple de code, aucune architecture de référence.
- Les fiches MCP sont des catalogues (installation + 4 cas d'usage) sans profondeur. Un connaisseur veut comprendre les limites de chaque MCP, les performances, les quotas, les gotchas.
- Pas de mention des MCP communautaires au-delà des "officiels" — pas de lien vers le registre MCP, pas de critères de sélection pour évaluer un MCP tiers.
- Le workflow "premier workflow" est un cas simple (page 404). Un connaisseur veut des workflows production-grade : pipeline de review automatisé, migration de BDD guidée, refactoring cross-repo.
- Aucune mention du transport SSE/HTTP pour les MCP distants.
- Pas de contenu sur le debugging avancé des MCP (inspection des messages JSON-RPC, logging verbeux, timeouts custom).

### Éléments manquants
- **Création d'un MCP custom** : tutoriel complet avec le SDK TypeScript ou Python, de la spec au déploiement.
- **Architecture de référence** : comment structurer un MCP qui accède à une API interne d'entreprise.
- **Performance et limites** : impact des MCP sur la latence, gestion des timeouts, MCP qui tombent en pleine session.
- **Registre et écosystème** : lien vers smithery.ai ou le registre officiel, critères pour évaluer la qualité d'un MCP tiers.
- **MCP avancés** : composition de MCP, MCP stateful, MCP avec authentification complexe (OAuth flow complet pour Gmail détaillé pas à pas).
- **Sécurité avancée** : audit des MCP installés, sandboxing, containérisation des MCP sensibles.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| CRITIQUE | Créer une page "Créer un MCP custom" avec un tutoriel end-to-end (SDK MCP TypeScript, definition des tools, tests, déploiement). C'est le contenu #1 manquant pour le persona connaisseur. |
| CRITIQUE | Ajouter des informations sur les limites et gotchas de chaque MCP (quotas API, latence, cas où ça casse). |
| IMPORTANT | Ajouter un workflow avancé réaliste (pipeline CI/CD automatisé, migration BDD multi-étapes, audit sécurité complet). |
| IMPORTANT | Référencer le registre/marketplace de MCP communautaires avec des critères de sélection. |
| NICE-TO-HAVE | Documenter le transport SSE/HTTP pour les MCP distants et les cas d'usage enterprise. |

---

## 4. Skills (4 pages)

### Score : 7 / 10

### Points forts
- **La page "Créer un Skill custom" est le meilleur contenu du site pour un connaisseur.** La structure en 5 étapes (titre/rôle, contexte, étapes, format de sortie, variables) est claire et actionnable.
- Les 3 exemples complets (React Component Generator, API Pattern, Deploy Checklist) sont réalistes et réutilisables.
- Les "7 règles d'or" et les pièges courants apportent de la valeur experte.
- L'organisation des Skills en équipe (section finale) répond à un vrai besoin d'un connaisseur en contexte professionnel.
- Le comparatif Skills vs MCP vs Plugins avec l'arbre de décision est bien structuré.

### Points faibles
- Le "Top Skills recommandés" liste des Skills qui n'existent pas en tant que fichiers téléchargeables. Le connaisseur ne peut pas les installer — il doit les écrire lui-même à partir des descriptions.
- Pas de lien vers un repository de Skills communautaires (équivalent d'un awesome-claude-skills).
- Les exemples de Skills sont tous orientés développement web. Pas de Skill pour ops, data, documentation technique, ou non-dev.
- La variable `$ARGUMENTS` est mentionnée mais pas exhaustivement documentée. Quelles sont les autres variables disponibles ? Peut-on passer des flags ? Y a-t-il des variables d'environnement accessibles ?
- Pas de contenu sur les Skills avancés : Skills qui appellent d'autres Skills, Skills conditionnels, Skills avec templates dynamiques.

### Éléments manquants
- **Repository de Skills téléchargeables** : un repo GitHub ou un registre avec des Skills prêts à l'emploi.
- **Variables et API des Skills** : documentation exhaustive des variables disponibles (`$ARGUMENTS`, et les autres).
- **Patterns avancés** : Skills qui orchestrent des sous-agents, Skills avec conditions, Skills avec boucles.
- **Métriques de résultat** : comment mesurer si un Skill fonctionne bien (taux de réussite, itérations nécessaires, qualité du résultat).
- **Migration et versioning** : comment faire évoluer un Skill dans le temps, comment gérer les breaking changes.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| IMPORTANT | Publier un repository GitHub avec les Skills présentés, téléchargeables et installables. |
| IMPORTANT | Documenter exhaustivement les variables disponibles dans les Skills et les capacités du système de templating. |
| IMPORTANT | Ajouter des exemples de Skills non-dev (ops, data, documentation, product management). |
| NICE-TO-HAVE | Créer un guide de patterns avancés pour les Skills (orchestration, conditionnels, composition). |

---

## 5. Plugins (5 pages)

### Score : 5 / 10

### Points forts
- La structure plugin.json est bien documentée avec un exemple de création custom.
- Le processus marketplace → install → configure → use est clairement expliqué.
- La distinction Plugin vs MCP vs Skill est cohérente avec le reste du site.
- Les catégories de plugins (agents spécialisés, templates, analyseurs, workflows, connecteurs) donnent une bonne vision de l'écosystème.

### Points faibles
- **L'écosystème plugin est présenté comme mature alors qu'il est émergent.** Les chiffres d'installations (57K, 71K, 96K) ne sont pas vérifiables et semblent hypothétiques. Un connaisseur sera sceptique.
- Les commandes `/plugin install`, `/plugin marketplace` ne sont pas des commandes Claude Code officielles documentées par Anthropic. Le site présente des fonctionnalités qui n'existent peut-être pas dans la version actuelle de Claude Code, ce qui crée de la confusion.
- **"Everything Claude Code" (57K installs)** — ce plugin est décrit comme incluant des agents ("senior-dev", "architect", "reviewer") mais sans lien vers le repo, sans code source, sans documentation officielle. Le connaisseur ne peut pas vérifier.
- Les fiches plugins sont des catalogues marketing (installation + 4 cas d'usage) sans contenu technique profond.
- Pas de guide pour créer un plugin de bout en bout (seulement la structure de fichiers, pas l'implémentation).
- La section "Plugins design" est un catalogue de features sans démonstration concrète.

### Éléments manquants
- **Vérifiabilité** : liens vers les repos GitHub, les pages npm, la documentation officielle de chaque plugin mentionné.
- **Tutoriel de création de plugin** : de l'idée au publish, avec code réel.
- **Analyse critique** : quels plugins valent le coup, lesquels sont instables, lesquels consomment trop de contexte.
- **Interopérabilité** : comment les plugins interagissent entre eux, conflits possibles, ordre de priorité.
- **Comparaison avec l'écosystème Cursor/Copilot** : un connaisseur veut savoir si les plugins Claude Code sont au niveau des extensions VS Code ou des rules Cursor.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| CRITIQUE | Vérifier et corriger les informations sur l'écosystème plugin. Si les commandes `/plugin install` et le marketplace n'existent pas encore officiellement, le préciser clairement. Un connaisseur qui essaie et échoue perdra confiance dans tout le site. |
| CRITIQUE | Ajouter des liens vers les sources (repos, npm, documentation officielle) pour chaque plugin mentionné. |
| IMPORTANT | Remplacer les chiffres d'installation non vérifiables par des indicateurs qualitatifs ou omettre les chiffres. |
| IMPORTANT | Ajouter un tutoriel complet de création de plugin avec implémentation réelle. |
| NICE-TO-HAVE | Ajouter une analyse comparative avec les écosystèmes d'extension de Cursor et Copilot. |

---

## 6. Prompting (1 page)

### Score : 5.5 / 10

### Points forts
- Les 5 templates prêts à l'emploi (web dev, documentation, automatisation, data analysis, contenu) sont bien structurés et réutilisables.
- La section "Erreurs courantes" avec avant/après est pédagogique.
- La section CLAUDE.md avec les 3 niveaux (global, projet, module) est utile même pour un connaisseur.
- La mention de l'orchestration multi-agents et du prompt chaining montre une conscience des besoins avancés.

### Points faibles
- **La page prompting est paradoxalement superficielle sur les techniques avancées.** Le prompt chaining est un exemple en 4 étapes. L'orchestration multi-agents est un tableau + un exemple basique. Aucune de ces techniques n'est expliquée en profondeur.
- Les 5 principes de base (soyez spécifique, définissez un rôle, etc.) sont des connaissances acquises pour un connaisseur. C'est le contenu de n'importe quel article "prompt engineering 101".
- Pas de contenu sur les techniques avancées spécifiques à Claude Code : gestion du contexte window, stratégies de /compact, utilisation du extended thinking, plan mode, split role sub-agents.
- Le contenu MDX (`prompting-guide.mdx`) est un résumé pauvre (97 lignes) de la page TSX qui est bien plus riche. Incohérence de contenu.
- Pas de section sur les anti-patterns spécifiques à Claude Code (vs ChatGPT ou Copilot).
- Aucune mention des différences de prompting entre les modèles (Haiku, Sonnet, Opus) et leur impact sur les résultats.

### Éléments manquants
- **Techniques avancées en profondeur** : tree of thought, chain of thought, self-consistency, critique rounds, structured output forcing.
- **Gestion du contexte** : stratégies quand on approche la limite du context window, quand utiliser /compact, comment structurer une session longue.
- **Prompting pour les agents** : comment écrire des instructions qui seront suivies par des sous-agents (Task tool), comment débugger un agent qui déraille.
- **Extended thinking** : comment et quand activer le mode thinking, impact sur la qualité des réponses, cas d'usage.
- **Prompting par modèle** : différences entre prompting Haiku (rapide, léger) et Opus (raisonnement profond).
- **Métriques et feedback** : comment évaluer la qualité d'un prompt, A/B testing de prompts, itération systématique.
- **Patterns Claude Code-spécifiques** : comment formuler des demandes pour le refactoring multi-fichiers, la migration de code, l'audit de codebase entière.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| CRITIQUE | Créer au minimum 3 sous-pages de prompting avancé : (1) Gestion du contexte et sessions longues, (2) Techniques avancées (CoT, tree of thought, critique), (3) Prompting par modèle et mode thinking. |
| IMPORTANT | Ajouter du contenu sur les patterns de prompting spécifiques à Claude Code (vs patterns ChatGPT/Copilot). |
| IMPORTANT | Documenter les anti-patterns : ce qui ne marche pas avec Claude Code, les erreurs que font les utilisateurs intermédiaires. |
| NICE-TO-HAVE | Ajouter des cas d'étude réels avec prompts complets et résultats obtenus. |

---

## 7. Agents (page vide)

### Score : 1 / 10

### Points forts
- La page existe et signale clairement qu'elle est en construction.

### Points faibles
- **C'est le sujet le plus important pour un connaisseur et il est complètement absent.** Les agents (Task tool, sub-agents, orchestration parallèle) sont la fonctionnalité avancée #1 de Claude Code. Un connaisseur qui arrive sur cette page et voit "Bientôt disponible" quittera le site.
- La landing page promet l'orchestration multi-agents dans le parcours "Avancé". La page agents est vide. C'est une rupture de contrat.

### Éléments manquants (tout est manquant)
- Qu'est-ce qu'un agent Claude Code (Task tool, sub-agent).
- Comment configurer des agents dans `~/.claude/agents/` ou `.claude/agents/`.
- Architecture : agent orchestrateur vs agents spécialisés.
- Patterns : fan-out/fan-in, pipeline séquentiel, multi-perspective analysis.
- Exemples concrets d'orchestration multi-agents.
- Limites : coût en tokens, profondeur de récursion, gestion des erreurs.
- Comparaison avec les systèmes multi-agents d'autres outils (Devin, Aider, etc.).

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| CRITIQUE | Créer le contenu de la section Agents avec au minimum 3 pages : (1) Comprendre les agents, (2) Configurer et créer des agents custom, (3) Patterns d'orchestration multi-agents. C'est la priorité #1 pour le persona connaisseur. |

---

## 8. Future / Vision (1 page)

### Score : 3 / 10

### Points forts
- La roadmap du site donne de la transparence.

### Points faibles
- **Contenu entièrement générique.** "L'IA va transformer chaque métier", "les agents autonomes écrivent du code" — ce sont des banalités que le connaisseur a déjà lues 100 fois.
- Aucune analyse technique de la direction de Claude Code spécifiquement. Pas de mention de la vision d'Anthropic, des features annoncées, des tendances du SDK.
- Le tableau des tendances (agents autonomes, MCP, multimodal) est trop superficiel pour apporter de la valeur.
- Pas de contenu actionnable — le connaisseur ne repart avec rien de concret.

### Éléments manquants
- **Roadmap technique de Claude Code** : features annoncées, bêtas en cours, intégrations prévues.
- **Analyse de l'écosystème** : positionnement de Claude Code vs Devin, Aider, Continue, Cline, Windsurf.
- **Tendances techniques concrètes** : évolution du protocole MCP, nouvelles primitives d'agents, amélioration du context window.
- **Retour d'expérience** : témoignages techniques détaillés d'équipes utilisant Claude Code en production.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| IMPORTANT | Réécrire cette page avec du contenu technique spécifique : analyse de l'écosystème Claude Code, positionnement concurrentiel, features à venir. |
| NICE-TO-HAVE | Ajouter des interviews ou cas d'étude d'équipes qui utilisent Claude Code en production. |

---

## 9. Configurateur (page vide)

### Score : 0 / 10

Page vide, contenu inexistant. La landing page fait la promotion de cet outil de manière visible. C'est trompeur pour le visiteur.

### Recommandations
| Priorité | Recommandation |
|----------|---------------|
| IMPORTANT | Soit implémenter le configurateur, soit retirer le teaser de la landing page. Une promesse non tenue est pire que pas de promesse. |

---

## Synthèse transversale

### Ce qui fonctionne bien pour le connaisseur

1. **La page "Créer un Skill custom"** est le seul contenu véritablement avancé du site. Elle est bien structurée, avec des exemples réalistes et des bonnes pratiques actionnables.
2. **L'architecture MCP** (JSON-RPC, stdin/stdout, Tools/Resources/Prompts) est correctement expliquée au bon niveau de détail technique.
3. **Le comparatif Skills vs MCP vs Plugins** avec l'arbre de décision est un outil de navigation utile.
4. **Le CLAUDE.md hiérarchique** (racine + sous-dossiers) est une information à forte valeur ajoutée.
5. **Les templates de prompting** sont réutilisables et bien structurés.

### Ce qui fait fuir le connaisseur

1. **L'absence totale de contenu sur les agents et l'orchestration multi-agents** — c'est le sujet #1 pour un utilisateur avancé.
2. **L'absence de tutoriel de création de MCP custom** — c'est le sujet #2.
3. **Les pages vides (Agents, Configurateur)** qui sont promues sur la landing page.
4. **Le positionnement "en partant de zéro"** qui repousse les utilisateurs existants.
5. **L'absence de contenu sur les limites** — un connaisseur veut une documentation honnête, pas du marketing.
6. **L'écosystème plugin potentiellement fictif** — les commandes et chiffres non vérifiables érodent la crédibilité.
7. **Pas de hooks** — les PreToolUse, PostToolUse, Stop hooks sont une fonctionnalité avancée clé, totalement absente.
8. **Pas de coûts/pricing détaillé** — aucun benchmark de consommation réelle de tokens.

### Comparaison avec les standards de l'industrie

| Critère | The Claude Codex | HashiCorp Learn | Datadog Guides | GitHub Docs |
|---------|-----------------|-----------------|----------------|-------------|
| Niveaux de difficulté | Promis mais non implémentés | Explicites (beginner/intermediate/advanced) | Par cas d'usage + difficulté | Par profil (user/admin/developer) |
| Contenu avancé | Quasi absent | Tutoriels avancés avec labs | Guides expert avec métriques | API reference + guides avancés |
| Cas réels | Exemples simples (Hello World) | Cas production avec code complet | Dashboards réels, alertes réelles | Workflows GitHub Actions réels |
| Limites/Troubleshooting | Troubleshooting basique | Section dédiée par produit | Diagnostics avancés | Troubleshooting exhaustif |
| Honnêteté sur les limites | Marketing positif uniquement | Section "Known Issues" | "Limitations" documentées | "Limitations" par feature |
| API/Reference technique | Absente | Exhaustive | Exhaustive | Exhaustive |
| Interactivité | Page vide | Labs interactifs | Sandboxes | GitHub Codespaces |

---

## Plan d'action prioritisé

### Priorité CRITIQUE (à traiter immédiatement)

1. **Créer la section Agents** (3 pages minimum) : comprendre les agents, créer des agents custom, patterns d'orchestration. C'est la lacune #1 pour le connaisseur.
2. **Créer le tutoriel "Créer un MCP custom"** : de la spec au déploiement avec le SDK MCP. C'est la lacune #2.
3. **Corriger les informations potentiellement fictives sur les plugins** : vérifier les commandes, les chiffres d'installation, et les fonctionnalités annoncées. Ajouter des sources vérifiables.
4. **Honorer les promesses de la landing page** : soit créer le contenu du parcours "Avancé" (multi-agents, MCP custom, CI/CD), soit retirer ces promesses.

### Priorité IMPORTANTE (à traiter dans les 2 semaines)

5. **Créer une section "Hooks"** : PreToolUse, PostToolUse, Stop hooks — leur fonctionnement, des exemples concrets, des patterns avancés.
6. **Enrichir le prompting** avec 2-3 sous-pages avancées : gestion du contexte, techniques avancées (CoT, extended thinking, plan mode), prompting par modèle.
7. **Ajouter une page "Configuration avancée"** : flags CLI, variables d'environnement, mode headless, mode SDK, intégration CI/CD.
8. **Créer une page "Limites et workarounds"** : documentation honnête des cas où Claude Code échoue, avec des solutions concrètes.
9. **Ajouter une page "Coûts et optimisation"** : benchmark de consommation de tokens, comparaison API/Pro/Max, stratégies d'optimisation des coûts.
10. **Réécrire la page Future/Vision** avec du contenu technique spécifique à Claude Code et une analyse de l'écosystème concurrentiel.
11. **Publier les Skills présentés** dans un repository GitHub téléchargeable.

### Priorité NICE-TO-HAVE (à traiter dans le mois)

12. Ajouter des cas d'étude réels avec témoignages techniques détaillés.
13. Comparer le prompting Claude Code vs ChatGPT vs Copilot vs Cursor (spécificités de chaque outil).
14. Documenter l'intégration avec les IDE (VS Code terminal, Neovim, tmux).
15. Ajouter un guide sur les monorepos et les projets multi-langages.
16. Créer du contenu non-dev (Skills/workflows pour ops, product managers, data analysts).
17. Ajouter un glossaire technique Claude Code (context window, tokens, tools, resources, prompts, agents, hooks, worktrees).

---

## Conclusion

The Claude Codex est un excellent site pour découvrir Claude Code en tant que débutant. Les analogies sont claires, la progression est logique, et le contenu couvre bien les fondamentaux. Mais pour le persona connaisseur, le site est une promesse non tenue.

Le connaisseur cherche trois choses que le site ne fournit pas :
1. **De la profondeur technique** (création de MCP, agents, hooks, configuration avancée)
2. **De l'honnêteté** (limites, coûts réels, cas d'échec, comparaisons nuancées)
3. **De l'actionnable avancé** (patterns production-grade, cas d'étude réels, code téléchargeable)

Pour passer de 5.5/10 à 8/10 pour ce persona, il faut créer le contenu avancé promis (agents, MCP custom, hooks), corriger les informations potentiellement fictives (plugins), et adopter la transparence des meilleures documentations techniques (HashiCorp, GitHub) sur les limites et les coûts.
