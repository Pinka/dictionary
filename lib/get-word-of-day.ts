import wordList from "@/app/word-of-day-list.json";

type WordOfDay = {
  word: string;
  desc: string;
};

type WordList = {
  [key: string]: WordOfDay;
};

const DEFAULT_WORD: WordOfDay = {
  word: "perseverance",
  desc: "Continuing despite difficulties; not giving up",
};

export function getWordOfDay(): WordOfDay {
  const today = new Date().toISOString().split("T")[0];
  const typedWordList = wordList as WordList;

  return typedWordList[today] ?? DEFAULT_WORD;
}
