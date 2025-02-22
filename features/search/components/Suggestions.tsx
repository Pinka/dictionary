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
  return (
    <div className="relative w-full">
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div className="absolute inset-0" />
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
          <Command className="rounded-xl border shadow-md bg-white/90 backdrop-blur-sm">
            <CommandList className="max-h-[300px] py-2">
              <CommandEmpty className="py-6 text-sm text-muted-foreground">
                No results found.
              </CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.word}
                      value={suggestion.word}
                      onSelect={() => onSelect(suggestion)}
                      className="px-4 py-2 mx-2 rounded-lg aria-selected:bg-accent/50"
                    >
                      <div className="flex w-full justify-between items-center gap-2">
                        <span className="font-medium">{suggestion.word}</span>
                        {suggestion.translation && (
                          <span className="text-sm text-muted-foreground">
                            {suggestion.translation}
                          </span>
                        )}
                      </div>
                      {suggestion.type === "similar" && (
                        <span className="text-xs text-muted-foreground">
                          Similar word
                        </span>
                      )}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
