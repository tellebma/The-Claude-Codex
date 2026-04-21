import { describe, it, expect } from "vitest";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";

type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

function collectKeyPaths(obj: Json, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, Json>)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      out.push(...collectKeyPaths(v, path));
    } else {
      out.push(path);
    }
  }
  return out.sort();
}

describe("i18n messages FR/EN parity", () => {
  const frPaths = collectKeyPaths(fr as unknown as Json);
  const enPaths = collectKeyPaths(en as unknown as Json);

  it("every FR key path exists in EN", () => {
    const missingInEn = frPaths.filter((p) => !enPaths.includes(p));
    expect(missingInEn, `EN is missing keys: ${missingInEn.join(", ")}`).toEqual([]);
  });

  it("every EN key path exists in FR", () => {
    const missingInFr = enPaths.filter((p) => !frPaths.includes(p));
    expect(missingInFr, `FR is missing keys: ${missingInFr.join(", ")}`).toEqual([]);
  });

  it("top-level namespaces match exactly", () => {
    expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort());
  });

  it("no locale has an empty leaf string", () => {
    function findEmpty(obj: Json, prefix = ""): string[] {
      if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return [];
      const out: string[] = [];
      for (const [k, v] of Object.entries(obj as Record<string, Json>)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v !== null && typeof v === "object" && !Array.isArray(v)) {
          out.push(...findEmpty(v, path));
        } else if (typeof v === "string" && v.trim() === "") {
          out.push(path);
        }
      }
      return out;
    }
    expect(findEmpty(fr as unknown as Json), "FR has empty strings").toEqual([]);
    expect(findEmpty(en as unknown as Json), "EN has empty strings").toEqual([]);
  });

  it("ICU plural placeholders in FR and EN cover the same variants", () => {
    function findIcuPlurals(obj: Json, prefix = ""): Record<string, string> {
      const acc: Record<string, string> = {};
      if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return acc;
      for (const [k, v] of Object.entries(obj as Record<string, Json>)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v !== null && typeof v === "object" && !Array.isArray(v)) {
          Object.assign(acc, findIcuPlurals(v, path));
        } else if (typeof v === "string" && /\{\w+,\s*plural,/i.test(v)) {
          acc[path] = v;
        }
      }
      return acc;
    }
    const frPlurals = findIcuPlurals(fr as unknown as Json);
    const enPlurals = findIcuPlurals(en as unknown as Json);
    expect(Object.keys(frPlurals).sort()).toEqual(Object.keys(enPlurals).sort());
  });
});
