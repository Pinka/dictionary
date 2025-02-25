import { getRecentSearches } from "@/app/actions/recent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export async function RecentSearches() {
  const recentSearches = await getRecentSearches();

  if (!recentSearches.length) return null;

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <CardTitle>Recent Searches</CardTitle>
        {/* <CardDescription>Your latest search queries</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col w-full">
          {recentSearches.map((search) => (
            <li key={`${search.word}-${search.timestamp}`}>
              <Link
                href={`/?q=${encodeURIComponent(search.word)}`}
                className="text-muted-foreground w-full"
              >
                {search.word}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
