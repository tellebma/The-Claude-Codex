import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { trackConfigurator } from "@/lib/analytics/trackConfigurator";

function getPaq(): unknown[][] {
  return (window as unknown as { _paq: unknown[][] })._paq;
}

describe("trackConfigurator", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[][] })._paq = [];
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
  });

  it("fires configurator_start", () => {
    trackConfigurator.start();
    expect(getPaq()[0]).toEqual([
      "trackEvent",
      "configurator",
      "configurator_start",
    ]);
  });

  it("fires configurator_step with step number as label and value", () => {
    trackConfigurator.step(3);
    expect(getPaq()[0]).toEqual([
      "trackEvent",
      "configurator",
      "configurator_step",
      "3",
      3,
    ]);
  });

  it("fires configurator_complete", () => {
    trackConfigurator.complete();
    expect(getPaq()[0]).toEqual([
      "trackEvent",
      "configurator",
      "configurator_complete",
    ]);
  });
});
