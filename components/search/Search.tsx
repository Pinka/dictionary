"use client";

import { Suggestions } from "./Suggestions";
import { VoiceSearch } from "@/components/VoiceSearch";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSearch } from "@/app/actions/search";
import { Suspense, useRef } from "react";

let queryTimer: NodeJS.Timeout | undefined = undefined;

// Inner component that uses useSearchParams
const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("q") ?? "";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    clearTimeout(queryTimer);

    queryTimer = setTimeout(async () => {
      const newParams = new URLSearchParams(window.location.search);
      if (search) {
        newParams.set("q", search);
        saveSearch(search);
      } else {
        newParams.delete("q");
      }
      router.push(`?${newParams.toString()}`);
    }, 500);
  };

  const handleClear = () => {
    // Clear the input field value
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Update URL parameters
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("q");
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for a word..."
        className="w-full pl-4 pr-24 py-6 text-lg rounded-full"
        defaultValue={query}
        onChange={handleSearchChange}
        autoFocus
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <div className="relative flex gap-2">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 " />
            </Button>
          )}
          <VoiceSearch />
        </div>
      </div>
      {query.length > 1 && <Suggestions />}
    </div>
  );
};

// Wrapper component with Suspense
export const Search = () => {
  return (
    <Suspense
      fallback={
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a word..."
            className="w-full pl-4 pr-24 py-6 text-lg rounded-full"
            disabled
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="relative flex gap-2">
              <VoiceSearch />
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
};
