import { describe, it, expect } from "vitest";
import {
  PRESETS,
  PROFILES,
  SUBSCRIPTIONS,
  FEATURES,
} from "@/lib/configurator/presets";
import type {
  Profile,
  Subscription,
  Feature,
} from "@/lib/configurator/types";

describe("PROFILES", () => {
  const validProfileIds: Profile[] = [
    "web-frontend",
    "web-backend",
    "mobile",
    "devops",
    "designer",
    "writer",
    "data",
    "beginner",
  ];

  it("contains all expected profile ids", () => {
    const ids = PROFILES.map((p) => p.id);
    for (const id of validProfileIds) {
      expect(ids).toContain(id);
    }
  });

  it("each profile has required fields", () => {
    for (const profile of PROFILES) {
      expect(profile.id).toBeTruthy();
      expect(profile.label).toBeTruthy();
      expect(profile.description).toBeTruthy();
      expect(profile.icon).toBeTruthy();
      expect(profile.stacks.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate profile ids", () => {
    const ids = PROFILES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("SUBSCRIPTIONS", () => {
  const validSubIds: Subscription[] = [
    "free",
    "pro",
    "max-100",
    "max-200",
    "api",
  ];

  it("contains all expected subscription ids", () => {
    const ids = SUBSCRIPTIONS.map((s) => s.id);
    for (const id of validSubIds) {
      expect(ids).toContain(id);
    }
  });

  it("each subscription has required fields", () => {
    for (const sub of SUBSCRIPTIONS) {
      expect(sub.id).toBeTruthy();
      expect(sub.label).toBeTruthy();
      expect(sub.price).toBeTruthy();
      expect(sub.description).toBeTruthy();
      expect(sub.features.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate subscription ids", () => {
    const ids = SUBSCRIPTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("FEATURES", () => {
  const validFeatureIds: Feature[] = [
    "agent-teams",
    "mcp",
    "hooks",
    "skills",
    "extended-thinking",
    "backlog",
  ];

  it("contains all expected feature ids", () => {
    const ids = FEATURES.map((f) => f.id);
    for (const id of validFeatureIds) {
      expect(ids).toContain(id);
    }
  });

  it("each feature has required fields", () => {
    for (const feature of FEATURES) {
      expect(feature.id).toBeTruthy();
      expect(feature.label).toBeTruthy();
      expect(feature.description).toBeTruthy();
    }
  });

  it("has no duplicate feature ids", () => {
    const ids = FEATURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requiresSubscription references valid subscription ids when set", () => {
    const validSubIds = SUBSCRIPTIONS.map((s) => s.id);
    for (const feature of FEATURES) {
      if (feature.requiresSubscription) {
        expect(validSubIds).toContain(feature.requiresSubscription);
      }
    }
  });
});

describe("PRESETS", () => {
  it("has at least 5 presets", () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it("each preset has required fields", () => {
    for (const preset of PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.profile).toBeTruthy();
      expect(preset.stacks.length).toBeGreaterThan(0);
      expect(preset.subscription).toBeTruthy();
      expect(preset.icon).toBeTruthy();
    }
  });

  it("has no duplicate preset ids", () => {
    const ids = PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each preset references a valid profile", () => {
    const validProfileIds = PROFILES.map((p) => p.id);
    for (const preset of PRESETS) {
      expect(validProfileIds).toContain(preset.profile);
    }
  });

  it("each preset references a valid subscription", () => {
    const validSubIds = SUBSCRIPTIONS.map((s) => s.id);
    for (const preset of PRESETS) {
      expect(validSubIds).toContain(preset.subscription);
    }
  });

  it("each preset feature references a valid feature id", () => {
    const validFeatureIds = FEATURES.map((f) => f.id);
    for (const preset of PRESETS) {
      for (const featureId of preset.features) {
        expect(validFeatureIds).toContain(featureId);
      }
    }
  });
});
