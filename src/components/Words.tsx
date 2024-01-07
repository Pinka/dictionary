import React from "react";
import { api } from "~/utils/api";
import { type FullRecord, Word } from "./Word";
// import { Tags } from "./Tags";
import LoadingIcon from "./LoadingIcon";

export const Words: React.FC = () => {
  const [search, setSearch] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<number[]>([]);

  const apiContext = api.useContext();

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    api.words.getAll.useInfiniteQuery(
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

  // const { data: tagsList } = api.tags.getAll.useQuery();

  // const onTagSelect = (selectedTags: number[]) => {
  //   setSelectedTags(selectedTags);
  // };

  const onWordUpdate = (record: FullRecord) => {
    apiContext.words.getAll.setInfiniteData(
      { search, tags: selectedTags },
      (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...data,
          pages: data.pages.map((page) =>
            page.map((item) => (item.id === record.id ? record : item))
          ),
        };
      }
    );
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
          placeholder="Search..."
          className="input-bordered input w-full rounded-sm placeholder:italic"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* <Tags
        className="px-2"
        tags={tagsList}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
      /> */}
      {data?.pages
        .flatMap((p) => p)
        .flatMap((word) => (
          <Word key={word.id} word={word} onChange={onWordUpdate} />
        ))}
      {isFetching && (
        <div className="flex w-full justify-center p-4" role="status">
          <LoadingIcon />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};
