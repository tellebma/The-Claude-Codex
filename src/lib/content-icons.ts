import {
  Shield,
  DollarSign,
  AlertCircle,
  Palette,
  GitBranch,
  Sparkles,
  BookOpen,
  FileText,
  type LucideIcon,
} from "lucide-react";

/** Couleurs de card supportées par `<SectionCardGrid>`. */
export type ContentColor = "brand" | "accent" | "emerald";

interface ContentRule {
  readonly match: (slug: string) => boolean;
  readonly icon: LucideIcon;
  readonly color: ContentColor;
}

const GUIDE_SLUGS: ReadonlyArray<string> = [
  "getting-started-intro",
  "mcp-guide",
  "prompting-guide",
  "skills-guide",
];

/**
 * Règles ordonnées slug → icône + couleur (POL-3).
 *
 * L'ordre compte : `ci-cd-cyber-securite` doit matcher la règle CI/CD avant la
 * règle sécurité (qui détecte la sous-chaîne "securite"). Mapping issu de
 * l'EPIC POL, légèrement élargi pour couvrir les variantes de slugs FR/EN
 * existantes (coûts en tokens, mythes/myths).
 */
const CONTENT_RULES: ReadonlyArray<ContentRule> = [
  { match: (s) => s.includes("ci-cd"), icon: GitBranch, color: "emerald" },
  { match: (s) => s.includes("vs-figma"), icon: Palette, color: "brand" },
  {
    match: (s) =>
      s.startsWith("fuite-cle") ||
      s.startsWith("leaked-api-key") ||
      s.startsWith("ne-pas-donner") ||
      s.includes("securite"),
    icon: Shield,
    color: "brand",
  },
  {
    match: (s) =>
      s.includes("cout") || s.includes("cost") || s.includes("real-costs"),
    icon: DollarSign,
    color: "accent",
  },
  {
    match: (s) => s.includes("mythe") || s.includes("myth"),
    icon: AlertCircle,
    color: "accent",
  },
  {
    match: (s) =>
      s.includes("future") || s.startsWith("trends") || s.includes("vision"),
    icon: Sparkles,
    color: "brand",
  },
  {
    match: (s) => GUIDE_SLUGS.includes(s),
    icon: BookOpen,
    color: "brand",
  },
];

const DEFAULT_RULE: ContentRule = {
  match: () => true,
  icon: FileText,
  color: "accent",
};

function resolveContentRule(slug: string): ContentRule {
  const normalized = slug.toLowerCase();
  return CONTENT_RULES.find((rule) => rule.match(normalized)) ?? DEFAULT_RULE;
}

/** Retourne l'icône Lucide associée à un slug d'article éditorial. */
export function resolveContentIcon(slug: string): LucideIcon {
  return resolveContentRule(slug).icon;
}

/** Retourne la couleur de card associée à un slug d'article éditorial. */
export function resolveContentColor(slug: string): ContentColor {
  return resolveContentRule(slug).color;
}
