# UX review — EPIC tuto pages article shell

> Date : 2026-05-09
> Source : avis ux-designer agent (Sonnet) sur `EPIC-tuto-pages-article-shell-2026-05.md`
> Statut : input PO, a integrer dans l'EPIC avant kickoff

---

## 1. Recommandation TUTO-1

**Option C** (ArticleShell + bloc "autres pages" dans le rail droit), avec cette nuance : le bloc va dans une zone **basse** du rail droit, sous le `TocProgress`, et bascule en accordeon sur tablette.

- Option A perd trop de discovery sur les sections denses (`prompting` 12, `mcp` 10, `agents` 9).
- Option B casse l'unite "meme experience editoriale que /content" et alourdit l'ecran < 1440px.
- Option C garde l'unite visuelle, conserve un signal de section, reste compatible avec le shell sans refacto profonde.

| Axe | A (full shell) | B (4 colonnes) | C (rail droit enrichi) |
|---|---|---|---|
| Discovery section | Faible (pager seul) | Forte | Moyenne-forte |
| Hierarchie info | Tres claire | Confuse (2 nav lat) | Claire si bloc en bas du TOC |
| Cognitive load | Faible | Elevee | Faible-moyenne |
| Mobile / tablet | Excellent | Mauvais | Excellent (rail cache < xl, accordeon en fin d'article) |

## 2. Reponses aux 3 questions ouvertes de l'EPIC

**Q1 — Bloc "autres pages" vital ou pager + breadcrumb suffisent ?** Vital sur les sections > 6 pages. Un pager prev/next force une lecture sequentielle, or la moitie des lecteurs `prompting/mcp/agents` arrivent par recherche Google sur une page precise et veulent piocher 1 ou 2 sujets adjacents. Solution : composant `SectionPeers` rendu dans le rail droit sous TocProgress, max 6 items visibles, lien "voir toute la section" vers l'overview.

**Q2 — `prompting` (12 pages denses), TOC locale suffit ?** Oui. Pas besoin de "vue d'ensemble cliquable" custom. La TOC doit rester scrollable sticky sans depasser le viewport, et tronquer les H3 si > 8 entrees. Verifier `TocProgress` sur la page la plus dense de `prompting` avant rollout.

**Q3 — `advanced` en hybride 4 colonnes ou uniformite ?** Uniformite. Garder le shell 3 colonnes avec `SectionPeers`. Les pages `worktrees`, `hooks`, `permissions-sandbox` sont denses mais autonomes : on les lit pour resoudre un probleme precis. Imposer 4 colonnes uniquement sur `advanced` creerait une exception couteuse. Si le besoin de discovery se confirme post-rollout via Matomo, ajouter un `SectionOverview` collapsible en debut d'article. Decision a reporter a un EPIC futur base sur des donnees.

## 3. Risques UX non couverts par l'EPIC

1. **`aria-current="page"` dans `SectionPeers`** : a specifier dans TUTO-3, sinon les lecteurs d'ecran ne signaleront pas la page courante.
2. **Focus management quand `TocProgress` met a jour la section active** : le scroll-spy ne doit jamais voler le focus clavier. Critere d'acceptation a ajouter a TUTO-2 : tester `Tab` depuis le hero jusqu'au pager sans saut de focus.
3. **`ReadingProgressBar` sur tuto courts** (faq-beginner, certaines pages skills < 800 mots) : la barre saute de 0 a 80% en un scroll. Effet visuel parasite. Proposer un seuil minimum (masquer la barre si `scrollHeight < 1.5 * viewport`).
4. **Touch target mobile sur la TOC** : `TableOfContents` est cachee < xl, donc OK pour le moment. Si un drawer mobile est ajoute (US implicite ?), prevoir 44x44 minimum sur les liens TOC.
5. **Difference comportementale lecture lineaire vs navigation parallele** : sur `/content/[slug]` l'utilisateur lit 1 article et part. Sur `getting-started` il lit dans l'ordre. Le pager prev/next doit donc rester tres visible. Ajouter un mini-pager dans le rail droit ou en sticky bottom mobile pour les sections `getting-started` uniquement (variante).

## 4. Stories manquantes ou a ajouter

- **TUTO-1bis** : produire 2 maquettes Figma haute-fidelite de l'option C sur `getting-started/installation` (page courte) et la page la plus dense de `prompting`, light + dark, 1440 et 768. L'EPIC mentionne "maquette ou capture", pas suffisant.
- **TUTO-3bis** : creer un composant dedie `SectionPeers` (props : `section`, `currentSlug`, `locale`, `maxItems`) avec sa story de tests visuels et a11y. Sortir cette responsabilite de `TutoArticleContent` pour la rendre testable isolement.
- **TUTO-4bis** : story dediee "redesign aside droit pour pages tuto" si `SectionPeers` introduit une variante du `art-toc-rail` (espacement, separateur visuel entre TOC et pairs). Sinon ce travail risque de fuir dans TUTO-3.
- **TUTO-8** (manquante) : passe Matomo post-rollout (J+30) pour mesurer taux de clic prev/next, profondeur scroll, clic sur `SectionPeers`. Permet de valider l'option C avec donnees reelles avant fermeture EPIC.

## 5. Pilote recommande

Pour TUTO-2, plutot que `installation`, `first-project`, `faq-beginner` (3 pages dans la meme section) :

1. **`getting-started/installation`** : page longue, etapes nombreuses, valide la TOC dense + le shell sur un onboarding critique.
2. **`prompting/basics`** (ou la plus courte de `prompting`) : page moyenne d'une section dense (12 pages), valide le `SectionPeers` a fort volume.
3. **`skills/<une-page>`** : section a 4 pages, valide que `SectionPeers` ne semble pas redondant quand le pager voisin couvre deja 50% de la section. Si la story C tient sur 4 pages, elle tient partout.

Variete couverte : 1 section onboarding lineaire, 1 section thematique dense, 1 section courte.
