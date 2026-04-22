import { getLocale } from "next-intl/server";
import { NotFoundClient } from "@/components/not-found/NotFoundClient";
import { getNotFoundBundles, type Locale } from "@/lib/not-found-strings";

function normalizeLocale(raw: string): Locale {
  return raw === "en" ? "en" : "fr";
}

export default async function NotFound() {
  const rawLocale = await getLocale();
  const defaultLocale = normalizeLocale(rawLocale);
  const bundles = getNotFoundBundles();

  return (
    <NotFoundClient defaultLocale={defaultLocale} bundles={bundles} />
  );
}
