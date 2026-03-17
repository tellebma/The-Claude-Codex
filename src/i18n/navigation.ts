import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation APIs that automatically handle locale prefixes.
 * Use these instead of next/link and next/navigation in client components.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
