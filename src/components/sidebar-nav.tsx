"use client"

import { cn } from "@/lib/utils"
import { type Feed, useStore, HOME_ID, type FeedGroup } from "@/lib/store"
import { SquarePen, Trash2Icon } from "lucide-react"

import { AddFeedButton } from "./add-feed-button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"
import { UpdateGroupDialog } from "./update-group-dialog"
import { useState } from "react"
import { UpdateFeedDialog } from "./update-feed-dialog"
import { Button } from "./ui/button"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
}

export function SidebarNav() {
  const [editGroup, setEditGroup] = useState<FeedGroup>();
  const [editFeed, setEditFeed] = useState<{ groupId: string, feed: Feed }>();
  const feedGroups = useStore((state) => state.feedGroups);
  const deleteFeedGroup = useStore((state) => state.deleteFeedGroup);
  const removeFeedFromGroup = useStore((state) => state.removeFeedFromGroup);
  const selectFeedGroup = useStore((state) => state.selectFeedGroup);
  const selectedFeedGroup = useStore((state) => state.selectedFeedGroup);
  const groups = Object.values(feedGroups);

  return groups.length ? (
      <div className="w-full p-1">
        {groups.map((feedGroup, index) => (
          <div key={index} className={cn("pb-4")}>
            <div className="mb-1 rounded-md flex items-center justify-between gap-2">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Button
                    className="truncate font-semibold flex-1 justify-start"
                    onClick={() => selectFeedGroup(feedGroup.id)}
                    variant={!selectedFeedGroup.feedUrl && selectedFeedGroup.groupId === feedGroup.id ? 'secondary' : 'ghost'}
                  >
                    {feedGroup.name}
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem onSelect={() => setEditGroup(feedGroup)}>
                    <div className="flex gap-2">
                      <SquarePen size={18} />
                      Edit
                    </div>
                  </ContextMenuItem>
                  <ContextMenuItem
                    disabled={feedGroup.id === HOME_ID}
                    destructive asChild onSelect={() => deleteFeedGroup(feedGroup.id)}
                  >
                    <div className="flex gap-2">
                      <Trash2Icon size={18} />
                      Delete
                    </div>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <AddFeedButton groupId={feedGroup.id} />
            </div>
            {feedGroup.feeds?.length ? (
              <SidebarNavItems
                items={feedGroup.feeds}
                groupId={feedGroup.id}
                onDelete={removeFeedFromGroup}
                onUpdate={setEditFeed}
                onSelectGroup={selectFeedGroup}
              />
            ) : null}
          </div>
        ))}
        {editGroup ? <UpdateGroupDialog feedGroup={editGroup} onOpenChange={setEditGroup} /> : null}
        {editFeed ? <UpdateFeedDialog groupId={editFeed.groupId} feed={editFeed.feed} onOpenChange={setEditFeed}  /> : null}
      </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  groupId: string;
  items: Feed[];
  onDelete: (groupId: string, feed: Feed) => void;
  onUpdate: (props: { groupId: string, feed: Feed }) => void;
  onSelectGroup: (groupId: string, feedUrl?: string) => void;
}

export function SidebarNavItems({
  groupId,
  items,
  onDelete,
  onUpdate,
  onSelectGroup,
}: DocsSidebarNavItemsProps) {
  const selectedFeedGroup = useStore((state) => state.selectedFeedGroup);
  
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-1">
      {items.map((item, index) =>
        <ContextMenu key={index}>
          <ContextMenuTrigger asChild>
            <Button
              className="truncate font-semibold flex-1 justify-start text-muted-foreground"
              onClick={() => onSelectGroup(groupId, item.feedUrl)}
              variant={selectedFeedGroup.feedUrl === item.feedUrl && selectedFeedGroup.groupId === groupId ? 'secondary' : 'ghost'}
            >
              {item.name}
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem onSelect={() => onUpdate({ groupId, feed: item })}>
              <div className="flex gap-2">
                <SquarePen size={18} />
                Edit
              </div>
            </ContextMenuItem>
            <ContextMenuItem
              destructive asChild onSelect={() => onDelete(groupId, item)}
            >
              <div className="flex gap-2">
                <Trash2Icon size={18} />
                Delete
              </div>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </div>
  ) : null
}
