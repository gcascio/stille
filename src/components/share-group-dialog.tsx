'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type FeedGroup } from "@/lib/store"
import { ShareFeedsForm } from "./share-feeds-form"

type ShareGroupDialogProps = {
  feedGroup?: FeedGroup;
  onOpenChange: (feedGroup?: FeedGroup) => void
}

export const ShareGroupDialog = ({
  feedGroup,
  onOpenChange,
}: ShareGroupDialogProps) => (
  <Dialog open={!!feedGroup} onOpenChange={(open) => onOpenChange(open ? feedGroup : undefined)}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Share group</DialogTitle>
      </DialogHeader>
      <p className="text-muted-foreground">
        Share your feed groups and bookmarks. You can also share all groups at once in the settings.
      </p>
      <ShareFeedsForm groupId={feedGroup?.id} />
    </DialogContent>
  </Dialog>
)
