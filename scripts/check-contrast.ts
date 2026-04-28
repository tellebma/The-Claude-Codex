/**
 * Vérifie les ratios de contraste WCAG AA des paires sémantiques (texte/surface)
 * définies dans `src/app/globals.css`.
 *
 * Stratégie :
 *   1. Parse le contenu de `:root { ... }` (light) et `.dark { ... }` (dark).
 *   2. Résout chaque variable de la liste `PAIRS` ci-dessous, supportant les
 *      références (--var: var(--autre)) et les notations hex/rgb/rgba.
 *   3. Si une couleur a un alpha < 1, elle est composée sur le fond du thème
 *      correspondant (blanc en light, #060912 en dark).
 *   4. Calcule la luminance relative + le ratio WCAG 2.1 et compare au seuil.
 *
 * Sortie :
 *   - Tableau lisible stdout : pair | light ratio | dark ratio | seuil | status
 *   - Résumé : `X paires OK / Y total`
 *   - Exit code 1 si au moins une paire KO (les paires skipées ne font pas échouer)
 *
 * Lancer via : `npm run check:contrast` ou `npx tsx scripts/check-contrast.ts`
 */

import fs from "node:fs";
import path from "node:path";

interface Pair {
  readonly fg: string;
  readonly bg: string;
  readonly min: number;
  readonly label: string;
}

const PAIRS: readonly Pair[] = [
  { fg: "--fg-primary", bg: "--bg-page", min: 4.5, label: "corps page" },
  { fg: "--fg-primary", bg: "--bg-elevated", min: 4.5, label: "corps surface élevée" },
  { fg: "--fg-secondary", bg: "--bg-page", min: 4.5, label: "texte secondaire page" },
  { fg: "--fg-muted", bg: "--bg-page", min: 3, label: "texte muted (large)" },
  { fg: "--fg-on-brand", bg: "--brand-primary", min: 4.5, label: "texte sur brand" },
  { fg: "--brand-700", bg: "--bg-page", min: 4.5, label: "lien brand sur page" },
];

type Theme = "light" | "dark";

const THEME_FALLBACK_BG: Record<Theme, RGB> = {
  light: { r: 255, g: 255, b: 255 },
  dark: { r: 6, g: 9, b: 18 },
};

interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

interface RGBA extends RGB {
  readonly a: number;
}

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CSS_PATH = path.join(ROOT_DIR, "src/app/globals.css");

/**
 * Extrait le contenu d'un bloc `selector { ... }` en cherchant un selecteur
 * suivi (apres optionnel espace ou commentaire) d'une accolade ouvrante.
 * Evite les faux positifs comme `@custom-variant dark (&:where(.dark, .dark *))`
 * qui contiennent litteralement le selecteur mais ne sont pas une regle CSS.
 */
function extractBlock(css: string, selector: string): string | null {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Le selecteur doit etre suivi (apres whitespace) d'une `{` qui ouvre la regle.
  const re = new RegExp(`(?:^|[\\s,;}])${escaped}\\s*\\{`, "g");
  const m = re.exec(css);
  if (!m) return null;
  const start = css.indexOf("{", m.index);
  if (start === -1) return null;
  let depth = 1;
  for (let i = start + 1; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start + 1, i);
    }
  }
  return null;
}

/** Parse les déclarations `--name: value;` d'un bloc CSS (ignore les blocs imbriqués). */
function parseVars(block: string): Map<string, string> {
  const out = new Map<string, string>();
  // Supprime les sous-blocs (ex: @media, @keyframes) pour éviter de capter leurs déclarations
  let depth = 0;
  let flat = "";
  for (const ch of block) {
    if (ch === "{") depth += 1;
    else if (ch === "}") depth -= 1;
    else if (depth === 0) flat += ch;
  }
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(flat)) !== null) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

/** Résout une valeur en suivant les `var(--ref, fallback)` jusqu'à une couleur literal. */
function resolveValue(name: string, vars: Map<string, string>, seen = new Set<string>()): string | null {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = vars.get(name);
  if (!raw) return null;
  const trimmed = raw.trim();
  const varMatch = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec(trimmed);
  if (varMatch) {
    const refName = varMatch[1];
    const fallback = varMatch[2];
    const resolved = resolveValue(refName, vars, seen);
    if (resolved) return resolved;
    return fallback ? fallback.trim() : null;
  }
  return trimmed;
}

function clamp(n: number, lo: number, hi: number): number {
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

function parseHex(value: string): RGBA | null {
  const m = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (!m) return null;
  const hex = m[1];
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  return null;
}

function parseRgbLike(value: string): RGBA | null {
  const m = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const toChan = (s: string): number => {
    if (s.endsWith("%")) return clamp((parseFloat(s) / 100) * 255, 0, 255);
    return clamp(parseFloat(s), 0, 255);
  };
  const r = toChan(parts[0]);
  const g = toChan(parts[1]);
  const b = toChan(parts[2]);
  let a = 1;
  if (parts.length >= 4) {
    const raw = parts[3];
    a = raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw);
    a = clamp(a, 0, 1);
  }
  return { r, g, b, a };
}

function parseColor(value: string): RGBA | null {
  const trimmed = value.trim();
  return parseHex(trimmed) ?? parseRgbLike(trimmed);
}

/** Compose une couleur (potentiellement semi-transparente) sur un fond opaque. */
function flatten(fg: RGBA, bg: RGB): RGB {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
  };
}

function relativeLuminance({ r, g, b }: RGB): number {
  const channel = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la >= lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

interface Resolved {
  readonly fg: RGB | null;
  readonly bg: RGB | null;
  readonly missing: readonly string[];
}

function resolvePair(pair: Pair, vars: Map<string, string>, theme: Theme): Resolved {
  const missing: string[] = [];
  const fgRaw = resolveValue(pair.fg, vars);
  const bgRaw = resolveValue(pair.bg, vars);
  if (!fgRaw) missing.push(pair.fg);
  if (!bgRaw) missing.push(pair.bg);

  const fgColor = fgRaw ? parseColor(fgRaw) : null;
  const bgColor = bgRaw ? parseColor(bgRaw) : null;

  const fallback = THEME_FALLBACK_BG[theme];
  const bgFlat: RGB | null = bgColor
    ? bgColor.a < 1
      ? flatten(bgColor, fallback)
      : { r: bgColor.r, g: bgColor.g, b: bgColor.b }
    : null;
  const compositeBg = bgFlat ?? fallback;
  const fgFlat: RGB | null = fgColor
    ? fgColor.a < 1
      ? flatten(fgColor, compositeBg)
      : { r: fgColor.r, g: fgColor.g, b: fgColor.b }
    : null;

  return { fg: fgFlat, bg: bgFlat, missing };
}

function formatRatio(n: number | null): string {
  if (n === null) return "  -  ";
  return `${n.toFixed(2)}:1`.padStart(7, " ");
}

function padEnd(s: string, width: number): string {
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}

interface Row {
  readonly label: string;
  readonly fgVar: string;
  readonly bgVar: string;
  readonly threshold: number;
  readonly lightRatio: number | null;
  readonly darkRatio: number | null;
  readonly status: "OK" | "KO" | "SKIP";
  readonly warns: readonly string[];
}

function evaluate(pair: Pair, lightVars: Map<string, string>, darkVars: Map<string, string>): Row {
  const lightR = resolvePair(pair, lightVars, "light");
  const darkR = resolvePair(pair, darkVars, "dark");

  const lightRatio = lightR.fg && lightR.bg ? contrastRatio(lightR.fg, lightR.bg) : null;
  const darkRatio = darkR.fg && darkR.bg ? contrastRatio(darkR.fg, darkR.bg) : null;

  const warns: string[] = [];
  const allMissing = new Set<string>([...lightR.missing, ...darkR.missing]);
  if (allMissing.size > 0) {
    warns.push(`variables manquantes : ${[...allMissing].join(", ")}`);
  }

  let status: "OK" | "KO" | "SKIP" = "SKIP";
  if (lightRatio !== null && darkRatio !== null) {
    status = lightRatio >= pair.min && darkRatio >= pair.min ? "OK" : "KO";
  } else if (lightRatio !== null || darkRatio !== null) {
    const single = lightRatio ?? darkRatio;
    status = single !== null && single >= pair.min ? "OK" : "KO";
  }

  return {
    label: pair.label,
    fgVar: pair.fg,
    bgVar: pair.bg,
    threshold: pair.min,
    lightRatio,
    darkRatio,
    status,
    warns,
  };
}

function printTable(rows: readonly Row[]): void {
  const headers = ["Paire", "fg", "bg", "Light", "Dark", "Seuil", "Statut"];
  const widths = [28, 18, 18, 9, 9, 6, 6];
  const sep = "-".repeat(widths.reduce((a, b) => a + b + 3, 1));
  console.log(sep);
  console.log(headers.map((h, i) => padEnd(h, widths[i])).join(" | "));
  console.log(sep);
  for (const row of rows) {
    const cols = [
      padEnd(row.label, widths[0]),
      padEnd(row.fgVar, widths[1]),
      padEnd(row.bgVar, widths[2]),
      padEnd(formatRatio(row.lightRatio), widths[3]),
      padEnd(formatRatio(row.darkRatio), widths[4]),
      padEnd(row.threshold.toFixed(1), widths[5]),
      padEnd(row.status, widths[6]),
    ];
    console.log(cols.join(" | "));
  }
  console.log(sep);
}

export function runContrastCheck(): number {
  if (!fs.existsSync(CSS_PATH)) {
    console.error(`Fichier introuvable : ${CSS_PATH}`);
    return 1;
  }
  const css = fs.readFileSync(CSS_PATH, "utf8");
  const rootBlock = extractBlock(css, ":root");
  const darkBlock = extractBlock(css, ".dark");

  if (!rootBlock) {
    console.error("Bloc :root introuvable dans globals.css");
    return 1;
  }
  if (!darkBlock) {
    console.warn("Avertissement : bloc .dark introuvable, contrôle limité au thème light.");
  }

  const lightVars = parseVars(rootBlock);
  const darkVars = darkBlock ? parseVars(darkBlock) : new Map<string, string>();
  // Les variables non redéfinies en dark héritent du :root (cascade CSS)
  for (const [k, v] of lightVars) {
    if (!darkVars.has(k)) darkVars.set(k, v);
  }

  const rows = PAIRS.map((p) => evaluate(p, lightVars, darkVars));

  printTable(rows);

  for (const row of rows) {
    if (row.warns.length > 0) {
      for (const w of row.warns) {
        console.warn(`WARN [${row.label}] : ${w}`);
      }
    }
  }

  const total = rows.length;
  const ok = rows.filter((r) => r.status === "OK").length;
  const ko = rows.filter((r) => r.status === "KO").length;
  const skipped = rows.filter((r) => r.status === "SKIP").length;

  console.log("");
  console.log(`Résumé : ${ok} paires OK / ${total} total (KO : ${ko}, ignorées : ${skipped})`);

  return ko > 0 ? 1 : 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  process.exit(runContrastCheck());
}
