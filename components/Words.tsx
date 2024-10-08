"use client";
import React, { useId, useRef, useEffect, useState } from "react";
import { VariableSizeList as List, VariableSizeList } from "react-window";
import { renderToString } from "react-dom/server";
import { Word } from "./Word";
import dictionary from "@/app/dictionary.json";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation"; // Import hooks for search params

let queryTimer: NodeJS.Timeout;

export const Words: React.FC = () => {
  const [listHeight, setListHeight] = useState<number>(0);
  const [filteredWords, setFilteredWords] = useState<
    (typeof dictionary)[number][]
  >([]);
  const newId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const searchRef = useRef<string>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") ?? "";
  if (currentSearch !== searchRef.current) {
    searchRef.current = currentSearch;
    setFilteredWords(
      dictionary.filter((i) => {
        if (searchRef.current) {
          return (
            i.en.toLowerCase().includes(searchRef.current.toLowerCase()) ||
            i.mu.toLowerCase().includes(searchRef.current.toLowerCase())
          );
        }
        return true;
      })
    );
  }

  const getItemHeight = (index: number) => {
    const word = filteredWords[index];
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.visibility = "hidden";
    tempContainer.style.width = "100%";
    tempContainer.style.padding = "0.25rem";
    tempContainer.style.boxSizing = "border-box";

    const renderedWord = renderToString(
      <Word
        word={{ id: newId + index, contentEn: word.en, contentMu: word.mu }}
      />
    );

    tempContainer.innerHTML = renderedWord;
    document.body.appendChild(tempContainer);

    const height = tempContainer.clientHeight;
    document.body.removeChild(tempContainer);

    return height;
  };

  const updateListHeight = () => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      setListHeight(height);
    }

    if (listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  };

  useEffect(() => {
    updateListHeight();

    window.addEventListener("resize", updateListHeight);

    return () => {
      window.removeEventListener("resize", updateListHeight);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    clearTimeout(queryTimer);

    queryTimer = setTimeout(() => {
      const newParams = new URLSearchParams(window.location.search);
      if (search) {
        newParams.set("q", search);
      } else {
        newParams.delete("q");
      }
      console.log(newParams);
      router.push(`?${newParams.toString()}`);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-2 break-all h-full px-1">
      <div className="flex w-full flex-row pt-2">
        <Input
          className="bg-neutral-200/90"
          placeholder="Search..."
          type="text"
          maxLength={100}
          defaultValue={currentSearch}
          onChange={handleSearchChange}
        />
      </div>
      <div ref={containerRef} className="flex-1 w-full">
        {listHeight > 0 && (
          <List
            ref={listRef}
            height={listHeight}
            itemCount={filteredWords.length}
            itemSize={getItemHeight}
            width="100%"
          >
            {({ index, style }) => (
              <div style={style}>
                <Word
                  word={{
                    id: newId + index,
                    contentEn: filteredWords[index].en,
                    contentMu: filteredWords[index].mu,
                  }}
                />
              </div>
            )}
          </List>
        )}
      </div>
    </div>
  );
};
