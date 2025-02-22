"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { Suggestions } from "./Suggestions";
import { VoiceSearch } from "@/components/VoiceSearch";
import { Input } from "@/components/ui/input";

export const SearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${debouncedQuery}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // if (suggestions.length === 0) {
  //   return null;
  // }

  return (
    <>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a word..."
          className="w-full pl-4 pr-12 py-6 text-lg rounded-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <VoiceSearch />
        </div>
      </div>
      {query.length > 2 && (
        <Suggestions
          isLoading={isLoading}
          suggestions={suggestions}
          onSelect={(suggestion) => {
            setQuery(suggestion.word);
            // Handle search submission
          }}
        />
      )}
    </>
  );
};
