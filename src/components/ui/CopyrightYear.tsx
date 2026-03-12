"use client";

/**
 * Client component that renders the current year dynamically.
 * Ensures the copyright year stays up to date even with SSG.
 */
export function CopyrightYear() {
  return <span>{new Date().getFullYear()}</span>;
}
