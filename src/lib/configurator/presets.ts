import type {
  Preset,
  ProfileInfo,
  SubscriptionInfo,
  FeatureInfo,
} from "./types";

/** Les 10 presets pré-configurés */
export const PRESETS: ReadonlyArray<Preset> = [
  {
    id: "frontend-react",
    name: "Frontend React",
    description:
      "Pour les développeurs React/Next.js avec TypeScript, Tailwind et tests.",
    profile: "web-frontend",
    stacks: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    subscription: "pro",
    features: ["mcp", "skills"],
    icon: "React",
  },
  {
    id: "frontend-vue",
    name: "Frontend Vue",
    description:
      "Pour les développeurs Vue.js/Nuxt avec TypeScript et Pinia.",
    profile: "web-frontend",
    stacks: ["Vue.js", "Nuxt", "TypeScript", "Pinia"],
    subscription: "pro",
    features: ["mcp", "skills"],
    icon: "Vue",
  },
  {
    id: "backend-node",
    name: "Backend Node.js",
    description:
      "Pour les développeurs backend Node.js avec Express, PostgreSQL et Docker.",
    profile: "web-backend",
    stacks: ["Node.js", "Express", "PostgreSQL", "Docker", "TypeScript"],
    subscription: "pro",
    features: ["mcp", "hooks", "skills"],
    icon: "Node",
  },
  {
    id: "backend-python",
    name: "Backend Python",
    description:
      "Pour les développeurs Python avec FastAPI, SQLAlchemy et Docker.",
    profile: "web-backend",
    stacks: ["Python", "FastAPI", "SQLAlchemy", "Docker", "PostgreSQL"],
    subscription: "pro",
    features: ["mcp", "hooks", "skills"],
    icon: "Python",
  },
  {
    id: "mobile-rn",
    name: "Mobile React Native",
    description:
      "Pour les développeurs mobile avec React Native, Expo et TypeScript.",
    profile: "mobile",
    stacks: ["React Native", "Expo", "TypeScript", "React Navigation"],
    subscription: "pro",
    features: ["mcp", "skills"],
    icon: "Mobile",
  },
  {
    id: "fullstack",
    name: "Full-Stack",
    description:
      "Configuration complète pour un développeur full-stack polyvalent.",
    profile: "web-backend",
    stacks: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "Tailwind CSS",
    ],
    subscription: "max-100",
    features: ["agent-teams", "mcp", "hooks", "skills", "extended-thinking"],
    icon: "FullStack",
  },
  {
    id: "devops",
    name: "DevOps / CI-CD",
    description:
      "Pour les ingénieurs DevOps : Docker, Kubernetes, Terraform, CI/CD.",
    profile: "devops",
    stacks: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "AWS"],
    subscription: "max-100",
    features: ["mcp", "hooks", "skills", "extended-thinking"],
    icon: "DevOps",
  },
  {
    id: "designer",
    name: "Designer UI",
    description:
      "Pour les designers qui utilisent Claude Code pour prototyper et coder des interfaces.",
    profile: "designer",
    stacks: ["Figma", "Tailwind CSS", "React", "Framer Motion"],
    subscription: "pro",
    features: ["mcp", "skills"],
    icon: "Designer",
  },
  {
    id: "writer",
    name: "Rédacteur Tech",
    description:
      "Pour les rédacteurs techniques, blogueurs et créateurs de contenu.",
    profile: "writer",
    stacks: ["Markdown", "MDX", "Next.js", "Git"],
    subscription: "pro",
    features: ["mcp", "skills"],
    icon: "Writer",
  },
  {
    id: "beginner",
    name: "Débutant",
    description:
      "Configuration simple pour découvrir Claude Code sans complexité.",
    profile: "beginner",
    stacks: ["HTML", "CSS", "JavaScript"],
    subscription: "free",
    features: ["skills"],
    icon: "Beginner",
  },
];

/** Informations détaillées sur chaque profil */
export const PROFILES: ReadonlyArray<ProfileInfo> = [
  {
    id: "web-frontend",
    label: "Développeur Frontend",
    description: "React, Vue, Angular, Svelte et autres frameworks frontend.",
    icon: "Monitor",
    stacks: [
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt",
      "Angular",
      "Svelte",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Sass",
      "Framer Motion",
    ],
  },
  {
    id: "web-backend",
    label: "Développeur Backend",
    description: "Node.js, Python, Go, Java et autres langages serveur.",
    icon: "Server",
    stacks: [
      "Node.js",
      "Express",
      "NestJS",
      "Python",
      "FastAPI",
      "Django",
      "Go",
      "Java",
      "Spring Boot",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "GraphQL",
    ],
  },
  {
    id: "mobile",
    label: "Développeur Mobile",
    description: "React Native, Flutter, Swift, Kotlin pour le mobile.",
    icon: "Smartphone",
    stacks: [
      "React Native",
      "Expo",
      "Flutter",
      "Swift",
      "Kotlin",
      "TypeScript",
      "React Navigation",
      "Firebase",
    ],
  },
  {
    id: "devops",
    label: "DevOps / SRE",
    description: "Infrastructure, CI/CD, conteneurs et cloud.",
    icon: "Cloud",
    stacks: [
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "GitHub Actions",
      "GitLab CI",
      "AWS",
      "GCP",
      "Azure",
      "Linux",
      "Bash",
      "Python",
    ],
  },
  {
    id: "designer",
    label: "Designer UI/UX",
    description: "Figma, prototypage et intégration frontend.",
    icon: "Palette",
    stacks: [
      "Figma",
      "Tailwind CSS",
      "React",
      "HTML",
      "CSS",
      "Framer Motion",
      "Storybook",
      "SVG",
    ],
  },
  {
    id: "writer",
    label: "Rédacteur Tech",
    description: "Documentation, blogs techniques, contenus éditoriaux.",
    icon: "PenTool",
    stacks: [
      "Markdown",
      "MDX",
      "Next.js",
      "Docusaurus",
      "Git",
      "LaTeX",
      "Notion",
    ],
  },
  {
    id: "data",
    label: "Data / ML",
    description: "Data science, machine learning, analyse de données.",
    icon: "BarChart3",
    stacks: [
      "Python",
      "Jupyter",
      "Pandas",
      "NumPy",
      "TensorFlow",
      "PyTorch",
      "SQL",
      "R",
      "Scikit-learn",
      "Matplotlib",
    ],
  },
  {
    id: "beginner",
    label: "Débutant",
    description: "Vous découvrez la programmation et Claude Code.",
    icon: "GraduationCap",
    stacks: [
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Git",
      "VS Code",
    ],
  },
];

/** Informations détaillées sur chaque abonnement */
export const SUBSCRIPTIONS: ReadonlyArray<SubscriptionInfo> = [
  {
    id: "free",
    label: "Free",
    price: "Gratuit",
    description: "Inclus avec un compte claude.ai gratuit, usage limité.",
    features: [
      "Accès à Claude Code via compte claude.ai",
      "Usage limité (quelques requêtes/jour)",
      "Modèle Sonnet",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    price: "20 $/mois",
    description: "Pour un usage régulier avec plus de capacité.",
    features: [
      "Usage étendu de Claude Code",
      "Accès à Sonnet et Haiku",
      "Extended Thinking disponible",
      "MCP, Skills et Hooks",
    ],
  },
  {
    id: "max-100",
    label: "Max 5x",
    price: "100 $/mois",
    description: "Pour les professionnels avec Agent Teams et Opus.",
    features: [
      "5x plus d’usage que Pro",
      "Accès à Opus, Sonnet, Haiku",
      "Extended Thinking avancé",
      "Agent Teams (expérimental)",
      "Tous les MCP, Skills et Hooks",
    ],
  },
  {
    id: "max-200",
    label: "Max 20x",
    price: "200 $/mois",
    description: "Usage intensif sans limites pour les équipes.",
    features: [
      "20x plus d’usage que Pro",
      "Accès à tous les modèles",
      "Extended Thinking avancé",
      "Agent Teams multi-worktrees",
      "Usage intensif pour les équipes",
    ],
  },
  {
    id: "api",
    label: "API directe",
    price: "À l'usage",
    description: "Clé API Anthropic, vous payez selon votre consommation.",
    features: [
      "Contrôle total des coûts",
      "Tous les modèles disponibles",
      "Extended Thinking configurable",
      "Limites basées sur votre tier API",
      "Facturation à l’usage",
    ],
  },
];

/** Informations détaillées sur chaque feature */
export const FEATURES: ReadonlyArray<FeatureInfo> = [
  {
    id: "agent-teams",
    label: "Agent Teams (expérimental)",
    description:
      "Lancez plusieurs agents en parallèle sur des worktrees séparés. Feature en research preview.",
    requiresSubscription: "max-100",
  },
  {
    id: "mcp",
    label: "MCP (Model Context Protocol)",
    description:
      "Connectez Claude Code à vos outils : GitHub, Slack, bases de données, Figma, etc.",
  },
  {
    id: "hooks",
    label: "Hooks",
    description:
      "Exécutez des scripts automatiquement avant/après les actions de Claude Code.",
  },
  {
    id: "skills",
    label: "Skills (slash commands)",
    description:
      "Créez des commandes personnalisées pour automatiser vos workflows récurrents.",
  },
  {
    id: "extended-thinking",
    label: "Extended Thinking",
    description:
      "Activez la réflexion approfondie pour les tâches complexes nécessitant plus de raisonnement.",
    requiresSubscription: "pro",
  },
];
