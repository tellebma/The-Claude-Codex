# Audit UX — Persona "Novice Complet"

**Site audite** : The Claude Codex (claude-codex.fr)
**Date** : 10 mars 2026
**Auditeur** : Agent IA specialise UX
**Persona** : Utilisateur NOVICE COMPLET — n'a jamais ecrit de code, ne connait pas le terminal, ne sait pas ce qu'est une IA generative, aucun bagage technique.

---

## 1. Score global : 5.5 / 10

Le site est bien construit, visuellement soigne et le ton est chaleureux. Cependant, malgre la promesse "en partant de zero" et la mention de profils non-techniques (restauratrice, etudiante en sociologie, entrepreneurs), **le contenu bascule rapidement dans un registre technique qui perd le novice complet**. Le site reussit a intriguer mais echoue a accompagner : il existe un fosse entre la promesse de la landing page ("pour tous") et la realite du contenu (pensee pour des gens qui savent deja ce qu'est un terminal, npm, une API key ou un fichier JSON).

---

## 2. Points forts

### 2.1 La landing page est accueillante et inclusive
- Le titre "Maitrisez Claude Code en partant de zero" est rassurant.
- Le badge "Guide gratuit & open-source" elimine la barriere du cout.
- Les cards de profils (Developpeurs, Entrepreneurs, Etudiants, Creatifs, Curieux, Equipes) donnent le sentiment que le site est pour tout le monde.
- Les temoignages sont excellents : une restauratrice, un lead dev, une etudiante en sociologie. Le novice peut s'identifier a Marie L. qui "n'avait jamais ecrit une ligne de code".
- **Reference** : Notion fait exactement cela sur sa landing page — des use cases concrets par persona pour que chacun se reconnaisse.

### 2.2 Les analogies sont bien choisies
- "Un collegue developpeur senior qui ne dort jamais" pour decrire Claude Code.
- "Des prises USB universelles" pour les MCP.
- "Des recettes de cuisine" pour les Skills.
- "Des applications smartphone" pour les plugins.
- Ces analogies sont le point fort pedagogique du site. Elles ancrent des concepts abstraits dans le quotidien.

### 2.3 Le parcours a trois niveaux est bien pense
- Debutant / Intermediaire / Avance offre une progression lisible.
- Le label "Vous n'avez jamais utilise Claude Code ? Parfait. On part de zero, ensemble." est excellemment formule.

### 2.4 Le configurateur est une idee brillante
- "Repondez a quelques questions et recevez une configuration personnalisee" est exactement ce dont un novice a besoin.
- **Reference** : Google utilise ce pattern dans ses onboarding (Google Workspace, Firebase) — un wizard qui evite la surcharge cognitive.

### 2.5 La structure de navigation est claire
- Le header avec Demarrer / Contenus / MCP / Skills / Prompting / Vision est lisible.
- Chaque section a des sous-pages numerotees (01, 02, 03...) avec un parcours lineaire.

---

## 3. Points faibles

### 3.1 CRITIQUE — Le premier mur : le terminal
Le novice ne sait pas ce qu'est un terminal. La page "Installation" commence par :

> *"Ouvrez votre terminal et tapez la commande suivante : `node --version`"*

Le site dit "sur macOS, utilisez Terminal ou iTerm2. Sur Windows, utilisez PowerShell ou WSL". Mais **a aucun moment on n'explique comment ouvrir un terminal**. Pas de capture d'ecran, pas de video, pas de lien vers un tutoriel.

- **Impact novice** : le novice ne sait pas que son ordinateur a un terminal. Il ne sait pas ou le trouver. Il abandonne ici.
- **Reference Apple** : la documentation Apple pour Swift Playgrounds montre l'ecran, entoure le bouton, et guide clic par clic. Meme pour les taches les plus basiques.

### 3.2 CRITIQUE — L'installation de Node.js est sous-expliquee
Le site dit :

> *"Telechargez-le sur nodejs.org ou utilisez un gestionnaire de versions comme nvm."*

Pour un novice, cela souleve des dizaines de questions non repondues :
- C'est quoi Node.js ? (le site dit "moteur JavaScript" — mais c'est quoi JavaScript ?)
- Pourquoi j'en ai besoin ?
- Sur nodejs.org, il y a deux boutons (LTS et Current) — lequel choisir ?
- Qu'est-ce qu'un "gestionnaire de versions" ? Qu'est-ce que nvm ?
- Comment verifier que l'installation a fonctionne ?

Le troubleshooting propose `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash` — une commande totalement opaque pour un novice.

- **Reference Duolingo** : Duolingo n'affiche jamais une etape complexe d'un coup. Chaque action est isolee, validee, et accompagnee de feedback immediat.

### 3.3 CRITIQUE — Le concept de "cle API" n'est jamais explique au niveau zero
Le site utilise "cle API", "token", "variable d'environnement", "ANTHROPIC_API_KEY", "sk-ant-", "~/.bashrc", "source ~/.bashrc" sans jamais expliquer ces concepts a un novice.

> *"Ajoutez cette ligne a votre ~/.bashrc ou ~/.zshrc"*
> *"export ANTHROPIC_API_KEY="sk-ant-votre-cle-ici""*

Le novice ne sait pas :
- Ce qu'est un fichier .bashrc ou .zshrc
- Ou le trouver
- Comment l'ouvrir
- Comment y ecrire
- Ce que fait la commande `export`
- Ce que fait la commande `source`

**C'est le point de rupture principal du parcours novice.**

- **Reference Stripe** : le onboarding Stripe pour les non-developpeurs offre un mode "no-code" avec copier-coller de snippets, des explications en popover pour chaque terme technique, et des alternatives visuelles.

### 3.4 MAJEUR — Pas de captures d'ecran ni de visuels
L'ensemble du contenu est du texte et des blocs de code. Aucune capture d'ecran ne montre :
- A quoi ressemble un terminal
- Ce qu'on voit quand on lance Claude Code
- L'interface de la console Anthropic pour creer une cle API
- Le resultat d'un premier projet (le fichier HTML rendu dans le navigateur)
- Ce que signifie "y/n" quand Claude Code demande une confirmation

- **Reference Google** : la documentation Google Cloud utilise abondamment les captures d'ecran annotees, avec des fleches et des encadrements colores, pour chaque etape d'un tutoriel.

### 3.5 MAJEUR — Absence de parcours dedie "zero technique"
La landing page promet "en partant de zero" et cible les "Curieux & Autodidactes" et les "Entrepreneurs". Mais des la page d'installation, le parcours est le meme pour tous : terminal, npm, cle API, fichiers de configuration.

Il n'existe pas de :
- Parcours alternatif pour les non-techniques (ex: utiliser Claude Code via un IDE graphique, ou via l'interface web Claude avec acces Code)
- Page "Avant de commencer" qui explique les pre-requis conceptuels (c'est quoi un terminal, c'est quoi une ligne de commande)
- Mode "copier-coller et ca marche" avec des instructions exactes sans choix a faire

### 3.6 MAJEUR — Le jargon non-defini s'accumule
Inventaire des termes utilises sans definition accessible au novice :
- Terminal, CLI, ligne de commande
- Node.js, npm, npx
- API, API key, token, OAuth, JSON-RPC
- Variable d'environnement, PATH, .bashrc, .zshrc
- Git, commit, branch, pull request, merge, diff
- JSON, Markdown, YAML
- MCP, Skills, Plugins (les trois concepts centraux du site)
- Docker, CI/CD, pipeline
- Framework, composant, hook, TypeScript
- Repository, codebase, scaffold, refactoring
- stdin/stdout, processus, serveur

Un glossaire visuel ou des tooltips sur les termes techniques rendraient le contenu accessible.

- **Reference Notion** : Notion affiche des tooltips discrets au survol des termes techniques dans sa documentation. L'utilisateur n'est jamais laisse seul face a un acronyme.

### 3.7 IMPORTANT — Les sections MCP/Skills/Plugins sont incomprehensibles pour un novice
Apres le Getting Started, le site propose immediatement les MCP, les Skills, et les Plugins. Ces trois concepts sont :
- Abstraits (protocoles, serveurs, manifestes JSON)
- Techniques (configuration par fichier JSON, commandes CLI)
- Redondants en surface (un novice ne comprend pas pourquoi il y a trois systemes d'extension)

La page de comparaison Skills vs MCP vs Plugins est utile pour un developpeur mais incomprehensible pour un novice : elle presuppose de comprendre les trois concepts individuellement.

### 3.8 IMPORTANT — Le premier projet suppose trop de connaissances
Le tutoriel "Premier projet" demande de creer un portfolio HTML/CSS. Le prompt d'exemple est excellent :

> *"Cree-moi une page web HTML/CSS moderne avec un header, une section hero..."*

Mais le novice ne sait pas ce que sont HTML, CSS, un "header", un "hero", un "CTA", ou le "responsive". Ces termes sont utilises dans le prompt d'exemple comme si le novice les connaissait.

De plus, l'ouverture du fichier HTML dans un navigateur necessite des commandes systeme (`open`, `xdg-open`, `explorer.exe`) qui ne sont pas expliquees.

### 3.9 MOYEN — Les couts ne sont pas clairement presentes pour le novice
Le site mentionne :
- "API pay-as-you-go" (incomprehensible)
- "$5-15 par jour d'utilisation active" (effrayant sans contexte)
- "Abonnement Max $100/mois" (cher pour un curieux)
- "Abonnement Pro $20/mois" (mentionnable mais l'acces a Claude Code est "limite")

Il manque un comparatif simple et visuel : "Pour essayer gratuitement / Pour un usage regulier / Pour un usage professionnel", avec des montants clairs et un conseil pour le novice ("commencez par X").

### 3.10 MOYEN — La page Prompting est tres superficielle
Pour un novice, le prompting est LE sujet central : comment parler a l'IA. Or la page est la plus courte du site (97 lignes MDX). Elle donne 5 principes en une phrase chacun, un tableau d'erreurs courantes, et c'est tout. Pas d'exemples detailles, pas de cas concrets par profil (entrepreneur, etudiant, creatif), pas d'exercices pratiques.

- **Reference Duolingo** : chaque lecon est interactive. Le site pourrait proposer des exercices de prompting : "Redigez un prompt pour X, comparez avec notre version optimisee."

### 3.11 MOYEN — La page "Vision et tendances IA" est hors sujet pour le novice
Un novice complet qui n'a pas encore reussi a installer l'outil n'a aucune utilite pour une page sur "les agents autonomes" et le "protocole MCP comme standard universel". Cette page s'adresse a un public deja convaincu et informe.

---

## 4. Elements manquants

### 4.1 CRITIQUE — Un guide "Pre-requis pour grands debutants"
Une page zero avant le Getting Started qui explique :
- Ce qu'est un ordinateur au sens logiciel (systeme d'exploitation, fichiers, dossiers)
- Ce qu'est un terminal et comment l'ouvrir (avec captures d'ecran pour macOS, Windows, Linux)
- Ce qu'est une ligne de commande (taper du texte, appuyer sur Entree, lire le resultat)
- Ce qu'est un mot de passe d'application / une cle API (analogie : un badge d'acces)
- Ce qu'est l'intelligence artificielle en 2 paragraphes

### 4.2 CRITIQUE — Des captures d'ecran et/ou des videos
Chaque etape du Getting Started devrait etre accompagnee d'une capture d'ecran annotee ou d'un GIF anime montrant exactement ce que l'utilisateur doit voir a l'ecran.

Au minimum :
- Comment ouvrir le terminal sur macOS / Windows
- L'ecran de nodejs.org avec le bouton a cliquer
- La console Anthropic pour creer un compte et obtenir une cle API
- Ce qu'on voit quand on lance `claude` pour la premiere fois
- Le dialogue de confirmation y/n dans Claude Code
- Le resultat du premier projet dans un navigateur

### 4.3 CRITIQUE — Un mode "copier-coller complet"
Pour chaque etape d'installation, un bloc unique a copier-coller qui fonctionne sans comprendre. Pas de choix a faire, pas de "ou", pas de "si vous utilisez X alors Y". Un chemin unique et direct.

Exemple : au lieu de proposer deux methodes d'authentification (cle API OU abonnement), recommander une seule methode pour le debutant avec un callout "Pour les utilisateurs avances, vous pouvez aussi..."

### 4.4 IMPORTANT — Un glossaire interactif
Un glossaire accessible depuis toutes les pages, idealement avec des tooltips au survol des termes techniques dans le contenu. Chaque terme devrait avoir :
- Une definition en une phrase simple
- Une analogie concrete
- Un lien vers la page ou le concept est explique en detail

### 4.5 IMPORTANT — Des parcours guides par persona
Plutot que le meme contenu pour tous, proposer des parcours differencies :
- **Parcours "Je n'ai jamais code"** : pre-requis → installation simplifiee → premier projet ultra-simple (une page web personnelle) → comprendre les resultats
- **Parcours "Je suis developpeur"** : installation rapide → configuration avancee → MCP → Skills → prompting avance
- **Parcours "Je suis entrepreneur/manager"** : quoi faire avec Claude Code (cas d'usage business) → installation → automatisations concretes (emails, rapports, prototypes)

- **Reference Apple** : l'App Store propose des parcours "Debutant / Avance" et les Apple Developer Tutorials classent le contenu par niveau d'experience.

### 4.6 IMPORTANT — Des exercices interactifs ou des "challenges"
Apres chaque lecon, proposer un mini-defi :
- "Ouvrez votre terminal et tapez `echo bonjour` — qu'est-ce qui s'affiche ?"
- "Demandez a Claude Code de creer une page web qui dit 'Bonjour [votre prenom]'"
- "Modifiez la couleur du fond de votre page en demandant a Claude Code"

- **Reference Duolingo** : progression par micro-defis, validation immediate, celebration du succes.

### 4.7 IMPORTANT — Une FAQ "Questions betes"
Les novices ont des questions qu'ils n'osent pas poser :
- "Est-ce que ca peut casser mon ordinateur ?"
- "Est-ce que l'IA voit mes fichiers personnels / photos ?"
- "C'est quoi la difference entre ChatGPT et Claude Code ?"
- "Est-ce que c'est legal ?"
- "J'ai besoin d'Internet pour l'utiliser ?"
- "Ca marche sur mon Chromebook / tablette / telephone ?"
- "C'est vraiment gratuit ?"

### 4.8 NICE-TO-HAVE — Un indicateur de progression
Un bandeau ou une sidebar montrant ou le novice en est dans son parcours : "Etape 2/4 — Installation". Avec un pourcentage de completion.

- **Reference Duolingo / Notion** : barre de progression visible, etapes cochables, celebration a chaque palier.

### 4.9 NICE-TO-HAVE — Un mode sandbox en ligne
Permettre au novice d'essayer Claude Code dans le navigateur, sans rien installer. Meme si c'est une simulation limitee, cela eliminerait la barriere de l'installation.

- **Reference Stripe** : Stripe propose un mode sandbox pour tester l'API sans creer de compte.

---

## 5. Evaluation section par section

### 5.1 Landing Page — BON (7/10)
| Critere | Evaluation |
|---------|-----------|
| Comprehension du produit | Bonne : on comprend que c'est un assistant IA |
| Identification du novice | Bonne : les profils "Curieux", "Etudiants" rassurent |
| Clarte du premier pas | Moyenne : le CTA "Commencer le guide" est clair mais le second CTA "Decouvrir les MCP" est incomprehensible pour un novice |
| Temoignages | Excellents : Marie la restauratrice est un modele d'identification |
| Configurateur | Tres bonne idee, mais le novice ne sait pas encore de quoi il a besoin |

**Recommandation** : Remplacer le CTA secondaire "Decouvrir les MCP" par quelque chose comme "Comment ca marche ?" ou "Voir un exemple en 2 minutes". Le novice ne sait pas ce qu'est un MCP.

### 5.2 Getting Started — Qu'est-ce que Claude Code ? — BON (7/10)
| Critere | Evaluation |
|---------|-----------|
| Clarte de la definition | Bonne : "un assistant IA en ligne de commande" est comprehensible |
| Analogie | Excellente : "un collegue developpeur senior" |
| Tableau comparatif | Inutile pour un novice (ne connait ni Copilot ni Cursor) |
| Cas d'usage | Bons mais trop orientes code pour un novice |

**Recommandation** : Ajouter une section "En termes simples" qui dit : "Imaginez que vous pouvez demander a votre ordinateur de faire n'importe quelle tache informatique en la decrivant avec vos mots. C'est ca, Claude Code."

### 5.3 Getting Started — Installation — MAUVAIS (3/10)
| Critere | Evaluation |
|---------|-----------|
| Accessibilite des instructions | Tres faible : presuppose de connaitre le terminal, npm, les variables d'environnement |
| Captures d'ecran | Aucune |
| Gestion des erreurs | Bonne section troubleshooting, mais les solutions sont aussi techniques que le probleme |
| Choix de methode d'authentification | Confusant : deux methodes, aucune recommandation claire pour le debutant |

**Recommandation** : Creer une version "Installation pour debutant absolu" avec captures d'ecran clic par clic, un seul chemin d'installation recommande, et zero jargon.

### 5.4 Getting Started — Configuration — MAUVAIS (2/10)
| Critere | Evaluation |
|---------|-----------|
| Comprehension du concept | Tres faible : "trois niveaux de configuration" n'a aucun sens pour un novice |
| Complexite du contenu | Elevee : fichiers JSON, variables d'environnement, permissions, settings.json |
| Necessite pour le novice | Discutable : la plupart des reglages sont pour des utilisateurs avances |
| Exemples CLAUDE.md | Bons mais trop techniques (TypeScript, Prisma, Vitest) |

**Recommandation** : Scinder en deux pages. "Configuration rapide" (pour novices : juste lancer Claude Code, c'est tout) et "Configuration avancee" (pour les utilisateurs confirmes : settings.json, permissions, CLAUDE.md).

### 5.5 Getting Started — Premier projet — MOYEN (5/10)
| Critere | Evaluation |
|---------|-----------|
| Objectif clair | Oui : "creer une page web en 5 minutes" est motivant |
| Prompt d'exemple | Bon mais presuppose la connaissance du vocabulaire web (header, hero, CTA, responsive) |
| Visualisation du resultat | Faible : pas de capture du resultat final |
| Progression | Bonne : de simple a complexe |
| Commandes slash | Le tableau des commandes utiles est un bonus apprecie |

**Recommandation** : Proposer un prompt d'exemple encore plus simple pour le tout premier essai. Exemple : "Cree-moi une page web qui dit 'Bonjour, je m'appelle [prenom]' avec un fond bleu et un texte blanc." Montrer le resultat avec une capture d'ecran.

### 5.6 Section MCP (6 pages) — MAUVAIS (2/10) pour un novice
| Critere | Evaluation |
|---------|-----------|
| Comprehension du concept | L'analogie USB est bonne, mais le concept reste abstrait |
| Installation d'un MCP | Totalement inaccessible pour un novice (JSON, npx, tokens OAuth, stdin/stdout) |
| Pages "Top MCP" | Catalogues pour developpeurs, pas de guidage pour novice |
| Premier workflow | Presuppose de savoir utiliser Git, npm, et trois MCP configures |

**Recommandation** : Ajouter un callout en haut de la section MCP : "Les MCP sont des fonctionnalites avancees. Si vous debutez, commencez par le [guide de demarrage](/getting-started) et revenez ici quand vous serez a l'aise avec les bases."

### 5.7 Section Skills (4 pages) — MAUVAIS (2.5/10) pour un novice
| Critere | Evaluation |
|---------|-----------|
| Comprehension du concept | L'analogie "recette de cuisine" est efficace |
| Exemples de Skills | Tous destines aux developpeurs (TDD, Code Review, E2E Testing) |
| Creation d'un Skill custom | Completement inaccessible a un novice |
| Page de comparaison | Utile pour un intermediaire/avance, pas pour un novice |

**Recommandation** : Proposer des exemples de Skills non-techniques : un Skill "rediger un email professionnel", un Skill "resumer un document", un Skill "organiser mes fichiers". Montrer que les Skills ne sont pas reserves aux developpeurs.

### 5.8 Section Plugins (5 pages) — MAUVAIS (2/10) pour un novice
| Critere | Evaluation |
|---------|-----------|
| Comprehension du concept | Correcte grace a l'analogie "applications smartphone" |
| Contenu | 100% oriente developpeurs (frontend-design, TDD-guide, security-guidance) |
| Installation | Commandes CLI type `/plugin install` — le novice ne sait pas ou taper cela |
| Plugins design | Uniquement pour des developpeurs frontend |

**Recommandation** : Meme traitement que les MCP — signaler clairement que c'est du contenu avance, et proposer quelques plugins accessibles aux non-developpeurs.

### 5.9 Page Prompting — MOYEN (4/10)
| Critere | Evaluation |
|---------|-----------|
| Les 5 principes | Corrects mais superficiels — une phrase par principe |
| Exemples | Un seul exemple (formulaire React — technique) |
| Profondeur | Tres insuffisante : c'est la page la plus courte et la plus importante pour un novice |
| Interactivite | Aucune : pas d'exercice, pas de comparaison avant/apres detaillee |

**Recommandation** : C'est la page qui devrait etre la plus longue et la plus travaillee pour un novice. Le prompting est la competence fondamentale. Ajouter 10+ exemples par profil (entrepreneur, etudiant, creatif), des exercices pratiques, des anti-patterns illustres, et une progression du prompt "basique" au prompt "expert".

### 5.10 Page Vision — CORRECT (5/10)
| Critere | Evaluation |
|---------|-----------|
| Inspiration | Oui, la page donne envie d'apprendre |
| Pertinence pour le novice | Faible : les tendances sont trop techniques |
| Roadmap | Bonne transparence sur le futur du projet |
| Conseil pratique | "20 minutes par jour" est un bon conseil actionnable |

**Recommandation** : Ajouter des exemples concrets de transformation par metier : "Avant Claude Code / Apres Claude Code" pour un restaurateur, un etudiant, un freelance.

---

## 6. Recommandations d'amelioration priorisees

### CRITIQUE (a faire en premier — impacte directement l'abandon du novice)

| # | Recommandation | Justification | Reference |
|---|---------------|---------------|-----------|
| C1 | **Creer une page "Pre-requis zero" avant le Getting Started** : qu'est-ce qu'un terminal, comment l'ouvrir (captures d'ecran macOS/Windows/Linux), qu'est-ce qu'une commande | Le novice abandonne des la premiere etape car il ne sait pas ouvrir un terminal | Apple Swift Playgrounds : guide clic par clic avec captures annotees |
| C2 | **Ajouter des captures d'ecran annotees a CHAQUE etape du Getting Started** : terminal, nodejs.org, console Anthropic, premier lancement de Claude Code, dialogue y/n, resultat final | Le contenu est 100% textuel. Un novice a besoin de voir ce qu'il doit voir a l'ecran | Google Cloud documentation, Stripe docs |
| C3 | **Simplifier le chemin d'installation en un seul parcours recommande** : ne plus proposer "methode 1 OU methode 2". Recommander UN chemin (abonnement Claude Max + authentification Claude App) pour le novice | Les choix multiples paralysent le novice (paradoxe du choix). Il ne sait pas quelle methode est la bonne pour lui | Duolingo : un seul chemin, zero choix au debut |
| C4 | **Expliquer chaque terme technique a son premier usage** : au minimum avec un tooltip ou un lien vers un glossaire. "Terminal", "npm", "API key", "variable d'environnement" — chaque terme doit etre defini la premiere fois | L'accumulation de jargon non-defini cree un sentiment d'exclusion et d'incompetence | Notion : tooltips discrets sur les termes techniques |
| C5 | **Transformer la page Prompting en guide detaille et illustre** : 10+ exemples concrets par profil, exercices pratiques, comparaisons avant/apres, templates recopiables | Le prompting est LA competence fondamentale pour un novice, et c'est la page la plus courte du site | Duolingo : lecons interactives, progression par micro-defis |

### IMPORTANT (a faire ensuite — ameliore significativement l'experience)

| # | Recommandation | Justification | Reference |
|---|---------------|---------------|-----------|
| I1 | **Creer des parcours differencies par persona** : "Je n'ai jamais code" / "Je suis developpeur" / "Je suis entrepreneur" avec des contenus et une progression adaptes | Le parcours actuel est unique et s'adresse implicitement a des gens qui ont des bases techniques | Apple Developer : contenus par niveau d'experience |
| I2 | **Ajouter un glossaire interactif** accessible depuis le header, avec definitions simples, analogies et liens vers les pages pertinentes | Le site utilise 50+ termes techniques sans les definir | Stripe : glossaire en sidebar de la documentation |
| I3 | **Proposer un premier projet ultra-simple pour le novice** : "Cree une page qui dit bonjour avec ton prenom" au lieu du portfolio complet | Le prompt d'exemple actuel presuppose la connaissance du vocabulaire web | Khan Academy : exercices simples avant les concepts complexes |
| I4 | **Ajouter des exemples de Skills/MCP non-techniques** : resume d'email, generation de rapport, organisation de fichiers, recherche web | Les exemples actuels sont 100% developpement (TDD, Code Review, CI/CD) | Notion : templates par metier et usage, pas par technologie |
| I5 | **Marquer clairement les sections "Avancees"** avec un badge et un message d'aiguillage | Le novice qui arrive sur la page MCP ou Plugins sans etre pret va se sentir submerge | Kubernetes docs : labels "Beginner / Intermediate / Advanced" sur chaque page |
| I6 | **Ajouter une FAQ "Questions de debutant"** : securite, legalite, cout, compatibilite, confidentialite | Les novices ont des freins emotionnels (peur de casser, cout, vie privee) que le contenu actuel ne traite pas | Stripe : FAQ tres detaillee dans le onboarding |
| I7 | **Remplacer le CTA secondaire "Decouvrir les MCP" sur la landing** par "Comment ca marche ?" ou "Voir un exemple" | "MCP" est un acronyme technique incomprehensible pour un novice sur la premiere page du site | Toute bonne landing page utilise un langage accessible dans ses CTA |

### NICE-TO-HAVE (ameliorations de confort)

| # | Recommandation | Justification | Reference |
|---|---------------|---------------|-----------|
| N1 | **Ajouter un indicateur de progression** : barre, etapes cochees, pourcentage | Le novice a besoin de savoir ou il en est et combien il lui reste | Duolingo : barre de progression omni-presente |
| N2 | **Proposer un mode sandbox en ligne** pour tester Claude Code sans installation | Elimine la barriere de l'installation et donne un apercu immediat de la valeur | Stripe, Vercel : sandbox en ligne avant inscription |
| N3 | **Ajouter des GIFs ou videos courtes** (30 secondes) montrant Claude Code en action | "Montrer, pas dire" — une video de Claude Code creant un site en 30 secondes vaut mille mots | Product Hunt : demo GIF standard pour chaque produit |
| N4 | **Gamifier la progression** avec des badges ou des niveaux : "Vous avez installe Claude Code — Badge 'Premier pas'" | La motivation extrinsèque aide les novices a perseverer | Duolingo : streaks, badges, celebrations |
| N5 | **Ajouter un chatbot d'aide** sur le site qui utilise Claude pour repondre aux questions sur le contenu du guide | Le novice aurait un assistant directement dans le contexte de son apprentissage | Intercom, Notion AI |
| N6 | **Proposer un "Kit de demarrage telechargeable"** : un PDF ou un zip avec toutes les commandes a copier-coller, les captures d'ecran, et un parcours imprimable | Certains novices preferent un support offline ou imprime | Apple : guides PDF telechargeables |

---

## 7. Synthese par priorite

```
CRITIQUE (bloquant — le novice abandonne)
  C1. Page "Pre-requis zero" avec captures d'ecran
  C2. Captures d'ecran annotees dans le Getting Started
  C3. Un seul chemin d'installation recommande
  C4. Definitions des termes techniques au premier usage
  C5. Page Prompting detaillee et illustree

IMPORTANT (freinant — le novice se sent perdu)
  I1. Parcours differencies par persona
  I2. Glossaire interactif
  I3. Premier projet ultra-simple
  I4. Exemples non-techniques de Skills/MCP
  I5. Badges "Avance" sur les sections MCP/Skills/Plugins
  I6. FAQ "Questions de debutant"
  I7. CTA landing page accessible

NICE-TO-HAVE (confort — le novice apprecie)
  N1. Indicateur de progression
  N2. Sandbox en ligne
  N3. GIFs/videos demonstratives
  N4. Gamification (badges, niveaux)
  N5. Chatbot d'aide contextuel
  N6. Kit de demarrage telechargeable
```

---

## 8. Conclusion

The Claude Codex est un projet ambitieux avec un vrai potentiel d'impact. La qualite editoriale est elevee, le ton est chaleureux, les analogies sont pertinentes, et la structure du site est logique. Cependant, **il existe un ecart significatif entre la promesse ("en partant de zero", "pour les curieux", "sans etre dev") et la realite du contenu**, qui presuppose un minimum de connaissances techniques des la deuxieme page.

Le site fonctionne tres bien pour un **developpeur debutant** (quelqu'un qui connait le terminal mais decouvre Claude Code). Il est **insuffisant pour un novice complet** (la restauratrice Marie du temoignage, l'etudiante en sociologie Amina, le manager qui veut automatiser ses rapports).

Pour servir veritablement ce persona, le site a besoin de deux choses fondamentales :
1. **Un sas d'entree** : une ou deux pages qui amenent le novice du niveau zero au niveau ou le Getting Started actuel devient comprehensible.
2. **Du visuel** : des captures d'ecran, des GIFs, des videos courtes. Le texte seul ne suffit pas pour guider quelqu'un qui n'a jamais vu un terminal.

Les recommandations critiques (C1 a C5) representent le travail le plus urgent et le plus impactant. Leur mise en oeuvre transformerait l'experience du novice complet et alignerait la realite du site avec la promesse de sa landing page.
