"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { Suggestions } from "./Suggestions";
import { VoiceSearch } from "@/components/VoiceSearch";
import { Input } from "@/components/ui/input";
import { addRecentSearch } from "@/lib/recent-searches";
import { X } from "lucide-react";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${debouncedQuery}`
        );
        const data = await response.json();
        setSuggestions(data);
        addRecentSearch(debouncedQuery);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for a word..."
        className="w-full pl-4 pr-24 py-6 text-lg rounded-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <div className="relative">
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-[44px] p-2 hover:bg-gray-100 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 " />
            </button>
          )}
          <VoiceSearch />
        </div>
      </div>
      {query.length > 1 && (
        <Suggestions
          isLoading={isLoading}
          suggestions={suggestions}
          onSelect={(suggestion) => {
            console.log(suggestion);
          }}
        />
      )}
    </div>
  );
};
