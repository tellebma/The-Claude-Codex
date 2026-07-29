# Mettre à jour la page Benchmarks LLM

Cette page est faite pour être rafraîchie souvent. Toute la donnée vit dans
`src/data/llm-benchmarks.ts` ; la prose vit dans `content/{fr,en,es}/benchmarks-llm.mdx`.
Une mise à jour de scores ne doit jamais toucher au MDX, et une mise à jour de prose ne
doit jamais toucher aux chiffres.

## Ce que contient le fichier de données

Trois tableaux exportés :

| Export | Rôle |
|---|---|
| `benchmarks` | définition d'un benchmark : `id`, `label`, `category`, `leaderboardUrl`, `maintainer` |
| `models` | un modèle : `id`, `label`, `vendor`, `license`, `releasedAt` (optionnel) |
| `scores` | un chiffre : `modelId`, `benchmarkId`, `value`, `unit`, `sourceUrl`, `measuredAt`, `sourceType`, `publisher`, `note` (optionnel) |

Plus `lastReviewedAt`, la date du dernier relevé global, affichée en tête de la page MDX.

Le fichier ne contient aucune phrase traduisible. Si vous vous surprenez à écrire une
explication dedans, elle va dans le MDX de chaque locale.

## Procédure de rafraîchissement

1. Ouvrez les leaderboards de la liste ci-dessous et relevez les valeurs, avec la date
   du jour.
2. Mettez à jour `scores`. Une valeur qui change garde sa ligne : on remplace `value` et
   `measuredAt`, on ne duplique pas.
3. Mettez à jour `lastReviewedAt`.
4. Si un modèle apparaît pour la première fois, ajoutez-le à `models`. Ne renseignez
   `releasedAt` que si une source primaire documente une date d'annonce ou de
   disponibilité générale ; sinon laissez le champ absent.
5. Lancez `npx vitest run __tests__/data/llm-benchmarks.test.ts`. Les tests bloquent les
   références orphelines, les URLs non-https, les dates futures et les doublons.
6. Mettez à jour `dateModified` dans le frontmatter des trois fichiers MDX et
   `lastModified` de l'entrée correspondante dans `src/data/site-pages.ts`.

## Où sont les leaderboards

### Mesures indépendantes

| Source | URL | Ce qu'on y prend |
|---|---|---|
| Artificial Analysis, classement général | https://artificialanalysis.ai/leaderboards/models | Intelligence Index v4.1, vitesse, coût par tâche |
| Artificial Analysis, Terminal-Bench v2.1 | https://artificialanalysis.ai/evaluations/terminalbench-v2-1 | scores rejoués avec l'agent Terminus 2 |
| Artificial Analysis, GPQA Diamond | https://artificialanalysis.ai/evaluations/gpqa-diamond | scores rejoués |
| Artificial Analysis, Humanity's Last Exam | https://artificialanalysis.ai/evaluations/humanitys-last-exam | scores rejoués sur le sous-ensemble text-only |
| Artificial Analysis, AA-LCR | https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning | long contexte |
| Artificial Analysis, méthodologie | https://artificialanalysis.ai/methodology/intelligence-benchmarking | composition et pondération de l'index |
| Arena, texte | https://arena.ai/leaderboard/text | Elo de préférence humaine |
| Arena, WebDev | https://arena.ai/leaderboard/code | Elo WebDev (la page s'intitule « WebDev AI Leaderboard ») |
| Terminal-Bench | https://www.tbench.ai/leaderboard/terminal-bench/2.1 | couples agent × modèle |
| SWE-bench | https://www.swebench.com/ | Verified, Full, Lite, Multimodal, Multilingual |
| SWE-bench Pro (Scale AI) | https://labs.scale.com/leaderboard/swe_bench_pro_public | split public |
| ARC Prize | https://arcprize.org/leaderboard | ARC-AGI-1 / 2 / 3, scores vérifiés |
| Epoch AI | https://epoch.ai/benchmarks | benchmarks rejoués et Epoch Capabilities Index |

`lmarena.ai` redirige en 301 permanent vers `arena.ai`. Le slug `/leaderboard/webdev`
renvoie une 404 : c'est `/leaderboard/code` qui sert le classement WebDev.

### Pages éditeurs

| Éditeur | URL |
|---|---|
| Anthropic, annonces | https://www.anthropic.com/news |
| Anthropic, tarifs et specs | https://platform.claude.com/docs/en/about-claude/pricing |
| OpenAI | https://openai.com/index/gpt-5-6/ |
| OpenAI, doc API | https://developers.openai.com/api/docs/pricing.md |
| Moonshot AI | https://huggingface.co/moonshotai/Kimi-K3 |
| Z.ai | https://huggingface.co/zai-org/GLM-5.2 |
| Google DeepMind | https://blog.google/innovation-and-ai/models-and-research/gemini-models/ |

Les chiffres d'Anthropic vivent dans la system card PDF, pas dans l'annonce : l'annonce
n'affiche que des graphiques en image. `openai.com` et `x.ai` répondent souvent en
HTTP 403 aux fetchers ; passer par Playwright MCP.

## Distinguer un score éditeur d'un score indépendant

C'est la seule chose que la page apporte vraiment. La règle :

- `sourceType: "vendor-reported"` dès que le chiffre a été publié par un éditeur de
  modèles, quel qu'il soit. `publisher` dit lequel. Un éditeur qui publie le score d'un
  concurrent reste un éditeur : le score de Gemini 3.1 Pro sur SWE-bench Pro dans le
  tableau d'OpenAI est `vendor-reported`, publisher `OpenAI`.
- `sourceType: "independent"` quand la mesure vient d'un tiers qui ne vend aucun des
  modèles comparés : Artificial Analysis, Arena, Scale AI, l'équipe du benchmark
  elle-même.

Cas limite fréquent : un éditeur reproduit dans sa carte modèle des chiffres mesurés par
Artificial Analysis. Ne les saisissez pas. Soit vous allez lire la valeur sur la page
d'Artificial Analysis et vous la saisissez en `independent` avec l'URL d'AA, soit vous
la laissez de côté. Une valeur `independent` doit toujours pointer vers la page du tiers
qui l'a mesurée.

Une seule entrée par `(modelId, benchmarkId, sourceType)`. Quand deux éditeurs publient
des valeurs différentes pour le même modèle, retenez celle de l'éditeur du modèle ; s'il
n'en publie aucune, prenez la source la plus complète et laissez `publisher` faire foi.
Quand les valeurs divergent trop pour être arbitrées, n'en saisissez aucune et
documentez la divergence dans le MDX.

## `measuredAt` : date de relevé, pas date d'édition

`measuredAt` est la date à laquelle la valeur existait sur la source :

- leaderboard : la date de consultation, ou la date de snapshot quand la page en affiche
  une (Arena affiche « snapshot du 27 juillet 2026 ») ;
- document éditeur : la date de publication du document (system card, article
  d'annonce, carte modèle).

Ce n'est jamais la date à laquelle vous avez édité le fichier. Un chiffre relevé le
28 juillet et recopié le 15 août garde `2026-07-28`.

## Pièges à ne pas oublier

**Le harness change tout.** Le leaderboard Terminal-Bench classe des couples agent ×
modèle : Claude Code + Fable 5 fait 83,8 % là où Terminus 2 + Fable 5 fait 80,4 %, soit
3,4 points d'écart pour le même modèle. Epoch AI mesure jusqu'à 11 points d'écart pour
GPT-5 et 15 points pour Kimi K2 Thinking sur SWE-bench Verified au seul changement de
scaffold. Notez toujours l'agent dans `note` (`agent=Claude Code`).

**L'effort de raisonnement change presque autant.** Claude Opus 5 apparaît cinq fois
dans le top 25 d'Artificial Analysis, de 61 à 51 d'index, pour un coût par tâche allant
de 2,03 $ à 0,36 $. DeepSeek-V4-Pro passe de 56,8 à 93,5 sur LiveCodeBench entre
non-think et think max. Un score sans son effort ne veut rien dire : notez-le
(`effort=max`).

**Les scores auto-rapportés ne sont validés par personne.** Au 28 juillet 2026, le
leaderboard officiel SWE-bench ne contient ni Claude Opus 5 ni GPT-5.6, ses entrées les
plus récentes datant de février 2026. Les 96 % SWE-bench Verified d'Opus 5 sont donc
auto-déclarés. C'est exactement ce que le badge doit montrer.

**Les fallbacks faussent la lecture.** Anthropic indique qu'Opus 4.8 a servi de fallback
lors des refus du classifieur de sécurité sur Frontier-Bench ; Artificial Analysis liste
« Claude Fable 5 (with fallback) ». Un score obtenu avec repli sur un autre modèle n'est
pas le score d'un modèle seul : notez-le (`fallback=Claude Opus 4.8`).

**La significativité statistique.** Sur Arena, les rangs 2 à 10 tiennent entre 1486 et
1505 avec des intervalles allant jusqu'à ±12 : ils ne sont pas séparés. Claude Opus 5
n'avait que 686 votes sur WebDev Arena contre plusieurs milliers pour les modèles
établis. Sur SWE-bench Pro, les écarts-types affichés dépassent l'écart entre les deux
premiers. Reportez l'intervalle et le nombre de votes dans `note` (`ci=±12`,
`votes=686`), et écrivez la réserve dans le MDX même quand le classement flatte Claude.

**Les versions ne sont pas interchangeables.** Terminal-Bench 1.0 / 2.0 / 2.1,
OSWorld / OSWorld-Verified / OSWorld 2.0, FrontierMath v1 / v2, ARC-AGI-1 / 2 / 3,
SWE-bench Verified / Pro / Lite / Multilingual / Multimodal. FrontierMath v2 a corrigé
des erreurs affectant 42 % des problèmes : aucun score antérieur au 12 juin 2026 n'est
comparable. Créez un `id` de benchmark distinct plutôt que de mélanger.

**Les périmètres non plus.** Humanity's Last Exam se score sur le dataset complet ou sur
les 2 158 questions text-only selon la source, et le modèle juge diffère. Notez le
périmètre (`subset=text-only`, `n=2158`).

**Un leaderboard officiel peut être périmé.** Au 28 juillet 2026 : Aider polyglot dernière
mise à jour le 20 novembre 2025, HLE sur un dataset d'avril 2025, SWE-bench sans entrée
postérieure à février 2026. Un leaderboard officiel périmé est plus trompeur qu'une mesure
indépendante datée. Vérifiez la date de dernière mise à jour avant de citer.

**La saturation.** GPQA Diamond tient en 0,4 point entre les rangs 1 et 3, très au-dessus
de la baseline experts de 65 %. τ²-Bench Telecom a ses trois premiers au-dessus de 98 %.
Ces benchmarks ne départagent plus rien : gardez-les pour le contexte, pas pour le
classement.

**Les conflits d'intérêt.** FrontierMath a été financé par OpenAI, qui a un accès exclusif
à un sous-ensemble. Scale AI co-maintient HLE et SWE-bench Pro tout en vendant des
services de données aux laboratoires évalués. Ça ne disqualifie pas les chiffres, ça se
mentionne.

## Sources interdites

Pas d'agrégateurs tiers (llm-stats.com, benchlm.ai, pricepertoken.com et consorts), pas
de Reddit, pas de posts X non officiels, pas de blogs non datés, pas de tutoriels vidéo.
Ces sources produisent des chiffres précis et séduisants, non reproductibles et souvent
contredits par les sources officielles. Si une valeur n'est pas lisible sur un
leaderboard officiel, chez un évaluateur indépendant reconnu ou dans un document
d'éditeur, elle ne rentre pas dans le fichier.
