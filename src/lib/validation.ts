import { z } from "zod";

const feedEntrySchema = z.object({
  feedTitle: z.string(),
  title: z.string(),
  link: z.string(),
});

const feedSchema = z.object({
  name: z.string(),
  feedUrl: z.string(),
  feedIconUrl: z.string().optional(),
});

const feedGroupSchema = z.object({
  id: z.string(),
  position: z.number(),
  name: z.string(),
  feeds: z.array(feedSchema),
});

export const shareableFeedStoreSchema = z.object({
  version: z.number(),
  feedGroups: z.record(feedGroupSchema),
  bookmarks: z.array(feedEntrySchema).optional(),
});

export const feedGroupCsvEntrySchema = z.object({
  groupId: z.string(),
  group: z.string(),
  groupPosition: z.number(),
  feed: z.string(),
  feedUrl: z.string(),
});

export const bookmarkCsvEntrySchema = z.object({
  feedTitle: z.string(),
  title: z.string(),
  link: z.string(),
});

export type ShareableFeedStoreSchema = z.infer<typeof shareableFeedStoreSchema>;

export type FeedGroupCsvEntry = z.infer<typeof feedGroupCsvEntrySchema>;

export type BookmarkCsvEntry = z.infer<typeof bookmarkCsvEntrySchema>;

