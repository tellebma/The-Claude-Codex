import { describe, it, expect } from "vitest";
import { generateAll } from "@/lib/configurator/generator";
import { PRESETS } from "@/lib/configurator/presets";
import type { ConfigState } from "@/lib/configurator/types";

/**
 * Snapshot tests for the 5 reference presets. These serve as a safety net
 * before refactoring generateClaudeMd (Sonar C1 — cognitive complexity 36).
 * Any behavioral regression on the emitted strings will flip a snapshot,
 * blocking the merge.
 */
function toConfigState(preset: (typeof PRESETS)[number]): ConfigState {
  return {
    profile: preset.profile,
    stacks: preset.stacks,
    subscription: preset.subscription,
    features: preset.features,
  };
}

const SAMPLED_PRESET_IDS = [
  "frontend-react",
  "backend-node",
  "backend-python",
  "mobile-rn",
  "devops",
];

describe("generator — preset snapshots (US-04 regression guard)", () => {
  for (const id of SAMPLED_PRESET_IDS) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) continue;

    it(`${id}: generateAll output is stable`, () => {
      const result = generateAll(toConfigState(preset));
      expect(result).toMatchSnapshot();
    });
  }

  it("empty-stacks fallback is stable", () => {
    const config: ConfigState = {
      profile: "web-frontend",
      stacks: [],
      subscription: "free",
      features: [],
    };
    const result = generateAll(config);
    expect(result).toMatchSnapshot();
  });

  it("designer profile with frontend commands is stable", () => {
    const config: ConfigState = {
      profile: "designer",
      stacks: ["Figma", "Tailwind CSS", "React"],
      subscription: "pro",
      features: ["mcp", "skills"],
    };
    const result = generateAll(config);
    expect(result).toMatchSnapshot();
  });

  it("data profile snapshot is stable", () => {
    const config: ConfigState = {
      profile: "data",
      stacks: ["Python", "Jupyter", "Pandas"],
      subscription: "pro",
      features: ["mcp", "skills", "extended-thinking"],
    };
    const result = generateAll(config);
    expect(result).toMatchSnapshot();
  });

  it("beginner profile fallback commands are stable", () => {
    const config: ConfigState = {
      profile: "beginner",
      stacks: ["HTML", "CSS", "JavaScript"],
      subscription: "free",
      features: ["skills"],
    };
    const result = generateAll(config);
    expect(result).toMatchSnapshot();
  });

  it("backlog feature enabled snapshot is stable", () => {
    const config: ConfigState = {
      profile: "web-frontend",
      stacks: ["React", "TypeScript"],
      subscription: "pro",
      features: ["backlog", "skills"],
    };
    const result = generateAll(config);
    expect(result).toMatchSnapshot();
  });
});
