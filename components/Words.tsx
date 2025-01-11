"use client";
import React, { useId, useRef, useEffect, useState, Suspense } from "react";
import { VariableSizeList as List, VariableSizeList } from "react-window";
import { renderToString } from "react-dom/server";
import { Word } from "./Word";
import dictionary from "@/app/dictionary.json";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { Toast } from "@/components/ui/toast";
import { SuggestionForm } from "./SuggestionForm";

let queryTimer: NodeJS.Timeout;

export const Words: React.FC = () => {
  return (
    <Suspense>
      <WordsImpl />
    </Suspense>
  );
};

export const WordsImpl: React.FC = () => {
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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

    window.addEventListener("resize", updateListHeight, { passive: true });

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
      router.push(`?${newParams.toString()}`);
    }, 500);
  };

  return (
    <>
      <div className="absolute inset-x-0">
        <header className="sticky top-0 z-10 backdrop-blur-[1px] p-2">
          <Input
            className="bg-neutral-200/60"
            placeholder={`Search ${(dictionary.length / 1000).toFixed(
              1
            )}K+ Mauritian Creole words...`}
            type="text"
            maxLength={100}
            defaultValue={currentSearch}
            onChange={handleSearchChange}
          />

          <div className="w-full mt-2">
            <SuggestionForm
              onSuccess={(message) => setToast({ message, type: "success" })}
              onError={(message) => setToast({ message, type: "error" })}
            />
          </div>
        </header>

        <div
          ref={containerRef}
          className="h-[calc(100vh-100px)] relative"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {listHeight > 0 && (
            <List
              ref={listRef}
              height={listHeight}
              itemCount={filteredWords.length}
              itemSize={getItemHeight}
              width="100%"
              style={{
                overflowX: "hidden",
                paddingLeft: "calc(50vw - 50%)",
                paddingRight: "calc(50vw - 50%)",
                marginBottom: "-2px",
              }}
            >
              {({ index, style }) => (
                <div
                  style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: 0,
                  }}
                >
                  <div className="w-full max-w-sm px-2">
                    <Word
                      highlight={currentSearch}
                      word={{
                        id: newId + index,
                        contentEn: filteredWords[index].en,
                        contentMu: filteredWords[index].mu,
                      }}
                    />
                  </div>
                </div>
              )}
            </List>
          )}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
