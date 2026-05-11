import { trackEvent } from "./matomo";
import { trackVercelEvent } from "./trackVercel";

/**
 * Dedicated tracking for the interactive configurator. Fires the same
 * events on both Matomo (source of truth) and Vercel Web Analytics
 * (sanity check + premium dashboard, cf. VM-4).
 *
 * Category: `configurator`
 *
 * Actions:
 *   - `configurator_start`    : fired once when the user opens the wizard
 *                               or picks a preset for the first time.
 *   - `configurator_step`     : fired when the user moves to a new step,
 *                               label = step number (1..4).
 *   - `configurator_complete` : fired when the user reaches the preview
 *                               (step 4 "Generate" clicked, or preset
 *                               applied which shows the preview).
 */
const CATEGORY = "configurator";

export const trackConfigurator = {
  start(): void {
    trackEvent(CATEGORY, "configurator_start");
    trackVercelEvent("configurator_start");
  },
  step(stepNumber: number): void {
    trackEvent(CATEGORY, "configurator_step", String(stepNumber), stepNumber);
    trackVercelEvent("configurator_step", { step: stepNumber });
  },
  complete(): void {
    trackEvent(CATEGORY, "configurator_complete");
    trackVercelEvent("configurator_complete");
  },
} as const;
