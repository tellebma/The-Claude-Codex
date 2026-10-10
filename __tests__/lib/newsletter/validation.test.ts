import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  normalizeEmail,
  MAX_EMAIL_LENGTH,
} from "@/lib/newsletter/validation";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
  });
});

describe("isValidEmail", () => {
  it.each([
    "user@example.com",
    "first.last@sub.domain.io",
    "a+tag@gmail.com",
    "  Mixed@Case.Fr  ",
  ])("accepts %s", (value) => {
    expect(isValidEmail(value)).toBe(true);
  });

  it.each([
    "",
    "   ",
    "plainaddress",
    "@no-local.com",
    "no-at-sign.com",
    "spaces in@example.com",
    "missing@tld",
    "two@@at.com",
  ])("rejects %s", (value) => {
    expect(isValidEmail(value)).toBe(false);
  });

  it("rejects addresses over the max length", () => {
    const local = "a".repeat(MAX_EMAIL_LENGTH);
    expect(isValidEmail(`${local}@example.com`)).toBe(false);
  });
});
