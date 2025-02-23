"use client";

import { RecentSearch } from "@/app/actions/recent";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchRecentSearches = async () => {
    const response = await fetch("/api/searches/recent");
    const data = await response.json();
    setRecentSearches(data);
  };

  useEffect(() => {
    fetchRecentSearches();
  }, [searchParams]);

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
                key={`${search.word}-${search.timestamp}`}
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
