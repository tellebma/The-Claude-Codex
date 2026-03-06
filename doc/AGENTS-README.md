# Configuration Claude Code — Agent Teams

## Structure

```
.claude/
├── settings.local.json          # Config personnelle (git-ignored)
├── agents/
│   ├── ux-designer.md           # Spécialiste UX/UI et design system
│   ├── devsecops-architect.md   # Architecte DevSecOps, Docker, sécurité
│   ├── content-writer.md        # Rédacteur pédagogique, MDX, SEO
│   ├── claude-expert.md         # Expert Claude Code, MCP, Skills, IA
│   └── code-reviewer.md         # QA, revue de code, Lighthouse, a11y
```

## Utilisation

### Prérequis
- Claude Code installé
- Abonnement Claude Max recommandé (agent teams = ~7× tokens d'une session standard)
- `tmux` installé pour le mode split-pane (optionnel mais recommandé)

### Activer les Agent Teams
La config est déjà dans `settings.local.json`. Vérifiez que le flag est actif :
```bash
echo $CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
# Doit afficher : 1
```

### Lancer une équipe
Dites simplement à Claude Code en langage naturel :
```
Crée une équipe d'agents pour construire la landing page.
- Un teammate UX designer pour le design et les composants
- Un teammate content-writer pour le contenu MDX
- Un teammate code-reviewer pour la QA en continu
```

### Workflow recommandé par page

1. **Planifier** : Utiliser le mode Plan (`Shift+Tab` x2) pour définir la structure
2. **Designer** : Le `ux-designer` crée les composants visuels
3. **Rédiger** : Le `content-writer` produit le contenu MDX
4. **Intégrer** : Le lead assemble design + contenu
5. **Sécuriser** : Le `devsecops-architect` valide Docker et headers
6. **Vérifier** : Le `code-reviewer` fait la QA finale
7. **Valider** : Le `claude-expert` fact-check le contenu technique

### Invoquer un agent spécifique
```
Utilise l'agent devsecops-architect pour auditer le Dockerfile
Utilise l'agent claude-expert pour vérifier la page MCP
```

## Modèles assignés

| Agent               | Modèle  | Raison                                          |
|---------------------|---------|--------------------------------------------------|
| ux-designer         | Opus    | Design créatif, décisions visuelles complexes    |
| devsecops-architect | Opus    | Sécurité critique, architecture                  |
| content-writer      | Sonnet  | Volume de texte important, bon rapport coût/qualité |
| claude-expert       | Opus    | Précision technique maximale requise             |
| code-reviewer       | Sonnet  | Tâches répétitives, lint, vérifications          |

## Permissions

Le `settings.local.json` est configuré en mode **productif mais sécurisé** :
- ✅ Build, lint, test, git, docker : auto-approuvés
- ❌ Secrets (.env, .pem, credentials) : lecture bloquée
- ❌ Commandes destructives (rm -rf, push --force) : bloquées
- ❌ Réseau (curl, wget, ssh) : bloqué par défaut

## Conseils

- **Compactez manuellement** à ~50% du contexte (`/compact`)
- **Committez souvent** — au moins à chaque page terminée
- **Un chat = une feature** — utilisez `/clear` entre les pages
- **tmux** est fortement recommandé pour voir tous les agents en parallèle
