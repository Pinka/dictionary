import { getWordOfDay } from "@/lib/get-word-of-day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function WordOfTheDay() {
  const word = await getWordOfDay();

  if (!word) return null;

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span>Word of the Day</span>
          <span className="text-sm text-muted-foreground font-normal">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">{word.word}</div>
          <div className="text-muted-foreground text-sm italic">
            {word.desc}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
