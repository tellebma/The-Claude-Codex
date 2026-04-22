import { defineConfig, devices } from "@playwright/test";

// CI: serveur statique (matche la prod Docker/http-server) vs dev: npm run dev
const useStaticServer = process.env.PLAYWRIGHT_USE_STATIC === "1";
const allBrowsers = process.env.PLAYWRIGHT_ALL_BROWSERS === "1";
const isCI = !!process.env.CI;

const browserProjects = [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ...(allBrowsers
    ? [
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
      ]
    : []),
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  // Blob reporter en CI → permet de merger les shards via `playwright merge-reports`.
  // HTML en local pour exploration directe.
  reporter: isCI ? [["blob"], ["list"]] : [["html"]],
  use: {
    baseURL: "http://localhost:3000",
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
  projects: browserProjects,
  webServer: {
    command: useStaticServer
      ? "npx --yes http-server out -p 3000 --silent -c-1"
      : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
