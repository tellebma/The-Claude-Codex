import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock the subscribe logic — the component test focuses on UI states.
const subscribeEmail = vi.fn();
vi.mock("@/lib/newsletter/subscribe", () => ({
  subscribeEmail: (...args: unknown[]) => subscribeEmail(...args),
}));

import { NewsletterForm } from "@/components/ui/NewsletterForm";

function typeEmail(value: string) {
  // The visible field is the email input (the honeypot has tabIndex -1).
  const input = screen.getByPlaceholderText("emailPlaceholder");
  fireEvent.change(input, { target: { value } });
}

describe("NewsletterForm", () => {
  beforeEach(() => {
    subscribeEmail.mockReset();
  });

  it("renders the email field and submit button (idle)", () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText("emailPlaceholder")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("submit");
  });

  it("renders a hidden honeypot field", () => {
    const { container } = render(<NewsletterForm />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });

  it("passes the variant as source to subscribeEmail", async () => {
    subscribeEmail.mockResolvedValue({ outcome: "success" });
    render(<NewsletterForm variant="footer" />);
    typeEmail("user@example.com");
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(subscribeEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: "user@example.com", source: "footer" }),
      ),
    );
  });

  it("shows the success state after a successful subscription", async () => {
    subscribeEmail.mockResolvedValue({ outcome: "success" });
    render(<NewsletterForm />);
    typeEmail("user@example.com");
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByRole("status")).toHaveTextContent("successTitle");
    expect(screen.getByText("successMessage")).toBeInTheDocument();
  });

  it("shows the already-subscribed message on idempotent success", async () => {
    subscribeEmail.mockResolvedValue({ outcome: "already_subscribed" });
    render(<NewsletterForm />);
    typeEmail("dup@example.com");
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText("alreadySubscribed")).toBeInTheDocument();
  });

  it("shows an error alert when the subscription fails", async () => {
    subscribeEmail.mockResolvedValue({ outcome: "invalid_email" });
    render(<NewsletterForm />);
    typeEmail("bad");
    fireEvent.click(screen.getByRole("button"));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("errors.invalid_email");
  });

  it("marks the input invalid on error", async () => {
    subscribeEmail.mockResolvedValue({ outcome: "error" });
    render(<NewsletterForm />);
    typeEmail("user@example.com");
    fireEvent.click(screen.getByRole("button"));
    await screen.findByRole("alert");
    expect(screen.getByPlaceholderText("emailPlaceholder")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
