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
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import Image from 'next/image'

import { useStore } from "@/lib/store"

const suggestions = [
  {
    title: 'Hacker News',
    description: "#Technology",
    icon: "/hackernews.png",
    iconAlt: "Hacker News logo",
    url: 'https://news.ycombinator.com/rss'
  },
  {
    title: 'The Guardian',
    description: "#News",
    icon: "/guardian.png",
    iconAlt: "The Guardian logo",
    url: 'https://www.theguardian.com/uk/rss'
  },
  {
    title: 'Forbes',
    description: "#Finance",
    icon: "/forbes.png",
    iconAlt: "Forbes logo",
    url: 'https://www.forbes.com/real-time/feed2'
  },
  {
    title: 'Nature',
    description: "#Science",
    icon: "/nature.png",
    iconAlt: "Nature logo",
    url: 'https://www.nature.com/nmat.rss'
  }
]

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  feedUrl: z.string().trim().url(),
})

type FormSchema = z.infer<typeof formSchema>;

export function AddFeedButton({
  groupId,
  asIcon = true,
  withSuggestions = false,
}: { groupId: string; asIcon?: boolean; withSuggestions?: boolean}) {
  const [open, setOpen] = useState(false);
  const addFeedToGroup = useStore((state) => state.addFeedToGroup)
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      feedUrl: '',
    }
  })

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const error = addFeedToGroup(groupId, data);

    if (error) {
      form.setError('feedUrl', { message: error.message })
      return;
    }

    form.reset();
    setOpen(false)
  }

  const onSuggestionSelect = (suggestion: typeof suggestions[number]) => {
    form.setValue('feedUrl', suggestion.url, { shouldDirty: true });
    form.setValue('name', suggestion.title, { shouldDirty: true });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={asIcon ? 'outline' : 'default'}
          size={asIcon ? 'tinyicon' : 'default'}
          className="shrink-0"
        >
          {asIcon ? <PlusIcon size={12} /> : 'Add Feed'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Feed</DialogTitle>
          <DialogDescription>
            Add a new url to view it in your feed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="createGroupForm"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="feedUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Feed URL" aria-label="Feed url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

        {withSuggestions && (<div className="grid grid-cols-2 grid-rows-2 gap-2">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion.url}
              onClick={() => onSuggestionSelect(suggestion)}
              className="flex gap-2 p-2 items-center rounded-md border bg-card text-card-foreground shadow-sm transition ease-in-out hover:scale-105"
            >
              <Image
                src={suggestion.icon}
                alt={suggestion.iconAlt}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAF9JREFUWEft0rENwCAQBEG+/95oxA04M0VsgqwhXwnN37zP/tbFb3wwXodgBFwECVaB2tsgwSpQexskWAVqb4MEq0DtbZBgFai9DRKsArW3QYJVoPY2SLAK1N4Gfy94AMPuk6mAwMJzAAAAAElFTkSuQmCC"
                width={40}
                height={40}
              />
              <div>
                <h3 className="font-bold text-left">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground text-left">{suggestion.description}</p>
              </div>
            </button>
          ))}
        </div>)}
        <DialogFooter>
          <Button
            className="w-full mt-2"
            type="submit"
            form="createGroupForm"
            disabled={!form.formState.isDirty}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
