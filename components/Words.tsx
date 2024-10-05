"use client";
import React, { useId, useMemo, useRef, useEffect, useState } from "react";
import { VariableSizeList as List } from "react-window";
import { renderToString } from "react-dom/server"; // Import renderToString
import { Word } from "./Word";
import dictionary from "@/private/dictionary.json";
import { Input } from "@/components/ui/input";

export const Words: React.FC = () => {
  const [search, setSearch] = React.useState<string | null>(null);
  const [listHeight, setListHeight] = useState<number>(0);

  const newId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Function to get the height of each item dynamically
  const getItemHeight = (index: number) => {
    const word = filteredWords[index];

    // Create a temporary container to measure the height
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.visibility = "hidden";
    tempContainer.style.width = "100%"; // Set to full width to mimic layout
    tempContainer.style.padding = "0.25rem"; // Adjust as needed
    tempContainer.style.boxSizing = "border-box"; // Include padding and borders in the height

    // Create the HTML string using renderToString
    const renderedWord = renderToString(
      <Word
        word={{ id: newId + index, contentEn: word.en, contentMu: word.mu }}
      />
    );

    // Set the inner HTML of the temporary container
    tempContainer.innerHTML = renderedWord;

    // Append the temporary container to the body
    document.body.appendChild(tempContainer);

    const height = tempContainer.clientHeight; // Get the calculated height
    document.body.removeChild(tempContainer); // Clean up

    return height; // Return the calculated height
  };

  // Row renderer for the list
  const Row = React.memo(function Row({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) {
    const word = filteredWords[index];
    return (
      <div style={style}>
        <Word
          word={{ id: newId + index, contentEn: word.en, contentMu: word.mu }}
        />
      </div>
    );
  });

  // // Memoize the Row component to prevent unnecessary re-renders
  // const memoizedRow = React.memo(Row, (prevProps, nextProps) => {
  //   return prevProps.index === nextProps.index;
  // }, [filteredWords, newId]);

  // Function to update the height of the list
  const updateListHeight = () => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      setListHeight(height);
    }
  };

  // Calculate the height of the list when the component mounts or updates
  useEffect(() => {
    updateListHeight(); // Set initial height

    // Event listener to handle window resize
    window.addEventListener("resize", updateListHeight);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateListHeight);
    };
  }, []); // Run only once on mount

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
            itemSize={getItemHeight} // Use the function to get the dynamic height
            width="100%"
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
};
