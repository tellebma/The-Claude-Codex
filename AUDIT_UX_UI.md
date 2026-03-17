# Audit UX/UI complet - The Claude Codex

**Date :** 6 mars 2026
**Auditeur :** Agent UI/UX Designer + Agent Code Reviewer
**Application :** The Claude Codex - Guide de reference pour Claude Code
**Stack :** Next.js 14 (App Router), TypeScript, Tailwind CSS, Nginx Alpine
**URL de test :** http://localhost:8888

---

## Table des matieres

1. [Resume executif](#1-resume-executif)
2. [Architecture de l'information & Navigation](#2-architecture-de-linformation--navigation)
3. [Design visuel & Identite](#3-design-visuel--identite)
4. [Composants UI - Analyse du Design System](#4-composants-ui---analyse-du-design-system)
5. [Responsive & Mobile](#5-responsive--mobile)
6. [Accessibilite (WCAG 2.1 AA)](#6-accessibilite-wcag-21-aa)
7. [Performance percue & technique](#7-performance-percue--technique)
8. [SEO technique](#8-seo-technique)
9. [Securite des headers](#9-securite-des-headers)
10. [Contenu & UX Writing](#10-contenu--ux-writing)
11. [Points forts](#11-points-forts)
12. [Points d'amelioration - Plan d'action](#12-points-damelioration---plan-daction)

---

## 1. Resume executif

The Claude Codex est un site de documentation bien construit, avec une identite visuelle propre (gradient cyan-ambre), un contenu editorial de grande qualite et une architecture technique solide. Le dark mode est soigne, la structure de code est clean, et les bonnes pratiques de securite et SEO de base sont en place.

Cependant, l'audit revele **6 problemes critiques**, **8 problemes importants** et **12 ameliorations nice-to-have** qui impactent l'experience utilisateur, l'accessibilite et la qualite percue du site.

**Les 6 problemes critiques :**
- Bouton "copier le code" absent dans le composant CodeBlock (import mort)
- Navigation clavier piege dans le menu mobile (liens focusables quand ferme)
- Pas d'indicateur de page active dans le header
- Bug Tailwind : classes dynamiques dans PathCard non detectees au purge
- **Echec WCAG AA** : `text-brand-500` (#06b6d4) sur fond blanc a seulement 2.9:1 (minimum 4.5:1)
- **Echec WCAG critique** : `text-brand-300` (#67e8f9) sur badges light a 1.8:1

---

## 2. Architecture de l'information & Navigation

### Structure du site

Le site a une **structure plate a un seul niveau** : 6 pages de premier niveau sans sous-pages.

```
/ (Landing page)
/getting-started (Guide d'installation)
/mcp (Model Context Protocol)
/skills (Guide des Skills)
/prompting (Guide de prompting)
/future (Vision & tendances)
```

C'est adapte au volume de contenu actuel, mais pose un **probleme de scalabilite**. La roadmap annonce des tutoriels interactifs, un repertoire MCP/Skills, des guides video -- la navigation va rapidement saturer.

Le parcours propose par la landing page est coherent :
- **Debutant** -> Getting Started
- **Intermediaire** -> MCP
- **Avance** -> Prompting

Les pages Skills et Future sont accessibles mais moins bien integrees dans le parcours lineaire.

### Navigation - Problemes identifies

| Probleme | Impact | Fichier concerne |
|----------|--------|------------------|
| **Pas d'indicateur de page active** dans le header | L'utilisateur ne sait pas ou il se trouve | `Header.tsx` |
| **Aucun breadcrumb** sur aucune page | Manque d'orientation dans les pages de documentation | Toutes les pages |
| **Pas de table des matieres laterale (sidebar sticky)** | Les pages longues (Prompting: 923 lignes, Skills: 853 lignes) sont difficiles a parcourir | Pages contenu |
| **Pas de bouton "retour en haut"** | Les pages 900+ lignes necessitent du scroll excessif | Toutes les pages |

> **Note :** Le CLAUDE.md mentionne explicitement "Navigation laterale sticky sur les pages de documentation" comme objectif. Ce n'est pas encore implemente.

### Recommandations

1. Utiliser `usePathname()` de `next/navigation` dans `Header.tsx` pour styliser le lien actif
2. Ajouter un composant `TableOfContents` sticky sur les pages de documentation
3. Ajouter un composant `ScrollToTop` flottant en bas a droite

---

## 3. Design visuel & Identite

### Palette de couleurs

| Token | Couleur | Usage |
|-------|---------|-------|
| `brand-500` | `#06b6d4` (Cyan) | Couleur primaire, CTAs, liens |
| `accent-500` | `#f59e0b` (Ambre) | Accent, mise en valeur |
| Violet | Utilisation tertiaire | Variete dans les cards |
| Slate | `#0f172a` -> `#f8fafc` | Fonds, textes |

**Verdict :** La palette se distingue nettement du violet Anthropic, conformement au CLAUDE.md. Le gradient cyan-ambre est identitaire et reconnaissable.

**Point d'attention :** La combinaison cyan-sur-fond-sombre donne une esthetique tres "tech/terminal" qui peut rebuter le public non-developpeur vise explicitement par le site. Le message "pour tout le monde" entre en tension avec le look "devtool".

### Typographie

| Element | Font | Taille | Evaluation |
|---------|------|--------|------------|
| Body | Plus Jakarta Sans | Defaut | Excellent choix - lisible, moderne, approchable |
| Code | JetBrains Mono | Variable | Parfait pour les blocs de code |
| H1 | Plus Jakarta Sans | `text-4xl` a `text-7xl` | Fort impact, bon responsive scaling |
| H2 | Plus Jakarta Sans | `text-3xl` a `text-5xl` | Bon contraste avec le body |
| H3 | Plus Jakarta Sans | `text-lg` a `text-xl` | Correct |

**Probleme :** Les descriptions dans les cards et callouts utilisent massivement `text-sm` (14px). Sur des pages denses comme Prompting ou Skills, cela cree une **fatigue de lecture**. Le corps de texte principal devrait etre au minimum 16px (`text-base`).

### Espacement & Rythme vertical

- Sections : `py-20 sm:py-28` -- rythme regulier et aere
- Cards internes : `p-6`, `p-8` -- coherent
- Gap heading/grille : `mt-16` -- systematique
- Alternance fond blanc / fond teinte (`bg-slate-50/50 dark:bg-slate-900/50`) -- agreable

**Verdict :** L'espacement est bien maitrise et coherent sur l'ensemble du site.

### Dark mode vs Light mode

Le **dark mode** est le theme par defaut et le plus soigne. Il constitue clairement le theme principal de conception.

Le **light mode** presente des faiblesses :

| Probleme | Localisation |
|----------|--------------|
| Le hero garde un fond `bg-slate-950` (noir) en light mode, creant un contraste brutal avec les sections blanches | Toutes les pages |
| Les glass-cards (`bg-white/60`) sont quasi invisibles -- bordures `border-slate-200/40` trop subtiles sur fond blanc | Cards partout |
| Les badges `bg-brand-500/10` restent bien lisibles | OK |

### Logo & Identite

Le logo (icone Terminal dans un carre gradient) est **generique**. Il ne porte pas suffisamment l'identite "Codex". Un logo typographique ou un monogramme serait plus memorable.

---

## 4. Composants UI - Analyse du Design System

### Vue d'ensemble des composants

| Composant | Fichier | Qualite | Notes |
|-----------|---------|---------|-------|
| `SectionHeading` | `SectionHeading.tsx` | Excellent | Badge pill + titre + description. Prop `centered` utile |
| `FeatureCard` | `FeatureCard.tsx` | Bon | Gradients varies, hover subtil. **Pas interactif (pas de lien)** |
| `PathCard` | `PathCard.tsx` | Tres bon | Le plus complet du design system. **Bug Tailwind ligne 81** |
| `TestimonialCard` | `TestimonialCard.tsx` | Correct | Guillemet decoratif, badge resultat. **Pas d'avatar** |
| `AudienceCard` | `AudienceCard.tsx` | Bon | Layout horizontal fonctionnel |
| `Callout` | `Callout.tsx` | Bon | 3 variantes, `role="note"`, icones semantiques |
| `CodeBlock` | `CodeBlock.tsx` | Problematique | **Import `Copy` mort, pas de syntax highlighting** |
| `Header` | `Header.tsx` | Bon | Glass effect, hamburger mobile avec aria. **Pas de page active** |
| `Footer` | `Footer.tsx` | Bon | Grille 4 colonnes, liens externes avec `ExternalLink` icon |
| `ThemeToggle` | `ThemeToggle.tsx` | Bon | Placeholder SSR anti-CLS, aria-label dynamique |

### Problemes critiques dans les composants

#### CodeBlock (`src/components/ui/CodeBlock.tsx`)

```typescript
import { Copy } from "lucide-react"; // Ligne 1 : importe mais JAMAIS utilise
```

**Problemes :**
1. L'icone `Copy` est importee mais jamais rendue -- import mort
2. **Pas de bouton "copier le code"** -- pour un site de documentation technique, c'est un manque fonctionnel majeur
3. **Pas de coloration syntaxique** -- tout le code est rendu en `text-slate-300` uniforme

**Recommandation :** Ajouter un bouton copier fonctionnel avec `navigator.clipboard.writeText()` et un feedback visuel. Integrer `shiki` ou `prism-react-renderer` pour la coloration syntaxique.

#### PathCard (`src/components/ui/PathCard.tsx:81`)

```typescript
// PROBLEME : Classes Tailwind dynamiques non detectees au purge
`bg-${color === "teal" ? "brand" : color === "amber" ? "accent" : "violet"}-500`
```

Tailwind ne peut pas detecter ces classes generees par string interpolation. Les bullet points des listes risquent de ne pas avoir la bonne couleur en production.

**Recommandation :** Utiliser un objet de mapping statique (comme c'est fait partout ailleurs dans le composant) :
```typescript
const dotColors = {
  teal: "bg-brand-500",
  amber: "bg-accent-500",
  purple: "bg-violet-500",
};
```

#### FeatureCard - Pas interactif

Les FeatureCards affichent des titres comme "Creer un site web", "Automatiser vos taches" -- l'utilisateur s'attend a pouvoir cliquer pour en savoir plus. Les cards ne sont pas cliquables.

**Recommandation :** Ajouter une prop `href` optionnelle pour rendre les cards interactives quand pertinent.

---

## 5. Responsive & Mobile

### Approche mobile-first

Le CSS est ecrit en mobile-first avec breakpoints `sm:`, `md:`, `lg:` appliques progressivement. Les grilles passent correctement de multi-colonnes a une seule colonne sur mobile.

### Points positifs

- Les code blocks ont `overflow-x-auto` pour le scroll horizontal
- Le flow diagram MCP utilise `rotate-90` pour les fleches en mobile
- Les PathCards empilent bien verticalement
- Le hero terminal preview reste lisible sur mobile

### Problemes

| Probleme | Severite | Detail |
|----------|----------|--------|
| **Touch targets sous-dimensionnes** | Important | ThemeToggle et menu button sont 36x36px (`h-9 w-9`) au lieu des 44x44px recommandes WCAG |
| **Longs blocs de code sur mobile** | Mineur | Page Prompting : templates de 20+ lignes creent un scroll horizontal significatif |
| **Pas de line wrapping** optionnel pour le code | Mineur | Pas de toggle pour wrapper les lignes longues |

### Navigation mobile

Le menu hamburger est fonctionnel avec `aria-label="Menu de navigation"` et `aria-expanded`. Cependant, voir le probleme critique C2 (liens focusables quand menu ferme) dans la section accessibilite.

---

## 6. Accessibilite (WCAG 2.1 AA)

### Contrastes de couleurs

| Combinaison | Ratio | Verdict |
|-------------|-------|---------|
| `text-slate-500` sur fond blanc | ~4.6:1 | A la limite extreme de AA pour text-sm. **Ameliorer** |
| `text-slate-400` sur `bg-slate-950` | ~5.8:1 | Correct |
| `text-brand-500` (`#06b6d4`) sur fond blanc | **~2.9:1** | **ECHEC WCAG AA** (minimum 4.5:1). Liens et textes cyan illisibles en light mode |
| `text-brand-300` (`#67e8f9`) sur badges light | **~1.8:1** | **ECHEC CRITIQUE WCAG AA**. Ratio catastrophique, texte quasiment invisible |
| `text-brand-300` badges hero sur fond dark | ~6:1 | Correct |
| `text-gradient` (decoratif) | N/A | Texte blanc environnant lisible |

**Problemes critiques decouverts par l'audit technique :**
- La couleur brand `#06b6d4` (cyan-500) utilisee pour les liens et les textes accentues **echoue au test WCAG AA sur fond blanc** avec un ratio de seulement 2.9:1. Cela affecte tout le site en light mode.
- Les badges hero utilisant `text-brand-300` (`#67e8f9`) sur fond clair atteignent un ratio de 1.8:1, ce qui est un **echec critique** meme pour les textes decoratifs de grande taille (minimum 3:1).

**Recommandations :**
- Passer les descriptions de cards de `text-slate-500` a `text-slate-600` en light mode
- Utiliser `text-brand-700` ou `text-brand-800` pour les textes sur fond blanc (ratio > 4.5:1)
- Revoir tous les badges en light mode pour utiliser des combinaisons contrastees

### Focus visible

**Probleme important :** Aucun style `focus-visible` explicite n'est defini. Le ring par defaut du navigateur peut etre insuffisamment visible sur les fonds glass/blur.

**Recommandation :** Ajouter dans `globals.css` :
```css
@layer base {
  a:focus-visible,
  button:focus-visible {
    @apply ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 outline-none;
  }
}
```

### Navigation clavier - Menu mobile (CRITIQUE)

Les liens du menu mobile restent **focusables quand le menu est visuellement ferme** (`max-h-0` avec `overflow-hidden` ne retire pas les elements du tab order). Un utilisateur clavier va tabuler dans des liens invisibles.

**Recommandation :** Ajouter `inert` ou `aria-hidden="true"` + `tabIndex={-1}` sur le conteneur quand `mobileOpen` est `false`.

### Aria & Semantique

| Element | Statut |
|---------|--------|
| `aria-label` sur ThemeToggle | OK (dynamique) |
| `aria-label` + `aria-expanded` sur menu hamburger | OK |
| `role="note"` sur Callout | OK |
| `<header>`, `<main>`, `<footer>` | OK |
| `<blockquote>` pour temoignages | OK |
| Hierarchie h1 > h2 > h3 | OK |
| **Icones Lucide sans `aria-hidden="true"`** | A corriger |
| **Pas de skip-to-content link** | A ajouter |
| **Liens du menu mobile focusables quand ferme** | CRITIQUE |
| **`<nav>` sans `aria-label`** | A corriger - le `<nav>` principal n'a pas d'`aria-label` pour distinguer la navigation principale des autres landmarks |
| **Groupes de liens du Footer sans landmark `<nav>`** | A corriger - les listes de liens dans le footer ne sont pas encapsulees dans des `<nav>` avec `aria-label` |
| **PathCard lien accessible verbeux** | A ameliorer - le lien englobant toute la card produit un nom accessible trop long pour les lecteurs d'ecran |

### prefers-reduced-motion

Correctement implemente dans `globals.css` avec un selecteur `*` global qui desactive toutes les animations et transitions. Les animations Tailwind custom (fade-in, slide-up, float) et les spinners CSS de la page Future sont couverts.

---

## 7. Performance percue & technique

### Performance percue

| Aspect | Evaluation |
|--------|------------|
| Animations hover | Subtiles et rapides (`hover:-translate-y-1`) |
| Terminal preview (hero) | Bon touch narratif avec `animate-pulse` |
| Temps de chargement | Excellent (SSG + Nginx) |
| Font loading | `display: "swap"` evite le FOIT |
| Layout shifts | Placeholder ThemeToggle (`h-9 w-9`) anti-CLS |

### Performance technique - Build output

Le site est en **SSG (static export)** servi par Nginx. L'output statique dans `/out` est leger :

- Pages individuelles : ~231 bytes chacune (reference JS)
- Layout chunk : ~9.4 KB
- Fonts (WOFF2) : 10 fichiers, ~145 KB total
- CSS : compile par Tailwind (purge automatique)

**Pas d'images** dans le site -- uniquement des icones SVG inline (Lucide). Excellent pour la performance.

### Inventaire des bundles JS (audit technique)

| Chunk | Taille | Commentaire |
|-------|--------|-------------|
| `lucide-react` | **~169 KB** | Le plus gros chunk. Treeshaking partiel. Envisager `@lucide/react` (exports ESM individuels) ou importer via `lucide-react/icons/IconName` |
| React + React-DOM | **~137 KB** | Incompressible, standard pour Next.js |
| CSS (Tailwind purge) | **~40 KB** | Correct pour un design system complet |
| next-themes | ~3 KB | Negligeable |

**Point d'attention bundle :** Le chunk `lucide-react` a 169 KB est disproportionne par rapport au reste. Le site utilise ~20 icones mais le bundle pourrait contenir l'integralite de la bibliotheque si les imports ne sont pas correctement tree-shakes.

### Compression Nginx

**Probleme :** Seul **gzip** est configure dans Nginx. La compression **Brotli** (typiquement 15-20% plus efficace) n'est pas activee. Pour les assets statiques (JS, CSS, fonts), Brotli pre-compresse offrirait un gain significatif.

**Recommandation :** Ajouter `ngx_brotli` au build Nginx Alpine, ou pre-compresser les assets en `.br` a l'etape de build et les servir via `brotli_static on;`.

### Points d'attention

- **Pas de framer-motion** mentionne dans le CLAUDE.md comme souhaite pour les animations au scroll. Le site n'a aucune animation d'apparition au scroll.
- Le site n'a **aucune image** (pas de WebP a optimiser, pas de lazy loading necessaire)
- Les **fonts Google** sont chargees via `next/font` (optimisation automatique avec self-hosting)

---

## 8. SEO technique

### Meta tags

| Page | `title` | `description` | OG tags |
|------|---------|---------------|---------|
| Landing | "The Claude Codex \| Maitrisez Claude Code" | OK | `og:title`, `og:description`, `og:type`, `og:locale` |
| Getting Started | "Premiers pas avec Claude Code" | OK | `og:title`, `og:description` |
| MCP | "Les MCP : Donnez des super-pouvoirs a Claude Code" | OK | Non definis |
| Skills | "Skills" | OK | Non definis |
| Prompting | "Prompting" | OK | Non definis |
| Future | "Vision & Futur" | OK | Non definis |

**Problemes :**
- **`og:image` manquante** sur toutes les pages. Le CLAUDE.md exige "og:image sur chaque page". Les partages sur les reseaux sociaux n'auront pas de vignette.
- OG tags incomplets sur les pages MCP, Skills, Prompting, Future (seulement title + description defines dans le metadata export de la landing)
- `lang="fr"` correctement defini dans `layout.tsx`
- `robots: { index: true, follow: true }` correctement configure

### Semantique HTML

La hierarchie des headings est correcte (h1 unique par page, h2 pour les sections, h3 pour les sous-sections). Les `<section>` sont bien utilisees mais **sans heading implicite accessible** (le SectionHeading rend un `<div>` contenant un `<h2>`, pas directement enfant de `<section>`).

---

## 9. Securite des headers

### Configuration Nginx (`nginx/nginx.conf`)

| Header | Valeur | Evaluation |
|--------|--------|------------|
| `X-Frame-Options` | `SAMEORIGIN` | OK |
| `X-Content-Type-Options` | `nosniff` | OK |
| `X-XSS-Protection` | `1; mode=block` | **Deprecie** - supprime par Chrome/Edge, peut introduire des vulnerabilites dans d'anciens navigateurs. Supprimer ce header. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | OK |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | OK |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | **Attention** : HSTS est servi sur HTTP (port 8080). Ce header ne doit etre envoye que sur des connexions HTTPS, sinon il est ignore par les navigateurs et peut causer des confusions. |
| `Content-Security-Policy` | Detaillee ci-dessous | A ameliorer |
| `server_tokens` | `off` | OK |

### CSP - Detail

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
```

**Point d'attention :** `script-src 'unsafe-inline'` est necessaire pour Next.js SSG mais reduit la protection XSS. En SSG pur, il serait possible d'utiliser des nonces ou de generer les scripts inline differemment.

### Docker

- **Non-root user** : `USER nginx` -- OK
- **Read-only filesystem** dans docker-compose (avec tmpfs pour les caches) -- OK
- **`no-new-privileges`** dans docker-compose -- OK

---

## 10. Contenu & UX Writing

### Ton & Voix

Le ton est **accessible, enthousiaste et inclusif**. Les analogies sont bien choisies :
- "Claude Code est un expert enferme dans une piece" (pour les MCP)
- "Une recette pour Claude" (pour les Skills)
- "Comme deleguer a un collegue brillant" (pour le prompting)

Le contenu respecte parfaitement les directives du CLAUDE.md : jamais condescendant, adresse aussi bien aux debutants qu'aux experts.

### Call-to-actions

Les CTAs sont clairs et bien hierarchises :
- **Primaire** : "Commencer le guide" (gradient, ombre)
- **Secondaire** : "Decouvrir les MCP" (outline)
- **Contextuel** : "Commencer ce parcours" (dans PathCards)

**Probleme :** La page Prompting (la plus longue) se termine avec un CTA faible ("Retour a l'accueil"). Un CTA vers un exercice pratique serait plus engageant.

### Consistance terminologique

Le site alterne entre "Claude Code" et "Claude" de facon acceptable. Les termes techniques (MCP, Skills, prompting) sont toujours accompagnes d'explications.

**Probleme mineur :** "Skills" est parfois en anglais, parfois explique comme "competences". "Built-in Skills" n'est pas traduit.

### Accents manquants

Le texte francais **n'a pas d'accents** de maniere systematique : "Maitrisez" au lieu de "Maitrisez", "Demarrer" au lieu de "Demarrer", "Creer" au lieu de "Creer". Pour un site francophone visant un public large, les accents sont attendus et impactent aussi le SEO en francais.

---

## 11. Points forts

1. **Architecture de code clean** : composants decouplees, un par fichier, TypeScript strict, pas de `any`. Le code suit les conventions du CLAUDE.md.

2. **Design system coherent** : tokens de couleur (brand, accent), classes utilitaires (glass, glass-card, text-gradient, glow), composants UI forment un systeme reutilisable.

3. **Contenu editorial de grande qualite** : chaque page suit la structure intro/corps/prochaines etapes. Les analogies sont pedagogiques et accessibles.

4. **Parcours utilisateur par niveaux** : segmentation Debutant/Intermediaire/Avance bien pensee avec les PathCards.

5. **Dark mode reussi** : theme principal soigne, contrastes corrects, gradients subtils ajoutant de la profondeur.

6. **`prefers-reduced-motion` implemente** : souvent oublie, c'est correctement gere dans `globals.css`.

7. **Securite du deploiement solide** : headers Nginx complets, Docker non-root, read-only filesystem.

8. **Metadata SEO de base** : chaque page a ses `title` et `description` via exports `metadata`.

9. **Rythme visuel** : alternance fond blanc/teinte entre sections aide a scanner le contenu.

10. **Font loading optimise** : `display: "swap"` via `next/font` avec self-hosting automatique.

---

## 12. Points d'amelioration - Plan d'action

### CRITIQUE (a corriger immediatement)

| # | Probleme | Fichier | Recommandation |
|---|----------|---------|----------------|
| C1 | **Pas de bouton "copier le code"** dans CodeBlock. L'import `Copy` est mort. | `src/components/ui/CodeBlock.tsx` | Implementer `navigator.clipboard.writeText()` avec feedback visuel. Ajouter la coloration syntaxique (shiki/prism). |
| C2 | **Navigation clavier piegee** : liens du menu mobile focusables quand ferme | `src/components/layout/Header.tsx` | Ajouter `inert` ou `aria-hidden` + `tabIndex={-1}` quand `mobileOpen === false`. |
| C3 | **Pas d'indicateur de page active** dans le header | `src/components/layout/Header.tsx` | Utiliser `usePathname()` de `next/navigation` et appliquer un style distinct sur le lien actif. |
| C4 | **Classes Tailwind dynamiques** non detectees au purge | `src/components/ui/PathCard.tsx:81` | Remplacer l'interpolation par un objet de mapping statique. |
| C5 | **Echec WCAG AA** : `text-brand-500` sur fond blanc (ratio 2.9:1) | Tous les composants utilisant `text-brand-*` en light mode | Utiliser `text-brand-700` ou `text-brand-800` sur fond blanc. Creer des variantes light-mode specifiques. |
| C6 | **Echec WCAG critique** : `text-brand-300` sur badges light (ratio 1.8:1) | Hero badges, `SectionHeading.tsx` | Remplacer par `text-brand-700` en light mode ou utiliser un fond sombre pour les badges. |

### IMPORTANT (a traiter rapidement)

| # | Probleme | Fichier(s) | Recommandation |
|---|----------|------------|----------------|
| I1 | **Pas de sidebar/TOC** sur les pages longues | Nouveau composant | Creer un composant `TableOfContents` sticky avec ancres et indicateur de section active. |
| I2 | **Pas de coloration syntaxique** dans CodeBlock | `CodeBlock.tsx` | Integrer `shiki` ou `prism-react-renderer`. |
| I3 | **Touch targets sous-dimensionnes** (36px) | `ThemeToggle.tsx`, `Header.tsx` | Augmenter a `h-11 w-11` (44px) ou ajouter du padding invisible. |
| I4 | **Focus visible non explicite** | `globals.css` | Ajouter des styles `focus-visible:ring-2 ring-brand-500` globaux. |
| I5 | **Light mode sous-travaille** | `globals.css`, cards | Augmenter opacite des bordures, ajouter ombres subtiles sur cards, adoucir transition hero. |
| I6 | **Texte trop petit** (`text-sm`) dans le body des cards | Tous les composants card | Passer a `text-base` pour le contenu descriptif principal. |
| I7 | **`og:image` manquante** sur toutes les pages | `layout.tsx` + pages | Generer une og:image par page (ou une generique) et l'ajouter aux metadata. |
| I8 | **Chunk `lucide-react` surdimensionne** (~169 KB) | `package.json`, imports | Utiliser des imports individuels (`lucide-react/icons/Terminal`) ou migrer vers `@lucide/react` pour un meilleur treeshaking. |

### NICE-TO-HAVE (ameliorations qualite)

| # | Probleme | Recommandation |
|---|----------|----------------|
| N1 | Pas d'animations au scroll | Ajouter framer-motion avec `useInView` pour des animations "reveal on scroll". |
| N2 | Pas de bouton "retour en haut" | Ajouter un `ScrollToTop` flottant sur les pages longues. |
| N3 | Temoignages potentiellement fictifs | Si fictifs, ajouter une mention discrete pour la transparence. |
| N4 | Pas de skip-to-content link | Ajouter un lien invisible "Aller au contenu" qui apparait au premier Tab. |
| N5 | Lien GitHub footer pointe vers le repo Anthropic | Pointer vers le repo de The Claude Codex si c'est un projet distinct. |
| N6 | Icones Lucide sans `aria-hidden="true"` | Ajouter `aria-hidden="true"` sur les icones decoratives. |
| N7 | Pas de page 404 personnalisee | Creer une page 404 alignee avec le design system. |
| N8 | Accents manquants dans le contenu francais | Ajouter les accents sur tous les textes du site pour le SEO et la credibilite. |
| N9 | **Pas de compression Brotli** dans Nginx | Ajouter `ngx_brotli` ou pre-compresser les assets en `.br` pour un gain de 15-20% sur gzip. |
| N10 | **HSTS servi sur HTTP** | Conditionner l'envoi du header HSTS aux connexions HTTPS uniquement, ou ajouter un bloc `listen 443 ssl`. |
| N11 | **`X-XSS-Protection` deprecie** | Supprimer ce header de `nginx.conf` -- il est ignore par les navigateurs modernes et peut introduire des vulnerabilites dans les anciens. |
| N12 | **`<nav>` sans `aria-label`** | Ajouter `aria-label="Navigation principale"` au `<nav>` du Header pour distinguer les landmarks. |
| N13 | **Groupes de liens du Footer sans `<nav>`** | Encapsuler les listes de liens du footer dans des `<nav aria-label="...">` avec des labels descriptifs. |
| N14 | **PathCard nom accessible trop verbeux** | Ajouter un `aria-label` concis sur le lien englobant au lieu de laisser le lecteur d'ecran lire tout le contenu de la card. |
| N15 | **Valeurs hex en dur dans `globals.css`** dupliquant les tokens Tailwind | Remplacer les variables CSS hardcodees par des references aux tokens Tailwind pour eviter les desynchronisations. |
| N16 | **`new Date().getFullYear()` dans le Footer** evalue au build | En SSG, l'annee est figee au moment du build. Acceptable mais a documenter -- ou utiliser un composant client. |

---

## Annexe : Fichiers audites

| Fichier | Lignes | Role |
|---------|--------|------|
| `src/app/layout.tsx` | 61 | Layout principal, fonts, metadata |
| `src/app/globals.css` | 67 | Variables CSS, prefers-reduced-motion |
| `tailwind.config.ts` | 69 | Tokens couleur, animations custom |
| `src/app/page.tsx` | 358 | Landing page |
| `src/app/getting-started/page.tsx` | 813 | Guide d'installation |
| `src/app/mcp/page.tsx` | 683 | Page MCP |
| `src/app/skills/page.tsx` | 853 | Page Skills |
| `src/app/prompting/page.tsx` | 923 | Page Prompting |
| `src/app/future/page.tsx` | 586 | Page Vision & Futur |
| `src/components/layout/Header.tsx` | 86 | Navigation principale |
| `src/components/layout/Footer.tsx` | 112 | Pied de page |
| `src/components/layout/ThemeToggle.tsx` | 30 | Toggle dark/light mode |
| `src/components/layout/ThemeProvider.tsx` | 12 | Provider next-themes |
| `src/components/ui/SectionHeading.tsx` | 34 | Heading de section reutilisable |
| `src/components/ui/FeatureCard.tsx` | 48 | Card feature |
| `src/components/ui/PathCard.tsx` | 94 | Card parcours avec niveaux |
| `src/components/ui/TestimonialCard.tsx` | 30 | Card temoignage |
| `src/components/ui/AudienceCard.tsx` | 24 | Card audience |
| `src/components/ui/Callout.tsx` | 55 | Callout info/tip/warning |
| `src/components/ui/CodeBlock.tsx` | 28 | Bloc de code (problemes identifies) |
| `nginx/nginx.conf` | 95 | Configuration Nginx + security headers |
| `Dockerfile` | 43 | Build multi-stage |
| `docker-compose.yml` | 24 | Orchestration Docker |

---

*Rapport genere le 6 mars 2026 par Claude Code (Opus 4.6) avec les agents specialises UX Designer et Code Reviewer.*
