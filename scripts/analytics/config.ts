/**
 * Loads and validates runtime configuration from environment variables.
 * Fails fast with a clear message if anything is missing.
 */

export interface AnalyticsConfig {
  readonly gscSiteUrl: string;
  readonly gscServiceAccountJson: string;
  readonly matomoBaseUrl: string;
  readonly matomoSiteId: string;
  readonly matomoTokenAuth: string;
  readonly discordWebhookUrl: string | null; // optional: skip notification if unset
  readonly outputDir: string; // absolute path where CSVs and REPORT.md land
  readonly periodDays: number; // number of days in the analysis window
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : null;
}

function envOrDefault(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export function loadConfig(overrides: Partial<AnalyticsConfig> = {}): AnalyticsConfig {
  const config: AnalyticsConfig = {
    gscSiteUrl: envOrDefault("GSC_SITE_URL", "sc-domain:claude-codex.fr"),
    gscServiceAccountJson: requireEnv("GSC_SERVICE_ACCOUNT_JSON"),
    matomoBaseUrl: envOrDefault("MATOMO_BASE_URL", "https://matomo.tellebma.fr"),
    matomoSiteId: requireEnv("MATOMO_SITE_ID"),
    matomoTokenAuth: requireEnv("MATOMO_TOKEN_AUTH"),
    discordWebhookUrl: optionalEnv("DISCORD_WEBHOOK_URL"),
    outputDir: envOrDefault("ANALYTICS_OUTPUT_DIR", "docs/analytics"),
    periodDays: Number(envOrDefault("ANALYTICS_PERIOD_DAYS", "7")),
    ...overrides,
  };
  if (!Number.isFinite(config.periodDays) || config.periodDays <= 0) {
    throw new Error(`Invalid ANALYTICS_PERIOD_DAYS: ${config.periodDays}`);
  }
  return config;
}

export function computeDateRange(periodDays: number, today = new Date()): {
  startDate: string;
  endDate: string;
} {
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 3); // GSC data lag
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (periodDays - 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}
