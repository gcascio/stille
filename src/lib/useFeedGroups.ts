import { useQueries } from "@tanstack/react-query";
import { BOOKMARK_ID, useStore } from "./store";
import { fetchFeed } from "./fetchFeed";

export const useFeedGroups = () => {
  const selectedFeedGroup = useStore((state) => state.selectedFeedGroup);
  const maxEntriesShown = useStore((state) => state.settings.maxEntriesShown);
  const sorting = useStore((state) => state.settings.sort);
  const feedGroup = useStore((state) => state.feedGroups[selectedFeedGroup.groupId])!;
  const bookmarks = useStore((state) => state.bookmarks);

  const isGroup = !selectedFeedGroup.feedUrl;

  const feedUrls = selectedFeedGroup.feedUrl
    ? [selectedFeedGroup.feedUrl]
    : feedGroup.feeds.map((feed) => feed.feedUrl);

  const results = useQueries({
    queries: feedUrls.map((url) => (
      { 
        queryKey: ['feed', url],
        queryFn: () => fetchFeed(url),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    )),
  })

  if (selectedFeedGroup.groupId === BOOKMARK_ID) {
    return {
      loadedEntries: bookmarks,
      totalEntries: bookmarks.length,
    };
  }

  const loadedResults = results.filter((query) => !query.isLoading);

  const data = loadedResults
    .flatMap((query) => {
      if (!query.data) return [];

      const items = selectedFeedGroup.feedUrl
        ? query.data.items
        : query.data.items
          .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime())
          .slice(0, maxEntriesShown);

      return items
        .map((item) => ({ ...item, feedTitle: query.data.title }));
    });

  const sortedData = !isGroup && sorting === 'default'
    ? data
    : data.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());

  return {
    loadedEntries: sortedData,
    totalEntries: feedUrls.length,
    feedCount: feedUrls.length,
    loadedFeedCount: loadedResults.length,
  };
};
