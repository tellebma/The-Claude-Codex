# DSK-6 — Faits vérifiés (workflow design + Playwright MCP)

Vérification : 2026-06-03.

## Playwright MCP

| Fait | Valeur | Source | Date |
|------|--------|--------|------|
| Package npm | `@playwright/mcp` | github.com/microsoft/playwright-mcp | 2026-06-03 |
| Version latest | v0.0.75 (7 mai 2026) | github.com/microsoft/playwright-mcp | 2026-06-03 |
| Install ad hoc | `npx @playwright/mcp@latest` | github.com/microsoft/playwright-mcp | 2026-06-03 |

### Outils MCP cités (noms exacts vérifiés)

- `browser_navigate`
- `browser_take_screenshot`
- `browser_snapshot`
- `browser_evaluate`
- `browser_resize`
- `browser_click`
- `browser_wait_for`
- `browser_console_messages`

Source : github.com/microsoft/playwright-mcp (liste des tools), consulté 2026-06-03.

## Notes

- Le profil "dev" du CLAUDE.md global charge déjà `@playwright/mcp` ; aucun setup additionnel pour l'auteur.
- Le viewport se règle via `browser_resize` (largeur/hauteur) puis `browser_take_screenshot`.
- axe-core n'est pas un outil natif du MCP : on l'injecte via `browser_evaluate` (script axe.run()). Présenté comme tel dans l'article.
- Trame de workflow : reprise de l'EPIC (section "Workflow type documenté dans DSK-6"), 9 étapes.
- Cross-links : /mcp/ (overview), /mcp/securite-mcp (limitations), /skills/impeccable, /skills/taste-skill, /content/stack-design-claude-code (cornerstone), /content/refaire-une-card-avec-impeccable-et-playwright (démo DSK-8).

## Points d'attention

- Le numéro de version Playwright MCP (v0.0.75) bouge vite : à re-vérifier à chaque refresh trimestriel.
- Les captures Playwright réelles (≥ 6) ne sont pas produites dans cette phase : marquées TODO.
