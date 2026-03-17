# Guide de captures visuelles — Epic 20

Ce document liste **exactement** chaque capture, GIF et video a realiser pour completer l'Epic 20.
Pour chaque element : quoi capturer, dans quel contexte, le nom de fichier attendu, le format, et ou il sera insere dans le site.

---

## Conventions generales

| Parametre | Valeur |
|-----------|--------|
| **Dossier images** | `public/images/screenshots/` |
| **Dossier GIFs** | `public/images/gifs/` |
| **Dossier videos** | `public/videos/` |
| **Format images** | WebP, max 100 KB, largeur 1280px |
| **Format GIFs** | GIF optimise ou WebP anime, max 2 MB |
| **Format video** | MP4 (H.264) ou YouTube embed |
| **Resolution ecran** | 1920x1080 (Full HD) — reduire a 1280px pour les exports |
| **Theme terminal** | Fond sombre (noir ou tres fonce) pour contraste |
| **Annotations** | Fleches rouges, cercles, encadres avec un outil comme Shottr, CleanShot X, ou ShareX |
| **Nommage** | kebab-case, prefixe par section : `gs-`, `mcp-`, `landing-` |

---

## A. Captures d'ecran (8 images)

### A1 — Terminal macOS

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-terminal-macos.webp` |
| **Remplace** | `terminal-macos.svg` (placeholder actuel) |
| **Quoi capturer** | La fenetre Terminal.app ouverte sur macOS, prompt vide visible (`user@mac ~ %`) |
| **Comment y arriver** | Cmd+Espace → taper "Terminal" → ouvrir → capture |
| **Cadrage** | La fenetre du terminal centree, pas le bureau entier. Taille fenetre ~800x500 |
| **Annotations** | Aucune — l'image parle d'elle-meme |
| **Insere dans** | `content/getting-started/installation.mdx` — section "Un terminal" (Card) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-terminal-macos.webp" alt="Terminal macOS ouvert via Spotlight" caption="Le Terminal sur macOS, accessible via Spotlight (Cmd+Espace)" />` |

---

### A2 — Terminal Windows (PowerShell)

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-terminal-windows.webp` |
| **Remplace** | `terminal-windows.svg` (placeholder actuel) |
| **Quoi capturer** | Windows Terminal ou PowerShell ouvert, prompt visible (`PS C:\Users\user>`) |
| **Comment y arriver** | Win+X → Windows Terminal, ou rechercher "PowerShell" dans le menu Demarrer |
| **Cadrage** | La fenetre PowerShell centree, fond bleu fonce natif de PowerShell |
| **Annotations** | Aucune |
| **Insere dans** | `content/getting-started/installation.mdx` — section "Un terminal" (Card) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-terminal-windows.webp" alt="PowerShell ouvert sur Windows" caption="PowerShell sur Windows, accessible via le menu Demarrer" />` |

---

### A3 — Terminal Linux

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-terminal-linux.webp` |
| **Quoi capturer** | Un emulateur de terminal Linux (GNOME Terminal, Konsole, ou autre) ouvert avec un prompt visible (`user@linux:~$`) |
| **Comment y arriver** | Ctrl+Alt+T (raccourci universel sur la plupart des distributions) |
| **Cadrage** | La fenetre du terminal centree |
| **Annotations** | Aucune |
| **Insere dans** | `content/getting-started/installation.mdx` — section "Un terminal" (Card) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-terminal-linux.webp" alt="Terminal Linux ouvert via Ctrl+Alt+T" caption="Le Terminal sur Linux, raccourci Ctrl+Alt+T" />` |

---

### A4 — Site nodejs.org (bouton LTS)

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-nodejs-download.webp` |
| **Remplace** | `nodejs-download.svg` (placeholder actuel) |
| **Quoi capturer** | La page d'accueil de [nodejs.org](https://nodejs.org) dans un navigateur. Les deux boutons de telechargement doivent etre visibles (LTS et Current) |
| **Comment y arriver** | Ouvrir Chrome/Firefox → aller sur nodejs.org → capturer la zone de telechargement |
| **Cadrage** | La partie haute de la page avec le logo Node.js et les boutons de telechargement. Pas besoin du footer |
| **Annotations** | **Entourer le bouton LTS** avec un cercle ou rectangle rouge + une fleche pointant dessus avec le texte "Cliquez ici" |
| **Insere dans** | `content/getting-started/installation.mdx` — section "Node.js 18 ou superieur" (remplace le SVG actuel ligne 23) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-nodejs-download.webp" alt="Page nodejs.org — bouton LTS entoure en rouge" caption="Telechargez la version LTS (Long Term Support) sur nodejs.org" />` |

---

### A5 — Console Anthropic (creation de cle API)

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-anthropic-console.webp` |
| **Remplace** | `anthropic-console.svg` (placeholder actuel) |
| **Quoi capturer** | La page API Keys de la console Anthropic (console.anthropic.com) avec le bouton "Create Key" visible |
| **Comment y arriver** | Se connecter a console.anthropic.com → aller dans Settings → API Keys |
| **Cadrage** | La zone principale avec la liste des cles API et le bouton de creation. La sidebar peut etre visible |
| **Annotations** | **Entourer le bouton "Create Key"** avec un rectangle rouge + fleche |
| **IMPORTANT** | **MASQUER toutes les cles API visibles** (flouter ou recouvrir). Ne laisser visible que les noms et le bouton |
| **Insere dans** | `content/getting-started/installation.mdx` — section "Un compte Anthropic" (remplace le SVG actuel ligne 35) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-anthropic-console.webp" alt="Console Anthropic — bouton Create Key entoure" caption="Creez votre cle API depuis la console Anthropic" />` |

---

### A6 — Premier lancement de `claude` dans le terminal

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-claude-first-launch.webp` |
| **Quoi capturer** | Le terminal apres avoir tape `claude` pour la premiere fois : le banner "Welcome to Claude Code", l'analyse du projet, et le prompt `>` en attente |
| **Comment y arriver** | Ouvrir un terminal → `cd` dans un dossier de projet existant (qui a un CLAUDE.md ou un package.json) → taper `claude` → attendre le banner |
| **Cadrage** | Du prompt initial `$ claude` jusqu'au prompt `>` en bas. Tout le banner doit etre visible |
| **Annotations** | Aucune — c'est un screenshot de reference |
| **Insere dans** | `content/getting-started/what-is-claude-code.mdx` — en complement du TerminalScreenshot existant (apres ligne 38) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-claude-first-launch.webp" alt="Premier lancement de Claude Code dans un terminal" caption="Le banner de bienvenue de Claude Code lors du premier lancement" />` |

---

### A7 — Dialogue de confirmation y/n

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-claude-confirmation.webp` |
| **Quoi capturer** | Le moment ou Claude Code demande l'accord avant d'agir : la ligne "Voulez-vous que je procede ? (y/n)" ou le bloc montrant les fichiers a creer/modifier avec le prompt de confirmation |
| **Comment y arriver** | Dans une session Claude Code, demander quelque chose de simple (ex: "Cree un fichier hello.txt avec 'Bonjour'"). Attendre que Claude Code affiche son plan et la demande de confirmation. **Ne pas encore taper y** → capturer |
| **Cadrage** | Les 10-15 dernieres lignes du terminal montrant le plan d'action + la question de confirmation |
| **Annotations** | **Entourer la zone y/n** avec un rectangle rouge |
| **Insere dans** | `content/getting-started/first-project.mdx` — apres l'etape 2 (apres la ligne 53) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-claude-confirmation.webp" alt="Claude Code demande confirmation avant de creer un fichier" caption="Claude Code demande toujours votre accord avant d'agir" />` |

---

### A8 — Resultat du premier projet dans le navigateur

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-first-project-result.webp` |
| **Quoi capturer** | Le rendu dans le navigateur de la page HTML creee dans le tutoriel "Premier projet" : la page "Bonjour, je m'appelle [prenom]" avec fond bleu et texte blanc |
| **Comment y arriver** | Suivre le tutoriel : `mkdir ~/ma-premiere-page && cd ~/ma-premiere-page && claude` → demander la page de presentation → `open index.html` → capturer le navigateur |
| **Cadrage** | La fenetre du navigateur complete (avec la barre d'URL montrant `file:///...index.html`). La page doit etre visible en entier |
| **Annotations** | Aucune — le resultat parle de lui-meme |
| **Insere dans** | `content/getting-started/first-project.mdx` — apres l'etape 3 (apres la ligne 70) |
| **Composant** | `<Screenshot src="/images/screenshots/gs-first-project-result.webp" alt="Page Bonjour affichee dans le navigateur — fond bleu, texte blanc" caption="Le resultat de votre premier projet Claude Code, visible dans le navigateur" />` |

---

## B. GIFs demonstratifs (4 GIFs)

### Conseils d'enregistrement

- **Outil recommande** : [asciinema](https://asciinema.org/) (terminal uniquement, tres leger) ou OBS Studio (ecran complet)
- **Conversion en GIF** : `ffmpeg -i video.mp4 -vf "fps=15,scale=800:-1" -loop 0 output.gif` ou [gifski](https://gif.ski/) pour une meilleure qualite
- **Alternative WebP anime** : `ffmpeg -i video.mp4 -vf "fps=15,scale=800:-1" -loop 0 output.webp` (plus leger)
- **Vitesse de frappe** : Taper lentement et deliberement pour que le lecteur puisse suivre
- **Taille fenetre terminal** : 100 colonnes x 30 lignes environ
- **Pause** : Marquer 2-3 secondes de pause apres chaque resultat important pour que le lecteur puisse lire

---

### B1 — Premier prompt simple

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-first-prompt.gif` (ou `.webp`) |
| **Duree** | ~15 secondes |
| **Quoi enregistrer** | Claude Code deja ouvert dans un terminal → l'utilisateur tape un prompt simple ("Cree un fichier hello.txt qui contient 'Bonjour le monde'") → Claude Code repond, propose la creation → l'utilisateur tape `y` → fichier cree → message de succes |
| **Contexte** | Terminal avec fond sombre, dans un dossier vide ou presque vide |
| **Sequence exacte** | 1. Le prompt `>` est visible (1s) → 2. Tape le prompt (3s) → 3. Claude Code analyse et propose (3s) → 4. Tape `y` (1s) → 5. Fichier cree, message de succes (3s) → 6. Pause finale (2s) |
| **Annotations** | Aucune dans le GIF — la sequence est auto-explicative |
| **Insere dans** | `content/getting-started/what-is-claude-code.mdx` — section "Comment ca fonctionne" |
| **Composant** | `<img src="/images/gifs/gs-first-prompt.gif" alt="GIF : Claude Code repond a un premier prompt simple" loading="lazy" style={{ borderRadius: '8px', maxWidth: '100%' }} />` |

---

### B2 — Creation HTML + ouverture navigateur

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-html-creation.gif` (ou `.webp`) |
| **Duree** | ~30 secondes |
| **Quoi enregistrer** | Ecran divise ou sequence : 1) Claude Code recoit une demande de page HTML → 2) Il genere le code → 3) L'utilisateur tape `y` → 4) Le fichier est cree → 5) L'utilisateur ouvre le fichier dans le navigateur → 6) La page s'affiche |
| **Contexte** | Terminal + navigateur cote a cote (ou alt-tab entre les deux). Dossier `~/ma-premiere-page` |
| **Sequence exacte** | 1. Prompt : "Cree une page HTML avec un titre 'Mon Portfolio' et 3 cartes de projets, design sombre" (3s) → 2. Claude Code genere son plan (5s) → 3. Tape `y` (1s) → 4. Fichier cree (3s) → 5. `open index.html` (2s) → 6. Le navigateur affiche la page (5s) → 7. Scroll lent sur la page pour montrer le resultat (8s) → 8. Pause finale (3s) |
| **Annotations** | Aucune |
| **Insere dans** | `content/getting-started/first-project.mdx` — section "Deuxieme projet" (apres l'etape 4, ligne 174) |
| **Composant** | `<img src="/images/gifs/gs-html-creation.gif" alt="GIF : Claude Code cree une page HTML et le resultat dans le navigateur" loading="lazy" style={{ borderRadius: '8px', maxWidth: '100%' }} />` |

---

### B3 — Refactoring sur un projet existant

| Champ | Detail |
|-------|--------|
| **Fichier** | `gs-refactoring.gif` (ou `.webp`) |
| **Duree** | ~30 secondes |
| **Quoi enregistrer** | Claude Code dans un vrai projet (avec plusieurs fichiers) → l'utilisateur demande un refactoring → Claude Code modifie plusieurs fichiers → affiche un resume des changements |
| **Contexte** | Un projet reel ou preprepare avec au moins 5-10 fichiers. Terminal fond sombre |
| **Sequence exacte** | 1. Prompt : "Renomme toutes les variables camelCase en snake_case dans le dossier src/utils/" (3s) → 2. Claude Code analyse les fichiers (3s) → 3. Il liste les modifications prevues (5s) → 4. Tape `y` (1s) → 5. Les fichiers sont modifies un par un avec des ✓ (10s) → 6. Resume : "5 fichiers modifies, 23 variables renommees" (5s) → 7. Pause finale (3s) |
| **Note** | Le contenu exact du prompt peut varier — l'important est de montrer que Claude Code modifie **plusieurs fichiers en une seule demande** |
| **Insere dans** | `content/getting-started/what-is-claude-code.mdx` — section "Cas d'usage concrets" |
| **Composant** | `<img src="/images/gifs/gs-refactoring.gif" alt="GIF : Claude Code refactore plusieurs fichiers en une commande" loading="lazy" style={{ borderRadius: '8px', maxWidth: '100%' }} />` |

---

### B4 — MCP en action (GitHub ou Playwright)

| Champ | Detail |
|-------|--------|
| **Fichier** | `mcp-workflow-demo.gif` (ou `.webp`) |
| **Duree** | ~30 secondes |
| **Quoi enregistrer** | Claude Code utilise un MCP de maniere visible. Option recommandee : Playwright MCP qui prend un screenshot d'une page web. L'utilisateur voit Claude Code appeler le MCP, obtenir un resultat, et agir dessus |
| **Contexte** | Terminal avec Claude Code ouvert dans un projet web. Un serveur de dev tourne deja en arriere-plan (`npm run dev` sur le port 3000) |
| **Sequence exacte (option Playwright)** | 1. Prompt : "Utilise Playwright pour prendre un screenshot de http://localhost:3000 et dis-moi si le design est correct" (3s) → 2. Claude Code appelle le MCP Playwright (3s) → 3. Navigateur s'ouvre / screenshot capture (5s) → 4. Claude Code analyse et donne son avis (10s) → 5. Pause finale (3s) |
| **Sequence exacte (option GitHub)** | 1. Prompt : "Cree une PR sur GitHub avec les changements actuels" (3s) → 2. Claude Code cree une branche, commit, push (8s) → 3. PR creee avec URL affichee (5s) → 4. Pause finale (3s) |
| **Insere dans** | `content/mcp/first-workflow.mdx` — apres la section "Test visuel (Playwright)" (apres ligne 171) |
| **Composant** | `<img src="/images/gifs/mcp-workflow-demo.gif" alt="GIF : Claude Code utilise un MCP pour tester une page web" loading="lazy" style={{ borderRadius: '8px', maxWidth: '100%' }} />` |

---

## C. Video d'introduction (1 video)

### C1 — Video d'introduction complete

| Champ | Detail |
|-------|--------|
| **Fichier** | `intro-claude-code.mp4` (si heberge localement) ou embed YouTube |
| **Duree** | 2-3 minutes |
| **Format** | MP4 H.264, 1920x1080, sous-titres en francais (fichier `.vtt` ou incrustes) |
| **Insere dans** | Landing page `src/app/(landing)/page.tsx` ou `content/getting-started/what-is-claude-code.mdx` |

#### Script de la video

| Timecode | Scene | Ce qu'on voit | Ce qu'on entend/lit (sous-titres) |
|----------|-------|---------------|-----------------------------------|
| 0:00-0:15 | **Intro** | Ecran titre "Claude Code en 3 minutes" avec le logo du site | Musique douce. Texte : "Decouvrez Claude Code, l'assistant IA dans votre terminal" |
| 0:15-0:35 | **Installation** | Terminal : `npm install -g @anthropic-ai/claude-code` → installation reussie → `claude --version` | "L'installation se fait en une seule commande npm" |
| 0:35-0:55 | **Premier lancement** | Terminal : `claude` → banner de bienvenue → prompt `>` | "Lancez Claude Code dans votre terminal et il analyse votre projet" |
| 0:55-1:25 | **Premier prompt** | L'utilisateur tape : "Cree une page HTML portfolio avec design sombre et accents cyan" → Claude Code propose son plan → tape `y` → fichier cree | "Decrivez ce que vous voulez en francais, Claude Code le construit" |
| 1:25-1:45 | **Resultat** | Ouverture de `index.html` dans le navigateur → scroll sur la page → design visible | "Le resultat est immediat — une page web complete en quelques secondes" |
| 1:45-2:10 | **Iteration** | Retour terminal → "Ajoute un formulaire de contact" → Claude Code modifie le fichier → refresh navigateur → formulaire visible | "Iterez naturellement — demandez des modifications comme a un collegue" |
| 2:10-2:30 | **MCP teaser** | Terminal → "Cree une PR sur GitHub" → Claude Code utilise le MCP GitHub → PR creee | "Connectez Claude Code a vos outils avec les MCP" |
| 2:30-2:50 | **Outro** | Ecran de fin avec le logo, l'URL du site, et un CTA "Commencez maintenant" | "Rendez-vous sur claude-codex.fr pour le guide complet" |

#### Conseils d'enregistrement

- **Outil** : OBS Studio (gratuit, multi-plateforme)
- **Preparation** : Faire un dry run complet avant l'enregistrement. Preparer les commandes a taper. Nettoyer le bureau
- **Terminal** : Police grande (16-18pt), fond sombre, aucune notification visible
- **Navigateur** : Mode prive (pas d'onglets parasites), barre de favoris masquee
- **Post-production** : Couper les temps morts, accelerer les phases d'attente (installation npm, generation), ajouter des sous-titres
- **Musique** : Libre de droits, discrete, pas de voix off necessaire (les sous-titres suffisent)

---

## D. Checklist d'integration technique

Apres avoir realise toutes les captures, voici les etapes d'integration :

### Images

- [ ] Convertir toutes les captures en WebP (`cwebp -q 80 input.png -o output.webp`)
- [ ] Verifier que chaque image fait < 100 KB
- [ ] Placer dans `public/images/screenshots/`
- [ ] Remplacer les references aux SVG par les nouveaux WebP dans les MDX

### GIFs

- [ ] Creer le dossier `public/images/gifs/`
- [ ] Optimiser chaque GIF < 2 MB (reduire FPS a 15, largeur a 800px)
- [ ] Ajouter le lazy loading sur chaque `<img>`

### Video

- [ ] Si YouTube : mettre a jour le composant `<VideoEmbed>` avec l'URL
- [ ] Si MP4 local : placer dans `public/videos/`, ajouter sous-titres `.vtt`
- [ ] Verifier la CSP Nginx pour le domaine YouTube (deja fait)

### Verification finale

- [ ] `npm run build` passe sans erreur
- [ ] Score Lighthouse Performance > 90 malgre les images
- [ ] Alt text present sur chaque element visuel
- [ ] Toutes les images ont le lazy loading
- [ ] Aucune cle API ou information sensible visible sur les captures
- [ ] Les captures sont a jour (versions actuelles de Node.js, Claude Code, console Anthropic)

---

## E. Recapitulatif des fichiers a produire

| # | Type | Fichier | Duree/Taille | Priorite |
|---|------|---------|-------------|----------|
| A1 | Screenshot | `gs-terminal-macos.webp` | < 100 KB | Haute |
| A2 | Screenshot | `gs-terminal-windows.webp` | < 100 KB | Haute |
| A3 | Screenshot | `gs-terminal-linux.webp` | < 100 KB | Haute |
| A4 | Screenshot | `gs-nodejs-download.webp` | < 100 KB | Critique |
| A5 | Screenshot | `gs-anthropic-console.webp` | < 100 KB | Critique |
| A6 | Screenshot | `gs-claude-first-launch.webp` | < 100 KB | Critique |
| A7 | Screenshot | `gs-claude-confirmation.webp` | < 100 KB | Haute |
| A8 | Screenshot | `gs-first-project-result.webp` | < 100 KB | Haute |
| B1 | GIF | `gs-first-prompt.gif` | ~15s, < 2 MB | Critique |
| B2 | GIF | `gs-html-creation.gif` | ~30s, < 2 MB | Haute |
| B3 | GIF | `gs-refactoring.gif` | ~30s, < 2 MB | Moyenne |
| B4 | GIF | `mcp-workflow-demo.gif` | ~30s, < 2 MB | Haute |
| C1 | Video | `intro-claude-code.mp4` | 2-3 min | Moyenne |

**Total : 8 screenshots + 4 GIFs + 1 video = 13 assets a produire**
