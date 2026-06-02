import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import {
  clampAdvisorCount,
  estimateCalls,
  generatePrompt,
  generateSkillMd,
  COUNCIL_LIMITS,
  type CouncilConfig,
  type CouncilStrings,
} from "@/lib/council/council-prompt";
import { CouncilBuilder } from "@/components/mdx/CouncilBuilder";

const STRINGS: CouncilStrings = {
  promptIntroPersona: "PERSONA_INTRO",
  promptIntroModel: "MODEL_INTRO",
  advisorsHeading: "ADVISORS",
  stage1Heading: "STAGE1",
  stage1Body: "stage1 body",
  stage2Heading: "STAGE2",
  stage2Body: "stage2 body",
  stage3Heading: "STAGE3",
  stage3Body: "stage3 body",
  chairmanLabel: "CHAIRMAN_IS",
  questionLabel: "QUESTION",
  skillDescription: "skill description",
  skillWhenToUse: "when to use",
  skillInstructions: "instructions",
  fallbackQuestion: "FALLBACK",
};

const BASE_CONFIG: CouncilConfig = {
  mode: "multi-persona",
  advisors: [
    { id: "a0", role: "Skeptic", brief: "finds flaws" },
    { id: "a1", role: "Advocate", brief: "defends" },
  ],
  chairman: "Skeptic",
  question: "Should we ship?",
};

describe("council-prompt logic", () => {
  describe("clampAdvisorCount", () => {
    it("clamps below the minimum", () => {
      expect(clampAdvisorCount(0)).toBe(COUNCIL_LIMITS.min);
      expect(clampAdvisorCount(-5)).toBe(COUNCIL_LIMITS.min);
    });

    it("clamps above the maximum", () => {
      expect(clampAdvisorCount(99)).toBe(COUNCIL_LIMITS.max);
    });

    it("truncates floats and returns valid values", () => {
      expect(clampAdvisorCount(3.9)).toBe(3);
    });

    it("falls back to minimum for NaN", () => {
      expect(clampAdvisorCount(Number.NaN)).toBe(COUNCIL_LIMITS.min);
    });
  });

  describe("estimateCalls", () => {
    it("computes 2N+1", () => {
      expect(estimateCalls(3)).toBe(7);
      expect(estimateCalls(4)).toBe(9);
    });

    it("clamps the input before computing", () => {
      expect(estimateCalls(100)).toBe(2 * COUNCIL_LIMITS.max + 1);
    });
  });

  describe("generatePrompt", () => {
    it("uses the persona intro in persona mode", () => {
      const out = generatePrompt(BASE_CONFIG, STRINGS);
      expect(out).toContain("PERSONA_INTRO");
      expect(out).not.toContain("MODEL_INTRO");
    });

    it("uses the model intro in model mode", () => {
      const out = generatePrompt(
        { ...BASE_CONFIG, mode: "multi-model" },
        STRINGS,
      );
      expect(out).toContain("MODEL_INTRO");
    });

    it("lists advisors with role and brief", () => {
      const out = generatePrompt(BASE_CONFIG, STRINGS);
      expect(out).toContain("1. Skeptic : finds flaws");
      expect(out).toContain("2. Advocate : defends");
    });

    it("names the chairman", () => {
      const out = generatePrompt(BASE_CONFIG, STRINGS);
      expect(out).toContain("CHAIRMAN_IS Skeptic.");
    });

    it("includes the user question", () => {
      const out = generatePrompt(BASE_CONFIG, STRINGS);
      expect(out).toContain("Should we ship?");
    });

    it("falls back when the question is empty", () => {
      const out = generatePrompt({ ...BASE_CONFIG, question: "   " }, STRINGS);
      expect(out).toContain("FALLBACK");
    });

    it("falls back chairman to the first advisor when empty", () => {
      const out = generatePrompt({ ...BASE_CONFIG, chairman: "" }, STRINGS);
      expect(out).toContain("CHAIRMAN_IS Skeptic.");
    });

    it("is deterministic (snapshot)", () => {
      expect(generatePrompt(BASE_CONFIG, STRINGS)).toMatchSnapshot();
    });
  });

  describe("generateSkillMd", () => {
    it("produces valid frontmatter with the skill name", () => {
      const out = generateSkillMd(BASE_CONFIG, STRINGS);
      expect(out.startsWith("---\nname: claude-council")).toBe(true);
      expect(out).toContain("description: skill description");
    });

    it("lists the council members and the three stages", () => {
      const out = generateSkillMd(BASE_CONFIG, STRINGS);
      expect(out).toContain("## Council members");
      expect(out).toContain("1. Skeptic : finds flaws");
      expect(out).toContain("**STAGE1**");
      expect(out).toContain("**STAGE3**");
    });

    it("handles an advisor with an empty role", () => {
      const out = generateSkillMd(
        {
          ...BASE_CONFIG,
          advisors: [{ id: "a0", role: "  ", brief: "x" }],
          chairman: "",
        },
        STRINGS,
      );
      expect(out).toContain("Conseiller 1");
    });

    it("is deterministic (snapshot)", () => {
      expect(generateSkillMd(BASE_CONFIG, STRINGS)).toMatchSnapshot();
    });
  });
});

describe("CouncilBuilder component", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders title and default output", () => {
    render(<CouncilBuilder />);
    expect(screen.getByText("title")).toBeInTheDocument();
    const output = screen.getByTestId("council-output");
    // persona mode is default -> persona intro key rendered
    expect(output.textContent).toContain("promptIntroPersona");
  });

  it("starts with 3 advisors and updates the call estimate", () => {
    render(<CouncilBuilder />);
    // 2N+1 with N=3 => 7
    expect(screen.getByText("callsEstimate")).toBeInTheDocument();
    const decrease = screen.getByLabelText("countDecrease");
    fireEvent.click(decrease);
    // N=2 advisor cards: role inputs labelled "roleField"
    const roleInputs = screen.getAllByLabelText("roleField");
    expect(roleInputs.length).toBe(2);
  });

  it("does not go below the minimum advisor count", () => {
    render(<CouncilBuilder />);
    const decrease = screen.getByLabelText("countDecrease");
    fireEvent.click(decrease); // 3 -> 2 (min)
    expect(decrease).toBeDisabled();
  });

  it("does not go above the maximum advisor count", () => {
    render(<CouncilBuilder />);
    const increase = screen.getByLabelText("countIncrease");
    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(increase);
    }
    expect(increase).toBeDisabled();
    expect(screen.getAllByLabelText("roleField").length).toBe(
      COUNCIL_LIMITS.max,
    );
  });

  it("switches mode and updates the generated prompt", () => {
    render(<CouncilBuilder />);
    const output = screen.getByTestId("council-output");
    expect(output.textContent).toContain("promptIntroPersona");
    fireEvent.click(screen.getByRole("radio", { name: "modeModel" }));
    expect(output.textContent).toContain("promptIntroModel");
  });

  it("reflects question input in the generated output", () => {
    render(<CouncilBuilder />);
    const textarea = screen.getByLabelText("questionField");
    fireEvent.change(textarea, { target: { value: "My hard question" } });
    expect(screen.getByTestId("council-output").textContent).toContain(
      "My hard question",
    );
  });

  it("reflects an edited advisor role in the output", () => {
    render(<CouncilBuilder />);
    const firstRole = screen.getAllByLabelText("roleField")[0];
    fireEvent.change(firstRole, { target: { value: "Auditor" } });
    expect(screen.getByTestId("council-output").textContent).toContain(
      "Auditor",
    );
  });

  it("switches to the SKILL.md tab", () => {
    render(<CouncilBuilder />);
    fireEvent.click(screen.getByRole("tab", { name: "tabSkill" }));
    expect(screen.getByTestId("council-output").textContent).toContain(
      "name: claude-council",
    );
  });

  it("copies the output to the clipboard", async () => {
    render(<CouncilBuilder />);
    const copyButton = screen.getByRole("button", { name: "copy" });
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole("button", { name: "copied" }),
    ).toBeInTheDocument();
  });

  it("falls back to execCommand when clipboard API throws", () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    // jsdom has no execCommand by default
    (document as unknown as { execCommand: typeof execCommand }).execCommand =
      execCommand;
    render(<CouncilBuilder />);
    fireEvent.click(screen.getByRole("button", { name: "copy" }));
    // microtask: the catch path runs after the rejected promise settles
    return Promise.resolve().then(() => {
      expect(execCommand).toHaveBeenCalledWith("copy");
    });
  });

  it("changes the chairman via the select", () => {
    render(<CouncilBuilder />);
    const select = screen.getByLabelText("chairmanField") as HTMLSelectElement;
    const options = within(select).getAllByRole("option");
    fireEvent.change(select, {
      target: { value: options[1].getAttribute("value") },
    });
    expect(select.value).toBe(options[1].getAttribute("value"));
  });
});
