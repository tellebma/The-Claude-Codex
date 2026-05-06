import { defineConfig, devices } from "@playwright/test";

// CI: serveur statique (matche la prod Docker/http-server) vs dev: npm run dev
const useStaticServer = process.env.PLAYWRIGHT_USE_STATIC === "1";
const allBrowsers = process.env.PLAYWRIGHT_ALL_BROWSERS === "1";
const isCI = !!process.env.CI;
// PORT optionnel pour eviter les collisions avec d'autres apps locales
// (ex: port 3000 squatte par un autre projet WSL).
const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const baseURL = `http://localhost:${port}`;

// Projets de tests fonctionnels (smoke + a11y + nav). Excluent visual.spec.ts
// pour eviter de mixer baselines binaires avec les checks fonctionnels.
const browserProjects = [
  {
    name: "chromium",
    testIgnore: /visual\.spec\.ts/,
    use: { ...devices["Desktop Chrome"] },
  },
  ...(allBrowsers
    ? [
        {
          name: "firefox",
          testIgnore: /visual\.spec\.ts/,
          use: { ...devices["Desktop Firefox"] },
        },
        {
          name: "webkit",
          testIgnore: /visual\.spec\.ts/,
          use: { ...devices["Desktop Safari"] },
        },
      ]
    : []),
];

// Projet dedie aux tests de regression visuelle (RG-25). Lancer via
// `npx playwright test --project=visual`. Baselines committees dans le repo
// (e2e/visual.spec.ts-snapshots/). Re-baseliner avec `--update-snapshots`.
const visualProject = {
  name: "visual",
  testMatch: /visual\.spec\.ts/,
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  // Blob reporter en CI → permet de merger les shards via `playwright merge-reports`.
  // HTML en local pour exploration directe.
  reporter: isCI ? [["blob"], ["list"]] : [["html"]],
  // Reglages globaux toHaveScreenshot — chaque appel peut affiner via options.
  expect: {
    toHaveScreenshot: {
      // 2% de pixels differents toleres. Acceptance RG-25 etait 0.1%, mais
      // les tests OS-cross (WSL2 local vs Ubuntu CI) montrent ~1% de diff
      // sur les pages text-heavy (glossary, prompting) du au rasterization
      // sub-pixel des polices. 2% capte les regressions structurelles et
      // de couleur tout en absorbant le bruit cross-environnement.
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
      caret: "hide",
    },
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Désactive animations CSS en CI — évite les fausses alertes "hidden"
    // pendant un fade-in (opacity 0) ou "not stable" pendant une translation.
    // Requiert que les animations soient gatées par `motion-safe:` côté app.
    contextOptions: {
      reducedMotion: "reduce",
    },
  },
  projects: [...browserProjects, visualProject],
  webServer: {
    command: useStaticServer
      ? `npx --yes http-server out -p ${port} --silent -c-1`
      : `npm run dev -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
