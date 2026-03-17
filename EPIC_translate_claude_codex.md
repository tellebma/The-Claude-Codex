# Plan d'internationalisation (i18n) - The Claude Codex

## Contexte du projet

**Projet** : The Claude Codex (claude-codex.fr)
**Objectif** : Ajouter le support de l'anglais (EN) au site existant en francais (FR), en utilisant next-intl v4.x avec export statique.
**Langues** : FR (existant, langue par defaut) + EN (a ajouter)
**Stack** : Next.js 14 (App Router), TypeScript strict, Tailwind CSS, MDX, Docker/Nginx
**Contrainte majeure** : `output: 'export'` (SSG pur, pas de SSR, pas d'API routes)

---

## EPIC-1 : Infrastructure i18n et routing multilingue

**Description** : Mettre en place le socle technique de l'internationalisation. Installer next-intl, creer la structure `[locale]`, configurer le routing statique et les providers. C'est la fondation sur laquelle reposent toutes les autres EPICs.

**Criteres d'acceptation de l'EPIC** :
- next-intl v4.x installe et configure pour l'export statique
- Toutes les pages accessibles sous `/fr/...` et `/en/...`
- La racine `/` redirige vers `/fr/` (via Nginx)
- `generateStaticParams` produit le produit cartesien locale x slug pour chaque route dynamique
- `setRequestLocale(locale)` appele dans chaque layout et page server-side
- Le build `npm run build` passe sans erreur
- Les pages FR existantes restent identiques visuellement et fonctionnellement

**Estimation de complexite** : XL
**Dependances** : Aucune (premiere EPIC)

---

### US-1.1 : Installer et configurer next-intl pour l'export statique

**En tant que** developpeur, **je veux** installer next-intl v4.x et creer la configuration de base, **afin de** disposer du framework i18n compatible avec l'export statique de Next.js.

**Criteres d'acceptation** :
- next-intl v4.x installe via `npm install next-intl`
- Fichier `src/i18n/config.ts` cree avec les locales `['fr', 'en']` et la locale par defaut `fr`
- Fichier `src/i18n/request.ts` cree pour charger les messages JSON selon la locale
- Fichier `next.config.mjs` mis a jour avec le plugin `createNextIntlPlugin` (ou equivalent compatible export statique)
- Le build passe sans erreur

**Story points** : 5
**Priorite** : P0
**Fichiers impactes** :
- `package.json`
- `next.config.mjs`
- `src/i18n/config.ts` (nouveau)
- `src/i18n/request.ts` (nouveau)

---

### US-1.2 : Creer les fichiers de messages JSON (squelettes)

**En tant que** developpeur, **je veux** creer les fichiers de messages JSON pour FR et EN avec une structure minimale, **afin de** valider le chargement des traductions avant l'extraction exhaustive.

**Criteres d'acceptation** :
- Fichier `messages/fr.json` cree avec les namespaces principaux (common, navigation, footer, search, metadata)
- Fichier `messages/en.json` cree avec la meme structure, contenant des traductions de test
- Les messages se chargent correctement via `useTranslations()` dans un composant de test
- Structure de namespaces documentee dans un commentaire ou un fichier README

**Story points** : 3
**Priorite** : P0
**Fichiers impactes** :
- `messages/fr.json` (nouveau)
- `messages/en.json` (nouveau)

---

### US-1.3 : Restructurer l'App Router avec le segment [locale]

**En tant que** developpeur, **je veux** deplacer toutes les pages sous `app/[locale]/`, **afin que** chaque route soit prefixee par la locale dans l'URL.

**Criteres d'acceptation** :
- Nouveau dossier `src/app/[locale]/` cree
- Le root layout (`src/app/layout.tsx`) devient un wrapper minimal qui delegue au layout `[locale]`
- Le layout `[locale]` recoit le parametre locale, appelle `setRequestLocale(locale)` et configure `<html lang={locale}>`
- Toutes les sous-pages deplacees : `(landing)`, `getting-started/`, `mcp/`, `plugins/`, `skills/`, `agents/`, `prompting/`, `content/`, `configurator/`, `future/`, `glossary/`, `enterprise/`, `personas/`, `use-cases/`, `advanced/`, `reference/`, `limits/`
- `generateStaticParams` ajoute au niveau `[locale]` pour generer `[{locale: 'fr'}, {locale: 'en'}]`
- Le build passe sans erreur

**Story points** : 13
**Priorite** : P0
**Fichiers impactes** :
- `src/app/layout.tsx`
- `src/app/[locale]/layout.tsx` (nouveau, derive du layout actuel)
- Tous les 16 fichiers `layout.tsx` de section (deplacer sous `[locale]/`)
- Tous les 31 fichiers `page.tsx` (deplacer sous `[locale]/`)
- `src/app/[locale]/page.tsx` (landing page)

---

### US-1.4 : Adapter generateStaticParams pour le produit cartesien locale x slug

**En tant que** developpeur, **je veux** modifier chaque `generateStaticParams` des routes dynamiques `[slug]`, **afin que** le build genere les pages pour chaque combinaison locale/slug.

**Criteres d'acceptation** :
- Chaque fichier `[slug]/page.tsx` (14 fichiers) genere le produit cartesien `{locale, slug}` pour FR et EN
- Les fonctions `generateMetadata` recoivent et utilisent le parametre `locale`
- Le build genere le double de pages HTML statiques (une par locale)
- Aucune page existante ne casse

**Story points** : 8
**Priorite** : P0
**Fichiers impactes** :
- `src/app/[locale]/getting-started/[slug]/page.tsx`
- `src/app/[locale]/mcp/[slug]/page.tsx`
- `src/app/[locale]/plugins/[slug]/page.tsx`
- `src/app/[locale]/skills/[slug]/page.tsx`
- `src/app/[locale]/agents/[slug]/page.tsx`
- `src/app/[locale]/prompting/[slug]/page.tsx`
- `src/app/[locale]/future/[slug]/page.tsx`
- `src/app/[locale]/content/[slug]/page.tsx`
- `src/app/[locale]/enterprise/[slug]/page.tsx`
- `src/app/[locale]/personas/[slug]/page.tsx`
- `src/app/[locale]/use-cases/[slug]/page.tsx`
- `src/app/[locale]/limits/[slug]/page.tsx`
- `src/app/[locale]/advanced/[slug]/page.tsx`
- `src/app/[locale]/reference/[slug]/page.tsx`

---

### US-1.5 : Appeler setRequestLocale dans chaque layout et page serveur

**En tant que** developpeur, **je veux** ajouter `setRequestLocale(locale)` en haut de chaque composant server-side qui recoit le parametre locale, **afin que** next-intl fonctionne correctement en mode export statique.

**Criteres d'acceptation** :
- Chaque `layout.tsx` et `page.tsx` server-side sous `[locale]` appelle `setRequestLocale(locale)` comme premiere instruction
- L'import `import { setRequestLocale } from 'next-intl/server'` est present dans chaque fichier concerne
- Environ 40 fichiers modifies (17 layouts + ~25 pages server-side)
- Le build passe sans avertissement next-intl

**Story points** : 5
**Priorite** : P0
**Fichiers impactes** :
- ~17 fichiers `layout.tsx` sous `src/app/[locale]/`
- ~25 fichiers `page.tsx` sous `src/app/[locale]/` (composants serveur)

---

### US-1.6 : Configurer la redirection Nginx racine vers /fr/

**En tant que** administrateur systeme, **je veux** configurer Nginx pour rediriger `/` vers `/fr/`, **afin que** les visiteurs sans prefixe de locale soient diriges vers la version francaise.

**Criteres d'acceptation** :
- Regle `rewrite ^/$ /fr/ permanent;` ajoutee dans `nginx.conf`
- Les anciennes URLs sans prefixe de locale (`/getting-started`, `/mcp`, etc.) redirigent vers `/fr/getting-started`, `/fr/mcp`, etc. (301 permanent)
- Le healthcheck `/health` reste accessible sans prefixe
- Le build Docker fonctionne
- Les redirections sont testees manuellement

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `nginx/nginx.conf`

---

### US-1.7 : Creer le NextIntlClientProvider wrapper

**En tant que** developpeur, **je veux** encapsuler le `NextIntlClientProvider` dans le layout `[locale]`, **afin que** tous les composants clients aient acces aux traductions.

**Criteres d'acceptation** :
- `NextIntlClientProvider` place dans le layout `[locale]` avec les messages charges
- Les composants clients (`Header`, `Footer`, `SearchDialog`, etc.) ont acces aux traductions via `useTranslations()`
- Le provider ne cause pas de re-render inutile (messages passes en prop)
- Le build passe sans erreur

**Story points** : 3
**Priorite** : P0
**Fichiers impactes** :
- `src/app/[locale]/layout.tsx`

---

## EPIC-2 : Extraction et traduction des strings UI

**Description** : Extraire toutes les chaines de caracteres francaises hardcodees dans les composants et fichiers de donnees, les deplacer dans les fichiers de messages JSON, et produire la version anglaise.

**Criteres d'acceptation de l'EPIC** :
- Zero string francaise hardcodee dans les composants (hors noms propres et termes techniques universels)
- Fichiers `messages/fr.json` et `messages/en.json` complets avec la meme structure
- Tous les composants utilisent `useTranslations()` ou `getTranslations()` pour afficher du texte
- La qualite de la traduction anglaise est verifiee par relecture humaine

**Estimation de complexite** : XL
**Dependances** : EPIC-1 (infrastructure i18n en place)

---

### US-2.1 : Extraire les strings du Header

**En tant que** developpeur, **je veux** remplacer les labels de navigation hardcodes dans le Header par des traductions, **afin que** la navigation s'affiche dans la bonne langue.

**Criteres d'acceptation** :
- Les 8 items de `primaryNav` utilisent des cles de traduction (`navigation.gettingStarted`, `navigation.mcp`, etc.)
- Les 6 items de `secondaryNav` utilisent des cles de traduction
- Le label du bouton "Plus" (dropdown) est traduit
- Les aria-labels "Menu de navigation" et "Navigation principale" sont traduits
- Le nom du site "The Claude Codex" reste inchange (nom propre)
- Le composant utilise `useTranslations('navigation')` (composant client)

**Story points** : 3
**Priorite** : P0
**Fichiers impactes** :
- `src/components/layout/Header.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.2 : Extraire les strings du Footer

**En tant que** developpeur, **je veux** remplacer les labels hardcodes dans le Footer par des traductions, **afin que** le pied de page s'affiche dans la bonne langue.

**Criteres d'acceptation** :
- Les 4 items de `footerLinks.guides` et 3 items de `footerLinks.resources` utilisent des cles de traduction
- Le paragraphe descriptif ("Le guide de reference gratuit...") est traduit
- Les titres "Guides" et "Ressources" sont traduits
- Le texte copyright ("Projet open-source") est traduit
- Les aria-labels des `<nav>` sont traduits

**Story points** : 3
**Priorite** : P0
**Fichiers impactes** :
- `src/components/layout/Footer.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.3 : Extraire les strings du SearchDialog

**En tant que** developpeur, **je veux** traduire toutes les chaines du composant de recherche, **afin que** l'interface de recherche s'affiche dans la bonne langue.

**Criteres d'acceptation** :
- L'aria-label du bouton declencheur ("Rechercher dans le site (Ctrl+K)") est traduit
- Les placeholders "Rechercher..." et "Rechercher un sujet, une page..." sont traduits
- Les aria-labels du dialog, du bouton fermer, des resultats sont traduits
- Les messages "Aucun resultat pour..." et "Tapez un mot-cle..." sont traduits
- Les labels du footer clavier ("pour fermer", "naviguer", "ouvrir") sont traduits

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `src/components/ui/SearchDialog.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.4 : Extraire les strings du Breadcrumb

**En tant que** developpeur, **je veux** traduire les labels de section du breadcrumb et les textes fixes, **afin que** le fil d'Ariane s'affiche dans la bonne langue.

**Criteres d'acceptation** :
- Les 8 entrees de `SECTION_LABELS` sont traduites ("Demarrer", "MCP", "Plugins", etc.)
- Le label "Accueil" dans le JSON-LD breadcrumb est traduit
- Les aria-labels "Fil d'Ariane" et "Accueil" sont traduits
- Le composant recoit la locale ou utilise `useTranslations()`

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `src/components/ui/Breadcrumb.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.5 : Extraire les strings du Callout

**En tant que** developpeur, **je veux** traduire les titres par defaut du composant Callout, **afin qu'** ils s'affichent dans la bonne langue.

**Criteres d'acceptation** :
- Les 3 `defaultTitle` sont traduits : "Information", "Astuce", "Attention"
- Le composant utilise `useTranslations('callout')` ou recoit les labels en prop

**Story points** : 1
**Priorite** : P2
**Fichiers impactes** :
- `src/components/ui/Callout.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.6 : Extraire les strings du CodeBlock, ScrollToTop et ThemeToggle

**En tant que** developpeur, **je veux** traduire les aria-labels des composants utilitaires, **afin que** l'accessibilite fonctionne dans les deux langues.

**Criteres d'acceptation** :
- CodeBlock : aria-labels "Code copie" et "Copier le code" traduits
- ScrollToTop : aria-label "Retour en haut de la page" traduit
- ThemeToggle : aria-labels "Passer en mode clair" et "Passer en mode sombre" traduits

**Story points** : 2
**Priorite** : P2
**Fichiers impactes** :
- `src/components/ui/CodeBlock.tsx`
- `src/components/ui/ScrollToTop.tsx`
- `src/components/layout/ThemeToggle.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.7 : Extraire les strings du TableOfContents

**En tant que** developpeur, **je veux** traduire les labels du composant Table des matieres, **afin que** la navigation de page s'affiche dans la bonne langue.

**Criteres d'acceptation** :
- L'aria-label "Table des matieres" est traduit
- Le label "Sur cette page" est traduit

**Story points** : 1
**Priorite** : P2
**Fichiers impactes** :
- `src/components/ui/TableOfContents.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.8 : Extraire les strings du SectionSidebar

**En tant que** developpeur, **je veux** traduire l'aria-label dynamique du SectionSidebar, **afin que** l'accessibilite fonctionne dans les deux langues.

**Criteres d'acceptation** :
- L'aria-label "Navigation {title}" utilise une cle de traduction avec interpolation
- Le titre de section affiche est traduit (recupere depuis les donnees de navigation deja traduites)

**Story points** : 1
**Priorite** : P2
**Fichiers impactes** :
- `src/components/layout/SectionSidebar.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.9 : Extraire les strings du SectionLayout et du skip-to-content

**En tant que** developpeur, **je veux** traduire le lien d'accessibilite "Aller au contenu principal", **afin que** le saut de contenu fonctionne pour les utilisateurs anglophones.

**Criteres d'acceptation** :
- Le texte "Aller au contenu principal" dans le root layout est traduit

**Story points** : 1
**Priorite** : P2
**Fichiers impactes** :
- `src/app/[locale]/layout.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.10 : Traduire les donnees de navigation (section-navigation.ts)

**En tant que** developpeur, **je veux** internationaliser les 95 items de navigation de section, **afin que** les sidebars et les liens de navigation s'affichent dans la bonne langue.

**Criteres d'acceptation** :
- La structure de `sectionNavigation` accepte ou fonctionne avec les deux langues
- Deux options possibles : (A) deplacer les labels dans les fichiers JSON ou (B) creer un objet de navigation par locale
- Les 14 sections avec leurs items sont traduites en anglais
- Les hrefs restent identiques (pas de slugs traduits)
- La fonction `getSectionFromPathname` continue de fonctionner

**Story points** : 8
**Priorite** : P1
**Fichiers impactes** :
- `src/lib/section-navigation.ts`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.11 : Traduire les strings de la landing page

**En tant que** developpeur, **je veux** internationaliser tous les textes de la page d'accueil, **afin que** les visiteurs anglophones comprennent immediatement la proposition de valeur.

**Criteres d'acceptation** :
- Tous les textes du hero (titre, sous-titre, badge, CTA) sont traduits
- Les 8 FeatureCard (titre + description) sont traduits
- Les 6 AudienceCard (titre + description) sont traduits
- Les 3 PathCard (level, titre, description, items, CTA) sont traduits
- Le ConfiguratorTeaser (titre, description, pills, CTA) est traduit
- Le CTA final (titre, description, boutons) est traduit
- Les SectionHeading (badge, titre, description) sont traduits
- Le texte du terminal simule est traduit

**Story points** : 8
**Priorite** : P1
**Fichiers impactes** :
- `src/app/[locale]/page.tsx`
- `src/components/ui/FeatureCard.tsx`
- `src/components/ui/PathCard.tsx`
- `src/components/ui/AudienceCard.tsx`
- `src/components/ui/ConfiguratorTeaser.tsx`
- `src/components/ui/SectionHeading.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.12 : Traduire les strings des pages overview de section

**En tant que** developpeur, **je veux** internationaliser les textes hardcodes des pages overview (getting-started, mcp, skills, prompting, etc.), **afin que** les textes d'introduction de chaque section s'affichent dans la bonne langue.

**Criteres d'acceptation** :
- Les pages overview des 16 sections utilisent des cles de traduction pour les hero, badges, SUB_PAGES, et sections "Prochaines etapes"
- Les labels de navigation inter-pages ("Precedent", "Suivant", "Retour") sont extraits dans un namespace commun

**Story points** : 13
**Priorite** : P1
**Fichiers impactes** :
- `src/app/[locale]/getting-started/page.tsx`
- `src/app/[locale]/getting-started/[slug]/page.tsx`
- Les 14 autres dossiers de section sous `src/app/[locale]/` (page.tsx et [slug]/page.tsx)
- `messages/fr.json`
- `messages/en.json`

---

### US-2.13 : Traduire les strings du Configurateur interactif

**En tant que** developpeur, **je veux** internationaliser les 7 composants du configurateur et les fichiers de donnees associes, **afin que** le configurateur fonctionne en anglais.

**Criteres d'acceptation** :
- `ConfiguratorWizard.tsx` : labels des boutons ("Suivant", "Precedent", "Recommencer"), titres d'etapes
- `StepProfile.tsx`, `StepStack.tsx`, `StepSubscription.tsx`, `StepFeatures.tsx` : titres, descriptions, labels
- `ConfigPreview.tsx` : titres des sections, boutons de copie/telechargement
- `WIZARD_STEP_LABELS` dans `types.ts` et `PRESETS`/`PROFILES` dans `presets.ts` traduits

**Story points** : 8
**Priorite** : P2
**Fichiers impactes** :
- `src/components/configurator/ConfiguratorWizard.tsx`
- `src/components/configurator/StepProfile.tsx`
- `src/components/configurator/StepStack.tsx`
- `src/components/configurator/StepSubscription.tsx`
- `src/components/configurator/StepFeatures.tsx`
- `src/components/configurator/ConfigPreview.tsx`
- `src/components/configurator/PresetCard.tsx`
- `src/lib/configurator/types.ts`
- `src/lib/configurator/presets.ts`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.14 : Traduire le glossaire

**En tant que** developpeur, **je veux** internationaliser les 40+ termes du glossaire, **afin que** les definitions soient disponibles en anglais.

**Criteres d'acceptation** :
- Chaque `GlossaryTerm` (term, definition, analogy) existe en FR et EN
- La page glossaire charge les termes dans la bonne langue
- Les liens `link` restent les memes (prefixes par la locale)

**Story points** : 5
**Priorite** : P2
**Fichiers impactes** :
- `src/data/glossary.ts`
- `src/app/[locale]/glossary/page.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-2.15 : Adapter l'index de recherche a la locale

**En tant que** developpeur, **je veux** que l'index de recherche retourne des resultats dans la langue active, **afin que** la recherche soit pertinente pour chaque locale.

**Criteres d'acceptation** :
- Les 70+ entrees de `searchIndex` existent en FR et EN (title, description, section, keywords)
- La fonction `searchEntries()` accepte un parametre locale
- Les resultats affiches dans le SearchDialog sont dans la bonne langue
- Les hrefs sont prefixes par la locale

**Story points** : 8
**Priorite** : P1
**Fichiers impactes** :
- `src/lib/search-index.ts`
- `src/components/ui/SearchDialog.tsx`
- `messages/fr.json`
- `messages/en.json`

---

## EPIC-3 : Metadata, SEO et donnees structurees

**Description** : Adapter les metadata Next.js, les donnees structurees JSON-LD, le sitemap et les balises hreflang pour le SEO multilingue.

**Criteres d'acceptation de l'EPIC** :
- Chaque page a des metadata (title, description, OG) dans la bonne langue
- Les balises `<link rel="alternate" hreflang="...">` sont presentes sur chaque page
- Le sitemap.xml inclut les URLs des deux locales avec les annotations xhtml:link
- Les schemas JSON-LD contiennent `inLanguage` correct (fr-FR ou en-US)
- Les canonical URLs pointent vers la bonne locale
- Google Search Console peut indexer les deux versions

**Estimation de complexite** : L
**Dependances** : EPIC-1 (routing [locale])

---

### US-3.1 : Adapter createPageMetadata pour le multilingue

**En tant que** developpeur, **je veux** modifier la fonction `createPageMetadata` pour accepter la locale et generer les bonnes metadata, **afin que** chaque page ait des meta-donnees dans la bonne langue.

**Criteres d'acceptation** :
- `createPageMetadata` accepte un parametre `locale`
- Le `SITE_LOCALE` est dynamique (`fr_FR` ou `en_US`)
- Les canonical URLs incluent le prefixe de locale
- Les `alternates.languages` incluent les deux versions
- Les constantes `SITE_URL`, `SITE_NAME` restent les memes

**Story points** : 3
**Priorite** : P0
**Fichiers impactes** :
- `src/lib/metadata.ts`

---

### US-3.2 : Traduire SITE_PAGES et adapter le sitemap

**En tant que** developpeur, **je veux** generer un sitemap multilingue avec les annotations hreflang, **afin que** les moteurs de recherche indexent correctement les deux versions.

**Criteres d'acceptation** :
- Les 90+ entrees de `SITE_PAGES` sont dupliquees pour chaque locale (titre et description traduits)
- Le sitemap genere des URLs prefixees (`/fr/path`, `/en/path`)
- Chaque entree du sitemap inclut les annotations `xhtml:link` avec `rel="alternate"` pour les deux locales
- Le sitemap est accessible a `/sitemap.xml`

**Story points** : 5
**Priorite** : P1
**Fichiers impactes** :
- `src/lib/metadata.ts`
- `src/app/sitemap.ts`

---

### US-3.3 : Ajouter les balises hreflang sur chaque page

**En tant que** developpeur, **je veux** ajouter les balises `<link rel="alternate" hreflang="...">` sur chaque page, **afin que** Google comprenne la relation entre les versions linguistiques.

**Criteres d'acceptation** :
- Chaque page inclut un `alternate` pour `fr` et `en` dans ses metadata
- Un `x-default` pointe vers la version FR
- La generation est automatique via `createPageMetadata` ou un helper dedie
- Validation possible avec un outil de test hreflang

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `src/lib/metadata.ts`
- `src/app/[locale]/layout.tsx`

---

### US-3.4 : Adapter les schemas JSON-LD pour le multilingue

**En tant que** developpeur, **je veux** que les schemas JSON-LD utilisent `inLanguage` dynamique et des URLs localisees, **afin que** les rich snippets Google affichent la bonne langue.

**Criteres d'acceptation** :
- `createWebSiteSchema` : `inLanguage` dynamique (`fr-FR` ou `en-US`)
- `createArticleSchema` : `inLanguage` dynamique
- `createHowToSchema` : `inLanguage` dynamique
- `createBreadcrumbSchema` : URLs avec prefixe de locale
- Toutes les fonctions acceptent un parametre `locale`

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `src/lib/structured-data.ts`

---

## EPIC-4 : Contenu MDX multilingue

**Description** : Restructurer le stockage des fichiers MDX pour supporter plusieurs locales et adapter la couche de chargement MDX. Traduire les 79 fichiers MDX en anglais.

**Criteres d'acceptation de l'EPIC** :
- Le dossier `content/` est reorganise en `content/fr/` et `content/en/`
- La couche `lib/mdx.ts` charge les fichiers MDX selon la locale
- Les 79 fichiers MDX existent en version anglaise
- Les fichiers MDX anglais ont un frontmatter en anglais (title, description)
- Les slugs restent identiques entre les deux locales
- Le build genere les pages MDX dans les deux langues

**Estimation de complexite** : XL
**Dependances** : EPIC-1 (routing [locale]), EPIC-3 (metadata multilingue)

---

### US-4.1 : Restructurer le dossier content/ par locale

**En tant que** developpeur, **je veux** deplacer les fichiers MDX existants sous `content/fr/` et creer la structure `content/en/`, **afin que** chaque locale ait son propre dossier de contenu.

**Criteres d'acceptation** :
- Structure `content/fr/` cree avec les 79 fichiers MDX existants deplaces depuis `content/`
- Structure `content/en/` cree (vide initialement, ou avec des fichiers placeholder)
- La structure de sous-dossiers est identique : `fr/getting-started/`, `fr/mcp/`, etc. miroire dans `en/`
- Les fichiers MDX racine deplaces sous `content/fr/`

**Story points** : 5
**Priorite** : P0
**Fichiers impactes** :
- 79 fichiers dans `content/` (deplacement vers `content/fr/`)
- Dossier `content/en/` (nouveau)

---

### US-4.2 : Adapter lib/mdx.ts pour le chargement par locale

**En tant que** developpeur, **je veux** modifier les fonctions de chargement MDX pour accepter un parametre locale, **afin que** les bonnes pages de contenu soient servies selon la langue.

**Criteres d'acceptation** :
- `CONTENT_DIR` devient dynamique : `content/{locale}/`
- `getMdxBySlug(slug, locale)` charge depuis `content/{locale}/{slug}.mdx`
- `getAllMdxSlugs(locale)` liste les fichiers de la locale
- `getSectionMdxSlugs(section, locale)` liste les fichiers de section pour la locale
- `getSectionMdxBySlug(section, slug, locale)` charge depuis `content/{locale}/{section}/{slug}.mdx`
- `getAllSectionMdxFiles(section, locale)` retourne les fichiers tries pour la locale
- Fallback optionnel : si un fichier n'existe pas en EN, afficher un message "This page is not yet available in English" avec un lien vers la version FR
- Le build passe avec les deux locales

**Story points** : 5
**Priorite** : P0
**Fichiers impactes** :
- `src/lib/mdx.ts`

---

### US-4.3 : Traduire les fichiers MDX de la section getting-started (6 fichiers)

**En tant que** editeur de contenu, **je veux** traduire les 6 fichiers MDX de la section getting-started en anglais, **afin que** les nouveaux utilisateurs anglophones puissent suivre le guide.

**Criteres d'acceptation** :
- 6 fichiers traduits : `prerequisites-zero.mdx`, `what-is-claude-code.mdx`, `installation.mdx`, `environment-setup.mdx`, `first-project.mdx`, `faq-beginner.mdx`
- Frontmatter traduit (title, description)
- Contenu MDX integralement traduit, qualite naturelle (pas de traduction automatique brute)
- Memes composants MDX utilises (Callout, CodeBlock, Steps)
- Les blocs de code restent en anglais (commandes terminal, code)
- Slugs identiques a la version FR

**Story points** : 13
**Priorite** : P1
**Fichiers impactes** :
- `content/en/getting-started/prerequisites-zero.mdx` (nouveau)
- `content/en/getting-started/what-is-claude-code.mdx` (nouveau)
- `content/en/getting-started/installation.mdx` (nouveau)
- `content/en/getting-started/environment-setup.mdx` (nouveau)
- `content/en/getting-started/first-project.mdx` (nouveau)
- `content/en/getting-started/faq-beginner.mdx` (nouveau)

---

### US-4.4 : Traduire les fichiers MDX de la section MCP (10 fichiers)

**En tant que** editeur de contenu, **je veux** traduire les 10 fichiers MDX de la section MCP en anglais, **afin que** le contenu MCP soit accessible aux anglophones.

**Criteres d'acceptation** :
- 10 fichiers traduits
- Qualite de traduction naturelle, relue par un humain
- Les exemples de code et les noms de MCP restent en anglais

**Story points** : 13
**Priorite** : P1
**Fichiers impactes** :
- 10 fichiers dans `content/en/mcp/` (nouveaux)

---

### US-4.5 : Traduire les fichiers MDX de la section Prompting (9 fichiers)

**En tant que** editeur de contenu, **je veux** traduire les 9 fichiers MDX de la section Prompting en anglais, **afin que** les techniques de prompting soient accessibles aux anglophones.

**Criteres d'acceptation** :
- 9 fichiers traduits
- Les exemples de prompts sont traduits en anglais
- Les termes techniques (chain-of-thought, few-shot, etc.) restent en anglais

**Story points** : 13
**Priorite** : P1
**Fichiers impactes** :
- 9 fichiers dans `content/en/prompting/` (nouveaux)

---

### US-4.6 : Traduire les fichiers MDX des sections Plugins, Skills, Agents (16 fichiers)

**En tant que** editeur de contenu, **je veux** traduire les fichiers MDX des sections Plugins (5), Skills (4) et Agents (7) en anglais.

**Criteres d'acceptation** :
- 16 fichiers traduits avec qualite naturelle
- Les noms d'outils et de commandes restent en anglais

**Story points** : 13
**Priorite** : P2
**Fichiers impactes** :
- 5 fichiers dans `content/en/plugins/` (nouveaux)
- 4 fichiers dans `content/en/skills/` (nouveaux)
- 7 fichiers dans `content/en/agents/` (nouveaux)

---

### US-4.7 : Traduire les fichiers MDX des sections restantes (29 fichiers)

**En tant que** editeur de contenu, **je veux** traduire les fichiers MDX des sections Enterprise (6), Advanced (3), Reference (4), Limits (4), Personas (6), Future (3) et Use-cases (3) en anglais.

**Criteres d'acceptation** :
- 29 fichiers traduits avec qualite naturelle
- Les prix et references restent a jour
- Les exemples sont adaptes au contexte anglophone si pertinent

**Story points** : 13
**Priorite** : P2
**Fichiers impactes** :
- 29 fichiers repartis dans `content/en/` (nouveaux)

---

### US-4.8 : Traduire les fichiers MDX editoriaux racine (8 fichiers)

**En tant que** editeur de contenu, **je veux** traduire les 8 fichiers MDX editoriaux racine en anglais.

**Criteres d'acceptation** :
- 8 fichiers traduits : `getting-started-intro`, `mcp-guide`, `skills-guide`, `prompting-guide`, `future-vision`, `couts-reels-claude-code`, `mythes-claude-code`, `bonnes-pratiques-securite`
- Les prix et references Anthropic restent a jour

**Story points** : 8
**Priorite** : P2
**Fichiers impactes** :
- 8 fichiers dans `content/en/` (nouveaux)

---

## EPIC-5 : Selecteur de langue et UX multilingue

**Description** : Ajouter un selecteur de langue visible dans l'interface, gerer les liens internes localises, et peaufiner l'experience utilisateur multilingue.

**Criteres d'acceptation de l'EPIC** :
- Un selecteur de langue est visible dans le Header (desktop et mobile)
- Le changement de langue redirige vers la meme page dans l'autre locale
- Tous les liens internes (`<Link>`) sont automatiquement prefixes par la locale
- L'experience est fluide et sans flash de contenu

**Estimation de complexite** : L
**Dependances** : EPIC-1 (routing), EPIC-2 (strings UI), EPIC-4 (contenu MDX)

---

### US-5.1 : Creer le composant LanguageSwitcher

**En tant que** visiteur du site, **je veux** voir un selecteur de langue dans le header, **afin de** pouvoir basculer entre le francais et l'anglais.

**Criteres d'acceptation** :
- Composant `LanguageSwitcher.tsx` cree dans `components/layout/`
- Affiche les drapeaux ou les codes de langue (FR / EN) avec la langue active mise en evidence
- Cliquer sur une langue redirige vers la meme page dans l'autre locale
- Preserve le chemin courant (ex: `/fr/mcp/setup` vers `/en/mcp/setup`)
- Accessible : aria-labels, role, focus visible
- Design coherent avec le Header existant
- Fonctionne en desktop et mobile (menu hamburger)

**Story points** : 5
**Priorite** : P1
**Fichiers impactes** :
- `src/components/layout/LanguageSwitcher.tsx` (nouveau)
- `src/components/layout/Header.tsx`
- `messages/fr.json`
- `messages/en.json`

---

### US-5.2 : Adapter les liens internes avec le prefixe de locale

**En tant que** developpeur, **je veux** que tous les liens internes `<Link>` soient automatiquement prefixes par la locale courante, **afin d'** eviter les liens casses entre les langues.

**Criteres d'acceptation** :
- Utiliser le `Link` de next-intl (ou creer un wrapper) qui prefixe automatiquement par la locale
- Les liens dans le Header, Footer, Breadcrumb, SectionSidebar, pages, et composants MDX sont adaptes
- Les liens externes (GitHub, docs Anthropic) ne sont pas modifies
- Les ancres (#) fonctionnent toujours
- Verification : aucun lien interne ne pointe vers une URL sans prefixe de locale

**Story points** : 8
**Priorite** : P0
**Fichiers impactes** :
- Tous les composants contenant des `<Link>` internes (~30 fichiers)

---

### US-5.3 : Gerer le fallback pour les pages non encore traduites

**En tant que** visiteur anglophone, **je veux** voir un message clair quand une page n'est pas encore disponible en anglais, **afin de** savoir que la traduction est en cours et pouvoir consulter la version francaise.

**Criteres d'acceptation** :
- Si un fichier MDX n'existe pas dans la locale demandee, afficher une page de fallback
- La page de fallback contient : un message dans la langue demandee, un lien vers la version FR, le titre de la page
- Le layout (Header, Footer, sidebar) reste dans la langue demandee
- Pas d'erreur 404, mais une page 200 avec le message de fallback

**Story points** : 3
**Priorite** : P2
**Fichiers impactes** :
- `src/lib/mdx.ts`
- `src/components/ui/TranslationFallback.tsx` (nouveau)
- Pages `[slug]/page.tsx` concernees

---

### US-5.4 : Adapter les liens dans les fichiers MDX traduits

**En tant que** editeur de contenu, **je veux** que les liens internes dans les fichiers MDX anglais pointent vers les bonnes URLs avec prefixe de locale, **afin que** la navigation soit coherente.

**Criteres d'acceptation** :
- Les liens `[texte](/path)` dans les fichiers MDX sont interpretes comme relatifs a la locale courante
- Le composant `MdxComponents` pour les balises `<a>` prefixe automatiquement par la locale si le lien est interne
- Les liens absolus externes restent inchanges

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `src/components/mdx/MdxComponents.tsx`

---

## EPIC-6 : Tests, validation et deploiement

**Description** : Valider l'ensemble de l'internationalisation par des tests automatises et manuels, corriger les bugs, et deployer en production.

**Criteres d'acceptation de l'EPIC** :
- Le build passe sans erreur pour les deux locales
- Les tests unitaires couvrent le chargement des messages et le routing
- Les tests E2E verifient la navigation entre les langues
- Le deploiement Docker fonctionne avec les deux langues
- Les scores Lighthouse restent > 90 sur les 4 metriques
- Le SEO multilingue est valide (hreflang, sitemap, structured data)

**Estimation de complexite** : L
**Dependances** : EPIC-1 a EPIC-5

---

### US-6.1 : Tests unitaires des utilitaires i18n

**En tant que** developpeur, **je veux** des tests unitaires pour les fonctions de chargement de messages, le routing locale et le chargement MDX multilingue, **afin de** prevenir les regressions.

**Criteres d'acceptation** :
- Test : `getMdxBySlug` charge le bon fichier selon la locale
- Test : `getSectionFromPathname` fonctionne avec le prefixe `[locale]`
- Test : `searchEntries` retourne des resultats dans la bonne langue
- Test : `createPageMetadata` genere les bons alternates
- Couverture > 80% sur les fichiers `lib/` modifies

**Story points** : 5
**Priorite** : P1
**Fichiers impactes** :
- `__tests__/lib/mdx.test.ts` (nouveau ou modifie)
- `__tests__/lib/metadata.test.ts` (nouveau ou modifie)
- `__tests__/lib/search-index.test.ts` (nouveau ou modifie)
- `__tests__/lib/section-navigation.test.ts` (nouveau ou modifie)

---

### US-6.2 : Tests E2E de la navigation multilingue

**En tant que** QA, **je veux** des tests E2E qui verifient les parcours utilisateur multilingues, **afin de** valider l'experience de bout en bout.

**Criteres d'acceptation** :
- Test : naviguer de `/fr/` vers `/en/` via le selecteur de langue
- Test : naviguer de `/en/getting-started` vers `/en/getting-started/installation`
- Test : le breadcrumb affiche les bons labels en anglais
- Test : la recherche retourne des resultats en anglais sur `/en/`
- Test : les liens de navigation inter-pages (Precedent/Suivant) fonctionnent en EN
- Test : les redirections 301 de `/` vers `/fr/` et des anciennes URLs fonctionnent

**Story points** : 5
**Priorite** : P1
**Fichiers impactes** :
- `e2e/i18n.spec.ts` (nouveau)

---

### US-6.3 : Validation SEO multilingue

**En tant que** responsable SEO, **je veux** valider que toutes les balises SEO multilingues sont correctes, **afin d'** assurer un bon indexage par Google.

**Criteres d'acceptation** :
- Chaque page a des balises hreflang correctes (validees avec un outil externe ou un script)
- Le sitemap.xml contient toutes les URLs des deux locales
- Les schemas JSON-LD ont le bon `inLanguage`
- Les canonical URLs sont correctes (pas de duplication)
- Les og:locale sont corrects
- Les robots.txt n'excluent pas les pages EN

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- Pas de fichiers modifies (verification uniquement)

---

### US-6.4 : Validation Lighthouse et performance

**En tant que** developpeur, **je veux** verifier que l'ajout de l'i18n n'a pas degrade les scores Lighthouse, **afin de** maintenir la qualite du site.

**Criteres d'acceptation** :
- Score Performance > 90 sur la landing page FR et EN
- Score Accessibility > 90
- Score Best Practices > 90
- Score SEO > 90
- Le bundle size n'a pas augmente de plus de 10%
- Le temps de build reste raisonnable (< 5 minutes)

**Story points** : 2
**Priorite** : P1
**Fichiers impactes** :
- Pas de fichiers modifies (audit uniquement)

---

### US-6.5 : Adapter le Dockerfile et la configuration Nginx

**En tant que** DevOps, **je veux** que le build Docker et la configuration Nginx gerent correctement les deux langues, **afin que** le deploiement en production fonctionne.

**Criteres d'acceptation** :
- Le Dockerfile build les pages des deux locales
- La regle Nginx `rewrite ^/$ /fr/ permanent;` est en place
- Les redirections des anciennes URLs (sans prefixe) sont configurees
- Les headers de cache sont corrects pour les pages FR et EN
- Le healthcheck fonctionne
- L'image Docker reste < 100 MB

**Story points** : 3
**Priorite** : P1
**Fichiers impactes** :
- `Dockerfile`
- `nginx/nginx.conf`

---

### US-6.6 : Mise a jour du CLAUDE.md et de la documentation

**En tant que** developpeur contributeur, **je veux** que le CLAUDE.md et la documentation refletent la nouvelle architecture i18n, **afin de** faciliter les contributions futures.

**Criteres d'acceptation** :
- Le CLAUDE.md est mis a jour avec la nouvelle structure de dossiers (`content/fr/`, `content/en/`)
- La checklist "Ajouter une nouvelle section" est mise a jour pour inclure les etapes i18n
- La section "Architecture" documente la structure `app/[locale]/`
- Le workflow de contribution pour ajouter une traduction est documente

**Story points** : 2
**Priorite** : P2
**Fichiers impactes** :
- `CLAUDE.md`

---

## Recapitulatif

### Total des story points

| EPIC | Titre | Nb stories | Story points | Complexite |
|------|-------|-----------|-------------|------------|
| EPIC-1 | Infrastructure i18n et routing | 7 | 40 | XL |
| EPIC-2 | Extraction et traduction des strings UI | 15 | 63 | XL |
| EPIC-3 | Metadata, SEO et donnees structurees | 4 | 14 | L |
| EPIC-4 | Contenu MDX multilingue | 8 | 83 | XL |
| EPIC-5 | Selecteur de langue et UX multilingue | 4 | 19 | L |
| EPIC-6 | Tests, validation et deploiement | 6 | 20 | L |
| **Total** | | **44** | **239** | |

### Repartition par priorite

| Priorite | Nb stories | Story points |
|----------|-----------|-------------|
| P0 (critique) | 10 | 55 |
| P1 (haute) | 20 | 115 |
| P2 (moyenne) | 14 | 69 |

### Ordre de realisation recommande

```
Phase 1 (sprint 1-2) : Fondation
  EPIC-1 complet (US-1.1 a US-1.7)         ← Prerequis pour tout le reste
  US-3.1 (createPageMetadata)               ← Necessaire pour le build

Phase 2 (sprint 3-4) : Strings UI critiques
  US-2.1 (Header)
  US-2.2 (Footer)
  US-2.10 (section-navigation)
  US-2.11 (landing page)
  US-2.12 (pages overview)
  US-5.2 (liens internes)

Phase 3 (sprint 5) : SEO et recherche
  US-3.2, US-3.3, US-3.4 (sitemap, hreflang, JSON-LD)
  US-2.15 (index de recherche)
  US-2.3 (SearchDialog)
  US-2.4 (Breadcrumb)

Phase 4 (sprint 6-7) : Contenu MDX prioritaire
  US-4.1 (restructurer content/)
  US-4.2 (adapter mdx.ts)
  US-4.3 (getting-started EN)
  US-4.4 (MCP EN)
  US-4.5 (prompting EN)

Phase 5 (sprint 8) : UX et composants secondaires
  US-5.1 (LanguageSwitcher)
  US-5.3 (fallback)
  US-5.4 (liens MDX)
  US-2.5 a US-2.9 (composants secondaires)

Phase 6 (sprint 9-10) : Contenu restant
  US-4.6 (plugins, skills, agents EN)
  US-4.7 (enterprise, advanced, reference, etc. EN)
  US-4.8 (editos racine EN)
  US-2.13 (configurateur)
  US-2.14 (glossaire)

Phase 7 (sprint 11) : Tests et deploiement
  EPIC-6 complet (US-6.1 a US-6.6)
```

### Risques identifies

| # | Risque | Impact | Probabilite | Mitigation |
|---|--------|--------|-------------|------------|
| R1 | Incompatibilite next-intl v4 avec `output: 'export'` | Critique | Faible | next-intl v4 supporte explicitement l'export statique. Faire un POC en US-1.1 avant de continuer. |
| R2 | Regression des pages FR existantes | Critique | Moyenne | Tester systematiquement les pages FR apres chaque story. Faire des snapshots visuels avant/apres. |
| R3 | Qualite de traduction insuffisante | Eleve | Moyenne | Faire relire par un anglophone natif. Ne pas se fier a une traduction 100% automatique. |
| R4 | Explosion du temps de build | Moyen | Moyenne | Le nombre de pages statiques double. Monitorer le temps de build a chaque phase. |
| R5 | Liens casses entre les langues | Eleve | Moyenne | Script de validation automatique qui verifie que chaque lien interne a un equivalent dans les deux langues. |
| R6 | Impact sur le bundle size et les performances | Moyen | Faible | Les messages JSON sont charges par locale (pas de bundle complet). Verifier en US-6.4. |
| R7 | SEO : periode de transition et indexation | Moyen | Moyenne | Mettre les redirections 301 en place immediatement. Soumettre le nouveau sitemap dans Google Search Console. |
| R8 | Complexite du produit cartesien locale x slug | Moyen | Faible | Tester avec un petit sous-ensemble en EPIC-1 avant de generaliser. |
| R9 | Maintenance a long terme : oublier de traduire les nouvelles pages | Moyen | Elevee | Documenter le workflow dans CLAUDE.md, ajouter un check CI qui verifie la parite des fichiers MDX. |

### Hypotheses et decisions cles

1. **Pas de slugs traduits** : les URLs en anglais gardent les memes slugs qu'en francais. Cela simplifie le routing et la maintenance.
2. **Les noms propres restent inchanges** : "The Claude Codex", "Claude Code", les noms de MCP, les noms de commandes CLI.
3. **Le francais reste la langue par defaut** : l'URL canonique x-default pointe vers FR. La redirection racine va vers `/fr/`.
4. **La traduction MDX se fait manuellement** : pas de traduction automatique brute. L'IA peut assister, mais une relecture humaine est obligatoire.
5. **Deploiement progressif possible** : grace au mecanisme de fallback (US-5.3), les pages peuvent etre traduites progressivement.
