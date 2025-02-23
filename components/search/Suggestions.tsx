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
import { Loader2 } from "lucide-react";

interface Suggestion {
  word: string;
  type: "direct" | "similar" | "phrase";
  translation?: string;
}

interface SuggestionsProps {
  isLoading: boolean;
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
}

export function Suggestions({
  isLoading,
  suggestions,
  onSelect,
}: SuggestionsProps) {
  const similarSuggestions = suggestions.filter(
    (suggestion) => suggestion.type === "similar"
  );
  const directSuggestions = suggestions.filter(
    (suggestion) => suggestion.type === "direct"
  );

  return (
    <div className="w-full">
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div className="h-0" />
        </PopoverTrigger>
        <PopoverContent
          className="rounded-xl p-0 w-[var(--radix-popover-trigger-width)] max-w-none bg-white"
          align="start"
          sideOffset={8}
        >
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Command>
              <CommandList className="max-h-dvh py-2">
                <CommandEmpty>No results found.</CommandEmpty>
                {directSuggestions.length > 0 && (
                  <CommandGroup heading="Direct Matches" className="pb-2">
                    {directSuggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.word}
                        value={suggestion.word}
                        onSelect={() => onSelect(suggestion)}
                      >
                        <div className="flex w-full justify-between items-center gap-2">
                          <span className="font-medium">{suggestion.word}</span>
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
                {similarSuggestions.length > 0 && (
                  <>
                    <div className="h-px bg-border mx-2" />
                    <CommandGroup heading="Similar Words">
                      {similarSuggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.word}
                          value={suggestion.word}
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
                  </>
                )}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
