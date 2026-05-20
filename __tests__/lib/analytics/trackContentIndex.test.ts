import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { trackContentIndex } from "@/lib/analytics/trackContentIndex";

describe("trackContentIndex.themeFilterToggle", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[] })._paq = [];
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
  });

  it("emits Matomo trackEvent with value=1 when activating a theme", () => {
    trackContentIndex.themeFilterToggle("security", true);
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    expect(paq[0]).toEqual([
      "trackEvent",
      "content_index",
      "article_theme_filter_toggle",
      "security",
      1,
    ]);
  });

  it("emits Matomo trackEvent with value=0 when deactivating a theme", () => {
    trackContentIndex.themeFilterToggle("tutorial", false);
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    expect(paq[0]).toEqual([
      "trackEvent",
      "content_index",
      "article_theme_filter_toggle",
      "tutorial",
      0,
    ]);
  });
});
