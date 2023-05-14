import React from "react";
import { api } from "~/utils/api";
import { Word } from "./Word";
import { Tags } from "./Tags";

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
    refetch,
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

  const onWordChange = () => {
    refetch().catch((e) => {
      console.error(e);
    });
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
          <Word key={word.id} word={word} onChange={onWordChange} />
        ))}
    </div>
  );
};
