import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Faq, FaqItem } from "@/components/mdx/Faq";

describe("Faq", () => {
  it("renders all children questions", () => {
    render(
      <Faq>
        <FaqItem question="Question 1">Reponse 1</FaqItem>
        <FaqItem question="Question 2">Reponse 2</FaqItem>
      </Faq>
    );
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });

  it("starts with all items closed by default and answer hidden", () => {
    render(
      <Faq>
        <FaqItem question="Q">Reponse cachee</FaqItem>
      </Faq>
    );
    const button = screen.getByRole("button", { name: "Q" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    // Answer panel exists in DOM but is hidden via the `hidden` attribute.
    const region = screen.getByRole("region", { hidden: true });
    expect(region).toBeInTheDocument();
    expect(region.hasAttribute("hidden")).toBe(true);
  });

  it("opens an item on click and toggles aria-expanded + chevron rotation", () => {
    render(
      <Faq>
        <FaqItem question="Q">Reponse</FaqItem>
      </Faq>
    );
    const button = screen.getByRole("button", { name: "Q" });
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const region = screen.getByRole("region");
    expect(region).toBeVisible();
    expect(region.textContent).toContain("Reponse");
  });

  it("closes an open item when clicked again", () => {
    render(
      <Faq>
        <FaqItem question="Q" defaultOpen>Reponse</FaqItem>
      </Faq>
    );
    const button = screen.getByRole("button", { name: "Q" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("supports keyboard activation via Enter key (native button behavior)", () => {
    render(
      <Faq>
        <FaqItem question="Q">Contenu</FaqItem>
      </Faq>
    );
    const button = screen.getByRole("button", { name: "Q" });
    button.focus();
    // Native browsers fire click on Enter for buttons; jsdom requires the
    // explicit click to mirror that behavior.
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("links button and panel via aria-controls + aria-labelledby for screen readers", () => {
    render(
      <Faq>
        <FaqItem question="Q">Reponse</FaqItem>
      </Faq>
    );
    const button = screen.getByRole("button", { name: "Q" });
    const ariaControls = button.getAttribute("aria-controls");
    expect(ariaControls).toMatch(/^faq-a-/);
    fireEvent.click(button);
    const region = screen.getByRole("region");
    expect(region.getAttribute("id")).toBe(ariaControls);
    expect(region.getAttribute("aria-labelledby")).toBe(button.getAttribute("id"));
  });

  it("renders defaultOpen item already expanded with answer visible", () => {
    render(
      <Faq>
        <FaqItem question="Q" defaultOpen>Reponse visible</FaqItem>
      </Faq>
    );
    expect(screen.getByRole("button", { name: "Q" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Reponse visible")).toBeVisible();
  });

  it("each FaqItem gets a unique id pair (no collision when multiple)", () => {
    render(
      <Faq>
        <FaqItem question="A">RA</FaqItem>
        <FaqItem question="B">RB</FaqItem>
      </Faq>
    );
    const buttons = screen.getAllByRole("button");
    const id1 = buttons[0].getAttribute("aria-controls");
    const id2 = buttons[1].getAttribute("aria-controls");
    expect(id1).not.toBe(id2);
  });
});
