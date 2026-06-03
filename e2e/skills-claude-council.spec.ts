import { test, expect } from "@playwright/test";

/**
 * CC-8 : parité FR/EN sur /skills/claude-council + interaction du
 * générateur <CouncilBuilder />.
 * Couvre le rendu, le breadcrumb, les H2 cornerstone, la config Karpathy
 * verbatim, les cross-links sortants, et l'interaction live du générateur
 * (changement de config -> mise à jour de la sortie, bouton copier).
 */

const FR_PATH = "/fr/skills/claude-council/";
const EN_PATH = "/en/skills/claude-council/";

test.describe("/skills/claude-council — rendu et structure", () => {
  test("FR : titre, h1 et mention du pattern", async ({ page }) => {
    await page.goto(FR_PATH);
    await expect(page).toHaveTitle(/Claude Council/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Claude Council/i);
    await expect(page.locator("main")).toContainText("Karpathy");
  });

  test("EN : title, h1 and pattern mention", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(page).toHaveTitle(/Claude Council/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Claude Council/i);
    await expect(page.locator("main")).toContainText("Karpathy");
  });
});

test.describe("/skills/claude-council — breadcrumb", () => {
  test("FR : breadcrumb visible avec lien Accueil", async ({ page }) => {
    await page.goto(FR_PATH);
    const breadcrumb = page
      .getByRole("navigation", { name: "Fil d'Ariane" })
      .first();
    await expect(breadcrumb).toBeVisible();
    await expect(
      breadcrumb.getByRole("link", { name: "Accueil" }).first(),
    ).toBeVisible();
  });

  test("EN : breadcrumb visible with Home link", async ({ page }) => {
    await page.goto(EN_PATH);
    const breadcrumb = page
      .getByRole("navigation", { name: "Breadcrumb" })
      .first();
    await expect(breadcrumb).toBeVisible();
    await expect(
      breadcrumb.getByRole("link", { name: "Home" }).first(),
    ).toBeVisible();
  });
});

test.describe("/skills/claude-council — faits clés et config verbatim", () => {
  test("FR : statut non maintenu + Chairman Gemini + config OpenRouter", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const main = page.locator("main");
    // Statut "Saturday hack / non maintenu / pas de licence"
    await expect(main).toContainText(/Saturday hack/i);
    await expect(main).toContainText(/sans aucune licence/i);
    // Chairman par défaut = Gemini
    await expect(main).toContainText(/Gemini qui préside/i);
    // Config verbatim
    await expect(main).toContainText('CHAIRMAN_MODEL = "google/gemini-3-pro-preview"');
  });

  test("EN : unmaintained status + Gemini chairman + OpenRouter config", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const main = page.locator("main");
    await expect(main).toContainText(/Saturday hack/i);
    await expect(main).toContainText(/no license at all/i);
    await expect(main).toContainText(/Gemini is the one who presides/i);
    await expect(main).toContainText('CHAIRMAN_MODEL = "google/gemini-3-pro-preview"');
  });
});

test.describe("/skills/claude-council — cross-links sortants", () => {
  test("FR : liens vers what-are-skills, find-skills, orchestration", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const main = page.locator("main");
    await expect(
      main.locator('a[href*="/skills/what-are-skills"]').first(),
    ).toBeVisible();
    await expect(
      main.locator('a[href*="/skills/find-skills"]').first(),
    ).toBeVisible();
    await expect(
      main.locator('a[href*="/agents/orchestration"]').first(),
    ).toBeVisible();
  });

  test("EN : links to what-are-skills, find-skills, orchestration", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const main = page.locator("main");
    await expect(
      main.locator('a[href*="/skills/what-are-skills"]').first(),
    ).toBeVisible();
    await expect(
      main.locator('a[href*="/skills/find-skills"]').first(),
    ).toBeVisible();
    await expect(
      main.locator('a[href*="/agents/orchestration"]').first(),
    ).toBeVisible();
  });
});

test.describe("/skills/claude-council — générateur CouncilBuilder", () => {
  test("FR : le générateur rend un prompt et réagit à la question", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const output = page.getByTestId("council-output");
    await expect(output).toBeVisible();
    // contenu initial : intro persona (mode par défaut)
    await expect(output).toContainText(/conseil de plusieurs experts/i);

    // saisir une question -> elle apparaît dans la sortie
    const question = page.getByLabel("Votre question");
    await question.fill("Faut-il migrer vers une architecture event-driven ?");
    await expect(output).toContainText(
      "Faut-il migrer vers une architecture event-driven ?",
    );
  });

  test("FR : changer le mode met à jour la sortie", async ({ page }) => {
    await page.goto(FR_PATH);
    const output = page.getByTestId("council-output");
    await expect(output).toContainText(/conseil de plusieurs experts/i);
    await page.getByRole("radio", { name: /Multi-modèles/i }).click();
    await expect(output).toContainText(/délibération de council/i);
  });

  test("FR : l'onglet SKILL.md affiche un frontmatter de skill", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await page.getByRole("tab", { name: "SKILL.md" }).click();
    await expect(page.getByTestId("council-output")).toContainText(
      "name: claude-council",
    );
  });

  test("FR : ajouter/retirer un conseiller change le nombre de champs", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const roleInputs = page.getByLabel(/Rôle du conseiller/i);
    await expect(roleInputs).toHaveCount(3);
    await page.getByRole("button", { name: "Ajouter un conseiller" }).click();
    await expect(roleInputs).toHaveCount(4);
    await page.getByRole("button", { name: "Retirer un conseiller" }).click();
    await expect(roleInputs).toHaveCount(3);
  });

  test("FR : le bouton copier confirme la copie", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-write"]);
    await page.goto(FR_PATH);
    await page
      .getByRole("button", { name: "Copier", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Copié", exact: true }),
    ).toBeVisible();
  });

  test("FR : le générateur est pilotable au clavier", async ({ page }) => {
    await page.goto(FR_PATH);
    const increase = page.getByRole("button", {
      name: "Ajouter un conseiller",
    });
    await increase.focus();
    await expect(increase).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel(/Rôle du conseiller/i)).toHaveCount(4);
  });

  test("EN : the generator reacts to the question and mode", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const output = page.getByTestId("council-output");
    await expect(output).toBeVisible();
    await expect(output).toContainText(/council of several experts/i);
    await page.getByLabel("Your question").fill("Should we adopt microservices?");
    await expect(output).toContainText("Should we adopt microservices?");
    await page.getByRole("radio", { name: /Multi-model/i }).click();
    await expect(output).toContainText(/council deliberation/i);
  });
});
