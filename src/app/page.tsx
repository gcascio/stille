'use client'

import { AddFeedButton } from "@/components/add-feed-button";
import { FeedListSkeleton } from "@/components/feed-list-skeleton";
import { HOME_ID, useStore } from "@/lib/store";
import { useQueries } from "@tanstack/react-query";
import { unstable_noStore as noStore } from "next/cache";
import type { RssFeed, RssItem } from "./api/feed/[url]/route";

const fetchFeed = async (url: string) => {
  const response = await fetch(`/api/feed/${encodeURIComponent(url)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch feed');
  }

  return response.json() as Promise<RssFeed>;
};

export default function Home() {
  noStore();
  const storeHasHydrated = useStore((state) => state.hasHydrated);
  const selectedFeedGroup = useStore((state) => state.selectedFeedGroup);
  const maxEntriesShown = useStore((state) => state.settings.maxEntriesShown);
  const sorting = useStore((state) => state.settings.sort);
  const feedGroup = useStore((state) => state.feedGroups[selectedFeedGroup.groupId])!;
  const isGroup = !selectedFeedGroup.feedUrl;

  const feedUrls = selectedFeedGroup.feedUrl
    ? [selectedFeedGroup.feedUrl]
    : feedGroup.feeds.map((feed) => feed.feedUrl);

  const results = useQueries({
    queries: feedUrls.map((url) => (
      { queryKey: ['feed', url], queryFn: () => fetchFeed(url), staleTime: Infinity }
    )),
  })

  if (storeHasHydrated && feedUrls.length <= 0) {
    return <Onboarding />;
  }

  const feedCount = feedUrls.length
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

  return (
    <div className="py-6 h-full lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
      <div className="relative mx-auto w-full min-w-0 grid grid-cols-1 gap-5 h-fit">
        {storeHasHydrated && loadedResults.length !== feedCount && (
          <div className="absolute animate-fade-in transition-opacity -top-6 w-full text-center text-muted-foreground">
            <div className="animate-pulse">
            Loaded
            {` `}
            <span className="tracking-widest">
              {`${loadedResults.length}/${feedCount}`}
            </span>
            </div>
          </div>
        )}
        {loadedResults.length === 0 || !storeHasHydrated
          ? <FeedListSkeleton />
          : sortedData.map((item) => <FeedItem key={item.link} item={item} />)
        }
      </div>
    </div>
  );
}

const FeedItem = ({ item }: { item: RssItem & { feedTitle: string } }) => (
  <div key={`${item.link}`}>
    <p className="text-xs mb-1">
      {item.feedTitle}
    </p>
    <a href={item.link} className="visited:text-muted-foreground">
      <h2 className="text-2xl font-semibold leading-none tracking-tight">{item.title}</h2>
    </a>
    <div className="flex gap-2">
      <p className="text-xs mt-2">
        {new Date(item.isoDate).toLocaleString()}
      </p>
      {item.comments && (
        <a href={item.comments} className="text-xs mt-2">
          comments
        </a>
      )}
    </div>
  </div>
)

const Onboarding = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-2xl font-semibold leading-none tracking-tight text-center mb-6">
      Welcome to stille
    </h1>
    <p className="text-center">
      stille is a web based RSS reader aimed at reducing distractions and focusing on the content.
      <br />
      Get started right away and add your first feed.
    </p>
    <p className="mt-6 text-center">
      <AddFeedButton groupId={HOME_ID} asIcon={false} withSuggestions />
    </p>
  </div>
);

