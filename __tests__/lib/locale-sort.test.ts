import { describe, it, expect } from "vitest";
import { sortStrings, sortByKey, initialLetter } from "@/lib/locale-sort";

describe("sortStrings (locale-aware)", () => {
  it("sorts accented characters like their base letter in French", () => {
    const input = ["zoo", "événement", "abc", "âme"];
    const sorted = sortStrings(input, "fr");
    expect(sorted).toEqual(["abc", "âme", "événement", "zoo"]);
  });

  it("keeps ASCII alphabetical order on English locale", () => {
    const input = ["banana", "apple", "cherry"];
    const sorted = sortStrings(input, "en");
    expect(sorted).toEqual(["apple", "banana", "cherry"]);
  });

  it("is case-insensitive via sensitivity base", () => {
    const input = ["banane", "Abricot", "cerise"];
    const sorted = sortStrings(input, "fr");
    expect(sorted).toEqual(["Abricot", "banane", "cerise"]);
  });

  it("does not mutate the input", () => {
    const input = Object.freeze(["zoo", "abc"]);
    expect(() => sortStrings(input, "fr")).not.toThrow();
  });

  it("defaults to French locale when none provided", () => {
    const input = ["zoo", "événement", "abc"];
    expect(sortStrings(input)).toEqual(["abc", "événement", "zoo"]);
  });
});

describe("sortByKey", () => {
  it("sorts objects by a text key using locale compare", () => {
    const input = [
      { name: "zoo" },
      { name: "événement" },
      { name: "abc" },
      { name: "âme" },
    ];
    const sorted = sortByKey(input, (item) => item.name, "fr");
    expect(sorted.map((i) => i.name)).toEqual([
      "abc",
      "âme",
      "événement",
      "zoo",
    ]);
  });

  it("works with arbitrary object shapes", () => {
    const input = [{ term: "Événement" }, { term: "Asynchrone" }];
    const sorted = sortByKey(input, (e) => e.term);
    expect(sorted[0].term).toBe("Asynchrone");
    expect(sorted[1].term).toBe("Événement");
  });
});

describe("initialLetter", () => {
  it("strips accents and returns uppercase initial", () => {
    expect(initialLetter("événement")).toBe("E");
    expect(initialLetter("âme")).toBe("A");
    expect(initialLetter("Ôtel")).toBe("O");
    expect(initialLetter("Zoo")).toBe("Z");
  });

  it("handles ASCII input", () => {
    expect(initialLetter("abc")).toBe("A");
    expect(initialLetter("Banana")).toBe("B");
  });

  it("returns empty string for empty input", () => {
    expect(initialLetter("")).toBe("");
  });
});
