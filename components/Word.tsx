import React from "react";
import Highlighter from "react-highlight-words";
import page from "@/app/page";
console.log(page);

export type Record = {
  id: string;
  contentEn: string;
  contentMu: string | null;
};

export const Word: React.FC<{
  word: Record;
  highlight?: string;
  style?: React.CSSProperties;
}> = ({ word, highlight, style }) => {
  return (
    <div
      style={style}
      className={
        "flex w-full flex-col gap-2 rounded-sm bg-neutral-200/90 py-2 px-3 lg:py-3"
      }
    >
      <div className="flex w-full flex-row justify-between">
        <div className="fkex flex-1 flex-col">
          <p>
            <span className="text-xs lg:text-base font-bold">
              <Highlighter
                autoEscape
                searchWords={highlight?.split(" ") ?? []}
                textToHighlight={word.contentMu ?? ""}
              />
            </span>
            <br />
            <span className="text-xs lg:text-base">
              <Highlighter
                autoEscape
                searchWords={highlight?.split(" ") ?? []}
                textToHighlight={word.contentEn ?? ""}
              />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
