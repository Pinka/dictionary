"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveSearch } from "@/app/actions/search";
import { Loader2 } from "lucide-react";

interface Suggestion {
  word: string;
  type: "direct" | "similar" | "phrase";
  translation?: string;
}

export function Suggestions() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${query}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const similarSuggestions = suggestions.filter(
    (suggestion) => suggestion.type === "similar"
  );
  const directSuggestions = suggestions.filter(
    (suggestion) => suggestion.type === "direct"
  );

  const onSelect = async (suggestion: Suggestion) => {
    await saveSearch(suggestion.word);
  };

  const showLine = directSuggestions.length > 0;

  return (
    <div className="w-full">
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div className="h-0" />
        </PopoverTrigger>
        <PopoverContent
          className="rounded-2xl p-0 w-[var(--radix-popover-trigger-width)] max-w-none"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <Command className="rounded-2xl">
            <CommandList className="max-h-dvh py-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {directSuggestions.length > 0 && (
                    <CommandGroup heading="Direct Matches" className="pb-2">
                      {directSuggestions.map((suggestion) => (
                        <CommandItem
                          key={`${suggestion.word}-${suggestion.translation}`}
                          value={`${suggestion.word}-${suggestion.translation}`}
                          onSelect={() => onSelect(suggestion)}
                        >
                          <div className="flex w-full justify-between items-center gap-2">
                            <span className="font-medium">
                              {suggestion.word}
                            </span>
                            {suggestion.translation && (
                              <span className="text-sm text-muted-foreground">
                                {suggestion.translation}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {showLine && <div className="h-px bg-border mx-2" />}
                  {similarSuggestions.length > 0 && (
                    <CommandGroup heading="Similar Words">
                      {similarSuggestions.map((suggestion) => (
                        <CommandItem
                          key={`${suggestion.word}-${suggestion.translation}`}
                          value={`${suggestion.word}-${suggestion.translation}`}
                          onSelect={() => onSelect(suggestion)}
                        >
                          <div className="flex w-full justify-between items-center gap-2">
                            <span className="font-medium">
                              {suggestion.word}
                            </span>
                            {suggestion.translation && (
                              <span className="text-sm text-muted-foreground">
                                {suggestion.translation}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
