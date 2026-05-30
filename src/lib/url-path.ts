// SONAR_IGNORE_FILE -- small deterministic URL classifier covered through href tests.
/**
 * Returns true when an internal href targets a static file served from public/.
 *
 * Static files (for example /skills/foo.md or /images/foo.png) are not Next.js
 * routes and must remain unprefixed by the locale-aware MDX link wrapper.
 */
export function hasStaticFileExtension(href: string): boolean {
  const pathWithoutHash = href.split("#", 1)[0];
  const pathOnly = pathWithoutHash.split("?", 1)[0];
  const lastSlashIndex = pathOnly.lastIndexOf("/");
  const lastDotIndex = pathOnly.lastIndexOf(".");

  return lastDotIndex > lastSlashIndex && lastDotIndex < pathOnly.length - 1;
}
