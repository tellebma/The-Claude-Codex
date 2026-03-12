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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
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

- **Statut** : `TERMINÉ`
- **Review** : `APPROUVÉ` ✅ (code review + UX review + content accuracy review)
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

- **Statut** : `DONE`
- **Review** : `REVIEWÉ`
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

- **Statut** : `DONE`
- **Review** : `REVIEWÉ`
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
| 1 | Corrections critiques accessibilite WCAG | P0 | S | 1 | `TERMINÉ` | `REVIEWÉ ✅` | AUDIT |
| 2 | Corrections bugs critiques design system | P0 | S | 1 | `TERMINÉ` | `REVIEWÉ ✅` | AUDIT |
| 3 | Infrastructure navigation multi-pages | P0 | M | 1 | `TERMINÉ` | `REVIEWÉ ✅` | LES DEUX |
| 4 | Amelioration light mode et polish design | P1 | S | 1 | `TERMINÉ` | `REVIEWÉ ✅` | AUDIT |
| 5 | Infrastructure SEO et meta-donnees | P1 | S | 2 | `TERMINÉ` | `REVIEWÉ ✅` | LES DEUX |
| 6 | Optimisation performances et build | P1 | S | 2 | `TERMINÉ` | `REVIEWÉ ✅` | LES DEUX |
| 7 | Correction contenu et migration MDX | P1 | M | 2 | `TERMINÉ` | `REVIEWÉ ✅` | LES DEUX |
| 8 | Refonte landing page | P1 | M | 2 | `TERMINÉ` | `REVIEWÉ ✅` | LES DEUX |
| 9 | Section Getting Started (4 pages) | P2 | M | 3 | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE |
| 10 | Section MCP (6 pages) | P2 | L | 3 | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE |
| 11 | Section Plugins (5 pages) | P2 | M | 3 | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE |
| 12 | Section Skills (4 pages) | P2 | M | 3 | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE |
| 13 | Section Agents & Subagents (5 pages) | P2 | L | 3 | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE |
| 14 | Section Prompting (6 pages) | P2 | M | 3 | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE |
| 15 | Configurateur interactif | P1 | XL | 4 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 16 | Section Vision & Futur (3 pages) | P3 | S | 5 | `TODO` | `NON REVIEWÉ` | DEMANDE |
| 17 | Page 404 et finitions UX | P3 | XS | 5 | `TODO` | `NON REVIEWÉ` | AUDIT |
| 18 | Tests, CI/CD et assurance qualite | P1 | M | Continu | `TODO` | `NON REVIEWÉ` | LES DEUX |

**Progression** : 15/18 terminee (83%) — 15/18 reviewee (83%)

---

## Roadmap en phases

### Phase 1 — Fondations (Semaines 1-3)

**Objectif** : Corriger les fondations cassees, mettre en place l'infrastructure de navigation et le design system corrige.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 1 | Corrections critiques accessibilite WCAG | S | `TERMINÉ` | `REVIEWÉ ✅` |
| 2 | Corrections bugs critiques design system | S | `TERMINÉ` | `REVIEWÉ ✅` |
| 3 | Infrastructure navigation multi-pages | M | `TERMINÉ` | `REVIEWÉ ✅` |
| 4 | Amelioration light mode et polish design | S | `TERMINÉ` | `REVIEWÉ ✅` |

**Parallelisme** : Epics 1 et 2 en parallele (semaine 1). Epic 3 demarre semaine 2 apres 1+2. Epic 4 en parallele de Epic 3.

**Livrable** : Un site avec 6 pages accessibles, un design system fonctionnel, et une infrastructure de navigation prete pour le scaling.

---

### Phase 2 — Infrastructure contenu et SEO (Semaines 4-7)

**Objectif** : Mettre en place le pipeline MDX, l'infrastructure SEO, les optimisations de performance, et refondre la landing page.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 5 | Infrastructure SEO et meta-donnees | S | `TERMINÉ` | `REVIEWÉ ✅` |
| 6 | Optimisation performances et build | S | `TERMINÉ` | `REVIEWÉ ✅` |
| 7 | Correction contenu et migration MDX | M | `TERMINÉ` | `REVIEWÉ ✅` |
| 8 | Refonte landing page | M | `TERMINÉ` | `REVIEWÉ ✅` |

**Parallelisme** : Epics 5 et 6 en parallele (semaine 4-5). Epic 7 demarre semaine 4 (long). Epic 8 demarre semaine 5 apres les corrections visuelles.

**Livrable** : Un site avec pipeline MDX, SEO complet, performances optimisees, et une landing page spectaculaire.

---

### Phase 3 — Contenu editorial (Semaines 8-15)

**Objectif** : Creer les ~30 pages de contenu des 6 sections thematiques.

| Epic | Titre | Estimation | Statut | Review |
|------|-------|------------|--------|--------|
| 9 | Section Getting Started (4 pages) | M | `TERMINÉ` | `REVIEWÉ ✅` |
| 10 | Section MCP (6 pages) | L | `TERMINÉ` | `REVIEWÉ ✅` |
| 11 | Section Plugins (5 pages) | M | `TERMINÉ` | `REVIEWÉ ✅` |
| 12 | Section Skills (4 pages) | M | `TERMINÉ` | `REVIEWÉ ✅` |
| 13 | Section Agents & Subagents (5 pages) | L | `TERMINÉ` | `REVIEWÉ ✅` |
| 14 | Section Prompting (6 pages) | M | `TERMINÉ` | `REVIEWÉ ✅` |

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

---
---

# Epics Persona-Driven — Issues des 6 Audits UX (mars 2026)

> Les epics ci-dessous (19 a 31) sont issues de l'analyse croisee de 6 audits UX par persona :
> - **Novice** (5.5/10) — N'a jamais code, ne connait pas le terminal
> - **Debutant** (5.5/10) — Utilise un ordinateur mais n'a jamais code
> - **Experimente** (6/10) — Developpeur 3-5 ans, connait le terminal et les frameworks
> - **Connaisseur** (5.5/10) — Utilise Claude Code depuis quelques mois, explore l'ecosysteme
> - **Expert** (4.5/10) — Senior/architecte/CTO, veut de la profondeur technique
> - **Entreprise** (3/10) — Decideur evaluant Claude Code pour son organisation
>
> **Problemes transversaux identifies :**
> 1. La section Plugins presente un ecosysteme potentiellement fictif (commandes, chiffres, packages non verifiables)
> 2. La page Prompting est la plus courte du site alors qu'elle devrait etre la plus riche
> 3. Zero capture d'ecran dans tout le site — contenu 100% textuel
> 4. Le contenu avance est quasi-absent (Hooks, Agent SDK, MCP custom, CI/CD, mode headless)
> 5. Le persona Entreprise n'a aucun contenu dedie (compliance, TCO, adoption, gouvernance)
> 6. Aucune differenciation de parcours par niveau — le meme contenu pour tous
> 7. Les exemples sont quasi-exclusivement orientes developpeur, excluant les profils non-techniques promis sur la landing page

---

## Epic 19 — Audit de credibilite et correction des informations fictives

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P0 (bloquant — la credibilite est le capital le plus precieux du site)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Aucune
- **Personas impactees** : Expert (critique), Connaisseur (critique), Experimente (critique)
- **Source Audit** : EXPERT C5, CONNAISSEUR Plugins critiques, EXPERIMENTE C1, tous les audits section Plugins

### Probleme identifie

Les audits Expert, Connaisseur et Experimente convergent sur un meme constat : **la section Plugins presente un ecosysteme qui n'existe pas officiellement** sous la forme decrite. Les commandes `/plugin install`, `/plugin marketplace`, `/plugin publish`, les chiffres d'installations (57K, 71K, 96K), et les noms de packages ne sont pas verifiables. De meme, certains noms de packages MCP (`@anthropic/mcp-figma`, `@anthropic/mcp-gmail`, etc.) pourraient etre incorrects.

Un developpeur qui detecte des informations fausses quitte le site et ne revient pas. La credibilite est le capital le plus precieux d'un site de documentation technique.

### Description

Conduire un audit factuel complet de toutes les informations techniques du site. Verifier chaque nom de package, chaque commande, chaque chiffre. Corriger ou retirer tout ce qui est non verifiable. Etre transparent sur ce qui est reel, en beta, ou anticipe.

### User Stories

1. En tant que developpeur experimente, je veux que chaque nom de package MCP mentionne sur le site soit un vrai package publie sur npm/PyPI afin de pouvoir l'installer sans erreur.
2. En tant que connaisseur Claude Code, je veux que les commandes presentees dans la section Plugins soient des commandes reelles de Claude Code afin de ne pas perdre du temps a essayer des commandes inexistantes.
3. En tant qu'expert/CTO, je veux que les chiffres d'installations soient retires ou sources afin de pouvoir faire confiance au reste du contenu du site.
4. En tant que developpeur, je veux un lien vers le repo GitHub ou la page npm de chaque outil mentionne afin de pouvoir verifier par moi-meme.
5. En tant qu'utilisateur de tout niveau, je veux que le site distingue clairement ce qui existe aujourd'hui de ce qui est a venir ou experimental afin de ne pas etre induit en erreur.

### Taches detaillees

1. **Audit des noms de packages MCP** :
   - Verifier chaque package mentionne (`@anthropic/mcp-figma`, `@anthropic/mcp-slack`, `@anthropic/mcp-gmail`, `@anthropic/mcp-lighthouse`, `@anthropic/mcp-21st-magic`, `@anthropic/mcp-google-calendar`, `@anthropic/mcp-linear`, etc.)
   - Pour chaque package inexistant : trouver le vrai nom ou retirer la reference
   - Ajouter un lien npm/GitHub pour chaque MCP reference

2. **Audit de la section Plugins** :
   - Verifier si les commandes `/plugin install`, `/plugin marketplace`, `/plugin publish`, `/plugin enable`, `/plugin disable`, `/plugin list --updates` existent reellement dans Claude Code
   - Si elles n'existent pas : reecrire la section en clarifiant l'etat reel du systeme de plugins
   - Retirer tous les chiffres d'installations non verifiables (57K, 71K, 96K, 23K, etc.)
   - Verifier si "Everything Claude Code", "Prompt Improver", "Ralph Loop", "UI UX Pro Max", "Frontend Design" sont des projets reels avec des repos GitHub

3. **Audit des configurations JSON** :
   - Verifier que les structures `settings.json` montrees correspondent aux schemas reels de Claude Code
   - Verifier les options de configuration mentionnees

4. **Ajout de sources verifiables** :
   - Ajouter un lien (GitHub, npm, PyPI) pour chaque outil, MCP, ou plugin reference
   - Ajouter un lien vers la documentation officielle Anthropic quand pertinent

5. **Balisage du contenu anticipe** :
   - Creer un callout `<Callout type="warning">` pour les fonctionnalites a venir ou experimentales
   - Distinguer visuellement "Disponible aujourd'hui" vs "A venir" vs "Propose par ce site"

### Criteres d'acceptation

- 100% des noms de packages MCP sont verifies et corrigent : soit un lien npm valide, soit retires
- 100% des commandes de la section Plugins sont verifiees contre la CLI reelle de Claude Code
- Aucun chiffre d'installation non verifiable ne subsiste dans le site
- Chaque MCP et plugin reference a un lien vers sa source (repo, npm, documentation)
- Les fonctionnalites anticipees ou experimentales sont clairement balisees avec un callout dedie
- Le build passe sans erreur apres les corrections

### Fichiers impactes

- `content/plugins/what-are-plugins.mdx`
- `content/plugins/setup.mdx`
- `content/plugins/best-essential.mdx`
- `content/plugins/best-design.mdx`
- `content/plugins/best-security.mdx`
- `content/mcp/best-productivity.mdx`
- `content/mcp/best-development.mdx`
- `content/mcp/best-design.mdx`
- `content/mcp/setup.mdx`
- `content/skills/best-skills.mdx` (verifier les liens de telechargement)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 5.5 (+1) | Section plugins credible |
| Connaisseur | 5.5 → 6.5 (+1) | Informations fiables |
| Experimente | 6 → 7 (+1) | Packages installables |

---

## Epic 20 — Contenu visuel : captures d'ecran, GIFs et videos

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P0 (bloquant — le contenu est 100% textuel, le novice ne peut pas suivre)
- **Estimation** : L (2-4 semaines)
- **Dependances** : Aucune
- **Personas impactees** : Novice (critique), Debutant (critique), Experimente (important)
- **Source Audit** : NOVICE C2, DEBUTANT C1, EXPERIMENTE manque de demos visuelles

### Probleme identifie

Les audits Novice et Debutant identifient l'absence de captures d'ecran comme un probleme critique. Le site est 100% textuel avec des blocs de code. Aucune image, aucun GIF, aucune video ne montre Claude Code en action. C'est comme un manuel de conduite sans aucune photo de voiture.

Pour un novice, ne pas voir a quoi ressemble un terminal, une commande, ou un resultat est un frein absolu. Pour un developpeur experimente, l'absence de demos visuelles empêche d'evaluer l'outil avant de l'installer.

**Reference** : Google Cloud, Stripe, Zapier, Canva — tous utilisent des captures d'ecran annotees, des GIFs, et des videos courtes dans leur documentation.

### Description

Creer un ensemble complet de contenus visuels pour accompagner les pages du site : captures d'ecran annotees pour le Getting Started, GIFs montrant Claude Code en action, et video(s) d'introduction.

### User Stories

1. En tant que novice, je veux voir une capture d'ecran de comment ouvrir un terminal sur macOS/Windows/Linux afin de savoir ou aller.
2. En tant que debutant, je veux voir une capture d'ecran du site nodejs.org avec une fleche sur le bouton a cliquer afin de ne pas me tromper.
3. En tant que novice, je veux voir a quoi ressemble la console Anthropic pour creer une cle API afin de comprendre les etapes.
4. En tant que debutant, je veux voir un GIF de Claude Code lancé pour la premiere fois dans un terminal afin de savoir a quoi m'attendre.
5. En tant que novice, je veux voir le resultat final d'un premier projet (une page web dans un navigateur) afin de comprendre ce que Claude Code produit.
6. En tant que developpeur experimente, je veux voir un GIF de 30 secondes montrant Claude Code en action sur un vrai refactoring afin d'evaluer l'outil rapidement.
7. En tant que visiteur de la landing page, je veux une video d'introduction de 2-3 minutes montrant Claude Code de l'installation au premier resultat afin de comprendre la valeur de l'outil.

### Taches detaillees

1. **Captures d'ecran Getting Started (8 images minimum)** :
   - Ouvrir le terminal sur macOS (Spotlight → Terminal)
   - Ouvrir le terminal sur Windows (PowerShell ou Windows Terminal)
   - Ouvrir le terminal sur Linux (raccourci Ctrl+Alt+T)
   - Le site nodejs.org avec le bouton LTS entoure
   - La console Anthropic (creation de compte, generation de cle API)
   - Le lancement de `claude` pour la premiere fois dans le terminal
   - Le dialogue de confirmation y/n dans Claude Code
   - Le resultat du premier projet dans un navigateur

2. **GIFs demonstratifs (4 GIFs minimum)** :
   - Claude Code lancé et repondant a un premier prompt simple (15 secondes)
   - Claude Code creant un fichier HTML et l'utilisateur l'ouvrant dans le navigateur (30 secondes)
   - Claude Code effectuant un refactoring sur un projet existant (30 secondes)
   - Claude Code utilisant un MCP (GitHub ou Playwright) en action (30 secondes)

3. **Video d'introduction (1 video, 2-3 minutes)** :
   - Script : installation → premier prompt → resultat → iteration → resultat final
   - Hebergement : YouTube embed ou fichier MP4 dans `/public/videos/`
   - Sous-titres en francais

4. **Infrastructure technique** :
   - Creer un repertoire `public/images/screenshots/` organise par section
   - Creer un composant `<Screenshot>` avec lazy loading, alt text, et zoom au clic
   - Optimiser toutes les images en WebP (< 100 KB chacune)
   - Ajouter un composant `<VideoEmbed>` responsive pour la video

5. **Integration dans les pages MDX** :
   - Inserer les captures d'ecran dans `content/getting-started/installation.mdx` (6 images)
   - Inserer les captures d'ecran dans `content/getting-started/first-project.mdx` (2 images + 1 GIF)
   - Inserer le GIF de demo MCP dans `content/mcp/first-workflow.mdx`
   - Inserer la video d'intro sur la landing page ou la page "Qu'est-ce que Claude Code"

### Criteres d'acceptation

- Minimum 8 captures d'ecran annotees dans le Getting Started
- Minimum 4 GIFs demonstratifs (15-30 secondes chacun)
- Minimum 1 video d'introduction (2-3 minutes)
- Toutes les images en WebP, < 100 KB chacune, avec lazy loading
- Composant `<Screenshot>` avec alt text descriptif et zoom au clic
- Composant `<VideoEmbed>` responsive
- Score Lighthouse Performance > 90 malgre les images ajoutees

### Fichiers impactes

- `public/images/screenshots/` (nouveau repertoire, ~15 fichiers)
- `public/videos/` ou embed YouTube
- `src/components/ui/Screenshot.tsx` (nouveau)
- `src/components/ui/VideoEmbed.tsx` (nouveau)
- `content/getting-started/installation.mdx`
- `content/getting-started/first-project.mdx`
- `content/getting-started/what-is-claude-code.mdx`
- `content/mcp/first-workflow.mdx`
- `src/app/page.tsx` ou `content/landing.mdx` (video hero)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Novice | 5.5 → 7 (+1.5) | Peut enfin suivre visuellement |
| Debutant | 5.5 → 7 (+1.5) | Reperes visuels a chaque etape |
| Experimente | 6 → 6.5 (+0.5) | Demo rapide de la valeur |

---

## Epic 21 — Parcours grand debutant et pre-requis zero

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P0 (bloquant — le novice abandonne des la premiere etape)
- **Estimation** : L (2-3 semaines)
- **Dependances** : Epic 20 (captures d'ecran necessaires)
- **Personas impactees** : Novice (critique), Debutant (critique)
- **Source Audit** : NOVICE C1/C3/C4, DEBUTANT C2/C4

### Probleme identifie

Les audits Novice et Debutant convergent : la promesse de la landing page ("en partant de zero", "pour les curieux") n'est pas tenue. Le contenu bascule immediatement dans un registre technique que le novice ne comprend pas. Le terminal, npm, les cles API, les variables d'environnement, .bashrc — aucun de ces concepts n'est explique au niveau zero.

Le point de rupture principal est l'installation : le novice ne sait pas ouvrir un terminal, ne connait pas Node.js, ne comprend pas ce qu'est une cle API.

**Reference** : Apple Swift Playgrounds (guide clic par clic), Duolingo (progression micro-pas), Stripe (mode no-code pour non-devs).

### Description

Creer un "sas d'entree" pour les grands debutants : une page pre-requis, un parcours d'installation simplifie, un glossaire interactif, une FAQ rassurant sur les peurs courantes, et un premier projet ultra-simple.

### User Stories

1. En tant que novice complet, je veux une page "Avant de commencer" qui m'explique ce qu'est un terminal et comment l'ouvrir afin de pouvoir suivre le guide d'installation.
2. En tant que novice, je veux qu'un seul chemin d'installation soit recommande pour moi (sans "OU", sans choix a faire) afin de ne pas etre paralyse par les options.
3. En tant que novice, je veux que chaque terme technique soit defini la premiere fois qu'il apparait (avec un tooltip ou un lien) afin de ne pas me sentir exclu.
4. En tant que novice, je veux un glossaire accessible depuis toutes les pages afin de retrouver la definition d'un terme a tout moment.
5. En tant que novice, je veux une FAQ "Questions de debutant" qui repond a mes peurs (casser mon ordinateur, vie privee, legalite, cout) afin d'etre rassure.
6. En tant que debutant non-technique, je veux un premier projet ultra-simple ("Cree une page qui dit bonjour avec mon prenom") afin de reussir rapidement.
7. En tant que novice, je veux comprendre combien ca coute en termes simples (gratuit pour essayer / 20€ pour un usage regulier / 100€ pour un usage intensif) afin de savoir si c'est dans mon budget.

### Taches detaillees

1. **Page "Pre-requis pour grands debutants"** (`content/getting-started/prerequisites-zero.mdx`) :
   - Qu'est-ce qu'un terminal ? (definition en 2 phrases + analogie)
   - Comment ouvrir un terminal sur macOS (capture d'ecran annotee)
   - Comment ouvrir un terminal sur Windows (capture d'ecran annotee)
   - Comment ouvrir un terminal sur Linux (capture d'ecran annotee)
   - Qu'est-ce qu'une commande ? (taper du texte, appuyer sur Entree, lire le resultat)
   - Qu'est-ce qu'une cle API ? (analogie : un badge d'acces pour un batiment)
   - Qu'est-ce que l'intelligence artificielle ? (2 paragraphes simples)
   - Mini-exercice : "Ouvrez votre terminal et tapez `echo bonjour` — vous devriez voir 'bonjour' s'afficher"

2. **Simplification du parcours d'installation pour novices** :
   - Modifier `content/getting-started/installation.mdx` pour ajouter un systeme d'onglets `<Tabs>` : "Debutant (recommande)" vs "Avance"
   - L'onglet Debutant ne propose qu'UN SEUL chemin : abonnement Claude Max → authentification automatique → `npm install -g @anthropic-ai/claude-code`
   - Chaque etape est accompagnee d'une capture d'ecran
   - Zero choix : pas de "OU", pas de "si vous utilisez X alors Y"
   - La cle API et la configuration manuelle sont dans l'onglet "Avance"

3. **Glossaire interactif** :
   - Creer un fichier `content/glossary.json` avec 40+ termes definis (terminal, CLI, npm, API, API key, JSON, Git, MCP, Skill, Plugin, etc.)
   - Chaque terme a : definition en 1 phrase, analogie concrete, lien vers la page pertinente
   - Creer un composant `<GlossaryTooltip term="terminal">` qui affiche la definition au survol
   - Creer une page `/glossary` accessible depuis le header
   - Integrer les tooltips dans les pages Getting Started

4. **FAQ "Questions de debutant"** (`content/getting-started/faq-beginner.mdx`) :
   - "Est-ce que ca peut casser mon ordinateur ?" → Non, Claude Code ne modifie que les fichiers que vous lui demandez de modifier, et il vous demande toujours confirmation
   - "Est-ce que l'IA voit mes fichiers personnels / photos ?" → Claude Code ne voit que les fichiers du dossier ou vous le lancez
   - "C'est quoi la difference entre ChatGPT et Claude Code ?" → ChatGPT est un chatbot web, Claude Code est un assistant qui travaille directement dans vos fichiers
   - "Est-ce que c'est legal ?" → Oui, c'est un outil professionnel edite par Anthropic
   - "J'ai besoin d'Internet pour l'utiliser ?" → Oui, Claude Code communique avec les serveurs d'Anthropic
   - "Ca marche sur mon Chromebook / tablette / telephone ?" → Claude Code necessite un ordinateur (Mac, Windows ou Linux)
   - "C'est vraiment gratuit ?" → Le guide est gratuit, l'outil coute entre 0 (essai) et 100€/mois
   - "Est-ce que je peux annuler mon abonnement a tout moment ?" → Oui

5. **Simplification du premier projet** :
   - Ajouter un prompt ultra-simple en PREMIER dans `content/getting-started/first-project.mdx` : "Cree-moi une page web qui dit 'Bonjour, je m'appelle [prenom]' avec un fond bleu et un texte blanc"
   - Ajouter une capture d'ecran du resultat attendu
   - L'instruction pour ouvrir le fichier est "Glissez le fichier dans votre navigateur" (pas de commande `open`/`xdg-open`)
   - Le portfolio actuel devient le "Deuxieme projet" pour ceux qui veulent aller plus loin

6. **Presentation des couts claire et visible** :
   - Creer un composant `<PricingTable>` simple avec 3 colonnes : Essai gratuit / Usage regulier / Usage intensif
   - Integrer ce tableau dans la page d'installation et sur la landing page
   - Chaque option a un conseil clair : "Recommande pour commencer" sur l'option la plus simple

### Criteres d'acceptation

- Page "Pre-requis zero" complete avec captures d'ecran pour 3 OS
- L'onglet "Debutant" de la page d'installation propose un seul chemin sans choix
- Glossaire de 40+ termes avec composant tooltip fonctionnel
- Page glossaire accessible depuis le header
- FAQ de 8+ questions/reponses rassurant le novice
- Premier projet ultra-simple en premiere position sur la page
- Tableau de prix clair et visible
- Parcours novice testable de bout en bout sans jargon non defini

### Fichiers impactes

- `content/getting-started/prerequisites-zero.mdx` (nouveau)
- `content/getting-started/installation.mdx` (modification : ajout onglets)
- `content/getting-started/first-project.mdx` (modification : premier projet simplifie)
- `content/getting-started/faq-beginner.mdx` (nouveau)
- `content/glossary.json` (nouveau)
- `src/components/ui/GlossaryTooltip.tsx` (nouveau)
- `src/components/ui/PricingTable.tsx` (nouveau)
- `src/app/glossary/page.tsx` (nouveau)
- `src/components/layout/Header.tsx` (ajout lien glossaire)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Novice | 5.5 → 7.5 (+2) | Peut enfin suivre le parcours de A a Z |
| Debutant | 5.5 → 7 (+1.5) | Installation simplifiee, termes definis |

---

## Epic 22 — Refonte majeure de la section Prompting

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P0 (bloquant — la page la plus attendue est la plus vide)
- **Estimation** : L (2-4 semaines)
- **Dependances** : Epic 7 (pipeline MDX)
- **Personas impactees** : Toutes (critique pour Novice, Debutant, Expert, Connaisseur ; important pour Experimente)
- **Source Audit** : NOVICE C5, DEBUTANT I1/I5, EXPERIMENTE C2, CONNAISSEUR Prompting critiques, EXPERT C3

### Probleme identifie

TOUS les audits convergent : la page Prompting est la plus decevante du site. C'est la page la plus courte (~97 lignes MDX) alors qu'elle devrait etre la plus riche. Les 5 principes sont des banalites. Le prompt chaining et l'orchestration multi-agents sont mentionnes en 2 phrases sans aucun exemple. Il n'y a pas de techniques avancees specifiques a Claude Code, pas de patterns par use case, pas d'exemples non-techniques.

**Reference** : Anthropic Prompt Engineering Guide, Vercel AI SDK docs, Langchain prompting docs.

### Description

Transformer la section Prompting d'une page unique squelettique en une section complete de 4-6 pages couvrant tous les niveaux : fondamentaux, patterns par use case, techniques avancees, gestion du contexte, et prompting pour non-developpeurs.

### User Stories

1. En tant que novice, je veux des exemples de prompts pour des taches du quotidien (email, resume, tableau) afin d'apprendre a communiquer avec Claude Code.
2. En tant que debutant, je veux des templates de prompts par categorie (communication, analyse, creation) que je peux copier-coller et adapter.
3. En tant que developpeur experimente, je veux des patterns de prompts specifiques par use case (debug, refactoring, tests, migration, code review) afin d'optimiser mon workflow.
4. En tant que connaisseur, je veux comprendre comment fonctionne la fenetre de contexte, quand utiliser /compact, et comment structurer des sessions longues.
5. En tant que connaisseur, je veux un guide complet sur l'extended thinking et le plan mode afin de savoir quand et comment les activer.
6. En tant qu'expert, je veux un guide sur le prompt chaining avec 3-5 exemples concrets et fonctionnels afin de construire des workflows complexes.
7. En tant qu'expert, je veux un guide sur l'orchestration multi-agents avec des architectures et des patterns reels afin de maximiser la puissance de Claude Code.
8. En tant que developpeur, je veux connaitre les anti-patterns specifiques a Claude Code (vs ChatGPT, vs Copilot) afin d'eviter les erreurs courantes.
9. En tant que developpeur, je veux connaitre les differences de prompting entre les modeles (Haiku, Sonnet, Opus) afin de choisir le bon modele pour chaque tache.

### Taches detaillees

1. **Page 1 : Fondamentaux du prompting** (refonte de `content/prompting-guide.mdx`) :
   - Garder les 5 principes mais les enrichir avec 3 exemples concrets chacun
   - Ajouter 10+ exemples avant/apres par profil :
     - Developpeur : refactoring, debug, tests, review
     - Entrepreneur : email, rapport, prototype, analyse de marche
     - Etudiant : resume, explication, traduction, recherche
     - Creatif : contenu, design, brainstorming, storytelling
   - Ajouter un tableau d'erreurs courantes etendu (15+ erreurs)
   - Corriger les accents manquants

2. **Page 2 : Prompting avance — Patterns par use case** (`content/prompting/advanced-patterns.mdx`, nouveau) :
   - Pattern debugging : reproduction → isolation → fix → regression test
   - Pattern refactoring : analyse d'impact → migration progressive → validation
   - Pattern code review : structure → logique → securite → performance
   - Pattern migration : inventaire → plan → execution → verification
   - Pattern tests : identification des cas → ecriture TDD → couverture → mutation
   - Chaque pattern a un exemple complet avec le prompt reel et le resultat attendu

3. **Page 3 : Gestion du contexte et sessions longues** (`content/prompting/context-management.mdx`, nouveau) :
   - Comment fonctionne la fenetre de contexte (200K tokens)
   - Quand et comment utiliser `/compact`
   - Strategies pour les gros projets (decouper en sessions, cibler des fichiers)
   - Impact du nombre de fichiers lus sur la qualite des reponses
   - Le systeme de CLAUDE.md comme "memoire persistante"
   - Bonnes pratiques pour les conversations longues
   - Metriques : utiliser `/cost` pour suivre sa consommation

4. **Page 4 : Extended thinking, plan mode et techniques avancees** (`content/prompting/thinking-and-planning.mdx`, nouveau) :
   - Qu'est-ce que l'extended thinking ? Comment et quand l'activer ?
   - Qu'est-ce que le plan mode ? Quand l'utiliser vs le mode par defaut ?
   - Chain-of-thought dans les prompts
   - Self-reflection et critique rounds
   - Constraint-setting pour eviter les hallucinations
   - Structured output forcing (demander un format precis)
   - Differences de comportement entre Haiku, Sonnet et Opus
   - Impact sur les couts et la latence

5. **Page 5 : Prompt chaining et orchestration multi-agents** (`content/prompting/chaining-and-agents.mdx`, nouveau) :
   - Prompt chaining : decomposer une tache complexe en sequence de prompts
   - 3 exemples complets de chaining :
     - Feature complete : spec → implementation → tests → documentation
     - Bug investigation : logs → reproduction → isolation → fix → regression
     - Migration : inventaire → plan → execution par module → verification globale
   - Orchestration multi-agents : utiliser le Task tool pour paralleliser
   - Architectures : fan-out/fan-in, pipeline sequentiel, multi-perspective
   - Exemples de configuration d'agents dans `~/.claude/agents/`
   - Limites : cout en tokens, profondeur de recursion, gestion des erreurs

6. **Page 6 (optionnelle) : Prompting pour non-developpeurs** (`content/prompting/non-dev-prompting.mdx`, nouveau) :
   - 20+ templates de prompts par categorie :
     - Communication : email professionnel, relance client, annonce interne
     - Analyse : resume de document, extraction de donnees, comparaison
     - Creation : post LinkedIn, article de blog, presentation
     - Organisation : planning, todo list, compte-rendu de reunion
   - Chaque template est un bloc copiable avec des placeholders a remplir
   - Exercices pratiques : "Essayez ce prompt et comparez avec notre resultat"

### Criteres d'acceptation

- Minimum 4 nouvelles pages MDX dans la section Prompting (en plus de la page existante refondee)
- 50+ exemples de prompts concrets et realistes au total
- 10+ exemples non-techniques (email, rapport, resume, etc.)
- Chaque technique avancee a au minimum 1 exemple concret avec prompt reel et resultat
- Les differences entre modeles (Haiku/Sonnet/Opus) sont documentees
- L'extended thinking et le plan mode sont documentes avec cas d'usage
- Tous les accents francais sont presents
- Navigation laterale entre les pages de la section
- Chaque page a : title, meta description, breadcrumbs

### Fichiers impactes

- `content/prompting-guide.mdx` (refonte majeure)
- `content/prompting/advanced-patterns.mdx` (nouveau)
- `content/prompting/context-management.mdx` (nouveau)
- `content/prompting/thinking-and-planning.mdx` (nouveau)
- `content/prompting/chaining-and-agents.mdx` (nouveau)
- `content/prompting/non-dev-prompting.mdx` (nouveau, optionnel)
- Navigation sidebar de la section Prompting

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Novice | 5.5 → 6.5 (+1) | Templates non-techniques disponibles |
| Debutant | 5.5 → 7 (+1.5) | Exemples adaptes, exercices pratiques |
| Experimente | 6 → 7.5 (+1.5) | Patterns par use case avances |
| Connaisseur | 5.5 → 7 (+1.5) | Context management, thinking, chaining |
| Expert | 4.5 → 6 (+1.5) | Multi-agents, techniques avancees |

---

## Epic 23 — Documentation de reference technique complete

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P1 (haute — l'expert n'a rien a bookmarker)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Aucune
- **Personas impactees** : Expert (critique), Connaisseur (critique), Experimente (important)
- **Source Audit** : EXPERT C3, CONNAISSEUR Configuration avancee, EXPERIMENTE Quick Reference

### Probleme identifie

Le site est un guide/tutoriel mais pas une documentation de reference. Il n'existe aucune page avec la liste complete des commandes, flags, variables d'environnement et options de configuration. Un developpeur experimente ou expert veut une reference exhaustive qu'il peut bookmarker — comme Stripe Docs ou Vercel Docs.

### Description

Creer une section "Reference" avec une cheatsheet, une reference CLI complete, une reference settings.json complete, et une page de variables d'environnement.

### User Stories

1. En tant que developpeur, je veux une cheatsheet sur une seule page avec toutes les commandes, slash commands, et raccourcis clavier afin de l'avoir sous la main.
2. En tant qu'expert, je veux la reference complete de la CLI (`claude --help`, tous les flags et sous-commandes) afin de connaitre toutes les options disponibles.
3. En tant que connaisseur, je veux la reference complete de `settings.json` (toutes les options, pas juste un exemple) afin de configurer finement mon environnement.
4. En tant qu'expert, je veux la liste de toutes les variables d'environnement reconnues par Claude Code afin d'automatiser ma configuration.
5. En tant que developpeur, je veux la liste de toutes les slash commands avec leurs parametres afin de connaitre toutes les capacites interactives.

### Taches detaillees

1. **Page Quick Reference / Cheatsheet** (`content/reference/cheatsheet.mdx`, nouveau) :
   - Toutes les slash commands (`/help`, `/clear`, `/compact`, `/cost`, `/doctor`, `/init`, `/review`, `/memory`, etc.) avec description courte
   - Tous les raccourcis clavier (Escape, Ctrl+C, Ctrl+D, Option+T, etc.)
   - Structure des fichiers de configuration (ou sont settings.json, CLAUDE.md, .claude/)
   - Les 3 modes d'execution (interactif, print, headless)
   - Les commandes de gestion MCP (`claude mcp add`, `claude mcp list`, etc.)
   - Format : tableau dense, copiable, imprimable

2. **Reference CLI complete** (`content/reference/cli.mdx`, nouveau) :
   - `claude` (mode interactif) : tous les flags (`--model`, `--print`, `--output-format`, `--dangerously-skip-permissions`, `--continue`, `--resume`, etc.)
   - `claude config` : sous-commandes et options
   - `claude mcp` : `add`, `remove`, `list`, `logs` avec tous les flags
   - `claude doctor` : diagnostics disponibles
   - Format de sortie JSON (`--output-format json`)
   - Mode pipe (`echo "prompt" | claude --print`)
   - Mode headless pour CI/CD

3. **Reference settings.json complete** (`content/reference/settings.mdx`, nouveau) :
   - Toutes les options : `model`, `apiProvider`, `customApiUrl`, `maxTokens`, `thinking`, `permissions` (allow/deny), `allowedTools`, `disabledTools`, `env`, `mcpServers`, etc.
   - Les 3 niveaux : global (`~/.claude/settings.json`), utilisateur (`~/.claude/settings.local.json`), projet (`.claude/settings.json`)
   - Precedence des niveaux
   - Exemples pour chaque option
   - Schema JSON si disponible

4. **Reference variables d'environnement** (`content/reference/environment.mdx`, nouveau) :
   - `ANTHROPIC_API_KEY`
   - `CLAUDE_MODEL`
   - `MAX_THINKING_TOKENS`
   - `DISABLE_AUTOUPDATER`
   - `ANTHROPIC_BASE_URL`
   - Variables proxy (`HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`)
   - Variables de diagnostic/debug
   - Pour chaque variable : nom, description, valeur par defaut, exemple

### Criteres d'acceptation

- 4 pages de reference completes et a jour
- Cheatsheet tenant sur une seule page (dense, format tableau)
- Reference CLI avec chaque flag et sous-commande documente
- Reference settings.json avec chaque option documentee
- Reference variables d'environnement complete
- Toutes les informations sont verifiees contre la derniere version de Claude Code
- Les pages sont navigables via des ancres et un sommaire lateral

### Fichiers impactes

- `content/reference/cheatsheet.mdx` (nouveau)
- `content/reference/cli.mdx` (nouveau)
- `content/reference/settings.mdx` (nouveau)
- `content/reference/environment.mdx` (nouveau)
- `src/app/reference/[slug]/page.tsx` (nouveau)
- `src/app/reference/layout.tsx` (nouveau)
- Header navigation (ajout section "Reference")

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 6 (+1.5) | Reference bookmarkable |
| Connaisseur | 5.5 → 7 (+1.5) | Configuration avancee documentee |
| Experimente | 6 → 7 (+1) | Cheatsheet disponible |

---

## Epic 24 — Hooks, mode headless et integration CI/CD

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P1 (haute — sujet #2 pour experts, totalement absent)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Aucune
- **Personas impactees** : Expert (critique), Connaisseur (critique)
- **Source Audit** : EXPERT C2 (Hooks), EXPERT I2 (CI/CD), CONNAISSEUR Hooks critiques

### Probleme identifie

Les audits Expert et Connaisseur identifient l'absence totale de documentation sur les Hooks (PreToolUse, PostToolUse, Stop) et le mode headless/CI/CD comme une lacune redhibitoire. Ce sont des fonctionnalites avancees cles que tout expert et connaisseur recherche. Le mode headless est un cas d'usage majeur pour les equipes DevOps.

### Description

Creer le contenu documentant les Hooks de Claude Code, le mode headless/non-interactif, et l'integration dans les pipelines CI/CD.

### User Stories

1. En tant qu'expert, je veux comprendre le systeme de hooks (PreToolUse, PostToolUse, Stop) afin d'automatiser des actions quand Claude Code utilise ses outils.
2. En tant qu'expert, je veux des exemples concrets de hooks custom (auto-format, auto-lint, notification Slack) afin de les adapter a mon workflow.
3. En tant que DevOps, je veux savoir comment executer Claude Code dans GitHub Actions afin d'automatiser mes reviews de code et mes tests.
4. En tant que connaisseur, je veux comprendre le mode `--print` et le piping afin d'integrer Claude Code dans mes scripts shell.
5. En tant qu'expert, je veux savoir comment utiliser Claude Code en mode headless pour des taches automatisees afin de l'integrer dans mon infrastructure.
6. En tant qu'architecte, je veux savoir comment configurer Claude Code avec differents providers (Bedrock, Vertex AI, proxy) afin de l'utiliser dans mon environnement d'entreprise.

### Taches detaillees

1. **Page Hooks** (`content/advanced/hooks.mdx`, nouveau) :
   - Qu'est-ce qu'un hook ? (PreToolUse, PostToolUse, Stop)
   - Comment configurer un hook dans `settings.json`
   - Exemples concrets :
     - PreToolUse : validation des parametres avant une commande shell
     - PostToolUse : auto-format avec prettier apres chaque edit
     - PostToolUse : notification Slack quand un commit est cree
     - Stop : generation d'un rapport de session
   - Patterns avances : hooks conditionnels, hooks chaînes
   - Troubleshooting : debugging des hooks qui echouent

2. **Page Mode Headless et CI/CD** (`content/advanced/headless-ci.mdx`, nouveau) :
   - Mode `--print` / `-p` : usage basique, piping, scripts
   - Mode headless non-interactif : `--dangerously-skip-permissions` (avec avertissement securite)
   - Format de sortie JSON (`--output-format json`) pour parsing automatise
   - Integration GitHub Actions :
     - Exemple de workflow YAML complet
     - Review automatique de PR
     - Generation de tests automatique
     - Audit de securite automatique
   - Integration GitLab CI : exemple basique
   - Pre-commit hooks avec Claude Code
   - Bonnes pratiques securite pour le mode headless

3. **Page Multi-provider et configuration enterprise** (`content/advanced/multi-provider.mdx`, nouveau) :
   - Utiliser Claude Code avec AWS Bedrock
   - Utiliser Claude Code avec Google Vertex AI
   - Configurer un proxy OpenAI-compatible
   - Changer de modele par tache (Haiku pour les requetes simples, Opus pour les decisions complexes)
   - Configuration de `customApiUrl` et `apiProvider`
   - Gestion des credentials par provider

### Criteres d'acceptation

- 3 pages de contenu avance completes
- Minimum 4 exemples concrets de hooks fonctionnels
- Minimum 1 workflow GitHub Actions complet et testable
- Le mode headless et le piping sont documentes avec exemples
- La configuration multi-provider est documentee
- Tous les avertissements de securite necessaires sont presents
- Le contenu est verifie contre la version actuelle de Claude Code

### Fichiers impactes

- `content/advanced/hooks.mdx` (nouveau)
- `content/advanced/headless-ci.mdx` (nouveau)
- `content/advanced/multi-provider.mdx` (nouveau)
- `src/app/advanced/[slug]/page.tsx` (nouveau)
- `src/app/advanced/layout.tsx` (nouveau)
- Header navigation (ajout section "Avance")

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 6.5 (+2) | Hooks et CI/CD documentes |
| Connaisseur | 5.5 → 7 (+1.5) | Mode avance accessible |

---

## Epic 25 — Creation de MCP custom (tutoriel complet)

- **Statut** : `DONE`
- **Review** : `REVIEWÉ`
- **Priorite** : P1 (haute — sujet #1 pour connaisseurs et experts, totalement absent)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 19 (corrections de credibilite MCP)
- **Personas impactees** : Expert (critique), Connaisseur (critique)
- **Source Audit** : CONNAISSEUR MCP critiques #1, EXPERT C1

### Probleme identifie

Les audits Connaisseur et Expert convergent : l'absence de tutoriel pour creer un MCP Server custom est la lacune #1 pour les utilisateurs avances. Le site explique comment consommer des MCP mais jamais comment en creer un. Un architecte ou CTO qui veut connecter un outil interne proprietaire n'a aucune information.

### Description

Creer un tutoriel complet de creation de MCP Server, de la specification au deploiement, avec le SDK TypeScript et Python. Documenter les transports alternatifs (SSE, HTTP) et les patterns avances.

### User Stories

1. En tant que connaisseur, je veux un tutoriel pas a pas pour creer un MCP Server en TypeScript afin de connecter mes outils internes a Claude Code.
2. En tant qu'expert, je veux un tutoriel pour creer un MCP Server en Python afin de l'integrer dans mon ecosysteme Python.
3. En tant qu'architecte, je veux comprendre les transports alternatifs (SSE, Streamable HTTP) afin de deployer des MCP distants en production.
4. En tant qu'expert, je veux comprendre le protocole MCP en profondeur (types de messages, lifecycle, capabilities) afin de creer des MCP complexes.
5. En tant que connaisseur, je veux connaitre les limites et gotchas de chaque MCP (quotas, latence, timeouts) afin de debugger efficacement.

### Taches detaillees

1. **Page "Creer un MCP Server — TypeScript"** (`content/mcp/create-mcp-typescript.mdx`, nouveau) :
   - Prerequis : Node.js, npm, SDK `@modelcontextprotocol/sdk`
   - Scaffolding du projet (structure de fichiers recommandee)
   - Definition des Tools (nom, description, schema de parametres, handler)
   - Definition des Resources (URIs, templates, contenu)
   - Definition des Prompts (templates reutilisables)
   - Lifecycle : `initialize`, `shutdown`
   - Test local : comment tester un MCP avant de l'utiliser
   - Integration dans Claude Code : configuration JSON
   - Publication sur npm (optionnel)
   - Exemple complet : un MCP "meteo" qui retourne la meteo d'une ville

2. **Page "Creer un MCP Server — Python"** (`content/mcp/create-mcp-python.mdx`, nouveau) :
   - Prerequis : Python 3.10+, pip, SDK `mcp`
   - Scaffolding avec le SDK Python
   - Definition des Tools, Resources, Prompts en Python
   - Test avec `uvx`
   - Exemple complet : un MCP "base de donnees interne" qui requête une API REST

3. **Page "MCP avance — Protocole et transports"** (`content/mcp/advanced-protocol.mdx`, nouveau) :
   - Specification du protocole JSON-RPC 2.0 : types de requêtes (`tools/list`, `tools/call`, `resources/list`, `prompts/list`)
   - Capabilities negotiation : comment le client et le serveur se mettent d'accord
   - Transport stdio (par defaut) : fonctionnement, limites
   - Transport SSE (Server-Sent Events) : quand et comment l'utiliser
   - Transport Streamable HTTP : le nouveau standard pour les MCP distants
   - Sampling : quand le MCP server demande au LLM de completer
   - Performance : impact des MCP sur la latence, gestion des timeouts
   - Securite avancee : sandboxing, audit logs, token rotation
   - Debugging : inspection des messages JSON-RPC, logging verbeux

4. **Enrichissement de la page MCP existante** :
   - Ajouter les limites et gotchas de chaque MCP documente (quotas API, latence, cas de panne)
   - Ajouter un lien vers le registre MCP communautaire (smithery.ai ou equivalent)
   - Ajouter des criteres de selection pour evaluer un MCP tiers (maintenance, securite, performance)

### Criteres d'acceptation

- Tutoriel TypeScript avec code complet et fonctionnel
- Tutoriel Python avec code complet et fonctionnel
- Page protocole avance avec les 3 transports documentes
- Chaque MCP existant dans le site a ses limites/gotchas documentees
- Lien vers le registre MCP communautaire
- Le code est testable (repository de demo ou blocs copiables)

### Fichiers impactes

- `content/mcp/create-mcp-typescript.mdx` (nouveau)
- `content/mcp/create-mcp-python.mdx` (nouveau)
- `content/mcp/advanced-protocol.mdx` (nouveau)
- `content/mcp/best-productivity.mdx` (enrichissement)
- `content/mcp/best-development.mdx` (enrichissement)
- `content/mcp/best-design.mdx` (enrichissement)
- Navigation sidebar MCP (ajout des nouvelles pages)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 6 (+1.5) | Peut creer ses propres MCP |
| Connaisseur | 5.5 → 7.5 (+2) | Tutoriel avance #1 disponible |

---

## Epic 26 — Parcours differencies et navigation par persona

- **Statut** : `TODO`
- **Review** : `NON REVIEWE`
- **Priorite** : P1 (haute — tous les audits identifient l'absence de differenciation)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 21 (contenu debutant), Epic 22 (contenu prompting)
- **Personas impactees** : Toutes
- **Source Audit** : NOVICE I1, DEBUTANT C4/I3, EXPERIMENTE I1, tous les audits

### Probleme identifie

Tous les audits pointent le meme probleme : le site propose le meme contenu pour tous les niveaux. Un novice est submerge par les pages MCP/Skills/Plugins, un expert s'ennuie avec le Getting Started. La landing page propose 3 niveaux (Debutant/Intermediaire/Avance) mais le contenu ne suit pas cette differenciation.

**Reference** : Apple Developer (contenus par niveau), HashiCorp Learn (labels explicites beginner/advanced), Kubernetes docs (labels sur chaque page).

### Description

Implementer un systeme de parcours differencies par persona avec des badges de niveau sur chaque page, un filtrage optionnel par niveau, un "Fast Track" pour les devs experimentes, et un parcours dedie "zero technique" pour les non-developpeurs.

### User Stories

1. En tant que visiteur, je veux voir un badge de niveau (Debutant/Intermediaire/Avance) sur chaque page afin de savoir immediatement si le contenu est pour moi.
2. En tant que developpeur experimente, je veux un parcours "Fast Track" en 60 secondes (installation → configuration → premier prompt avance) afin de ne pas perdre de temps avec les bases.
3. En tant que novice non-technique, je veux un parcours dedie "Je n'ai jamais code" qui filtre le contenu et ne montre que les pages pertinentes pour moi.
4. En tant qu'entrepreneur, je veux un parcours dedie "Je veux automatiser mes taches" avec des cas d'usage business afin de savoir comment Claude Code peut m'aider.
5. En tant que visiteur de la landing page, je veux que les 3 parcours (Debutant/Intermediaire/Avance) pointent vers du contenu reel et adapte.
6. En tant qu'utilisateur, je veux un indicateur de progression dans mon parcours (etape 2/4, 50% complete) afin de savoir ou j'en suis.
7. En tant qu'utilisateur avance, je veux un CTA alternatif sur la landing page ("Allez plus loin" ou "Quoi de neuf") afin de ne pas etre redirige vers le contenu debutant.

### Taches detaillees

1. **Systeme de badges de niveau** :
   - Creer un composant `<LevelBadge level="debutant|intermediaire|avance">` affiche en haut de chaque page
   - Chaque fichier MDX a un champ frontmatter `level: debutant | intermediaire | avance`
   - Les badges ont des couleurs distinctes (vert/jaune/rouge ou similaire)
   - La sidebar affiche le badge a cote du titre de chaque page

2. **Parcours "Fast Track" pour devs experimentes** (`content/getting-started/fast-track.mdx`, nouveau) :
   - Tout sur une seule page, en 60 secondes :
   - `npm install -g @anthropic-ai/claude-code && claude` — et c'est parti
   - Table des slash commands essentielles
   - Liens directs vers : MCP, Skills, Prompting avance, Reference CLI
   - Pas d'analogie, pas de pedagogie, juste les faits
   - Un seul prompt d'exemple avance (refactoring d'un module existant)

3. **Parcours "Zero technique"** :
   - Definir la liste des pages du parcours novice : Pre-requis → Installation simplifiee → Premier projet simple → Prompting non-dev → FAQ
   - Creer un composant `<PathGuide>` qui affiche les etapes du parcours avec progression
   - Filtrer les pages avancees de ce parcours (pas de MCP setup, pas de Skills creation, pas de Plugins)
   - Ajouter des callouts "Si vous debutez, passez directement a [page suivante]" en haut des pages avancees

4. **Parcours "Entrepreneur / Business"** :
   - Definir la liste des pages : Qu'est-ce que Claude Code → Installation → Prompting non-dev → Cas d'usage business → Couts
   - Exemples specifiques : automatiser des rapports, creer un prototype, analyser des donnees

5. **Refonte de la section Parcours sur la landing page** :
   - Le parcours "Debutant" pointe vers le parcours zero technique
   - Le parcours "Intermediaire" pointe vers le Getting Started standard → MCP → Skills
   - Le parcours "Avance" pointe vers le Fast Track → Prompting avance → Hooks → MCP custom → Agents
   - Ajouter un 4eme parcours "Entreprise" (pointant vers l'Epic 27)
   - CTA secondaire : remplacer "Decouvrir les MCP" par "Voir un exemple en 2 minutes" ou "Fast Track pour devs"

6. **Indicateur de progression** :
   - Creer un composant `<ProgressBar>` affiche en haut de chaque page du parcours
   - Progression basee sur les pages visitees (localStorage)
   - Affichage : "Etape 2/4 — Installation" avec barre de progression

### Criteres d'acceptation

- Badge de niveau visible sur chaque page du site
- Page Fast Track fonctionnelle avec installation en 60 secondes
- Parcours zero technique identifie et guide
- Parcours entrepreneur/business identifie
- Landing page avec 4 parcours fonctionnels pointant vers du contenu reel
- CTA secondaire accessible remplacant "Decouvrir les MCP"
- Indicateur de progression fonctionnel (localStorage)

### Fichiers impactes

- `src/components/ui/LevelBadge.tsx` (nouveau)
- `src/components/ui/PathGuide.tsx` (nouveau)
- `src/components/ui/ProgressBar.tsx` (nouveau)
- `content/getting-started/fast-track.mdx` (nouveau)
- Tous les fichiers MDX (ajout frontmatter `level`)
- `src/app/page.tsx` (refonte section parcours et CTA)
- `src/components/layout/SectionSidebar.tsx` (ajout badges)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Novice | 5.5 → 7 (+1.5) | Parcours dedie, pages filtrees |
| Debutant | 5.5 → 7 (+1.5) | Parcours guide, badges de niveau |
| Experimente | 6 → 7.5 (+1.5) | Fast Track, contenu cible |
| Connaisseur | 5.5 → 6.5 (+1) | Navigation par niveau |
| Expert | 4.5 → 5.5 (+1) | Fast Track, plus de bruit |
| Entreprise | 3 → 4 (+1) | Parcours dedie visible |

---

## Epic 27 — Section Enterprise complete

- **Statut** : `DONE`
- **Review** : `REVIEWÉ`
- **Priorite** : P1 (haute — score 3/10, le segment le plus faible)
- **Estimation** : L (2-4 semaines)
- **Dependances** : Aucune (peut commencer immediatement)
- **Personas impactees** : Entreprise (critique)
- **Source Audit** : ENTREPRISE CR1-CR5, IM1-IM7, NH1-NH10

### Probleme identifie

L'audit Entreprise revele un score de 3/10 — le plus bas de tous les personas. Le site ne repond a aucune des questions qu'un decideur se pose : ROI, securite, compliance, TCO, plan d'adoption, temoignages entreprise, comparaison concurrentielle, support. Un CTO qui ne trouve pas de page "Enterprise" en 5 secondes quitte le site.

**Reference** : GitHub Enterprise, Atlassian Enterprise, Vercel Enterprise, Datadog Enterprise — tous ont une page Enterprise prominente avec securite, compliance, temoignages, pricing, et CTA contact.

### Description

Creer une section Enterprise complete avec une page d'accueil, une page securite/compliance, un guide d'adoption d'equipe, un calculateur de TCO, une FAQ enterprise, et un guide de gouvernance.

### User Stories

1. En tant que CTO, je veux une page "Enterprise" accessible depuis le header principal afin de trouver les informations adaptees a mon besoin en 1 clic.
2. En tant que RSSI/DPO, je veux une page securite et compliance (RGPD, AI Act, donnees, retention) afin de valider la conformite avant deploiement.
3. En tant que VP Engineering, je veux un guide d'adoption d'equipe structure en phases (pilote → deploiement → optimisation) afin de planifier le rollout.
4. En tant que CFO, je veux un calculateur de TCO montrant le cout pour 10, 50, 200 developpeurs afin de construire un business case.
5. En tant que decideur, je veux des temoignages ou case studies d'entreprises utilisant Claude Code afin d'avoir de la preuve sociale.
6. En tant que Engineering Manager, je veux un guide de gouvernance (roles, permissions, secrets, audit) afin de controler le deploiement.
7. En tant que decideur, je veux une comparaison enterprise (vs Copilot Enterprise, vs Cursor Business) sur des criteres organisationnels afin de choisir la meilleure option.
8. En tant que decideur, je veux une FAQ enterprise repondant aux 10 questions les plus courantes afin d'anticiper les objections.
9. En tant que Tech Lead, je veux un template de "business case" telechargeable afin de presenter le projet a ma hierarchie.
10. En tant que manager, je veux un guide "convaincre sa hierarchie" avec les arguments par interlocuteur (CFO, RSSI, DRH, CEO) afin de preparer mes presentations.

### Taches detaillees

1. **Page Enterprise principale** (`content/enterprise/index.mdx`, nouveau) :
   - Hero : "Claude Code pour votre organisation"
   - 4 piliers : Productivite, Securite, Gouvernance, Adoption
   - Chiffres cles : metriques de productivite (citer etudes GitHub/McKinsey)
   - CTA : "Contactez Anthropic pour un plan Enterprise" + "Commencer un pilote"
   - Section temoignages enterprise (scenarios realistes si pas de vrais temoignages, clairement identifies)
   - Ajouter un lien "Entreprise" ou "Pour les equipes" dans le header principal

2. **Page Securite & Compliance** (`content/enterprise/security-compliance.mdx`, nouveau) :
   - Ou sont traitees les donnees ? (renvoi vers Anthropic)
   - Quelles donnees sont envoyees a l'API Anthropic ? (le code source, les prompts, les resultats)
   - Politique de retention des donnees d'Anthropic
   - RGPD : base legale, droits, DPA, renvoi vers Anthropic Trust Center
   - AI Act europeen : classification du risque pour un assistant de code
   - Protection des secrets : comment empecher l'envoi de secrets (.env, credentials) via la deny list
   - Audit trail : quelles actions sont tracees par Claude Code
   - Certifications Anthropic : SOC 2, etc. (avec liens officiels)
   - Bonnes pratiques de securite pour les equipes

3. **Guide d'adoption d'equipe** (`content/enterprise/team-adoption.mdx`, nouveau) :
   - Phase 1 — Preparation (1 semaine) :
     - Identifier 3-5 champions early adopters
     - Definir les objectifs du pilote (metriques de succes)
     - Choisir le plan (Max par developpeur ou API Team)
     - Preparer la configuration de base (CLAUDE.md d'equipe, deny list, Skills partages)
   - Phase 2 — Pilote (4-6 semaines) :
     - Deployer sur l'equipe pilote (5-10 devs)
     - Sessions de formation hebdomadaires (30 min)
     - Tracking des metriques (temps de review, commits, satisfaction)
     - Retrospective a mi-parcours
   - Phase 3 — Deploiement (2-4 semaines) :
     - Etendre par cohortes (10-20 devs par vague)
     - Onboarding standardise (Skill d'onboarding, CLAUDE.md de reference)
     - Documentation interne (wiki, FAQ)
   - Phase 4 — Optimisation (continu) :
     - Skills d'equipe partages et versiones
     - Centre d'excellence IA interne
     - Benchmarking mensuel
     - Retours communautaires internes
   - Change management :
     - Comment convaincre les sceptiques
     - Gerer la peur du remplacement
     - Templates de communication interne

4. **Calculateur de TCO** (`content/enterprise/tco-calculator.mdx` + composant interactif) :
   - Tableau statique ou outil interactif
   - Inputs : nombre de devs, plan choisi (Max/API), heures d'utilisation estimees
   - Outputs : cout mensuel, cout annuel, cout par dev, comparaison avec Copilot Enterprise ($39) et Cursor Business ($40)
   - Section ROI : estimation du temps gagne par dev (citer etude GitHub : 55% reduction du temps de completion)
   - Projection a 3, 6, 12 mois

5. **FAQ Enterprise** (`content/enterprise/faq.mdx`, nouveau) :
   - 15+ questions/reponses couvrant :
     - Donnees et vie privee
     - Conformite reglementaire
     - Couts et licensing
     - Deploiement et administration
     - Formation des equipes
     - Propriete intellectuelle du code genere
     - Support et SLA
     - Reversibilite (quitter Claude Code)
     - Integration avec les outils existants (Jira, Confluence, Azure DevOps)
     - Impact sur les emplois

6. **Guide de gouvernance** (`content/enterprise/governance.mdx`, nouveau) :
   - Roles et responsabilites : admin, tech lead, developpeur, auditeur
   - Permissions recommandees par role :
     - Junior dev : restreint (deny list stricte, pas de shell dangereux)
     - Senior dev : permissif (allow list elargie)
     - Tech lead : complet + gestion MCP
     - DevOps : headless mode + CI/CD
   - Gestion centralisee des configurations (CLAUDE.md racine + overrides projet)
   - Gestion des secrets : integration avec Vault, AWS Secrets Manager (concepts)
   - Allow list de MCP et plugins pour l'organisation
   - Audit : que loguer, ou, combien de temps conserver
   - Politique de mise a jour (cadence, validation avant deploiement)

7. **Comparaison Enterprise detaillee** (intégree dans la page principale ou page dediee) :
   - Tableau : Claude Code vs Copilot Enterprise vs Cursor Business
   - Criteres : SSO/SAML, audit logs, policy management, data residency, SOC 2, SLA, prix/utilisateur, support, privacy mode
   - Honnetetement : noter "?" quand l'info n'est pas disponible

### Criteres d'acceptation

- 6 pages enterprise completes
- Lien "Entreprise" visible dans le header principal
- Page securite/compliance avec renvois vers Anthropic Trust Center
- Guide d'adoption structure en 4 phases avec checklists
- Calculateur de TCO fonctionnel (statique ou interactif)
- FAQ de 15+ questions enterprise
- Guide de gouvernance avec permissions par role
- Comparaison enterprise vs Copilot Enterprise et Cursor Business

### Fichiers impactes

- `content/enterprise/index.mdx` (nouveau)
- `content/enterprise/security-compliance.mdx` (nouveau)
- `content/enterprise/team-adoption.mdx` (nouveau)
- `content/enterprise/tco-calculator.mdx` (nouveau)
- `content/enterprise/faq.mdx` (nouveau)
- `content/enterprise/governance.mdx` (nouveau)
- `src/app/enterprise/[slug]/page.tsx` (nouveau)
- `src/app/enterprise/layout.tsx` (nouveau)
- `src/components/ui/TcoCalculator.tsx` (nouveau, optionnel interactif)
- `src/components/layout/Header.tsx` (ajout lien "Entreprise")
- `src/app/page.tsx` (ajout parcours Enterprise)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Entreprise | 3 → 7 (+4) | Transformation complete du parcours decideur |

---

## Epic 28 — Contenu non-developpeur et cas d'usage universels

- **Statut** : `TODO`
- **Review** : `NON REVIEWE`
- **Priorite** : P2 (moyenne — aligne la promesse de la landing page)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 22 (prompting non-dev)
- **Personas impactees** : Novice (important), Debutant (important)
- **Source Audit** : NOVICE I4, DEBUTANT I1/I2, tous audits sur les exemples 100% dev

### Probleme identifie

La landing page promet "pour les entrepreneurs, etudiants, creatifs, curieux" mais 100% des exemples du site sont orientes developpement (formulaire React, TDD, code review, CI/CD). Les Skills, MCP, et Plugins presentes ciblent exclusivement les developpeurs. Un non-developpeur ne trouve aucun cas d'usage pertinent pour lui.

### Description

Creer du contenu non-technique : Skills pour le quotidien, cas d'usage business, exemples de MCP accessibles, case studies de non-developpeurs, et une section "Cas d'usage sans code".

### User Stories

1. En tant que non-developpeur, je veux des exemples de Skills pour le quotidien (email, planning, resume, rapport) afin de comprendre l'utilite de Claude Code pour moi.
2. En tant qu'entrepreneur, je veux des cas d'usage business concrets (prototype web, analyse de marche, automatisation) afin de voir le potentiel pour mon activite.
3. En tant que novice, je veux au moins un MCP zero-config qui fonctionne sans token ni JSON afin de decouvrir les MCP sans barriere technique.
4. En tant que debutant, je veux des case studies de non-developpeurs (comme Marie la restauratrice) avec des details concrets afin de m'identifier.
5. En tant que non-developpeur, je veux une section "Cas d'usage sans code" avec des tutoriels pas a pas illustres afin de savoir exactement quoi faire.

### Taches detaillees

1. **Skills non-techniques** (enrichissement de `content/skills/best-skills.mdx`) :
   - Ajouter 5+ Skills pour non-developpeurs :
     - "Rediger un email professionnel" (contexte → ton → structure → resultat)
     - "Resumer un document" (type de document → longueur → format de sortie)
     - "Creer un planning hebdomadaire" (contraintes → priorites → format)
     - "Preparer une presentation" (sujet → audience → nombre de slides → style)
     - "Generer un post LinkedIn" (sujet → ton → objectif → CTA)
   - Chaque Skill a un exemple complet de fichier Markdown a copier-coller

2. **Cas d'usage business** (`content/use-cases/business.mdx`, nouveau) :
   - Prototyper un site web pour son business (prompt complet, resultat attendu)
   - Creer un tableur de suivi budgetaire
   - Rediger une proposition commerciale
   - Analyser les retours clients (avis Google, emails)
   - Generer un rapport mensuel a partir de donnees brutes
   - Automatiser les relances par email
   - Chaque cas d'usage a : contexte, prompt exact, resultat attendu, temps estime

3. **MCP accessibles pour non-developpeurs** :
   - Identifier 2-3 MCP zero-config ou quasi-zero-config
   - Documenter un MCP Filesystem (lecture de fichiers locaux) comme premier MCP sans token
   - Ajouter un callout en haut de la section MCP : "Les MCP sont des fonctionnalites avancees. Si vous debutez, commencez par le guide de demarrage."

4. **Case studies detaillees** (`content/use-cases/success-stories.mdx`, nouveau) :
   - 3-4 histoires detaillees de non-developpeurs (basees sur les temoignages de la landing ou scenarios realistes) :
     - La restauratrice qui a cree le site de son restaurant
     - L'etudiante qui a automatise ses fiches de revision
     - L'entrepreneur qui a prototype son MVP en une semaine
     - Le freelance qui a automatise ses devis et factures
   - Chaque histoire : probleme → decouverte de Claude Code → parcours d'apprentissage → resultat concret → temps investi

5. **Section "Cas d'usage sans code"** (`content/use-cases/no-code.mdx`, nouveau) :
   - Tutoriels pas a pas avec captures d'ecran :
     - Creer un site web simple (de A a Z, avec captures)
     - Generer et organiser des documents
     - Automatiser des taches repetitives
     - Analyser des donnees a partir d'un fichier CSV

### Criteres d'acceptation

- 5+ Skills non-techniques avec fichiers Markdown copiables
- 6+ cas d'usage business avec prompts exacts et resultats attendus
- 3+ case studies detaillees de non-developpeurs
- Section "Cas d'usage sans code" avec tutoriels pas a pas
- Callout d'aiguillage en haut des sections avancees (MCP, Skills, Plugins)
- Lien vers les cas d'usage depuis la landing page

### Fichiers impactes

- `content/skills/best-skills.mdx` (enrichissement)
- `content/use-cases/business.mdx` (nouveau)
- `content/use-cases/success-stories.mdx` (nouveau)
- `content/use-cases/no-code.mdx` (nouveau)
- `src/app/use-cases/[slug]/page.tsx` (nouveau)
- `src/app/use-cases/layout.tsx` (nouveau)
- `content/mcp/what-are-mcps.mdx` (ajout callout debutant)
- `content/skills/what-are-skills.mdx` (ajout callout debutant)
- `content/plugins/what-are-plugins.mdx` (ajout callout debutant)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Novice | 5.5 → 7 (+1.5) | Cas d'usage concrets pour lui |
| Debutant | 5.5 → 7 (+1.5) | Exemples business et non-techniques |

---

## Epic 29 — Limites, comparaisons objectives et couts reels

- **Statut** : `TODO`
- **Review** : `NON REVIEWE`
- **Priorite** : P2 (moyenne — renforce la credibilite pour experts et connaisseurs)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Aucune
- **Personas impactees** : Expert (critique), Connaisseur (important), Experimente (important)
- **Source Audit** : EXPERT I4, CONNAISSEUR Limites critiques, EXPERIMENTE I4

### Probleme identifie

Tous les audits de profils techniques pointent l'absence totale de contenu sur les limitations de Claude Code. Le site presente l'outil comme sans defaut, ce qui est percu comme du marketing, pas de la documentation. Un developpeur experimente, un connaisseur, ou un expert veut savoir OU l'outil echoue, pas juste ou il excelle.

De meme, les couts reels de sessions sont absents : combien coute un refactoring de 500 fichiers ? Une review de PR ? Une journee d'utilisation intensive ?

### Description

Creer une page "Limites et workarounds", une comparaison honnete avec les concurrents, et une page de couts reels avec benchmarks de consommation.

### User Stories

1. En tant qu'expert, je veux connaitre les limites de Claude Code (quand il hallucine, quels projets il gere mal) afin de calibrer mes attentes.
2. En tant que connaisseur, je veux une comparaison honnete Claude Code vs Cursor vs Copilot vs Aider afin de choisir le bon outil pour chaque tache.
3. En tant que developpeur, je veux des benchmarks de couts reels (cout par session, par refactoring, par journee) afin de budgeter mon usage.
4. En tant qu'expert, je veux connaitre les strategies de contournement pour les limites connues afin de rester productif malgre les limitations.
5. En tant que connaisseur, je veux savoir quand Claude Code n'est pas le bon outil afin de ne pas perdre de temps.

### Taches detaillees

1. **Page "Limites et workarounds"** (`content/reference/limitations.mdx`, nouveau) :
   - Hallucinations : quand et pourquoi Claude Code invente du code ou des APIs
   - Fenetre de contexte : que se passe-t-il quand on approche les 200K tokens
   - Grands projets : limites pour les codebases de 100K+ lignes, monorepos
   - Langages moins bien supportes : quels langages ont moins de performance
   - Actions destructives : risques de `rm -rf`, modifications non desirees
   - Drift dans les sessions longues : perte de coherence
   - Limites de rate limiting par provider (API, Max, Pro)
   - Pour chaque limite : description, quand ca arrive, workaround recommande

2. **Comparaison honnete avec les concurrents** (`content/reference/comparison.mdx`, nouveau) :
   - Claude Code vs GitHub Copilot : forces et faiblesses de chacun
     - Copilot : meilleur pour l'inline completion, integration VS Code native
     - Claude Code : meilleur pour le multi-fichiers, la conversation, les agents
   - Claude Code vs Cursor : forces et faiblesses de chacun
     - Cursor : meilleur pour l'integration IDE, Tab completion
     - Claude Code : meilleur pour la CLI, le headless, les MCP
   - Claude Code vs Aider : forces et faiblesses de chacun
   - Claude Code vs Windsurf, Continue, Cline
   - Quand utiliser l'un vs l'autre (tableau de decision)
   - Complementarite : comment utiliser Claude Code + Copilot ensemble

3. **Page "Couts reels et optimisation"** (`content/reference/costs.mdx`, nouveau) :
   - Benchmarks de couts reels par type de tache :
     - Session de debug (30 min) : ~$X
     - Refactoring d'un module (200 lignes) : ~$X
     - Review de PR : ~$X
     - Journee d'utilisation active : ~$X
   - Comparaison API vs Max vs Pro pour differents profils d'usage
   - Strategies d'optimisation :
     - Choisir le bon modele (Haiku pour les taches simples, Opus pour le raisonnement)
     - Utiliser /compact pour reduire le contexte
     - Structurer les sessions pour minimiser les tokens
     - Combien de MCP est raisonnable (impact sur les tokens)
   - Comment lire le resultat de `/cost`

### Criteres d'acceptation

- Page limitations avec 8+ limites documentees et workarounds
- Comparaison avec 4+ concurrents sur des criteres objectifs
- Benchmarks de couts avec 5+ scenarios chiffres
- Strategies d'optimisation des couts documentees
- Ton honnete et objectif (pas de marketing)
- Le contenu renforce la credibilite, pas la defiance

### Fichiers impactes

- `content/reference/limitations.mdx` (nouveau)
- `content/reference/comparison.mdx` (nouveau)
- `content/reference/costs.mdx` (nouveau)
- Navigation sidebar Reference (ajout des nouvelles pages)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 6 (+1.5) | Honnetete = credibilite |
| Connaisseur | 5.5 → 7 (+1.5) | Limites connues, couts calibres |
| Experimente | 6 → 7 (+1) | Comparaison objective pour choisir |

---

## Epic 30 — Enrichissement de la section Skills pour tous niveaux

- **Statut** : `TODO`
- **Review** : `NON REVIEWE`
- **Priorite** : P2 (moyenne)
- **Estimation** : S (3-5 jours)
- **Dependances** : Epic 28 (Skills non-dev)
- **Personas impactees** : Expert (important), Connaisseur (important)
- **Source Audit** : EXPERT Skills, CONNAISSEUR Skills manques

### Probleme identifie

Les Skills sont presentes comme "incontournables" mais sont des fichiers Markdown qu'on demande au lecteur de creer lui-meme. Il n'y a pas de repository telechargeable, pas de documentation exhaustive des variables, et pas de patterns avances.

### Description

Publier les Skills dans un repository telechargeable, documenter exhaustivement les variables et le templating, et ajouter des patterns avances.

### User Stories

1. En tant que connaisseur, je veux telecharger les Skills recommandes depuis un repo GitHub afin de les utiliser immediatement.
2. En tant qu'expert, je veux la documentation complete des variables disponibles dans les Skills ($ARGUMENTS et autres) afin de creer des Skills parametriques.
3. En tant qu'expert, je veux des patterns avances de Skills (conditionnels, multi-etapes, orchestration) afin de creer des workflows complexes.
4. En tant que connaisseur, je veux savoir combien de tokens un Skill consomme afin de gerer mon budget contexte.

### Taches detaillees

1. **Repository GitHub de Skills** :
   - Creer un repo public `claude-codex-skills` (ou l'ajouter au repo du site)
   - Y publier tous les Skills presentes dans le site (React Component Generator, API Pattern, Deploy Checklist, TDD Guide, Code Reviewer, etc.)
   - Chaque Skill est un fichier Markdown telechargeable avec instructions d'installation
   - Ajouter les liens de telechargement dans les pages du site

2. **Documentation des variables et du templating** :
   - Documenter `$ARGUMENTS` en detail : parsing, arguments optionnels, flags
   - Documenter les autres variables disponibles (si existantes)
   - Documenter les variables d'environnement accessibles dans un Skill
   - Impact en tokens : estimation de la consommation par Skill type

3. **Patterns avances** (enrichissement de `content/skills/create-custom.mdx`) :
   - Skills conditionnels (adapter le comportement selon le contexte)
   - Skills multi-etapes avec dependances
   - Skills qui orchestrent des sous-agents
   - Skills avec validation de sortie
   - Versionning et migration des Skills

### Criteres d'acceptation

- Repository GitHub avec 10+ Skills telechargeables
- Documentation exhaustive des variables de templating
- 3+ patterns avances documentes avec exemples
- Liens de telechargement fonctionnels sur le site

### Fichiers impactes

- `content/skills/best-skills.mdx` (ajout liens telechargement)
- `content/skills/create-custom.mdx` (enrichissement patterns avances)
- `content/skills/variables-reference.mdx` (nouveau, optionnel)
- Repository externe ou repertoire `public/skills/`

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 5.5 (+1) | Skills telechargeables et avances |
| Connaisseur | 5.5 → 6.5 (+1) | Skills prets a l'emploi |

---

## Epic 31 — Enrichissement de la section Agents pour profils avances

- **Statut** : `TODO`
- **Review** : `NON REVIEWE`
- **Priorite** : P2 (moyenne)
- **Estimation** : M (1-2 semaines)
- **Dependances** : Epic 13 (section Agents de base), Epic 24 (hooks et mode avance)
- **Personas impactees** : Expert (critique), Connaisseur (critique)
- **Source Audit** : CONNAISSEUR Agents (1/10, la pire note), EXPERT Agent SDK

### Probleme identifie

L'audit Connaisseur donne 1/10 a la section Agents — la pire note de tout le site. Les agents et l'orchestration multi-agents sont la fonctionnalite avancee #1 de Claude Code, promise sur la landing page mais absente du contenu. L'Epic 13 existante prevoit de creer la section, mais elle doit etre enrichie avec du contenu de niveau expert.

### Description

S'assurer que la section Agents (Epic 13) inclut du contenu avance : Agent SDK, patterns d'orchestration multi-agents, agents custom dans `~/.claude/agents/`, limites et couts, et comparaison avec les systemes d'agents concurrents.

### User Stories

1. En tant que connaisseur, je veux comprendre comment configurer des agents custom dans `~/.claude/agents/` afin de creer mes propres workflows automatises.
2. En tant qu'expert, je veux connaitre l'Agent SDK pour construire des agents programmatiques afin d'integrer Claude Code dans mes outils.
3. En tant qu'architecte, je veux des patterns d'orchestration multi-agents (fan-out/fan-in, pipeline, multi-perspective) avec des exemples concrets.
4. En tant qu'expert, je veux connaitre les limites des agents (cout en tokens, profondeur de recursion, timeouts) afin de dimensionner mes workflows.
5. En tant que connaisseur, je veux une comparaison des systemes d'agents (Claude Code vs Devin vs Aider vs Cline) afin de choisir le bon outil.

### Taches detaillees

1. **Enrichissement du contenu Agents prevu par l'Epic 13** :
   - S'assurer que les pages incluent :
     - Configuration d'agents dans `~/.claude/agents/` et `.claude/agents/`
     - Fichiers AGENTS.md : format, variables, exemples
     - Le Task tool : comment lancer des sous-agents programmatiquement
     - Patterns : fan-out/fan-in, pipeline sequentiel, multi-perspective analysis
     - Exemples concrets : code review multi-perspectives, migration guidee, audit de securite parallele

2. **Page Agent SDK** (`content/agents/agent-sdk.mdx`, nouveau ou integre) :
   - Qu'est-ce que le Claude Agent SDK ?
   - Comment construire un agent programmatique
   - Integration avec des outils externes
   - Exemples : un agent de monitoring, un agent de deploy, un agent de triage de bugs

3. **Page Limites et performance des agents** :
   - Cout en tokens : combien coute un workflow multi-agents
   - Profondeur de recursion : limites et recommandations
   - Gestion des erreurs : que faire quand un sous-agent echoue
   - Timeouts et retry strategies
   - Bonnes pratiques pour les workflows en production

4. **Comparaison avec les concurrents** :
   - Claude Code agents vs Devin (autonome vs assiste)
   - Claude Code agents vs Aider (multi-fichiers)
   - Claude Code agents vs systemes multi-agents custom (LangGraph, CrewAI)
   - Quand utiliser chaque approche

### Criteres d'acceptation

- Section Agents complete avec contenu expert
- Agent SDK documente avec exemples
- Patterns d'orchestration avec 3+ exemples concrets
- Limites et couts des agents documentes
- Comparaison avec 3+ systemes concurrents
- Le contenu de l'Epic 13 est enrichi, pas remplace

### Fichiers impactes

- Fichiers prevus par l'Epic 13 (enrichissement)
- `content/agents/agent-sdk.mdx` (nouveau ou integre)
- `content/agents/performance-limits.mdx` (nouveau ou integre)

### Impact attendu sur les scores persona

| Persona | Score actuel | Score vise |
|---------|-------------|------------|
| Expert | 4.5 → 6 (+1.5) | Agent SDK et patterns avances |
| Connaisseur | 5.5 → 8 (+2.5) | La lacune #1 comblee |

---

## Epic 32 — Suivi d'usage et analytics respectueux de la vie privee

- **Statut** : `TODO`
- **Review** : `NON REVIEWÉ`
- **Priorite** : P2
- **Estimation** : S (2-3 jours)
- **Dependances** : Aucune (peut etre fait a tout moment)
- **Description** : Mettre en place un systeme d'analytics self-hosted, respectueux du RGPD et sans cookies tiers, pour comprendre l'usage du site (pages visitees, parcours utilisateurs, sources de trafic). La solution retenue est **Matomo** en mode cookieless, auto-hebergee via Docker. Alternative evaluee : Umami (plus leger mais moins complet).

### Analyse comparative des solutions gratuites et self-hosted

| Critere | Matomo | Umami | Plausible (self-hosted) | GoatCounter |
|---------|--------|-------|------------------------|-------------|
| **Licence** | GPL v3 | MIT | AGPL v3 | EUPL |
| **Mode cookieless** | Oui (natif) | Oui (par defaut) | Oui (par defaut) | Oui |
| **RGPD sans bandeau** | Oui (cookieless) | Oui | Oui | Oui |
| **Stack Docker** | PHP + MySQL/MariaDB | Node.js + PostgreSQL | Elixir + ClickHouse + PG | Go + SQLite/PG |
| **Ressources serveur** | ~256 MB RAM | ~128 MB RAM | ~512 MB RAM (ClickHouse) | ~64 MB RAM |
| **Features analytics** | Tres complet (goals, heatmaps, funnels, events, SEO) | Essentiel (pages, referrers, events, UTM) | Essentiel (pages, referrers, goals) | Minimaliste (pages, referrers) |
| **UI/UX dashboard** | Fonctionnel (classique) | Moderne et epure | Moderne et epure | Minimaliste |
| **API de donnees** | Oui (tres riche) | Oui | Oui | Oui (basique) |
| **Communaute** | Tres grande (15+ ans) | En croissance rapide | En croissance | Petite |
| **Maturite** | Tres mature | Mature | Mature | Stable |

### Decision : Matomo (mode cookieless)

**Raisons du choix** :
1. **Fonctionnalites** : Suite analytique la plus complete en self-hosted gratuit (goals, events, funnels, SEO keywords, custom dimensions)
2. **RGPD** : Mode cookieless natif = zero bandeau de consentement necessaire, les donnees restent 100% sur le serveur
3. **Ecosysteme Docker** : Image officielle bien maintenue, s'integre naturellement dans le `docker-compose.yml` existant
4. **Perennite** : 15+ ans d'existence, enorme communaute, mises a jour regulieres
5. **Migration** : Si besoin d'evoluer vers Umami a l'avenir (plus leger), la migration est simple (les deux exportent en CSV/API)

### User Stories

1. En tant que proprietaire du site, je veux connaitre le nombre de visiteurs uniques et de pages vues par jour/semaine/mois afin de mesurer l'audience du site.
2. En tant que proprietaire du site, je veux voir les pages les plus consultees afin de prioriser le contenu a ameliorer ou enrichir.
3. En tant que proprietaire du site, je veux connaitre les sources de trafic (moteurs de recherche, reseaux sociaux, liens directs) afin d'optimiser ma strategie de diffusion.
4. En tant que proprietaire du site, je veux voir le parcours de navigation des utilisateurs afin de comprendre comment ils explorent le site et identifier les points de sortie.
5. En tant que visiteur europeen, je veux que mes donnees soient traitees sans cookies et sans transfert hors UE afin que ma vie privee soit respectee.
6. En tant que proprietaire du site, je veux un dashboard accessible en self-hosted afin de consulter les metriques sans dependre d'un service tiers.

### Taches techniques

1. **Ajout de Matomo au docker-compose.yml** :
   - Service `matomo` (image officielle `matomo:fpm-alpine`)
   - Service `matomo-db` (MariaDB)
   - Volume persistant pour les donnees Matomo et la base
   - Reseau interne partage avec le service Nginx existant
2. **Configuration Nginx** :
   - Ajout d'un bloc `location /matomo` ou sous-domaine `analytics.claude-codex.fr`
   - Reverse proxy vers le service Matomo
   - Headers de securite adaptes
3. **Integration du script de tracking** :
   - Ajout du snippet Matomo dans `src/app/layout.tsx` (balise `<Script>`)
   - Configuration en mode **cookieless** (`_paq.push(['disableCookies'])`)
   - Respect du `Do Not Track` du navigateur
   - Chargement asynchrone pour ne pas impacter les performances
4. **Configuration Matomo** :
   - Desactivation des cookies (mode cookieless)
   - Anonymisation des IP (2 derniers octets)
   - Retention des donnees : 12 mois
   - Desactivation du tracking des User-Agents complets
   - Configuration des goals (ex: visite de la page Getting Started, clic sur CTA)
5. **Verification de conformite** :
   - Pas de cookies tiers (conforme CLAUDE.md)
   - Pas de transfert de donnees hors UE (self-hosted)
   - Pas de tracking intrusif (cookieless + IP anonymisee)
   - Score Lighthouse non impacte (script async < 5 KB)

### Criteres d'acceptation

- Matomo est accessible via le dashboard self-hosted
- Le mode cookieless est actif (aucun cookie Matomo depose)
- Les IPs sont anonymisees (2 derniers octets)
- Le script de tracking est charge en asynchrone et ne degrade pas le Lighthouse score (< 50ms d'impact)
- Le `docker-compose.yml` inclut les services Matomo + MariaDB avec volumes persistants
- Le `Do Not Track` du navigateur est respecte
- Aucune donnee personnelle identifiable n'est collectee
- Les donnees restent 100% sur le serveur (pas de service tiers)

### Fichiers impactes

- `docker-compose.yml` (ajout services matomo + matomo-db)
- `docker/nginx.conf` (reverse proxy Matomo)
- `src/app/layout.tsx` (script de tracking)
- `.env.example` (variables Matomo : URL, site ID)

### Source

- DEMANDE UTILISATEUR (suivi d'usage, conformite RGPD, solution gratuite self-hosted)

---

## Epic 33 — Dangers, pieges et idees recues : MCP, Plugins, contexte et couts

- **Statut** : `TERMINÉ`
- **Review** : `REVIEWÉ ✅`
- **Priorite** : P1
- **Estimation** : M (5-8 jours)
- **Dependances** : Epic 19 (audit credibilite) recommandee avant pour eviter de documenter des infos fictives
- **Description** : Creer une section de contenu educatif sur les **risques reels**, les **pieges courants** et les **fausses idees recues** lies a l'utilisation de MCP, des plugins, de la gestion du contexte et des couts. L'objectif est de faire de The Claude Codex un site qui ne vend pas du reve mais qui informe honnêtement, y compris sur les limites et dangers. Aucun autre site francophone ne traite ces sujets en profondeur.

### Sujets identifies

#### 1. Securite des MCP — Les risques que personne n'explique

- **Prompt injection via tool results** : un MCP malveillant (ou compromis) peut injecter des instructions dans les resultats d'outils, detournant le comportement de Claude
- **Exfiltration de donnees** : un MCP peut lire des fichiers locaux (code source, .env, credentials) et les envoyer a un serveur distant
- **Execution de code arbitraire** : certains MCP executent du code sur la machine (Bash, eval). Un MCP malveillant = acces complet au systeme
- **Supply chain attack** : installer un MCP depuis npm/GitHub sans audit = faire confiance aveugle a un inconnu
- **Confusion de permissions** : l'utilisateur approuve "Read" mais le MCP lit /etc/passwd ou ~/.ssh/id_rsa
- **MCP "officiels" vs communautaires** : comment verifier la legitimite et la surete d'un serveur MCP

#### 2. Surconsommation de contexte — Le piege invisible

- **Comment le contexte se remplit** : chaque outil MCP ajoute sa definition (schema JSON) au prompt systeme, meme s'il n'est jamais utilise
- **Le mythe "plus de MCP = plus puissant"** : 10 MCP installes = des milliers de tokens de definitions d'outils consommes avant la moindre question
- **Deferred tools** : comment Claude Code differe le chargement des schemas pour economiser du contexte, et pourquoi c'est important
- **Signes d'un contexte sature** : reponses tronquees, perte de memoire conversationnelle, hallucinations en fin de session
- **Impact sur la qualite des reponses** : plus le contexte est charge, moins Claude est precis sur chaque element
- **Compaction automatique** : comment fonctionne la compression du contexte, ce qui est perdu, strategies pour la controler

#### 3. Couts reels — Ce que personne ne dit

- **Tokens = argent** : chaque token de contexte (MCP, outils, historique) est facture. Plus de MCP = facture plus elevee
- **Calcul concret** : estimation du cout/session avec 0, 3, 10 MCP actifs
- **Les abonnements Claude Pro/Max ne sont pas illimites** : limites de messages, throttling, difference entre les plans
- **Couts caches des MCP tiers** : certains MCP appellent des APIs payantes (ex: Brave Search, bases de donnees cloud)
- **Optimisation du ratio cout/valeur** : ne charger que ce qui est necessaire pour la tache en cours

#### 4. Fausses idees recues — Mythbusting

| Mythe | Realite |
|-------|---------|
| "Les MCP officiels sont tous surs" | Il n'y a pas de processus de certification. "Officiel" signifie souvent "dans le repo Anthropic" mais pas audite en profondeur |
| "Plus j'installe de MCP, plus Claude est capable" | Chaque MCP non utilise gaspille du contexte et peut degrader les reponses |
| "Claude Code est gratuit avec l'abonnement Pro" | Pro = 5x limite de messages. Les sessions longues avec beaucoup de MCP consomment le quota rapidement |
| "Les plugins et MCP c'est pareil" | Les plugins sont un concept de configuration locale, les MCP sont des serveurs externes avec des implications de securite differentes |
| "Je peux faire confiance a n'importe quel MCP sur GitHub" | Un MCP populaire peut etre compromis (typosquatting, dependance malveillante, mainteneur pirate) |
| "Le mode auto/yolo est pratique et sans risque" | Il autorise toutes les actions sans confirmation = un MCP malveillant a carte blanche |
| "CLAUDE.md est lu uniquement par Claude" | Tout processus ayant acces au repo peut lire CLAUDE.md. Ne JAMAIS y mettre de secrets |
| "La fenetre de contexte est infinie avec la compaction" | La compaction resume et perd des details. Les sessions tres longues degradent la precision |

#### 5. Bonnes pratiques — Comment se proteger

- **Principe du moindre privilege** : n'installer que les MCP necessaires a la tache
- **Audit avant installation** : verifier le code source, les permissions demandees, la reputation de l'auteur
- **Profils de configuration** : utiliser des fichiers `.mcp.json` par projet plutot qu'une config globale
- **Monitoring du contexte** : surveiller l'utilisation du contexte (commande `/cost` ou equivalent)
- **Rotation de sessions** : commencer des sessions fraiches pour les taches critiques plutot que de reutiliser une session saturee
- **Mode permission par defaut** : ne jamais utiliser `dangerouslySkipPermissions` en production
- **Review des resultats MCP** : verifier les outputs suspects, surtout si un MCP retourne du contenu inattendu
- **Separation des environnements** : ne pas utiliser les memes MCP en dev et en acces a des donnees sensibles

#### 6. Guide de depannage contexte

- "Claude oublie ce que je lui ai dit" → contexte sature, strategies de resolution
- "Les reponses sont de plus en plus lentes" → trop de MCP actifs, comment diagnostiquer
- "Claude invente des choses en fin de session" → hallucinations liees a la saturation, quand redemarrer
- "Ma facture API a explose" → audit des tokens consommes, identification des MCP gourmands

### Pages MDX prevues

| # | Fichier | Titre | Section |
|---|---------|-------|---------|
| 1 | `content/mcp/securite-mcp.mdx` | Securite des MCP : risques et protections | MCP |
| 2 | `content/prompting/gestion-contexte.mdx` | Gerer son contexte : eviter la saturation | Prompting |
| 3 | `content/content/couts-reels-claude-code.mdx` | Couts reels de Claude Code : ce que personne ne dit | Content |
| 4 | `content/content/mythes-claude-code.mdx` | 8 idees recues sur Claude Code (et la verite) | Content |
| 5 | `content/content/bonnes-pratiques-securite.mdx` | Guide de securite : MCP, plugins et permissions | Content |

### User Stories

1. En tant qu'utilisateur debutant, je veux comprendre les risques de securite des MCP **avant** d'en installer afin de ne pas compromettre mon systeme par ignorance.
2. En tant qu'utilisateur regulier, je veux savoir pourquoi Claude "oublie" des choses en fin de session afin de comprendre le fonctionnement du contexte et adapter mon usage.
3. En tant qu'utilisateur soucieux des couts, je veux un calcul concret du cout par session avec differentes configurations de MCP afin de maitriser ma facture.
4. En tant qu'utilisateur experimente, je veux une liste de fausses idees recues dementie par des faits afin de corriger mes propres assumptions.
5. En tant qu'utilisateur en entreprise, je veux un guide de bonnes pratiques de securite afin de deployer Claude Code sans risque pour les donnees de l'entreprise.
6. En tant qu'utilisateur frustre par des performances degradees, je veux un guide de depannage contexte afin de diagnostiquer et resoudre les problemes.

### Criteres d'acceptation

- 5 pages MDX publiees avec frontmatter complet (title, description, order, section)
- Chaque page contient au moins 1 schema/diagramme explicatif (ex: flux d'une attaque MCP, diagramme de saturation contexte)
- La page "mythes" est structuree en format mythbusting (mythe → realite → source/preuve)
- La page "couts" contient des calculs concrets avec des chiffres reels (prix/token, estimation par session)
- La page "securite" contient un checklist actionnable (copier-coller dans un CLAUDE.md)
- Toutes les pages ont des meta SEO et sont indexees dans `search-index.ts`
- Les pages sont liees depuis les sections MCP, Prompting et Content existantes
- Aucune information fictive (tout est verifiable avec la documentation officielle Anthropic)

### Fichiers impactes

- `content/mcp/securite-mcp.mdx` (nouveau)
- `content/prompting/gestion-contexte.mdx` (nouveau)
- `content/content/couts-reels-claude-code.mdx` (nouveau)
- `content/content/mythes-claude-code.mdx` (nouveau)
- `content/content/bonnes-pratiques-securite.mdx` (nouveau)
- `src/lib/section-navigation.ts` (ajout des nouvelles pages)
- `src/lib/metadata.ts` (ajout dans SITE_PAGES)
- `src/lib/search-index.ts` (ajout des entrees de recherche)

### Source

- DEMANDE UTILISATEUR (dangers MCP/plugins, surconsommation contexte, mythbusting)

---
---

## Tableau recapitulatif des Epics Persona-Driven (19-33)

| Epic | Titre | Priorite | Estimation | Personas cibles | Statut | Review | Source |
|------|-------|----------|------------|-----------------|--------|--------|--------|
| 19 | Audit credibilite et corrections fictives | P0 | M | Expert, Connaisseur, Experimente | `TERMINÉ` | `REVIEWÉ ✅` | AUDITS PERSONA |
| 20 | Contenu visuel (screenshots, GIFs, video) | P0 | L | Novice, Debutant, Experimente | `TERMINÉ` | `REVIEWÉ ✅` | AUDITS PERSONA |
| 21 | Parcours grand debutant et pre-requis zero | P0 | L | Novice, Debutant | `TERMINÉ` | `REVIEWÉ ✅` | AUDITS PERSONA |
| 22 | Refonte majeure section Prompting | P0 | L | Toutes | `TERMINÉ` | `REVIEWÉ ✅` | AUDITS PERSONA |
| 23 | Documentation de reference technique | P1 | M | Expert, Connaisseur, Experimente | `TERMINÉ` | `REVIEWÉ ✅` | AUDITS PERSONA |
| 24 | Hooks, mode headless et CI/CD | P1 | M | Expert, Connaisseur | `TERMINÉ` | `REVIEWÉ ✅` | AUDITS PERSONA |
| 25 | Creation MCP custom (tutoriel complet) | P1 | M | Expert, Connaisseur | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 26 | Parcours differencies et navigation par persona | P1 | M | Toutes | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 27 | Section Enterprise complete | P1 | L | Entreprise | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 28 | Contenu non-developpeur et cas d'usage universels | P2 | M | Novice, Debutant | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 29 | Limites, comparaisons objectives et couts reels | P2 | M | Expert, Connaisseur, Experimente | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 30 | Enrichissement section Skills tous niveaux | P2 | S | Expert, Connaisseur | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 31 | Enrichissement section Agents profils avances | P2 | M | Expert, Connaisseur | `TODO` | `NON REVIEWE` | AUDITS PERSONA |
| 32 | Suivi d'usage et analytics (Matomo) | P2 | S | Toutes (ops) | `TODO` | `NON REVIEWE` | DEMANDE UTILISATEUR |
| 33 | Dangers, pieges et idees recues (MCP, contexte, couts) | P1 | M | Toutes | `TERMINÉ` | `REVIEWÉ ✅` | DEMANDE UTILISATEUR |

**Progression** : 7/15 terminee (47%)

---

## Roadmap Persona-Driven en phases

### Phase A — Credibilite et fondations visuelles (Semaines 1-3)

**Objectif** : Restaurer la credibilite technique et ajouter le contenu visuel manquant.

| Epic | Titre | Estimation |
|------|-------|------------|
| 19 | Audit credibilite et corrections fictives | M |
| 20 | Contenu visuel (screenshots, GIFs, video) | L |

**Parallelisme** : Epics 19 et 20 en parallele. L'audit de credibilite (19) est un prerequis pour les corrections MCP/Plugins qui impactent les autres epics.

**Livrable** : Un site avec des informations verifiees et du contenu visuel.

---

### Phase B — Contenus pour novices et prompting (Semaines 3-6)

**Objectif** : Combler le fosse entre la promesse de la landing page et le contenu pour debutants. Refondre la section prompting.

| Epic | Titre | Estimation |
|------|-------|------------|
| 21 | Parcours grand debutant et pre-requis zero | L |
| 22 | Refonte majeure section Prompting | L |

**Parallelisme** : Epics 21 et 22 en parallele (equipes differentes ou themes differents).

**Livrable** : Un site ou un novice peut suivre le parcours de A a Z, et une section prompting complete.

---

### Phase C — Contenu expert et reference (Semaines 6-10)

**Objectif** : Ajouter la profondeur technique que les experts et connaisseurs attendent, y compris les risques et pieges.

| Epic | Titre | Estimation |
|------|-------|------------|
| 23 | Documentation de reference technique | M |
| 24 | Hooks, mode headless et CI/CD | M |
| 25 | Creation MCP custom (tutoriel complet) | M |
| 33 | Dangers, pieges et idees recues (MCP, contexte, couts) | M |

**Parallelisme** : Les 4 epics sont independantes et peuvent etre travaillees en parallele. L'Epic 33 est particulierement complementaire de l'Epic 25 (MCP custom) : l'une montre comment construire, l'autre avertit des risques.

**Livrable** : Un site avec de la profondeur technique bookmarkable et un discours honnete sur les limites.

---

### Phase D — Navigation personnalisee et enterprise (Semaines 10-14)

**Objectif** : Implementer les parcours differencies et creer la section enterprise.

| Epic | Titre | Estimation |
|------|-------|------------|
| 26 | Parcours differencies et navigation par persona | M |
| 27 | Section Enterprise complete | L |

**Parallelisme** : Epics 26 et 27 en parallele (composants UI vs contenu).

**Livrable** : Un site ou chaque persona trouve son chemin et un decideur a ses reponses.

---

### Phase E — Enrichissements et completude (Semaines 14-18)

**Objectif** : Combler les lacunes restantes et enrichir le contenu existant.

| Epic | Titre | Estimation |
|------|-------|------------|
| 28 | Contenu non-developpeur et cas d'usage universels | M |
| 29 | Limites, comparaisons objectives et couts reels | M |
| 30 | Enrichissement section Skills tous niveaux | S |
| 31 | Enrichissement section Agents profils avances | M |
| 32 | Suivi d'usage et analytics (Matomo) | S |

**Parallelisme** : Toutes les epics sont independantes. L'Epic 32 (analytics) peut etre demarree a tout moment.

**Livrable** : Un site complet qui repond a chaque persona, avec un suivi d'usage respectueux du RGPD.

---

## Impact global projete par persona

| Persona | Score actuel | Score projete (toutes epics) | Epics principales |
|---------|-------------|------------------------------|-------------------|
| **Novice** | 5.5/10 | 8/10 | 20, 21, 22, 26, 28, 33 |
| **Debutant** | 5.5/10 | 8/10 | 20, 21, 22, 26, 28, 33 |
| **Experimente** | 6/10 | 8.5/10 | 19, 22, 23, 26, 29, 33 |
| **Connaisseur** | 5.5/10 | 8.5/10 | 19, 22, 24, 25, 30, 31, 33 |
| **Expert** | 4.5/10 | 8/10 | 19, 23, 24, 25, 29, 31, 33 |
| **Entreprise** | 3/10 | 7.5/10 | 27, 26, 29, 33 |

---

## Matrice de tracabilite — Audits Persona → Epics

### Persona Novice (5.5/10)

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| C1 | Page "Pre-requis zero" avec captures d'ecran | Epic 21 |
| C2 | Captures d'ecran annotees dans le Getting Started | Epic 20 |
| C3 | Un seul chemin d'installation recommande | Epic 21 |
| C4 | Definitions des termes techniques au premier usage | Epic 21 |
| C5 | Page Prompting detaillee et illustree | Epic 22 |
| I1 | Parcours differencies par persona | Epic 26 |
| I2 | Glossaire interactif | Epic 21 |
| I3 | Premier projet ultra-simple | Epic 21 |
| I4 | Exemples non-techniques de Skills/MCP | Epic 28 |
| I5 | Badges "Avance" sur les sections | Epic 26 |
| I6 | FAQ "Questions de debutant" | Epic 21 |
| I7 | CTA landing page accessible | Epic 26 |

### Persona Debutant (5.5/10)

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| C1 | Screenshots/GIFs a chaque etape Getting Started | Epic 20 |
| C2 | Page "Qu'est-ce qu'un terminal" | Epic 21 |
| C3 | Mention de prix claire et visible | Epic 21 |
| C4 | Parcours "debutant complet" dedie | Epic 26 |
| C5 | Corriger les accents manquants | Deja couvert Epic 7 |
| I1 | Exemples de prompts pour non-developpeurs | Epic 22, 28 |
| I2 | Alternative "essayer sans installer" | Nice-to-have |
| I3 | Badges de niveau | Epic 26 |
| I4 | Restructurer page installation (onglets) | Epic 21 |
| I5 | Enrichir page Prompting (3x plus long) | Epic 22 |
| I6 | Video d'introduction | Epic 20 |
| I7 | Plugins dans le menu navigation | Epic 26 |

### Persona Experimente (6/10)

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| C1 | Verifier/corriger section Plugins | Epic 19 |
| C2 | Reecrire page Prompting | Epic 22 |
| C3 | Quick Reference / Cheatsheet | Epic 23 |
| C4 | Retirer configurateur de la navigation | Note pour Epic existante |
| I1 | Parcours "Fast Track" pour devs | Epic 26 |
| I2 | Exemples de code realistes | Epic 22 |
| I3 | Mode headless et CI/CD | Epic 24 |
| I4 | Section "Limitations & Troubleshooting avance" | Epic 29 |
| I5 | Verifier noms de packages MCP | Epic 19 |
| I6 | Documenter les modeles (Haiku, Sonnet, Opus) | Epic 22 |
| I7 | Reduire les analogies repetitives | Contenu transversal |

### Persona Connaisseur (5.5/10)

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| CRITIQUE 1 | Creer section Agents complete | Epic 31 + Epic 13 |
| CRITIQUE 2 | Tutoriel "Creer un MCP custom" | Epic 25 |
| CRITIQUE 3 | Corriger infos fictives Plugins | Epic 19 |
| CRITIQUE 4 | Honorer promesses landing "Avance" | Epics 24, 25, 31 |
| IMP 5 | Section Hooks | Epic 24 |
| IMP 6 | Enrichir prompting avance | Epic 22 |
| IMP 7 | Page "Configuration avancee" | Epic 23 |
| IMP 8 | Page "Limites et workarounds" | Epic 29 |
| IMP 9 | Page "Couts et optimisation" | Epic 29 |
| IMP 10 | Reecrire page Future/Vision | Note pour Epic 16 |
| IMP 11 | Skills telechargeables | Epic 30 |

### Persona Expert (4.5/10)

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| CRITIQUE 1 | Creer MCP Server custom | Epic 25 |
| CRITIQUE 2 | Section Hooks (PreToolUse, PostToolUse, Stop) | Epic 24 |
| CRITIQUE 3 | Refondre section Prompting (3-4 pages) | Epic 22 |
| CRITIQUE 4 | Verifier noms de packages MCP | Epic 19 |
| CRITIQUE 5 | Clarifier ecosysteme Plugins | Epic 19 |
| IMP 6 | Section Couts et performance | Epic 29 |
| IMP 7 | Integration CI/CD et mode headless | Epic 24 |
| IMP 8 | Limitations et comparaison honnete | Epic 29 |
| IMP 9 | Reference CLI complete | Epic 23 |
| IMP 10 | Corriger accents | Deja couvert Epic 7 |

### Persona Entreprise (3/10)

| # Audit | Description | Epic(s) |
|---------|-------------|---------|
| CR1 | Page Enterprise dediee | Epic 27 |
| CR2 | Section Securite & Compliance | Epic 27 |
| CR3 | Guide d'adoption d'equipe | Epic 27 |
| CR4 | Temoignages enterprise | Epic 27 |
| CR5 | Calculateur TCO | Epic 27 |
| IM1 | Guide de gouvernance | Epic 27 |
| IM2 | Comparaison enterprise detaillee | Epic 27 |
| IM3 | Integration outils enterprise (Jira, etc.) | Epic 27 |
| IM4 | FAQ enterprise | Epic 27 |
| IM5 | Parcours "Entreprise" sur la landing | Epic 26 |
| IM6 | Deploiement a l'echelle | Epic 27 |
| IM7 | Metriques de productivite referencees | Epic 27 |

### Verification de couverture persona

- **Novice** : 12/12 points couverts = **100%**
- **Debutant** : 11/12 points couverts (1 nice-to-have "sandbox en ligne" non couvert) = **92%**
- **Experimente** : 7/7 critiques et importants couverts = **100%**
- **Connaisseur** : 11/11 points couverts = **100%**
- **Expert** : 10/10 points couverts = **100%**
- **Entreprise** : 12/12 points couverts = **100%**
- **Couverture globale : 63/64 points couverts = 98.4%**
