"use client";

import { useEffect, useState } from "react";

const REPO = "tellebma/The-Claude-Codex";
const CACHE_KEY = "tcc:latest-release";
const TTL_MS = 60 * 60 * 1000;

type Cached = { version: string; ts: number };

function readCache(): string | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed.version;
  } catch {
    return null;
  }
}

function writeCache(version: string): void {
  try {
    const payload: Cached = { version, ts: Date.now() };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* localStorage indisponible (mode privé, quota plein) — on ignore */
  }
}

export function FooterVersion() {
  const fallback = process.env.NEXT_PUBLIC_APP_VERSION ?? "";
  const [version, setVersion] = useState<string>(fallback);

  useEffect(() => {
    // setState dans l'effect est volontaire ici : on doit d'abord rendre le
    // fallback build-time (cohérent SSG/hydration) puis upgrader au mount client
    // sans déclencher de mismatch React.
    const cached = readCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVersion(cached);
      return;
    }
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { tag_name?: string }) => {
        const tag = data?.tag_name?.replace(/^v/, "");
        if (tag) {
          setVersion(tag);
          writeCache(tag);
        }
      })
      .catch(() => {
        /* offline, rate-limit GitHub, repo en transition — on garde le fallback build-time */
      });
    return () => controller.abort();
  }, []);

  return (
    <span className="rounded-md bg-slate-200/50 px-2 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
      v{version}
    </span>
  );
}
