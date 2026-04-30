/**
 * Registre des themes thematiques pour les articles MDX (RG-31).
 *
 * Deux dimensions :
 * - **Type de contenu** (1 obligatoire si `themes` est present) : decrit la
 *   forme editoriale (tutoriel, guide, reference, comparatif, cas d'usage).
 * - **Domaine** (0 a 2 optionnels) : indique le ou les sujets metier abordes.
 *
 * Au total, un article a 1 a 3 badges. Les couleurs des domaines mappent les
 * tokens semantiques C1 (\`--color-error\`, \`--color-warning\`, etc.) sauf
 * \`devsecops\` qui utilise un token dedie \`--theme-devsecops\` declare dans
 * globals.css.
 */

import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  BookOpen,
  Book,
  Columns2,
  Lightbulb,
  Shield,
  ShieldCheck,
  Network,
  Gauge,
  Wrench,
  Zap,
  GitBranch,
} from "lucide-react";

export type ThemeKind = "type" | "domain";

export type ContentTypeKey =
  | "tutorial"
  | "guide"
  | "reference"
  | "comparison"
  | "use-case";

export type DomainKey =
  | "security"
  | "devsecops"
  | "architecture"
  | "performance"
  | "tooling"
  | "productivity"
  | "migration";

export type ThemeKey = ContentTypeKey | DomainKey;

export interface ThemeMeta {
  readonly kind: ThemeKind;
  /** Variable CSS qui resout sur la couleur du badge (token C1 ou theme-*). */
  readonly color: string;
  readonly icon: LucideIcon;
}

export const THEME_REGISTRY: Readonly<Record<ThemeKey, ThemeMeta>> = {
  // --- Type de contenu (couleur neutre via fg-secondary) ---
  tutorial: {
    kind: "type",
    color: "var(--fg-secondary)",
    icon: GraduationCap,
  },
  guide: {
    kind: "type",
    color: "var(--fg-secondary)",
    icon: BookOpen,
  },
  reference: {
    kind: "type",
    color: "var(--fg-secondary)",
    icon: Book,
  },
  comparison: {
    kind: "type",
    color: "var(--fg-secondary)",
    icon: Columns2,
  },
  "use-case": {
    kind: "type",
    color: "var(--fg-secondary)",
    icon: Lightbulb,
  },

  // --- Domaine (couleurs semantiques) ---
  security: {
    kind: "domain",
    color: "var(--color-error)",
    icon: Shield,
  },
  devsecops: {
    kind: "domain",
    color: "var(--theme-devsecops)",
    icon: ShieldCheck,
  },
  architecture: {
    kind: "domain",
    color: "var(--color-info)",
    icon: Network,
  },
  performance: {
    kind: "domain",
    color: "var(--color-warning)",
    icon: Gauge,
  },
  tooling: {
    kind: "domain",
    color: "var(--color-info)",
    icon: Wrench,
  },
  productivity: {
    kind: "domain",
    color: "var(--color-success)",
    icon: Zap,
  },
  migration: {
    kind: "domain",
    color: "var(--fg-muted)",
    icon: GitBranch,
  },
};

export const ALL_THEME_KEYS: ReadonlyArray<ThemeKey> = Object.keys(
  THEME_REGISTRY
) as ReadonlyArray<ThemeKey>;

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === "string" && value in THEME_REGISTRY;
}

export function getTheme(key: ThemeKey): ThemeMeta {
  return THEME_REGISTRY[key];
}

function themeError(slug: string, message: string): Error {
  return new Error(`MDX frontmatter error in "${slug}.mdx": ${message}`);
}

function assertThemeKeys(
  raw: ReadonlyArray<unknown>,
  slug: string
): ReadonlyArray<ThemeKey> {
  const keys: ThemeKey[] = [];
  for (const candidate of raw) {
    if (!isThemeKey(candidate)) {
      throw themeError(
        slug,
        `"themes" contains unknown key "${String(candidate)}". Valid keys: ${ALL_THEME_KEYS.join(", ")}.`
      );
    }
    keys.push(candidate);
  }
  return keys;
}

/**
 * Valide une liste de cles thematiques :
 * - 1 a 3 entrees,
 * - chaque cle existe dans THEME_REGISTRY,
 * - au moins une cle de type \`type\` (content type).
 *
 * Retourne la liste validee (typee) ou null si la liste est vide/absente.
 * Throw si la liste est invalide.
 */
export function validateThemes(
  raw: unknown,
  slug: string
): ReadonlyArray<ThemeKey> | null {
  if (raw === undefined || raw === null) {
    return null;
  }
  if (!Array.isArray(raw)) {
    throw themeError(slug, `"themes" must be an array of strings.`);
  }
  if (raw.length === 0) {
    return null;
  }
  if (raw.length > 3) {
    throw themeError(
      slug,
      `"themes" accepts at most 3 entries (got ${raw.length}).`
    );
  }
  const keys = assertThemeKeys(raw, slug);
  const hasContentType = keys.some((k) => THEME_REGISTRY[k].kind === "type");
  if (!hasContentType) {
    throw themeError(
      slug,
      `"themes" must contain at least one content type (tutorial, guide, reference, comparison, use-case).`
    );
  }
  return keys;
}
