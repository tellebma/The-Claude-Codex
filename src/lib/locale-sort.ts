/**
 * Tri localisé des chaînes, insensible aux accents.
 *
 * `Array.prototype.sort()` par défaut utilise l'ordre UTF-16, ce qui range
 * tous les caractères accentués (é, à, ç, …) après Z. Pour un contenu
 * francophone, on veut que "événement" se classe entre "événementiel" et
 * "exemple", pas après "zoo".
 *
 * `sensitivity: "base"` ignore les accents et la casse, exactement ce que
 * l'on veut pour un glossaire.
 *
 * @example
 * sortStrings(["zoo", "événement", "abc", "âme"], "fr")
 * // → ["abc", "âme", "événement", "zoo"]
 */
export function sortStrings(
  items: ReadonlyArray<string>,
  locale: string = "fr"
): ReadonlyArray<string> {
  return [...items].sort((a, b) =>
    a.localeCompare(b, locale, { sensitivity: "base" })
  );
}

/**
 * Trie un tableau d'objets selon une clé textuelle, avec la comparaison
 * locale (insensible aux accents).
 */
export function sortByKey<T>(
  items: ReadonlyArray<T>,
  key: (item: T) => string,
  locale: string = "fr"
): ReadonlyArray<T> {
  return [...items].sort((a, b) =>
    key(a).localeCompare(key(b), locale, { sensitivity: "base" })
  );
}

/**
 * Retourne la première lettre "normalisée" (sans accent, en majuscule)
 * d'une chaîne. Utilisé pour grouper alphabétiquement les termes d'un
 * glossaire francophone : "événement" → "E", "âme" → "A".
 */
export function initialLetter(value: string): string {
  const stripped = value.normalize("NFD").replaceAll(/[̀-ͯ]/g, "");
  return stripped.charAt(0).toUpperCase();
}
