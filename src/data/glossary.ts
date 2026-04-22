export interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
  readonly analogy: string;
  readonly link?: string;
}

/**
 * Glossaire de termes techniques pour The Claude Codex.
 * Chaque terme inclut une définition claire et une analogie concrète.
 */
export const glossaryTerms: ReadonlyArray<GlossaryTerm> = [
  {
    term: "Terminal",
    definition:
      "Interface en mode texte permettant de communiquer avec votre ordinateur en tapant des commandes. Aussi appelé console ou invite de commandes.",
    analogy:
      "C'est comme parler à votre ordinateur par écrit au lieu de cliquer : vous tapez une phrase, l'ordinateur exécute l'instruction et vous répond.",
    link: "/getting-started/prerequisites-zero",
  },
  {
    term: "CLI",
    definition:
      "Command-Line Interface. Désigne tout outil qui s'utilise via le terminal en tapant des commandes textuelles, par opposition aux interfaces graphiques.",
    analogy:
      "Le volant vs les pédales d'un simulateur de conduite avancé : plus de contrôle, mais il faut apprendre les commandes.",
  },
  {
    term: "npm",
    definition:
      "Node Package Manager. Gestionnaire de paquets inclus avec Node.js qui permet d'installer, mettre à jour et gérer des bibliothèques et outils JavaScript.",
    analogy:
      "L'App Store de votre Mac, mais pour développeurs et accessible via le terminal.",
    link: "/getting-started/prerequisites-zero",
  },
  {
    term: "Node.js",
    definition:
      "Environnement d'exécution JavaScript côté serveur. Permet d'exécuter du code JavaScript en dehors d'un navigateur web.",
    analogy:
      "Comme le lecteur PDF pour les fichiers PDF : c'est le moteur qui permet à votre ordinateur de comprendre et d'exécuter les programmes JavaScript comme Claude Code.",
    link: "/getting-started/installation",
  },
  {
    term: "API",
    definition:
      "Application Programming Interface. Ensemble de règles et de protocoles permettant à deux logiciels de communiquer entre eux de manière standardisée.",
    analogy:
      "Le menu d'un restaurant : il définit ce que vous pouvez commander et comment le demander. Vous ne pouvez pas entrer en cuisine demander n'importe quoi, vous passez par le menu.",
  },
  {
    term: "Clé API",
    definition:
      "Identifiant unique et secret associé à votre compte, permettant d'accéder à une API. Elle sert à la fois d'authentification et de suivi de l'utilisation.",
    analogy:
      "Un badge d'accès à un bâtiment sécurisé : sans ce badge, impossible d'entrer. Si quelqu'un vole votre badge, il peut entrer à votre place.",
    link: "/getting-started/prerequisites-zero",
  },
  {
    term: "JSON",
    definition:
      "JavaScript Object Notation. Format de texte structuré pour stocker et échanger des données, lisible par les humains et les machines.",
    analogy:
      "Un formulaire administratif avec des champs bien définis : chaque information est étiquetée et dans le bon format.",
  },
  {
    term: "Git",
    definition:
      "Système de contrôle de version distribué. Permet de suivre l'historique des modifications d'un projet, de collaborer à plusieurs et de revenir à des versions antérieures.",
    analogy:
      "L'historique Ctrl+Z de votre traitement de texte, mais pour des projets entiers, avec la possibilité de créer des branches parallèles et de fusionner du travail.",
  },
  {
    term: "GitHub",
    definition:
      "Plateforme en ligne pour héberger des dépôts Git. Permet la collaboration, le partage de code et la gestion de projets open source.",
    analogy:
      "Google Drive pour les développeurs : stocker son code dans le cloud, partager avec d'autres, et garder l'historique de toutes les modifications.",
  },
  {
    term: "MCP",
    definition:
      "Model Context Protocol. Standard ouvert permettant à Claude Code de se connecter à des outils externes comme GitHub, Gmail ou des bases de données.",
    analogy:
      "Les câbles et adaptateurs de votre ordinateur : chaque MCP est un connecteur qui permet à Claude Code de brancher et d'utiliser un outil différent.",
    link: "/mcp",
  },
  {
    term: "Skill",
    definition:
      "Fichier Markdown contenant des instructions spécialisées pour Claude Code, activable via une commande slash (ex: /commit, /review).",
    analogy:
      "Une fiche de recette rangée dans votre classeur : quand vous avez besoin de cette recette, vous l'ouvrez et vous suivez les instructions pas à pas.",
    link: "/skills",
  },
  {
    term: "Plugin",
    definition:
      "Extension installable qui ajoute de nouvelles fonctionnalités à Claude Code, distribuée via un marketplace.",
    analogy:
      "Les extensions de votre navigateur web : vous les installez en quelques clics et elles ajoutent de nouvelles capacités à votre outil.",
    link: "/plugins",
  },
  {
    term: "Extension",
    definition:
      "Terme générique désignant tout ajout logiciel qui étend les fonctionnalités d'une application. Peut désigner des plugins, des MCP ou des skills selon le contexte.",
    analogy:
      "Les accessoires que vous branchez sur votre smartphone : chacun ajoute une capacité que l'appareil de base n'avait pas.",
  },
  {
    term: "CLAUDE.md",
    definition:
      "Fichier Markdown placé à la racine d'un projet, lu automatiquement par Claude Code au démarrage. Contient les instructions, conventions et contexte du projet.",
    analogy:
      "Le livret d'accueil remis à un nouvel employé : il lui explique les règles de la maison, les outils utilisés, et les procédures à suivre.",
    link: "/prompting/claude-md",
  },
  {
    term: "settings.json",
    definition:
      "Fichier de configuration global de Claude Code (~/.claude/settings.json) définissant les permissions, les préférences et le comportement par défaut.",
    analogy:
      "Les préférences système de votre ordinateur : vous les configurez une fois, et elles s'appliquent partout.",
  },
  {
    term: "Prompt",
    definition:
      "Texte que vous envoyez à Claude Code pour lui donner une instruction, poser une question ou fournir du contexte. La qualité du prompt influence directement la qualité de la réponse.",
    analogy:
      "Une commande dans un restaurant : plus elle est précise (\"un steak saignant avec des frites et une sauce poivre\"), meilleur sera le résultat.",
    link: "/prompting/basics",
  },
  {
    term: "Token",
    definition:
      "Unité de texte traitée par le modèle d'IA. Approximativement 3-4 caractères ou 0,75 mot en français. La longueur des conversations est mesurée en tokens.",
    analogy:
      "Les syllabes d'un texte : votre lecture est facturée à la syllabe, pas au mot. Plus le texte est long, plus il y a de syllabes.",
  },
  {
    term: "Contexte",
    definition:
      "L'ensemble des informations disponibles à Claude Code lors d'une session : historique de conversation, fichiers ouverts, instructions du CLAUDE.md.",
    analogy:
      "La mémoire à court terme d'un collègue : il se souvient de ce que vous avez discuté aujourd'hui, mais pas des réunions du mois dernier.",
    link: "/prompting/context-management",
  },
  {
    term: "SSG",
    definition:
      "Static Site Generation. Technique de création de sites web où toutes les pages HTML sont générées à l'avance (au build), et non à la demande de chaque visiteur.",
    analogy:
      "Imprimer un livre en avance plutôt que de le rédiger en direct pour chaque lecteur : plus rapide à livrer, mais le contenu est figé jusqu'à la prochaine impression.",
  },
  {
    term: "SSR",
    definition:
      "Server-Side Rendering. Technique où le HTML est généré à la demande sur le serveur, pour chaque requête. Permet d'afficher du contenu dynamique et personnalisé.",
    analogy:
      "Un restaurant qui cuisine à la commande : chaque plat est préparé sur demande, ce qui prend un peu plus de temps mais permet de personnaliser.",
  },
  {
    term: "Docker",
    definition:
      "Outil de conteneurisation qui permet d'emballer une application avec toutes ses dépendances dans un \"conteneur\" portable et reproductible.",
    analogy:
      "Un conteneur de transport maritime : peu importe le cargo ou le pays, le contenu est le même et s'installe partout de la même façon.",
  },
  {
    term: "Nginx",
    definition:
      "Serveur web et reverse proxy très performant. Utilisé pour servir des fichiers statiques, rediriger le trafic et gérer les certificats HTTPS.",
    analogy:
      "Le standardiste d'une grande entreprise : il reçoit tous les appels entrants et les redirige vers la bonne personne selon la demande.",
  },
  {
    term: "TypeScript",
    definition:
      "Langage de programmation basé sur JavaScript qui ajoute un système de types statiques. Permet de détecter des erreurs avant même d'exécuter le code.",
    analogy:
      "Un traitement de texte avec correcteur grammatical : il vous signale les erreurs avant que vous n'envoyiez le document.",
  },
  {
    term: "MDX",
    definition:
      "Format de fichier combinant Markdown (texte formaté simple) et JSX (composants React). Permet d'intégrer des composants interactifs dans du contenu éditorial.",
    analogy:
      "Un article de magazine enrichi : vous écrivez du texte normal, mais vous pouvez y insérer des éléments interactifs comme des tableaux dynamiques ou des boutons.",
  },
  {
    term: "Frontmatter",
    definition:
      "Section de métadonnées au début d'un fichier Markdown ou MDX, délimitée par `---`. Contient des informations structurées comme le titre, la description, la date.",
    analogy:
      "La couverture d'un livre : titre, auteur, date, résumé. Toutes les infos clés avant même d'ouvrir le livre.",
  },
  {
    term: "Markdown",
    definition:
      "Langage de balisage léger permettant de formater du texte avec une syntaxe simple (# pour les titres, **gras**, *italique*, etc.).",
    analogy:
      "La sténographie pour la mise en page : quelques symboles simples suffisent pour indiquer ce qui est important, sans avoir à utiliser des boutons de mise en forme.",
  },
  {
    term: "Tailwind",
    definition:
      "Framework CSS \"utility-first\" permettant de styliser des pages web en appliquant des classes CSS directement dans le HTML, sans écrire de CSS séparé.",
    analogy:
      "Un kit de vêtements modulaires : au lieu de coudre une tenue sur mesure, vous assemblez des pièces prêtes-à-porter pour créer votre style.",
  },
  {
    term: "React",
    definition:
      "Bibliothèque JavaScript pour construire des interfaces utilisateur. Permet de créer des composants réutilisables qui se mettent à jour automatiquement.",
    analogy:
      "Des blocs LEGO pour construire des interfaces web : chaque composant est une pièce indépendante qu'on assemble pour créer des pages complexes.",
  },
  {
    term: "Next.js",
    definition:
      "Framework React pour créer des applications web complètes. Ajoute le routing, le rendu côté serveur, l'optimisation des images et bien d'autres fonctionnalités.",
    analogy:
      "Un appartement meublé vs des murs vides : React vous donne les briques de base, Next.js vous donne un espace déjà organisé avec électricité, plomberie et meubles.",
  },
  {
    term: "Composant",
    definition:
      "Bloc de code réutilisable qui encapsule une partie d'interface utilisateur avec son comportement. Peut être utilisé plusieurs fois dans une application.",
    analogy:
      "Un tampon encreur : vous le créez une fois, et vous pouvez l'appliquer autant de fois que vous voulez à différents endroits.",
  },
  {
    term: "Hook",
    definition:
      "Fonction React permettant d'utiliser des fonctionnalités comme l'état ou les effets dans des composants fonctionnels (ex: useState, useEffect).",
    analogy:
      "Les boutons d'une télécommande : chaque bouton (hook) vous donne accès à une fonction spécifique de la télé sans avoir à ouvrir le boîtier.",
  },
  {
    term: "Variable d'environnement",
    definition:
      "Variable stockée dans le système d'exploitation (pas dans le code) pour configurer des applications. Utilisée pour les secrets comme les clés API.",
    analogy:
      "Le trousseau de clés dans votre poche : vous l'avez sur vous en permanence, vous n'avez pas besoin de l'écrire sur chaque porte pour que ça fonctionne.",
    link: "/getting-started/installation",
  },
  {
    term: "Dépôt (repo)",
    definition:
      "Dossier de projet versionné avec Git, contenant le code source, l'historique des modifications et les métadonnées du projet.",
    analogy:
      "Un classeur avec toutes les versions d'un document et le journal de toutes les modifications, mais pour un projet entier.",
  },
  {
    term: "Branche",
    definition:
      "Version parallèle d'un dépôt Git permettant de développer une fonctionnalité ou un correctif sans modifier le code principal.",
    analogy:
      "Une photocopie de travail : vous faites vos modifications sur la copie, et si ça marche, vous remplacez l'original. Sinon, vous jetez la copie.",
  },
  {
    term: "Commit",
    definition:
      "Instantané des modifications apportées au code à un moment donné, avec un message descriptif. Forme la base de l'historique Git.",
    analogy:
      "Une sauvegarde de jeu vidéo manuelle : vous faites une sauvegarde à un point précis de l'aventure, avec une note pour vous souvenir où vous en étiez.",
  },
  {
    term: "Pull Request",
    definition:
      "Demande de fusion d'une branche de code vers la branche principale, permettant la revue de code par d'autres développeurs avant l'intégration.",
    analogy:
      "Soumettre un article à un comité de relecture avant publication : vos collègues vérifient votre travail, font des commentaires, et approuvent (ou non) la publication.",
  },
  {
    term: "Build",
    definition:
      "Processus de compilation et de transformation du code source en fichiers prêts à être déployés ou exécutés en production.",
    analogy:
      "Cuire un gâteau : vous avez les ingrédients bruts (code source), le four (compilateur) les transforme en quelque chose de prêt à servir (application).",
  },
  {
    term: "Deploy",
    definition:
      "Processus de mise en ligne d'une application sur un serveur accessible aux utilisateurs. Le déploiement rend les changements visibles au public.",
    analogy:
      "Ouvrir les portes d'un magasin après les travaux de rénovation : tout était prêt en coulisses, et maintenant les clients peuvent entrer.",
  },
  {
    term: "Lint",
    definition:
      "Analyse statique du code pour détecter des erreurs potentielles, des mauvaises pratiques ou des violations de style, sans exécuter le code.",
    analogy:
      "La correction automatique d'un traitement de texte, mais pour le code : il souligne les \"fautes de grammaire\" de programmation avant que vous n'envoyiez votre travail.",
  },
  {
    term: "Agent",
    definition:
      "Instance de Claude Code avec des instructions spécialisées, capable d'effectuer des tâches complexes de manière plus ou moins autonome.",
    analogy:
      "Un consultant spécialisé : il a son domaine d'expertise bien défini et peut travailler de manière indépendante sur des missions précises.",
    link: "/agents",
  },
  {
    term: "Context Window",
    definition:
      "Quantité maximale de texte qu'un modèle d'IA peut traiter en une seule fois. Pour Claude, cette fenêtre est d'environ 200 000 tokens.",
    analogy:
      "La taille de la table de travail d'un collaborateur : plus elle est grande, plus il peut consulter de documents simultanément. Quand la table est pleine, il faut ranger avant d'ajouter.",
    link: "/prompting/context-management",
  },
  {
    term: "Anthropic",
    definition:
      "Entreprise américaine d'intelligence artificielle fondée en 2021, créatrice de Claude et Claude Code. Focalisée sur la recherche en sécurité de l'IA.",
    analogy:
      "Apple pour les iPhones : Anthropic est la société qui fabrique et maintient Claude, comme Apple fabrique et maintient iOS.",
  },
  {
    term: "LLM",
    definition:
      "Large Language Model (Grand Modèle de Langage). Modèle d'IA entraîné sur d'énormes corpus de texte pour comprendre et générer du langage naturel.",
    analogy:
      "Un étudiant qui a lu toutes les bibliothèques du monde et qui peut maintenant répondre à des questions et écrire dans n'importe quel style.",
  },
  {
    term: "Subagent",
    definition:
      "Agent Claude Code lancé par un autre agent (l'orchestrateur) pour effectuer une sous-tâche spécifique dans un workflow multi-agents.",
    analogy:
      "Les sous-traitants d'un chantier : le chef de chantier (orchestrateur) délègue des tâches précises à des artisans spécialisés (subagents).",
    link: "/agents/what-are-agents",
  },
];

/**
 * Recherche dans le glossaire par terme ou définition.
 */
export function searchGlossary(query: string): ReadonlyArray<GlossaryTerm> {
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[̀-ͯ]/g, "")
    .trim();

  if (normalizedQuery.length === 0) {
    return glossaryTerms;
  }

  return glossaryTerms.filter((entry) => {
    const termNorm = entry.term
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[̀-ͯ]/g, "");
    const defNorm = entry.definition
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[̀-ͯ]/g, "");
    const analogyNorm = entry.analogy
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[̀-ͯ]/g, "");

    return (
      termNorm.includes(normalizedQuery) ||
      defNorm.includes(normalizedQuery) ||
      analogyNorm.includes(normalizedQuery)
    );
  });
}
