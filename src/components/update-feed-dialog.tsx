'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { type Feed, useStore } from "@/lib/store"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

type FormSchema = z.infer<typeof formSchema>;

type UpdateFeedDialogProps = {
  groupId: string;
  feed: Feed;
  onOpenChange: (props?: { groupId: string, feed: Feed }) => void
}

export function UpdateFeedDialog({
  groupId,
  feed,
  onOpenChange,
}: UpdateFeedDialogProps) {
  const updateFeed = useStore((state) => state.updateFeed);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: feed?.name ?? '',
    }
  })

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (!feed) return;

    updateFeed(groupId, feed, data);
    onOpenChange(undefined);
  }

  const open = !!groupId && !!feed;

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open ? { groupId, feed } : undefined)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit feed</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="createGroupForm"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" aria-label="Feed name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {feed?.feedUrl ? <Input value={feed.feedUrl} placeholder="Url" aria-label="Feed url" disabled /> : null}
          </form>
        </Form>
        <DialogFooter>
          <Button
            className="w-full mt-2"
            type="submit"
            form="createGroupForm"
            disabled={!form.formState.isDirty}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
