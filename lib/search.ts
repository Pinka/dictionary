import { searchTranslations } from "./db";

export interface DictionaryEntry {
  word: string;
  translation?: string;
  type: "direct" | "similar" | "phrase";
}

export async function searchDictionary(
  query: string
): Promise<DictionaryEntry[]> {
  if (!query || query.length < 2) return [];

  const translations = await searchTranslations(query.toLowerCase().trim());

  return translations.map((t) => ({
    word: t.en,
    translation: t.mu,
    type: t.type,
  }));
}
