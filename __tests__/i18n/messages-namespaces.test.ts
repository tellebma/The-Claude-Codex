import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";

const TRANSLATION_CALL_RE = /(?:useTranslations|getTranslations)\(\s*["']([^"']+)["']\s*\)/g;

function collectSourceFiles(root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const full = join(root, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function collectUsedNamespaces(files: string[]): Set<string> {
  const used = new Set<string>();
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    let match: RegExpExecArray | null;
    TRANSLATION_CALL_RE.lastIndex = 0;
    while ((match = TRANSLATION_CALL_RE.exec(content)) !== null) {
      used.add(match[1].split(".")[0]);
    }
  }
  return used;
}

describe("i18n namespaces used in source code", () => {
  const files = collectSourceFiles("src");
  const used = collectUsedNamespaces(files);

  it("every namespace referenced by useTranslations / getTranslations exists in FR", () => {
    const frTop = new Set(Object.keys(fr));
    const missing = Array.from(used).filter((ns) => !frTop.has(ns));
    expect(missing, `FR is missing namespaces: ${missing.join(", ")}`).toEqual([]);
  });

  it("every namespace referenced by useTranslations / getTranslations exists in EN", () => {
    const enTop = new Set(Object.keys(en));
    const missing = Array.from(used).filter((ns) => !enTop.has(ns));
    expect(missing, `EN is missing namespaces: ${missing.join(", ")}`).toEqual([]);
  });
});
