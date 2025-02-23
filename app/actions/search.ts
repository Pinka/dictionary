"use server";

import { db } from "@/lib/db";

export async function saveSearch(word: string) {
  const trimmedWord = String(word).trim();

  if (trimmedWord === "" || trimmedWord.length < 2) {
    return;
  }

  await db.execute({
    sql: "INSERT INTO searches (word) VALUES (?)",
    args: [word],
  });
}
