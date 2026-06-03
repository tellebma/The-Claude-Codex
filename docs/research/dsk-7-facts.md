# DSK-7 — Faits vérifiés (Huashu Design)

Vérification : 2026-06-03.

## CHANGEMENT MAJEUR vs EPIC (mai 2026)

L'EPIC (matériau du 2026-05-11) décrit Huashu Design avec une **licence restrictive** :
"usage personnel gratuit, commercial/entreprise 1 800 à 3 500 USD selon contact direct".

**Ce n'est plus vrai.** Le repo a été **relicencié sous MIT le 2026-05-14**.

> Sources :
> - github.com/alchaincyf/huashu-design (README + LICENSE), consulté 2026-06-03
> - API GitHub : `license.spdx_id = "MIT"`, consulté 2026-06-03
> - WebSearch confirmation (DeepWiki, pasqualepillitteri.it), 2026-06-03

Le README indique explicitement : "Relicensed to MIT on 2026-05-14. Previously under a
Personal Use License restricting commercial use; that restriction is now removed."

**Conséquence rédactionnelle** : le `<Callout type="warning">` "licence commerciale 1800-3500 USD"
prévu par l'EPIC (Annexe C.4) est OBSOLÈTE. Je le remplace par un warning sur l'HISTORIQUE de licence
(était restrictif, est passé MIT le 2026-05-14, donc re-vérifier la licence avant tout engagement
car elle a déjà changé une fois). C'est honnête et toujours utile au lecteur.

## Faits vérifiés (2026-06-03)

| Champ | Valeur | Source |
|-------|--------|--------|
| Repo | github.com/alchaincyf/huashu-design | API GitHub |
| Description repo | "Huashu Design · HTML-native design skill for Claude Code · ... · 高保真原型 / 幻灯片 / 动画 + 20 设计哲学 + 5 维评审 + MP4 导出 · Agent-agnostic" | API GitHub |
| Branche par défaut | `master` | API GitHub |
| Licence | MIT (relicencié 2026-05-14), `Copyright (c) 2026 alchaincyf (花叔 · 花生)` | LICENSE + README |
| Étoiles GitHub | 16 049 ★ | API GitHub (2026-06-03) |
| Tagline / promesse | "Type. Hit enter. A finished design lands in your lap." | README |
| Auteur | Huasheng / 花叔 (@AlchainHust) | README |
| Contact | X @AlchainHust, huasheng.ai, WeChat 花叔 | README |
| Installation | `npx skills add alchaincyf/huashu-design` | README |
| Harnais supportés | Claude Code, Cursor, Codex, OpenClaw, Hermes, "any markdown-skill-capable agent" | README |

### Fonctionnalités clés (README, 2026-06-03)

- Prototypes interactifs HTML cliquables (cadre iPhone)
- Decks de slides HTML + export PPTX éditable
- Motion design MP4/GIF avec BGM
- Variantes de design (3+ directions, tweaks live)
- Infographies / data viz print-quality
- Conseiller de direction artistique (5 écoles × 20 philosophies)
- Critique expert 5 dimensions (radar + punch list)

## Cohérence avec les autres fiches du site

- L'article cornerstone /content/stack-design-claude-code (livré Sprint 1) cite encore
  "Huashu Design : gratuit perso / payant pro (1 800 à 3 500 USD)". C'EST DÉSORMAIS FAUX.
  → À signaler à la phase fact-check pour correction de la cornerstone et du TL;DR.
- La fiche Impeccable et les autres mentionnent "Huashu Design : licence commerciale payante
  en entreprise". À corriger aussi (hors scope DSK-7 strict, mais à flagger).
