# Glosario terminológico FR → EN → ES

> Referencia para toda traducción al español del Claude Codex (UI, MDX, metadatos).
> Objetivo: terminología coherente entre páginas, evitando calcos literales del francés
> y los falsos amigos FR→ES más comunes. Ver `docs/BACKLOG/EPIC-i18n-espagnol-2026-05.md`
> para el contexto de la estrategia de traducción (LLM + glosario + banner beta).

## Principio general

El español técnico de desarrollo conserva muchos anglicismos tal cual (igual que el
francés técnico del sitio: "skill", "hook", "plugin", "prompt" no se traducen en la
versión FR). Seguimos la misma lógica: cuando un término es un nombre de función/producto
o un anglicismo ya asentado en la comunidad hispanohablante de desarrollo, se conserva en
inglés. El resto se traduce a un español natural e idiomático.

## Falsos amigos FR→ES a vigilar

| Francés | NO traducir por (calco) | Español correcto |
|---------|--------------------------|-------------------|
| assister à | asistir a (solo válido para "estar presente en") | según contexto: "presenciar", "ayudar" |
| actuellement | actualmente (falso amigo con "actually" en inglés, pero aquí FR→ES es correcto: actuellement = actualmente) | actualmente |
| librairie (bibliothèque de code) | librería (= tienda de libros en ES) | biblioteca (de código) |
| supporter (un outil) | soportar (ambiguo, connota "aguantar") | ser compatible con, admitir |
| réaliser | realizar (falso amigo: "réaliser" en FR = darse cuenta) | darse cuenta de / llevar a cabo según contexto |
| large (un fichier) | largo (= long, no large) | grande, extenso |
| introduire | introducir (ok) pero cuidado con "présenter" → no es "presentar" siempre | según contexto |

## Términos técnicos Claude Code — decisiones ES

| Término (FR/EN) | Traducción ES adoptada | Nota |
|---|---|---|
| terminal | terminal (m.) | Igual que en FR, término universal |
| prompt | prompt (m.) | Anglicismo conservado, como en FR |
| prompting | prompting (m.) | Conservado (ver "Guía del prompting") |
| skill | Skill (m.) | Conservado con mayúscula como nombre de función, igual que en FR |
| plugin | plugin (m.) | Ya es palabra española estándar |
| hook | hook (m.) | Conservado, término universal en dev |
| agent / subagent | agente / subagente | Traducido, uso natural en ES |
| MCP (Model Context Protocol) | MCP | Sigla invariable |
| workflow | flujo de trabajo | Traducido en prosa; en títulos de función a veces "Workflow" si es nombre propio de feature |
| sandbox | sandbox (m.) | Conservado, común en seguridad ES ("entorno aislado" como glosa ocasional) |
| headless | headless | Conservado ("modo headless") |
| multi-provider | multi-proveedor | Traducido |
| CLAUDE.md | CLAUDE.md | Nombre de archivo, invariable |
| settings.json | settings.json | Nombre de archivo, invariable |
| Worktrees (git worktree) | Worktrees | Conservado, término git específico |
| Cheatsheet | Cheatsheet | Conservado (como en FR) |
| Getting started | Empezar | Traducido para navegación |
| Enterprise (sección) | Empresa | Traducido |
| Best practices | buenas prácticas | Traducido |
| Debugging | depuración | Traducido (más natural que "debugging" en prosa) |
| Deployment / deploy | despliegue / desplegar | Traducido |
| Context window | ventana de contexto | Traducido |
| Token(s) | token(s) | Conservado, estándar en IA/dev |
| Code review | revisión de código | Traducido |
| Pull request / PR | PR | Conservado, universal |
| Commit | commit | Conservado |
| Branch | rama | Traducido en prosa; "branch" se mantiene en comandos literales |
| Framework | framework | Conservado |
| Backend / Frontend | backend / frontend | Conservado |
| Pipeline (CI/CD) | pipeline | Conservado |
| Dataset | dataset | Conservado |
| Insight(s) | insight(s) | Conservado en contexto de datos/analítica |
| Landing page | landing page | Conservado |
| Dashboard | panel / dashboard | Ambos válidos; "panel de administración" en contexto de producto |
| Fullstack | fullstack | Conservado |
| Copiloto | copiloto | Traducido literal, natural en ES |
| Non-dev / non-développeur | no desarrollador | Traducido |
| Cas d'usage / use case | caso de uso | Traducido |
| Parcours (persona) | recorrido | Traducido |
| Glossaire | glosario | Traducido |
| Feuille de route / roadmap | roadmap | Conservado (uso extendido en gestión de producto ES) |
| Astuce (callout) | consejo | Traducido |
| Attention (callout) | atención | Traducido |
| Comparatif | comparativa | Traducido |
| Modération / community validation | validación comunitaria | Traducido |

## Notas de estilo

- Tuteo (`tú`) en toda la interfaz, coherente con el registro cercano y accesible del
  sitio en francés/inglés (no se usa `usted`).
- Evitar el "spanglish" superficial: no traducir literalmente giros franceses o ingleses
  palabra por palabra; preferir la construcción natural en español (frases más cortas,
  sujeto explícito cuando aclara el sentido).
- El signo de interrogación de apertura `¿` y de exclamación `¡` se usan sistemáticamente
  (ej. `¿Qué es Claude Code?`, `¡Claro!`).
- La ñ y las tildes se escriben siempre correctamente (é, í, ó, ú, á, ñ) — nunca omitidas
  aunque el contenido de origen (FR) no las tenga en francés.

## Validación

Story ES-3 del EPIC pide una validación por al menos un dev nativo ES antes de publicar
en producción. Al cierre de este trabajo de infraestructura, ninguna validación nativa ha
sido realizada todavía — el banner "traducción beta" (`BetaTranslationBanner`) permanece
visible hasta que ese paso se complete. Ver el EPIC (`docs/BACKLOG/EPIC-i18n-espagnol-2026-05.md`)
para el seguimiento de esta tarea.
