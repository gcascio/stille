import { z } from "zod";
import type { FeedEntry, FeedGroup } from "./store";
import { feedGroupCsvEntrySchema, type BookmarkCsvEntry, type FeedGroupCsvEntry, bookmarkCsvEntrySchema } from "./validation";

export const readCsv = <T extends FeedGroupCsvEntry | BookmarkCsvEntry>(csv: string) => {
  const lines = csv.split('\n');
  const result: T[] = [];
  const headers = lines[0] ? lines[0].split(',') : [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {} as Record<string, unknown>;
    const currentLine = lines[i]?.split(',') ?? [];

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]?.trim();

      if (!header) {
        continue
      }

      obj[header] = currentLine[j]?.trim();
    }

    result.push(obj as T);
  }

  return result;
}

const feedGroupsToCsv = (feedGroups: Record<FeedGroup['id'], FeedGroup>) => {
  const flatFeedGroups: FeedGroupCsvEntry[] = Object.values(feedGroups)
    .map((feedGroup) => feedGroup.feeds.map((feed) => ({
      groupId: feedGroup.id,
      group: feedGroup.name,
      groupPosition: feedGroup.position,
      feed: feed.name,
      feedUrl: feed.feedUrl,
    })))
    .flat();

  if (flatFeedGroups.length === 0) return null;

  const header = Object.keys(flatFeedGroups[0]!).join(',');
  const rows = flatFeedGroups.map((obj) => Object.values(obj).join(',')).join('\n');

  return `${header}\n${rows}`;
}

export const feedGroupsFromCsv = (csvString: string) => {
  const csv = readCsv<FeedGroupCsvEntry>(csvString);
  const feedGroups = {} as Record<FeedGroup['id'], FeedGroup>;
  const parsedFeedGroups = z.array(feedGroupCsvEntrySchema).safeParse(csv);

  if (!parsedFeedGroups.success || parsedFeedGroups.data.length === 0) return feedGroups;

  csv.forEach((feed) => {
    if (!feedGroups[feed.groupId]) {
      feedGroups[feed.groupId] = {
        id: feed.groupId,
        name: feed.group,
        position: feed.groupPosition,
        feeds: [],
      };
    }

    feedGroups[feed.groupId]?.feeds.push({
      name: feed.feed,
      feedUrl: feed.feedUrl,
    });
  });

  return feedGroups;
}

const bookmarksToCsv = (bookmarks: Array<FeedEntry>) => {
  const bookmarkEntries: BookmarkCsvEntry[] = bookmarks
    .map((bookmark) => ({
      feedTitle: bookmark.feedTitle,
      title: bookmark.title,
      link: bookmark.link,
    }));

  if (bookmarkEntries.length === 0) return null;

  const header = Object.keys(bookmarkEntries[0]!).join(',');
  const rows = bookmarkEntries.map((obj) => Object.values(obj).join(',')).join('\n');

  return `${header}\n${rows}`;
}

export const bookmarksFromCsv = (csvString: string) => {
  const csv = readCsv<BookmarkCsvEntry>(csvString);
  const bookmarks = [] as Array<FeedEntry>;
  const parsedBookmarks = z.array(bookmarkCsvEntrySchema).safeParse(csv);

  if (!parsedBookmarks.success || parsedBookmarks.data.length === 0) return bookmarks;

  // Check if the CSV has the required columns
  if (csv.length === 0 || !csv[0]?.link) return bookmarks;

  csv.forEach((bookmark) => {
    bookmarks.push(bookmark as FeedEntry);
  });
}

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const downloadFeedGroupsCsv = (feedGroups: Record<FeedGroup['id'], FeedGroup>) => {
  const csv = feedGroupsToCsv(feedGroups);

  if (!csv) return;

  downloadCSV(csv, 'stille-feed-groups.csv');
}

export const downloadBookmarksGroupsCsv = (bookmarks: Array<FeedEntry>) => {
  const csv = bookmarksToCsv(bookmarks);

  if (!csv) return;

  downloadCSV(csv, 'stille-bookmarks.csv');
}