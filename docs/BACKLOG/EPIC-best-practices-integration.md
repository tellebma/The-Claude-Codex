# EPIC : Best Practices Integration

> Source : analyse du repo [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) (120k+ stars)
> Date : 2026-03-30
> Durée estimée : 4 sprints (4 semaines)
> Effort total : 68 story points (17 stories)

---

## Vision

Intégrer les bonnes pratiques de référence de Claude Code dans The Claude Codex pour en faire la documentation francophone (et anglophone) la plus complète sur le sujet. Couvrir les sujets manquants identifiés : worktrees, hooks avancés, permissions, workflows, prompting avancé, CLI, browser automation, mémoire.

---

## Priorisation MoSCoW

### MUST HAVE (18 SP, Sprint 0-1)

| ID | Story | SP | Section cible |
|----|-------|----|---------------|
| M1 | Git Worktrees & parallélisme | 3 | `/advanced/worktrees` (nouvelle page) |
| M2 | Hooks : enrichissement avancé (SessionStart, PermissionRequest, patterns) | 5 | Enrichir `/advanced/hooks` existant |
| M3 | Tips prompting avancé (ultrathink, "grill me", Esc Esc, /rewind, /compact) | 3 | `/prompting/power-tips` (nouvelle page) |
| M4 | CLI flags avancés (--bare, --teleport, --agent, -w, --max-budget-usd) | 3 | Enrichir `/reference/cli` existant |
| M5 | Permissions & Sandbox (wildcards, /sandbox, /permissions) | 3 | `/advanced/permissions-sandbox` (nouvelle page) |
| M6 | Settings.json avancé (hiérarchie complète, tous les champs) | 2 | Enrichir `/reference/settings` existant |

### SHOULD HAVE (16 SP, Sprint 1-2)

| ID | Story | SP | Section cible |
|----|-------|----|---------------|
| S1 | Workflows avancés (Research->Plan->Execute->Review->Ship) | 5 | `/advanced/workflows` (nouvelle page) |
| S2 | Mémoire & CLAUDE.md avancé (ancestor/descendant, agent memory, `<important>`) | 5 | Enrichir `/prompting/claude-md` existant |
| S3 | Pattern orchestration (Command vs Agent vs Skill) | 2 | Enrichir `/agents/orchestration` existant |
| S4 | Enrichir Skills (9 catégories Thariq, progressive disclosure) | 2 | Enrichir `/skills/best-skills` existant |
| S5 | Enrichir Agents (16 champs frontmatter, model/memory/isolation) | 2 | Enrichir `/agents/create-subagent` existant |

### COULD HAVE (14 SP, Sprint 2-3)

| ID | Story | SP | Section cible |
|----|-------|----|---------------|
| C1 | Browser automation (Playwright vs Chrome DevTools vs Claude in Chrome) | 5 | `/advanced/browser-automation` (nouvelle page) |
| C2 | Enrichir Prompting (voice, ASCII diagrams, output styles) | 3 | Enrichir pages prompting existantes |
| C3 | Composant ComparisonTable (tableau comparatif interactif) | 3 | `components/ui/ComparisonTable.tsx` |
| C4 | Composant WorkflowDiagram (pipeline visuel en étapes) | 3 | `components/ui/WorkflowDiagram.tsx` |

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Permissions wildcards settings.local.json | Chore DX interne, pas du contenu |
| W2 | Hook PostToolUse auto-format | Déjà couvert dans la page hooks |
| W3 | Skill /new-page | Automatisation DX interne, traiter en chore séparée |
| W4 | Mega-menu navigation | Attendre que le contenu soit en place, Sprint 3+ |

---

## Architecture de l'information (recommandation UX)

### Principe : zéro nouvelle section de navigation

On enrichit les sections existantes (`advanced`, `prompting`, `skills`, `agents`, `reference`). L'utilisateur ne voit aucun changement dans le header, il découvre les nouveaux contenus via les sidebars de section.

### Nouvelles sous-pages (5)

```
/advanced/worktrees              ← M1
/advanced/permissions-sandbox    ← M5
/advanced/workflows              ← S1
/advanced/browser-automation     ← C1
/prompting/power-tips            ← M3
```

### Enrichissements de pages existantes (7)

```
/advanced/hooks          ← M2 (SessionStart, PermissionRequest, patterns avancés)
/reference/cli           ← M4 (--bare, --teleport, --agent, -w)
/reference/settings      ← M6 (hiérarchie complète managed→CLI→local→project→global)
/prompting/claude-md     ← S2 (ancestor/descendant, agent memory, <important>)
/agents/orchestration    ← S3 (Command vs Agent vs Skill, arbre de décision)
/skills/best-skills      ← S4 (9 catégories Thariq, progressive disclosure)
/agents/create-subagent  ← S5 (16 champs frontmatter complets)
```

### Sidebar groupée (si section > 8 items)

Pour `/advanced` qui passera à 7 sous-pages, et `/prompting` qui en aura 7+, ajouter des séparateurs visuels avec labels dans `SectionSidebar` :

```
AVANCÉ
  Fondamentaux
    Hooks
    Headless CI
    Multi-provider
  Productivité
    Worktrees
    Workflows
  Sécurité
    Permissions & Sandbox
    Browser automation
```

---

## Parcours utilisateur (personas)

| Persona | Parcours optimal | Pages clés de cette EPIC |
|---------|-----------------|--------------------------|
| **Débutant** | Landing → Getting Started → Prompting/basics | Power tips (M3) en "prochaines étapes" |
| **Dev intermédiaire** | Skills → MCP → Prompting/directives → Settings | Settings avancé (M6), CLI flags (M4) |
| **Power user** | Worktrees → Workflows → Power tips → Hooks → Orchestration | M1, S1, M3, M2, S3 |
| **Tech lead / Architecte** | Permissions → Settings → Enterprise → Workflows | M5, M6, S1 |

---

## Composants UI à créer

### Priorité haute

**ComparisonTable** (`components/ui/ComparisonTable.tsx`) : tableau comparatif interactif avec colonnes, icônes check/cross/partial, responsive en cartes sur mobile. Utilisé par browser automation (C1), orchestration (S3).

**KeyboardShortcut** (`components/ui/KeyboardShortcut.tsx`) : composant `<kbd>` stylé pour afficher les raccourcis (Esc Esc, Ctrl+C). Utilisé par power tips (M3).

### Priorité moyenne

**WorkflowDiagram** (`components/ui/WorkflowDiagram.tsx`) : pipeline visuel horizontal (desktop) / vertical (mobile) avec étapes connectées par des flèches. Utilisé par workflows (S1).

### Priorité basse

**InteractiveChecklist** : checklists avec persistence localStorage. Nice-to-have.
**FileTreeDiagram** : arborescence de fichiers stylée. Nice-to-have.

---

## Sprint Planning

> Statut : EPIC terminée le 2026-03-30. Tous les sprints livrés en une session.

### Sprint 0 : Outillage & Fondations — ✅ 19/19 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| M4 | Enrichir reference/cli.mdx (flags avancés) | 3 | ✅ |
| M6 | Enrichir reference/settings.mdx (hiérarchie) | 2 | ✅ |
| M5 | Permissions & Sandbox (nouvelle page) | 3 | ✅ |
| M1 | Git Worktrees (nouvelle page) | 3 | ✅ |
| M3 | Tips prompting avancé (nouvelle page) | 3 | ✅ |
| — | Composant KeyboardShortcut | 2 | ✅ |
| M2.1 | Hooks : types manquants + patterns avancés | 3 | ✅ |

### Sprint 1 : Concepts avancés — ✅ 21/21 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| M2.2 | Hooks patterns avancés | 2 | ✅ (couvert dans M2.1) |
| S2 | Mémoire & CLAUDE.md avancé | 5 | ✅ |
| S1 | Workflows avancés (nouvelle page) | 5 | ✅ |
| S3 | Pattern orchestration | 2 | ✅ |
| S4 | Enrichir Skills (9 catégories) | 2 | ✅ |
| S5 | Enrichir Agents (16 champs frontmatter) | 2 | ✅ |
| — | Composant ComparisonTable | 3 | ✅ |

### Sprint 2 : Contenu avancé & Polish — ✅ 8/11 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| C1 | Browser automation (nouvelle page) | 5 | ✅ |
| C2 | Enrichir Prompting (voice, ASCII, styles) | 3 | ✅ |
| C4 | Composant WorkflowDiagram | 3 | ⬜ Backlog (nice-to-have) |

### Sprint 3 : Stabilisation — ✅

- [x] Revue transversale SEO (metadata.ts + search-index.ts complets)
- [x] Tests i18n FR/EN : parité 84 FR = 84 EN
- [x] Build OK : 206 pages statiques, 0 erreur
- [x] Lint + type-check : 0 erreur
- [x] Mise à jour search index exhaustive (10 nouvelles entrées FR+EN)

---

## Graphe de dépendances

```
M4 (CLI flags) ────────────────────────────────── indépendant
M6 (Settings) ──────────┐
                         ├──→ M5 (Permissions) ── indépendant après M6
M1 (Worktrees) ─────────┤
M3 (Tips prompting) ─────┤──→ standalone
                         │
M2.1 (Hooks types) ──→ M2.2 (Hooks patterns) ──→ S1 (Workflows) ──→ S3 (Orchestration)

S2 (CLAUDE.md avancé) ── dépend de M6
S4 (Skills enrichi) ──── indépendant
S5 (Agents enrichi) ──── indépendant
C1 (Browser) ─────────── dépend de ComparisonTable (Sprint 1)
C2 (Prompting enrichi) ─ dépend de M3
```

**Items parallélisables** (via worktrees) :
- Sprint 0 : M4 + M6 en parallèle, puis M5 + M1 en parallèle, puis M3 + M2.1
- Sprint 1 : S2 + S4 + S5 en parallèle, puis S1 + S3

---

## Definition of Done (DoD)

Chaque story est "Done" quand :

- [ ] Contenu MDX FR : fichier créé/modifié dans `content/fr/` avec frontmatter valide
- [ ] Contenu EN : fichier créé/modifié dans `content/en/` (traduction de qualité, pas du Google Translate)
- [ ] Navigation : `section-navigation.ts` mis à jour si nouvelle page
- [ ] Traductions UI : `messages/fr.json` et `messages/en.json` mis à jour si nouvelle page
- [ ] Search index : `search-index.ts` mis à jour avec entrées FR et EN
- [ ] Metadata SEO : page ajoutée dans `SITE_PAGES` de `metadata.ts` si nouvelle page
- [ ] Build OK : `npm run build` passe sans erreur
- [ ] Lint OK : `npm run lint` passe sans erreur
- [ ] Type-check OK : `npm run type-check` passe sans erreur
- [ ] Vérification i18n : `/fr/{page}` et `/en/{page}` affichent le bon contenu
- [ ] Ton éditorial : texte naturel, pas de tics IA, analogies concrètes
- [ ] Composants MDX : utilise Callout, CodeBlock, Steps, Card de manière pertinente
- [ ] Liens internes : fonctionnels et préfixés par la locale
- [ ] Section "Prochaines étapes" en fin de page

---

## User Stories détaillées (Must Have)

### M1 : Git Worktrees & parallélisme (3 SP)

> En tant que **power user Claude Code**, je veux comprendre comment utiliser les git worktrees pour lancer plusieurs sessions en parallèle sur le même repo sans conflits.

**Critères d'acceptation :**
- Explique le concept de worktree Git en 1 paragraphe avec analogie
- Documente `claude -w` avec exemples
- Workflow concret : "feature A dans worktree 1, fix B dans worktree 2"
- Mentionne `/batch` pour le parallélisme de masse
- Limites : performance, espace disque
- FR + EN, ajoutée dans la section `advanced`

### M2 : Hooks enrichissement avancé (5 SP)

> En tant que **développeur automatisant ses workflows**, je veux connaître tous les types de hooks et les patterns avancés pour couvrir tous les points d'interception possibles.

**M2.1 : Types manquants (3 SP)**
- Ajoute `SessionStart` : déclenchement, variables, exemples
- Ajoute `PermissionRequest` : interception, auto-approve conditionnelle
- Met à jour le tableau des types

**M2.2 : Patterns avancés (2 SP)**
- Pattern routing de modèle (PreToolUse → Haiku pour tâches simples)
- Pattern nudge (rappeler une convention)
- Pattern logging structuré (JSON pour audit)
- Chaque pattern avec bloc de code complet et copiable

### M3 : Tips prompting avancé (3 SP)

> En tant qu'**utilisateur intermédiaire**, je veux connaître les raccourcis et commandes non évidentes pour gagner en productivité.

**Critères d'acceptation :**
- `ultrathink` et variantes : ce que ça fait, quand l'utiliser
- "grill me" et "scrap this" : patterns de prompt pour du pushback
- `Esc Esc` : interrompre et reprendre le contrôle
- `/rewind` : revenir en arrière dans la conversation
- `/compact` à 50% : quand et pourquoi compacter proactivement
- Raccourcis clavier utiles (utilise composant KeyboardShortcut)
- FR + EN, ajoutée dans la section `prompting`

### M4 : CLI flags avancés (3 SP)

> En tant que **développeur**, je veux une référence CLI complète incluant les flags avancés.

**Critères d'acceptation :**
- Ajoute `--bare`, `--teleport`, `--agent`, `--max-budget-usd`, `-w`/`--worktree`, `--add-dir`
- Chaque flag avec exemple d'utilisation
- Lien vers la page worktrees (M1)
- FR + EN

### M5 : Permissions & Sandbox (3 SP)

> En tant que **tech lead soucieux de la sécurité**, je veux une page de référence unique sur le système de permissions.

**Critères d'acceptation :**
- Syntaxe des wildcards (`Bash(git:*)`, `Write(src/**)`)
- Commandes `/sandbox` et `/permissions` documentées
- Exemples settings.json pour 3 profils : dev junior, dev senior, CI/CD
- Lien vers la page sécurité existante
- FR + EN, ajoutée dans la section `advanced`

### M6 : Settings.json avancé (2 SP)

> En tant qu'**administrateur Claude Code en entreprise**, je veux comprendre la hiérarchie complète de précédence.

**Critères d'acceptation :**
- Ajoute le niveau `managed` (organisation) et `CLI`
- Schéma de précédence visuel : managed > CLI > local > project > global
- Cas d'usage enterprise : imposer un modèle, interdire certains outils
- FR + EN

---

## Risques et mitigations

| Risque | Prob. | Impact | Mitigation |
|--------|-------|--------|------------|
| Contenu EN de qualité insuffisante | Moyenne | Fort | Rédiger l'EN comme du contenu original, relecture indépendante |
| Explosion du scope sur les enrichissements | Haute | Moyen | Timeboxer chaque enrichissement à 2h max, DoD précis |
| Build Docker cassé par nouvelles pages | Faible | Fort | `npm run build` après chaque nouvelle page |
| Fatigue de contexte (sessions longues) | Moyenne | Moyen | MEMORY.md à jour, `/compact` régulier |
| Incohérence de ton entre pages | Moyenne | Moyen | Template MDX de référence réutilisé |
| Search index désynchronisé | Haute | Faible | Vérification systématique dans la DoD |

---

## Cérémonies adaptées (solo dev + IA)

| Cérémonie | Quand | Durée | Format |
|-----------|-------|-------|--------|
| Session Log | Chaque session | 1 min | 3 lignes dans MEMORY.md (fait/en cours/prochain) |
| Sprint Planning | Lundi | 15 min | Relecture backlog sprint |
| Backlog Refinement | Mercredi | 10 min | Affinage sprint N+1 |
| Sprint Review | Vendredi | 30 min | Build Docker + navigation FR/EN |
| Sprint Retro | Vendredi | 15 min | 5 questions écrites |

---

## KPIs de succès

| KPI | Cible |
|-----|-------|
| Nouvelles pages MDX | 5-7 |
| Pages enrichies | 5-7 |
| Couverture i18n | 100% FR + EN |
| Build success | 0 erreur |
| Score Lighthouse | > 90 (4 métriques) |
| Must Have livrés | 6/6 (100%) |
| Should Have livrés | 4/5 (80%+) |
