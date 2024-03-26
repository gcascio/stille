'use client'

import { AddFeedButton } from "@/components/add-feed-button";
import { FeedListSkeleton } from "@/components/feed-list-skeleton";
import { HOME_ID, BOOKMARK_ID, useStore } from "@/lib/store";
import type { RssItem } from "@/lib/types";
import { unstable_noStore as noStore } from "next/cache";
import { BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useFeedGroups } from "@/lib/useFeedGroups";

export default function Home() {
  noStore();
  const storeHasHydrated = useStore((state) => state.hasHydrated);
  const selectedFeedGroup = useStore((state) => state.selectedFeedGroup);
  const { loadedEntries, totalEntries, loadedFeedCount, feedCount } = useFeedGroups();

  if (storeHasHydrated && totalEntries <= 0) {
    return selectedFeedGroup.groupId === HOME_ID
      ? <Onboarding />
      : <EmptyGroup groupId={selectedFeedGroup.groupId} />;
  }

  return (
    <div className="py-6 h-full lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
      <div className="relative mx-auto w-full min-w-0 grid grid-cols-1 gap-5 h-fit">
        {storeHasHydrated && loadedFeedCount !== feedCount && (
          <div className="absolute animate-fade-in transition-opacity -top-6 w-full text-center text-muted-foreground">
            <div className="animate-pulse">
            Loaded
            {` `}
            <span className="tracking-widest">
              {`${loadedFeedCount}/${feedCount}`}
            </span>
            </div>
          </div>
        )}
        {loadedEntries.length === 0 || !storeHasHydrated
          ? <FeedListSkeleton />
          : loadedEntries.map((item) => <FeedItem key={item.link} item={item} />)
        }
      </div>
    </div>
  );
}

const FeedItem = ({ item }: { item: RssItem & { feedTitle: string } }) => {
  const isBookmarked = useStore((state) => state.isBookmarked(item));
  const bookmark = useStore((state) => state.bookmark);
  const removeBookmark = useStore((state) => state.removeBookmark);

  return (
    <div key={`${item.link}`}>
      <p className="text-xs mb-1">
        {item.feedTitle}
      </p>
      <a href={item.link} className="visited:text-muted-foreground">
        <h2 className="text-2xl font-semibold leading-none tracking-tight">{item.title}</h2>
      </a>
      <div className="flex gap-2 items-center mt-2">
        <p className="text-xs">
          {new Date(item.isoDate).toLocaleString()}
        </p>
        {item.comments && (
          <a href={item.comments} className="text-xs">
            comments
          </a>
        )}
        <Button
        className="text-muted-foreground"
        onClick={() => isBookmarked ? removeBookmark(item) : bookmark(item)}
        type="button"
        variant="ghost"
        size="xticon"
      >
        <BookmarkIcon size={12} fill={isBookmarked ? "currentColor" : "none"} />
      </Button>
      </div>
    </div>
  );
}

const Onboarding = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-2xl font-semibold leading-none tracking-tight text-center mb-6">
      Welcome to stille
    </h1>
    <p className="text-center max-w-lg">
      stille is a web based RSS reader aimed at reducing distractions and focusing on the content.
    </p>
    <p className="mt-6 text-center">
      <AddFeedButton groupId={HOME_ID} asIcon={false} withSuggestions />
    </p>
  </div>
);

const EmptyGroup = ({ groupId }: { groupId?: string }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-2xl font-semibold leading-none tracking-tight text-center">
      {groupId === BOOKMARK_ID ? `No bookmarks yet` : `No feeds in this group`}
    </h1>
    {groupId !== BOOKMARK_ID && (
      <p className="mt-6 text-center">
        <AddFeedButton groupId={HOME_ID} asIcon={false} withSuggestions />
      </p>
    )}
  </div>
);

