import { getWordOfDay } from "@/lib/get-word-of-day";

export async function WordOfTheDay() {
  const wordOfDay = await getWordOfDay();

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Word of the Day</h2>
      <div>
        <p className="font-bold">{wordOfDay.word}</p>
        <p className="text-gray-600 italic">{wordOfDay.desc}</p>
      </div>
    </div>
  );
}
