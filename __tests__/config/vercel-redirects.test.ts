import { describe, it, expect } from "vitest";
import vercelConfig from "../../vercel.json";

interface VercelRedirect {
  readonly source: string;
  readonly destination: string;
  readonly permanent: boolean;
}

/**
 * La regle catch-all en bas de `vercel.json` redirige vers /fr/<path> tout
 * chemin qui n'est pas deja prefixe par une locale ou par un asset
 * "techniquement reserve" (_next, og, icons, llms.txt, etc.).
 *
 * Bug historique : les fichiers de `public/` sans prefixe (ex.
 * /search-index-fr.json, /sad-toaster.glb, /images/foo.png) etaient
 * redirigees vers /fr/search-index-fr.json -> 404. Le SearchDialog en
 * production pouvait alors charger un index vide et n'afficher aucun
 * resultat.
 *
 * On verifie ici que la regex catch-all :
 *  - redirige bien les chemins de pages sans prefixe locale ;
 *  - n'attrape jamais un asset statique (chemin avec extension de fichier).
 */
describe("vercel.json catch-all locale redirect", () => {
  const catchAll = (vercelConfig.redirects as ReadonlyArray<VercelRedirect>).find(
    (r) => r.destination === "/fr/:path"
  );

  it("est present dans la config", () => {
    expect(catchAll).toBeDefined();
  });

  function pathMatchesCatchAll(path: string): boolean {
    if (!catchAll) return false;
    // path-to-regexp v6 compile : on extrait la regex inline du `:path(<re>)`
    // pour la tester directement contre le path.
    const inline = /\/:path\((.*)\)$/.exec(catchAll.source);
    expect(inline).not.toBeNull();
    const re = new RegExp(`^/${inline![1]}$`);
    return re.test(path);
  }

  it("redirige les pages sans prefixe locale", () => {
    expect(pathMatchesCatchAll("/content/foo")).toBe(true);
    expect(pathMatchesCatchAll("/getting-started/installation")).toBe(true);
    expect(pathMatchesCatchAll("/mcp/what-are-mcps")).toBe(true);
  });

  it("ne redirige PAS les chemins deja prefixes locale", () => {
    expect(pathMatchesCatchAll("/fr/content/foo")).toBe(false);
    expect(pathMatchesCatchAll("/en/mcp/what-are-mcps")).toBe(false);
  });

  it("ne redirige PAS les fichiers du dossier public (extensions)", () => {
    // Bug recherche KO en prod : ces fichiers etaient redirges vers
    // /fr/<path> et renvoyaient 404. La regex doit les laisser passer.
    expect(pathMatchesCatchAll("/search-index-fr.json")).toBe(false);
    expect(pathMatchesCatchAll("/search-index-en.json")).toBe(false);
    expect(pathMatchesCatchAll("/sad-toaster.glb")).toBe(false);
    expect(pathMatchesCatchAll("/images/screenshot.png")).toBe(false);
    expect(pathMatchesCatchAll("/skills/api-pattern.md")).toBe(false);
  });

  it("ne redirige PAS les assets techniques exclus explicitement", () => {
    expect(pathMatchesCatchAll("/_next/static/foo")).toBe(false);
    expect(pathMatchesCatchAll("/api/health")).toBe(false);
    expect(pathMatchesCatchAll("/og/og-default.png")).toBe(false);
    expect(pathMatchesCatchAll("/llms.txt")).toBe(false);
    expect(pathMatchesCatchAll("/robots.txt")).toBe(false);
    expect(pathMatchesCatchAll("/sitemap.xml")).toBe(false);
    expect(pathMatchesCatchAll("/manifest.webmanifest")).toBe(false);
    expect(pathMatchesCatchAll("/favicon.ico")).toBe(false);
  });
});
