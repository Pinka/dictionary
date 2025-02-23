"use server";

import { db } from "@/lib/db";

export async function saveSearch(word: string) {
  if (String(word).trim() === "") return;

  await db.execute({
    sql: "INSERT INTO searches (word) VALUES (?)",
    args: [word],
  });
}
