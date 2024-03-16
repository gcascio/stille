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
import { type FeedGroup, useStore } from "@/lib/store"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

type FormSchema = z.infer<typeof formSchema>;

type UpdateGroupDialogProps = {
  feedGroup?: FeedGroup;
  onOpenChange: (feedGroup?: FeedGroup) => void
}

export function UpdateGroupDialog({
  feedGroup,
  onOpenChange,
}: UpdateGroupDialogProps) {
  const updateFeedGroup = useStore((state) => state.updateFeedGroup);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: feedGroup?.name ?? '',
    }
  })

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (!feedGroup) return;

    updateFeedGroup(feedGroup.id, data);
    onOpenChange();
  }

  return (
    <Dialog open={!!feedGroup} onOpenChange={(open) => onOpenChange(open ? feedGroup : undefined)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit group</DialogTitle>
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
                    <Input placeholder="Name" aria-label="Group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
