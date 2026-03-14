# EPIC Master — claude-codex.fr
> Genere le 14 mars 2026 — Base sur audit SEO + audit UI/UX

## Tableau de bord
| Metrique | Score actuel | Objectif |
|---|---|---|
| SEO Global | 86/100 | 90/100 |
| UI/UX Global | 77/100 | 90/100 |
| Performance | 95/100 | 98/100 |
| Accessibilite | 62/100 | AA WCAG (90+) |
| Contenu | 72/100 | 85/100 |
| Design & Coherence | 82/100 | 90/100 |

## Legende
- Critique — bloquant, a faire en priorite absolue
- Majeur — fort impact, sprint 1-2
- Modere — amelioration notable, sprint 3-4
- Mineur — polish, quand le reste est fait
- Effort : XS (1h) / S (2-4h) / M (1j) / L (2-3j) / XL (1 semaine)

## Analyse croisee : problemes detectes dans LES DEUX audits

| Probleme | Audit SEO | Audit UI/UX | Score priorite |
|---|---|---|---|
| Erreurs 404 RSC prefetch (186+) | CRIT-2 | CRITIQUE 4 | 10/10 |
| Mismatch aria-label / texte visible | label-content-name-mismatch | CRITIQUE 3 | 9/10 |
| Touch targets < 44px | Accessibilite mobile 96 | CRITIQUE 2 | 9/10 |
| Images/SVG sans attributs a11y | P2-9 alt descriptifs | Serieuse 5 aria-hidden | 7/10 |
| Contraste texte dark mode | Implicite (best practices) | Moderee 9 slate-400 | 6/10 |
| Footer incomplet | Maillage interne | Navigation incomplete | 5/10 |

---

# EPIC 1 — Performance & Core Web Vitals
**Priorite : Critique**
**Impact : SEO + UX**

## Contexte
Le site a d'excellents Core Web Vitals (LCP 126ms, CLS 0.00, TTFB 1ms) mais 186+ erreurs console 404 liees au prefetch RSC de Next.js degradent le score Lighthouse "errors-in-console" (score 0), gaspillent de la bande passante et polluent les logs serveur. Les assets Next.js ont un cache trop court (15h au lieu d'1 an).

## Stories

### STORY 1.1 — Corriger les erreurs RSC prefetch 404
- **Priorite :** Critique
- **Effort :** S
- **Probleme :** Chaque navigation declenche 8-18 requetes 404 vers des fichiers `.txt?_rsc=`. 186+ erreurs au total. Score Lighthouse "errors-in-console" = 0. Detecte dans les DEUX audits.
- **Solution :** Configurer le serveur Nginx pour retourner un 204 sur ces requetes RSC, ou desactiver le prefetch agressif dans Next.js.
- **Code :**
```nginx
# nginx.conf — Bloquer les requetes RSC prefetch qui generent des 404
location ~* \.txt$ {
    if ($arg__rsc) {
        return 204;
    }
}
```
Alternative cote Next.js :
```tsx
// Desactiver le prefetch sur les Link
<Link href="/getting-started" prefetch={false}>Demarrer</Link>
```
- **Critere d'acceptance :** Zero erreur 404 dans la console DevTools apres navigation sur 5 pages. Score Lighthouse "errors-in-console" > 0.
- **Source :** Les deux (SEO CRIT-2 + UI/UX CRITIQUE 4)

### STORY 1.2 — Configurer le cache longue duree des assets Next.js
- **Priorite :** Majeur
- **Effort :** XS
- **Probleme :** Les assets `_next/static/*` et les fonts woff2 ont un TTL de ~15h (54523s) au lieu d'1 an. Les visiteurs recurrents re-telecharger inutilement.
- **Solution :** Configurer `Cache-Control: max-age=31536000, immutable` sur les assets hashes de Next.js.
- **Code :**
```nginx
# nginx.conf
location /_next/static/ {
    expires 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.(woff2|woff)$ {
    expires 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```
- **Critere d'acceptance :** Headers `Cache-Control` corrects visibles dans DevTools Network pour les assets `_next/static/*` et les fonts.
- **Source :** SEO (Quick Win 4, P2-8)

### STORY 1.3 — Corriger le cache Matomo
- **Priorite :** Mineur
- **Effort :** XS
- **Probleme :** `matomo.js` (servi depuis tellebma.fr) a un TTL de 0 seconde. Chaque page load le re-telecharge.
- **Solution :** Configurer le cache Matomo cote serveur a au moins 1h.
- **Code :**
```nginx
# Sur le serveur Matomo (tellebma.fr)
location /matomo.js {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```
- **Critere d'acceptance :** Header `Cache-Control` de matomo.js affiche un max-age >= 3600.
- **Source :** SEO (Quick Win 8)

### STORY 1.4 — Ajouter lazy loading sur les images below the fold
- **Priorite :** Modere
- **Effort :** XS
- **Probleme :** Les images et SVG below the fold ne sont pas en lazy loading, bien que l'impact soit limite car la plupart sont des SVG inline.
- **Solution :** Ajouter `loading="lazy"` sur les images non-critiques.
- **Critere d'acceptance :** Toutes les images en dessous du premier viewport ont `loading="lazy"`.
- **Source :** UI/UX (Quick Win 4)

---

# EPIC 2 — SEO Technique
**Priorite : Critique**
**Impact : SEO**

## Contexte
Le site a un excellent score Lighthouse SEO (100/100) mais il manque un robots.txt, certains titles depassent 60 caracteres, et le glossaire n'a pas de BreadcrumbList. Ces corrections sont rapides et ont un impact direct sur l'indexation.

## Stories

### STORY 2.1 — Creer le fichier robots.txt
- **Priorite :** Critique
- **Effort :** XS
- **Probleme :** Le robots.txt retourne un 404. Les moteurs de recherche n'ont aucune directive de crawl et ne trouvent pas le lien vers le sitemap.
- **Solution :** Creer `/public/robots.txt` avec la directive Sitemap.
- **Code :**
```
User-agent: *
Allow: /

Sitemap: https://claude-codex.fr/sitemap.xml
```
- **Critere d'acceptance :** `https://claude-codex.fr/robots.txt` retourne un 200 avec le contenu correct.
- **Source :** SEO (CRIT-1)

### STORY 2.2 — Raccourcir les titles > 60 caracteres
- **Priorite :** Majeur
- **Effort :** XS
- **Probleme :** 5 pages ont des titles trop longs pour les SERP : /enterprise (80c), /limits (75c), /skills (71c), /glossary (69c), /mcp (68c). Google tronque au-dela de ~60 caracteres.
- **Solution :** Reformuler les titles pour rester sous 60 caracteres.
- **Code :**
```
/enterprise : "Claude Code en entreprise | The Claude Codex" (47c)
/limits     : "Limites de Claude Code | The Claude Codex" (43c)
/skills     : "Les Skills Claude Code | The Claude Codex" (43c)
/glossary   : "Glossaire IA & Claude Code | The Claude Codex" (48c)
/mcp        : "Les MCP pour Claude Code | The Claude Codex" (46c)
```
- **Critere d'acceptance :** Tous les titles font moins de 60 caracteres. Verifiable via `document.title.length` dans la console.
- **Source :** SEO (P1-5)

### STORY 2.3 — Ajouter BreadcrumbList au glossaire
- **Priorite :** Modere
- **Effort :** XS
- **Probleme :** Le glossaire est la seule page de contenu sans schema BreadcrumbList. Le breadcrumb est affiche visuellement mais pas en JSON-LD.
- **Solution :** Ajouter le schema BreadcrumbList dans la page /glossary.
- **Code :**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://claude-codex.fr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Glossaire",
      "item": "https://claude-codex.fr/glossary"
    }
  ]
}
```
- **Critere d'acceptance :** Rich Results Test de Google valide le BreadcrumbList sur /glossary.
- **Source :** SEO (Quick Win 7)

---

# EPIC 3 — Metadonnees & Donnees Structurees
**Priorite : Majeur**
**Impact : SEO**

## Contexte
Le site a deja des schemas WebSite, BreadcrumbList, Article et HowTo sur la plupart des pages. Mais il manque un schema Organization (E-E-A-T), un SearchAction sur la homepage, et des schemas specifiques pour le glossaire (DefinedTermSet), les FAQ (FAQPage) et les parcours (Course).

## Stories

### STORY 3.1 — Ajouter le schema Organization
- **Priorite :** Critique
- **Effort :** XS
- **Probleme :** Aucun schema Organization. Google ne peut pas identifier l'entite derriere le site, ce qui nuit aux signaux E-E-A-T et au Knowledge Panel.
- **Solution :** Ajouter un JSON-LD Organization dans le layout principal.
- **Code :**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Claude Codex",
  "url": "https://claude-codex.fr",
  "logo": {
    "@type": "ImageObject",
    "url": "https://claude-codex.fr/logo.png",
    "width": 512,
    "height": 512
  },
  "description": "Le guide de reference gratuit pour maitriser Claude Code. MCP, Skills, Prompting avance.",
  "sameAs": ["https://github.com/tellebma/The-Claude-Codex"],
  "founder": {
    "@type": "Person",
    "name": "tellebma",
    "url": "https://github.com/tellebma"
  }
}
```
- **Critere d'acceptance :** Schema Organization valide dans le Rich Results Test sur la homepage.
- **Source :** SEO (CRIT-3)

### STORY 3.2 — Ajouter SearchAction au schema WebSite
- **Priorite :** Majeur
- **Effort :** XS
- **Probleme :** Le schema WebSite n'a pas de `potentialAction` SearchAction. La barre de recherche Ctrl+K existe deja, mais Google ne le sait pas pour les sitelinks.
- **Solution :** Enrichir le schema WebSite existant avec un SearchAction.
- **Code :**
```json
{
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://claude-codex.fr/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
- **Critere d'acceptance :** Le schema WebSite sur la homepage contient `potentialAction` SearchAction valide.
- **Source :** SEO (Quick Win 3, P1-4)

### STORY 3.3 — Ajouter FAQPage sur les pages FAQ
- **Priorite :** Majeur
- **Effort :** S
- **Probleme :** Les pages /getting-started/faq-beginner et /enterprise n'ont pas de schema FAQPage. Potentiel de rich snippets FAQ dans les SERP.
- **Solution :** Ajouter un JSON-LD FAQPage sur les pages qui contiennent des sections FAQ.
- **Critere d'acceptance :** Rich Results Test valide FAQPage sur les pages concernees.
- **Source :** SEO (P2-7)

### STORY 3.4 — Ajouter DefinedTermSet sur le glossaire
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Le glossaire (2219 mots, 17 H2, 46 H3) n'a aucun schema specifique. Un DefinedTermSet ameliorerait la comprehension semantique par Google.
- **Solution :** Ajouter un JSON-LD DefinedTermSet avec les termes definis.
- **Code :**
```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "name": "Glossaire Claude Code et IA",
  "url": "https://claude-codex.fr/glossary",
  "inLanguage": "fr-FR",
  "hasDefinedTerm": [
    {
      "@type": "DefinedTerm",
      "name": "MCP (Model Context Protocol)",
      "description": "Protocole ouvert cree par Anthropic...",
      "url": "https://claude-codex.fr/glossary#mcp"
    }
  ]
}
```
- **Critere d'acceptance :** Schema DefinedTermSet valide sur /glossary.
- **Source :** SEO (P3-14 equivalent)

### STORY 3.5 — Ajouter Course/LearningResource sur les parcours
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Les parcours (Debutant, Intermediaire, Avance) n'ont pas de schema Course. Potentiel de rich results educatifs.
- **Solution :** Ajouter un JSON-LD Course sur chaque page de parcours.
- **Critere d'acceptance :** Schema Course valide sur les pages parcours.
- **Source :** SEO (P3-14)

### STORY 3.6 — Ajouter CollectionPage sur /content
- **Priorite :** Mineur
- **Effort :** XS
- **Probleme :** La page /content (hub d'articles) n'a pas de schema CollectionPage.
- **Solution :** Ajouter un JSON-LD CollectionPage.
- **Critere d'acceptance :** Schema CollectionPage valide sur /content.
- **Source :** SEO (tableau donnees structurees)

---

# EPIC 4 — Design System & Coherence Visuelle
**Priorite : Majeur**
**Impact : UX**

## Contexte
Le design system est globalement coherent (palette bien definie, spacing base sur 4px, border-radius et shadows homogenes). Mais il manque des tokens semantiques pour les couleurs d'etat, le contraste du texte secondaire en dark mode est limite, et la line-height du H1 hero est trop serree.

## Stories

### STORY 4.1 — Definir les tokens semantiques de couleur
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Les couleurs d'etat (success, warning, error, info) ne sont pas formalisees en tokens. Les surface tokens (card, elevated) manquent aussi.
- **Solution :** Ajouter des CSS variables semantiques dans globals.css.
- **Code :**
```css
:root {
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  --surface-card: rgba(30, 41, 59, 0.5);
  --surface-card-hover: rgba(30, 41, 59, 0.8);
  --surface-elevated: rgba(15, 23, 42, 0.9);
}
```
- **Critere d'acceptance :** Les nouveaux tokens sont utilises dans au moins 3 composants.
- **Source :** UI/UX (4.1 Recommandations palette)

### STORY 4.2 — Ameliorer le contraste texte dark mode
- **Priorite :** Majeur
- **Effort :** XS
- **Probleme :** Le texte secondaire en dark mode utilise `slate-400` (#94a3b8) sur fond quasi-noir. Ratio de contraste = ~5.8:1 (OK mais limite pour du texte long). Detecte dans les DEUX analyses.
- **Solution :** Passer a `slate-300` (#cbd5e1) pour le texte secondaire en dark mode, ratio = ~9:1.
- **Critere d'acceptance :** Ratio de contraste >= 7:1 pour tout texte secondaire en dark mode. Verifiable via l'outil DevTools contrast checker.
- **Source :** UI/UX (4.2 Recommandations + Moderee 9)

### STORY 4.3 — Corriger la line-height du H1 hero
- **Priorite :** Modere
- **Effort :** XS
- **Probleme :** Le H1 hero a `font-size: 72px` et `line-height: 72px` (ratio 1.0). C'est trop serre, surtout sur 2 lignes en mobile.
- **Solution :** Passer la line-height a `1.1` (soit ~80px).
- **Code :**
```css
/* Hero H1 */
.hero-title {
  line-height: 1.1; /* au lieu de 1.0 */
}
```
- **Critere d'acceptance :** Le H1 hero a un ratio line-height/font-size >= 1.1 sur tous les breakpoints.
- **Source :** UI/UX (4.2, 8.2)

### STORY 4.4 — Ajouter les focus states sur les cards interactives
- **Priorite :** Majeur
- **Effort :** S
- **Probleme :** Les feature cards, persona cards, parcours cards et preset cards n'ont pas de `focus-visible` distinct du hover. Les utilisateurs clavier ne voient pas quel element est selectionne.
- **Solution :** Ajouter `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2` sur toutes les cards interactives.
- **Code :**
```tsx
// Exemple pour les feature cards
<a href="/mcp"
  className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
>
```
- **Critere d'acceptance :** Navigation au clavier (Tab) montre un outline visible sur chaque card interactive.
- **Source :** UI/UX (Serieuse 4, 5.2)

### STORY 4.5 — Ajouter les etats active/pressed sur les cards
- **Priorite :** Mineur
- **Effort :** XS
- **Probleme :** Aucun feedback visuel au clic/tap sur les cards. L'utilisateur ne sait pas si son action a ete prise en compte.
- **Solution :** Ajouter `active:scale-[0.98]` ou `active:opacity-80` sur les cards cliquables.
- **Critere d'acceptance :** Un retour visuel est perceptible lors du clic sur n'importe quelle card.
- **Source :** UI/UX (5.2)

---

# EPIC 5 — Composants UI & Animations
**Priorite : Modere**
**Impact : UX**

## Contexte
Le site a 67 elements animes avec de bonnes pratiques (GPU-accelere, prefers-reduced-motion respecte). Cependant, le terminal hero est statique, les feature cards sont uniformes, et des composants de librairies modernes (Magic UI, Aceternity, ReactBits) pourraient renforcer l'identite tech/code du site.

## Stories

### STORY 5.1 — Remplacer le terminal statique par Magic UI Terminal
- **Priorite :** Majeur
- **Effort :** S
- **Probleme :** Le terminal hero est un mockup statique avec du texte pre-rempli. C'est la premiere chose que l'utilisateur voit.
- **Composant :** Magic UI `terminal`
- **Pourquoi :** Animation de typing realiste, parfaitement adaptee au theme CLI. Le terminal est l'element visuel central de la homepage.
- **Code :**
```bash
npx shadcn@latest add "https://magicui.design/r/terminal"
```
```tsx
import { Terminal } from "@/components/magicui/terminal";

<Terminal>
  <span className="text-cyan-400">$ claude</span>
  <span className="text-slate-400">{"> Cree-moi un site web moderne..."}</span>
  <span className="text-emerald-400">Bien sur ! Je vais creer votre projet...</span>
</Terminal>
```
- **Critere d'acceptance :** Le terminal hero affiche une animation de typing au chargement de la homepage.
- **Source :** UI/UX (6.1)

### STORY 5.2 — Convertir les feature cards en Bento Grid
- **Priorite :** Modere
- **Effort :** M
- **Probleme :** Les 8 feature cards sont dans une grille uniforme. Le layout ne met pas en valeur les fonctionnalites principales.
- **Composant :** Aceternity UI `bento-grid`
- **Pourquoi :** Un layout bento avec des tailles variees cree de la hierarchie visuelle et rend la section plus dynamique.
- **Code :**
```bash
npx shadcn@latest add https://ui.aceternity.com/registry/bento-grid.json
```
- **Critere d'acceptance :** Les feature cards utilisent un layout bento avec au moins 2 tailles differentes.
- **Source :** UI/UX (6.2)

### STORY 5.3 — Ajouter Animated Beam sur le schema MCP
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Le schema d'architecture MCP (Vous -> Claude -> MCP Server -> Service) est statique.
- **Composant :** Magic UI `animated-beam`
- **Pourquoi :** Illustre parfaitement le flux de donnees entre les composants du protocole MCP.
- **Code :**
```bash
npx shadcn@latest add "https://magicui.design/r/animated-beam"
```
- **Critere d'acceptance :** Le schema MCP montre des flux animes entre les noeuds.
- **Source :** UI/UX (6.3)

### STORY 5.4 — Ajouter Gradient Text anime sur le titre hero
- **Priorite :** Mineur
- **Effort :** S
- **Probleme :** Le titre hero utilise un gradient CSS statique. Un gradient anime ajouterait du dynamisme.
- **Composant :** ReactBits `gradient-text`
- **Pourquoi :** Animation subtile qui attire l'oeil sans etre intrusive, coherente avec l'identite visuelle cyan/ambre.
- **Code :**
```tsx
import { GradientText } from "@/components/reactbits/GradientText";

<h1>
  Maitrisez <GradientText colors={["#06b6d4", "#f59e0b", "#8b5cf6"]}>Claude Code</GradientText>
  en partant de zero
</h1>
```
- **Critere d'acceptance :** Le texte "Claude Code" dans le H1 affiche un gradient anime fluide.
- **Source :** UI/UX (6.4)

### STORY 5.5 — Ajouter Border Beam sur les parcours cards
- **Priorite :** Mineur
- **Effort :** S
- **Probleme :** Les 3 parcours cards (Debutant/Intermediaire/Avance) manquent d'un element distinctif pour attirer l'attention.
- **Composant :** Magic UI `border-beam`
- **Pourquoi :** Border anime coherent avec le theme tech/terminal, guide visuellement l'utilisateur vers l'action.
- **Code :**
```bash
npx shadcn@latest add "https://magicui.design/r/border-beam"
```
- **Critere d'acceptance :** Les cards parcours affichent un beam anime sur leur bordure.
- **Source :** UI/UX (6.5)

### STORY 5.6 — Ajouter Animated Grid Pattern sur le fond hero
- **Priorite :** Mineur
- **Effort :** S
- **Probleme :** Le fond du hero est un gradient subtil. Un grid pattern anime renforcerait l'identite tech.
- **Composant :** Magic UI `animated-grid-pattern`
- **Pourquoi :** Style "circuit board" qui s'integre naturellement au theme code/terminal.
- **Code :**
```bash
npx shadcn@latest add "https://magicui.design/r/animated-grid-pattern"
```
- **Critere d'acceptance :** Le fond du hero affiche un grid pattern anime subtil.
- **Source :** UI/UX (6.6)

### STORY 5.7 — Ajouter Decrypted Text sur les titres de section
- **Priorite :** Mineur
- **Effort :** S
- **Probleme :** Les titres de section apparaissent de maniere statique au scroll.
- **Composant :** ReactBits `decrypted-text`
- **Pourquoi :** Effet "decryptage" au scroll qui renforce le theme code/hacker tout en restant elegant.
- **Critere d'acceptance :** Les titres de section affichent un effet de decryptage a l'entree dans le viewport.
- **Source :** UI/UX (6.7)

### STORY 5.8 — Ajouter des skeleton loaders
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Aucun skeleton loader ni spinner. Bien que la navigation SPA soit instantanee, le chargement initial peut beneficier de skeletons.
- **Solution :** Ajouter des composants skeleton sur les sections de contenu principales.
- **Critere d'acceptance :** Un skeleton loader est visible pendant le chargement initial sur la homepage.
- **Source :** UI/UX (Quick Win 6, 8.5)

### STORY 5.9 — Ajouter un feedback visuel au bouton Copier le code
- **Priorite :** Modere
- **Effort :** XS
- **Probleme :** Le bouton "Copier le code" n'a pas de confirmation visuelle quand la copie est reussie.
- **Solution :** Ajouter un etat "Copie !" avec une icone check et une transition de 2 secondes.
- **Critere d'acceptance :** Apres clic sur "Copier", le bouton affiche "Copie !" pendant 2 secondes puis revient a l'etat initial.
- **Source :** UI/UX (8.5, Quick Win 11)

---

# EPIC 6 — Accessibilite WCAG 2.1 AA
**Priorite : Majeur**
**Impact : UX + SEO**

## Contexte
Le score Lighthouse Accessibility est de 96 (desktop) / 96 (mobile), mais l'audit accesslint revele un score reel de 62/100 avec 5 violations SERIOUS sur la homepage et 9 sur Getting Started. Les corrections portent sur les textes accessibles, les touch targets et les etats de focus.

## Stories

### STORY 6.1 — Ajouter aria-label au lien logo
- **Priorite :** Critique
- **Effort :** XS
- **Probleme :** Le lien logo dans la nav n'a pas de texte accessible. Sur mobile, le texte "The Claude Codex" est masque visuellement, rendant le lien completement inaccessible aux lecteurs d'ecran. Violation WCAG 2.4.4.
- **Solution :** Ajouter `aria-label="The Claude Codex - Accueil"` sur le lien logo.
- **Code :**
```html
<a class="flex items-center gap-2" href="/" aria-label="The Claude Codex - Accueil">
  <div class="h-8 w-8 ..." aria-hidden="true"><!-- icone --></div>
  <span>The Claude Codex</span>
</a>
```
- **Critere d'acceptance :** Un lecteur d'ecran annonce "The Claude Codex - Accueil, lien" sur le logo en desktop et mobile.
- **Source :** UI/UX (CRITIQUE 1)

### STORY 6.2 — Augmenter les touch targets a 44px
- **Priorite :** Critique
- **Effort :** XS
- **Probleme :** Les liens de navigation font 36px de hauteur (minimum WCAG : 44px). Les liens du footer font seulement 18px. Violation WCAG 2.5.8.
- **Solution :** Ajouter `min-height: 44px` et du padding vertical sur les liens nav et footer.
- **Code :**
```css
/* Navigation */
nav a {
  min-height: 44px;
  display: flex;
  align-items: center;
  padding-block: 0.5rem;
}

/* Footer */
footer a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding-block: 0.75rem;
}
```
- **Critere d'acceptance :** Tous les liens interactifs font au minimum 44x44px. Verifiable via DevTools Elements > Computed.
- **Source :** Les deux (UI/UX CRITIQUE 2 + SEO accessibilite mobile)

### STORY 6.3 — Corriger le mismatch aria-label / texte visible
- **Priorite :** Critique
- **Effort :** XS
- **Probleme :** Le bouton recherche a un aria-label different de son texte visible. Les cards parcours ont un aria-label court vs un contenu visible complet. Les utilisateurs de controle vocal ne peuvent pas activer ces elements. Violation WCAG 2.5.3. Detecte dans les DEUX audits.
- **Solution :** Retirer les `aria-label` redondants quand le contenu visible suffit.
- **Code :**
```html
<!-- Bouton recherche : retirer aria-label -->
<button>
  <svg aria-hidden="true">...</svg>
  <span>Rechercher...</span>
  <kbd aria-hidden="true">Ctrl K</kbd>
  <span class="sr-only">dans le site</span>
</button>

<!-- Cards parcours : retirer aria-label -->
<a href="/getting-started">
  <!-- Le contenu textuel sert de nom accessible naturellement -->
</a>
```
- **Critere d'acceptance :** Aucun mismatch aria-label/texte visible detecte par axe-core ou accesslint.
- **Source :** Les deux (UI/UX CRITIQUE 3 + SEO label-content-name-mismatch)

### STORY 6.4 — Ajouter aria-hidden sur les SVG decoratifs
- **Priorite :** Majeur
- **Effort :** XS
- **Probleme :** Certaines icones SVG decoratives n'ont pas `aria-hidden="true"` explicite. Les lecteurs d'ecran peuvent les annoncer inutilement.
- **Solution :** Ajouter `aria-hidden="true"` sur toutes les icones SVG purement decoratives.
- **Critere d'acceptance :** Toutes les icones SVG decoratives ont `aria-hidden="true"`.
- **Source :** Les deux (UI/UX Serieuse 5 + SEO P2-9)

### STORY 6.5 — Ajouter aria-current="page" sur le lien actif
- **Priorite :** Modere
- **Effort :** XS
- **Probleme :** Le lien de navigation correspondant a la page actuelle n'a pas `aria-current="page"`. Les lecteurs d'ecran ne peuvent pas informer l'utilisateur de sa position dans le site.
- **Solution :** Ajouter `aria-current="page"` dynamiquement sur le lien actif dans la navigation.
- **Critere d'acceptance :** Le lien de la page courante a `aria-current="page"` dans le HTML.
- **Source :** UI/UX (Moderee 8)

### STORY 6.6 — S'assurer que les cards cliquables ont un role adequat
- **Priorite :** Majeur
- **Effort :** XS
- **Probleme :** Certaines cards interactives pourraient ne pas avoir le `<a>` englobant tout leur contenu, causant des zones mortes au clic.
- **Solution :** Verifier que chaque card cliquable a un `<a>` qui englobe tout le contenu.
- **Critere d'acceptance :** Cliquer n'importe ou sur une card declenchera la navigation.
- **Source :** UI/UX (Serieuse 6)

---

# EPIC 7 — Responsive & Mobile
**Priorite : Majeur**
**Impact : UX + SEO**

## Contexte
Le comportement responsive est bon (score 78/100). Le menu mobile full-screen fonctionne, les cards s'empilent correctement. Les problemes sont concentres sur les touch targets (traite dans EPIC 6), le H1 hero en mobile (traite dans EPIC 4), et le footer qui pourrait etre enrichi.

## Stories

### STORY 7.1 — Enrichir le footer avec les liens manquants
- **Priorite :** Modere
- **Effort :** XS
- **Probleme :** Le footer a 3 colonnes (Brand, Guides, Ressources) mais il manque les liens vers le Glossaire et le Configurateur. Le menu "Plus" cache aussi 6 items importants.
- **Solution :** Ajouter les liens Glossaire et Configurateur dans la colonne Ressources du footer.
- **Critere d'acceptance :** Le footer contient des liens vers toutes les pages principales du site.
- **Source :** Les deux (UI/UX 9.1 + SEO maillage interne)

### STORY 7.2 — Reorganiser le menu "Plus" de la navigation
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Le menu "Plus" cache 6 items (Contenus, Limites, Reference, Configurateur, Glossaire, Vision). Le Configurateur est un outil unique du site et merite une visibilite directe.
- **Solution :** Exposer le Configurateur dans la nav principale et reorganiser les items du menu "Plus".
- **Critere d'acceptance :** Le Configurateur est visible dans la nav principale sans ouvrir le menu "Plus".
- **Source :** UI/UX (9.1 recommandation)

### STORY 7.3 — Ajouter un indicateur de scroll sur la homepage
- **Priorite :** Mineur
- **Effort :** XS
- **Probleme :** La homepage est longue et rien n'indique qu'il y a du contenu en dessous du fold.
- **Solution :** Ajouter une fleche ou un indicateur de scroll anime en bas du hero.
- **Critere d'acceptance :** Un indicateur visuel anime est present en bas du hero pour inviter au scroll.
- **Source :** UI/UX (Quick Win 12)

---

# EPIC 8 — Contenu & Semantique SEO
**Priorite : Modere**
**Impact : SEO**

## Contexte
Le contenu est le point le plus faible du SEO (72/100). 6 pages font moins de 400 mots, les signaux E-E-A-T sont insuffisants (pas de page A propos, pas d'auteur identifie, affirmations non sourcees), et les descriptions "Continuez votre apprentissage" sont quasi-identiques entre les pages.

## Stories

### STORY 8.1 — Etoffer les 6 pages trop fines (< 400 mots)
- **Priorite :** Majeur
- **Effort :** XL
- **Probleme :** 6 pages ont moins de 400 mots et risquent d'etre considerees comme "thin content" : /personas (319), /reference (330), /getting-started (354), /content (365), /use-cases (366), /advanced (370).
- **Solution :** Enrichir chaque page a minimum 800 mots avec du contenu unique et utile.
- **Critere d'acceptance :** Chaque page fait minimum 800 mots. Pas de contenu duplique entre les pages.
- **Source :** SEO (5.6, 5.7)

### STORY 8.2 — Creer une page "A propos / Qui sommes-nous"
- **Priorite :** Majeur
- **Effort :** M
- **Probleme :** Aucune page identifiant l'entite derriere le site. E-E-A-T Authority = 2/5. Google insiste sur "qui a cree ce contenu".
- **Solution :** Creer une page /about avec la mission, les contributeurs, leurs qualifications et des liens vers les profils d'expertise.
- **Critere d'acceptance :** La page /about est accessible depuis le footer et contient au minimum : mission, biographie, liens sociaux.
- **Source :** SEO (5.8 E-E-A-T)

### STORY 8.3 — Afficher les dates dans l'UI
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Les dates "datePublished" et "dateModified" existent en structured data mais ne sont pas visibles dans l'interface. L'utilisateur ne sait pas si le contenu est a jour.
- **Solution :** Afficher "Publie le X" et "Mis a jour le X" sous le titre de chaque article.
- **Critere d'acceptance :** Les dates sont visibles sur toutes les pages de contenu.
- **Source :** SEO (P2-11)

### STORY 8.4 — Sourcer les affirmations chiffrees
- **Priorite :** Modere
- **Effort :** S
- **Probleme :** Plusieurs affirmations ne sont pas sourcees : "70% du temps de redaction" (aucune source), "+55% task completion - GitHub (2024)" (pas de lien), "12x ROI" (auto-calcule).
- **Solution :** Ajouter des liens vers les etudes, rapports Anthropic ou sources GitHub pour chaque chiffre cite.
- **Critere d'acceptance :** Chaque affirmation chiffree a un lien source cliquable.
- **Source :** SEO (5.8, P2-12)

### STORY 8.5 — Varier les descriptions "Continuez votre apprentissage"
- **Priorite :** Mineur
- **Effort :** S
- **Probleme :** Les sections "Continuez votre apprentissage" en bas de page utilisent des descriptions quasi-identiques d'une page a l'autre. Contenu duplique partiel.
- **Solution :** Ecrire une description unique pour chaque page dans la section "Continuez votre apprentissage".
- **Critere d'acceptance :** Aucune description identique entre deux pages dans cette section.
- **Source :** SEO (5.6 contenu duplique)

### STORY 8.6 — Ajouter hreflang si version anglaise prevue
- **Priorite :** Mineur
- **Effort :** XS
- **Probleme :** Pas de balise hreflang. Si une version anglaise est prevue, l'infrastructure doit etre prete.
- **Solution :** Ajouter `<link rel="alternate" hreflang="fr" href="...">` et la version en quand elle existera.
- **Critere d'acceptance :** Balise hreflang presente sur toutes les pages (meme si seulement "fr" pour l'instant).
- **Source :** SEO (P2-10)

---

# EPIC 9 — Quick Wins (toutes categories)
**Priorite : A faire en premier**
**Effort total estime : < 1 journee**

Liste consolidee de TOUS les quick wins des deux audits, tries par ROI (impact / effort).

| # | Story | Action | Effort | Impact | Source |
|---|-------|--------|--------|--------|--------|
| 1 | 2.1 | Creer `/public/robots.txt` avec directive Sitemap | 5 min | Indexation | SEO |
| 2 | 6.1 | Ajouter `aria-label` au lien logo | 5 min | Accessibilite critique | UI/UX |
| 3 | 6.3 | Retirer les `aria-label` redondants des cards parcours | 10 min | Voice control fix | Les deux |
| 4 | 3.1 | Ajouter schema Organization JSON-LD | 15 min | E-E-A-T, Knowledge Panel | SEO |
| 5 | 3.2 | Ajouter SearchAction au schema WebSite | 15 min | Sitelinks searchbox | SEO |
| 6 | 2.2 | Raccourcir les titles > 60 caracteres | 15 min | CTR SERP | SEO |
| 7 | 2.3 | Ajouter BreadcrumbList au /glossary | 15 min | Rich results | SEO |
| 8 | 6.2 | Augmenter touch targets a 44px (nav + footer) | 15 min | WCAG 2.5.8 | Les deux |
| 9 | 4.2 | Passer texte dark mode de slate-400 a slate-300 | 20 min | Contraste WCAG | UI/UX |
| 10 | 6.5 | Ajouter `aria-current="page"` sur le lien actif | 20 min | Navigation a11y | UI/UX |
| 11 | 6.4 | Ajouter `aria-hidden="true"` aux SVG decoratifs | 30 min | Lecteurs d'ecran | Les deux |
| 12 | 4.3 | Corriger line-height H1 hero (1.0 -> 1.1) | 10 min | Lisibilite mobile | UI/UX |
| 13 | 7.1 | Enrichir le footer (Glossaire, Configurateur) | 30 min | Maillage + nav | Les deux |
| 14 | 1.2 | Configurer cache longue duree assets Next.js | 30 min | Performance revisites | SEO |
| 15 | 5.9 | Feedback visuel bouton Copier le code | 30 min | UX micro-interaction | UI/UX |
| 16 | 1.1 | Corriger les erreurs RSC prefetch 404 | 1-2h | Console, crawl, UX | Les deux |

**Effort total : ~5-6 heures** (hors STORY 1.1 qui peut necessiter plus de diagnostic)

---

## Roadmap d'iteration suggeree

### Sprint 1 — Semaine 1 (Fondations critiques)
- [ ] STORY 2.1 — Creer robots.txt
- [ ] STORY 1.1 — Corriger les erreurs RSC prefetch 404
- [ ] STORY 6.1 — Ajouter aria-label au lien logo
- [ ] STORY 6.2 — Augmenter les touch targets a 44px
- [ ] STORY 6.3 — Corriger le mismatch aria-label / texte visible
- [ ] STORY 3.1 — Ajouter schema Organization
- [ ] STORY 3.2 — Ajouter SearchAction au schema WebSite
- [ ] STORY 2.2 — Raccourcir les titles > 60 caracteres
- [ ] STORY 1.2 — Configurer cache longue duree assets
- [ ] STORY 4.2 — Ameliorer contraste texte dark mode
**Objectif :** Corriger tout ce qui bloque l'indexation, les Core Web Vitals et l'accessibilite critique.

### Sprint 2 — Semaine 2 (SEO & Structure)
- [ ] STORY 2.3 — BreadcrumbList glossaire
- [ ] STORY 3.3 — FAQPage sur les pages FAQ
- [ ] STORY 3.4 — DefinedTermSet glossaire
- [ ] STORY 3.5 — Course/LearningResource parcours
- [ ] STORY 3.6 — CollectionPage /content
- [ ] STORY 6.4 — aria-hidden SVG decoratifs
- [ ] STORY 6.5 — aria-current="page"
- [ ] STORY 7.1 — Enrichir le footer
- [ ] STORY 8.3 — Afficher les dates dans l'UI
- [ ] STORY 8.4 — Sourcer les affirmations chiffrees
**Objectif :** Optimiser les metadonnees, les donnees structurees et le maillage interne.

### Sprint 3 — Semaine 3 (UX & Design)
- [ ] STORY 4.1 — Tokens semantiques couleurs
- [ ] STORY 4.3 — Line-height H1 hero
- [ ] STORY 4.4 — Focus states cards interactives
- [ ] STORY 5.1 — Terminal Magic UI
- [ ] STORY 5.9 — Feedback bouton Copier
- [ ] STORY 7.2 — Reorganiser menu "Plus"
- [ ] STORY 5.8 — Skeleton loaders
**Objectif :** Ameliorer la coherence visuelle et les composants critiques.

### Sprint 4 — Semaine 4 (Accessibilite & Polish)
- [ ] STORY 6.6 — Cards cliquables role adequat
- [ ] STORY 4.5 — Etats active/pressed cards
- [ ] STORY 5.2 — Bento grid feature cards
- [ ] STORY 5.3 — Animated beam MCP
- [ ] STORY 5.4 — Gradient text hero
- [ ] STORY 7.3 — Indicateur de scroll homepage
- [ ] STORY 8.5 — Varier descriptions "Continuez"
**Objectif :** Atteindre WCAG AA et finaliser les composants UI.

### Long terme — Mois 2+
- [ ] STORY 8.1 — Etoffer les 6 pages fines (effort XL)
- [ ] STORY 8.2 — Creer page "A propos" (E-E-A-T)
- [ ] STORY 5.5 — Border beam parcours cards
- [ ] STORY 5.6 — Animated grid pattern hero
- [ ] STORY 5.7 — Decrypted text titres section
- [ ] STORY 8.6 — Ajouter hreflang
- [ ] STORY 1.3 — Corriger cache Matomo
- [ ] Blog avec articles reguliers (freshness signal)
- [ ] Pages auteur avec biographie (E-E-A-T)
- [ ] Flux RSS/Atom
- [ ] Design system documente (Storybook)
- [ ] Version anglaise du site (hreflang fr/en)

---

## Suivi de progression
| EPIC | Stories totales | Faites | % |
|---|---|---|---|
| EPIC 1 — Performance & Core Web Vitals | 4 | 4 | 100% |
| EPIC 2 — SEO Technique | 3 | 3 | 100% |
| EPIC 3 — Metadonnees & Donnees Structurees | 6 | 6 | 100% |
| EPIC 4 — Design System & Coherence Visuelle | 5 | 5 | 100% |
| EPIC 5 — Composants UI & Animations | 9 | 9 | 100% |
| EPIC 6 — Accessibilite WCAG 2.1 AA | 6 | 6 | 100% |
| EPIC 7 — Responsive & Mobile | 3 | 3 | 100% |
| EPIC 8 — Contenu & Semantique SEO | 6 | 0 | 0% |
| **TOTAL** | **42** | **36** | **86%** |
