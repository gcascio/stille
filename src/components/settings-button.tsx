'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { MAX_FEED_LENGTH } from "@/constants"
import { SettingsIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const formSchema = z.object({
  maxEntriesShown: z.coerce.number().min(0).max(MAX_FEED_LENGTH),
  sort: z.enum(['default', 'newest']),
})

type FormSchema = z.infer<typeof formSchema>;

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const updateMaxEntriesShown = useStore((state) => state.updateMaxEntriesShown);
  const updateSorting = useStore((state) => state.updateSorting);
  const maxEntriesShown = useStore((state) => state.settings.maxEntriesShown);
  const sort = useStore((state) => state.settings.sort);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      maxEntriesShown,
      sort,
    }
  })

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    updateMaxEntriesShown(data.maxEntriesShown);
    updateSorting(data.sort)
    form.reset();
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="smicon" variant="ghost" className="flex-shrink-0 text-muted-foreground">
          <SettingsIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Adjust the way you like to to organize your feeds.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="createGroupForm"
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sorting of feed groups</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sorting" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="newest">Newest first</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxEntriesShown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max feeds shown in group</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={MAX_FEED_LENGTH}
                      placeholder="Max entries shown"
                      aria-label="Max entries shown"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="createGroupForm">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
