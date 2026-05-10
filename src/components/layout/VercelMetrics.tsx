"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * VM-3 / VM-5 / VM-6 / VM-7 — wrapper client-only des composants Vercel.
 *
 * Pourquoi ce wrapper : `<Analytics beforeSend={...} />` recoit une
 * fonction en prop. Comme le root layout `[locale]/layout.tsx` est un
 * Server Component, il ne peut pas passer de fonction directement a
 * un Client Component (Next.js refuse au build : "Functions cannot be
 * passed directly to Client Components"). On encapsule donc Analytics
 * et SpeedInsights dans ce composant client qui declare lui-meme les
 * callbacks et les constantes derivees d'env vars.
 */

const SPEED_INSIGHTS_SAMPLE_RATE = Math.max(
  0,
  Math.min(1, Number(process.env.NEXT_PUBLIC_VERCEL_SI_SAMPLE_RATE ?? "1") || 1)
);

const SENSITIVE_QUERY_KEYS = new Set([
  "token",
  "key",
  "secret",
  "api_key",
  "apikey",
  "password",
  "pwd",
  "auth",
  "code",
]);

function redactSensitiveQuery(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    let mutated = false;
    for (const key of [...url.searchParams.keys()]) {
      if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
        url.searchParams.set(key, "[redacted]");
        mutated = true;
      }
    }
    return mutated ? url.toString() : rawUrl;
  } catch {
    return rawUrl;
  }
}

export function VercelMetrics() {
  return (
    <>
      <Analytics
        mode="production"
        beforeSend={(event) => ({
          ...event,
          url: redactSensitiveQuery(event.url),
        })}
      />
      <SpeedInsights sampleRate={SPEED_INSIGHTS_SAMPLE_RATE} />
    </>
  );
}
