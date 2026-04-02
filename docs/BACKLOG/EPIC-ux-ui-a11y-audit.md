# EPIC : Corrections UX, UI et Accessibilite

> Source : audit multi-agents (UX/Nielsen, UI/Design, A11y/WCAG) du site https://claude-codex.fr
> Date : 2026-03-30
> Duree estimee : 4 sprints
> Effort total : 34 story points (11 stories, 37 problemes consolides)

---

## Vision

Suite a un audit UX/UI/Accessibilite approfondi mene par 3 agents specialises, 37 problemes ont ete identifies sur le site The Claude Codex. Ces problemes ne sont pas detectes par les outils automatises (Lighthouse = 100/100 sur Accessibility, Best Practices et SEO, desktop ET mobile). Ils relevent de l'experience utilisateur reelle : contenu invisible en mode clair et sombre, elements visuellement interactifs mais non cliquables, contrastes textuels insuffisants, navigation clavier incomplete, et incoherences i18n.

### Scores Lighthouse actuels (reference)

| Metrique | Desktop | Mobile |
|----------|---------|--------|
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

Ces scores ne refletent pas les problemes manuels ci-dessous.

### Points positifs a conserver

- Skip link fonctionnel (`#main-content`)
- `aria-label` sur toutes les navigations
- `aria-current="page"` sur les liens actifs
- `prefers-reduced-motion` respecte globalement (CSS + JS hooks)
- SearchDialog avec pattern combobox complet (role, aria-activedescendant, etc.)
- Focus visible global bien defini
- Donnees structurees JSON-LD (BreadcrumbList, WebSite, Article)
- Cibles tactiles 44x44px sur la plupart des boutons

---

## Tableau consolide des 37 problemes

### Severite CRITIQUE (5)

| ID | Probleme | Regles violees | Fichiers concernes |
|---|---|---|---|
| P-01 | Sections landing invisibles en mode clair. Features sans fond, cartes glass-card bg-white sur bg-white, bordures 1.3:1, bg-slate-50/50 invisible. | Nielsen H8, Contraste, WCAG 1.4.11 | `page.tsx`, `globals.css`, `FeatureCard.tsx`, `AudienceCard.tsx` |
| P-02 | Sections landing invisibles en dark mode. Cartes dark:bg-slate-800/60 sur slate-950, opacites inchoerentes (/60, /50). | Nielsen H8, Contraste dark | `globals.css`, `AudienceCard.tsx`, `Card.tsx` (MDX) |
| P-03 | 7 FeatureCards sur 8 non cliquables mais avec styles interactifs (hover:-translate-y-1, hover:shadow-lg, active:scale-[0.98]). | Nielsen H4, WCAG 3.2.4 | `FeatureCard.tsx` (L34) |
| P-04 | Contraste text-slate-400 (#94a3b8) sur fond clair : ratio ~2.9:1 (minimum 4.5:1). | WCAG 1.4.3 | Multiples composants |
| P-05 | Contraste text-brand-500 (#06b6d4) sur blanc : ratio ~2.8:1. Gradients .text-gradient. | WCAG 1.4.3 | `globals.css` (.text-gradient) |

### Severite MAJEUR (14)

| ID | Probleme | Regles violees | Fichiers concernes |
|---|---|---|---|
| P-06 | Navigation header surchargee : 14 liens (9 visibles + 5 dans "Plus") sur breakpoint lg (1024px). | Nielsen H8, Responsive | `Header.tsx` (L13-31) |
| P-07 | Dropdown "Plus" sans pattern ARIA menu, sans navigation clavier fleches. | WCAG 4.1.2 + 2.1.1 | `Header.tsx` (MoreDropdown) |
| P-08 | AudienceCards non cliquables mais avec styles hover interactifs. | Nielsen H4/H7, WCAG 3.2.4 | `AudienceCard.tsx` (L11) |
| P-09 | Texte body MDX trop clair (text-slate-600 / dark:text-slate-300) pour lecture prolongee. | Lisibilite, WCAG 1.4.3 | `MdxComponents.tsx` (L89, L93, L99) |
| P-10 | Pas de focus trap dans la modale SearchDialog. Tab sort de la modale. | WCAG 2.4.3 + 2.1.2 | `SearchDialog.tsx` |
| P-11 | Espacement vertical excessif py-20 sm:py-28 sur chaque section (>1000px de padding cumule). | Rythme vertical | `page.tsx` (landing) |
| P-12 | Page /about hors i18n : pas sous [locale], pas de lang, contenu hardcode FR. | WCAG 3.1.1 | `app/about/page.tsx` |
| P-13 | Page 404 en francais uniquement, hors systeme i18n. | WCAG 3.1.1 | `app/not-found.tsx` |
| P-14 | Liens externes sans indication d'ouverture dans un nouvel onglet pour les lecteurs d'ecran. | WCAG 1.3.1 + 4.1.2 | `Footer.tsx`, `MdxComponents.tsx` |
| P-15 | PathCard : lien geant englobant tout le contenu = nom accessible verbeux. | WCAG 2.4.4 + 4.1.2 | `PathCard.tsx` |
| P-16 | Pas d'indicateur de progression dans les parcours documentation. | Nielsen H1 | `SectionSidebar.tsx` |
| P-17 | Pas d'annonce aria-live pour le nombre de resultats de recherche. | WCAG 4.1.3 | `SearchDialog.tsx` |
| P-18 | Hero getting-started et section "Et ensuite" forces en dark (bg-slate-950 en dur). | Coherence dark/light | `getting-started/page.tsx` |
| P-19 | Pas de lien entre section "Parcours" de la landing et les pages reelles (perte de contexte). | Nielsen H6 | `page.tsx` (landing), pages de destination |

### Severite MINEUR (18)

| ID | Probleme | Regles violees | Fichiers concernes |
|---|---|---|---|
| P-20 | Traductions FR manquantes d'accents : "Demarrer", "resultat", "mot-cle". | Nielsen H4 | `messages/fr.json` |
| P-21 | Footer : h3 sans h2 parent (saut de niveau). | WCAG 1.3.1 | `Footer.tsx` |
| P-22 | LanguageSwitcher : cibles tactiles ~24x20px (minimum 44x44). | WCAG 2.5.5 | `LanguageSwitcher.tsx` |
| P-23 | ScrollToTop/TableOfContents : behavior:"smooth" JS ignore prefers-reduced-motion. | WCAG 2.3.3 | `ScrollToTop.tsx`, `TableOfContents.tsx` |
| P-24 | VideoEmbed : aria-label hardcode en francais, pas i18n. | WCAG 3.1.2 | `VideoEmbed.tsx` |
| P-25 | Callout : role="note" non standard, support inegal. | WCAG 4.1.2 | `Callout.tsx` |
| P-26 | Menu mobile max-h-[30rem] fixe, peut tronquer 14 items. | Nielsen H3 | `Header.tsx` |
| P-27 | Scroll indicator (chevron) anime mais non interactif, pattern date. | Nielsen H4 | `page.tsx` (landing) |
| P-28 | CTA secondaire hero : hover quasi invisible en mode clair (rgba 0,0,0,0.03). | Nielsen H1 | `globals.css`, `page.tsx` |
| P-29 | Favicon 404 en console (pas de favicon.ico dans /public/). | Nielsen H1 | `/public/` |
| P-30 | Footer trop dense sur mobile (~900px, 20 elements empiles). | Responsive | `Footer.tsx` |
| P-31 | prefers-reduced-motion : animation-delay non couvert. | Accessibilite motion | `globals.css` |
| P-32 | Longueur de ligne non contrainte dans les pages MDX (90+ caracteres). | Lisibilite | `SectionLayout.tsx` |
| P-33 | Bouton copier CodeBlock : cible tactile potentiellement < 44x44. | WCAG 2.5.5 | `CodeBlock.tsx` |
| P-34 | Body scroll verrouille sans compensation scrollbar (saut de layout). | Nielsen H5 | `SearchDialog.tsx` |
| P-35 | Menu mobile : pas de gestion du focus a l'ouverture. | WCAG 2.4.3 | `Header.tsx` |
| P-36 | Recherche "aucun resultat" sans suggestions d'aide. | Nielsen H9 | `SearchDialog.tsx` |
| P-37 | Gradients d'icones FeatureCard trop subtils en light (brand-500/20 to /5). | Hierarchie visuelle | `FeatureCard.tsx` |

---

## Priorisation MoSCoW

### MUST HAVE (8 SP, Sprint 1)

| ID | Story | SP | Problemes couverts |
|----|-------|----|---|
| US-1 | Hierarchie visuelle sections/cartes landing | 3 | P-01, P-02, P-37 |
| US-2 | Contrastes textuels WCAG AA | 3 | P-04, P-05, P-09 |
| US-3 | Coherence styles interactifs cartes | 2 | P-03, P-08 |

### SHOULD HAVE (13 SP, Sprint 2)

| ID | Story | SP | Problemes couverts |
|----|-------|----|---|
| US-4 | Navigation header et ARIA dropdown | 5 | P-06, P-07, P-26, P-35 |
| US-5 | Focus trap et accessibilite recherche | 3 | P-10, P-17, P-34, P-36 |
| US-6 | Pages hors i18n et traductions | 5 | P-12, P-13, P-20, P-24 |

### COULD HAVE (11 SP, Sprint 3)

| ID | Story | SP | Problemes couverts |
|----|-------|----|---|
| US-7 | Coherence dark/light pages section | 3 | P-18 |
| US-8 | Indicateur de progression parcours | 3 | P-16, P-19 |
| US-9 | Espacement vertical et responsive | 2 | P-11, P-30, P-32 |
| US-10 | Liens externes et semantique ARIA | 3 | P-14, P-15, P-25, P-21 |

### WON'T HAVE (Sprint 4, si temps)

| ID | Story | SP | Problemes couverts |
|----|-------|----|---|
| US-11 | Corrections mineures de polish | 2 | P-22, P-23, P-27, P-28, P-29, P-31, P-33 |

---

## Sprint Planning

### Sprint 1 : Critiques visuels et contrastes — ⬜ 8 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-1 | Hierarchie visuelle sections/cartes landing | 3 | ⬜ A faire |
| US-2 | Contrastes textuels WCAG AA | 3 | ⬜ A faire |
| US-3 | Coherence styles interactifs cartes | 2 | ⬜ A faire |

### Sprint 2 : Navigation, recherche et i18n — ⬜ 13 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-4 | Navigation header et ARIA dropdown | 5 | ⬜ A faire |
| US-5 | Focus trap et accessibilite recherche | 3 | ⬜ A faire |
| US-6 | Pages hors i18n et traductions | 5 | ⬜ A faire |

### Sprint 3 : Coherence visuelle et ergonomie — ⬜ 11 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-7 | Coherence dark/light pages section | 3 | ⬜ A faire |
| US-8 | Indicateur de progression parcours | 3 | ⬜ A faire |
| US-9 | Espacement vertical et responsive | 2 | ⬜ A faire |
| US-10 | Liens externes et semantique ARIA | 3 | ⬜ A faire |

### Sprint 4 : Polish — ⬜ 2 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| US-11 | Corrections mineures de polish | 2 | ⬜ A faire |

---

## User Stories detaillees

### US-1 : Hierarchie visuelle sections/cartes landing (3 SP) — CRITIQUE

> En tant que **visiteur de la landing page**, je veux distinguer clairement chaque section et chaque carte du fond de page, afin de pouvoir scanner le contenu rapidement sans effort visuel.

**Expert(s) mobilise(s) : Expert Frontend CSS + Expert UX/UI Designer**

**Criteres d'acceptation :**
- [ ] Mode clair : sections alternees (`bg-white` / `bg-slate-50`), cartes avec bordures `border-slate-300` ou `shadow-md`
- [ ] Mode sombre : cartes opaques `dark:bg-slate-800` (pas d'opacite partielle), bordures `dark:border-slate-600/50`
- [ ] CSS variables `--surface-card` et `--surface-card-hover` (deja definies dans globals.css) appliquees dans `.glass-card`
- [ ] Toutes les variantes de cartes (FeatureCard, AudienceCard, MDX Card, glass-card) partagent le meme token de fond
- [ ] Icones FeatureCard en couleurs opaques (`from-brand-100 to-brand-50`) au lieu de transparentes (`from-brand-500/20`)
- [ ] Separateurs visuels entre sections (fonds alternes et/ou dividers gradient)
- [ ] Verification visuelle sur les 5 sections de la landing en mode clair ET sombre, desktop ET mobile

**Fichiers concernes :**
- `src/app/globals.css` (glass-card L114, CSS variables)
- `src/app/[locale]/page.tsx` (L173, L243 : fonds de section)
- `src/components/ui/FeatureCard.tsx` (fonds d'icones)
- `src/components/ui/AudienceCard.tsx` (fond de carte)
- `src/components/mdx/Card.tsx` (fond de carte MDX)

---

### US-2 : Contrastes textuels WCAG AA (3 SP) — CRITIQUE

> En tant qu'**utilisateur malvoyant ou consultant le site en plein soleil**, je veux que tous les textes respectent un ratio de contraste minimum de 4.5:1, afin de pouvoir lire le contenu sans difficulte.

**Expert(s) mobilise(s) : Expert Frontend CSS + Expert QA**

**Criteres d'acceptation :**
- [ ] `text-slate-400` remplace par `text-slate-500` (#64748b, ratio ~4.6:1) pour tout texte informatif
- [ ] Textes `brand-500` sur blanc remplaces par `brand-700` (#0e7490, ratio ~5.3:1)
- [ ] Fallback `.text-gradient` utilise `color: #0e7490` (brand-700)
- [ ] Body MDX passe de `text-slate-600` / `dark:text-slate-300` a `text-slate-700` / `dark:text-slate-200` (p, ul, ol, blockquote)
- [ ] Texte `text-slate-500` sur `bg-slate-50` remplace par `text-slate-600`
- [ ] Chaque correction verifiee avec un outil de contraste (ratio >= 4.5:1 normal, >= 3:1 large)

**Fichiers concernes :**
- `src/app/globals.css` (.text-gradient L96-100)
- `src/components/mdx/MdxComponents.tsx` (L89, L93, L99 : p, ul, ol, blockquote)
- Composants utilisant `text-slate-400` (audit grep necessaire)

---

### US-3 : Coherence styles interactifs cartes (2 SP) — CRITIQUE

> En tant que **visiteur de la landing page**, je veux que seuls les elements cliquables aient une apparence interactive (hover, translate, scale), afin de ne pas etre induit en erreur par de fausses affordances.

**Expert(s) mobilise(s) : Expert TypeScript/React + Expert UX/UI Designer**

**Criteres d'acceptation :**
- [ ] FeatureCards : option A (preferee) : chaque carte recoit un `href` vers sa section correspondante (ex: "Creer un site web" -> `/getting-started`, "Automatiser" -> `/skills`). OU option B : styles interactifs retires des div non-lien.
- [ ] AudienceCards : `hover:border-brand-500/30` et `hover:shadow-md` supprimes (cartes informatives)
- [ ] Test visuel : survol des cartes non-lien = aucun changement visuel suggerant un clic
- [ ] Les cartes qui restent des liens conservent cursor: pointer et un etat hover clair

**Fichiers concernes :**
- `src/components/ui/FeatureCard.tsx` (L34 : sharedClassName)
- `src/components/ui/AudienceCard.tsx` (L11 : styles hover)

---

### US-4 : Navigation header et ARIA dropdown (5 SP) — MAJEUR

> En tant qu'**utilisateur naviguant au clavier ou avec un lecteur d'ecran**, je veux pouvoir parcourir la navigation principale de facon fluide et previsible, afin d'acceder rapidement a n'importe quelle section du site.

**Expert(s) mobilise(s) : Expert TypeScript/React + Expert QA**

**Criteres d'acceptation :**
- [ ] Header desktop : 6-7 items visibles max (regroupement en categories ou breakpoint xl)
- [ ] Dropdown "Plus" : `role="menu"` sur le conteneur, `role="menuitem"` sur chaque lien, fleches haut/bas, Home/End, Escape, Tab quitte le menu
- [ ] Menu mobile : `max-h-[calc(100vh-4rem)] overflow-y-auto` au lieu de `max-h-[30rem]`
- [ ] Focus sur premier lien a l'ouverture du menu mobile, retour sur bouton a la fermeture
- [ ] Verification au clavier : navigation complete sans souris

**Fichiers concernes :**
- `src/components/layout/Header.tsx` (L13-31 navigation, L37-112 MoreDropdown, L165-185 mobile menu)

---

### US-5 : Focus trap et accessibilite recherche (3 SP) — MAJEUR

> En tant qu'**utilisateur de la recherche (clavier ou lecteur d'ecran)**, je veux que la modale piege le focus et annonce les resultats, afin de ne pas perdre ma position dans la page.

**Expert(s) mobilise(s) : Expert TypeScript/React + Expert QA**

**Criteres d'acceptation :**
- [ ] Focus trap en place : Tab/Shift+Tab ne sort jamais de la modale
- [ ] `<div role="status" aria-live="polite" className="sr-only">` annonce le nombre de resultats
- [ ] Etat "aucun resultat" : 3-4 liens suggestifs vers les pages populaires
- [ ] `scrollbar-gutter: stable` ou compensation padding-right pour eviter le saut de layout
- [ ] Verification : Ctrl+K, taper, naviguer aux fleches, Tab reste dans la modale

**Fichiers concernes :**
- `src/components/ui/SearchDialog.tsx` (L107-116 scroll lock, L136-278 modale, L182-189 no results)
- `src/app/globals.css` (scrollbar-gutter)

---

### US-6 : Pages hors i18n et traductions (5 SP) — MAJEUR

> En tant qu'**utilisateur anglophone**, je veux que toutes les pages du site soient dans ma langue, afin de ne pas rencontrer de contenu francais non traduit.

**Expert(s) mobilise(s) : Expert i18n + Expert Contenu MDX**

**Criteres d'acceptation :**
- [ ] Page `/about` deplacee sous `src/app/[locale]/about/page.tsx` avec `getTranslations()`
- [ ] Traductions FR et EN ajoutees dans `messages/`
- [ ] Page 404 racine : `lang="fr"` explicite ou redirection vers version localisee
- [ ] `messages/fr.json` corrige : `"Demarrer"` -> `"Demarrer"` (accent), `"resultat"` -> `"resultat"` (accent), `"mot-cle"` -> `"mot-cle"` (accent)
- [ ] VideoEmbed utilise `useTranslations()` pour aria-label et alt
- [ ] Audit complet de `messages/fr.json` pour accents manquants
- [ ] Verification : `/en/about/` affiche le contenu en anglais

**Fichiers concernes :**
- `src/app/about/page.tsx` (a deplacer)
- `src/app/not-found.tsx`
- `messages/fr.json` (L59, L60, L70)
- `messages/en.json`
- `src/components/ui/VideoEmbed.tsx` (L51, L57)

---

### US-7 : Coherence dark/light pages section (3 SP) — MAJEUR

> En tant qu'**utilisateur en mode clair**, je veux que les pages de section s'adaptent a mon theme choisi, afin de ne pas subir des blocs forces en mode sombre.

**Expert(s) mobilise(s) : Expert Frontend CSS + Expert UX/UI Designer**

**Criteres d'acceptation :**
- [ ] Hero getting-started utilise les CSS variables du theme (comme le hero de la landing)
- [ ] Section "Et ensuite" de getting-started adaptee via prefixes `dark:`
- [ ] Hero de la page /about adapte de la meme facon
- [ ] Aucune classe `bg-slate-950` ou `text-white` en dur sans equivalent light
- [ ] Verification visuelle des pages en mode clair et sombre

**Fichiers concernes :**
- `src/app/[locale]/getting-started/page.tsx` (hero, section "Et ensuite")
- `src/app/[locale]/about/page.tsx` (apres deplacement US-6)

---

### US-8 : Indicateur de progression parcours (3 SP) — MAJEUR

> En tant qu'**utilisateur suivant un parcours guide**, je veux voir ou j'en suis dans la sequence de pages, afin de garder le fil de ma progression.

**Expert(s) mobilise(s) : Expert TypeScript/React + Expert UX/UI Designer**

**Criteres d'acceptation :**
- [ ] Sidebar de section affiche un indicateur de progression (ex: "Page 2/6" ou barre de progression)
- [ ] Page courante clairement distinguee (deja fait, confirmer visuellement)
- [ ] L'indicateur est accessible (texte lisible par les lecteurs d'ecran, pas juste visuel)
- [ ] Optionnel : bandeau contextuel en haut des pages cibles des PathCard ("Parcours Debutant, etape 1/4")

**Fichiers concernes :**
- `src/components/layout/SectionSidebar.tsx`
- `src/lib/section-navigation.ts` (pour obtenir l'index de la page courante)

---

### US-9 : Espacement vertical et responsive (2 SP) — MAJEUR

> En tant qu'**utilisateur mobile**, je veux que le contenu de la landing et du footer soit compact et lisible, afin de ne pas scroller indefiniment dans du vide.

**Expert(s) mobilise(s) : Expert Frontend CSS**

**Criteres d'acceptation :**
- [ ] Sections landing : `py-16 sm:py-20 lg:py-24` au lieu de `py-20 sm:py-28`
- [ ] Footer mobile : `grid-cols-2` pour les colonnes de liens
- [ ] Pages MDX : contenu principal contraint a `max-w-prose` ou `max-w-3xl`
- [ ] Verification mobile 375px : la landing ne depasse pas ~5 ecrans de scroll

**Fichiers concernes :**
- `src/app/[locale]/page.tsx` (padding sections)
- `src/components/layout/Footer.tsx` (grille mobile)
- `src/components/layout/SectionLayout.tsx` (max-w contenu)

---

### US-10 : Liens externes et semantique ARIA (3 SP) — MAJEUR

> En tant qu'**utilisateur de lecteur d'ecran**, je veux que les liens externes soient annonces correctement et que la structure de headings soit valide, afin de naviguer efficacement.

**Expert(s) mobilise(s) : Expert TypeScript/React + Expert QA**

**Criteres d'acceptation :**
- [ ] Liens `target="_blank"` : `<span className="sr-only">(ouvre un nouvel onglet)</span>` ajoute
- [ ] PathCard : `aria-label` synthetique (ex: `aria-label="Parcours debutant : les fondamentaux"`)
- [ ] Callout : `<aside>` au lieu de `<div role="note">`
- [ ] Footer : h3 remplaces par `<p>` style ou h2 sr-only parent
- [ ] Verification VoiceOver/NVDA : navigation par headings (H), liens (K) et landmarks

**Fichiers concernes :**
- `src/components/layout/Footer.tsx` (L73, L92, L109 : headings, L119-120 : liens externes)
- `src/components/mdx/MdxComponents.tsx` (L107-112 : liens externes)
- `src/components/ui/PathCard.tsx` (L59-113 : aria-label)
- `src/components/ui/Callout.tsx` (L43 : role="note")

---

### US-11 : Corrections mineures de polish (2 SP) — MINEUR

> En tant qu'**utilisateur attentif aux details**, je veux que les derniers ajustements soient faits, afin que l'experience soit homogene.

**Expert(s) mobilise(s) : Expert Frontend CSS + Expert QA**

**Criteres d'acceptation :**
- [ ] LanguageSwitcher : cibles tactiles >= 44x44px (`min-h-[44px] min-w-[44px]`)
- [ ] ScrollToTop et TableOfContents : verifier `prefers-reduced-motion` avant `behavior: "smooth"`
- [ ] Scroll indicator (chevron hero) : transformer en bouton accessible ou supprimer
- [ ] CTA secondaire hero : hover visible (opacite >= 0.06 ou `hover:bg-slate-100`)
- [ ] `favicon.ico` genere et place dans `/public/`
- [ ] `@media (prefers-reduced-motion: reduce)` : ajouter `animation-delay: 0ms !important`
- [ ] Bouton copier CodeBlock : `min-h-[44px] min-w-[44px]`

**Fichiers concernes :**
- `src/components/layout/LanguageSwitcher.tsx` (L33-37)
- `src/components/ui/ScrollToTop.tsx` (L23)
- `src/components/ui/TableOfContents.tsx`
- `src/app/[locale]/page.tsx` (L164-167 : chevron)
- `src/app/globals.css` (L28 CTA hover, L62-73 reduced-motion)
- `src/components/ui/CodeBlock.tsx` (bouton copier)
- `/public/` (favicon.ico)

---

## Graphe de dependances

```
US-1 (visuels sections) ──────┐
US-2 (contrastes textuels) ───┤──→ Sprint 1 (parallélisables)
US-3 (styles interactifs) ────┘

US-4 (navigation header) ─────┐
US-5 (focus trap recherche) ───┤──→ Sprint 2 (parallélisables)
US-6 (i18n /about + trads) ───┘

US-7 (dark/light sections) ───┐    US-7 dépend de US-6 (page /about déplacée)
US-8 (progression parcours) ──┤──→ Sprint 3 (parallélisables sauf US-7)
US-9 (espacement vertical) ───┤
US-10 (ARIA sémantique) ──────┘

US-11 (polish) ────────────────→  Sprint 4 (indépendant)
```

**Items parallelisables** (via worktrees) :
- Sprint 1 : US-1 + US-2 + US-3 en parallele (fichiers differents)
- Sprint 2 : US-4 + US-5 en parallele, puis US-6
- Sprint 3 : US-8 + US-9 + US-10 en parallele, puis US-7

---

## Definition of Done (DoD)

Chaque story est "Done" quand :

- [ ] Correction implementee dans les fichiers concernes
- [ ] Verification mode clair ET sombre
- [ ] Verification desktop ET mobile (375px)
- [ ] Verification locales `/fr/` ET `/en/`
- [ ] `npm run lint` passe sans erreur
- [ ] `npm run type-check` passe sans erreur
- [ ] `npm run build` passe sans erreur
- [ ] Scores Lighthouse restent >= 90 sur les 4 metriques
- [ ] Pas de regression sur les points positifs existants (skip link, aria-labels, etc.)

---

## Risques et mitigations

| Risque | Prob. | Impact | Mitigation |
|--------|-------|--------|------------|
| Regression des scores Lighthouse 100/100 | Moyenne | Fort | Verifier Lighthouse apres chaque sprint |
| Changements de contraste impactent le design system global | Haute | Moyen | Tester chaque page, pas seulement la landing |
| US-6 (deplacement /about) casse des liens internes | Moyenne | Fort | Grep tous les liens vers /about avant deplacement |
| Refonte navigation header (US-4) casse le responsive | Moyenne | Fort | Tester sur 3 breakpoints : 375px, 768px, 1280px |
| Focus trap (US-5) bloque l'utilisateur dans la modale | Faible | Fort | Tester Escape + fermeture bouton + clic overlay |

---

## KPIs de succes

| KPI | Cible |
|-----|-------|
| Problemes critiques resolus | 5/5 (100%) |
| Problemes majeurs resolus | 14/14 (100%) |
| Problemes mineurs resolus | >= 12/18 (67%+) |
| Score Lighthouse Accessibility | >= 100 (pas de regression) |
| Ratio contraste minimum atteint | 4.5:1 (WCAG AA) |
| Verification FR + EN | Toutes les pages |
| Build success | 0 erreur |

---

## Legende

| Marqueur | Signification |
|----------|---------------|
| ✅ Fait | Implemente, build OK, verifie clair/sombre + FR/EN |
| 🔄 En cours | Implementation demarree |
| ⬜ A faire | Pas encore commence |
| ❌ Bloque | Bloque, voir note |
