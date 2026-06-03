# PRODUCT.md — The Claude Codex

> Fichier de contexte produit consommé par Impeccable, UI UX Pro Max, Taste Skill et tout autre skill design qui supporte le format Stitch/PRODUCT.md.
> Vérifié et maintenu manuellement. Dernière mise à jour : 2026-05-11.
> Source de vérité primaire : `CLAUDE.md` (instructions projet), wiki Obsidian `[[The Claude Codex]]` et `[[Cartographie des articles Claude Codex]]`.

---

## 1. Identité

**Nom du produit** : The Claude Codex
**URL publique** : https://claude-codex.fr
**Repo** : https://github.com/tellebma/The-Claude-Codex (privé)
**Type** : site éditorial statique (Next.js 14 SSG, déployé sur Vercel)
**Locales** : FR (par défaut) + EN (parité 100%, slugs parfois différents)
**Statut** : projet personnel actif depuis Q1 2026, version 1.7.0+ au 2026-05.

## 2. Mission en une phrase

Démocratiser Claude Code en français en publiant la documentation de référence la plus rigoureuse, accessible et à jour de l'écosystème Claude (CLI, MCP, Skills, Plugins, Agents).

## 3. Audience

Quatre profils distincts mais tous traités de la même manière (pas de paywall, pas de tier "premium") :

| Profil | Attentes | Format préféré |
|--------|----------|----------------|
| **Développeur intermédiaire/expert** (cœur de cible) | Patterns avancés, comparatifs sourcés, retours d'expérience datés | Articles éditoriaux longs, fiches outil, code copyable |
| **Développeur débutant** | Onboarding pas à pas, vocabulaire expliqué, analogies concrètes | Guides linéaires, callouts, glossaire |
| **Non-développeur curieux** (PM, designer, étudiant) | Comprendre ce que fait l'outil sans plonger dans le shell | Articles d'introduction, vidéos d'illustration, page Use Cases |
| **Équipe / décideur** | Sécurité, coûts, gouvernance, adoption | Pages Enterprise, ROI, sécurité, FAQ |

**Ce qu'aucun de ces profils ne doit avoir à subir** : pop-ups, newsletters intrusives, cookies tiers, paywall, contenu marketing déguisé en doc.

## 4. Voix et ton

| Trait | Description |
|-------|-------------|
| **Accessible mais jamais condescendant** | Un débutant et un expert lisent le même article et y trouvent leur compte. Pas de "C'est facile, il suffit de...". |
| **Enthousiaste sobre** | Pas de "Plongez dans !" ni "Découvrez la puissance de !". L'enthousiasme se montre par la précision, pas par les superlatifs. |
| **Honnête sur les limites** | Chaque outil/pattern/promesse mentionné a sa section "limitations" ou "cas d'échec". Mieux vaut nuancer que sur-vendre. |
| **Direct, pas alambiqué** | Phrases courtes, verbes actifs, peu de subordonnées. Si une phrase fait 4 lignes, la couper. |
| **Datée et sourcée** | Tout fait précis (chiffre, version, prix, URL) est daté et sourcé en commentaire HTML masqué. |

### Tics de langage à proscrire (zéro-tolérance)

- Le tiret cadratin "—" (utiliser `,` ou `:` selon le contexte)
- "Il est important de noter que", "Il convient de souligner", "Force est de constater"
- Abus de "permet de", "en effet", "ainsi", "notamment" en début de phrase
- "Plongez dans", "Découvrez la puissance de", "Embarquez pour"
- "Stack maturée", "techniquement crédible", "écosystème mature" (verbiage promotionnel)
- Listes à rallonge quand une phrase suffit
- Emojis dans le contenu rédigé (sauf si l'utilisateur les demande explicitement)

## 5. Anti-références (ce qu'on ne veut PAS ressembler à)

| Anti-référence | Pourquoi on l'évite |
|----------------|---------------------|
| **Le violet/lavande d'Anthropic** | On veut une identité visuelle propre, pas un fork visuel. Notre palette est cyan/ambre. |
| **Les blogs IA "10 prompts magiques"** | Contenu creux, non sourcé, optimisé pour le scroll et pas pour la compréhension. |
| **Les listicles awesome non éditorialisés** | Du `awesome-claude-code` qui empile 200 liens sans hiérarchie. On curate avec verdict. |
| **Les sites de doc fantômes** | Doc obsolète, dates manquantes, exemples de code qui ne tournent plus. |
| **Les pop-ups newsletter / cookie banners agressifs** | UX hostile. Pas de pop-up, cookieless via Matomo self-hosted. |
| **Les comparatifs sponsorisés** | Aucun outil cité ne paie pour apparaître. Le ranking est éditorial. |
| **Le franglais corporate** | "On a leveraged notre stack pour deliver de la value" → non. Français propre, anglais quand il n'y a pas d'équivalent (ex: "skill", "MCP"). |

## 6. Principes éditoriaux non-négociables

### 6.1 Rigueur anti-hallucination (zéro-tolérance)

Toute statistique, date, nom propre, version, prix ou URL **doit être vérifié via Playwright MCP ou WebFetch avant rédaction**. Jamais depuis la mémoire. Source notée en commentaire HTML masqué : `<!-- source: URL, consulté YYYY-MM-DD -->`.

Sources prioritaires : doc officielle fournisseur > GitHub releases > annonces officielles.
Sources interdites comme source factuelle : Reddit, X/Twitter, blogs tiers non datés, tutoriels YouTube.

### 6.2 Bilinguisme strict FR/EN

Chaque article FR a sa contrepartie EN. Pas de page mono-langue. Le LanguageSwitcher fonctionne sur toutes les routes. Vérifier sur `/fr/` ET `/en/` après chaque modification.

### 6.3 Accessibilité WCAG 2.1 AA

Tous les éléments interactifs répondent au clavier (Tab/Enter/Espace). Pas de `role="img"` sur des `<div>`. Contrastes vérifiés. Aria-labels explicites sur les liens externes.

### 6.4 Mise à jour des dates

Toute modification de texte visible déclenche une mise à jour de `dateModified` dans le frontmatter MDX **et** dans `SITE_PAGES` de `lib/metadata.ts`. Le sitemap XML doit être à jour.

### 6.5 Honnêteté sur l'auteur

Quand un article repose sur un retour d'expérience, l'intensité du test réel est explicitée (cf. EPIC Stack design : "X a été testé quotidiennement, Y sur deux sprints, Z en sessions ponctuelles").

## 7. Sections du site (cartographie au 2026-05)

93 fichiers MDX FR (parité 100% EN), 13 sections :

| Section | Articles | Fonction |
|---------|----------|----------|
| `/content/` (articles éditoriaux) | 13 | Long-form, SEO-driven, actualités |
| `/getting-started/` | 6 | Onboarding débutant |
| `/mcp/` | 10 | Protocole d'extension Claude |
| `/skills/` | 4 | Compétences réutilisables |
| `/agents/` | 8 | Orchestration multi-agents |
| `/prompting/` | 11 | Art du prompt |
| `/plugins/` | 5 | Extensions communautaires |
| `/advanced/` | 9 | Patterns experts |
| `/future/` | 3 | Vision prospective |
| `/personas/` | 6 | Parcours par profil |
| `/enterprise/` | 6 | Adoption équipe/entreprise |
| `/limits/` | 4 | Ce que Claude Code ne fait pas |
| `/reference/` | 5 | Cheatsheet, CLI, env, settings |
| `/use-cases/` | 3 | Cas d'usage non-tech |

Plus : un **configurateur interactif** (page différenciante : 4 actions/visite, 0% rebond), un **glossaire** (40+ termes), une **page about**, une **404 custom** avec robot 3D.

## 8. Stratégie SEO / GEO

- **SEO direct** : positions FR sur "claude code", "MCP", "skills claude", "plugins claude". Cible : top 3 sur les requêtes longue traîne FR liées à Claude Code.
- **GEO (Generative Engine Optimization)** : être cité par ChatGPT, Claude, Perplexity, Gemini quand on leur pose des questions sur Claude Code. Stratégie : `llms.txt` + `llms-full.txt` à jour, structured data exhaustifs (Article, HowTo, FAQPage, BreadcrumbList, SoftwareApplication, ItemList), TL;DR actionnables en haut de page.
- **Backlinks** : pages "awesome" et hubs cornerstone qui génèrent des liens entrants Reddit/HN/Dev.to/X organiques.

## 9. Standards qualité (zéro-tolérance, alignés SonarQube)

- 0 bug ouvert (Reliability)
- 0 code smell BLOCKER ou CRITICAL (incluant complexité S3776)
- Couverture lignes ≥ 80%, branches ≥ 80%
- Aucun `any` TypeScript (strict mode obligatoire)
- 0 hotspot de sécurité ouvert
- WCAG 2.1 AA respecté
- Lighthouse ≥ 90 sur les 4 métriques (perf, a11y, best practices, SEO)

## 10. Workflow de contribution

1. Branche par feature : `feat/`, `fix/`, `chore/`, `docs/` selon la nature
2. PR vers `develop` (jamais directement vers `main`)
3. SonarQube + tests + lint + type-check verts avant merge
4. `develop` → `main` en fin de sprint
5. Pas d'attribution Claude/co-author dans les commits
6. Commit après chaque EPIC complet
7. Pour les changements UI : tester sur `/fr/` et `/en/`, vérifier le build Docker localement

## 11. Ce que ce produit n'est PAS

- ❌ Pas un outil SaaS
- ❌ Pas un fork ou un wrapper de Claude Code
- ❌ Pas un blog perso (l'auteur n'apparaît qu'avec parcimonie, en footer/about)
- ❌ Pas un site de génération automatique d'articles par IA (chaque article est revu et sourcé)
- ❌ Pas une marketplace ou un agrégateur transactionnel
- ❌ Pas un produit en quête de monétisation (pas d'ads, pas d'affiliate, pas de sponsoring caché)

## 12. Ce que ce produit EST

- ✅ Un site éditorial de référence, francophone d'abord, bilingue strict
- ✅ Une démonstration de ce que Claude Code peut produire quand il est bien orchestré
- ✅ Une ressource gratuite, ouverte (code MIT, contenu CC BY-NC-SA 4.0)
- ✅ Un projet maintenu activement avec des EPICs trimestriels et des refontes graphiques majeures
- ✅ Un terrain d'expérimentation pour l'écosystème skill/MCP/plugin (cf. EPIC Stack design 2026-05)
