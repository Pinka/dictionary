"use client";
import React, { useId, useRef, useEffect, useState, Suspense } from "react";
import { VariableSizeList as List, VariableSizeList } from "react-window";
import { renderToString } from "react-dom/server";
import { Word } from "./Word";
import dictionary from "@/app/dictionary.json";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation"; // Import hooks for search params
import { submitWord } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { cn } from "@/lib/utils"; // You'll need this utility for className merging
import { Toast } from "@/components/ui/toast";

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
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState(false);
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

  useEffect(() => {
    if (isFormExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormExpanded]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await submitWord({
        mauritian: formData.get("mauritian") as string,
        english: formData.get("english") as string,
      });
      if (result.success) {
        if (formRef.current) {
          formRef.current.reset();
          setIsFormExpanded(false);
        }
        setToast({
          message: "Thank you! Your word suggestion has been submitted.",
          type: "success",
        });
      } else {
        setFormError(true);
        setToast({
          message: result.error || "Failed to submit suggestion",
          type: "error",
        });
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch {
      setFormError(true);
      setToast({
        message: "An error occurred while submitting your suggestion",
        type: "error",
      });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 break-all h-full px-1">
        <div className="flex w-full flex-col gap-2 pt-2">
          <Input
            className="bg-neutral-200/90"
            placeholder={`Search more than${Math.floor(
              dictionary.length / 1000
            )} thousand words...`}
            type="text"
            maxLength={100}
            defaultValue={currentSearch}
            onChange={handleSearchChange}
          />

          <div className="w-full">
            <div className="rounded-sm bg-neutral-200/90 p-1">
              <button
                type="button"
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                className="flex w-full items-center gap-2 text-sm font-medium text-black hover:text-neutral-700 transition-colors px-2"
                aria-expanded={isFormExpanded}
                aria-controls="suggestion-form"
              >
                <span className="text-lg" aria-hidden="true">
                  {isFormExpanded ? "−" : "+"}
                </span>
                Suggest a word
              </button>

              <form
                ref={formRef}
                id="suggestion-form"
                action={handleSubmit}
                className={cn(
                  "grid grid-rows-[0fr] overflow-hidden transition-all duration-300 ease-out",
                  isFormExpanded && "grid-rows-[1fr]"
                )}
                aria-hidden={!isFormExpanded}
              >
                <div className="min-h-0">
                  <div
                    className={cn(
                      "flex flex-col gap-3 p-1 opacity-0 transition-opacity duration-200",
                      isFormExpanded && "opacity-100"
                    )}
                  >
                    <Input
                      ref={inputRef}
                      type="text"
                      name="mauritian"
                      id="mauritian"
                      required
                      autoComplete="off"
                      className={cn(
                        "bg-white/90",
                        formError && "border-red-500"
                      )}
                      placeholder="Enter word in Mauritian Creole"
                      aria-label="Mauritian Creole word"
                      onChange={() => setFormError(false)}
                    />
                    <Input
                      type="text"
                      name="english"
                      id="english"
                      required
                      autoComplete="off"
                      className={cn(
                        "bg-white/90",
                        formError && "border-red-500"
                      )}
                      placeholder="Enter English translation"
                      aria-label="English translation"
                      onChange={() => setFormError(false)}
                    />
                    <SubmitButton />
                  </div>
                </div>
              </form>
            </div>
          </div>
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
                    highlight={currentSearch}
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
