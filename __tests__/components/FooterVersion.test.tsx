import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FooterVersion } from "@/components/layout/FooterVersion";

const CACHE_KEY = "tcc:latest-release";

describe("FooterVersion", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_APP_VERSION", "1.5.0");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    window.localStorage.clear();
  });

  it("renders the build-time fallback version on first paint", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise(() => {})) // never resolves
    );
    render(<FooterVersion />);
    expect(screen.getByText("v1.5.0")).toBeInTheDocument();
  });

  it("upgrades to the GitHub latest release tag and caches it", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: "v2.0.0" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<FooterVersion />);
    await waitFor(() => expect(screen.getByText("v2.0.0")).toBeInTheDocument());

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/tellebma/The-Claude-Codex/releases/latest",
      expect.objectContaining({
        headers: { Accept: "application/vnd.github+json" },
      })
    );
    const cached = window.localStorage.getItem(CACHE_KEY);
    expect(cached).toBeTruthy();
    expect(JSON.parse(cached as string)).toMatchObject({ version: "2.0.0" });
  });

  it("uses cached version without calling fetch when cache is fresh", () => {
    const fresh = { version: "2.0.0", ts: Date.now() };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<FooterVersion />);
    expect(screen.getByText("v2.0.0")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores stale cache (older than TTL) and refetches", async () => {
    const stale = { version: "0.0.1", ts: Date.now() - 2 * 60 * 60 * 1000 };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(stale));
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: "v3.0.0" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<FooterVersion />);
    await waitFor(() => expect(screen.getByText("v3.0.0")).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps the build-time fallback when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<FooterVersion />);
    await waitFor(() => {
      expect(screen.getByText("v1.5.0")).toBeInTheDocument();
    });
  });

  it("keeps the fallback when GitHub returns a non-OK status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) })
    );
    render(<FooterVersion />);
    await waitFor(() => {
      expect(screen.getByText("v1.5.0")).toBeInTheDocument();
    });
  });

  it("keeps the fallback when corrupted cache cannot be parsed", () => {
    window.localStorage.setItem(CACHE_KEY, "not-json");
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<FooterVersion />);
    expect(screen.getByText("v1.5.0")).toBeInTheDocument();
  });
});
