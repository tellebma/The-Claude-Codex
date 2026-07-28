# Benchmarks LLM et articles IA — design

Date : 2026-07-28
Branche : `feat/benchmarks-llm-articles-ia`
Statut : validé par le PO

## Contexte

Trois modèles frontière sont sortis en quatre jours : Claude Opus 5 (24 juillet 2026),
Kimi K3 (27 juillet 2026), après la famille GPT-5.6 (9 juillet 2026). Le site couvre
déjà GPT-5.6 face à Sonnet 5 et la sortie de Sonnet 5 / Fable 5, mais rien sur Opus 5
ni sur l'écosystème des modèles ouverts.

Le PO veut en plus une page de benchmarks LLM tenue à jour régulièrement, pour montrer
le paysage des modèles disponibles.

## Objectifs

1. Une page benchmarks dont la mise à jour est un geste de quelques minutes, pas une
   réécriture de prose.
2. Six articles éditoriaux couvrant l'actualité et la méthodologie.
3. Publication sur les trois locales : `fr`, `en`, `es`.
4. Zéro fait non sourcé. Le projet applique une règle anti-hallucination en
   zéro-tolérance ; ces articles sont truffés de chiffres, c'est le risque principal.

## Dossiers factuels

La recherche a été faite en amont par trois agents, avec vérification web systématique.
Les dossiers sont la **source unique de vérité** des rédacteurs :

| Fichier (scratchpad de session) | Couvre |
|---|---|
| `facts-kimi-k3.md` | Kimi K3 : identité, licence, architecture, entraînement, benchmarks, usage |
| `facts-opus5-gpt.md` | Claude Opus 5, famille GPT-5.6, Artificial Analysis, Arena, SWE-bench |
| `facts-benchmarks.md` | Paysage des benchmarks, leaderboards officiels, pièges méthodologiques |

Chaque dossier se termine par une section « NON VÉRIFIÉ / À NE PAS ÉCRIRE ».
**Aucun rédacteur ne doit écrire un fait absent de ces dossiers.** Si un fait manque,
il demande une vérification plutôt que de puiser dans sa mémoire.

## Sous-projet 1 — Socle benchmarks (code)

### `src/data/llm-benchmarks.ts`

Trois entités, toutes `readonly`, sur le modèle de `src/data/article-stats.ts`.

```ts
export interface BenchmarkDefinition {
  readonly id: string;              // "swe-bench-verified"
  readonly label: string;           // "SWE-bench Verified" — nom propre, non traduit
  readonly category: BenchmarkCategory;
  readonly leaderboardUrl: string;  // URL officielle
  readonly maintainer: string;      // "SWE-bench team", "Artificial Analysis"…
}

export interface ModelEntry {
  readonly id: string;              // "claude-opus-5"
  readonly label: string;           // "Claude Opus 5"
  readonly vendor: string;          // "Anthropic"
  readonly license: "proprietary" | string;  // "Kimi K3 License", "Apache-2.0"…
  readonly releasedAt: string;      // ISO "2026-07-24"
}

export interface ScoreEntry {
  readonly modelId: string;
  readonly benchmarkId: string;
  readonly value: number;
  readonly unit: "percent" | "elo" | "index";
  readonly sourceUrl: string;       // https obligatoire
  readonly measuredAt: string;      // ISO
  readonly sourceType: "vendor-reported" | "independent";
  readonly note?: string;           // effort, harness, réserve statistique
}
```

**Décision structurante : le fichier de données ne contient aucune prose traduisible.**
Uniquement chiffres, URLs, dates et noms propres. Les descriptions de benchmarks et les
mises en garde vivent dans le MDX de chaque locale ; les en-têtes de colonnes passent par
`next-intl`. Sans cette règle, chaque rafraîchissement de scores deviendrait une tâche de
traduction sur trois langues.

### `src/components/ui/BenchmarkTable.tsx`

Props : `benchmarkId`, `caption?`. Rend un tableau trié par score décroissant.

Exigences :
- Un badge par ligne distinguant `vendor-reported` de `independent`. C'est la valeur
  ajoutée de la page : un score annoncé par le vendeur n'a pas le statut d'un score
  mesuré par un tiers.
- Lien vers la source et date de relevé sur chaque ligne.
- Licence affichée à côté du modèle (repérer les modèles ouverts d'un coup d'œil).
- `overflow-x: auto` sur le conteneur, jamais de scroll horizontal du body.
- Accessible : `<caption>`, en-têtes `scope`, contrastes WCAG 2.1 AA.

Exposé dans `src/components/mdx/MdxComponents.tsx`.

### Tests

`__tests__/data/llm-benchmarks.test.ts` — intégrité référentielle :
- tout `ScoreEntry.modelId` référence un `ModelEntry` existant ;
- tout `ScoreEntry.benchmarkId` référence un `BenchmarkDefinition` existant ;
- toute `sourceUrl` commence par `https://` ;
- toute date est au format ISO `YYYY-MM-DD` et n'est pas dans le futur ;
- pas de doublon `(modelId, benchmarkId, sourceType)`.

`__tests__/components/BenchmarkTable.test.tsx` — rendu, tri, badges, cas du benchmark
sans score.

### `docs/benchmarks-update.md`

Procédure de rafraîchissement : où sont les leaderboards, quoi vérifier, comment
distinguer un score vendeur d'un score indépendant, et le rappel que `measuredAt` doit
refléter la date de relevé réelle, pas la date d'édition du fichier.

## Sous-projet 2 — Page benchmarks (contenu × 3)

`content/{fr,en,es}/benchmarks-llm.mdx`

Structure : date du dernier relevé en tête, une section par catégorie (codage/agentique,
raisonnement, agents et outils, long contexte, préférence humaine, méta-indices), chacune
avec son `<BenchmarkTable>` et un paragraphe expliquant ce que le benchmark mesure
réellement. Section finale de méthodologie renvoyant vers l'article « lire un benchmark
sans se faire avoir ».

## Sous-projet 3 — Les six articles (× 3 locales)

| # | Slug | Angle |
|---|---|---|
| 1 | `opus-5-face-aux-nouveaux-gpt` | La semaine où trois modèles frontière sont sortis en quatre jours. Opus 5 vs GPT-5.6 Sol vs Kimi K3, et ce que leurs benchmarks contradictoires révèlent |
| 2 | `kimi-k3-ce-qui-change` | Présentation : poids ouverts, licence réelle, accès, positionnement |
| 3 | `kimi-k3-dans-le-tech-report` | Deep-dive : KDA, NoPE, MoE 896 experts, QAT MXFP4, MOPD |
| 4 | `lire-un-benchmark-llm` | Méthodologie : contamination, harness, auto-rapporté vs vérifié, significativité |
| 5 | `open-weights-vs-modeles-fermes` | Où en est l'écart réellement, licences, coût d'auto-hébergement |
| 6 | `cout-reel-par-tache` | Pourquoi le prix au million de tokens ment : thinking budget, retries, contexte |

Angles forts identifiés par la recherche, à exploiter :

- **Le trône WebDev Arena a changé de main en trois jours.** Moonshot revendique la
  première place dans son tech report (1678 Elo, relevé du 23 juillet, « premier modèle
  ouvert à dominer ce classement »). Le relevé du 27 juillet donne Opus 5 à 1725 devant
  Kimi K3 à 1682. Le tech report publié le 27 affiche un classement déjà périmé.
- **Anthropic ne publie aucun GPQA ni AIME pour Opus 5.** Les chiffres GPQA qui circulent
  pour les modèles Claude viennent des tableaux d'OpenAI. Ne jamais les attribuer à
  Anthropic.
- **`swebench.com` ne contient ni Opus 5 ni GPT-5.6** (dernières entrées : février 2026).
  Les 96 % SWE-bench Verified d'Opus 5 sont auto-rapportés.
- **Opus 5 n'a que 686 votes sur WebDev Arena** et ±12 d'intervalle sur l'arène texte,
  contre ±4 pour les modèles établis. Sa première place n'est pas statistiquement
  significative — à écrire même quand le classement flatte Claude.
- **La licence Kimi K3 n'est pas « MIT modifiée »** : accord commercial obligatoire
  au-delà de 20 M$ de CA en Model-as-a-Service, attribution obligatoire au-delà de
  100 M d'utilisateurs mensuels.

### Frontmatter et intégration

Chaque article : `title`, `description`, `datePublished` et `dateModified` au 2026-07-28,
`themes` valides (`src/lib/themes.ts`), `section: "content"`, `order`.

Intégration obligatoire par article, sinon la page est orpheline :
- entrée dans `src/data/search-index-{fr,en,es}.ts` ;
- entrée dans `src/data/site-pages.ts` (`SITE_PAGES`, priority et changeFrequency) ;
- entrée dans `src/lib/section-navigation.ts` si la page rejoint la navigation ;
- traductions `messages/{fr,en,es}.json` pour les libellés de navigation.

## Contraintes projet à respecter

- Écriture humaine : pas de tiret cadratin, pas de « il est important de noter »,
  phrases courtes. Le texte doit sonner comme écrit par un francophone.
- Sources en commentaire MDX masqué : `{/* source: URL, consulté 2026-07-28 */}`,
  sur le modèle de `content/fr/gpt-5-6-vs-claude-sonnet-5.mdx`.
- Pas d'import/export ESM dans les `.mdx` (casse le build SSG).
- TypeScript strict, aucun `any`, exports nommés, props `Readonly<>`.
- Couverture de tests ≥ 80 % lignes et branches.
- Zéro bug et zéro code smell BLOCKER/CRITICAL au sens SonarQube.

## Découpage en livraisons

| PR | Contenu |
|---|---|
| PR1 | Socle benchmarks (données, composant, tests, doc) + page benchmarks × 3 locales |
| PR2 | Articles 1, 2, 3 × 3 locales + intégration |
| PR3 | Articles 4, 5, 6 × 3 locales + intégration |

Chaque PR passe `npm run lint`, `npm run type-check`, `npm run test` et `npm run build`
avant d'être considérée comme terminée, puis un scan SonarQube avant merge vers `develop`.

## Risques

- **Péremption.** Les scores Elo dérivent et les leaderboards bougent vite — le cas
  WebDev Arena le prouve. Chaque chiffre porte donc sa date de relevé, et les articles
  emploient des formulations datées plutôt que des présents intemporels.
- **Volume.** 18 fichiers MDX d'articles, 3 fichiers de page benchmarks, plus le socle.
  Le découpage en trois PRs limite l'exposition.
- **Traductions.** Les dossiers factuels sont en français ; les rédacteurs EN et ES
  traduisent la prose mais reprennent les chiffres et URLs à l'identique.
