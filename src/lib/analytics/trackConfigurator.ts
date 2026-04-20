import { trackEvent } from "./matomo";

/**
 * Dedicated Matomo events for the interactive configurator.
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
  },
  step(stepNumber: number): void {
    trackEvent(CATEGORY, "configurator_step", String(stepNumber), stepNumber);
  },
  complete(): void {
    trackEvent(CATEGORY, "configurator_complete");
  },
} as const;
