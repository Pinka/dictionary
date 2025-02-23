"use client";

import { getRecentSearches, RecentSearch } from "@/lib/recent-searches";
import { useEffect, useState } from "react";

interface RecentSearchesProps {
  onSelect?: (word: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  if (!recentSearches.length) return null;

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
      <ul className="space-y-2">
        {recentSearches.map((search) => (
          <li
            key={`${search.word}-${search.timestamp}`}
            className="hover:bg-gray-200 p-2 rounded cursor-pointer"
            onClick={() => onSelect?.(search.word)}
          >
            <div className="flex w-full justify-between items-center gap-2">
              <span className="font-medium">{search.word}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
