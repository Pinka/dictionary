import { getWordOfDayFromDB, WordOfDay } from "./db";
import { unstable_cache } from "next/cache";

const DEFAULT_WORD: WordOfDay = {
  word: "perseverance",
  desc: "Continuing despite difficulties; not giving up",
  date: new Date().toISOString().split("T")[0],
};

async function fetchWordOfDay(): Promise<WordOfDay> {
  const word = await getWordOfDayFromDB();
  return word ?? DEFAULT_WORD;
}

// Create a cache key that changes at midnight
function getTodaysCacheKey() {
  return `word-of-day-${new Date().toISOString().split("T")[0]}`;
}

export const getWordOfDay = unstable_cache(
  fetchWordOfDay,
  [getTodaysCacheKey()],
  { revalidate: 3600 } // Cache for 1 hour as a fallback
);
