/**
 * Resolution des vignettes Open Graph par article (CTN-10).
 *
 * Les images sont generees au build par `scripts/generate-og-images.tsx` dans
 * `public/og/content/{locale}/{slug}.png` (1200x630, variant hero/partage
 * social) et `{slug}-card.png` (600x315, variant carte grid/row). La liste des
 * articles effectivement generes est consignee dans `src/data/og-manifest.json`
 * et importee statiquement (pattern article-stats : zero acces filesystem au
 * runtime, Sonar-clean).
 *
 * Ce module n'expose que des fonctions pures : la resolution prend le manifeste
 * en argument (par defaut celui importe), ce qui la rend testable sans IO.
 */
import type { ArticleCardSize } from "@/components/ui/ArticleCard";
import ogManifestJson from "@/data/og-manifest.json";

export type OgImageVariant = "hero" | "card";

export interface OgManifestEntry {
  readonly locale: string;
  readonly slug: string;
}

export interface OgManifest {
  readonly generatedAt: string;
  readonly images: ReadonlyArray<OgManifestEntry>;
}

/** Dimensions OG distinctes (cf. spec SEO CTN-10). */
export const OG_HERO_SIZE = { width: 1200, height: 630 } as const;
export const OG_CARD_SIZE = { width: 600, height: 315 } as const;

export function isOgManifest(value: unknown): value is OgManifest {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { generatedAt?: unknown; images?: unknown };
  if (typeof candidate.generatedAt !== "string") return false;
  if (!Array.isArray(candidate.images)) return false;
  return candidate.images.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as OgManifestEntry).locale === "string" &&
      typeof (entry as OgManifestEntry).slug === "string",
  );
}

const defaultManifest: OgManifest = isOgManifest(ogManifestJson)
  ? ogManifestJson
  : { generatedAt: "1970-01-01T00:00:00.000Z", images: [] };

export function ogVariantForSize(size: ArticleCardSize): OgImageVariant {
  return size === "hero" ? "hero" : "card";
}

export function ogImagePublicPath(
  locale: string,
  slug: string,
  variant: OgImageVariant,
): string {
  const suffix = variant === "card" ? "-card" : "";
  return `/og/content/${locale}/${slug}${suffix}.png`;
}

export function ogManifestKey(locale: string, slug: string): string {
  return `${locale}:${slug}`;
}

function buildKeySet(manifest: OgManifest): ReadonlySet<string> {
  return new Set(manifest.images.map((entry) => ogManifestKey(entry.locale, entry.slug)));
}

export function hasOgImage(
  locale: string,
  slug: string,
  manifest: OgManifest = defaultManifest,
): boolean {
  return buildKeySet(manifest).has(ogManifestKey(locale, slug));
}

/**
 * URL publique de la vignette OG pour une carte d'une taille donnee, ou
 * `undefined` si l'article n'a pas d'image generee (ArticleCard retombe alors
 * sur le fallback degrade + icone thematique).
 */
export function resolveOgImageUrl(
  locale: string,
  slug: string,
  size: ArticleCardSize,
  manifest: OgManifest = defaultManifest,
): string | undefined {
  if (!hasOgImage(locale, slug, manifest)) return undefined;
  return ogImagePublicPath(locale, slug, ogVariantForSize(size));
}
