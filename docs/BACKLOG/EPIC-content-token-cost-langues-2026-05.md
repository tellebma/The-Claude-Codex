# EPIC : Article « Coût des tokens selon la langue » (2026-05)

> Source : demande PO 2026-05-28
> Date d'ouverture : 2026-05-28
> Effort estimé : **3 SP** (1 article éditorial bilingue + câblage)
> Cible : `content/{fr,en}/*.mdx` → route `/content/[slug]`
> Statut : ✅ livré (TKL-1)

---

## Contexte

Fait peu connu mais documenté scientifiquement : à contenu équivalent, le **nombre de tokens** (donc le coût facturé, la latence et la part de fenêtre de contexte consommée) varie fortement selon la langue. Les langues à écriture non latine ou sous-représentées dans les corpus d'entraînement sont fragmentées en bien plus de tokens que l'anglais. Comme les API LLM facturent au token, leurs locuteurs paient davantage pour un résultat souvent moins bon.

L'article explique ce fait, le rattache aux sources scientifiques, et en tire les implications pratiques pour les utilisateurs de Claude Code.

## Sources scientifiques (vérifiées le 2026-05-28)

| Source | Référence | Fait clé retenu |
|--------|-----------|-----------------|
| Petrov, La Malfa, Torr, Bibi — « Language Model Tokenizers Introduce Unfairness Between Languages » | NeurIPS 2023, [arXiv 2305.15425](https://arxiv.org/abs/2305.15425) | Différence de longueur de tokenisation **jusqu'à 15×** entre langues pour un même texte. Impacts explicites : coût d'accès aux services commerciaux, latence, quantité de contexte. |
| Ahia, Kumar, Gonen, Kasai, Mortensen, Smith, Tsvetkov — « Do All Languages Cost the Same? Tokenization in the Era of Commercial Language Models » | [arXiv 2305.13707](https://arxiv.org/abs/2305.13707), 2023 | Étude de l'API OpenAI sur **22 langues** typologiquement diverses : les locuteurs de nombreuses langues sont « surfacturés tout en obtenant de moins bons résultats », souvent dans des régions moins favorisées. |

**Limite assumée** : les chiffres précis (15×, 22 langues) proviennent d'études menées sur les tokenizers OpenAI / multilingues. Le mécanisme (tokenisation sous-mot type BPE entraînée majoritairement sur de l'anglais) est général à tous les LLM commerciaux facturés au token, **dont Claude**. L'article ne doit pas inventer de multiplicateur spécifique à Claude.

## Stories

### TKL-1 : Article bilingue + câblage (3 SP) ✅

**Critères d'acceptation :**
- [x] `content/fr/cout-tokens-par-langue.mdx` + `content/en/token-cost-by-language.mdx`
- [x] Faits vérifiés via arXiv, sources citées en clair + commentaire HTML masqué `<!-- source -->`
- [x] Structure : intro, le fait + sources, le mécanisme, les 3 impacts (coût/latence/contexte), implications pour Claude Code, ce qu'on peut faire, « Prochaines étapes »
- [x] Entrées `searchIndexFr` / `searchIndexEn`
- [x] Entrée `SITE_PAGES` avec `pathsByLocale`
- [x] Build SSG OK, lint + type-check verts, parité FR/EN vérifiée

**Fichiers :** voir PR.

## Idées de suite (hors scope)

- Mini-outil interactif « comparez le coût de votre prompt dans N langues » (appel `count_tokens` Anthropic).
- Tableau de multiplicateurs par langue mesurés sur le tokenizer Claude (nécessite une vérification empirique dédiée avant publication).
