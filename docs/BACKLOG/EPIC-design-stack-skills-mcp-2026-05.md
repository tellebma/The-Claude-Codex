# EPIC : Stack design Claude Code — skills + MCP externes + Playwright pour valider

> Source : retour d'expérience utilisateur après 1 mois d'utilisation intensive de Claude Code en mode design (mai 2026)
> Date : 2026-05-11
> Effort estimé : 28 story points (10 stories sur 3 sprints)
> Pré-requis : aucun (orthogonal aux EPICs SEO-GEO, Ecosystem, Polish landing en cours)
> Owner : Maxime BELLET
> Statut : validé par agents SEO + Rédacteur (2026-05-11), prêt pour Sprint 1 sur ouverture PO

---

## Contexte

### Le constat après 1 mois (terrain mai 2026)

Après un mois d'utilisation de Claude Code pour produire des interfaces (refonte graphique 2026-04, refonte premium 2026-05, polish des pages section), le verdict utilisateur est net : **les capacités natives de Claude Code en design front-end sont limitées si on ne les outille pas**. Les sorties brutes sont fonctionnelles mais souvent génériques (le fameux "AI slop" : palettes plates, typographie sans hiérarchie, animations absentes, gradients ternes). On retombe vite sur les mêmes patterns visuels.

La bonne nouvelle : plusieurs skills dédiés au design front-end sont apparus sur Q1-Q2 2026 et sont utilisables aujourd'hui. Ils sont gratuits ou abordables, et se branchent directement dans Claude Code via le standard `npx skills add`. Combinés à Playwright MCP pour valider visuellement le rendu et capturer les régressions, ils élèvent le niveau visuel des sorties.

### Pourquoi un EPIC dédié ?

The Claude Codex couvre déjà :

- la section `/skills/` (overview, comparison, best skills) — **généraliste**
- la section `/mcp/` (overview, sécurité, what-are-mcps) — **généraliste**
- les pages article éditoriales sur le prompting, l'agentic workflow, les use-cases

Mais **aucune page ne consolide la stack design recommandée** : quels skills installer en premier, dans quel ordre, comment les combiner avec Playwright MCP, quel workflow type pour passer d'un brief Figma à un composant React poli en moins d'une heure.

L'EPIC **Ecosystem & Top Repos** (parallèle, en attente d'exécution) listera les skills design parmi 30+ repos. **Cet EPIC-ci va plus loin** : il transforme une expérience vécue en méthode reproductible, avec un workflow validé par Playwright, des fiches outils détaillées et un comparatif décisionnel.

### Lien avec les autres EPICs

| EPIC | Relation |
|------|----------|
| EPIC Ecosystem trending repos | Listera les mêmes skills mais sans le retour d'expérience ni le workflow Playwright. Cet EPIC fournit les fiches détaillées que `/ecosystem/awesome-skills` pourra référencer en lien interne. |
| EPIC SEO-GEO mai 2026 | Bénéficie directement : nouvelles pages cornerstone "skill design Claude Code" + intent transactionnel "comment designer avec Claude Code". |
| EPIC Polish section heroes | Aucun conflit : cet EPIC produit du contenu éditorial, pas de composants visuels. Réutilise `<SectionHero>` et `<ArticleHero>` livrés par RG/RG2. |
| EPIC Best Practices Integration | Complémentaire : cet EPIC est l'application "design" du pattern orchestration (S3) déjà documenté. |

---

## Vision

Faire de The Claude Codex la **référence francophone "comment designer avec Claude Code en 2026"**. Un dev FR qui cherche à élever la qualité visuelle de ce que Claude Code produit doit trouver sur le site :

1. **Quels outils externes installer** (4 fiches détaillées, pas un name-drop)
2. **Comment les combiner** (workflow type, ordre d'invocation, complémentarités)
3. **Comment valider le résultat** (Playwright MCP : screenshots, comparaisons visuelles, captures multi-viewport)
4. **Quel comparatif rationnel** pour choisir entre Impeccable, UI UX Pro Max, Taste Skill, Huashu Design selon son cas

**Triple objectif** :

1. **SEO direct** : ranker FR sur "skill design Claude Code", "MCP design", "Claude Code Playwright", "comment designer avec IA".
2. **GEO** : être cité par les LLM quand on leur demande "quels skills installer pour designer avec Claude Code ?".
3. **Crédibilité éditoriale** : un retour d'expérience daté, sourcé, reproductible — pas un énième listicle.

---

## Outils ciblés (vérifiés mai 2026)

Tous les faits ci-dessous ont été vérifiés via WebFetch sur les sites officiels et repos GitHub le 2026-05-11. Ils sont conservés ici pour servir de matériau brut aux articles (sources de vérité). Les rédacteurs doivent re-vérifier avant publication (règle anti-hallucination CLAUDE.md).

### 1. Impeccable — `pbakaus/impeccable`

| Champ | Valeur |
|-------|--------|
| Nature | Agent skill (Claude Code, Cursor, Gemini CLI, etc.) |
| Promesse | "Design fluency for AI harnesses. Great design prompts require design vocabulary. Most people don't have it. Impeccable teaches your AI deep design knowledge and gives you 23 commands to steer the result." |
| Auteur | Paul Bakaus (Renaissance Geek) |
| Installation | `npx skills add pbakaus/impeccable` |
| Fonctionnalités clés | 23 commandes design (`/audit`, `/polish`, `/critique`, `/typeset`, `/colorize`, `/animate`...), 27 règles anti-patterns déterministes, Live Mode (alpha) avec HMR, fichiers `PRODUCT.md` + `DESIGN.md` persistants, CLI + Chrome Extension pour audit CI |
| Workflows | Visualiser→Construire (`/impeccable shape` puis `/impeccable craft`), audit PR (`npx impeccable detect src/`), itération live |
| Licence | Apache 2.0 |
| Site | https://impeccable.style/ |

### 2. UI UX Pro Max Skill — `nextlevelbuilder/ui-ux-pro-max-skill`

| Champ | Valeur |
|-------|--------|
| Nature | Skill Claude Code multi-stack (15+ frameworks supportés : React, Next.js, Vue, Flutter, SwiftUI...) |
| Promesse | "Design intelligence for building professional UI/UX across multiple platforms and frameworks" |
| Auteur | nextlevelbuilder (organisation) |
| Installation | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` (Claude Code) ou `npm install -g uipro-cli` puis `uipro init --ai claude` |
| Fonctionnalités clés | 67 UI styles (Glassmorphism, Claymorphism, Minimalism...), 161 palettes alignées par catégorie produit, 57 font pairings (avec import Google Fonts), 161 reasoning rules, Design System Generator, 99 UX guidelines |
| Étoiles GitHub | 76.4k★ (mai 2026) |
| Licence | MIT |
| Site | https://ui-ux-pro-max-skill.nextlevelbuilder.io/ |

### 3. Taste Skill — `Leonxlnx/taste-skill`

| Champ | Valeur |
|-------|--------|
| Nature | Framework frontend open-source basé sur le standard SKILL.md (compatible Cursor, Claude Code, v0, Gemini CLI, Codex...) |
| Promesse | "The Anti-Slop Frontend Framework for AI Agents — Less slop, designs pop" |
| Auteurs | Leon Lin (@lexnlin) + blueemi (@blueemi99) |
| Installation | `npx skills add Leonxlnx/taste-skill` ou ciblage `--skill "design-taste-frontend"` |
| Fonctionnalités clés | 10+ skills spécialisées (`design-taste-frontend`, `gpt-taste`, `image-to-code`, `minimalist-skill`, `soft-skill`, `brutalist-skill` beta, `output-skill`...), variantes ciblées (GPT/Codex, image-to-code, audit redesign), skills de génération d'images (`imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`) |
| Étoiles GitHub | 16.6k★ (mai 2026) |
| Licence | MIT |
| Sites | https://www.tasteskill.dev/ + https://github.com/Leonxlnx/taste-skill |

### 4. Huashu Design — `alchaincyf/huashu-design`

| Champ | Valeur |
|-------|--------|
| Nature | Skill Claude Code pour design HTML-natif (compatible Cursor, Codex, OpenClaw, Hermes) |
| Promesse | "Say one sentence to your agent — Claude Code, Cursor, Codex, OpenClaw, Hermes all work" — livre prototype animé / app cliquable / deck PPT éditable en 3 à 30 minutes |
| Auteur | alchaincyf (basé en Chine, contact `alchaincyf@gmail.com`) |
| Installation | `npx skills add alchaincyf/huashu-design` |
| Fonctionnalités clés | Prototypes interactifs avec frames iPhone, motion design avec export MP4/GIF, decks HTML convertibles en PPTX éditable, conseiller direction artistique (5 écoles × 20 philosophies), critique 5 dimensions avec radar, infographies print-quality |
| Étoiles GitHub | 13k★ (mai 2026) |
| Documentation | Bilingue (cœur SKILL.md en chinois, README en EN + ZH) |
| Licence | **Restrictive** : usage personnel gratuit, commercial/entreprise 1 800 à 3 500 USD selon contact direct |
| Site | https://github.com/alchaincyf/huashu-design |

### 5. Playwright MCP — outil de validation transverse

| Champ | Valeur |
|-------|--------|
| Nature | MCP (Model Context Protocol) officiel `@playwright/mcp` |
| Rôle dans cet EPIC | **Le pivot du workflow.** Aucun skill design ne livre du contenu valide à 100 %. Playwright sert à : capturer screenshots multi-viewport, vérifier les assertions visuelles, valider l'a11y au runtime, comparer avant/après, détecter les régressions visuelles (cf. RG-25 du projet) |
| Configuration | Profil "dev" déjà chargé dans `~/.claude.json` (cf. CLAUDE.md global). Aucun setup additionnel requis. |
| Workflow type | (1) skill design produit le composant → (2) `mcp__playwright__browser_navigate` sur preview local → (3) `mcp__playwright__browser_take_screenshot` viewport mobile/tablet/desktop → (4) lecture critique du screenshot par Claude → (5) itération via `/impeccable polish` ou `/taste critique` |

---

## Priorisation MoSCoW

### MUST HAVE (17 SP, Sprint 1) — Cornerstone + 3 fiches outils + maillage early

> **Décision de revue (cf. Annexe C)** : DSK-9 et DSK-10 remontent en Sprint 1 (le maillage interne ne dépend pas de la rédaction des nouvelles fiches et son effet SEO commence dès l'indexation des pages existantes éditées).

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| DSK-1 | Article racine cornerstone : retour d'expérience 1 mois + recommandations stack | 5 | `/content/stack-design-claude-code-1-mois` (FR) + `/content/design-stack-claude-code-1-month-review` (EN) |
| DSK-2 | Fiche outil : Impeccable (`pbakaus/impeccable`) | 3 | `/skills/impeccable` (FR + EN) |
| DSK-3 | Fiche outil : UI UX Pro Max Skill | 3 | `/skills/ui-ux-pro-max` (FR + EN) |
| DSK-4 | Fiche outil : Taste Skill | 2 | `/skills/taste-skill` (FR + EN) |
| DSK-5 | Tableau comparatif décisionnel des 4 skills design | 2 | Section dédiée dans DSK-1 + composant `<ComparisonTable>` réutilisable |
| DSK-9 | Maillage interne complet (5 pages MDX existantes éditées) | 1 | `/skills/`, `/mcp/`, `/skills/best-skills`, `/skills/comparison`, `/content/` |
| DSK-10 | Mise à jour `/skills/best-skills` avec section "Skills design" | 1 | `content/{fr,en}/skills/best-skills.mdx` |

### SHOULD HAVE (8 SP, Sprint 2) — Workflow Playwright + 4ème fiche outil

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| DSK-6 | Page workflow : "Designer avec Claude Code + Playwright MCP" (avec onglet "rapide" et onglet "complet") | 5 | `/mcp/workflow-design-playwright` (FR + EN) |
| DSK-7 | Fiche outil : Huashu Design (avec encart `<Callout type="warning">` licence commerciale) | 3 | `/skills/huashu-design` (FR + EN) |

### COULD HAVE (3 SP, Sprint 3) — Article démo

| ID | Story | SP | Page / Section cible |
|----|-------|----|----------------------|
| DSK-8 | Article démo : refaire un composant existant du Codex avec la stack complète, captures Playwright avant/après | 3 | `/content/refaire-une-card-avec-impeccable-et-playwright` (FR + EN) |

### WON'T HAVE (hors scope EPIC)

| ID | Story | Raison |
|----|-------|--------|
| W1 | Tutoriel vidéo / screencast | Hors stack du site (statique, pas d'hébergement vidéo) |
| W2 | Skill maison "claude-codex-design" qui combine les 4 | Trop ambitieux pour un EPIC contenu, ouvrira un EPIC "produit" séparé si demande confirmée |
| W3 | Comparatif élargi (Magic UI, shadcn MCP, ReactBits, Aceternity...) | Couverts dans le profil dev MCP global et dans `/skills/comparison`. Inclure dans `/ecosystem/` à la place. |
| W4 | Benchmark mesurable (temps avant/après, taux de bugs visuels...) | Méthodologie trop fragile pour un échantillon de 1 mois sur 1 projet. Mention qualitative uniquement. |
| W5 | Test Playwright automatisé qui exerce les skills | Skills s'exécutent dans Claude Code, pas testables headless de manière fiable. |

---

## Architecture de l'information

### Pages créées

```
content/fr/
├── stack-design-claude-code-1-mois.mdx          ← DSK-1 (article racine)
└── refaire-une-card-avec-impeccable-et-playwright.mdx ← DSK-8

content/en/
├── design-stack-claude-code-1-month-review.mdx  ← DSK-1
└── refactoring-a-card-with-impeccable-and-playwright.mdx ← DSK-8

content/fr/skills/
├── impeccable.mdx                                ← DSK-2
├── ui-ux-pro-max.mdx                             ← DSK-3
├── taste-skill.mdx                               ← DSK-4
└── huashu-design.mdx                             ← DSK-7

content/en/skills/
├── impeccable.mdx
├── ui-ux-pro-max.mdx
├── taste-skill.mdx
└── huashu-design.mdx

content/fr/mcp/
└── workflow-design-playwright.mdx                ← DSK-6

content/en/mcp/
└── workflow-design-playwright.mdx
```

### Pages éditées (maillage)

- `content/{fr,en}/skills/best-skills.mdx` : ajout section "Skills design" (DSK-10)
- `content/{fr,en}/skills/comparison.mdx` : ajout colonne "design" dans la matrice
- `content/{fr,en}/skills/page d'index` (via `app/[locale]/skills/page.tsx`) : card "Skills design" en avant
- `content/{fr,en}/mcp/page d'index` : card "Workflow design Playwright"
- `app/[locale]/content/page.tsx` : ajout DSK-1 et DSK-8 dans la grille articles

### Mise à jour de la navigation

1. `lib/section-navigation.ts` : ajouter `impeccable`, `ui-ux-pro-max`, `taste-skill`, `huashu-design`, `workflow-design-playwright` aux sous-items des sections concernées
2. `messages/{fr,en}.json` : ajouter clés `sectionNav.skills.*` et `sectionNav.mcp.*` correspondantes
3. `lib/metadata.ts` : ajouter les 7 nouvelles pages dans `SITE_PAGES` (`priority: 0.8`, `changeFrequency: 'monthly'`)
4. `lib/search-index.ts` : ajouter 7 entrées FR + 7 entrées EN
5. `scripts/generate-llms-txt.ts` : ajouter `stack-design-claude-code-1-mois` et `workflow-design-playwright` dans `POPULAR_SLUGS_FR/EN`

---

## Composants UI à créer

### `<ToolCard />` (`components/ui/ToolCard.tsx`)

Card unifiée pour les fiches outil (DSK-2/3/4/7). Différente de `<RepoCard />` (livré par EPIC Ecosystem) car orientée détail outil et non listing :

- Header : nom + logo/avatar + badge "Skill" / "MCP" / "Plugin"
- Sous-titre : promesse littérale entre guillemets
- Méta-bloc : auteur, étoiles GitHub (refresh manuel mensuel), licence, dernière vérification
- Bloc CTA : commande d'installation copyable (`<CodeBlock>`)
- Liens : site officiel, repo GitHub, doc

Props `Readonly<>`, accessible (aria-label, alt). Réutilisable dans n'importe quelle page MDX.

### `<DesignWorkflowDiagram />` (`components/ui/DesignWorkflowDiagram.tsx`) — DSK-6

Diagramme SVG (ou HTML/CSS pur, pas d'image binaire) qui illustre le pipeline :

```
brief utilisateur
   ↓
[skill design] ← /impeccable shape, /taste critique...
   ↓
composant React généré
   ↓
[Playwright MCP] ← navigate, screenshot multi-viewport
   ↓
critique visuelle par Claude
   ↓
itération via skill (/impeccable polish)
   ↓
composant final
```

Mobile-friendly (vertical), dark + light mode, animation framer-motion subtile (fade-in séquentiel).

### Réutilisation

- `<ComparisonTable />` (livré par EPIC Best Practices Integration) : DSK-5
- `<Callout />`, `<Steps />`, `<Tabs />`, `<CodeBlock />` (déjà disponibles dans MDX) : usage standard

---

## Workflow type documenté dans DSK-6 (référence)

L'article DSK-6 documente le workflow A à Z. Voici la trame que les rédacteurs doivent suivre, étape par étape :

1. **Setup** : vérifier que Playwright MCP est actif (`/mcp` dans Claude Code), installer le skill design choisi (`npx skills add ...`).
2. **Brief** : écrire le brief design dans la conversation (composant souhaité, contraintes, références visuelles éventuelles via `mcp__filesystem__read_media_file` pour une image locale).
3. **Génération** : invoquer le skill design (`/impeccable craft "carte produit minimaliste avec hover"` ou équivalent Taste / UI UX Pro Max).
4. **Validation visuelle** : démarrer le serveur (`npm run dev`), `mcp__playwright__browser_navigate` sur la route, `mcp__playwright__browser_take_screenshot` en `viewport: 375x800` puis `1440x900`.
5. **Critique** : Claude lit le screenshot, identifie les défauts (contraste, alignement, hiérarchie typo, espacement).
6. **Itération** : `/impeccable polish` ou `/taste critique` avec le diff identifié, regénération du composant.
7. **Boucle 4-6** jusqu'à validation : 2-4 itérations typiques.
8. **A11y** : `mcp__playwright__browser_evaluate` pour exécuter axe-core et vérifier 0 violation WCAG 2.1 AA.
9. **Commit** : composant prêt pour PR, avec screenshot avant/après en commentaire.

Chaque étape illustrée d'un screenshot réel pris sur le projet The Claude Codex pendant la rédaction.

---

## SEO & GEO — Patterns à appliquer systématiquement

Toutes les pages de cet EPIC doivent inclure :

1. **TL;DR actionnable** (3-5 puces) : pas une promesse, des réponses directes citables par un LLM. Format : `- {Outil} : {fait clé}, {licence}, {commande install}`. Voir Annexe C pour exemple.
2. **JSON-LD `Article`** (via `createArticleSchema()` existant) pour les articles éditoriaux
3. **JSON-LD `HowTo`** pour DSK-6 et DSK-8 (workflow étape par étape)
4. **JSON-LD `FAQPage`** sur les 4 fiches outils ("Comment installer X ?", "Quelle différence entre X et Y ?", "X est-il gratuit ?", "X fonctionne-t-il avec Cursor ?")
5. **JSON-LD `SoftwareApplication`** pour les 4 fiches outils. Champs : `name`, `applicationCategory: "DeveloperApplication"`, `operatingSystem: "macOS, Linux, Windows"`, `softwareVersion`, `license`, `offers` (gratuit pour 3 sur 4, `Offer` + `priceSpecification` pour Huashu Design). **Nouvelle fonction `createSoftwareApplicationSchema()` à ajouter dans `lib/structured-data.ts`.**
6. **JSON-LD `ItemList`** sur DSK-5 (tableau comparatif) avec 4 `ListItem` pointant vers les fiches `/skills/{slug}`. Favorise les featured snippets.
7. **JSON-LD `BreadcrumbList`** (standard via `createBreadcrumbSchema`)
8. **Liens sortants vers GitHub des skills tiers** : `rel="noopener"` (dofollow). **Pas de `nofollow`** : signal négatif pour des repos open-source documentés. Réserver `nofollow` aux liens d'affiliation ou UGC.
9. **Cluster de liens internes** : chaque fiche outil linke vers les 3 autres + DSK-1 (cornerstone) + DSK-6 (workflow) + `/skills/best-skills`. **Réciproquement, EPIC Ecosystem** : `/ecosystem/awesome-skills` doit linker chaque entrée vers la fiche détaillée `/skills/{slug}`, pas directement vers GitHub. Établit la hiérarchie d'autorité.
10. **Image OG dédiée** par page (générée via `app/[locale]/.../opengraph-image.tsx`)
11. **Date visible (pas masquée)** : `<time datetime="2026-05-XX">Vérifié le 11 mai 2026</time>` en haut de chaque fiche outil. Visible dans le DOM, indexée. Le commentaire HTML masqué (`<!-- vérifié... -->`) reste en plus pour traçabilité interne.
12. **Ancres normalisées** : chaque H2 a une ancre conversationnelle (`#quel-skill-choisir`, `#comment-installer-impeccable`, `#impeccable-fonctionne-avec-cursor`). Les LLM les indexent comme signaux topiques.

### Mots-clés cibles (FR)

| Page | Intent | Mot-clé principal | Volume estimé |
|------|--------|-------------------|---------------|
| DSK-1 | Informationnel haut de tunnel | "stack design Claude Code" | Faible mais ciblé |
| DSK-1 | Informationnel | "comment designer avec Claude Code" | Moyen |
| DSK-1 | **Comparatif alternatif** | "Claude Code vs Cursor design", "alternatives à Cursor pour le design" | Moyen |
| DSK-1 | **Problème** (conversationnel, AI Overviews) | "Claude Code produit du UI générique", "comment améliorer rendu visuel Claude Code" | Croissant |
| DSK-2 | Navigationnel | "impeccable skill claude" | Faible (longue traîne) |
| DSK-3 | Navigationnel | "ui ux pro max skill" | Faible (longue traîne) |
| DSK-4 | Navigationnel | "taste skill claude code" | Faible |
| DSK-5 | Comparatif | "meilleur skill design Claude Code" | Moyen |
| DSK-6 | Tutoriel | "Claude Code Playwright design", "MCP design Claude" | Moyen |
| DSK-7 | Navigationnel | "huashu design skill", **"Huashu Design gratuit"** (intent prix) | Faible (chinois surtout) |
| DSK-8 | Démo / use-case | "exemple Claude Code design" | Faible |

### Mots-clés cibles (EN) — obligatoires

> **Décision de revue** : l'agent SEO a flagué l'absence totale de stratégie EN comme le point le plus faible du draft. Le site génère du trafic EN significatif (cf. EPIC SEO-GEO mai 2026) ; les pages EN doivent cibler des intents distincts du FR.

| Page EN | Mot-clé principal EN | Intent |
|---------|---------------------|--------|
| DSK-1 EN | "best design skills Claude Code 2026" | Informationnel |
| DSK-1 EN | "Claude Code UI design tips" | Informationnel |
| DSK-2 EN | "Impeccable AI design skill review" | Navigationnel/Comparatif |
| DSK-3 EN | "UI UX Pro Max Claude Code review" | Navigationnel |
| DSK-4 EN | "Taste Skill anti AI slop frontend" | Navigationnel |
| DSK-5 EN | "best Claude Code design skill comparison" | Comparatif |
| DSK-6 EN | "Claude Code Playwright visual testing workflow" | Tutoriel |
| DSK-6 EN | "how to validate UI design with Playwright MCP" | Tutoriel |
| DSK-8 EN | "Claude Code design refactor example" | Démo |

---

## Cross-cutting : i18n, qualité, accessibilité

- **Traductions** : chaque fiche FR a sa version EN miroir (slugs EN différents pour DSK-1 et DSK-8)
- **Vérification post-merge** : naviguer sur `/fr/...` ET `/en/...`, vérifier le bon contenu, le LanguageSwitcher, les liens internes préfixés
- **Accessibilité** : tous les screenshots ont un `alt` descriptif (pas "screenshot" seul), tous les liens externes ont `aria-label` explicite, contraste WCAG AA vérifié
- **Tests Vitest** : couverture ≥ 80 % sur `<ToolCard>` et `<DesignWorkflowDiagram>` (rendu, props, a11y)
- **Test E2E Playwright** : journey "visiter `/fr/content/stack-design-claude-code-1-mois` → cliquer sur card Impeccable → arriver sur `/fr/skills/impeccable` → cliquer sur lien install → texte copyable"
- **Lighthouse** : ≥ 90 sur les 4 métriques pour les 7 nouvelles pages
- **Visual regression RG-25** : ajouter `/skills/impeccable` et `/mcp/workflow-design-playwright` à la liste des routes captures (seuil 2 %)
- **SonarQube** : Quality Gate OK, 0 BLOCKER/CRITICAL, complexité S3776 OK
- **Coverage** : ≥ 80 % maintenue

---

## Critères d'acceptation par story

### DSK-1 — Article cornerstone (5 SP)

- [ ] MDX FR + EN rédigés, frontmatter valide (`themes: ["use-case", "tooling"]`, `datePublished` et `dateModified` à jour)
- [ ] **Chapeau honnêteté** : ouverture qui gradue le niveau de test réel par outil (cf. Annexe C, formulation recommandée)
- [ ] Structure révisée (cf. Annexe C) :
  - TL;DR actionnable (5 puces format `- {Outil} : {fait}, {licence}, {install}`)
  - Contexte
  - **"Ce que Claude Code fait sans aide"** (3 sorties typiques, bonnes ou mauvaises, pour planter le décor)
  - 4 sections outils (1 paragraphe + lien vers fiche)
  - Workflow Playwright (résumé + lien vers DSK-6)
  - Tableau comparatif (DSK-5)
  - **"Ce que cette stack ne fait pas"** (5 lignes minimum, crédibilité éditoriale)
  - Verdict prescriptif ("si X, commence par Y") — pas une reformulation du tableau
  - Prochaines étapes
- [ ] Au moins une des 3 analogies de l'Annexe C utilisée pour expliquer "skill" et "MCP de validation"
- [ ] Tableau comparatif (DSK-5) intégré
- [ ] JSON-LD `Article` injecté
- [ ] Image OG dédiée
- [ ] Au moins 1 200 mots utiles
- [ ] Liens internes vers les 4 fiches outils + DSK-6
- [ ] **Anti-hallucination** : chaque chiffre, étoile GitHub, version, prix vérifié via Playwright/WebFetch < 7 jours avant publication, source en commentaire HTML masqué + date visible dans le DOM (`<time datetime="...">`)

### DSK-2 / DSK-3 / DSK-4 / DSK-7 — Fiches outil (3, 3, 2, 3 SP)

Pour chacune :

- [ ] MDX FR + EN, frontmatter valide (`themes: ["reference", "tooling"]`)
- [ ] Structure révisée (cf. Annexe C, retour rédacteur) :
  - TL;DR actionnable
  - Promesse (citation littérale entre guillemets, source datée)
  - **"Ce que ça change en pratique"** (1 exemple concret avant/après, ancré dans le réel avant la liste de fonctionnalités)
  - Installation (`<CodeBlock language="bash">` copyable)
  - Fonctionnalités (5-10 puces)
  - Workflow type (1 exemple)
  - Limitations honnêtes
  - **"Cas d'échec"** (1-2 scénarios concrets où l'outil donne des résultats dégradés)
  - Pour qui ? (recommandation directe sans titre "Mon avis")
  - Alternatives (liens vers les 3 autres fiches)
  - Vérifié le YYYY-MM-DD
- [ ] `<ToolCard>` utilisé en haut de page
- [ ] Date visible : `<time datetime="2026-05-XX">Vérifié le ...</time>`
- [ ] JSON-LD `FAQPage` (4-5 Q/R, dont au moins une question prix/licence)
- [ ] JSON-LD `SoftwareApplication` (via `createSoftwareApplicationSchema()` à créer)
- [ ] Image OG dédiée
- [ ] **Spécifique DSK-3 (UI UX Pro Max)** : encart honnêteté sur le compteur étoiles GitHub (76.4k★ progression rapide). Wording : "Compteur vérifié au 2026-05-11 ; sa progression rapide en peu de mois peut refléter des campagnes promotionnelles. Le critère décisionnel principal reste les fonctionnalités testées."
- [ ] **Spécifique DSK-7 (Huashu Design)** : encart `<Callout type="warning">` licence commerciale (wording exact en Annexe C)
- [ ] Liens vers GitHub et site officiel en `rel="noopener"` dofollow (pas de `nofollow`)
- [ ] **Anti-hallucination** : promesse citée mot pour mot depuis le site officiel, source datée en commentaire HTML

### DSK-5 — Tableau comparatif (2 SP)

- [ ] Tableau intégré dans DSK-1, exportable en composant si besoin
- [ ] Colonnes : Skill | Promesse | Auteur | Étoiles GitHub | Licence | Installation | Forces | Limites | Recommandé pour |
- [ ] 4 lignes (Impeccable, UI UX Pro Max, Taste, Huashu)
- [ ] Composant `<ComparisonTable>` (livré par EPIC Best Practices) utilisé
- [ ] Verdict éditorial sous le tableau (3-5 puces)

### DSK-6 — Workflow Playwright (5 SP)

- [ ] MDX FR + EN, frontmatter `themes: ["tutorial", "tooling"]`
- [ ] Structure : TL;DR → Pourquoi Playwright dans la boucle design (1 phrase analogie miroir, cf. Annexe C) → Setup → **`<Tabs>` à deux onglets** :
  - Onglet "Workflow rapide" : étapes 1, 3, 4 (setup, génération, screenshot) — pour valider visuellement en 10 min
  - Onglet "Workflow complet" : les 9 étapes intégrales avec a11y et commit
- [ ] Cas d'usage avancés (multi-viewport, axe-core a11y) → Limitations → Aller plus loin
- [ ] `<DesignWorkflowDiagram>` intégré en haut
- [ ] `<Steps>` MDX pour les étapes (dans chaque onglet)
- [ ] JSON-LD `HowTo` injecté
- [ ] Au moins 6 captures Playwright réelles (non générées) prises sur le projet The Claude Codex
- [ ] Mention explicite des outils MCP utilisés (`mcp__playwright__browser_navigate`, etc.) avec lien vers `/mcp/`
- [ ] Lien vers `/mcp/securite-mcp` dans les limitations
- [ ] Numéro de version Playwright MCP en pied de page (test E2E qui exerce les commandes citées)

### DSK-8 — Article démo (3 SP)

- [ ] MDX FR + EN, frontmatter `themes: ["use-case", "tooling"]`
- [ ] Choix d'un composant existant : une `<RecentArticleCard>` ou `<ToolCard>` (à arbitrer en kick-off)
- [ ] Section "Avant" : screenshot Playwright initial + critique
- [ ] Section "Pendant" : prompts envoyés, skills invoqués, itérations Playwright
- [ ] Section "Après" : screenshot final + diff visuel
- [ ] Section "Code diff" : extrait du PR avec lignes changées
- [ ] Section "Verdict" : temps total, nombre d'itérations, qualité finale
- [ ] Liens vers DSK-1 (cornerstone) et DSK-6 (workflow)

### DSK-9 — Maillage interne (1 SP)

- [ ] Édition de `/skills/best-skills` : section "Design" en haut, lien vers les 4 fiches
- [ ] Édition de `/skills/comparison` : ajout d'une dimension "Design front-end" si la matrice s'y prête
- [ ] Édition de `app/[locale]/skills/page.tsx` : card mise en avant "Skills design : la stack recommandée" → DSK-1
- [ ] Édition de `app/[locale]/mcp/page.tsx` : card "Workflow design avec Playwright" → DSK-6
- [ ] Édition de `app/[locale]/content/page.tsx` : DSK-1 et DSK-8 ajoutés à la grille

### DSK-10 — Mise à jour `best-skills` (1 SP)

- [ ] Section "Skills design" ajoutée dans `content/{fr,en}/skills/best-skills.mdx`
- [ ] 4 cards (1 par skill) avec lien vers la fiche détaillée
- [ ] `dateModified` à jour dans frontmatter ET `SITE_PAGES`

---

## Métriques de succès (J+90 après merge complet)

| Métrique | Valeur cible | Source |
|----------|--------------|--------|
| Pages indexées par Google | 7 nouvelles + 5 éditées | Google Search Console |
| Impressions sur "skill design Claude Code" (FR) | ≥ 500 / semaine | GSC |
| Impressions sur "Claude Code Playwright" (FR) | ≥ 300 / semaine | GSC |
| Position moyenne DSK-1 sur "stack design Claude Code" | Top 5 (vide concurrentiel FR) | GSC |
| Scroll-depth 75 % sur DSK-1 et DSK-6 | ≥ 25 % | Matomo |
| Citations dans AI Overviews (Claude, ChatGPT, Perplexity, Gemini) | ≥ 2 occurrences trackées | Tests manuels mensuels |
| Backlinks acquis | ≥ 3 (Reddit, X, Dev.to FR) | Suivi manuel |

---

## Risques & mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Skills cités obsolètes en 3-6 mois (rythme de release rapide) | Crédibilité éditoriale | Process refresh trimestriel : re-vérifier installation, étoiles, fonctionnalités. Mention "Vérifié le YYYY-MM-DD" en haut de chaque fiche. |
| Compteurs étoiles GitHub gonflés (76k★ pour UI UX Pro Max en peu de temps) | Mauvaise hiérarchisation pour le lecteur | Mention "compteur indicatif", critère qualitatif (utilité réelle vécue) prime dans le verdict |
| Licence Huashu Design change (passe full-paid ou full-free) | Page DSK-7 devient erronée | Fiche `<Callout type="info">` avec date de vérification, contact direct mentionné. Vérification trimestrielle. |
| Promesse "1 mois d'utilisation" non vérifiable | Lecteur sceptique | Citer concrètement les EPICs du projet où ces outils ont été utilisés (ou pas), ne pas faussement gonfler. Si l'auteur ne les a pas tous testés, le dire. |
| Workflow DSK-6 ne fonctionne plus si Playwright MCP évolue | Tutoriel cassé | Numéro de version Playwright MCP en pied de page, test E2E qui exerce les commandes citées |
| Concurrence : un site EN couvre déjà ces outils | Faible trafic FR malgré tout | Vide concurrentiel FR confirmé (cf. EPIC Ecosystem). Différenciation = retour d'expérience FR + workflow Playwright concret. |
| Conflit avec EPIC Ecosystem (mêmes outils cités) | Cannibalisation SEO | EPIC Ecosystem = inventaire (listing court). EPIC Stack design = détail outil + workflow (intent transactionnel). Maillage explicite : `/ecosystem/awesome-skills` → DSK-2/3/4/7 et inverse. |
| Article DSK-1 trop long → bounce rate élevé | Mauvais signal SEO | TL;DR strict en haut, structure ancrée TOC, sections ≤ 300 mots, CTAs clairs vers fiches détaillées |

---

## Definition of Done globale

L'EPIC est considéré comme livré quand :

- [ ] Toutes les stories MUST + au moins 1 SHOULD mergées sur `develop` puis `main`
- [ ] `npm run lint && npm run type-check && npm run test` passe sur main
- [ ] `npm run build` génère bien les 14 routes attendues (7 nouvelles × FR + EN)
- [ ] Sitemap XML contient les nouvelles pages
- [ ] `llms.txt` et `llms-full.txt` régénérés et contiennent les nouvelles entrées
- [ ] Lighthouse ≥ 90 sur 4 métriques pour DSK-1, DSK-6 et les 4 fiches outil
- [ ] SonarQube Quality Gate OK, 0 bug, 0 BLOCKER/CRITICAL
- [ ] Couverture tests ≥ 80 % maintenue
- [ ] Tests E2E Playwright passent (RG-25 visual regression incluse)
- [ ] Validation manuelle FR + EN sur les 7 nouvelles pages
- [ ] `dateModified` à jour dans frontmatter ET `lib/metadata.ts`
- [ ] PR description liste les pages créées/éditées avec leurs URLs canoniques
- [ ] **Validation anti-hallucination** : checklist passée, chaque fiche outil a son commentaire HTML `<!-- vérifié YYYY-MM-DD via WebFetch -->`

---

## Planning indicatif

> **Décision de revue (Annexe C, retour SEO)** : DSK-9 et DSK-10 remontés en Sprint 1. Effet SEO du maillage commence dès l'indexation des pages existantes éditées, sans attendre les nouvelles fiches.

| Sprint | Durée | Stories | SP |
|--------|-------|---------|----|
| Sprint 1 | 2 semaines | DSK-1 → DSK-5, DSK-9, DSK-10 | 17 |
| Sprint 2 | 1 semaine | DSK-6, DSK-7 | 8 |
| Sprint 3 | 1 semaine | DSK-8 | 3 |
| **Total** | **4 semaines** | **10 stories** | **28 SP** |

---

## Annexe A — Sources vérifiées (mai 2026)

Toutes les informations factuelles utilisées pour bâtir cet EPIC ont été vérifiées le 2026-05-11 via WebFetch sur les sites officiels :

| Outil | Source primaire | Source secondaire | Date vérif |
|-------|-----------------|-------------------|------------|
| Impeccable | https://impeccable.style/ | (à compléter au sprint 1 : repo GitHub `pbakaus/impeccable`) | 2026-05-11 |
| UI UX Pro Max | https://ui-ux-pro-max-skill.nextlevelbuilder.io/ | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | 2026-05-11 |
| Taste Skill | https://www.tasteskill.dev/ | https://github.com/Leonxlnx/taste-skill | 2026-05-11 |
| Huashu Design | https://github.com/alchaincyf/huashu-design | (README EN + ZH) | 2026-05-11 |
| Playwright MCP | `~/.claude.json` profil "dev" + CLAUDE.md global | https://github.com/microsoft/playwright | 2026-05-11 |

**Avant publication de chaque page**, le rédacteur doit re-vérifier ces sources et noter la nouvelle date de vérification dans le commentaire HTML masqué de la page (`<!-- vérifié YYYY-MM-DD via [URL] -->`).

---

## Annexe B — Validation par agents (conduite le 2026-05-11)

Cet EPIC a été revu par deux agents avant ouverture officielle :

1. **Agent SEO** (`code-reviewer` orienté SEO) : a vérifié la stratégie mots-clés, la cohérence avec EPIC SEO-GEO mai 2026, l'absence de cannibalisation avec EPIC Ecosystem, la pertinence des structured data choisis.
2. **Agent Rédacteur** (`content-writer`) : a vérifié le ton, la rigueur journalistique, la cohérence éditoriale avec les guidelines CLAUDE.md (anti-hallucination, écriture humaine), la pertinence du plan de chaque article.

Les retours sont consolidés en **Annexe C** ci-dessous. Les corrections structurelles ont été directement intégrées dans le corps de l'EPIC (priorisation, structured data, mots-clés EN, critères d'acceptation des stories DSK-1 / DSK-2-3-4-7 / DSK-6).

---

## Annexe C — Décisions de revue (intégrées au corps de l'EPIC)

### C.1 — Retours SEO appliqués

| Décision | Origine | Section impactée |
|----------|---------|------------------|
| **Schéma `SoftwareApplication` ajouté** pour les 4 fiches outils. Nouvelle fonction `createSoftwareApplicationSchema()` à créer dans `lib/structured-data.ts`. | Agent SEO | Section "SEO & GEO" point 5 |
| **Schéma `ItemList` ajouté** sur DSK-5 (tableau comparatif) avec 4 `ListItem`. | Agent SEO | Section "SEO & GEO" point 6 |
| **Liens GitHub des skills tiers passent en `dofollow`** (`rel="noopener"` seul, plus de `nofollow`). Le `nofollow` excessif est un signal négatif. | Agent SEO | Section "SEO & GEO" point 8 |
| **Maillage explicite EPIC Ecosystem ↔ EPIC Stack design** : `/ecosystem/awesome-skills` linke chaque entrée vers `/skills/{slug}`, pas vers GitHub. Établit `/skills/{slug}` comme l'autorité de référence. | Agent SEO | Section "SEO & GEO" point 9 |
| **Date de vérification visible dans le DOM** (`<time datetime="...">`), pas seulement en commentaire HTML masqué. | Agent SEO | Section "SEO & GEO" point 11 |
| **Ancres normalisées conversationnelles** sur les H2 (`#comment-installer-impeccable`, `#impeccable-fonctionne-avec-cursor`). | Agent SEO | Section "SEO & GEO" point 12 |
| **Stratégie mots-clés EN ajoutée** (table dédiée). L'absence EN était le point le plus faible du draft. | Agent SEO | Section "Mots-clés cibles (EN)" |
| **Intents ajoutés en FR** : comparatif alternatif (`Claude Code vs Cursor design`), problème conversationnel (`Claude Code produit du UI générique`), prix (`Huashu Design gratuit`). | Agent SEO | Section "Mots-clés cibles (FR)" |
| **DSK-9 et DSK-10 remontés en Sprint 1** (effet SEO immédiat sur pages existantes éditées). | Agent SEO | Priorisation MoSCoW + Planning |
| **Encart honnêteté compteur étoiles UI UX Pro Max** ajouté en critère DSK-3 (76.4k★ progression rapide → mention transparente). | Agent SEO | Critère DSK-3 |

**Cannibalisation EPIC Ecosystem** : pas de cannibalisation au sens strict (intents distincts : Ecosystem = inventaire haut de tunnel, Stack design = transactionnel/tutoriel), mais maillage explicite obligatoire. Règle inscrite : `/ecosystem/awesome-skills` ne répète pas les fonctionnalités détaillées (1 ligne de promesse + lien vers fiche). Si duplication > 30 %, Google confond les signaux.

**Structure URL validée** : `/skills/{slug}` reste la bonne option (autorité directe depuis `/skills/` linkée dans Header). `/skills/design/{slug}` ajouterait un niveau de profondeur sans bénéfice. `/content/skills-design/{slug}` aurait été une erreur grave (rupture de cohérence de section).

**Vigilance signalée** : la sidebar `/mcp/` (déjà 11 items) recevra `workflow-design-playwright` ; vérifier qu'aucune réorganisation n'est nécessaire avant de coder DSK-6.

### C.2 — Retours Rédacteur appliqués

| Décision | Origine | Section impactée |
|----------|---------|------------------|
| **Section "Ce que Claude Code fait sans aide" ajoutée** dans DSK-1, en intro du constat — plante le décor avant d'introduire les skills. | Agent Rédacteur | Critère DSK-1 |
| **Section "Ce que cette stack ne fait pas" ajoutée** en fin de DSK-1 (5 lignes min) — crédibilité éditoriale. | Agent Rédacteur | Critère DSK-1 |
| **Trame fiches outils réordonnée** : "Ce que ça change en pratique" (1 exemple avant/après) intercalé entre "Promesse" et "Installation". Évite la liste de fonctionnalités hors sol. | Agent Rédacteur | Critère DSK-2/3/4/7 |
| **Section "Cas d'échec" ajoutée** dans chaque fiche outil (1-2 scénarios concrets). | Agent Rédacteur | Critère DSK-2/3/4/7 |
| **Pas de section "Mon avis" titrée** (sonne blog). Recommandation directe intégrée dans "Pour qui ?". | Agent Rédacteur | Critère DSK-2/3/4/7 |
| **DSK-6 passe en `<Tabs>` 2 onglets** : "Workflow rapide" (3 étapes, 10 min) + "Workflow complet" (9 étapes a11y + commit). Pas de duplication de contenu. | Agent Rédacteur | Critère DSK-6 |
| **3 formules promotionnelles corrigées dans le corps de l'EPIC** : "maturé" → "sont apparus et sont utilisables", "transforment Claude Code en assistant design crédible" → "élèvent le niveau visuel des sorties", "stack maturée" à éviter. | Agent Rédacteur | Section "Contexte" |

### C.3 — Formulation honnêteté "1 mois d'utilisation" (chapeau DSK-1)

Wording recommandé pour le chapeau de l'article cornerstone (cite littéralement, ne reformule pas) :

> "Cet article est basé sur un mois d'utilisation de Claude Code sur un projet réel (refonte graphique du site The Claude Codex, avril-mai 2026). Les quatre skills présentés n'ont pas tous été testés avec la même intensité : Impeccable et Playwright MCP ont été utilisés quotidiennement, Taste Skill sur deux sprints, UI UX Pro Max et Huashu Design sur des sessions ponctuelles de validation."

Cette gradation explicite renforce la crédibilité plutôt que de la diminuer.

### C.4 — Wording exact du Callout Huashu Design (DSK-7)

À utiliser tel quel dans la fiche `/skills/huashu-design.mdx` :

```mdx
<Callout type="warning" title="Licence commerciale">
  Huashu Design est gratuit pour un usage personnel. Si tu l'utilises dans un
  projet client ou sur un produit commercialisé, une licence est requise.
  Les tarifs indiqués par l'auteur au 2026-05-11 vont de 1 800 à 3 500 USD
  selon le volume d'utilisation (contact direct : alchaincyf@gmail.com).
  Ces tarifs ne sont pas publiés sur une page de pricing publique : vérifie
  avant tout engagement.
  {/* source: github.com/alchaincyf/huashu-design README, vérifié 2026-05-11 */}
</Callout>
```

Points clés : condition déclenchante claire, chiffre daté, absence de page pricing publique signalée (fait qui protège le lecteur), contact direct.

### C.5 — Analogies pour DSK-1 (3 disponibles, en choisir au moins une)

**Analogie 1 — Skill design (notion de SKILL.md injecté dans le contexte) :**

> "Un skill, c'est comme donner à Claude un manuel de style avant qu'il commence à dessiner. Sans manuel, il improvise selon ses habitudes. Avec le manuel, il a des règles précises : telle hiérarchie typographique, telle palette, tel espacement. Le résultat est systématiquement plus cohérent."

**Analogie 2 — MCP de validation (Playwright qui prend des screenshots) :**

> "Playwright MCP, c'est le miroir que tu tends à Claude après qu'il a habillé un composant. Sans miroir, Claude travaille à l'aveugle. Avec, il voit exactement ce que le navigateur rend sur mobile et sur desktop, et peut corriger ce qui cloche avant que tu ouvres toi-même le navigateur."

**Analogie 3 — La boucle skill + Playwright ensemble :**

> "La boucle skill design + Playwright, c'est le même processus qu'un designer qui dessine une maquette, l'imprime, la colle au mur, recule de deux mètres, voit le problème, et corrige. Sauf que la boucle prend 30 secondes au lieu de 30 minutes."

Les trois s'enchaînent naturellement : la première introduit les skills, la deuxième Playwright, la troisième justifie leur combinaison. À utiliser dans l'intro et la transition vers DSK-6.

### C.6 — Format TL;DR actionnable (toutes pages)

Format obligatoire pour les TL;DR (recommandation SEO/GEO directe) :

```
- Impeccable : 23 commandes design, Apache 2.0, install `npx skills add pbakaus/impeccable`
- Taste Skill : anti "AI slop", 16.6k★ GitHub, MIT, install `npx skills add Leonxlnx/taste-skill`
- UI UX Pro Max : 67 styles UI + 161 palettes, 76.4k★ (à vérifier en 2026), MIT, install `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`
- Huashu Design : design HTML-natif, gratuit perso / payant pro (1 800–3 500 USD), `npx skills add alchaincyf/huashu-design`
- Workflow recommandé si tu pars de zéro : Impeccable + Playwright MCP
```

Ce format est directement citable par un LLM sans reformulation.

### C.7 — Statut post-revue

L'EPIC est désormais **prêt pour Sprint 1** sous réserve d'ouverture par le PO. Les 7 décisions structurelles (C.1) et 7 décisions éditoriales (C.2) sont intégrées au corps de l'EPIC. Les wordings prêts à l'emploi (C.3, C.4, C.5, C.6) sont à utiliser tels quels par les rédacteurs au moment de la rédaction des MDX.
