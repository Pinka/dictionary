const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 5;

export interface RecentSearch {
  word: string;
  timestamp: number;
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function addRecentSearch(word: string) {
  const searches = getRecentSearches();

  // Remove if already exists
  const filtered = searches.filter((s) => s.word !== word);

  // Add to start of array
  const newSearches = [{ word, timestamp: Date.now() }, ...filtered].slice(
    0,
    MAX_RECENT_SEARCHES
  );

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  return newSearches;
}
