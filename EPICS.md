# Backlog Produit — The Claude Codex

## Vue d'ensemble

### Vision cible

The Claude Codex vise a devenir **le site de reference francophone** pour maitriser Claude Code. La vision complete comprend :

- **~35 pages** de contenu editorial couvrant 9 sections thematiques (Landing, Getting Started, MCP, Plugins, Skills, Agents, Prompting, Configurateur, Future)
- Un **configurateur interactif** (killer feature) generant des configurations pret-a-l'emploi en ZIP
- Une **strategie SEO granulaire** (1 page = 1 intention de recherche)
- Un **design system accessible** et memorable, distinct de l'identite Anthropic
- Un deploiement **Docker optimise** avec securite renforcee

### Etat actuel

Le site dispose de **6 pages** (Landing, Getting Started, MCP, Skills, Prompting, Future) avec :
- Une stack Next.js 14 / TypeScript / Tailwind CSS / Docker Nginx fonctionnelle
- Un design system embryonnaire (10 composants UI)
- Un contenu editorial de qualite mais sans accents francais
- Des fondations SEO de base (title, description par page)

### Gap Analysis

| Dimension | Etat actuel | Cible | Ecart |
|-----------|-------------|-------|-------|
| Pages | 6 pages monolithiques | ~35 pages granulaires | +29 pages, restructuration des 6 existantes |
| Sections | 5 sections | 9 sections | +4 sections (Plugins, Agents, Configurateur, sous-pages) |
| Composants UI | 10 composants (bugs critiques) | Design system complet + configurateur | Corrections + nouveaux composants |
| Accessibilite | Echecs WCAG AA critiques | WCAG 2.1 AA complet | Refonte couleurs, focus, navigation clavier |
| SEO | Meta basiques, pas d'og:image | SEO granulaire complet | Sitemap, JSON-LD, og:image, breadcrumbs |
| Navigation | Plate, sans sidebar ni TOC | Sidebar sticky, breadcrumbs, search | Infrastructure navigation complete |
| Configurateur | Inexistant | Outil interactif complet avec ZIP | Feature entiere a construire |
| Performance | Brotli absent, lucide surdimensionne | Lighthouse > 90 | Optimisations Nginx + bundles |
| Contenu | Sans accents, 6 pages | ~35 pages, accents, MDX | Refonte contenu + nouvelles pages |

### Legende des statuts

| Icone | Statut Dev | Description |
|-------|------------|-------------|
| `TODO` | A faire | Pas encore commencee |
| `EN COURS` | En developpement | Travail en cours |
| `TERMINÉ` | Terminee | Implementation finalisee |
| `BLOQUÉ` | Bloquee | En attente d'une dependance |

| Icone | Statut Review | Description |
|-------|---------------|-------------|
| `NON REVIEWÉ` | Pas de review | Pas encore soumise a review |
| `EN REVIEW` | En cours de review | Review en cours |
| `APPROUVÉ` | Review validee | Review passee avec succes |
| `CORRECTIONS` | Corrections demandees | Review avec retours a corriger |

---

## Epics

---

### Epic 1 — Corrections critiques d'accessibilite et de contrastes WCAG

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P0 (bloquant)
- **Estimation** : S (3-5 jours)
- **Dependances** : Aucune
- **Description** : Corriger les 2 echecs WCAG AA critiques (contrastes couleurs) et les problemes d'accessibilite bloquants identifies dans l'audit. Ces corrections sont un prerequis absolu avant tout autre travail : on ne construit pas sur des fondations inaccessibles.
- **User Stories** :
  1. En tant qu'utilisateur en light mode, je veux que tous les textes cyan soient lisibles sur fond blanc afin de pouvoir lire le contenu sans effort.
  2. En tant qu'utilisateur de lecteur d'ecran, je veux que le menu mobile ne piege pas ma navigation clavier afin de pouvoir parcourir le site sans obstacles.
  3. En tant qu'utilisateur clavier, je veux un indicateur de focus visible sur tous les elements interactifs afin de savoir ou je me trouve dans la page.
  4. En tant qu'utilisateur de lecteur d'ecran, je veux un lien "skip-to-content" afin d'acceder directement au contenu principal.
  5. En tant qu'utilisateur, je veux que les icones decoratives soient masquees aux technologies d'assistance afin de ne pas polluer la lecture.
  6. En tant qu'utilisateur de lecteur d'ecran, je veux que les landmarks `<nav>` aient des labels descriptifs afin de distinguer les zones de navigation.
- **Criteres d'acceptation** :
  - `text-brand-500` sur fond blanc atteint un ratio >= 4.5:1 (WCAG AA)
  - `text-brand-300` sur badges light atteint un ratio >= 4.5:1 (WCAG AA)
  - Les liens du menu mobile sont inerts quand le menu est ferme (`inert` ou `aria-hidden` + `tabIndex={-1}`)
  - Un style `focus-visible` explicite est defini globalement dans `globals.css`
  - Un lien skip-to-content est present et visible au premier Tab
  - Toutes les icones Lucide decoratives ont `aria-hidden="true"`
  - Le `<nav>` principal a un `aria-label`
  - Les groupes de liens du footer sont encapsules dans des `<nav>` avec `aria-label`
  - Les PathCards ont un `aria-label` concis sur le lien englobant
  - Aucun echec WCAG AA dans un audit Lighthouse accessibilite
- **Fichiers impactes** :
  - `src/app/globals.css`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/ui/PathCard.tsx`
  - `src/components/ui/SectionHeading.tsx`
  - `src/components/ui/FeatureCard.tsx`
  - `src/components/ui/AudienceCard.tsx`
  - `src/components/ui/Callout.tsx`
  - `src/app/layout.tsx` (skip-to-content)
  - `tailwind.config.ts` (tokens couleur light mode)
- **Source** : AUDIT (C2, C5, C6, I4, N4, N6, N12, N13, N14)

---

### Epic 2 — Correction des bugs critiques du design system

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P0 (bloquant)
- **Estimation** : S (3-5 jours)
- **Dependances** : Aucune (parallelisable avec Epic 1)
- **Description** : Corriger les bugs fonctionnels critiques des composants UI existants : bouton copier absent dans CodeBlock, classes Tailwind dynamiques cassees dans PathCard, absence de coloration syntaxique, indicateur de page active manquant. Ces corrections sont necessaires avant d'ajouter du contenu.
- **User Stories** :
  1. En tant que developpeur lisant un guide, je veux un bouton "Copier le code" sur chaque bloc de code afin de copier rapidement les exemples dans mon terminal.
  2. En tant qu'utilisateur, je veux voir la coloration syntaxique dans les blocs de code afin de lire plus facilement les exemples.
  3. En tant qu'utilisateur, je veux voir clairement quelle page est active dans le header afin de m'orienter dans le site.
  4. En tant qu'utilisateur, je veux que les bullet points des PathCards aient la bonne couleur en production afin d'avoir une experience visuelle coherente.
  5. En tant qu'utilisateur, je veux que les FeatureCards soient cliquables quand elles referent a une page afin de naviguer intuitivement.
- **Criteres d'acceptation** :
  - Le composant CodeBlock affiche un bouton "Copier" fonctionnel avec feedback visuel (icone check pendant 2s)
  - `navigator.clipboard.writeText()` est utilise pour la copie
  - La coloration syntaxique est active via `shiki` ou `prism-react-renderer`
  - L'import mort `Copy` de lucide-react est remplace par une implementation fonctionnelle
  - Le lien actif dans le header est stylistiquement distinct (soulignement, couleur, ou poids)
  - `usePathname()` est utilise pour detecter la page courante
  - Les classes Tailwind dynamiques dans PathCard utilisent un objet de mapping statique
  - FeatureCard accepte une prop `href` optionnelle et se rend comme un lien quand fournie
  - Build de production sans erreur, couleurs correctes
- **Fichiers impactes** :
  - `src/components/ui/CodeBlock.tsx` (refonte complete)
  - `src/components/ui/PathCard.tsx` (ligne 81, mapping statique)
  - `src/components/ui/FeatureCard.tsx` (ajout prop `href`)
  - `src/components/layout/Header.tsx` (indicateur page active)
  - `package.json` (ajout `shiki` ou `prism-react-renderer`)
- **Source** : AUDIT (C1, C3, C4, I2)

---

### Epic 3 — Infrastructure de navigation et architecture multi-pages

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P0 (bloquant)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 1, Epic 2
- **Description** : Mettre en place l'infrastructure de navigation necessaire pour supporter ~35 pages : sidebar sticky avec table des matieres, fil d'Ariane (breadcrumbs), bouton retour en haut, recherche globale. Restructurer le routing Next.js pour accueillir les sous-pages par section. C'est le socle technique sur lequel toutes les nouvelles pages seront construites.
- **User Stories** :
  1. En tant qu'utilisateur sur une page longue, je veux une table des matieres laterale sticky afin de naviguer rapidement entre les sections.
  2. En tant qu'utilisateur, je veux un fil d'Ariane sur chaque page de documentation afin de comprendre ma position dans l'arborescence.
  3. En tant qu'utilisateur sur une page longue, je veux un bouton "retour en haut" flottant afin de remonter sans scroller.
  4. En tant qu'utilisateur, je veux une recherche globale afin de trouver rapidement un sujet dans le site.
  5. En tant que developpeur du site, je veux une structure de routing par section avec layouts partages afin de supporter les sous-pages sans duplication.
  6. En tant qu'utilisateur, je veux une sidebar de navigation par section (Getting Started, MCP, etc.) afin de parcourir les pages d'une meme thematique.
  7. En tant qu'utilisateur, je veux que la table des matieres indique la section actuellement visible afin de me reperer dans la page.
- **Criteres d'acceptation** :
  - Composant `TableOfContents` sticky, genere automatiquement depuis les headings de la page, avec indicateur de section active (Intersection Observer)
  - Composant `Breadcrumb` present sur toutes les pages sauf la landing
  - Composant `ScrollToTop` flottant, visible apres 300px de scroll
  - Structure de routing : `/getting-started/[slug]`, `/mcp/[slug]`, `/plugins/[slug]`, `/skills/[slug]`, `/agents/[slug]`, `/prompting/[slug]`, `/future/[slug]`, `/configurator/[slug]`
  - Layout partage par section avec sidebar de navigation
  - Recherche globale fonctionnelle (index statique JSON)
  - Les pages longues existantes (Prompting 923 lignes, Skills 853 lignes) beneficient de la TOC
- **Fichiers impactes** :
  - `src/components/ui/TableOfContents.tsx` (nouveau)
  - `src/components/ui/Breadcrumb.tsx` (nouveau)
  - `src/components/ui/ScrollToTop.tsx` (nouveau)
  - `src/components/ui/SearchDialog.tsx` (nouveau)
  - `src/components/layout/SectionSidebar.tsx` (nouveau)
  - `src/app/getting-started/layout.tsx` (nouveau)
  - `src/app/mcp/layout.tsx` (nouveau)
  - `src/app/plugins/layout.tsx` (nouveau)
  - `src/app/skills/layout.tsx` (nouveau)
  - `src/app/agents/layout.tsx` (nouveau)
  - `src/app/prompting/layout.tsx` (nouveau)
  - `src/app/future/layout.tsx` (nouveau)
  - `src/app/configurator/layout.tsx` (nouveau)
  - `src/components/layout/Header.tsx` (ajout search trigger)
  - `src/lib/search-index.ts` (nouveau)
- **Source** : LES DEUX (AUDIT I1, N2 + DEMANDE section 5 navigation)

---

### Epic 4 — Amelioration du light mode et polish du design system

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : S (3-5 jours)
- **Dependances** : Epic 1
- **Description** : Le light mode est sous-travaille par rapport au dark mode. Corriger les cards quasi-invisibles, le hero au fond noir en light mode, les tailles de texte trop petites, les touch targets sous-dimensionnes, et creer un logo plus memorable.
- **User Stories** :
  1. En tant qu'utilisateur en light mode, je veux que les cards aient des bordures et ombres visibles afin de distinguer les elements de l'interface.
  2. En tant qu'utilisateur en light mode, je veux que le hero s'adapte au theme clair afin d'avoir une experience visuelle coherente.
  3. En tant qu'utilisateur, je veux que le texte descriptif des cards soit en 16px minimum afin de lire confortablement.
  4. En tant qu'utilisateur mobile, je veux des zones tactiles de 44x44px minimum afin de taper precisement sur les boutons.
  5. En tant qu'utilisateur, je veux un logo memorable et distinctif afin d'identifier le site au premier coup d'oeil.
- **Criteres d'acceptation** :
  - Les glass-cards en light mode ont des bordures opaques et des ombres subtiles
  - Le hero adapte son fond en light mode (pas de `bg-slate-950` en clair)
  - Tout texte descriptif est en `text-base` (16px) minimum
  - ThemeToggle et menu button sont en `h-11 w-11` (44px) minimum
  - Un nouveau logo typographique ou monogramme remplace l'icone Terminal generique
  - Les variantes hex dans `globals.css` sont synchronisees avec les tokens Tailwind
- **Fichiers impactes** :
  - `src/app/globals.css`
  - `tailwind.config.ts`
  - `src/components/layout/ThemeToggle.tsx`
  - `src/components/layout/Header.tsx`
  - `src/components/ui/FeatureCard.tsx`
  - `src/components/ui/PathCard.tsx`
  - `src/components/ui/TestimonialCard.tsx`
  - `src/components/ui/AudienceCard.tsx`
  - `src/app/page.tsx` (hero section)
  - `public/` (nouveau logo)
- **Source** : AUDIT (I3, I5, I6, N15, section 3 Design)

---

### Epic 5 — Infrastructure SEO et meta-donnees completes

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : S (3-5 jours)
- **Dependances** : Epic 3 (structure de routing)
- **Description** : Mettre en place l'infrastructure SEO technique exigee : sitemap XML auto-genere, robots.txt, structured data JSON-LD, og:image par page, canonical URLs, breadcrumbs schema.org. Corriger les og:tags manquants sur 4 pages.
- **User Stories** :
  1. En tant que moteur de recherche, je veux un sitemap XML a jour afin d'indexer toutes les pages du site.
  2. En tant que reseau social, je veux une og:image pour chaque page afin d'afficher une vignette lors des partages.
  3. En tant que moteur de recherche, je veux des donnees structurees JSON-LD afin de comprendre le type de contenu (article, guide, FAQ).
  4. En tant que developpeur du site, je veux un systeme de metadata centralise afin de garantir que chaque nouvelle page a ses meta-donnees completes.
  5. En tant que moteur de recherche, je veux des canonical URLs sur chaque page afin d'eviter le contenu duplique.
  6. En tant qu'utilisateur, je veux des breadcrumbs schema.org afin d'avoir un affichage enrichi dans les resultats Google.
- **Criteres d'acceptation** :
  - Sitemap XML genere automatiquement a chaque build (toutes les pages)
  - `robots.txt` correctement configure
  - og:image presente sur chaque page (generee ou generique)
  - JSON-LD `Article` ou `HowTo` sur chaque page de contenu
  - JSON-LD `BreadcrumbList` sur chaque page avec fil d'Ariane
  - og:title, og:description, og:type, og:locale definis sur toutes les pages
  - Canonical URL sur chaque page
  - URLs en kebab-case sans trailing slash
- **Fichiers impactes** :
  - `src/app/layout.tsx` (metadata par defaut)
  - `src/app/sitemap.ts` (nouveau)
  - `src/app/robots.ts` (nouveau)
  - `src/lib/metadata.ts` (nouveau, helper centralise)
  - `src/lib/structured-data.ts` (nouveau)
  - `src/components/ui/Breadcrumb.tsx` (ajout schema.org)
  - `public/og/` (nouveau, images OG)
  - Toutes les pages (metadata export)
- **Source** : LES DEUX (AUDIT I7, section 8 + DEMANDE section 8 SEO)

---

### Epic 6 — Optimisation des performances et du build

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : S (3-5 jours)
- **Dependances** : Epic 2 (CodeBlock avec shiki impacte le bundle)
- **Description** : Optimiser les bundles JS (lucide-react surdimensionne), activer la compression Brotli dans Nginx, corriger les headers de securite deprecies, ajouter les animations framer-motion. Viser un score Lighthouse > 90 sur les 4 metriques.
- **User Stories** :
  1. En tant qu'utilisateur mobile, je veux que le site charge en moins de 2 secondes sur 3G afin d'avoir une experience fluide.
  2. En tant qu'utilisateur, je veux des animations subtiles au scroll afin d'avoir une experience visuelle engageante.
  3. En tant que DevOps, je veux que les headers de securite Nginx soient corrects et a jour afin d'eviter les faux positifs de securite.
  4. En tant que developpeur du site, je veux que le chunk lucide-react soit optimise afin de reduire la taille du bundle.
  5. En tant qu'utilisateur, je veux la compression Brotli afin de reduire les temps de transfert de 15-20%.
- **Criteres d'acceptation** :
  - Chunk `lucide-react` reduit a < 50 KB via imports individuels ou migration `@lucide/react`
  - Compression Brotli activee dans Nginx (pre-compression ou module `ngx_brotli`)
  - Header `X-XSS-Protection` supprime de `nginx.conf`
  - Header HSTS conditionne aux connexions HTTPS
  - `framer-motion` installe et utilise pour des animations reveal-on-scroll
  - `prefers-reduced-motion` respecte pour framer-motion
  - Score Lighthouse > 90 sur Performance, Accessibilite, Best Practices, SEO
  - Image Docker finale < 50 MB
- **Fichiers impactes** :
  - `package.json` (ajout framer-motion, optimisation lucide-react)
  - `nginx/nginx.conf` (Brotli, suppression X-XSS-Protection, HSTS conditionnel)
  - `Dockerfile` (eventuellement pour Brotli pre-compression)
  - `src/components/ui/AnimateOnScroll.tsx` (nouveau)
  - Composants utilisant des imports lucide-react (tous)
- **Source** : LES DEUX (AUDIT I8, N1, N9, N10, N11 + DEMANDE sections 5, 6)

---

### Epic 7 — Correction du contenu existant et migration vers MDX

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 2 (CodeBlock corrige), Epic 3 (structure multi-pages)
- **Description** : Migrer le contenu des 6 pages actuelles (code inline dans les fichiers page.tsx) vers des fichiers MDX dans `/content`. Ajouter les accents francais manquants sur tout le site. Corriger la terminologie inconsistante. Restructurer les pages monolithiques en sous-pages. Preparer le pipeline MDX (next-mdx-remote ou @next/mdx).
- **User Stories** :
  1. En tant que redacteur, je veux editer le contenu dans des fichiers MDX separes afin de ne pas toucher au code React.
  2. En tant qu'utilisateur francophone, je veux que tous les textes aient des accents corrects afin de lire du francais standard.
  3. En tant qu'utilisateur, je veux que la page Getting Started actuelle soit decoupee en 4 sous-pages afin de trouver rapidement l'information recherchee.
  4. En tant qu'utilisateur, je veux que la page MCP actuelle soit decoupee en 6 sous-pages afin d'avoir un contenu plus cible.
  5. En tant qu'utilisateur, je veux que la page Skills actuelle soit decoupee en 4 sous-pages afin de distinguer les sujets.
  6. En tant qu'utilisateur, je veux que la page Prompting actuelle soit decoupee en 6 sous-pages afin de trouver le guide specifique dont j'ai besoin.
  7. En tant qu'utilisateur, je veux que la page Future actuelle soit decoupee en 3 sous-pages afin d'acceder aux differents sujets.
  8. En tant que developpeur du site, je veux des composants MDX reutilisables (Callout, CodeBlock, Tabs, Steps, Card) afin d'enrichir le contenu editorial.
- **Criteres d'acceptation** :
  - Pipeline MDX fonctionnel (compilation MDX -> pages Next.js)
  - Les 6 pages actuelles sont migrees vers des fichiers MDX dans `/content`
  - Composants MDX enregistres : `<Callout>`, `<CodeBlock>`, `<Tabs>`, `<Steps>`, `<Card>`
  - Tous les textes du site ont des accents francais corrects
  - Terminologie consistante (politique de traduction definie pour Skills, Plugins, etc.)
  - Les CTAs de fin de page sont pertinents (pas de "Retour a l'accueil" sur Prompting)
  - Structure des sous-pages conforme a la demande utilisateur (section 4)
- **Fichiers impactes** :
  - `content/` (nouveau repertoire, tous les fichiers MDX)
  - `src/lib/mdx.ts` (nouveau, pipeline MDX)
  - `src/components/mdx/` (nouveau repertoire, composants MDX)
  - `src/app/getting-started/[slug]/page.tsx` (nouveau)
  - `src/app/mcp/[slug]/page.tsx` (nouveau)
  - `src/app/skills/[slug]/page.tsx` (nouveau)
  - `src/app/prompting/[slug]/page.tsx` (nouveau)
  - `src/app/future/[slug]/page.tsx` (nouveau)
  - `package.json` (ajout next-mdx-remote ou @next/mdx)
  - Pages existantes (refactoring vers MDX)
- **Source** : LES DEUX (AUDIT N8, section 10 + DEMANDE sections 4.2-4.9, 7)

---

### Epic 8 — Refonte de la landing page

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 1, Epic 2, Epic 4, Epic 6 (animations)
- **Description** : Refondre la landing page pour qu'elle soit "visuellement spectaculaire et memorable" selon la demande. Ajouter les sections manquantes : galerie de cas d'usage, profils "Pour qui ?", parcours cliquables, teaser du configurateur, temoignages ameliores. La landing est le showcase du site et doit refleter la qualite du design system corrige.
- **User Stories** :
  1. En tant que visiteur, je veux un hero visuellement percutant avec une animation engageante afin d'etre immediatement capte.
  2. En tant que visiteur, je veux voir 6-8 cas d'usage concrets (creer un site, automatiser, coder...) afin de comprendre ce que Claude Code peut faire.
  3. En tant que visiteur, je veux me reconnaitre dans un des 4 profils (Developpeur, Entrepreneur, Creatif, Curieux) afin de savoir si le site est pour moi.
  4. En tant que visiteur, je veux voir 3 parcours (Debutant, Intermediaire, Avance) cliquables afin de choisir mon chemin.
  5. En tant que visiteur, je veux un teaser du configurateur avec un CTA afin de decouvrir la killer feature du site.
  6. En tant que visiteur, je veux des temoignages credibles avec avatars afin d'etre rassure sur la valeur du contenu.
  7. En tant que visiteur, je veux un footer complet avec liens, credits et GitHub afin d'acceder aux ressources annexes.
- **Criteres d'acceptation** :
  - Hero avec titre percutant, sous-titre, CTA primaire, animation framer-motion
  - Section "Ce que vous pouvez faire" avec galerie visuelle de 6-8 cas d'usage
  - Section "Pour qui ?" avec 4 profils et pictogrammes
  - Section "Parcours" avec 3 chemins cliquables menant aux bonnes pages
  - Section "Configurateur rapide" avec teaser et CTA vers `/configurator`
  - Section temoignages avec avatars (ou mention si fictifs, cf. N3)
  - Animations reveal-on-scroll via framer-motion
  - Score Lighthouse > 90 sur la landing
  - Mobile-first, responsive sur tous les breakpoints
- **Fichiers impactes** :
  - `src/app/page.tsx` (refonte complete) ou `content/landing.mdx` (nouveau)
  - `src/components/ui/TestimonialCard.tsx` (ajout avatar)
  - `src/components/ui/UseCaseGallery.tsx` (nouveau)
  - `src/components/ui/ConfiguratorTeaser.tsx` (nouveau)
  - `src/components/ui/ProfileCard.tsx` (nouveau)
  - `public/` (images, avatars)
- **Source** : LES DEUX (AUDIT N3, section 3 + DEMANDE section 4.1)

---

### Epic 9 — Section Getting Started (4 pages)

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2 (moyenne)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Creer les 4 pages de la section Getting Started a partir du contenu existant restructure et de nouveau contenu. Chaque page cible une intention de recherche specifique.
- **User Stories** :
  1. En tant que debutant, je veux une page "Qu'est-ce que Claude Code ?" afin de comprendre l'outil avant de l'installer.
  2. En tant que developpeur, je veux une page "Prerequisites et installation" afin d'installer Claude Code sur ma machine.
  3. En tant qu'utilisateur, je veux une page "Configuration de l'environnement" afin de configurer correctement mon workspace.
  4. En tant que debutant, je veux un tutoriel "Premier projet pas a pas" afin de realiser mon premier projet avec Claude Code.
- **Criteres d'acceptation** :
  - 4 pages MDX completes avec contenu reel et utile (pas de lorem ipsum)
  - URLs conformes : `/getting-started/what-is-claude-code`, `/getting-started/installation`, `/getting-started/environment-setup`, `/getting-started/first-project`
  - Chaque page a : title unique, meta description, og:tags, breadcrumbs, maillage interne
  - Structure : Intro > Corps > Exemple concret > Prochaines etapes
  - Code examples testes et commentes
  - Navigation laterale entre les 4 pages
- **Fichiers impactes** :
  - `content/getting-started/what-is-claude-code.mdx` (nouveau)
  - `content/getting-started/installation.mdx` (nouveau)
  - `content/getting-started/environment-setup.mdx` (nouveau)
  - `content/getting-started/first-project.mdx` (nouveau)
  - `src/app/getting-started/[slug]/page.tsx`
  - `src/app/getting-started/page.tsx` (index/hub de section)
- **Source** : DEMANDE (section 4.2)

---

### Epic 10 — Section MCP (6 pages)

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2 (moyenne)
- **Estimation** : L (2-4 semaines)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Creer les 6 pages de la section MCP avec des fiches detaillees pour chaque MCP (Figma, Playwright, Chrome DevTools, 21st.dev, Lighthouse, Context7, Puppeteer, Firecrawl, Sentry, Linear, PostgreSQL, Supabase). Contenu frais et actionable.
- **User Stories** :
  1. En tant qu'utilisateur, je veux une page "Comprendre les MCP en 5 minutes" afin de saisir le concept rapidement.
  2. En tant que developpeur, je veux une page "Installer et configurer un MCP" afin de mettre en place mes premiers MCP.
  3. En tant que professionnel, je veux une page "Top MCP productivite" afin de decouvrir les MCP Figma, Lighthouse, etc.
  4. En tant que developpeur, je veux une page "Top MCP developpement" afin de decouvrir Context7, Sentry, Linear, etc.
  5. En tant que designer, je veux une page "Top MCP design & UI" afin de decouvrir Playwright, Chrome DevTools, 21st.dev Magic.
  6. En tant qu'utilisateur intermediaire, je veux une page "Creer son premier workflow MCP" afin de combiner plusieurs MCP dans un flux de travail.
- **Criteres d'acceptation** :
  - 6 pages MDX completes avec contenu reel
  - Fiches detaillees pour les 12+ MCP listes dans la demande (description, installation, cas d'usage, configuration)
  - Mention du setup OAuth Figma et du mode Desktop MCP
  - URLs conformes a la demande (section 4.3)
  - Maillage interne vers Skills, Plugins, et Configurateur
  - Structure : Intro > Corps > Exemple concret > Prochaines etapes
- **Fichiers impactes** :
  - `content/mcp/what-are-mcps.mdx` (nouveau)
  - `content/mcp/setup.mdx` (nouveau)
  - `content/mcp/best-productivity.mdx` (nouveau)
  - `content/mcp/best-development.mdx` (nouveau)
  - `content/mcp/best-design.mdx` (nouveau)
  - `content/mcp/first-workflow.mdx` (nouveau)
  - `src/app/mcp/[slug]/page.tsx`
  - `src/app/mcp/page.tsx` (index/hub de section)
- **Source** : DEMANDE (section 4.3)

---

### Epic 11 — Section Plugins (5 pages) — Nouvelle section

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2 (moyenne)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Creer la section Plugins complete (inexistante actuellement) avec 5 pages detaillant les plugins Claude Code, leur installation, et les top plugins par categorie. Contenu base sur les donnees fraichess fournies (Frontend Design 96K installs, Context7 71K, Everything Claude Code 57K+, etc.).
- **User Stories** :
  1. En tant qu'utilisateur, je veux une page "Comprendre les plugins" afin de savoir ce que sont les plugins Claude Code.
  2. En tant que developpeur, je veux une page "Installer et gerer ses plugins" afin de savoir utiliser les commandes `/plugin`.
  3. En tant qu'utilisateur, je veux une page "Top plugins essentiels 2026" afin de decouvrir les plugins les plus populaires.
  4. En tant que designer, je veux une page "Plugins design & frontend" afin de trouver les plugins adaptes a mon metier.
  5. En tant que developpeur securite, je veux une page "Plugins securite & qualite" afin de securiser mon workflow.
- **Criteres d'acceptation** :
  - 5 pages MDX completes avec contenu reel
  - Fiches pour les 10+ plugins listes (Frontend Design, Context7, Everything Claude Code, Security Guidance, UI UX Pro Max, Prompt Improver, Code Review, Playwright, Ralph Loop, Repomix)
  - Commandes d'installation documentees (`/plugin marketplace add`, `/plugin install`, `claude plugins list`)
  - URLs conformes a la demande (section 4.4)
  - Maillage interne vers MCP, Skills, et Configurateur
- **Fichiers impactes** :
  - `content/plugins/what-are-plugins.mdx` (nouveau)
  - `content/plugins/setup.mdx` (nouveau)
  - `content/plugins/best-essential.mdx` (nouveau)
  - `content/plugins/best-design.mdx` (nouveau)
  - `content/plugins/best-security.mdx` (nouveau)
  - `src/app/plugins/[slug]/page.tsx` (nouveau)
  - `src/app/plugins/page.tsx` (nouveau, index)
  - `src/app/plugins/layout.tsx` (nouveau)
- **Source** : DEMANDE (section 4.4)

---

### Epic 12 — Section Skills (4 pages)

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2 (moyenne)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Restructurer le contenu Skills existant en 4 sous-pages incluant un guide de creation de skill custom et un comparatif Skills vs MCP vs Plugins.
- **User Stories** :
  1. En tant qu'utilisateur, je veux une page "Qu'est-ce qu'un skill ?" afin de comprendre le concept.
  2. En tant qu'utilisateur, je veux une page "Top skills recommandes" afin de decouvrir les meilleurs skills.
  3. En tant que developpeur avance, je veux une page "Creer un skill custom" afin de personnaliser Claude Code.
  4. En tant qu'utilisateur, je veux une page comparative "Skills vs MCP vs Plugins" afin de comprendre les differences et quand utiliser quoi.
- **Criteres d'acceptation** :
  - 4 pages MDX completes avec contenu reel
  - Le comparatif Skills/MCP/Plugins est clair avec un tableau recapitulatif
  - Le guide de creation de skill custom inclut un exemple complet
  - URLs conformes a la demande (section 4.5)
  - Maillage interne vers MCP, Plugins, et Agents
- **Fichiers impactes** :
  - `content/skills/what-are-skills.mdx` (nouveau)
  - `content/skills/best-skills.mdx` (nouveau)
  - `content/skills/create-custom.mdx` (nouveau)
  - `content/skills/comparison.mdx` (nouveau)
  - `src/app/skills/[slug]/page.tsx`
  - `src/app/skills/page.tsx` (index/hub)
- **Source** : DEMANDE (section 4.5)

---

### Epic 13 — Section Agents & Subagents (5 pages) — Nouvelle section

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2 (moyenne)
- **Estimation** : L (2-4 semaines)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Creer la section Agents complete (inexistante actuellement) avec 5 pages couvrant les subagents, agent teams, orchestration multi-agents. Contenu technique avance expliquant les differences entre subagents et agent teams, avec mention de la variable experimentale.
- **User Stories** :
  1. En tant qu'utilisateur, je veux une page "Comprendre les agents et subagents" afin de saisir les concepts.
  2. En tant que developpeur, je veux une page "Creer un subagent specialise" afin de deleguer des taches a des agents.
  3. En tant qu'utilisateur avance, je veux une page "Agent Teams — le guide complet" afin de maitriser le travail multi-agents.
  4. En tant qu'utilisateur, je veux une page "Top agents par cas d'usage" afin de trouver les agents adaptes a mes besoins.
  5. En tant qu'expert, je veux une page "Orchestration multi-agents avancee" afin de concevoir des architectures complexes.
- **Criteres d'acceptation** :
  - 5 pages MDX completes avec contenu reel
  - Distinction claire entre subagents (mono-session) et agent teams (multi-session)
  - Mention de `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` et du statut research preview
  - Exemples concrets de configurations d'agents
  - URLs conformes a la demande (section 4.6)
  - Maillage interne vers Skills, Plugins, et Configurateur
- **Fichiers impactes** :
  - `content/agents/what-are-agents.mdx` (nouveau)
  - `content/agents/create-subagent.mdx` (nouveau)
  - `content/agents/agent-teams.mdx` (nouveau)
  - `content/agents/best-agents.mdx` (nouveau)
  - `content/agents/orchestration.mdx` (nouveau)
  - `src/app/agents/[slug]/page.tsx` (nouveau)
  - `src/app/agents/page.tsx` (nouveau, index)
  - `src/app/agents/layout.tsx` (nouveau)
- **Source** : DEMANDE (section 4.6)

---

### Epic 14 — Section Prompting (6 pages)

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2 (moyenne)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Restructurer la page Prompting existante (923 lignes) en 6 sous-pages ciblees, incluant un guide complet CLAUDE.md et des templates de prompts par metier.
- **User Stories** :
  1. En tant que debutant, je veux une page "Les bases du prompting" afin d'apprendre a communiquer avec Claude Code.
  2. En tant qu'utilisateur intermediaire, je veux une page "Les directives qui font la difference" afin d'ameliorer la qualite de mes prompts.
  3. En tant que professionnel, je veux une page "Templates de prompts par metier" afin d'avoir des modeles prets a l'emploi.
  4. En tant qu'utilisateur, je veux une page "Erreurs courantes a eviter" afin de ne pas perdre de temps.
  5. En tant que developpeur, je veux un guide complet sur CLAUDE.md afin de configurer optimalement mon projet.
  6. En tant qu'expert, je veux une page "Prompting avance & multi-agents" afin de maitriser les techniques avancees.
- **Criteres d'acceptation** :
  - 6 pages MDX completes avec contenu reel
  - Le guide CLAUDE.md inclut des exemples reels, mentionne `/init`, recommande < 200 lignes
  - Les templates par metier couvrent au minimum : developpeur web, mobile, backend, DevOps, designer, redacteur
  - CTA engageant en fin de page Prompting (pas "Retour a l'accueil")
  - URLs conformes a la demande (section 4.7)
- **Fichiers impactes** :
  - `content/prompting/basics.mdx` (nouveau)
  - `content/prompting/directives.mdx` (nouveau)
  - `content/prompting/templates.mdx` (nouveau)
  - `content/prompting/mistakes.mdx` (nouveau)
  - `content/prompting/claude-md.mdx` (nouveau)
  - `content/prompting/advanced.mdx` (nouveau)
  - `src/app/prompting/[slug]/page.tsx`
  - `src/app/prompting/page.tsx` (index/hub)
- **Source** : LES DEUX (AUDIT section 10 CTA faible + DEMANDE section 4.7)

---

### Epic 15 — Le Configurateur Interactif (killer feature)

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : XL (1+ mois)
- **Dependances** : Epic 3 (routing), Epic 7 (MDX pour les presets), Epic 5 (SEO)
- **Description** : Developper le configurateur interactif, la killer feature du site. Un outil React en 4 etapes (Profil, Stack, Abonnement, Fonctionnalites) qui genere un ZIP telechargeable contenant CLAUDE.md, settings.local.json, agents, .mcp.json, et guides d'installation. Inclut 10 presets pre-configures et une page import/export.
- **User Stories** :
  1. En tant qu'utilisateur, je veux selectionner mon profil (developpeur web, mobile, backend, DevOps, designer, redacteur, data, debutant) afin d'obtenir une configuration adaptee.
  2. En tant qu'utilisateur, je veux selectionner ma stack technique afin que les MCP et plugins recommandes correspondent a mes outils.
  3. En tant qu'utilisateur, je veux indiquer mon abonnement (Free, Pro, Max $100, Max $200, API) afin que la configuration respecte mes limites.
  4. En tant qu'utilisateur, je veux choisir les fonctionnalites souhaitees (Agent Teams, MCP, Plugins, Hooks, Skills) afin de personnaliser ma configuration.
  5. En tant qu'utilisateur, je veux voir un apercu en temps reel du contenu genere afin de valider avant de telecharger.
  6. En tant qu'utilisateur, je veux telecharger un ZIP contenant tous les fichiers de configuration afin de les integrer a mon projet.
  7. En tant qu'utilisateur, je veux copier le CLAUDE.md genere dans mon clipboard afin de l'utiliser rapidement.
  8. En tant qu'utilisateur presse, je veux choisir un preset pre-configure (Frontend, Mobile, Backend, DevOps, etc.) afin d'obtenir une configuration sans passer par les 4 etapes.
  9. En tant qu'utilisateur, je veux voir une estimation du cout en tokens par session afin de planifier mon usage.
  10. En tant qu'utilisateur, je veux pouvoir importer et exporter ma configuration afin de la sauvegarder et la partager.
- **Criteres d'acceptation** :
  - Page `/configurator` avec selection progressive en 4 etapes
  - Multi-select conditionnel pour la stack (affichage selon le profil choisi)
  - Preview en temps reel avec syntax highlighting (code viewer)
  - Bouton "Telecharger le ZIP" fonctionnel (generation cote client avec JSZip ou similaire)
  - Bouton "Copier le CLAUDE.md" avec feedback visuel
  - ZIP contient : `CLAUDE.md`, `.claude/settings.local.json`, `.claude/agents/*.md`, `.mcp.json`, `INSTALL.md`, `README.md`
  - Logique de generation differenciee par abonnement (Free, Pro, Max)
  - Page `/configurator/presets` avec les 10 presets documentes
  - Page `/configurator/import-export` fonctionnelle
  - Estimation du cout en tokens affichee
  - 100% statique (logique cote client, pas d'API)
  - Responsive et accessible
- **Fichiers impactes** :
  - `src/app/configurator/page.tsx` (nouveau)
  - `src/app/configurator/presets/page.tsx` (nouveau)
  - `src/app/configurator/import-export/page.tsx` (nouveau)
  - `src/app/configurator/layout.tsx` (nouveau)
  - `src/components/configurator/StepProfile.tsx` (nouveau)
  - `src/components/configurator/StepStack.tsx` (nouveau)
  - `src/components/configurator/StepSubscription.tsx` (nouveau)
  - `src/components/configurator/StepFeatures.tsx` (nouveau)
  - `src/components/configurator/ConfigPreview.tsx` (nouveau)
  - `src/components/configurator/PresetCard.tsx` (nouveau)
  - `src/lib/configurator/generator.ts` (nouveau, logique de generation)
  - `src/lib/configurator/presets.ts` (nouveau, definitions des presets)
  - `src/lib/configurator/templates/` (nouveau, templates de fichiers)
  - `src/lib/configurator/zip.ts` (nouveau, generation ZIP)
  - `src/lib/configurator/types.ts` (nouveau, types TypeScript)
  - `package.json` (ajout JSZip ou file-saver)
- **Source** : DEMANDE (section 4.8)

---

### Epic 16 — Section Vision & Futur (3 pages)

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P3 (basse)
- **Estimation** : S (3-5 jours)
- **Dependances** : Epic 3, Epic 5, Epic 7
- **Description** : Restructurer la page Future existante en 3 sous-pages : impact de l'IA sur les metiers, tendances 2026, et roadmap du projet.
- **User Stories** :
  1. En tant que professionnel, je veux une page "Pourquoi l'IA va transformer votre metier" afin de comprendre les enjeux.
  2. En tant que veilleur technologique, je veux une page "Tendances IA a suivre en 2026" afin de rester informe.
  3. En tant qu'utilisateur du site, je veux une page "Roadmap du projet" afin de connaitre les prochaines evolutions.
- **Criteres d'acceptation** :
  - 3 pages MDX completes avec contenu reel
  - URLs conformes a la demande (section 4.9)
  - Maillage interne vers les autres sections
  - Le contenu de la roadmap est coherent avec les epics realisees
- **Fichiers impactes** :
  - `content/future/why-ai-matters.mdx` (nouveau)
  - `content/future/trends-2026.mdx` (nouveau)
  - `content/future/roadmap.mdx` (nouveau)
  - `src/app/future/[slug]/page.tsx`
  - `src/app/future/page.tsx` (index/hub)
- **Source** : DEMANDE (section 4.9)

---

### Epic 17 — Page 404 et finitions UX

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P3 (basse)
- **Estimation** : XS (1-2 jours)
- **Dependances** : Epic 4 (design system corrige)
- **Description** : Creer une page 404 personnalisee alignee avec le design system, corriger le lien GitHub du footer, gerer l'annee dynamique du footer, et ajouter la mention transparence sur les temoignages si necessaire.
- **User Stories** :
  1. En tant qu'utilisateur arrivant sur une URL inexistante, je veux une page 404 esthetique et utile afin de retrouver mon chemin.
  2. En tant qu'utilisateur, je veux que le lien GitHub du footer pointe vers le bon repository afin d'acceder au code source.
  3. En tant qu'utilisateur, je veux que l'annee du copyright soit toujours a jour afin de percevoir un site maintenu.
- **Criteres d'acceptation** :
  - Page 404 avec le design system du site, message amical, et liens de navigation
  - Lien GitHub du footer pointe vers le repo The Claude Codex
  - Annee du copyright dynamique (composant client si SSG)
  - Mention transparence sur les temoignages si fictifs
- **Fichiers impactes** :
  - `src/app/not-found.tsx` (nouveau)
  - `src/components/layout/Footer.tsx`
- **Source** : AUDIT (N3, N5, N7, N16)

---

### Epic 18 — Tests, CI/CD et assurance qualite

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P1 (haute)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 2, Epic 3 (composants a tester)
- **Description** : Mettre en place une suite de tests (unit, integration, e2e) couvrant les composants UI, la navigation, le configurateur, et le build Docker. Configurer un pipeline CI/CD pour valider automatiquement chaque commit.
- **User Stories** :
  1. En tant que developpeur du site, je veux des tests unitaires sur les composants UI afin de prevenir les regressions.
  2. En tant que developpeur du site, je veux des tests e2e sur les parcours critiques afin de valider l'experience utilisateur.
  3. En tant que developpeur du site, je veux un pipeline CI qui execute lint, type-check, tests et build afin de deployer en confiance.
  4. En tant que developpeur du site, je veux des tests sur le configurateur afin de valider la generation des fichiers.
  5. En tant que developpeur du site, je veux un test du build Docker afin de s'assurer que l'image est fonctionnelle.
  6. En tant que developpeur du site, je veux un audit Lighthouse automatise en CI afin de detecter les regressions de performance.
- **Criteres d'acceptation** :
  - Tests unitaires avec couverture >= 80% sur les composants et utilitaires
  - Tests e2e sur : navigation complete, configurateur (selection + download), recherche, theme toggle
  - Pipeline CI : lint + type-check + tests unitaires + build Next.js + build Docker
  - Tests du configurateur : chaque preset genere un ZIP valide, chaque combinaison profil/stack produit du contenu coherent
  - Audit Lighthouse en CI avec seuils minimum (90 sur les 4 metriques)
- **Fichiers impactes** :
  - `__tests__/` (nouveau repertoire)
  - `e2e/` (nouveau repertoire)
  - `.github/workflows/ci.yml` (nouveau ou modification)
  - `jest.config.ts` ou `vitest.config.ts` (nouveau)
  - `playwright.config.ts` (nouveau)
  - `package.json` (ajout dependencies de test)
- **Source** : DEMANDE (section 10 instruction 8, + bonnes pratiques)

---

## Tableau recapitulatif

| # | Titre | Priorite | Taille | Phase | Statut | Review | Source |
|---|-------|----------|--------|-------|--------|--------|--------|
| 1 | Corrections critiques accessibilite WCAG | P0 | S | 1 | `TERMINÉ` | `NON REVIEWÉ` | AUDIT |
| 2 | Corrections bugs critiques design system | P0 | S | 1 | `TODO` | `NON REVIEWÉ` | AUDIT |
| 3 | Infrastructure navigation multi-pages | P0 | M | 1 | `TODO` | `NON REVIEWÉ` | LES DEUX |
| 4 | Amelioration light mode et polish design | P1 | S | 1 | `TODO` | `NON REVIEWÉ` | AUDIT |
| 5 | Infrastructure SEO et meta-donnees | P1 | S | 2 | `TODO` | `NON REVIEWÉ` | LES DEUX |
| 6 | Optimisation performances et build | P1 | S | 2 | `TODO` | `NON REVIEWÉ` | LES DEUX |
| 7 | Correction contenu et migration MDX | P1 | M | 2 | `TODO` | `NON REVIEWÉ` | LES DEUX |
| 8 | Refonte landing page | P1 | M | 2 | `TODO` | `NON REVIEWÉ` | LES DEUX |
| 9 | Section Getting Started (4 pages) | P2 | M | 3 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 10 | Section MCP (6 pages) | P2 | L | 3 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 11 | Section Plugins (5 pages) | P2 | M | 3 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 12 | Section Skills (4 pages) | P2 | M | 3 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 13 | Section Agents & Subagents (5 pages) | P2 | L | 3 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 14 | Section Prompting (6 pages) | P2 | M | 3 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 15 | Configurateur interactif | P1 | XL | 4 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 16 | Section Vision & Futur (3 pages) | P3 | S | 5 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 17 | Page 404 et finitions UX | P3 | XS | 5 | `TODO` | `NON REVIEWÉ` | AUDIT |
| 18 | Tests, CI/CD et assurance qualite | P1 | M | Continu | `TODO` | `NON REVIEWÉ` | LES DEUX |

**Progression** : 1/18 terminee (6%) — 0/18 reviewee (0%)

---

## Roadmap en phases

### Phase 1 — Fondations (Semaines 1-3)

**Objectif** : Corriger les fondations cassees, mettre en place l'infrastructure de navigation et le design system corrige.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 1 | Corrections critiques accessibilite WCAG | S | `TERMINÉ` | `NON REVIEWÉ` |
| 2 | Corrections bugs critiques design system | S | `TODO` | `NON REVIEWÉ` |
| 3 | Infrastructure navigation multi-pages | M | `TODO` | `NON REVIEWÉ` |
| 4 | Amelioration light mode et polish design | S | `TODO` | `NON REVIEWÉ` |

**Parallelisme** : Epics 1 et 2 en parallele (semaine 1). Epic 3 demarre semaine 2 apres 1+2. Epic 4 en parallele de Epic 3.

**Livrable** : Un site avec 6 pages accessibles, un design system fonctionnel, et une infrastructure de navigation prete pour le scaling.

---

### Phase 2 — Infrastructure contenu et SEO (Semaines 4-7)

**Objectif** : Mettre en place le pipeline MDX, l'infrastructure SEO, les optimisations de performance, et refondre la landing page.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 5 | Infrastructure SEO et meta-donnees | S | `TODO` | `NON REVIEWÉ` |
| 6 | Optimisation performances et build | S | `TODO` | `NON REVIEWÉ` |
| 7 | Correction contenu et migration MDX | M | `TODO` | `NON REVIEWÉ` |
| 8 | Refonte landing page | M | `TODO` | `NON REVIEWÉ` |

**Parallelisme** : Epics 5 et 6 en parallele (semaine 4-5). Epic 7 demarre semaine 4 (long). Epic 8 demarre semaine 5 apres les corrections visuelles.

**Livrable** : Un site avec pipeline MDX, SEO complet, performances optimisees, et une landing page spectaculaire.

---

### Phase 3 — Contenu editorial (Semaines 8-15)

**Objectif** : Creer les ~30 pages de contenu des 6 sections thematiques.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 9 | Section Getting Started (4 pages) | M | `TODO` | `NON REVIEWÉ` |
| 10 | Section MCP (6 pages) | L | `TODO` | `NON REVIEWÉ` |
| 11 | Section Plugins (5 pages) | M | `TODO` | `NON REVIEWÉ` |
| 12 | Section Skills (4 pages) | M | `TODO` | `NON REVIEWÉ` |
| 13 | Section Agents & Subagents (5 pages) | L | `TODO` | `NON REVIEWÉ` |
| 14 | Section Prompting (6 pages) | M | `TODO` | `NON REVIEWÉ` |

**Parallelisme** : Les sections sont independantes et peuvent etre developpees en parallele par des contributeurs differents. Ordre recommande si sequentiel : Getting Started > MCP > Plugins > Skills > Agents > Prompting (suit le parcours utilisateur).

**Livrable** : Un site complet avec ~35 pages de contenu editorial reel et utile.

---

### Phase 4 — Configurateur (Semaines 16-20)

**Objectif** : Developper la killer feature du site.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 15 | Configurateur interactif | XL | `TODO` | `NON REVIEWÉ` |

**Note** : Le configurateur depend du contenu des phases precedentes pour ses presets et templates. Il est recommande de commencer le prototypage de l'UI en phase 3 mais la logique de generation necessite que le contenu MCP/Plugins/Agents soit stabilise.

**Livrable** : Un configurateur interactif complet avec generation de ZIP, 10 presets, et import/export.

---

### Phase 5 — Finitions (Semaines 21-22)

**Objectif** : Finitions, pages secondaires, et polish final.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 16 | Section Vision & Futur (3 pages) | S | `TODO` | `NON REVIEWÉ` |
| 17 | Page 404 et finitions UX | XS | `TODO` | `NON REVIEWÉ` |

**Livrable** : Site complet et poli.

---

### Continu — Qualite (tout au long du projet)

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 18 | Tests, CI/CD et assurance qualite | M | `TODO` | `NON REVIEWÉ` |

**Note** : Les tests doivent etre ecrits au fur et a mesure du developpement (TDD). La CI/CD doit etre en place des la phase 1. L'estimation M correspond au setup initial + tests des composants existants. Chaque epic subsequente doit inclure ses propres tests.

---

## Matrice de tracabilite

### Points de l'audit couverts

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| **C1** | Pas de bouton "copier le code" dans CodeBlock, import mort | Epic 2 |
| **C2** | Navigation clavier piegee dans le menu mobile | Epic 1 |
| **C3** | Pas d'indicateur de page active dans le header | Epic 2 |
| **C4** | Classes Tailwind dynamiques non detectees au purge (PathCard) | Epic 2 |
| **C5** | Echec WCAG AA : text-brand-500 sur fond blanc (2.9:1) | Epic 1 |
| **C6** | Echec WCAG critique : text-brand-300 sur badges light (1.8:1) | Epic 1 |
| **I1** | Pas de sidebar/TOC sur les pages longues | Epic 3 |
| **I2** | Pas de coloration syntaxique dans CodeBlock | Epic 2 |
| **I3** | Touch targets sous-dimensionnes (36px) | Epic 4 |
| **I4** | Focus visible non explicite | Epic 1 |
| **I5** | Light mode sous-travaille | Epic 4 |
| **I6** | Texte trop petit (text-sm) dans le body des cards | Epic 4 |
| **I7** | og:image manquante sur toutes les pages | Epic 5 |
| **I8** | Chunk lucide-react surdimensionne (~169 KB) | Epic 6 |
| **N1** | Pas d'animations au scroll | Epic 6 |
| **N2** | Pas de bouton "retour en haut" | Epic 3 |
| **N3** | Temoignages potentiellement fictifs | Epic 17 |
| **N4** | Pas de skip-to-content link | Epic 1 |
| **N5** | Lien GitHub footer pointe vers le mauvais repo | Epic 17 |
| **N6** | Icones Lucide sans aria-hidden="true" | Epic 1 |
| **N7** | Pas de page 404 personnalisee | Epic 17 |
| **N8** | Accents manquants dans le contenu francais | Epic 7 |
| **N9** | Pas de compression Brotli dans Nginx | Epic 6 |
| **N10** | HSTS servi sur HTTP | Epic 6 |
| **N11** | X-XSS-Protection deprecie | Epic 6 |
| **N12** | `<nav>` sans aria-label | Epic 1 |
| **N13** | Groupes de liens du Footer sans `<nav>` | Epic 1 |
| **N14** | PathCard nom accessible trop verbeux | Epic 1 |
| **N15** | Valeurs hex en dur dans globals.css | Epic 4 |
| **N16** | `new Date().getFullYear()` evalue au build | Epic 17 |

### Points de la demande utilisateur couverts

| Section demande | Description | Epic(s) |
|-----------------|-------------|---------|
| **4.1** | Landing page spectaculaire (7 sections) | Epic 8 |
| **4.2** | Getting Started (4 pages) | Epic 9 |
| **4.3** | MCP (6 pages + fiches MCP detaillees) | Epic 10 |
| **4.4** | Plugins (5 pages + fiches plugins) | Epic 11 |
| **4.5** | Skills (4 pages) | Epic 12 |
| **4.6** | Agents & Subagents (5 pages) | Epic 13 |
| **4.7** | Prompting (6 pages + guide CLAUDE.md) | Epic 14 |
| **4.8** | Configurateur interactif (3 pages + logique) | Epic 15 |
| **4.9** | Vision & Futur (3 pages) | Epic 16 |
| **5** | Design & UX (identite, animations, a11y, navigation) | Epics 1, 3, 4, 6, 8 |
| **6** | Docker & deploiement (Nginx, securite, optimisation) | Epic 6 |
| **7** | Contenu & redaction (MDX, ton, structure, maillage) | Epic 7 |
| **8** | SEO technique (sitemap, JSON-LD, OG, breadcrumbs) | Epic 5 |
| **9** | Livrables attendus (~35 pages, configurateur, Docker) | Toutes les Epics |
| **10** | Instructions de travail (build, test, commit) | Epic 18 |

### Verification de couverture

- **Audit** : 6/6 critiques couverts, 8/8 importants couverts, 16/16 nice-to-have couverts = **30/30 (100%)**
- **Demande** : 10/10 sections couvertes, ~35 pages planifiees, configurateur dedie = **100%**
- **Aucun point orphelin** : chaque element de l'audit et de la demande apparait dans au moins une Epic.
