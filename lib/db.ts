import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export interface WordOfDay {
  word: string;
  desc: string;
  date: string;
}

export interface Translation {
  en: string;
  mu: string;
  type: "direct" | "similar";
}

export async function getWordOfDayFromDB(): Promise<WordOfDay | null> {
  const today = new Date().toISOString().split("T")[0];

  const result = await db.execute({
    sql: "SELECT word, description, date FROM words WHERE date = ?",
    args: [today],
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0] as unknown as {
    word: string;
    description: string;
    date: string;
  };
  return {
    word: row.word,
    desc: row.description,
    date: row.date,
  };
}

export async function searchTranslations(
  query: string
): Promise<Translation[]> {
  const result = await db.execute({
    sql: `
      WITH direct_matches AS (
        SELECT english as en, mauritian as mu, 'direct' as type
        FROM dictionary
        WHERE english LIKE ? COLLATE NOCASE
        LIMIT 5
      ),
      similar_matches AS (
        SELECT english as en, mauritian as mu, 'similar' as type
        FROM dictionary
        WHERE english LIKE ? COLLATE NOCASE
          AND english NOT LIKE ?
        LIMIT 5
      )
      SELECT * FROM direct_matches
      UNION ALL
      SELECT * FROM similar_matches`,
    args: [`${query}%`, `%${query}%`, `${query}%`],
  });

  return result.rows as unknown as Translation[];
}
