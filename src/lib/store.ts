import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { z } from 'zod';
import { MAX_FEED_LENGTH } from '@/constants';

export interface StoreError {
  code: 'FEED_ALREADY_IN_GROUP';
  message?: string;
}

export interface Feed {
  name: string;
  feedUrl: string;
  feedIconUrl?: string;
}

export interface FeedGroup {
  id: string;
  position: number;
  name: string;
  feeds: Array<Feed>;
}

export interface Settings {
  maxEntriesShown: number;
  sort: 'default' | 'newest';
}

export interface AppState {
  version: number;
  hasHydrated: boolean;
  settings: Settings;
  feedGroups: Record<FeedGroup['id'], FeedGroup>;
  selectedFeedGroup: {
    groupId: string;
    feedUrl?: string;
  };
  setHasHydrated: (state: boolean) => void;
  updateMaxEntriesShown: (maxEntriesShown: number) => void;
  updateSorting: (sorting: Settings['sort']) => void;
  getSelectedFeedGroup: () => FeedGroup & { selectedFeedUrl?: string; };
  selectFeedGroup: (groupId: FeedGroup['id'], feedUrl?: string) => void;
  addFeedGroup: (name: FeedGroup['name']) => void;
  deleteFeedGroup: (groupId: FeedGroup['id']) => void;
  updateFeedGroup: (groupId: FeedGroup['id'], feedGroup: Partial<Pick<FeedGroup, 'name'>>) => void;
  addFeedToGroup: (groupId: FeedGroup['id'], feed: Feed) => void | StoreError;
  removeFeedFromGroup: (groupId: FeedGroup['id'], feed: Feed) => void;
  updateFeed: (groupId: FeedGroup['id'], feed: Feed, updateFeed: Partial<Pick<Feed, 'name'>>) => void;
}

const updateFeedGroupSchema = z
  .object({
    name: z.string().optional(),
  })
  .partial()
  .refine(
    data => data.name,
    'Empty update.',
  );

const updateFeedSchema = z
  .object({
    name: z.string().optional(),
  })
  .partial()
  .refine(
    data => data.name,
    'Empty update.',
  );

export const HOME_ID = 'home';


export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      version: 1,
      hasHydrated: false,
      selectedFeedGroup: {
        groupId: HOME_ID,
      },
      settings: {
        maxEntriesShown: MAX_FEED_LENGTH,
        sort: 'newest',
      },
      feedGroups: {
        [HOME_ID]: {
          id: HOME_ID,
          name: 'Home',
          position: 0,
          feeds: [],
        } 
      },
      setHasHydrated: (state) => set({ hasHydrated: state }),
      updateMaxEntriesShown: (value) => {
        let maxEntriesShown = value;

        if (maxEntriesShown < 1) {
          maxEntriesShown = 1;
        };

        if(maxEntriesShown > MAX_FEED_LENGTH) {
          maxEntriesShown = MAX_FEED_LENGTH;
        };

        set((state) => ({ settings: { ...state.settings , maxEntriesShown } }))
      },
      updateSorting: (sort) => {
        set((state) => ({ settings: { ...state.settings , sort } }))
      },
      getSelectedFeedGroup: () => {
        const selectedGroup = get().selectedFeedGroup;
        const feedGroup = get().feedGroups[selectedGroup.groupId]!;

        return {
          ...feedGroup,
          selectedFeedUrl: selectedGroup.feedUrl,
          feeds: selectedGroup.feedUrl ? [{ name: '', feedUrl: selectedGroup.feedUrl }] : feedGroup.feeds,
        };
      },
      selectFeedGroup: (groupId, feedUrl) => set((state) => {
        const feedGroup = state.feedGroups[groupId];
        
        if (!feedGroup) return state;
      
        const feedIsNotInGroup = feedUrl && !feedGroup.feeds.some((feed) => feed.feedUrl === feedUrl);

        if (feedIsNotInGroup) return state;

        return {
          ...state,
          selectedFeedGroup: {
            groupId,
            feedUrl,
          }
        }
      }),
      addFeedGroup: (name) => set((state) => {
        const id = nanoid();
        const position = Object.keys(state.feedGroups).length;

        return {
          ...state,
          feedGroups: {
            ...state.feedGroups,
            [id]: {
              id,
              position,
              name,
              feeds: [],
            }
          }
        }
      }),
      deleteFeedGroup: (id) => set((state) => {
        if (id === HOME_ID) return state;

        const { [id]: deletedGroup, ...feedGroups } = state.feedGroups

        if (!deletedGroup) return state;

        return {
          ...state,
          feedGroups: {
            ...feedGroups,
          },
          selectedFeedGroup: id === state.selectedFeedGroup.groupId
            ? { groupId: HOME_ID }
            : state.selectedFeedGroup,
        }
      }),
      updateFeedGroup: (id, feedGroupUpdate) => set((state) => {
        const parsedFeedGroupUpdate = updateFeedGroupSchema.safeParse(feedGroupUpdate);

        if (!parsedFeedGroupUpdate.success) return state;

        const currentFeedGroup = state.feedGroups[id];

        if (!currentFeedGroup) return state;

        return {
          ...state,
          feedGroups: {
            ...state.feedGroups,
            [id]: {
              ...currentFeedGroup,
              ...parsedFeedGroupUpdate.data,
            }
          }
        }
      }),
      addFeedToGroup: (groupId, feed) => {
        let error: StoreError | null = null;

        set((state) => {
          const feedGroup = state.feedGroups[groupId];
        
          if (!feedGroup) return state;
      
          const feedIsInGroup = feedGroup.feeds.some(({ feedUrl }) => feedUrl === feed.feedUrl);
        
          if (feedIsInGroup) {
            error = {
              code: 'FEED_ALREADY_IN_GROUP',
              message: 'A feed with this URL is already in the group',
            };
            return state
          };
      
          return {
            ...state,
            feedGroups: {
              ...state.feedGroups,
              [groupId]: {
                ...feedGroup,
                feeds: [
                  ...feedGroup.feeds,
                  feed,
                ]
              }
            }
          }
        })

        if (error) return error;
      },
      removeFeedFromGroup: (groupId, feed) => set((state) => {
        const feedGroup = state.feedGroups[groupId];

        if (!feedGroup) return state;

        const filteredFeeds = feedGroup.feeds.filter(({ feedUrl }) => feedUrl !== feed.feedUrl);

        const selectedFeedDeleted = state.selectedFeedGroup.groupId === groupId && state.selectedFeedGroup.feedUrl === feed.feedUrl;

        return {
          ...state,
          feedGroups: {
            ...state.feedGroups,
            [groupId]: {
              ...feedGroup,
              feeds: [
                ...filteredFeeds,
              ]
            }
          },
          selectedFeedGroup: selectedFeedDeleted
            ? { groupId: HOME_ID }
            : state.selectedFeedGroup,
        }
      }),
      updateFeed: (groupId, feed, feedUpdate) => set((state) => {
        const parsedFeedUpdate = updateFeedSchema.safeParse(feedUpdate);

        if (!parsedFeedUpdate.success) return state;

        const feedGroup = state.feedGroups[groupId];

        if (!feedGroup) return state;

        const index = feedGroup.feeds.findIndex(({ feedUrl }) => feedUrl === feed.feedUrl);

        if (index < 0) return state;

        const head = feedGroup.feeds.slice(0, index);
        const currentFeed = feedGroup.feeds[index];
        const tail = feedGroup.feeds.slice(index + 1, feedGroup.feeds.length);

        if (!currentFeed) return state;

        return {
          ...state,
          feedGroups: {
            ...state.feedGroups,
            [groupId]: {
              ...feedGroup,
              feeds: [
                ...head,
                {
                  ...currentFeed,
                  ...feedUpdate,
                },
                ...tail,
              ]
            }
          }
        }
      }),
    }),
    {
      name: 'app-state',
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.setHasHydrated(true)
      }
    },
  )
)
