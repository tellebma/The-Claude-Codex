/**
 * Verifies that every locale file in /messages has exactly the same set of
 * translation keys as messages/fr.json (the source of truth). A missing key
 * throws a MISSING_MESSAGE error from next-intl at request time; an extra
 * key is dead weight. This check catches both before they reach `next build`.
 *
 * Usage: tsx scripts/check-locale-parity.ts
 */

import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  ".."
);
const MESSAGES_DIR = path.join(ROOT_DIR, "messages");
const REFERENCE_LOCALE = "fr";

type JsonObject = Record<string, unknown>;

function flattenKeys(obj: JsonObject, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as JsonObject, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function loadLocaleFile(locale: string): JsonObject {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as JsonObject;
}

function main(): void {
  const localeFiles = fs
    .readdirSync(MESSAGES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));

  if (!localeFiles.includes(REFERENCE_LOCALE)) {
    console.error(`Reference locale "${REFERENCE_LOCALE}.json" not found in ${MESSAGES_DIR}`);
    process.exit(1);
  }

  const referenceKeys = new Set(flattenKeys(loadLocaleFile(REFERENCE_LOCALE)));
  let hasError = false;

  for (const locale of localeFiles) {
    if (locale === REFERENCE_LOCALE) continue;

    const keys = new Set(flattenKeys(loadLocaleFile(locale)));
    const missing = [...referenceKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !referenceKeys.has(k));

    if (missing.length > 0 || extra.length > 0) {
      hasError = true;
      console.error(`\nLocale "${locale}" is out of sync with "${REFERENCE_LOCALE}":`);
      if (missing.length > 0) {
        console.error(`  Missing keys (${missing.length}):`);
        for (const k of missing) console.error(`    - ${k}`);
      }
      if (extra.length > 0) {
        console.error(`  Extra keys (${extra.length}):`);
        for (const k of extra) console.error(`    + ${k}`);
      }
    } else {
      console.log(`Locale "${locale}": OK (${keys.size} keys, parity with ${REFERENCE_LOCALE})`);
    }
  }

  if (hasError) {
    console.error("\nLocale parity check failed.");
    process.exit(1);
  }

  console.log("\nAll locale files have matching keys.");
}

main();
