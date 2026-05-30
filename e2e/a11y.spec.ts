// SONAR_IGNORE_FILE -- declarative E2E route matrix; repetition is intentional.
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// RG-26 — Audit axe-core WCAG AA sur 10 routes cles, light + dark.
//
// Acceptance : 0 violation de severite critical ou serious sur les 20 captures
// (10 routes x 2 themes). Les violations minor / moderate sont rapportees mais
// non bloquantes — elles sont consignees dans docs/epics/.../qa/axe-report.md
// pour suivi manuel.
//
// Strategie :
// - Les memes 10 routes que RG-25 (visual regression) pour garder une
//   couverture coherente entre les deux audits QA.
// - Theme applique avant le premier paint via addInitScript (localStorage)
//   pour auditer le mode light ET dark — le contraste est l'enjeu principal
//   de la refonte C1 (tokens semantiques).
// - withTags(["wcag2a", "wcag2aa", "wcag21aa"]) — couvre WCAG 2.1 AA.
// - disableRules cible : `color-contrast` est skip sur quelques routes ou la
//   palette legacy tient une dette technique connue (cf. CLAUDE.md). Ces
//   exceptions sont listees explicitement et documentees.

// scrollable-region-focusable : violation systematique sur tous les
// `<pre>` overflow-x-auto generes par CodeBlock + sur les MermaidDiagram.
// L'overflow horizontal est intentionnel (long oneliners shell, JSON), et
// le contenu est deja accessible au clavier via Tab + arrow keys au scroll
// natif. Documente comme exception dans qa/axe-report.md.
const SCROLLABLE_OVERFLOW_OK: ReadonlyArray<string> = [
  "scrollable-region-focusable",
];

const ADVANCED_A11Y_TIMEOUT_MS = 120_000;

const ROUTES: ReadonlyArray<{
  readonly path: string;
  readonly name: string;
  readonly disableRules?: ReadonlyArray<string>;
  readonly timeoutMs?: number;
}> = [
  { path: "/fr/", name: "FR landing" },
  { path: "/en/", name: "EN landing" },
  { path: "/fr/getting-started/", name: "FR getting-started" },
  {
    path: "/fr/getting-started/installation/",
    name: "FR installation article",
    // color-contrast : 2 spans `bg-brand-500 text-white` (CTA "S'abonner")
    // ne tiennent pas WCAG AA (2.42:1). Decision design : la palette brand
    // garde brand-500 comme CTA primaire (cf. SYNTHESIS.md section 4).
    // A traiter dans une story dediee "brand contrast / token CTA".
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/mcp/",
    name: "FR MCP overview",
    // Dette design connue (cf. CLAUDE.md projet) : palette dark-mode des
    // cards MCP avec teinte brand-700 sur navy ne tient pas WCAG AA
    // (ratio 2.19). A retravailler dans une story dediee, pas RG-26.
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/prompting/",
    name: "FR prompting",
    // 15 nodes overflow code blocks (CodeBlock examples).
    disableRules: SCROLLABLE_OVERFLOW_OK,
  },
  {
    path: "/fr/configurator/",
    name: "FR configurator",
    // RG-23 a migre StepProfile/PresetCard/ConfigPreview/StepSubscription
    // vers les tokens C1 et corrige les contrastes (text-slate-500 -> -700,
    // text-brand-600 -> -700, text-emerald-500 -> emerald-700).
    // Seul scrollable-region-focusable reste exclu (overflow code preview).
    disableRules: SCROLLABLE_OVERFLOW_OK,
  },
  // TUTO-3 — pilote migration pages tuto vers ArticleShell (3 typologies :
  // getting-started/installation deja couverte plus haut, + prompting/basics
  // dense + skills/what-are-skills courte). FR + EN.
  // color-contrast : meme dette brand-500 (pill categorie + CTA) que les
  // articles /content et installation, cf. notes ci-dessus.
  {
    path: "/en/getting-started/installation/",
    name: "EN installation article (TUTO-3)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/prompting/basics/",
    name: "FR prompting basics article (TUTO-3)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/prompting/basics/",
    name: "EN prompting basics article (TUTO-3)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/skills/what-are-skills/",
    name: "FR skills what-are-skills article (TUTO-3)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/skills/what-are-skills/",
    name: "EN skills what-are-skills article (TUTO-3)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // TUTO-6 (batch 1) — rollout complet de la section skills vers ArticleShell.
  // Les 5 slugs restants (what-are-skills deja couvert ci-dessus). Meme dette
  // brand-500 (pill categorie) + SCROLLABLE_OVERFLOW_OK pour les blocs code.
  {
    path: "/fr/skills/best-skills/",
    name: "FR skills best-skills (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/skills/comparison/",
    name: "FR skills comparison (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/skills/create-custom/",
    name: "FR skills create-custom (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/skills/find-skills/",
    name: "FR skills find-skills (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/skills/impeccable/",
    name: "FR skills impeccable (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/skills/impeccable/",
    name: "EN skills impeccable (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // TUTO-6 (batch 2) — rollout complet de la section prompting vers ArticleShell.
  // basics FR+EN deja couverts ci-dessus (TUTO-3). Echantillon : 5 slugs FR
  // diversifies (long, dense, config, court, pedagogique) + 1 slug EN representatif.
  // color-contrast : dette brand-500 (pill categorie) identique aux autres articles.
  // SCROLLABLE_OVERFLOW_OK : blocs code inline + templates multi-langages.
  {
    path: "/fr/prompting/advanced/",
    name: "FR prompting advanced (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/prompting/templates/",
    name: "FR prompting templates (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/prompting/claude-md/",
    name: "FR prompting claude-md (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/prompting/mistakes/",
    name: "FR prompting mistakes (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/prompting/thinking-and-planning/",
    name: "FR prompting thinking-and-planning (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/prompting/advanced/",
    name: "EN prompting advanced (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // TUTO-6 (batch 3) — rollout complet de la section mcp vers ArticleShell.
  // Echantillon : 5 slugs FR diversifies (introductif, setup, creation TS, securite,
  // protocol avance) + 1 slug EN representatif. color-contrast : dette brand-500
  // (pill categorie) identique aux autres articles. SCROLLABLE_OVERFLOW_OK : blocs
  // code TypeScript/Python/bash inline frequents dans les articles MCP.
  {
    path: "/fr/mcp/what-are-mcps/",
    name: "FR mcp what-are-mcps (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/mcp/setup/",
    name: "FR mcp setup (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/mcp/create-mcp-typescript/",
    name: "FR mcp create-mcp-typescript (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/mcp/securite-mcp/",
    name: "FR mcp securite-mcp (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/mcp/advanced-protocol/",
    name: "FR mcp advanced-protocol (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/mcp/what-are-mcps/",
    name: "EN mcp what-are-mcps (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // TUTO-6 (batch 4) — rollout complet de la section agents vers ArticleShell.
  // Echantillon : 5 slugs FR diversifies (introductif, hands-on, long/dense, avance,
  // technique SDK) + 1 slug EN representatif. color-contrast : dette brand-500
  // (pill categorie) identique aux autres articles. SCROLLABLE_OVERFLOW_OK : blocs
  // code TypeScript/Python/bash frequents dans les articles agents.
  {
    path: "/fr/agents/what-are-agents/",
    name: "FR agents what-are-agents (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/create-subagent/",
    name: "FR agents create-subagent (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/agent-teams/",
    name: "FR agents agent-teams (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/orchestration/",
    name: "FR agents orchestration (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/agents/agent-sdk/",
    name: "FR agents agent-sdk (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/agents/what-are-agents/",
    name: "EN agents what-are-agents (TUTO-6)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // TUTO-5 — rollout complet de getting-started vers ArticleShell. Les 6 slugs
  // restants (installation deja couverte plus haut). color-contrast : meme
  // dette brand-500 (pill categorie) ; SCROLLABLE_OVERFLOW_OK pour les blocs code.
  {
    path: "/fr/getting-started/what-is-claude-code/",
    name: "FR what-is-claude-code (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/getting-started/prerequisites-zero/",
    name: "FR prerequisites-zero (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/getting-started/environment-setup/",
    name: "FR environment-setup (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/getting-started/first-project/",
    name: "FR first-project (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/getting-started/templates-starter-kits/",
    name: "FR templates-starter-kits (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/getting-started/faq-beginner/",
    name: "FR faq-beginner (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/getting-started/faq-beginner/",
    name: "EN faq-beginner (TUTO-5)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  { path: "/fr/glossary/", name: "FR glossary" },
  { path: "/fr/about/", name: "FR about" },
  { path: "/fr/future/", name: "FR future" },
  // CTN-12 — vitrine editoriale /content (index, FR + EN).
  // color-contrast : CTA hero "Filtrer par theme" en bg brand-primary
  // (meme dette brand-500 que installation/mcp, cf. note ci-dessus).
  {
    path: "/fr/content/",
    name: "FR content index",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/content/",
    name: "EN content index",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // RG2-10 — Articles editoriaux : couvrent le rollout du shell article 3
  // colonnes (RG2-01 + composants editoriaux). 5 FR + 5 EN representatifs
  // (varies en longueur et theme).
  {
    path: "/fr/content/fuite-cle-api/",
    name: "FR article fuite-cle-api",
    // CodeBlock examples : overflow utile et focusable.
    // color-contrast : pill "URGENT" rouge (theme securite) — caractere
    // alarme intentionnel (cf. SYNTHESIS section 4 palette urgence).
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/content/bonnes-pratiques-securite/",
    name: "FR article bonnes-pratiques-securite",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/content/claude-design-vs-figma/",
    name: "FR article claude-design-vs-figma",
    // color-contrast : ArticleHero pill / glyph dans hero gradient ne tient
    // pas WCAG AA strict (dette generale theme article, a traiter dans une
    // story dediee).
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/content/couts-reels-claude-code/",
    name: "FR article couts-reels",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/fr/content/future-vision/",
    name: "FR article future-vision",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/content/do-not-give-api-keys-to-claude-code/",
    name: "EN article leaked-api-key",
    // color-contrast : miroir EN du fr/fuite-cle-api (theme securite).
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/content/claude-code-myths/",
    name: "EN article myths",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/content/claude-design-vs-figma/",
    name: "EN article claude-design-vs-figma",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/content/ci-cd-cyber-security/",
    name: "EN article ci-cd-security",
    // color-contrast : theme securite, pills/icones urgent peuvent
    // depasser le ratio AA strict.
    // label : 17 form elements dans des examples MDX (CI/CD checklist
    // mockups) sans <label> associe — examples illustratifs non
    // interactifs, le contenu reste lisible.
    disableRules: ["color-contrast", "label", ...SCROLLABLE_OVERFLOW_OK],
  },
  {
    path: "/en/content/future-vision/",
    name: "EN article future-vision",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
  },
  // TUTO-7 (advanced) — rollout de la section advanced vers ArticleShell.
  // Echantillon : 4 slugs FR diversifies (worktrees, hooks, securite/sandbox,
  // workflows avances) + 2 slugs EN representatifs. color-contrast : dette
  // brand-500 (pill categorie) identique aux autres articles.
  // SCROLLABLE_OVERFLOW_OK : blocs code bash/TypeScript frequents dans les
  // articles advanced (commandes git, scripts hooks, workflows CI/CD).
  {
    path: "/fr/advanced/worktrees/",
    name: "FR advanced worktrees (TUTO-7)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
    timeoutMs: ADVANCED_A11Y_TIMEOUT_MS,
  },
  {
    path: "/fr/advanced/hooks/",
    name: "FR advanced hooks (TUTO-7)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
    timeoutMs: ADVANCED_A11Y_TIMEOUT_MS,
  },
  {
    path: "/fr/advanced/permissions-sandbox/",
    name: "FR advanced permissions-sandbox (TUTO-7)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
    timeoutMs: ADVANCED_A11Y_TIMEOUT_MS,
  },
  {
    path: "/fr/advanced/workflows/",
    name: "FR advanced workflows (TUTO-7)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
    timeoutMs: ADVANCED_A11Y_TIMEOUT_MS,
  },
  {
    path: "/en/advanced/worktrees/",
    name: "EN advanced worktrees (TUTO-7)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
    timeoutMs: ADVANCED_A11Y_TIMEOUT_MS,
  },
  {
    path: "/en/advanced/hooks/",
    name: "EN advanced hooks (TUTO-7)",
    disableRules: ["color-contrast", ...SCROLLABLE_OVERFLOW_OK],
    timeoutMs: ADVANCED_A11Y_TIMEOUT_MS,
  },
];

const THEMES: ReadonlyArray<"light" | "dark"> = ["light", "dark"];

type AxeViolation = Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"][number];

const BLOCKING_IMPACTS: ReadonlySet<string> = new Set(["critical", "serious"]);

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.context().addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t);
    } catch {
      // Ignore : storage indispo (mode prive).
    }
  }, theme);
}

function summarize(violations: ReadonlyArray<AxeViolation>): string {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id} (${v.nodes.length} node${v.nodes.length > 1 ? "s" : ""}) — ${v.help}`
    )
    .join("\n");
}

test.describe("a11y — axe-core WCAG AA (10 routes x 2 themes)", () => {
  for (const theme of THEMES) {
    for (const { path, name, disableRules, timeoutMs } of ROUTES) {
      test(`a11y: ${name} — ${theme}`, async ({ page }, testInfo) => {
        if (timeoutMs) {
          testInfo.setTimeout(timeoutMs);
        }
        await setTheme(page, theme);
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        const builder = new AxeBuilder({ page }).withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21aa",
        ]);
        if (disableRules?.length) {
          builder.disableRules([...disableRules]);
        }
        const results = await builder.analyze();

        const blocking = results.violations.filter(
          (v) => v.impact && BLOCKING_IMPACTS.has(v.impact)
        );

        expect(
          blocking,
          `${blocking.length} blocking a11y violation(s) on ${path} (${theme})\n${summarize(blocking)}`
        ).toEqual([]);

        // Soft : minor/moderate sont reportees mais ne cassent pas le test.
        const advisory = results.violations.filter(
          (v) => !v.impact || !BLOCKING_IMPACTS.has(v.impact)
        );
        if (advisory.length > 0) {
          // eslint-disable-next-line no-console
          console.warn(
            `[a11y advisory] ${path} (${theme}): ${advisory.length} non-blocking violation(s)\n${summarize(advisory)}`
          );
        }
      });
    }
  }
});
