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
    url: 'https://news.ycombinator.com/rss',
    blurUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABigAwAEAAAAAQAAABgAAAAAEQ8YrgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KGV7hBwAAA4hJREFUSA2dlstvTVEUxr9z21t9KOJRLYoSxONPEI2QMigNAxFjKmZGkqYd0gGJaBl4jAxMTKoYYEIMxEhCGYhESkm9q5pW6/ae47f2Pldvr3O1sZL9Xutb31prn0cgJDqqPYp0iulmWhA3hv+SEKvnoHQEl3QrcOBp3cSB9Is+MAclUqqaDabhD8YsLUGCNCrzOcA4HGI0bLoypWyijPamOOt04BmN/QGPAMx+xw4HqYVON7ELIJH9CjFaaOClppaC6KjTD3XSPG3Ck51WOsYGXrJE+snO12/S6GdMFjmSzijXGfg45xOwN9yyOnQmmRC9VIWTEMJbzEGueeAMOxW1UvsTqfuNtLNT+gjDOevMECGq0pXS5xFp11mp65N04il7eDGaQZnTonO41k1JFuUqgF71wXxYqgOo6ZBkaZ54BYEaAMh75q1EUNpxQFpAtIMDUj+tvAEnFjokYpnuwAptOV3MeHm7NMy8dpW0+5yEbwVksXSFnzedl5Ysl74MSlebvcMsKXPYBuRluoOApSnNXQ8rFB70eK1tLTBlOvmBxrlF1LjPnz3s9Q6rsAmJOo+9KUx3YEk0J5l3MOf05hHyT+h1q0nVGWlkHDBuV3O3Zz/YL/Uek5aiOzlEZzLF3lYFDmwLJ9EYRYURZHXvmm1S7IN+tEga9/v5Xc4Mt5znM8ttSxB3cRP2YfSRKLh6t9qkraSoYaO0vYMISXINuX/9QrrBun4NF4D5VF2nwSVEYOdoZ8ln6TxGlrcveaOWVtJz2M97LxClTbn7LivJHoo4wMKYTryUlm2Q7nRJfY9hXk9UXN1nj6T7F6nDWn9lrW4FufcsEmuQO4rHLEm2t0XPaaKB7eQvio9DglNIrYyIe8Ji/YKheA2Mkbu2PAAVMBzoISIeooj999cpLEiRPfYuPwWwU8siKcop2LXlybUXWRl7KdSNcZois+UI5FSLjDM4sPBjhgaYk8heB7OTGRwUgFh6nJhjJLf0q8R+Fg5iMDO3mriixlh5R4nobFqRjcc/VPNohjwUf6KILRn+Jd6Bd5HghAP3AQLCatB9nI69DO8jswztXVJEIhQDhUHUqj6ltYWvmlWuIlk99j0aR1NlWrYXr/82GuPWVfJVe2bf5Db3yks78Py7kmdmQLRqPhTWnBQFDyHMhwOJ1J4Krui2xvltyfCr4aWopcIvpIU2k2TIyoT2GPZvFkAMU3Hodh8AAAAASUVORK5CYII='
  },
  {
    title: 'The Guardian',
    description: "#News",
    icon: "/guardian.png",
    iconAlt: "The Guardian logo",
    url: 'https://www.theguardian.com/uk/rss',
    blurUrl: 'data:image/png;base64,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'
  },
  {
    title: 'Forbes',
    description: "#Finance",
    icon: "/forbes.png",
    iconAlt: "Forbes logo",
    url: 'https://www.forbes.com/real-time/feed2',
    blurUrl: 'data:image/png;base64,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',
  },
  {
    title: 'Nature',
    description: "#Science",
    icon: "/nature.png",
    iconAlt: "Nature logo",
    url: 'https://www.nature.com/nmat.rss',
    blurUrl: 'data:image/png;base64,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'
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
                blurDataURL={suggestion.blurUrl}
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
