"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export interface RecentSearch {
  word: string;
  timestamp: string;
}

async function fetchRecentSearches(limit = 5): Promise<RecentSearch[]> {
  const result = await db.execute({
    sql: `
      WITH ranked_searches AS (
        SELECT 
          word,
          timestamp,
          ROW_NUMBER() OVER (ORDER BY timestamp DESC) as rn
        FROM searches
      )
      SELECT DISTINCT s1.word, s1.timestamp
      FROM ranked_searches s1
      WHERE NOT EXISTS (
        SELECT 1 
        FROM ranked_searches s2
        WHERE s2.rn < s1.rn
          AND (
            s2.word LIKE s1.word || '%'  -- s2 starts with s1
            OR s1.word LIKE s2.word || '%'  -- s1 starts with s2
          )
          AND s1.word != s2.word
      )
      ORDER BY timestamp DESC
      LIMIT ?
    `,
    args: [limit],
  });

  console.log(result.rows);
  return result.rows as unknown as RecentSearch[];
}

export const getRecentSearches = unstable_cache(
  fetchRecentSearches,
  ["recent-searches"],
  { revalidate: 60 }
);
