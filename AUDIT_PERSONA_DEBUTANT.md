# Audit UX -- Persona "Debutant"

**Site audite** : The Claude Codex (claude-codex.fr)
**Date** : 10 mars 2026
**Auditeur** : Analyse UX specialisee persona debutant
**Methode** : Revue exhaustive du contenu, de la structure de navigation, et des parcours utilisateur du point de vue d'un utilisateur non-developpeur

---

## Profil du persona evalue

**Marie, 34 ans, responsable marketing dans une PME.**
- Utilise un ordinateur tous les jours (email, tableur, presentations)
- A entendu parler de ChatGPT et de l'IA generative
- N'a jamais ecrit de code
- Sait vaguement ce qu'est un terminal mais ne l'a jamais utilise
- Motivee pour apprendre a utiliser l'IA pour automatiser certaines taches
- Objectif : "Je veux comprendre si Claude Code peut m'aider et comment l'installer"

---

## Score global : 5.5 / 10

Le site a une qualite editoriale remarquable et une volonte sincere d'etre accessible. Cependant, il y a un decalage structurel entre la promesse faite sur la landing page ("pour tous", "en partant de zero") et la realite du contenu qui reste fondamentalement tourne vers des utilisateurs ayant deja des bases techniques. Un debutant complet sera enthousiaste en arrivant sur la landing page, puis progressivement perdu a partir de la page d'installation.

---

## 1. Landing page

**Evaluation : BON (7/10)**

### Points forts
- **Promesse claire et inclusive** : "Maitrisez Claude Code en partant de zero" est un excellent titre qui rassure le debutant.
- **Section "Pour tous"** : Les 6 cards d'audience (Developpeurs, Entrepreneurs, Etudiants, Creatifs, Curieux, Equipes) donnent au debutant le sentiment d'etre bienvenu.
- **Temoignage de Marie L., restauratrice** : "Je n'avais jamais ecrit une ligne de code. En une semaine avec Claude Code, j'ai lance le site de mon restaurant." C'est exactement ce qu'un debutant a besoin d'entendre. C'est un excellent point a la Canva.
- **Parcours par niveau** : La section "Choisissez votre chemin" avec Debutant/Intermediaire/Avance est un excellent pattern d'onboarding (comparable a Notion ou Duolingo).
- **Terminal preview anime** : Donne un apercu visuel concret de ce que fait Claude Code.
- **Configurateur promis** : "Votre configuration sur mesure en 2 minutes" est exactement ce qu'un debutant attend -- malheureusement, il est "bientot disponible".

### Points faibles
- **Le deuxieme CTA "Decouvrir les MCP"** est place au meme niveau que "Commencer le guide". Un debutant ne sait pas ce qu'est un MCP. Ce bouton ne devrait pas etre au meme niveau hierarchique que le CTA principal. Comparaison : Canva ne met jamais un bouton "Decouvrir l'API" a cote de "Commencer a creer".
- **Le terminal preview utilise du jargon** : "authentification", "dashboard admin" -- le debutant ne sait pas encore ce que ca signifie visuellement.
- **Le parcours "Debutant" dit "Comprendre le terminal et les bases"** mais il n'existe aucune page qui explique ce qu'est un terminal. Le lien pointe vers `/getting-started` qui ne contient pas cette explication fondamentale.
- **Les 8 FeatureCards "Ce que vous pouvez faire"** melangent des cas accessibles ("Creer un site web", "Generer des documents") avec des cas tres techniques ("Automatiser vos taches : scripts, pipelines CI/CD, migrations de donnees"). Le debutant ne sait pas ce qu'est un pipeline CI/CD.

### Elements manquants
- **Video d'introduction de 2 minutes** : Canva, Notion et Zapier ont tous une video hero qui montre l'outil en action. Un debutant a besoin de voir avant de lire.
- **Estimation du cout clairement visible** : Le site ne dit nulle part sur la landing page combien coute Claude Code. "Guide gratuit" oui, mais l'outil lui-meme ? Le debutant se demande immediatement : "C'est gratuit ? Combien ca coute ?"
- **Un quiz/parcours interactif** : Le configurateur est la bonne idee, mais il n'est pas encore disponible. En attendant, un simple questionnaire "Quel est votre profil ?" qui redirige vers le bon point de depart serait tres utile.

---

## 2. Getting Started -- "Qu'est-ce que Claude Code ?"

**Evaluation : MOYEN (6/10)**

### Points forts
- **Analogie du collegue developpeur senior** : "Imaginez un collegue developpeur senior qui connait votre codebase sur le bout des doigts" est une bonne image.
- **Etapes numerotees** (Contexte automatique, Conversation naturelle, Actions concretes) : Le composant `<Steps>` structure bien le propos.
- **Tableau comparatif** Claude Code vs Copilot vs Cursor : Utile pour le lecteur qui a deja entendu parler de ces outils.
- **Section "A qui s'adresse Claude Code"** avec cards par profil : Bonne structuration.
- **Cas d'usage concrets** : La liste a puces donne des exemples tangibles.

### Points faibles
- **"Assistant IA en ligne de commande"** : C'est la premiere phrase. Un debutant ne sait pas ce qu'est une "ligne de commande". Le site devrait d'abord expliquer ce concept avec une image ou une animation AVANT de l'utiliser. Comparaison : Notion explique "qu'est-ce qu'un workspace" avant de parler de templates.
- **Le callout "Terminal = Superpouvoir"** dit "il cree des fichiers, execute des commandes, analyse votre arborescence et interagit avec Git". Pour un debutant, "arborescence" et "Git" sont des mots inconnus. Le callout qui devrait rassurer risque d'intimider.
- **Le tableau comparatif utilise des termes opaques** : "Extension IDE", "CLI", "Suggestions inline", "MCP", "Skills". Un debutant ne comprend aucune de ces colonnes.
- **"Il peut lancer vos tests, verifier votre build, analyser vos logs"** : Ce sont des concepts 100% developpeur. La page dit s'adresser aux non-developpeurs mais le vocabulaire est exclusivement technique.
- **La card "Non-developpeurs"** est la plus courte des trois, alors que c'est le persona qui a le plus besoin d'information. Elle dit "Decrivez ce que vous voulez, Claude Code le construit" sans donner d'exemple concret adapte (pas de code, pas de terminal).

### Elements manquants
- **Une capture d'ecran ou GIF** montrant Claude Code en action. Le debutant a besoin de VOIR l'interface avant de s'engager dans l'installation.
- **Un glossaire ou tooltip** sur les termes techniques (terminal, CLI, API, Git, etc.). A la maniere de Stripe qui affiche des definitions au survol.
- **Un exemple concret pour non-developpeur** : "Marie voulait creer un formulaire d'inscription pour ses cours de yoga. Elle a tape X dans le terminal, et voici ce que Claude Code a produit : [screenshot]."
- **Un lien "Je ne suis pas developpeur, par ou commencer ?"** qui redirige vers un parcours specifique.

---

## 3. Getting Started -- "Prerequis et installation"

**Evaluation : MAUVAIS (3/10)**

C'est la page la plus critique pour le persona debutant, et c'est la ou le site echoue le plus.

### Points forts
- **Structure en etapes** : L'utilisation de `<Steps>` et les cards prerequis donnent une structure claire.
- **Section troubleshooting** : Les erreurs courantes sont listees avec des solutions, ce qui est une bonne pratique.
- **Callout "Ne jamais utiliser sudo"** : Montre une attention a la securite et aux bonnes pratiques.
- **Double methode d'authentification** (API key vs abonnement Max) : Le debutant peut choisir la voie la plus simple.

### Points faibles
- **"Node.js 18 ou superieur"** : Le debutant ne sait pas ce qu'est Node.js. La description dit "le moteur JavaScript qui permet d'executer du code cote serveur" -- ce qui est incomprehensible pour quelqu'un qui ne sait pas ce qu'est JavaScript ni ce que signifie "cote serveur". Comparaison : Canva ne demande jamais d'installer un moteur de rendu pour utiliser son outil.
- **"Un terminal"** : La card dit "Claude Code vit dans le terminal" sans expliquer ce qu'est un terminal ni comment l'ouvrir. Dire "Sur macOS, utilisez Terminal ou iTerm2" presuppose que le debutant sait ce qu'est iTerm2. Un debutant ne sait meme pas ou trouver l'application Terminal sur son Mac.
- **La commande `npm install -g @anthropic-ai/claude-code`** : Pour un debutant, cette ligne est un mur. Il ne sait pas ce qu'est `npm`, ce que signifie `-g`, ce qu'est un "paquet" ou un "flag". L'explication est donnee APRES la commande, pas avant.
- **La configuration de la cle API** exige de modifier `~/.bashrc` ou `~/.zshrc`. Un debutant ne sait pas ce que sont ces fichiers, ne sait pas comment les ouvrir, ne sait pas ce que signifie `export`, ne sait pas ce que signifie `source`. Il y a 5 concepts inconnus dans 3 lignes de commande.
- **Le troubleshooting propose d'installer `nvm`** avec `curl -o- https://... | bash`. Pour un debutant, executer une commande curl qui telecharge et execute un script est aussi opaque que du code machine. En plus, c'est une pratique que meme des developpeurs avances questionnent d'un point de vue securite.
- **Aucune capture d'ecran** : Il n'y a pas une seule image montrant a quoi ressemble un terminal avec ces commandes. Le debutant navigue entierement "a l'aveugle".

### Elements manquants
- **Un tutoriel visuel "Ouvrir un terminal"** pour chaque OS avec captures d'ecran annotees. Zapier fait ca magistralement pour ses integrations : chaque etape a une capture d'ecran.
- **Un guide "Installer Node.js" complet et visuel** : Le lien vers nodejs.org est insuffisant. Il faudrait guider etape par etape avec des captures d'ecran du site nodejs.org, du processus d'installation, et de la verification.
- **Une alternative sans installation** : Proposer un environnement en ligne (type Replit, CodeSandbox, ou GitHub Codespaces) ou le debutant peut essayer Claude Code SANS installer quoi que ce soit sur sa machine. C'est le pattern d'onboarding numero 1 en 2026.
- **Un indicateur de cout clair** : La page mentionne "$5-15 par jour d'utilisation active" pour l'API et "$100/mois" pour Max, mais ces informations sont noyees dans un callout. Le debutant a besoin d'un tableau clair et visible : "Combien ca coute pour mon usage ?".

---

## 4. Getting Started -- "Configuration de l'environnement"

**Evaluation : MAUVAIS (3/10)**

### Points forts
- **La metaphore du briefing d'equipe** pour le CLAUDE.md : "Imaginez que vous accueillez un nouveau developpeur" est comprehensible.
- **Le template CLAUDE.md** donne un exemple concret a copier-coller.
- **Le conseil "Commencez permissif, affinez ensuite"** est un bon pattern progressif.

### Points faibles
- **Cette page est entierement inutile pour un debutant.** Les concepts de `settings.json`, CLAUDE.md hierarchique, permissions `allow`/`deny` avec des patterns glob, et la configuration par projet sont des preoccupations de developpeur intermediaire ou avance. Un debutant n'a pas besoin de savoir ce qu'est un "barrel file" dans un monorepo.
- **Le JSON de configuration** avec `"permissions": { "allow": ["Read", "Glob", "Grep", "Bash(git *)"] }` est incomprehensible pour le persona. Il ne sait pas ce que sont Read, Glob, Grep, ou Bash.
- **L'arborescence hierarchique du monorepo** (`mon-monorepo/apps/web/CLAUDE.md`) est un concept avance qui n'a aucune pertinence pour un debutant qui n'a meme pas encore cree son premier projet.

### Elements manquants
- **Un mode "zero-config"** : Le debutant devrait pouvoir utiliser Claude Code sans AUCUNE configuration. La page devrait dire : "Si vous debutez, vous pouvez ignorer cette page et passer directement au premier projet. La configuration par defaut est suffisante pour commencer."
- **Un assistant de configuration** : Au lieu d'expliquer settings.json, proposer un wizard interactif (comme le fait VS Code au premier lancement).

---

## 5. Getting Started -- "Premier projet pas a pas"

**Evaluation : MOYEN-BON (6.5/10)**

### Points forts
- **C'est la meilleure page du Getting Started** pour le debutant. Le tutoriel est concret : "Creez un dossier, lancez Claude Code, decrivez ce que vous voulez."
- **Le prompt d'exemple est excellent** : La demande de portfolio est precise, structuree, et donne un resultat tangible.
- **Les etapes d'iteration** sont tres bien faites : "Ajoute une animation", "Change la couleur", "Ajoute un formulaire". Ca montre la puissance du dialogue iteratif.
- **Le callout "L'iteration, c'est la cle"** est un excellent conseil pedagogique.
- **Les commandes utiles** (`/help`, `/clear`, `/cost`, `Ctrl+C`, `Ctrl+D`) sont presentees dans un tableau clair.
- **Les bonnes pratiques** "Commencez petit", "Soyez precis", "Iterez rapidement" sont du pur bon sens accessible.

### Points faibles
- **La commande `mkdir ~/mon-premier-site && cd ~/mon-premier-site`** : Le debutant ne sait pas ce que signifient `mkdir`, `~`, `&&`, ou `cd`. La page presuppose que le lecteur comprend le terminal.
- **`open index.html` / `xdg-open index.html` / `explorer.exe index.html`** : Trois commandes differentes selon l'OS, sans explication de comment savoir lequel utiliser. La mention "Ou simplement : glissez le fichier dans votre navigateur" est la SEULE instruction que le debutant comprendra, mais elle est en dernier.
- **La section "Aller plus loin : un projet Next.js"** est prematuree. Un debutant vient de creer son premier fichier HTML, on lui propose immediatement un projet Next.js avec TypeScript et Tailwind CSS. C'est comme si Duolingo proposait de lire Proust apres avoir appris "Bonjour".
- **Le dialogue simule** entre Claude Code et l'utilisateur est textuel. Il n'y a pas de screenshot reel montrant l'interface du terminal avec les couleurs, les prompts, les confirmations.

### Elements manquants
- **Des screenshots ou GIFs** du terminal a chaque etape majeure (lancement de claude, envoi du prompt, generation du fichier, apercu du resultat dans le navigateur).
- **Le resultat final** : Montrer une capture d'ecran du site web genere. Le debutant veut voir le "avant/apres" -- c'est le pattern Canva par excellence.
- **Un lien "J'ai un probleme"** a chaque etape critique qui pointe vers une FAQ ou un troubleshooting dedie.

---

## 6. Section MCP (6 pages)

**Evaluation : MAUVAIS pour un debutant (3/10)**

### Points forts
- **L'analogie des "prises USB universelles"** est excellente et immediatement comprehensible.
- **Le diagramme de flux** (Vous -> Claude Code -> MCP Server -> Service externe) sur la page d'index MCP est visuellement clair.
- **Le tableau comparatif MCP/Skills/Plugins** est bien structure avec les analogies (prise USB, recette, application).
- **Les cas d'usage en langage naturel** ("Montre-moi les issues GitHub ouvertes") montrent bien que l'interaction reste en francais.

### Points faibles
- **La section entiere est inutile pour le persona debutant.** La page "Comprendre les MCP en 5 minutes" parle de JSON-RPC 2.0, stdin/stdout, architecture client-serveur. Un non-developpeur ne sait pas ce que signifient ces termes.
- **L'installation des MCP** exige de manipuler des fichiers JSON (`settings.json`, `.mcp.json`), d'obtenir des tokens d'acces (GitHub Personal Access Token, Slack Bot Token, OAuth Google), et de comprendre des concepts comme `npx`, `uvx`, `Docker`, `env`, `scope`. Chacun de ces concepts est un mur pour un debutant.
- **La page Gmail** mentionne "Configuration OAuth via Google Cloud Console. Creez un projet, activez l'API Gmail, et generez des identifiants OAuth 2.0." Un debutant n'a aucune idee de ce qu'est la Google Cloud Console, un projet GCP, une API, ou OAuth 2.0. C'est comme dire "Pilotez un avion, puis prenez un virage a droite".
- **Aucun MCP n'est reellement accessible a un debutant** malgre l'etiquette "Debutant" sur certains (Lighthouse, Slack, Filesystem). L'installation reste hautement technique.
- **La page "Premier workflow MCP"** combine Context7 + GitHub + Playwright. Meme un developpeur junior aurait besoin de temps pour configurer ces trois outils. Pour un non-developpeur, c'est inaccessible.

### Elements manquants
- **Un "MCP pour debutants"** : Un MCP zero-config qui ne necessite aucun token, aucun JSON, aucune manipulation technique. Quelque chose comme un MCP Wikipedia ou un MCP meteo qui fonctionne sans authentification.
- **Un parcours MCP guide** : "Installez votre premier MCP en 3 clics" avec un assistant interactif, pas un fichier JSON a editer.
- **Des captures d'ecran** de chaque etape du processus d'installation et d'utilisation.
- **Une page "Est-ce que j'ai besoin des MCP ?"** : Rassurer le debutant en disant que NON, il n'a pas besoin des MCP pour commencer. Claude Code est deja puissant sans MCP. Les MCP sont une etape avancee.

---

## 7. Section Skills (4 pages)

**Evaluation : MAUVAIS pour un debutant (3.5/10)**

### Points forts
- **L'analogie des "recettes de cuisine"** est parfaite et immediatement comprehensible par tous.
- **La distinction Skill vs CLAUDE.md** est bien expliquee avec le tableau comparatif.
- **L'exemple "Avant/Apres"** (sans Skill = longue explication vs avec Skill = `/project:review-pr`) montre clairement la valeur ajoutee.
- **La structure du fichier Skill** (titre, contexte, etapes, format de sortie, arguments) est bien decomposee.

### Points faibles
- **Tout le contenu est oriente developpeur.** Les exemples de Skills sont : review de PR, TDD Guide, Code Reviewer, E2E Testing, Security Review, Debugging, API Pattern, Deploy Checklist. Il n'y a pas UN SEUL exemple de Skill pour un non-developpeur.
- **"Fichier Markdown dans `.claude/commands/`"** : Le debutant ne sait pas ce qu'est Markdown, ni ce que signifie `.claude/commands/`. Les dossiers caches (commencant par un point) sont un concept de systeme de fichiers Unix que la plupart des non-developpeurs ne connaissent pas.
- **Les slash commands** (`/project:review-pr`, `/user:tdd-guide`) presupposent une familiarite avec les interfaces en ligne de commande.
- **La page "Creer un Skill custom"** est entierement technique : elle parle de TypeScript strict, Vitest, Testing Library, barrel files, exports nommes.
- **La page de comparaison Skills vs MCP vs Plugins** est utile mais reste dans un vocabulaire technique : JSON-RPC, serveur externe, processus separe, manifeste `plugin.json`.

### Elements manquants
- **Des Skills pour non-developpeurs** : Un Skill "Generer un email professionnel", "Creer un planning de la semaine", "Resumer un document PDF", "Preparer une presentation". Des cas d'usage du quotidien, pas du developpement.
- **Un tutoriel "Creer un Skill en 2 minutes"** pour debutant, avec un exemple simple comme "un Skill qui genere des posts LinkedIn a partir d'un sujet".
- **Une galerie visuelle de Skills** avec des categories (Productivite, Communication, Analyse, Creation) au lieu d'une liste orientee code.

---

## 8. Section Plugins (5 pages)

**Evaluation : MAUVAIS pour un debutant (3/10)**

### Points forts
- **L'analogie des "applications smartphone"** est excellente : tout le monde comprend le concept d'installer une app.
- **Le marketplace** est un concept familier (App Store, Google Play) qui rassure.
- **Le comparatif Plugin vs MCP vs Skill** est synthetique et bien structure.
- **Les nombres d'installations** (57K, 71K, etc.) donnent un signal de popularite et de confiance.

### Points faibles
- **Tous les plugins presentes sont des outils de developpement** : Code Review, TDD Guide, Frontend Design, Security Guidance, AgentShield. Il n'y a pas un seul plugin pour un usage non-technique.
- **L'installation** (`/plugin install everything-claude-code`) presuppose que le debutant a Claude Code ouvert dans un terminal et sait taper des commandes.
- **La creation de plugin custom** parle de `plugin.json`, de manifestes, d'agents en Markdown, de templates en `.tsx`. C'est exclusivement pour les developpeurs.
- **Les configurations JSON** dans `settings.json` avec des options comme `"autoSuggest": true`, `"defaultAgent": "senior-dev"` sont opaques pour un non-developpeur.
- **"Everything Claude Code"** est decrit comme "le plugin le plus populaire" mais ses fonctionnalites (agents `senior-dev`, `architect`, `reviewer`, `debugger`) sont toutes orientees developpement.

### Elements manquants
- **Des plugins accessibles** : Un plugin "Assistant d'ecriture", "Organisateur de fichiers", "Resumeur de documents", "Gestionnaire de taches". Des plugins qui repondent a des besoins universels.
- **Un "Plugin Starter Pack" par profil** : "Vous etes entrepreneur ? Installez ces 3 plugins. Vous etes etudiant ? Installez ceux-ci."
- **Des captures d'ecran du marketplace** pour que le debutant sache a quoi s'attendre.

---

## 9. Section Prompting (1 page)

**Evaluation : MOYEN (5.5/10)**

### Points forts
- **Les 5 principes** (specificite, role, format, exemples, iteration) sont clairs et universels.
- **L'exemple "Vague vs Specifique"** avec le formulaire est concret et comprehensible.
- **La regle d'or** ("Imaginez que vous deleguez une tache a un collegue brillant mais qui ne connait rien a votre projet") est une excellente analogie.
- **Le tableau des erreurs courantes** est utile et bien structure.

### Points faibles
- **La page est trop courte et trop technique.** Les exemples sont tous lies au code (formulaire React, TypeScript, Zod, Tailwind, react-hook-form). Aucun exemple de prompting pour un usage non-technique.
- **Les accents sont absents** dans cette page (les mots comme "specifique", "reponse", "metier" n'ont pas d'accents), ce qui est inconsistant avec les autres pages et donne un aspect brouillon.
- **Le CLAUDE.md comme "arme secrete"** : Bon concept, mais l'exemple donne est entierement technique (Next.js 14, TypeScript, Prisma). Un debutant n'a pas de "Stack : Next.js 14, TypeScript, Tailwind CSS, Prisma" a ecrire.
- **Les techniques avancees** (Prompt chaining, Orchestration multi-agents) sont survolees en 2 lignes chacune. Soit on les developpe, soit on les retire.

### Elements manquants
- **Des exemples de prompts pour non-developpeurs** : "Redige un email de relance pour un client en retard de paiement", "Cree un tableur de suivi budgetaire", "Resume ce rapport de 50 pages en 5 points cles", "Prepare les questions pour un entretien d'embauche".
- **Un "prompt builder" interactif** : A la maniere de Zapier qui guide pas a pas la construction d'une automatisation, un outil qui aide a structurer son prompt.
- **Des templates de prompts** par categorie (communication, analyse, creation, organisation) que le debutant peut copier-coller et adapter.
- **Plus de contenu** : Cette page devrait etre la plus riche du site pour un debutant. Le prompting est la competence fondamentale -- c'est la seule chose qu'un non-developpeur a besoin de maitriser.

---

## 10. Section Future/Vision (1 page)

**Evaluation : MOYEN (5/10)**

### Points forts
- **Le message d'urgence** ("suis-je pret a utiliser l'IA quand elle deviendra indispensable ?") est motivant.
- **Les 4 conseils** pour se preparer sont concrets et applicables.
- **La roadmap** donne une vision de l'evolution du site.

### Points faibles
- **Les accents sont absents** (meme probleme que la page Prompting).
- **Le contenu est generique** : On pourrait trouver le meme texte sur n'importe quel blog IA. Rien de specifique a Claude Code ou au site.
- **Les tendances** (agents autonomes, MCP, multimodalite) sont evoquees sans etre expliquees. Le debutant ne sait pas ce qu'est un "agent autonome" ou l'"IA multimodale".
- **La page ne mentionne pas les limites** de l'IA. Un debutant a besoin de comprendre ce que Claude Code ne peut PAS faire, pour eviter les deceptions.

### Elements manquants
- **Des histoires d'utilisateurs** detaillees : Comment des non-developpeurs ont concretement transforme leur quotidien avec Claude Code.
- **Une FAQ** "L'IA va-t-elle remplacer mon metier ?", "Est-ce que c'est difficile a apprendre ?", "Combien de temps faut-il pour etre a l'aise ?".

---

## 11. Navigation et architecture d'information

**Evaluation : MOYEN (5/10)**

### Points forts
- **La sidebar de navigation** dans les sections de contenu est sticky et bien structuree.
- **Les breadcrumbs** aident a se situer dans la hierarchie.
- **Le footer** avec les liens Guides et Ressources est standard et fonctionnel.
- **Le dark mode** fonctionne bien.
- **La recherche** (SearchDialog) est disponible.

### Points faibles
- **Le menu principal** contient "Contenus" (qui pointe vers `/content`) mais cette section n'est pas mentionnee dans la structure du site. C'est confus.
- **Les Plugins ne sont pas dans le menu principal.** Un debutant qui arrive sur le site ne sait meme pas que la section existe. Il faut trouver un lien dans le contenu d'une autre page pour y acceder.
- **Le parcours de navigation est lineaire mais sans indicateur de progression.** Notion et Duolingo montrent ou vous en etes dans le parcours (etape 2 sur 4, 50% complete). The Claude Codex ne le fait pas.
- **Pas de distinction visuelle entre contenu debutant et avance.** Toutes les pages se ressemblent. Un debutant ne sait pas quelles pages il devrait lire en premier et lesquelles il devrait ignorer.

### Elements manquants
- **Un indicateur de progression** dans le parcours Getting Started (barre de progression, etapes numerotees avec checkmarks).
- **Des badges de niveau** sur chaque page (Debutant, Intermediaire, Avance) visibles dans la navigation.
- **Un "parcours debutant" dedie** qui filtre automatiquement le contenu et ne montre que les pages pertinentes.

---

## 12. Elements transversaux

### Qualite editoriale
- **Ton** : Accessible et chaleureux dans l'ensemble. Le tutoiement/vouvoiement est coherent (vouvoiement). Bon equilibre.
- **Analogies** : Les analogies (prises USB, recettes, applications) sont le point fort du site. Elles rendent les concepts abstraits tangibles. C'est un excellent reflexe editorial.
- **Inconsistance d'accents** : Les pages `prompting-guide.mdx` et `future-vision.mdx` n'ont pas d'accents sur les mots francais, alors que les autres pages en ont. C'est un probleme de qualite editoriale.

### Accessibilite technique (WCAG)
- **Bonne** : aria-labels sur les boutons, aria-hidden sur les icones decoratives, aria-expanded sur le menu mobile, focus visible. L'accessibilite technique est bien geree.

### Performance UX
- **Pas de screenshots dans TOUT le site.** C'est le defaut UX le plus important pour un debutant. Le site est 100% textuel avec des blocs de code. Aucune image, aucun GIF, aucune video ne montre Claude Code en action. C'est comme un manuel de conduite sans aucune photo de voiture.

---

## Synthese des recommandations

### CRITIQUE (A faire immediatement)

| # | Recommandation | Impact | Effort |
|---|---|---|---|
| C1 | **Ajouter des captures d'ecran/GIFs a chaque etape du Getting Started.** Montrer le terminal ouvert, les commandes tapees, le resultat genere, le site dans le navigateur. Un debutant ne peut pas suivre un tutoriel sans reperes visuels. | Tres haut | Moyen |
| C2 | **Creer une page "Qu'est-ce qu'un terminal et comment l'ouvrir"** avec des captures d'ecran annotees pour macOS, Windows et Linux. C'est le prerequis absolu manquant. Le lien vers cette page devrait etre le premier element de la page d'installation. | Tres haut | Faible |
| C3 | **Ajouter une mention de prix claire et visible** sur la landing page et en debut de Getting Started. "Claude Code coute X pour debuter. Voici les options." Un tableau simple avec les 3 options (API ponctuelle, Pro, Max) et le cout mensuel. | Haut | Faible |
| C4 | **Creer un parcours "debutant complet" dedie** qui exclut les pages de configuration avancee (settings.json, CLAUDE.md hierarchique, MCP, Skills, Plugins) et ne montre que : Qu'est-ce que c'est -> Installation guidee -> Premier projet. | Tres haut | Moyen |
| C5 | **Corriger les accents manquants** dans les pages prompting-guide.mdx et future-vision.mdx. L'inconsistance donne un aspect non professionnel. | Moyen | Faible |

### IMPORTANT (A planifier dans les 4 semaines)

| # | Recommandation | Impact | Effort |
|---|---|---|---|
| I1 | **Ajouter des exemples de prompts pour non-developpeurs** dans la page Prompting : emails, rapports, tableaux, presentations, resumes. Le prompting est LA competence universelle. | Haut | Faible |
| I2 | **Proposer une alternative "essayer sans installer"** : un lien vers un environnement en ligne (Replit, GitHub Codespaces, ou un sandbox heberge) ou le debutant peut tester Claude Code sans rien installer. | Tres haut | Eleve |
| I3 | **Ajouter des badges de niveau (Debutant/Intermediaire/Avance)** visibles sur chaque page, dans la sidebar et dans le header des articles. Le debutant doit pouvoir identifier immediatement si une page est pour lui. | Haut | Faible |
| I4 | **Restructurer la page d'installation** pour le debutant : commencer par la methode la plus simple (abonnement Max + `claude` dans le terminal), releguer la cle API et la configuration manuelle dans un onglet "Avance". Utiliser des `<Tabs>` pour separer Debutant/Avance. | Haut | Moyen |
| I5 | **Enrichir la page Prompting** : elle devrait etre 3x plus longue, avec des templates par categorie, des exemples before/after, et un guide de prompting specifique a Claude Code (pas juste du prompting generique). | Haut | Moyen |
| I6 | **Ajouter une video d'introduction** de 2-3 minutes sur la landing page qui montre Claude Code en action, de l'installation au premier resultat. Comparable a ce que fait Canva avec sa video hero. | Haut | Moyen |
| I7 | **Ajouter la section Plugins dans le menu de navigation principal.** Elle est invisible actuellement. | Moyen | Tres faible |
| I8 | **Reduire la page "Configuration de l'environnement"** pour les debutants en ajoutant un callout en haut : "Si vous debutez, passez directement au [Premier projet](/getting-started/first-project). Cette page est optionnelle pour commencer." | Moyen | Tres faible |

### NICE-TO-HAVE (A considerer pour les mois suivants)

| # | Recommandation | Impact | Effort |
|---|---|---|---|
| N1 | **Creer un quiz interactif** "Quel est votre profil ?" sur la landing page qui oriente le visiteur vers le bon point de depart. Comparable a l'onboarding de Notion. | Moyen | Moyen |
| N2 | **Ajouter un glossaire interactif** : les termes techniques (terminal, CLI, API, Node.js, npm, JSON, Git) affichent une definition au survol ou dans un panel lateral. | Moyen | Moyen |
| N3 | **Creer des "Success Stories" detaillees** : 3-4 etudes de cas de non-developpeurs qui utilisent Claude Code, avec le probleme, le parcours d'apprentissage, et le resultat. | Moyen | Moyen |
| N4 | **Implementer le configurateur interactif** promis sur la landing page. C'est l'outil le plus attendu par le persona debutant. | Haut | Eleve |
| N5 | **Ajouter un indicateur de progression** dans le parcours Getting Started (style Duolingo : etape 1/4, barre de progression). | Faible | Faible |
| N6 | **Creer une section "Cas d'usage sans code"** dediee aux non-developpeurs avec des tutoriels pas-a-pas illustres : creer un site, generer des documents, automatiser des emails, analyser des donnees. | Haut | Eleve |
| N7 | **Traduire les commandes shell** en instructions humaines. Au lieu de `mkdir ~/mon-premier-site && cd ~/mon-premier-site`, ecrire : "1. Ouvrez le terminal 2. Tapez ceci pour creer un nouveau dossier : `mkdir ~/mon-premier-site` 3. Tapez ceci pour entrer dans ce dossier : `cd ~/mon-premier-site`". Chaque commande doit avoir son explication AVANT, pas apres. | Moyen | Faible |

---

## Comparaison avec les references du marche

### Ce que Canva fait bien (et que The Claude Codex pourrait adopter)
- **"Try it yourself" sans inscription** : Canva laisse l'utilisateur creer avant de s'inscrire. Claude Code pourrait proposer un sandbox en ligne.
- **Resultats visuels immediats** : Canva montre des templates avant toute action. Claude Code ne montre AUCUN resultat visuel.
- **Onboarding progressif** : Canva ne montre jamais les fonctionnalites avancees tant que le debutant n'a pas maitrise les bases.

### Ce que Notion fait bien
- **Parcours guides par cas d'usage** : "Pour les equipes", "Pour l'ecole", "Pour un usage personnel". Chaque parcours adapte le contenu.
- **Templates par profil** : Au lieu d'un espace vide, le debutant commence avec un template pre-rempli.
- **Indicateurs de progression** : L'utilisateur sait ou il en est dans son apprentissage.

### Ce que Zapier fait bien
- **Captures d'ecran a chaque etape** : Chaque integration est documentee avec des images annotees.
- **Langage non-technique** : Zapier parle de "connecter vos apps" et "automatiser vos taches", pas de "configurer un webhook JSON-RPC via stdin/stdout".
- **Essai gratuit sans configuration** : Zapier fonctionne dans le navigateur, rien a installer.

---

## Conclusion

The Claude Codex est un site de grande qualite editoriale avec des analogies brillantes et une volonte sincere d'etre accessible. Cependant, il souffre d'un defaut structurel : **il dit s'adresser a tout le monde, mais son contenu est ecrit pour des developpeurs**. La landing page fait une promesse d'accessibilite que les pages suivantes ne tiennent pas.

Les trois axes prioritaires pour ameliorer l'experience du debutant sont :
1. **Montrer** (screenshots, GIFs, video) au lieu de seulement decrire
2. **Separer** les parcours debutant et avance au lieu de tout melanger
3. **Enrichir** le contenu non-technique (prompts, cas d'usage, exemples du quotidien)

Le potentiel est la. Le socle editorial est solide. Il manque principalement de la **representation visuelle** et un **filtrage par niveau** pour que la promesse de la landing page devienne realite.
