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

export type ShareableFeedStoreSchema = z.infer<typeof shareableFeedStoreSchema>;