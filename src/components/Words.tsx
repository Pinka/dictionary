import { type Record, Tag } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { type MouseEventHandler } from "react";
import { api } from "~/utils/api";
import clsx from "clsx";

export const Words: React.FC = () => {
  const [search, setSearch] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<number[]>([]);

  const {
    // status,
    data,
    // isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.words.getAll.useInfiniteQuery(
    {
      search,
      tags: selectedTags,
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
      getNextPageParam: (lastPage) => {
        return lastPage && lastPage[lastPage.length - 1]?.id;
      },
      initialCursor: 0, // <-- optional you can pass an initialCursor
    }
  );

  const { data: tagsList } = api.tags.getAll.useQuery();

  const onTagSelect = (selectedTags: number[]) => {
    setSelectedTags(selectedTags);
  };

  // fetch next page when the user scrolls to the bottom of the list
  React.useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const handleScroll = () => {
      const currentScroll =
        window.innerHeight + document.documentElement.scrollTop;

      const maxScroll = document.documentElement.offsetHeight - 2000;

      if (currentScroll >= maxScroll) {
        fetchNextPage().catch((e) => {
          console.error(e);
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col items-center justify-items-stretch gap-2 break-all">
      <div className="flex w-full flex-row pt-2">
        <input
          placeholder="Search"
          className="input-bordered input w-full"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
        <i className="flex flex-row justify-center p-3 align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </i>
      </div>
      <Tags
        className="px-2"
        tags={tagsList}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
      />
      {data?.pages
        .flatMap((p) => p)
        .flatMap((word) => (
          <Word key={word.id} word={word} />
        ))}
    </div>
  );
};

const Word: React.FC<{ word: Record & { tags: Tag[] } }> = ({ word }) => {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <div className="flex w-full flex-row justify-between bg-base-200 px-2 pb-2">
      <div className="fkex flex-1 flex-col">
        <p>
          <span className="text-xs font-bold">{word.contentMu}</span>
          <br />
          <span className="text-xs">{word.contentEn}</span>
        </p>
        <Tags className="pt-4" tags={word.tags} />
      </div>
      <i className="mr-3 flex flex-none flex-col justify-center align-middle">
        {word.audioMuUrl ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        ) : (
          isSignedIn && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          )
        )}
      </i>
    </div>
  );
};

const Tags: React.FC<{
  className?: string;
  tags?: Tag[];
  selectedTags?: number[];
  onTagSelect?: (selectedTags: number[]) => void;
}> = ({ className, tags, selectedTags, onTagSelect }) => {
  const onToggleTag = (tag: Tag) => {
    if (!tags) return;

    if (selectedTags?.some((id) => id === tag.id)) {
      onTagSelect?.(selectedTags.filter((id) => id !== tag.id));
    } else {
      onTagSelect?.([...(selectedTags ?? []), tag.id]);
    }
  };

  return (
    <div className={clsx("flex w-full flex-row gap-2", className)}>
      {tags?.map((tag) => (
        <Tag
          key={tag.id}
          isSelected={selectedTags?.some((id) => id === tag.id) ?? false}
          onClick={onTagSelect ? () => onToggleTag(tag) : undefined}
        >
          {tag.name}
        </Tag>
      ))}
    </div>
  );
};

const Tag: React.FC<{
  isSelected: boolean;
  children: React.ReactNode;
  onClick?: MouseEventHandler;
}> = ({ isSelected, children, onClick }) => {
  return (
    <button
      type="button"
      className={clsx("h-6 bg-base-300 px-2 text-xs", {
        "border-2 border-solid border-black": isSelected,
        "cursor-default": !onClick,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
