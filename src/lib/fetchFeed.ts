import type { RssFeed } from "./types";

export const fetchFeed = async (url: string) => {
  const response = await fetch(`/api/feed/${encodeURIComponent(url)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch feed');
  }

  return response.json() as Promise<RssFeed>;
};