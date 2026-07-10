# EPIC : Revue complète + article — workflow IA générative de bout en bout (exemple projet Pivot) (2026-07)

> Source : demande PO 2026-07-10.
> Date d'ouverture : 2026-07-10
> Effort estimé : **13 SP** (5 stories sur 2 sprints)
> Pré-requis : articles IA générative V1 (4/6 livrés #265) servent de socle de maillage. Aucun bloquant côté code.
> Priorité : Backlog haut (cornerstone "workflow IAG complet", capitalise sur les 4 articles IA générative déjà en prod).

---

## Contexte

Les articles IA générative V1 (`comfyui-mcp-local`, `comfyui-workflow-piloting`, `agent-generation-assets`, `ia-generative-creative`) documentent chacun une brique du sujet, mais aucune page ne montre **le workflow complet de bout en bout** : de l'intention créative jusqu'à l'asset intégré dans un vrai produit, en passant par le pilotage par Claude Code (prompt, génération, post-traitement, contrôle qualité, intégration).

Le PO souhaite deux livrables complémentaires :

1. **Revue complète** du fonctionnement d'un workflow IAG complet : cartographier chaque étape, les outils, les points de bascule (local vs cloud), les gardes qualité, les coûts, et ce que Claude Code orchestre réellement à chaque maillon.
2. **Un article cornerstone** qui restitue cette revue avec un **exemple concret et incarné** : le projet parallèle **Pivot** du PO. L'exemple sert de fil rouge (cas réel, pas un jouet) pour rendre le workflow tangible.

### Angle éditorial

Différenciation vs les 4 articles existants : ceux-ci sont "par brique" (un MCP, un agent, un panorama). Celui-ci est "par parcours" : un lecteur suit une seule histoire de bout en bout et comprend comment les briques s'enchaînent. Fort intérêt GEO sur l'intent "workflow complet génération d'assets avec Claude Code / de l'idée à la prod".

### ⚠️ Dépendance d'information : le projet Pivot

Le projet **Pivot** est un projet parallèle du PO, externe à ce repo. Ses détails (nature, stack, type d'assets générés, captures, chiffres réels) **ne sont pas connus de l'équipe contenu** et doivent être fournis par le PO avant la rédaction (story WIAG-2). Sans ce brief, l'exemple reste bloqué : ne rien inventer sur Pivot (règle anti-hallucination du projet). À défaut de brief Pivot, fallback possible : exemple générique documenté comme tel.

---

## Stories détaillées

### Sprint 1 — Revue + brief (5 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| WIAG-1 | **Revue complète** du workflow IAG de bout en bout : schéma des étapes (intention → prompt → génération → post-traitement → QA → intégration), inventaire outils, points de bascule local/cloud, gardes qualité, coûts par étape (chiffres à re-vérifier à la rédaction), et ce que Claude Code orchestre à chaque maillon. Faits vérifiés via WebFetch/Playwright, sources datées. | 3 | Note de revue `docs/content/revue-workflow-iag-2026-07.md` |
| WIAG-2 | **Brief projet Pivot** collecté auprès du PO : nature du projet, stack, type d'assets, étapes réellement outillées par Claude Code, captures autorisées, chiffres réels utilisables. Bloquant pour WIAG-3. | 2 | Brief `docs/content/brief-pivot.md` (fourni PO) |

### Sprint 2 — Article cornerstone (8 SP)

| ID | Story | SP | Livrables |
|----|-------|----|-----------|
| WIAG-3 | Article MDX FR : cornerstone "workflow IAG complet" avec Pivot en fil rouge (ou fallback générique si brief indisponible). Structure : intro parcours, schéma `<WorkflowDiagram>`, étapes en `<Steps>`, encarts coûts/bascule, "prochaines étapes" avec maillage vers les 4 articles IA générative. | 3 | `content/fr/use-cases/workflow-iag-complet.mdx` |
| WIAG-4 | Traduction EN parité stricte du cornerstone. | 3 | `content/en/use-cases/workflow-iag-complet.mdx` |
| WIAG-5 | Câblage technique + SEO : `section-navigation`, `SITE_PAGES` (`metadata.ts`), `search-index` FR/EN, maillage bidirectionnel avec les 4 articles IA générative, JSON-LD (Article + HowTo si pertinent), `generate-llms-txt`, tests E2E parité FR/EN. | 2 | fichiers techniques + `e2e/*.spec.ts` |

---

## Critères d'acceptation EPIC

- [ ] Note de revue WIAG-1 relue et validée par le PO
- [ ] Brief Pivot fourni (ou décision explicite de partir sur l'exemple générique)
- [ ] Article FR + EN publiés, parité stricte, thèmes valides (ex. `guide + tooling` ou `use-case + tooling`)
- [ ] Aucun fait sur Pivot ni sur les outils/coûts écrit sans source vérifiée (règle anti-hallucination)
- [ ] Maillage bidirectionnel avec les 4 articles IA générative existants
- [ ] `npm run build` + `npm run test` + type-check + lint OK
- [ ] Vérifié sur `/fr/` et `/en/`

---

## Lien avec les autres EPICs

- **Articles IA générative V1** : socle de maillage, cet article est la "page parcours" qui fédère les 4 briques existantes.
- **EPIC Content page redesign** : le nouveau cornerstone bénéficie des cartes/filtres `themes` déjà en place.
