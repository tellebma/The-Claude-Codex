/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  // Vitest as test runner
  testRunner: "vitest",
  vitest: {
    configFile: "vitest.config.ts",
  },

  // Scope: only mutate lib/ (highest coverage, best ROI)
  mutate: [
    "src/lib/**/*.ts",
    "!src/lib/**/*.d.ts",
  ],

  // Ignore build output and node_modules
  ignorePatterns: ["out", "reports", ".next"],

  // Disable type checks on HTML (avoids parse errors on build output)
  disableTypeChecks: "{**/*.html,**/*.htm}",

  // Reporters
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation/index.html",
  },

  // Performance: use incremental mode to skip unchanged mutants
  incremental: true,
  incrementalFile: "reports/mutation/.stryker-incremental.json",

  // Thresholds (informational, not blocking)
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },

  // Ignore static mutants (40% of total, 99% of runtime)
  ignoreStatic: true,

  // Timeout: give mutants extra time (some tests are slow in jsdom)
  timeoutMS: 30000,
  timeoutFactor: 2.5,
};
