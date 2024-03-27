'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import { useFeedGroupCsvExport } from "@/lib/useFeedGroupCsvExport"
import { useBookmarksCsvExport } from "@/lib/useBookmarksCsvExport"
import { ShareFeedsForm } from "./share-feeds-form"
import Link from "next/link"

const formSchema = z.object({
  maxEntriesShown: z.coerce.number().min(0).max(MAX_FEED_LENGTH),
  sort: z.enum(['default', 'newest']),
})

type FormSchema = z.infer<typeof formSchema>;

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const updateMaxEntriesShown = useStore((state) => state.updateMaxEntriesShown);
  const updateSorting = useStore((state) => state.updateSorting);
  const { feedGroupsPresent, exportFeedGroupCsv } = useFeedGroupCsvExport();
  const { bookmarksPresent, exportBookmarksCsv } = useBookmarksCsvExport();
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
      <DialogContent className="flex flex-col sm:max-w-[425px] min-h-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="general">

            <Form {...form}>
              <form
                id="createGroupForm"
                className="grid gap-4"
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

            <Button
              className="w-full mt-6"
              type="submit"
              form="createGroupForm"
              disabled={!form.formState.isDirty}
            >
              Save
            </Button>
          </TabsContent>

          <TabsContent value="share">
            <p className="text-muted-foreground mb-6">
              Share your feed groups and bookmarks. You can also share single groups by right clicking on them.
            </p>
            <ShareFeedsForm />
          </TabsContent>

          <TabsContent value="export">
            <p className="text-muted-foreground mb-6">
              Export your feed groups and bookmarks to a CSV file for backup purposes
              or to <Link href="/import" className="underline">import</Link> them to stille or another tool.
            </p>
            {exportFeedGroupCsv && (
              <Button
                className="w-full"
                type="button"
                size="sm"
                onClick={exportFeedGroupCsv}
                disabled={!feedGroupsPresent}
              >
                Export Feed Groups CSV
              </Button>
            )}
            <p className="w-full text-center my-4">or</p>
            {exportBookmarksCsv && (
              <Button
                className="w-full"
                type="button"
                size="sm"
                onClick={exportBookmarksCsv}
                disabled={!bookmarksPresent}
              >
                Export Bookmarks CSV
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
