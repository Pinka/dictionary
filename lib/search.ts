import dictionary from "@/app/dictionary.json";

export interface DictionaryEntry {
  word: string;
  translation?: string;
  type: "direct" | "similar" | "phrase";
}

export function searchDictionary(query: string): DictionaryEntry[] {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: DictionaryEntry[] = [];

  // Direct matches first
  const directMatches = dictionary
    .filter((entry) => entry.en.toLowerCase().startsWith(normalizedQuery))
    .slice(0, 3)
    .map((entry) => ({
      word: entry.en,
      translation: entry.mu,
      type: "direct" as const,
    }));
  results.push(...directMatches);

  // Similar matches (contains the query)
  if (results.length < 5) {
    const similarMatches = dictionary
      .filter(
        (entry) =>
          !directMatches.some((dm) => dm.word === entry.en) &&
          entry.en.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 5 - results.length)
      .map((entry) => ({
        word: entry.en,
        translation: entry.mu,
        type: "similar" as const,
      }));
    results.push(...similarMatches);
  }

  return results;
}
