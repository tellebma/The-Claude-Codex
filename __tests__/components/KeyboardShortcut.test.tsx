import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KeyboardShortcut } from "@/components/ui/KeyboardShortcut";

describe("KeyboardShortcut", () => {
  it("renders each key inside a <kbd> tag", () => {
    const { container } = render(<KeyboardShortcut keys={["Ctrl", "C"]} />);
    const kbds = container.querySelectorAll("kbd");
    expect(kbds).toHaveLength(2);
    expect(kbds[0].textContent).toBe("Ctrl");
    expect(kbds[1].textContent).toBe("C");
  });

  it("inserts a + separator between keys with default separator", () => {
    const { container } = render(<KeyboardShortcut keys={["Ctrl", "K"]} />);
    expect(container.textContent).toContain("+");
  });

  it("omits the + when separator is a space", () => {
    const { container } = render(
      <KeyboardShortcut keys={["Esc", "Esc"]} separator=" " />,
    );
    const plus = Array.from(container.querySelectorAll("span[aria-hidden='true']"))
      .map((s) => s.textContent)
      .filter((t) => t?.trim() === "+");
    expect(plus).toHaveLength(0);
  });

  it("accepts a comma-separated string of keys", () => {
    const { container } = render(<KeyboardShortcut keys="Ctrl, K" />);
    const kbds = container.querySelectorAll("kbd");
    expect(kbds).toHaveLength(2);
    expect(kbds[0].textContent).toBe("Ctrl");
    expect(kbds[1].textContent).toBe("K");
  });

  it("sets aria-label joining keys with ' + ' by default", () => {
    render(<KeyboardShortcut keys={["Ctrl", "K"]} />);
    expect(screen.getByLabelText("Ctrl + K")).toBeInTheDocument();
  });

  it("sets aria-label joining keys with ' then ' for space separator", () => {
    render(<KeyboardShortcut keys={["Esc", "Esc"]} separator=" " />);
    expect(screen.getByLabelText("Esc then Esc")).toBeInTheDocument();
  });

  it("renders a single key without separator", () => {
    const { container } = render(<KeyboardShortcut keys={["Enter"]} />);
    const kbds = container.querySelectorAll("kbd");
    expect(kbds).toHaveLength(1);
  });
});
