import { searchTranslations } from "./db";
import { sanitizeInput } from "./sanitize";

export interface DictionaryEntry {
  word: string;
  translation?: string;
  type: "direct" | "similar" | "phrase";
}

export async function searchDictionary(
  query: string
): Promise<DictionaryEntry[]> {
  if (!query || query.length < 2) return [];

  const sanitizedQuery = sanitizeInput(query).toLowerCase();

  const translations = await searchTranslations(sanitizedQuery);

  return translations.map((t) => ({
    word: t.en,
    translation: t.mu,
    type: t.type,
  }));
}
