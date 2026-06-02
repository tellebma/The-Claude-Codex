# CC-1 — Recherche factuelle `claude-council` (pattern LLM Council)

> Date de compilation : 2026-06-02
> Source primaire OBLIGATOIRE : `github.com/karpathy/llm-council` (README + `backend/config.py`, branche `master`)
> Métadonnées re-vérifiées via l'API GitHub le 2026-06-02 (chiffres volatils, re-vérifier avant chaque publication)
> Story : CC-1 de l'EPIC `content/claude-council` — The Claude Codex
> Règle absolue : le blog tiers **apsodia.com est NON CITABLE** comme source factuelle (interdit par CLAUDE.md). Tout ce qui en vient = inspiration narrative, jamais un fait.

---

## 1. Identité du repo (source primaire)

| Champ | Valeur vérifiée | Source |
|-------|-----------------|--------|
| Nom canonique | `karpathy/llm-council` | API GitHub `/repos/karpathy/llm-council` |
| Auteur | Andrej Karpathy (@karpathy) | API GitHub + README |
| Description GitHub | "LLM Council works together to answer your hardest questions" | API GitHub `description` |
| Date de création | **2025-11-22T23:24:14Z** (un samedi, cohérent avec « Saturday hack ») | API GitHub `created_at` |
| Dernier push | 2025-11-22T23:35:21Z (créé et poussé le même jour, ~11 min plus tard) | API GitHub `pushed_at` |
| Branche par défaut | `master` | API GitHub `default_branch` |
| Archivé | Non (`archived: false`) mais explicitement non maintenu (cf. §4) | API GitHub `archived` |
| **Stars** | **19 909 ⭐ au 2026-06-02** (chiffre volatil, re-vérifier) | API GitHub `stargazers_count` |
| **Forks** | **3 764 forks au 2026-06-02** (chiffre volatil, re-vérifier) | API GitHub `forks_count` |
| **Licence** | **Aucune** (`license: null`) — pas de fichier LICENSE | API GitHub `license` |

<!-- source: https://api.github.com/repos/karpathy/llm-council, consulté 2026-06-02 -->

> Note rédaction : préfixer TOUT chiffre de popularité de sa date « au 2026-06-02 » et inviter à re-vérifier sur GitHub. Entre l'ouverture EPIC (19 832 ★ / 3 752 forks au 2026-06-01) et la compilation (19 909 ★ / 3 764 forks au 2026-06-02), les chiffres ont déjà bougé : preuve qu'ils sont volatils.

---

## 2. Le workflow en 3 stages (noms EXACTS du README, verbatim)

Citation verbatim du README (branche `master`, consulté 2026-06-02) :

1. **Stage 1: First opinions**. "The user query is given to all LLMs individually, and the responses are collected. The individual responses are shown in a 'tab view', so that the user can inspect them all one by one."
2. **Stage 2: Review**. "Each individual LLM is given the responses of the other LLMs. Under the hood, the LLM identities are anonymized so that the LLM can't play favorites when judging their outputs. The LLM is asked to rank them in accuracy and insight."
3. **Stage 3: Final response**. "The designated Chairman of the LLM Council takes all of the model's responses and compiles them into a single final answer that is presented to the user."

Points factuels à respecter dans la page :
- Les identités sont **anonymisées** au Stage 2 (anti-favoritisme), pas optionnel : c'est dans le README.
- Le classement se fait sur l'axe **accuracy + insight** (termes du README).
- Le **Chairman** est un LLM **désigné** qui produit la synthèse finale unique.

<!-- source: https://raw.githubusercontent.com/karpathy/llm-council/master/README.md, consulté 2026-06-02 -->

---

## 3. Modèles par défaut (verbatim `backend/config.py`)

Contenu vérifié verbatim (`backend/config.py`, branche `master`, consulté 2026-06-02) :

```python
COUNCIL_MODELS = [
    "openai/gpt-5.1",
    "google/gemini-3-pro-preview",
    "anthropic/claude-sonnet-4.5",
    "x-ai/grok-4",
]

CHAIRMAN_MODEL = "google/gemini-3-pro-preview"
```

| Fait | Valeur | Implication rédactionnelle |
|------|--------|----------------------------|
| Council par défaut | 4 modèles : GPT-5.1, Gemini 3 Pro (preview), Claude Sonnet 4.5, Grok 4 | Diversité de providers via OpenRouter |
| **Chairman par défaut** | **`google/gemini-3-pro-preview`** | **DOIT figurer : dans l'original, c'est Gemini qui préside, pas Claude.** C'est l'angle « comment faire un *Claude* Council ». |
| Identifiants | Format OpenRouter `provider/model` | Ce sont des identifiants OpenRouter, pas des noms d'API directs |

<!-- source: https://raw.githubusercontent.com/karpathy/llm-council/master/backend/config.py, consulté 2026-06-02 -->

> ANGLE CLÉ vérifié : dans la version Karpathy, **Claude n'est qu'un conseiller parmi 4, et c'est Gemini 3 Pro qui est Chairman**. Ce fait justifie tout l'angle éditorial « construire un Claude Council » (faire de Claude le président, ou l'unique modèle multi-personas).

---

## 4. Statut : non maintenu, sans licence (verbatim README)

Citation verbatim de la section "Vibe Code Alert" du README :

> "This project was 99% vibe coded as a fun Saturday hack [...] I'm not going to support it in any way, it's provided here as is for other people's inspiration and I don't intend to improve it. Code is ephemeral now and libraries are over, ask your LLM to change it in whatever way you like."

Faits à signaler explicitement (critère d'acceptation EPIC) :
- **99% « vibe coded »**, **« fun Saturday hack »** (verbatim).
- **« I'm not going to support it in any way »** → non maintenu volontairement.
- **« provided here as is »** → fourni tel quel.
- **Aucune licence** (cf. §1, `license: null`) → **pas un projet open source réutilisable au sens licence**. À cloner/forker avec prudence juridique.

> Garde-fou rédaction : NE PAS présenter le repo comme un « outil officiel maintenu ». Callout obligatoire « Saturday hack, non maintenu, sans licence ».

<!-- source: https://raw.githubusercontent.com/karpathy/llm-council/master/README.md, consulté 2026-06-02 -->

---

## 5. Stack technique (verbatim README "Tech Stack")

| Couche | Techno | Source |
|--------|--------|--------|
| Backend | FastAPI (Python 3.10+), async httpx, OpenRouter API | README "Tech Stack" |
| Frontend | React + Vite, react-markdown | README "Tech Stack" |
| Stockage | Fichiers JSON dans `data/conversations/` | README "Tech Stack" |
| Gestion paquets | uv (Python), npm (JavaScript) | README "Tech Stack" |
| Clé requise | `OPENROUTER_API_KEY` (compte OpenRouter + crédits) | README "Configure API Key" |
| Port frontend | http://localhost:5173 (Vite) | README "Running" |

> Implication : c'est une **web app locale** (FastAPI + React), pas un service hébergé. Le Codex étant 100% statique, on ne reproduit/héberge PAS cette app (out of scope EPIC). On explique le pattern + on génère prompt/skill.

<!-- source: https://raw.githubusercontent.com/karpathy/llm-council/master/README.md, consulté 2026-06-02 -->

---

## 6. Coût du pattern (déduction factuelle, pas une stat externe)

Le coût se déduit du workflow décrit dans le README (raisonnement arithmétique, pas une donnée à sourcer) :

- Stage 1 : 1 appel par modèle → **N appels** (N = nombre de conseillers).
- Stage 2 : chaque modèle review les autres → **N appels** supplémentaires.
- Stage 3 : 1 appel Chairman → **1 appel**.
- Total ≈ **2N + 1 appels LLM par question** (vs 1 appel pour une requête simple).

> Pour la page : présenter le coût comme « de l'ordre de 2N+1 appels par question » (la formule « N+1 » de l'EPIC sous-estime : elle ignore le Stage 2 de review croisée où chaque modèle rappelle). Énoncer comme un ordre de grandeur, pas un chiffre exact (dépend de l'implémentation et du fan-out de la review).
> Multi-personas mono-Claude : même ordre de grandeur en nombre d'appels, mais un seul provider/clé.

---

## 7. Multi-modèles vs multi-personas (cadrage conceptuel, vérifié sur la logique du repo)

| Approche | Principe | Forces | Limites |
|----------|----------|--------|---------|
| **Multi-modèles** (façon Karpathy / OpenRouter) | N modèles hétérogènes (GPT, Gemini, Claude, Grok) délibèrent | Vraie diversité d'angles, biais de modèle décorrélés | Coût + latence (N providers), clé OpenRouter, qualité inégale par modèle |
| **Multi-personas d'un seul Claude** | Un seul Claude joue plusieurs rôles/personas qui se challengent | Simple (un provider/clé), reproductible, empaquetable en skill | Biais corrélés (même modèle sous-jacent), risque d'écho plutôt que de vraie contradiction |

> Le repo Karpathy est l'archétype multi-modèles. Le multi-personas est l'adaptation naturelle « Claude only ». La page doit distinguer les deux dès le départ (critère d'acceptation EPIC).

---

## 8. Blog apsodia.com — NON CITABLE (inspiration uniquement)

- Source : article de blog tiers décrivant une adaptation du pattern en skill Claude.
- **Statut : INTERDIT comme source factuelle** (CLAUDE.md : blogs tiers non datés interdits).
- Éléments qui en proviendraient (personas type Contrarian / First Principles / Expansionist / Outsider / Executor + Chairman, ~5 étapes, ~11 appels, rapport HTML) : **à NE PAS citer comme faits**, à NE PAS attribuer de chiffres précis, à NE PAS présenter comme référence.
- Usage autorisé : illustrer « un exemple de personas possibles qu'on pourrait imaginer », formulé comme une proposition générique du Codex, sans source ni chiffre.

> Décision CC-1 : aucune affirmation factuelle de la page ne provient d'apsodia. Les exemples de personas seront présentés comme des suggestions éditoriales du Codex, génériques.

---

## 9. Versions de modèles Claude (pour les snippets, cf CLAUDE.md)

Modèles Claude actuels au 2026-05 (référence CLAUDE.md, à re-vérifier sur docs.anthropic.com avant chaque snippet) :
- `claude-opus-4-7`
- `claude-sonnet-4-6`
- `claude-haiku-4-5-20251001`

> Pour la page : si un snippet montre un Council mono-Claude, utiliser `claude-opus-4-7` (Chairman) et `claude-sonnet-4-6` (conseillers) à titre d'exemple, OU rester model-agnostic (« votre Claude »). Le repo Karpathy lui cite `anthropic/claude-sonnet-4.5` (identifiant OpenRouter) : le citer verbatim quand on reproduit sa config, ne pas le « moderniser ».

---

## 10. Récapitulatif des faits à respecter (checklist rédaction)

- [ ] Auteur : Andrej Karpathy, repo `karpathy/llm-council`, source primaire.
- [ ] Créé le 2025-11-22 (samedi), « 99% vibe coded as a fun Saturday hack » (verbatim).
- [ ] Stars/forks préfixés « au 2026-06-02 » (19 909 ★ / 3 764 forks) + invitation à re-vérifier.
- [ ] **Aucune licence** + **non maintenu** (« I'm not going to support it in any way ») → Callout.
- [ ] 3 stages aux noms exacts : First opinions / Review (anonymisée, accuracy+insight) / Final response (Chairman).
- [ ] `COUNCIL_MODELS` et `CHAIRMAN_MODEL` cités verbatim ; **Chairman par défaut = Gemini 3 Pro**.
- [ ] Stack : FastAPI + httpx + OpenRouter / React + Vite / JSON ; web app locale (non hébergée par le Codex).
- [ ] Distinction multi-modèles vs multi-personas dès le début.
- [ ] Coût ≈ 2N+1 appels par question ; section « Quand c'est du gâchis ».
- [ ] Zéro fait issu d'apsodia ; personas = suggestions génériques du Codex.
