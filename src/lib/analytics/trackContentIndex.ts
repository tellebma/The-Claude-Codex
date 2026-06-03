import { trackEvent } from "./matomo";

const CATEGORY = "content_index";

export const trackContentIndex = {
  themeFilterToggle(themeKey: string, isActive: boolean): void {
    trackEvent(
      CATEGORY,
      "article_theme_filter_toggle",
      themeKey,
      isActive ? 1 : 0,
    );
  },
} as const;
