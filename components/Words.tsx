"use client";
import React, { useId, useMemo, useRef, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { Word } from "./Word";
import dictionary from "@/private/dictionary.json";
import { Input } from "@/components/ui/input";

export const Words: React.FC = () => {
  const [search, setSearch] = React.useState<string | null>(null);
  const [listHeight, setListHeight] = useState<number>(0); // State to hold the height of the list

  const newId = useId();
  const containerRef = useRef<HTMLDivElement>(null); // Reference for the container

  const filteredWords = useMemo(
    () =>
      dictionary.filter((i) => {
        if (search) {
          return i.en.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      }),
    [search]
  );

  // Row renderer for the list
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const word = filteredWords[index];
    return (
      <div style={style}>
        <Word
          word={{ id: newId + index, contentEn: word.en, contentMu: word.mu }}
        />
      </div>
    );
  };

  // Calculate the height of the list when the component mounts or updates
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      setListHeight(height);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-stretch gap-2 break-all h-full">
      <div className="flex w-full flex-row pt-2">
        <Input
          placeholder="Search..."
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div ref={containerRef} className="flex-grow w-full">
        {listHeight > 0 && ( // Only render the list if we have a valid height
          <List
            height={listHeight} // Use the calculated height
            itemCount={filteredWords.length}
            itemSize={70} // Adjust the height of each item if needed
            width="100%"
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
};
