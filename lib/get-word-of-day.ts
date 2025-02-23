import { getWordOfDayFromDB, WordOfDay } from "./db";

const DEFAULT_WORD: WordOfDay = {
  word: "perseverance",
  desc: "Continuing despite difficulties; not giving up",
  date: new Date().toISOString().split("T")[0],
};

export async function getWordOfDay(): Promise<WordOfDay> {
  const word = await getWordOfDayFromDB();
  return word ?? DEFAULT_WORD;
}
