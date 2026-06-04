# Fiche factuelle — Orchestration d'équipes d'agents Claude

Recherche menée le 2026-06-04. Sources primaires uniquement (sites officiels, repos GitHub, docs fournisseur). Tout chiffre volatil (étoiles, version) est daté.

---

## 1. Capacités natives de Claude Code

### Agent teams (officiel, expérimental)
Source : https://code.claude.com/docs/en/agent-teams (consulté 2026-06-04)

- Coordonne plusieurs sessions Claude Code qui travaillent ensemble. Une session est le **team lead** (crée l'équipe, spawn les teammates, assigne et synthétise). Les **teammates** travaillent chacun dans leur propre fenêtre de contexte et **se parlent directement** entre eux.
- Différence avec les subagents : les subagents ne font que rapporter au main agent et ne communiquent pas entre eux. Les teammates partagent une task list, claim le travail et s'envoient des messages.
- **Expérimental, désactivé par défaut.** Activation via la variable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` (valeur `"1"`) dans `settings.json` ou l'environnement.
- **Version requise : Claude Code v2.1.32 ou plus** (`claude --version`).
- Architecture : Team lead + Teammates + Task list partagée (états pending/in progress/completed, dépendances, file locking) + Mailbox (messagerie). Stockage local : `~/.claude/teams/{team}/config.json` et `~/.claude/tasks/{team}/`.
- Modes d'affichage : in-process (un seul terminal, Shift+Down pour cycler) ou split panes (tmux ou iTerm2). Défaut `"auto"`.
- Réutilise les définitions de subagents comme rôles de teammate (ex `security-reviewer`).
- Quality gates via hooks : `TeammateIdle`, `TaskCreated`, `TaskCompleted` (exit code 2 = feedback/blocage).
- Plan approval : un teammate peut être forcé en plan mode read-only jusqu'à validation du lead.
- **Coûts** : "use significantly more tokens than a single session", scaling linéaire avec le nombre de teammates. Reco : 3-5 teammates, 5-6 tâches par teammate.
- **Limites officielles** : pas de reprise de session pour teammates in-process (`/resume`, `/rewind`), statut de tâche peut traîner, une seule équipe à la fois, pas d'équipes imbriquées, lead fixe (pas de transfert de leadership), split panes non supportés dans VS Code / Windows Terminal / Ghostty.

### Subagents (officiel)
Source : https://code.claude.com/docs/en/sub-agents (référencé depuis agent-teams, consulté 2026-06-04)
- Workers focalisés dans une session unique, propre fenêtre de contexte, rapportent le résultat au main agent. Coût inférieur aux teams (résultat résumé dans le contexte principal).

---

## 2. Paperclip (outil dédié — point de départ PO)

Sources :
- Repo : https://github.com/paperclipai/paperclip (consulté 2026-06-04)
- Site : https://paperclip.ing/ (consulté 2026-06-04)

- **Existence confirmée.** Repo `paperclipai/paperclip`.
- **Tagline officielle** : "The app people use to manage AI agents for work".
- **Licence : MIT.**
- **Stack** : TypeScript (~98%), Node.js 20+, pnpm 9.15+, UI React, backend PostgreSQL.
- **Étoiles : ~69 000 au 2026-06-04** (compteur volatil, à re-vérifier).
- **Dernière release : v2026.529.0 (2026-05-30)** ; ~2 579 commits sur master. Activement maintenu.
- **Install** : `npx paperclipai onboard --yes` (ou clone manuel + `pnpm install` + `pnpm dev`).
- **Fonctionnement (org-as-software)** :
  - Org chart : "Hierarchies, roles, reporting lines. Your agents have a boss, a title, and a job description."
  - Goals : hiérarchie Mission → Project Goal → Agent Goal → Task. "Every task traces back to the mission."
  - Budgets : "Monthly budgets per agent. When they hit the limit, they stop. No runaway costs."
  - Gouvernance : "You're in charge. Approve hires, override strategy, pause or terminate any agent at any time." Un agent ne peut pas recruter sans approbation.
  - Délégation : "Delegation flows up and down the org chart automatically."
  - Suivi des coûts : "Track costs per agent, per task, per project, per goal."
- **Runtimes supportés (site officiel)** : Claude, OpenAI Codex, Gemini, Cursor, Hermes, OpenClaw, Pi, OpenCode. → Compatible Claude / Claude Code confirmé.
- Note : MCP `mcp__paperclip__*` exposé dans cet environnement (cohérent avec un control plane orienté agents). Non utilisé comme source factuelle.

---

## 3. "L'appli bureau / openspace" recherchée par le PO — IDENTIFIÉE

### claude-office (le plus probable, primaire = "bureau openspace")
Source : https://github.com/paulrobello/claude-office (consulté 2026-06-04)
- **Description officielle** : "Real-time pixel art office simulation that visualizes Claude Code operations."
- Représente le main agent Claude en "boss" et les subagents en "employees", avec états (working, delegating, waiting), bulles de pensée/parole, navigation multi-étages, whiteboard à 12 modes (todo, remote workers, tool usage pie chart, org chart, etc).
- **Licence : MIT.** Stack : Next.js, PixiJS, Zustand (front) + FastAPI/Python (back), WebSocket.
- **Étoiles : ~415 au 2026-06-04** (snapshot). v0.15.0 (mai 2026), ~147 commits. Récent.
- Install : `git clone ... && make install-all && make dev-tmux`.

### Pixel Office (variante, plugin IDE — mention secondaire)
Source : https://plugins.jetbrains.com/plugin/31298-pixel-office--ai-agent-visualizer (consulté 2026-06-04)
- Plugin JetBrains/IntelliJ qui transforme chaque session terminal Claude Code en personnage pixel art dans un bureau virtuel (marche, s'assoit, reflète l'activité de l'agent en temps réel). Visualisation de sous-agents annoncée côté résultats de recherche, **non confirmée sur la page produit** (page renvoyait surtout le titre). → À traiter prudemment ou en mention courte.

**Conclusion** : l'outil que le PO décrit ("transforme les sessions Claude en bureau openspace") = **claude-office** (paulrobello), source primaire GitHub confirmée. "Pixel Office" (JetBrains) est une variante plugin IDE du même concept.

---

## 4. Alternatives (orchestrateurs multi-agents utilisables avec Claude)

### CrewAI
Source : https://github.com/crewAIInc/crewAI (consulté 2026-06-04)
- Orchestration d'agents "role-playing" autonomes : Crews (collaboration dynamique) + Flows (workflows event-driven). Process hiérarchique avec un manager agent qui délègue.
- **Licence MIT**, Python. **~52,8k étoiles** (observé via tag de release, 2026-05-28). Dernière version **1.14.6**. Indépendant de LangChain.
- Claude/Anthropic : supporte "various LLMs", branchable sur d'autres modèles via config ; intégration Claude non explicitement affichée sur la page repo → formuler comme "compatible via configuration LLM".

### LangGraph
Source : https://github.com/langchain-ai/langgraph (consulté 2026-06-04)
- Framework d'orchestration bas niveau pour agents stateful long-running (exécution durable, human-in-the-loop, mémoire). Orchestration par graphe.
- **Licence MIT**, Python. **~33,8k étoiles** (snapshot 2026-06-04). Version **1.2.4 (2026-06-02)**.
- Claude/Anthropic : non mentionné explicitement sur la page repo (tags citent OpenAI/Gemini) → formuler "modèle-agnostique, branchable sur Claude via LangChain".

### AutoGen / AG2 — À TRAITER AVEC PRUDENCE
Source : https://github.com/microsoft/autogen (consulté 2026-06-04)
- Framework multi-agent (two-agent chat, GroupChat). **Dual licence CC-BY-4.0 + MIT**, Python/C#/TS. ~58,7k étoiles. Dernière version python-v0.7.5 (**2025-09-30**).
- **EN MODE MAINTENANCE** : plus de nouvelles features ; Microsoft recommande le **Microsoft Agent Framework** pour les nouveaux projets.
- → Ne PAS recommander activement. Mentionner comme historique/maintenance si pertinent, ou écarter.

### Claude Agent SDK (natif Anthropic, pour aller plus loin)
- Le SDK officiel Anthropic pour construire des agents (cité dans les comparatifs frameworks 2026 comme natif tool use + Memory). Déjà couvert par la page interne `/agents/agent-sdk`. → À lier, pas à re-détailler.

---

## 5. Synthèse pour l'angle éditorial

- **Avant d'installer quoi que ce soit** : Claude Code fait déjà du multi-agent (subagents + agent teams expérimentaux). C'est le point de départ honnête.
- **Quand un orchestrateur dédié se justifie** : besoin de rôles persistants, budgets, gouvernance, suivi de coûts dans le temps, org chart durable. Là, Paperclip est l'option la plus "organisation d'entreprise".
- **Visualisation** : claude-office / Pixel Office répondent au besoin "voir mon équipe d'agents comme un bureau".
- **Frameworks code** (CrewAI, LangGraph) : pour qui code son orchestration en Python, pas pour piloter des sessions Claude Code en place.

### Outils RETENUS
1. Natif Claude Code (subagents + agent teams) — socle
2. Paperclip — orchestrateur org-as-software détaillé
3. claude-office — visualisation bureau (réponse à la demande PO)
4. CrewAI — framework code role-based
5. LangGraph — framework code graphe stateful

### Outils ÉCARTÉS / prudence
- AutoGen/AG2 : maintenance mode (pas de reco active).
- Pixel Office (JetBrains) : mention secondaire de claude-office, détails subagents non confirmés sur page produit.
</content>
