import { test, expect } from "@playwright/test";

/**
 * B-SRC-2 — Verifie que la recherche globale fonctionne en production
 * Vercel apres le fix B-SRC-1 (regex catch-all `vercel.json`).
 *
 * Le test ne tourne qu'en mode preview/prod : en `npm run dev`, vercel.json
 * n'est pas applique (Next.js sert public/ directement), donc le bug ne
 * peut pas etre reproduit localement.
 *
 * Usage :
 *   VERCEL_PREVIEW_URL=https://<preview>.vercel.app npx playwright test search-results
 */
const BASE = process.env.VERCEL_PREVIEW_URL || process.env.PLAYWRIGHT_BASE_URL;

test.describe("Search globale en production Vercel (B-SRC-2)", () => {
  test.skip(
    !BASE || BASE.includes("localhost"),
    "requires VERCEL_PREVIEW_URL pointing to a deployed build"
  );

  test("public asset /search-index-fr.json sert un JSON 200", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/search-index-fr.json`);
    expect(res.status(), "search-index-fr.json status").toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/json");
    const body = await res.json();
    expect(Array.isArray(body), "search-index-fr.json doit etre un array").toBe(
      true
    );
    expect(body.length).toBeGreaterThan(0);
  });

  test("public asset /search-index-en.json sert un JSON 200", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/search-index-en.json`);
    expect(res.status(), "search-index-en.json status").toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/json");
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("public asset binaire /sad-toaster.glb sert 200 (pas de redirect locale)", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/sad-toaster.glb`, {
      maxRedirects: 0,
    });
    expect(res.status(), "sad-toaster.glb ne doit pas etre redirige").toBe(200);
  });

  test("recherche 'mcp' renvoie au moins 1 resultat dans le dialog", async ({
    page,
  }) => {
    await page.goto(`${BASE}/fr/`);
    await page.getByRole("button", { name: /Rechercher/ }).click();

    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("mcp");

    const listbox = page.getByRole("listbox", {
      name: "Résultats de recherche",
    });
    await expect(listbox.getByRole("option").first()).toBeVisible();
  });

  test("cliquer sur le 1er resultat de recherche atterrit sur une page valide", async ({
    page,
  }) => {
    await page.goto(`${BASE}/fr/`);
    await page.getByRole("button", { name: /Rechercher/ }).click();

    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("mcp");

    const firstOption = page
      .getByRole("listbox", { name: "Résultats de recherche" })
      .getByRole("option")
      .first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    await expect(page).not.toHaveURL(/\/404/);
    await expect(
      page.getByRole("heading", { level: 1 }).first()
    ).toBeVisible();
  });
});
