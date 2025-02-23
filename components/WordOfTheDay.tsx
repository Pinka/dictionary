import { getWordOfDay } from "@/lib/get-word-of-day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function WordOfTheDay() {
  const word = await getWordOfDay();

  if (!word) return null;

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <CardTitle>Word of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="font-semibold">{word.word}</div>
          <div className="text-muted-foreground">{word.desc}</div>
        </div>
      </CardContent>
    </Card>
  );
}
