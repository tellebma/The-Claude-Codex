import { describe, it, expect } from "vitest";
import {
  Shield,
  DollarSign,
  AlertCircle,
  Palette,
  GitBranch,
  Sparkles,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  resolveContentIcon,
  resolveContentColor,
} from "@/lib/content-icons";

describe("resolveContentIcon / resolveContentColor", () => {
  it("maps security-related slugs to Shield/brand", () => {
    expect(resolveContentIcon("fuite-cle-api")).toBe(Shield);
    expect(resolveContentIcon("ne-pas-donner-cles-api-a-claude-code")).toBe(
      Shield,
    );
    expect(resolveContentIcon("bonnes-pratiques-securite")).toBe(Shield);
    expect(resolveContentIcon("leaked-api-key-recovery")).toBe(Shield);
    expect(resolveContentColor("fuite-cle-api")).toBe("brand");
  });

  it("maps cost slugs to DollarSign/accent", () => {
    expect(resolveContentIcon("couts-reels-claude-code")).toBe(DollarSign);
    expect(resolveContentIcon("cout-tokens-par-langue")).toBe(DollarSign);
    expect(resolveContentColor("couts-reels-claude-code")).toBe("accent");
  });

  it("maps myth slugs to AlertCircle/accent", () => {
    expect(resolveContentIcon("mythes-claude-code")).toBe(AlertCircle);
    expect(resolveContentIcon("myths-debunked")).toBe(AlertCircle);
    expect(resolveContentColor("mythes-claude-code")).toBe("accent");
  });

  it("maps the figma comparison to Palette/brand", () => {
    expect(resolveContentIcon("claude-design-vs-figma")).toBe(Palette);
    expect(resolveContentColor("claude-design-vs-figma")).toBe("brand");
  });

  it("maps ci-cd before security and to GitBranch/emerald", () => {
    expect(resolveContentIcon("ci-cd-cyber-securite")).toBe(GitBranch);
    expect(resolveContentColor("ci-cd-cyber-securite")).toBe("emerald");
  });

  it("maps vision/future slugs to Sparkles/brand", () => {
    expect(resolveContentIcon("future-vision")).toBe(Sparkles);
    expect(resolveContentColor("future-vision")).toBe("brand");
  });

  it("maps cornerstone guide slugs to BookOpen/brand", () => {
    for (const slug of [
      "getting-started-intro",
      "mcp-guide",
      "prompting-guide",
      "skills-guide",
    ]) {
      expect(resolveContentIcon(slug)).toBe(BookOpen);
      expect(resolveContentColor(slug)).toBe("brand");
    }
  });

  it("falls back to FileText/accent for unknown slugs", () => {
    expect(resolveContentIcon("some-random-article")).toBe(FileText);
    expect(resolveContentColor("some-random-article")).toBe("accent");
  });

  it("is case-insensitive on the slug", () => {
    expect(resolveContentIcon("FUITE-CLE-API")).toBe(Shield);
  });
});
